import { Client, Databases, Query, Models } from "node-appwrite";
import nodemailer from "nodemailer";
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

// Nodemailer 
const nodemailerTransporter = nodemailer.createTransport({
  host: "smtp.zoho.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.PROJECT_EMAIL_ADDRESS,
    pass: process.env.PROJECT_EMAIL_PASSWORD,
  },
});

// async..await is not allowed in global scope, must use a wrapper
async function sendMails(userBirthdayList: UserBirthdays) {
  // send mail with defined transport object
  const info = await nodemailerTransporter.sendMail({
    from: `"Memora App" ${process.env.PROJECT_EMAIL_ADDRESS}`, // sender address
    to: userBirthdayList.email, // list of receivers
    subject: "Today's Birthday Names", // Subject line
    text: `Hey there, today is ${userBirthdayList.birthdays.join(
      ", "
    )} birthday. Don't forget to wish them a happy birthday 🎉`, // plain text body
    html: `<p>Hey there, today is <b>${userBirthdayList.birthdays.join(
      ", "
    )} birthday</b>. Don't forget to wish them a happy birthday 🎉</p>`, // html body
  });

  // console.log(`Message sent: %s ${info.messageId}`);
  return info;
}

// This is your Appwrite function
export default async ({req, res, log, error}: Context) => {
  try {
  
    const currentDate = changeDateToString(new Date());
  
    const currentBirthdays: UserBirthdays[] = [];
  
    const client = new Client()
      .setEndpoint("https://cloud.appwrite.io/v1")
      .setProject(process.env.APPWRITE_PROJECT_ID)
      .setKey(process.env.APPWRITE_API_KEY);
  
    const db = new Databases(client);
  
    const { total, documents: databaseBirthdays } =
      await db.listDocuments<BirthdayCol>(
        process.env.APPWRITE_MEMORA_DB_ID,
        process.env.APPWRITE_BIRTHDAYS_COL_ID,
        [Query.equal("person_birthday", currentDate)]
      );
  
    if (total > 0) {
      databaseBirthdays.forEach((doc) => {
        // Check if user exists in the currentBirthdays array
        const userBirthdayIndex = currentBirthdays.findIndex(
          (birthday) => birthday.userId === doc.user_id
        );
  
        // user is not in array
        if (userBirthdayIndex === -1) {
          currentBirthdays.push({
            userId: doc.user_id,
            email: doc.user_email,
            birthdays: [doc.person_name],
          });
        } else {
          // Add the person name to the birthdays list of the user
          currentBirthdays[userBirthdayIndex].birthdays.push(doc.person_name);
        }
      });
  
      // TODO: Send mail to the user informing them of the birthdays
      currentBirthdays.forEach(async (birthday) => {
        const mailInfo = await sendMails(birthday);
  
        log(`Message sent: %s ${mailInfo.messageId}`);
      })
    }
    log(currentDate);
    log(currentBirthdays);
  
    return res.empty();
  } catch (e: any) {
    error(`An error happened, ${e}`);
  }
};
