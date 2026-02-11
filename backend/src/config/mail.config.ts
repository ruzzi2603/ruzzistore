import { Injectable } from '@nestjs/common';

@Injectable()
export class MailConfig {
host: string = process.env.MAIL_HOST || '';
user: string = process.env.MAIL_USER || '';
password: string = process.env.MAIL_PASSWORD || '';

}