import { formatISO } from "date-fns/formatISO";
import { isPast } from "date-fns/isPast";
import { isToday } from "date-fns/isToday";
import {
  createBirthdayDocument,
  listBirthdayDocumentsWithoutDateUpdated,
  updateBirthdayDateDocuments,
} from "./appwrite.js";

type Context = {
  req: any;
  res: any;
  log: (msg: any) => void;
  error: (msg: any) => void;
};

export default async ({ res, log }: Context) => {
  try {
    const { total, documents } =
      await listBirthdayDocumentsWithoutDateUpdated();

    if (total === 0) {
      log("No documents found");
      return res.empty();
    }

    // use for so i can make use of 'continue'
    for (let i = 0; i < documents.length; i++) {
      const doc = documents[i];

      // get birthday date
      const docDate = new Date(doc.person_birthday);
      // check if date is in past
      const isBirthdayDateTodayOrInPast = !isToday(docDate) && isPast(docDate);

      // if false, skip current iteration
      if (!isBirthdayDateTodayOrInPast) {
        continue;
      }

      // structure of birthday date from db: '2019-09-18'
      const [year, month, day] = doc.person_birthday
        .split("-")
        .map((date) => Number(date));

      const newDocDate = formatISO(new Date(year + 1, month - 1, day), {
        representation: "date",
      }); // Output: '2019-09-18'

      if (!newDocDate) {
        log(
          `ERROR: Could not create new date for ${doc.person_name} with birthday ${doc.person_birthday}. New date is ${newDocDate}`
        );
        continue;
      }

      log(newDocDate);
      // if true, create a new document the same data but a new date
      await createBirthdayDocument({
        data: {
          user_id: doc.user_id,
          user_email: doc.user_email,
          person_name: doc.person_name,
          person_birthday: newDocDate,
        },
      });

      // once created, update the current document to show that the date has been updated
      await updateBirthdayDateDocuments({
        docId: doc.$id,
        data: { hasBirthdayDateUpdated: true },
      });

      log(
        `New date created for ${doc.person_name} with birthday ${newDocDate}`
      );
    }

    return res.send("Birthdays done successfully");
  } catch (e: any) {
    log(`ERROR: An error happened, ${e}`);
    return res.send("An error happened, check the logs for more info");
  }
};
