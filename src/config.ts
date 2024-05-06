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
  birthdayReminderNotificationId: process.env.COURIER_BIRTHDAY_NOTIFICATION_ID,
  welcomeNotificationId: process.env.COURIER_WELCOME_EMAIL_NOTIFICATION_ID,
  authToken: process.env.COURIER_AUTH_TOKEN,
};

const APPWRITE = {
  projectId: process.env.APPWRITE_PROJECT_ID,
  apiKey: process.env.APPWRITE_API_KEY,
  memoraDBId: process.env.APPWRITE_MEMORA_DB_ID,
  birthdaysColId: process.env.APPWRITE_BIRTHDAYS_COL_ID,
};

export const config = { COURIER, DEV_EMAILING_CONFIG, IS_LOCAL, APPWRITE };
