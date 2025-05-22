import { IsEmail, MinLength } from 'class-validator';

export class SignInDto {
  name: string;

  email: string;

  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;
}

export class verifyDto {
  @IsEmail()
  email: string;
}
