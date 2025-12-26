import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Otp, User } from '../database/schema';
import mongoose, { Model } from 'mongoose';
import { LoginDto, SignupDto, VerifyOtpDto } from './dto';
import { IAppResponse, UserRole } from '../common';
import { generateRandomDigits } from '../common/utils';
import { EmailService } from '../email/email.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Otp.name) private otpModel: Model<Otp>,
    private emailService: EmailService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(dto: SignupDto, role: UserRole): Promise<IAppResponse> {
    const { password, firstName, ...userData } = dto;
    this.logger.log(`Check if user already exists`);
    const emailExists = await this.userModel.findOne({ email: dto.email });

    if (emailExists) throw new NotFoundException('Email already exists');

    let referredBy: mongoose.Types.ObjectId | null = null;
    if (role === UserRole.AGENT && dto.refCode) {
      const refUser = await this.getUserFromRef(dto.refCode);
      this.logger.log(`Satisfies referred by ${dto.refCode}, user: ${refUser}`);
      referredBy = refUser?.id || null;
    }

    try {
      this.logger.log(`creating user`);
      const newUser = await this.userModel.create({
        hash: password,
        role,
        firstName,
        ...userData,
        code: firstName + generateRandomDigits(4),
        referredBy,
      });

      if (!newUser)
        throw new InternalServerErrorException(
          'An Error Occurred While Creating User',
        );

      this.logger.log(`generating otp`);
      const otp = await this.otpModel.create({
        userId: newUser.id,
        otp: generateRandomDigits(6),
      });

      if (!otp)
        throw new InternalServerErrorException(
          'An Error Occurred While Creating User',
        );

      await this.emailService.sendOtp(dto.email, dto.firstName, otp.otp);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      this.logger.error(error);
    }
    this.logger.log('send verification mail');
    return {
      statusCode: HttpStatus.CREATED,
      message: `User Created Successfully, verification mail sent to ${dto.email}`,
    };
  }

  async verifyOtp(dto: VerifyOtpDto): Promise<IAppResponse> {
    const otpFound = await this.otpModel.findOne({ otp: dto.otp });
    //add time verification

    if (!otpFound)
      throw new BadRequestException(
        'Invalid or expired OTP. Please enter a valid OTP or request a new one if yours has expired.',
      );
    const updatedUser = await this.userModel.findByIdAndUpdate(
      otpFound.userId,
      { isVerified: true },
    );
    if (!updatedUser) throw new InternalServerErrorException('User not found');

    await this.otpModel.findByIdAndDelete(otpFound.id);

    await this.emailService.welcome(updatedUser.email, updatedUser.firstName);
    return {
      statusCode: HttpStatus.OK,
      message: `Email Verified Successfully`,
    };
  }

  async passwordLogin(dto: LoginDto): Promise<IAppResponse> {
    const userFound = await this.userModel.findOne({ email: dto.email });
    if (!userFound || !(await argon.verify(userFound.hash, dto.password)))
      throw new NotFoundException('Invalid Email or Password');

    return {
      statusCode: HttpStatus.OK,
      message: `User Login Successfully`,
      data: {
        token: await this.signToken(
          userFound.id,
          userFound.email,
          userFound.role,
        ),
        role: userFound.role,
      },
    };
  }

  private async signToken(
    id: mongoose.Types.ObjectId,
    email: string,
    role: string,
  ): Promise<string> {
    return await this.jwt.signAsync({
      sub: id.toString(),
      email,
      role,
    });
  }

  private async getUserFromRef(refCode: string): Promise<User | null> {
    return this.userModel.findOne({ code: refCode });
  }
}
