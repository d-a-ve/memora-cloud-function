declare global {
  namespace NodeJS {
    interface ProcessEnv {
      APPWRITE_API_KEY: string;
      APPWRITE_PROJECT_ID: string;
      APPWRITE_MEMORA_DB_ID: string;
      APPWRITE_BIRTHDAYS_COL_ID: string;
      PROJECT_EMAIL_ADDRESS: string;
      PROJECT_EMAIL_PASSWORD: string;
      MAILTRAP_TEST_USERNAME: string;
      MAILTRAP_TEST_PASSWORD: string;
      COURIER_AUTH_TOKEN: string;
      COURIER_BIRTHDAY_NOTIFICATION_ID: string;
    }
  }
}

export {};
