import mailer from 'nodemailer';
import { SMTP_FROM, SMTP_USER, SMTP_PASS } from 'data/config.private';

export default function (mail) {
  mail.from = SMTP_FROM;

  const smtpTransport = mailer.createTransport({
    service: 'gmail',
    port: 465,
    secure: true,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  return new Promise((resolve, reject) => {
    smtpTransport.sendMail(mail, (error, response) => {
      if (error) {
        reject(error || 'Error sending email');
      } else {
        resolve(true);
      }

      smtpTransport.close();
    });
  });
}
