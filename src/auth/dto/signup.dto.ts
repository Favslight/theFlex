import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class SignupDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @Transform(({ value }) => value?.toLowerCase().trim())
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,64}$/gm, {
    message:
      'Password Must Contain at Least One Uppercase Letter and One Lowercase Letter',
  })
  password: string;

  @IsDateString()
  dob?: string;

  @IsString()
  @IsOptional()
  refCode?: string;
}
