import { Client, Databases, Query } from "node-appwrite";

type Context = {
  req: any;
  res: any;
  log: (msg: any) => void;
  error: (msg: any) => void;
};

type UserBirthdays = {
  userId: string;
  birthdays: string[];
};

// This is your Appwrite function
// It's executed each time we get a request
export default async ({ req, res, log, error }: Context) => {
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  const currentBirthdays: UserBirthdays[] = [];

  const client = new Client()
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const db = new Databases(client);

  const databaseBirthdays = await db.listDocuments(
    process.env.APPWRITE_MEMORA_DB_ID,
    process.env.APPWRITE_BIRTHDAYS_COL_ID,
    [Query.equal("person_birthday", currentDate.toUTCString())]
  );

  log(databaseBirthdays);
  // You can log messages to the console
  log("Hello, Logs!");

  // If something goes wrong, log an error
  error("Hello, Errors!");

  return res.empty()
};
