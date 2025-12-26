import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, SignupDto } from './dto';
import { UserRole } from '../common';
import { VerifyOtpDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('signup')
  signup(@Body() dto: SignupDto, @Query('role') role: UserRole) {
    return this.authService.signup(dto, role);
  }

  @Post('otpVerify')
  verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtp(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  passwordLogin(@Body() dto: LoginDto) {
    return this.authService.passwordLogin(dto);
  }
}
