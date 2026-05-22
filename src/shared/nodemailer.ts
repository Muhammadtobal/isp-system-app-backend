import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: `${process.env.MAIL_USER}`,
      pass: `${process.env.MAIL_PASS}`,
    },
  });

  async sendResetPasswordEmail(email: string, link: string) {
    await this.transporter.sendMail({
      to: email,
      subject: 'Reset Password',
      html: `
        <h3>Reset your password</h3>
        <p>Click the link below:</p>
        <a href="${link}">${link}</a>
      `,
    });
  }
}
