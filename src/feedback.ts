// import { z } from "zod";

import { getCorsHeaders, isOriginPermitted } from "./cors.js";
import { sendFeedbackMailToDevWithCourier } from "./courier.js";

// const feedbackSchema = z.object({
//   name: z.string(),
//   email: z.string(),
//   type: z.string(),
//   message: z.string(),
// });

type Context = {
  req: any;
  res: any;
  log: (msg: any) => void;
  error: (msg: any) => void;
};

const FeedbackType = {
  DEFAULT: "default",
  ISSUE: "issue",
  FEATURE: "feature",
  MESSAGE: "message",
} as const;

export default async ({ req, res, log, error }: Context) => {
  if (!process.env.ALLOWED_ORIGINS || process.env.ALLOWED_ORIGINS === "*") {
    log(
      "WARNING: Allowing requests from any origin - this is a security risk!"
    );
  }

  try {
    if (!isOriginPermitted(req)) {
      error("Origin not permitted.");
      throw new Error("Origin not permitted.");
    }

    const { type, message, username, email } = req.body;

    log({ type, message, username, email });
    if (message.length < 1) {
      log("message cannot be empty");
      throw new Error("Please fill your message, message cannot be empty");
      // return res.json(
      //   { error: "Please fill your message, message cannot be empty" },
      //   403,
      //   getCorsHeaders(req)
      // );
    }

    if (type === FeedbackType.DEFAULT) {
      log("type cannot be default");
      throw new Error("Invalid feedback type provided");
      // return res.json(
      //   { error: "Invalid feedback type provided" },
      //   403,
      //   getCorsHeaders(req)
      // );
    }

    if (username.length < 1) {
      log("username cannot be empty");
      throw new Error("Username was not provided, please login again.");
      // return res.json(
      //   { error: "Username was not provided, please login again." },
      //   403,
      //   getCorsHeaders(req)
      // );
    }

    if (email.length < 1) {
      log("email cannot be empty");
      throw new Error("Email was not provided, please login again.");
      // return res.json(
      //   { error: "Email was not provided, please login again." },
      //   403,
      //   getCorsHeaders(req)
      // );
    }

    const emailId = await sendFeedbackMailToDevWithCourier({
      email,
      name: username,
      message,
      type,
    });

    log({ emailId: "Email sent successfully" });

    return res.json(
      { message: "Email sent to the developer successfully" },
      200,
      getCorsHeaders(req)
    );
  } catch (e: any) {
    log(`ERROR: An error happened, ${e.message}`);
    throw e;
    // return res.json({ error: e.message }, e.code, getCorsHeaders(req));
  }
};
