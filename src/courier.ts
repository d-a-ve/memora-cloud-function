import { CourierClient } from "@trycourier/courier";
import { UserBirthdays } from "./appwrite.js";
import { config } from "./config.js";
import { arrayToCommaSeparatedString } from "./utils.js";

const courier = new CourierClient({
  authorizationToken: config.COURIER.authToken,
});

export async function sendBirthdayReminderMailWithCourier(
  userBirthdayList: UserBirthdays,
  { name, email }: { name: string; email: string }
) {
  const birthday = arrayToCommaSeparatedString(userBirthdayList.birthdays);

  const { requestId } = await courier.send({
    message: {
      template: config.COURIER.birthdayReminderNotificationId,
      to: {
        email: email,
      },
      data: {
        birthdayNames: birthday,
        recipientName: name,
      },
    },
  });

  return requestId;
}

export async function sendWelcomeMailWithCourier(
  { name, email }: { name: string; email: string }
) {
  const { requestId } = await courier.send({
    message: {
      to: {
        email: email,
      },
      template: config.COURIER.welcomeNotificationId,
      data: {
        name: name,
      },
    },
  });

  return requestId;
}