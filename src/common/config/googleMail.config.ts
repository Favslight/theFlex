import { createTransport } from 'nodemailer';
import { google } from 'googleapis';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

const OAuth2 = google.auth.OAuth2;

const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, REFRESH_TOKEN, SENDING_MAIL } =
  process.env;

const oauth2Client = new OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oauth2Client.setCredentials({
  refresh_token: REFRESH_TOKEN,
});

export const mailTransport = async (
  from: string,
  to: string,
  subject: string,
  html: any,
  optional?: {
    attachments?: any;
    smtpConfig?: boolean;
  },
) => {
  const accessToken = await oauth2Client.getAccessToken();
  const { attachments, smtpConfig } = optional || {};
  const smtpTransportOptions: SMTPTransport.Options = {
    service: 'gmail',
    auth: smtpConfig
      ? {
          user: SENDING_MAIL,
          pass: process.env.PASS,
        }
      : {
          type: 'OAuth2',
          user: SENDING_MAIL,
          clientId: CLIENT_ID,
          clientSecret: CLIENT_SECRET,
          refreshToken: REFRESH_TOKEN,
          accessToken: accessToken.token!,
        },
    tls: {
      rejectUnauthorized: false,
    },
  };

  const smtpTransport = createTransport(smtpTransportOptions);

  const mailOptions = {
    from: `NIFT<${from}>`,
    to,
    subject,
    html,
    attachments,
  };

  try {
    const info = await smtpTransport.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error(`Error sending mail to ${to}: ${error}`);
    throw error;
  }
};
