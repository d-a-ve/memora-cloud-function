// import { z } from "zod";

import { getCorsHeaders, isOriginPermitted } from "./cors.js";

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

export default async ({ req, res, log, error }: Context) => {
  if (!process.env.ALLOWED_ORIGINS || process.env.ALLOWED_ORIGINS === "*") {
    log(
      "WARNING: Allowing requests from any origin - this is a security risk!"
    );
  }

  if (req.method === "OPTIONS") {
    return res.json({ message: "Cors allowed" }, 200, getCorsHeaders(req));
  }

  // if (req.headers["content-type"] !== "application/json; charset=utf-8") {
  //   error("Incorrect content type.");
  //   return res.json({ error: "Incorrect content type." }, 415);
  // }

  if (!isOriginPermitted(req)) {
    error("Origin not permitted.");
    return res.json(
      { error: "Origin not permitted" },
      403,
      getCorsHeaders(req)
    );
  }

  const body = req.body;

  try {
    log(body);
    // const emailId = sendFeedbackMailToDevWithCourier();
    return res.json(
      {message: "Request went well"},

      200,
      getCorsHeaders(req),
    );
  } catch (e: any) {
    log(`ERROR: An error happened, ${e}`);
    return res.json(
      {error: "An error happened, check the logs for more info"},
      404,
      getCorsHeaders(req)
    );
  }
};
