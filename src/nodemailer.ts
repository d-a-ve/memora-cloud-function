import nodemailer from "nodemailer";
import { UserBirthdays } from "./appwrite.js";
import { config } from "./config.js";
import { arrayToCommaSeparatedString } from "./utils.js";

const nodemailerTransporter = nodemailer.createTransport(
  config.DEV_EMAILING_CONFIG
);

export async function sendMailWithNodemailer(userBirthdayList: UserBirthdays) {
  const names = arrayToCommaSeparatedString(userBirthdayList.birthdays);

  // send mail with defined transport object
  const info = await nodemailerTransporter.sendMail({
    // this does not matter as it will be trapped by mailtrap
    from: '"Birthday Reminder" <memora.vercel.app>',
    to: userBirthdayList.email, // list of receivers
    subject: "Today's Birthday Names", // Subject line
    text: `Hey there, today is ${names} birthday. Don't forget to wish them a happy birthday 🎉`, // plain text body
    html: `<p>Hey there, today is <b>${names} birthday</b>. Don't forget to wish them a happy birthday 🎉</p>`, // html body
  });

  return info;
}
