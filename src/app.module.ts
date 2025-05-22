import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

import { Task } from './task/task.entity';
import { TaskModule } from './task/task.module';
import { UserModule } from './user/user.module';
import { User } from './user/user.entity';
import { MailModule } from './mail/mail.module';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306', 10) || 3306,
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || 'Node@12',
      database: process.env.DB_NAME || 'test_db',
      entities: [Task, User],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Task, User]),
    TaskModule,
    UserModule,
    MailModule
  ],
})
export class AppModule {}
