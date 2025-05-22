import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  async sendMail(to: string, code: number): Promise<void> {
    const mailOptions = {
      from: `"dummysharma958@gmail.com"`,
      to,
      subject: 'Your OTP Code',
      html: `
        <h3>OTP Verification</h3>
        <p>Your OTP code is: <b>${code}</b></p>
        <p>This code will expire in 5 minutes.</p>
       
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
