import {
  UserBirthdays,
  getUserById,
  listBirthdayDocuments,
} from "./appwrite.js";
import { config } from "./config.js";
import { sendMailwithCourier } from "./courier.js";
import { sendMailWithNodemailer } from "./nodemailer.js";

type Context = {
  req: any;
  res: any;
  log: (msg: any) => void;
  error: (msg: any) => void;
};

export default async ({ res, log }: Context) => {
  try {
    const currentBirthdays: UserBirthdays[] = [];
    const { total, documents: databaseBirthdays } =
      await listBirthdayDocuments();

    if (total < 1) {
      return res.send("No birthdays found");
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

    for (let birthday of currentBirthdays) {
      log(`Message about to be sent to ${birthday.email}`);

      if (config.IS_LOCAL) {
        const mailInfo = await sendMailWithNodemailer(birthday);
        log(`Message sent: ${mailInfo.messageId}`);
        return;
      }
      const user = await getUserById(birthday.userId);

      const mailInfo = await sendMailwithCourier(birthday, user.name);
      log(`Message sent: ${mailInfo}`);
    }

    log({ "length of currentBirthdays": currentBirthdays.length });
    return res.send("Birthdays sent successfully");
  } catch (e: any) {
    log(`ERROR: An error happened, ${e}`);
    return res.send("An error happened, check the logs for more info");
  }
};
