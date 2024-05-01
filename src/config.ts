const IS_LOCAL = process.env.PURPOSE === "dev";

const DEV_EMAILING_CONFIG = {
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_TEST_USERNAME,
    pass: process.env.MAILTRAP_TEST_PASSWORD,
  },
  debug: true,
  logger: true,
};

const COURIER = {
  notificationId: process.env.COURIER_BIRTHDAY_NOTIFICATION_ID,
  authToken: process.env.COURIER_AUTH_TOKEN,
};

export const config = { COURIER, DEV_EMAILING_CONFIG, IS_LOCAL };
