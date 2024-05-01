import { CourierClient } from "@trycourier/courier";
import { Client, Databases, Models, Query, Users } from "node-appwrite";
import nodemailer from "nodemailer";
import { config } from "./config.js";
import { changeDateToString } from "./utils.js";

const courier = new CourierClient({
  authorizationToken: config.COURIER.authToken,
});

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
  user_id: string;
};

// Nodemailer
const nodemailerTransporter = nodemailer.createTransport(
  config.DEV_EMAILING_CONFIG
);

// async..await is not allowed in global scope, must use a wrapper
async function sendMails(userBirthdayList: UserBirthdays) {
  // send mail with defined transport object
  const info = await nodemailerTransporter.sendMail({
    from: process.env.PROJECT_EMAIL_ADDRESS, // sender address
    to: userBirthdayList.email, // list of receivers
    subject: "Today's Birthday Names", // Subject line
    text: `Hey there, today is ${userBirthdayList.birthdays.join(
      ", "
    )} birthday. Don't forget to wish them a happy birthday 🎉`, // plain text body
    html: `<p>Hey there, today is <b>${userBirthdayList.birthdays.join(
      ", "
    )} birthday</b>. Don't forget to wish them a happy birthday 🎉</p>`, // html body
  });

  return info;
}

// async..await is not allowed in global scope, must use a wrapper
async function sendMailswithCourier<TUserName>(
  userBirthdayList: UserBirthdays,
  userName: TUserName
) {
  const birthday = userBirthdayList.birthdays.join(", ");

  const { requestId } = await courier.send({
    message: {
      template: config.COURIER.notificationId,
      to: {
        email: "davearonmwan@gmail.com",
      },
      data: {
        dashboard: "www.memora-tau.vercel.app",
        birthdayNames: birthday,
        recipientName: userName,
      },
    },
  });

  return requestId;
}

// This is your Appwrite function
export default async ({ req, res, log, error }: Context) => {
  try {
    const body = req.body;

    log(body);
    log(config.IS_LOCAL);

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

    log(total);
    log(currentDate);
    if (!(total > 0)) {
      log("No birthdays found but this will not run");
      return res.empty();
    }

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
        return;
      }

      // Add the person name to the birthdays list of the user
      currentBirthdays[userBirthdayIndex].birthdays.push(doc.person_name);
    });

    // // TODO: Send mail to the user informing them of the birthdays
    for (let birthday of currentBirthdays) {
      log(`Message about to be sent to ${birthday.email}`);
      const users = new Users(client);
      const userName = await users.get(birthday.userId);
      const mailInfo = await sendMailswithCourier(birthday, userName);
      log(`Message sent: ${mailInfo}`);
      // const mailInfo = await sendMails(birthday);
      // log(`Message sent: ${mailInfo.messageId}`);
    }

    log(currentDate);
    log(currentBirthdays);
    // return res.send("Birthdays seen");
    return res.send("Birthdays sent successfully");
  } catch (e: any) {
    log(`ERROR: An error happened, ${e}`);
    return res.send("An error happened, check the logs for more info");
  }
};
