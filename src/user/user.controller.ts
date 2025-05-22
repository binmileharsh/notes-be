import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Patch,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { verifyDto } from 'src/dto/sign-in.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() userData: Partial<User>) {
    return await this.userService.create(userData);
  }

  @Get()
  async findAll() {
    return await this.userService.findAll();
  }

  @Get('verify')
  async findOneWithEmail(@Query() payload: verifyDto) {
    console.log('Query param email:', payload.email);
    if (!payload.email) {
      throw new BadRequestException('Email is required');
    }
    return await this.userService.findOneWithEmail(payload.email);
    
  }
  
  
  @Post('verify')
  async verifyEmailOfUser(@Body() payload: { email: string; otp: string }) {
    console.log(payload);
    if (!payload) {
      throw new BadRequestException('Email is required');
    }
    return await this.userService.verifyEmailOfUser(payload);
  }
  @Get('profile/:id')
  async findOne(@Param('id') id: string) {
    console.log(id);
    return await this.userService.findOne(id);
  }
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateData: Partial<User>) {
    console.log(id);
    return await this.userService.update(id, updateData);
  }

  @Post('reset-password')
  async resetPassword(@Body() resetData: { email: string }) {
    const link = await this.userService.resetPassword(resetData.email);
    return link;
  }

  @Patch('reset-password/:email')
  async resetPasswordWithEmail(
    @Param('email') email: string,
    @Body() updateData: { password: string; email: string },
  ) {
    const password = updateData.password;
    return await this.userService.updateEmailPassword(email, password);
  }

  @Patch(':email')
  async updateEmail(
    @Param('email') email: string,
    @Body() updateData: Partial<User>,
  ) {
    console.log(email);
    return await this.userService.updateEmail(email, updateData);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.userService.delete(id);
  }
}
