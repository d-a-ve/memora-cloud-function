import { CourierClient } from "@trycourier/courier";
import { UserBirthdays } from "./appwrite.js";
import { config } from "./config.js";
import { arrayToCommaSeparatedString } from "./utils.js";

const courier = new CourierClient({
  authorizationToken: config.COURIER.authToken,
});

export async function sendMailwithCourier(
  userBirthdayList: UserBirthdays,
  userName: string
) {
  const birthday = arrayToCommaSeparatedString(userBirthdayList.birthdays);

  const { requestId } = await courier.send({
    message: {
      template: config.COURIER.notificationId,
      to: {
        // TODO: remove this email once ready for production
        email: "davearonmwan@gmail.com",
      },
      data: {
        birthdayNames: birthday,
        recipientName: userName,
      },
    },
  });

  return requestId;
}
