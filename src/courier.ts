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

export async function sendWelcomeMailWithCourier({
  name,
  email,
}: {
  name: string;
  email: string;
}) {
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

export async function sendFeedbackMailToDevWithCourier({
  name,
  email,
  type,
  message,
}: {
  name: string;
  email: string;
  type: string;
  message: string;
}) {
  const { requestId } = await courier.send({
    message: {
      to: {
        email: config.DEVELOPER_EMAIL,
      },
      template: config.COURIER.feedbackNotificationId,
      data: {
        name,
        email,
        type,
        message,
      },
    },
  });

  return requestId;
}
