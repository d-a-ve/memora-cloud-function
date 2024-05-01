import { Client, Databases, Models, Query, Users } from "node-appwrite";
import { config } from "./config.js";
import { changeDateToString } from "./utils.js";

export type UserBirthdays = {
  userId: string;
  email: string;
  birthdays: string[];
};

export type BirthdayCol = Models.Document & {
  person_name: string;
  person_birthday: string;
  user_email: string;
  user_id: string;
};

const currentDate = changeDateToString(new Date());

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(config.APPWRITE.projectId)
  .setKey(config.APPWRITE.apiKey);
const db = new Databases(client);
const users = new Users(client);

export const listBirthdayDocuments = () =>
  db.listDocuments<BirthdayCol>(
    config.APPWRITE.memoraDBId,
    config.APPWRITE.birthdaysColId,
    [Query.equal("person_birthday", currentDate)]
  );

export const getUserById = (userId: string) => users.get(userId);
