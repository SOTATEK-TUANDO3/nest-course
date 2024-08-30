import { registerAs } from '@nestjs/config';

export default registerAs('mailer', () => ({
  sender: process.env.MAILER_SENDER,
  user: process.env.MAILER_USER,
  password: process.env.MAILER_PASS,
}));
