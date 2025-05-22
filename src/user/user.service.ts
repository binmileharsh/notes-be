import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly mailService: MailService, 
  ) {}

  async create(userData: Partial<User>): Promise<User> {
    const user = this.userRepository.create(userData);
    return await this.userRepository.save(user);
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      return null;
    }

    if (user.password === password) {
      return user;
    }

    return null;
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: +id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async verifyEmailOfUser(payload): Promise<{ message: string }> {
    const email = payload.email;
    const otp = payload.otp;
    console.log('email', email);
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new NotFoundException('User not found');
    if (user.code !== parseInt(otp)) {
      throw new NotFoundException('Invalid OTP');
    }

    await this.userRepository.save(user);
    return { message: 'Email verified successfully' };
  }
  async resetPassword(email: string): Promise<{ code: number; email: string }> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) throw new NotFoundException('User not found');
    const code = Math.floor(100000 + Math.random() * 900000);
    const now = new Date();
    if (!user.expiresAt) {
      const expiresAt = new Date(now.getTime() + 5 * 60 * 1000);
      user.expiresAt = expiresAt;
    }
    user.code = code;
    await this.userRepository.save(user);
    console.log(user);
    const text= `Your OTP is ${code}. It will expire in 5 minutes.`;
    await this.mailService.sendMail(email,code);

    return { code, email };
  }
  async update(id: string, updateData: Partial<User>): Promise<User> {
    const user = await this.findOne(id);
    Object.assign(user, updateData);
    return await this.userRepository.save(user);
  }
  async findOneWithEmail(email: string): Promise<User> {
    console.log('email.......', email);
    const user = await this.userRepository.findOne({ where: { email: email } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
  async updateEmail(email: string, updateData: Partial<User>): Promise<User> {
    const user = await this.findOne(email);
    if (!user) throw new NotFoundException('User not found');
    Object.assign(user.password, updateData.password);
    return await this.userRepository.save(user);
  }
  async updateEmailPassword(
    email: string,
    password: string,
  ): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new NotFoundException('User not found');
    user.password = password;
    await this.userRepository.save(user);
    return { message: 'Password updated successfully' };
  }
  async delete(id: string): Promise<{ message: string }> {
    const result = await this.userRepository.delete(+id);
    console.log(result);
    return { message: 'User deleted successfully' };
  }
}
