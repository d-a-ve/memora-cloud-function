import { Client, Databases, ID, Models, Query, Users } from "node-appwrite";
import { config } from "./config.js";
import { changeDateToString } from "./utils.js";

export type UserBirthdays = {
  userId: string;
  email: string;
  birthdays: string[];
};

export type BirthdayData = {
  person_name: string;
  person_birthday: string;
  user_email: string;
  user_id: string;
  hasBirthdayDateUpdated?: boolean;
};

export type BirthdayCol = Models.Document & BirthdayData;

const currentDate = changeDateToString(new Date());

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(config.APPWRITE.projectId)
  .setKey(config.APPWRITE.apiKey);
const db = new Databases(client);
const users = new Users(client);
const uniqueId = ID.unique();

export const listBirthdayDocuments = () =>
  db.listDocuments<BirthdayCol>(
    config.APPWRITE.memoraDBId,
    config.APPWRITE.birthdaysColId,
    [Query.equal("person_birthday", currentDate)]
  );

export const listBirthdayDocumentsWithoutDateUpdated = () =>
  db.listDocuments<BirthdayCol>(
    config.APPWRITE.memoraDBId,
    config.APPWRITE.birthdaysColId,
    [
      // Query.isNotNull("hasBirthdayDateUpdated"),
      Query.notEqual("hasBirthdayDateUpdated", true),
    ]
  );

export const updateBirthdayDateDocuments = ({
  docId,
  data,
}: {
  docId: string;
  data: Pick<BirthdayCol, "hasBirthdayDateUpdated">;
}) =>
  db.updateDocument(
    config.APPWRITE.memoraDBId,
    config.APPWRITE.birthdaysColId,
    docId,
    data
  );

export const createBirthdayDocument = ({ data }: { data: BirthdayData }) =>
  db.createDocument(
    config.APPWRITE.memoraDBId,
    config.APPWRITE.birthdaysColId,
    uniqueId,
    data
  );

export const getUserById = (userId: string) => users.get(userId);
