import { Client, Databases, Query, Models } from "node-appwrite";
import { changeDateToString } from "./utils.js";

type Context = {
  req: any;
  res: any;
  log: (msg: any) => void;
  error: (msg: any) => void;
};

type UserBirthdays = {
  userId: string;
  email: string;
  birthdays: string[];
};

type BirthdayCol = Models.Document & {
  person_name: string;
  person_birthday: string;
  user_email: string;
  user_id: string
}

// This is your Appwrite function
// It's executed each time we get a request
export default async ({ req, res, log, error }: Context) => {
  const currentDate = changeDateToString(new Date());

  const currentBirthdays: UserBirthdays[] = [];

  const client = new Client()
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const db = new Databases(client);

  const {total, documents: databaseBirthdays} = await db.listDocuments<BirthdayCol>(
    process.env.APPWRITE_MEMORA_DB_ID,
    process.env.APPWRITE_BIRTHDAYS_COL_ID,
    [Query.equal("person_birthday", currentDate)]
  );

  if(total > 0) {
    databaseBirthdays.forEach((doc) => {
      const userBirthdayIndex = currentBirthdays.findIndex((birthday) => birthday.userId === doc.user_id)

      // user is not in array
      if(userBirthdayIndex === -1) {
        currentBirthdays.push({
          userId: doc.user_id,
          email: doc.user_email,
          birthdays: [doc.person_name]
        })
      } else {
        // Add the person name to the birthdays list of the user
        currentBirthdays[userBirthdayIndex].birthdays.push(doc.person_name)
      }
    })
  
    // TODO: Send mail to the user informing them of the birthdays
  }
  log(currentDate);
  log(currentBirthdays);

  return res.empty()
};

