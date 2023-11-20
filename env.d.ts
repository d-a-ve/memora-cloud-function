declare global {
    namespace NodeJS {
        interface ProcessEnv {
          APPWRITE_API_KEY: string;
          APPWRITE_PROJECT_ID: string;
          APPWRITE_MEMORA_DB_ID: string;
          APPWRITE_BIRTHDAYS_COL_ID: string;
          PROJECT_EMAIL_ADDRESS: string;
          PROJECT_EMAIL_PASSWORD: string;
        }
    }
}

export {};