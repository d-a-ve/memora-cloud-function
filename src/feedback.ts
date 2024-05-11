// import { z } from "zod";

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

export default async ({ req, res, log }: Context) => {
  try {
    const body = JSON.stringify(req.body);
    log(body);
    // const emailId = sendFeedbackMailToDevWithCourier();
    return res.send("Request went well");
  } catch (e: any) {
    log(`ERROR: An error happened, ${e}`);
    return res.send("An error happened, check the logs for more info");
  }
};
