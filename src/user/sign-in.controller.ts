import { Body, Controller, Post, NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { SignInDto } from 'src/dto/sign-in.dto';

@Controller('signin')
export class SignInController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async signIn(@Body() signInDto: SignInDto) {
    const { email, password } = signInDto;

    const user = await this.userService.validateUser(email, password);

    if (!user) {
      throw new NotFoundException('Invalid credentials');
    }

    return {
      message: 'Sign-in successful',
      userId: user.id,
      email: user.email,
    };
  }
}
