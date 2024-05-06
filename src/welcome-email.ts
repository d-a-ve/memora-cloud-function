import { sendWelcomeMailWithCourier } from "./courier.js";

type Context = {
  req: any;
  res: any;
  log: (msg: any) => void;
  error: (msg: any) => void;
};

export default async ({ req, res, log }: Context) => {
  try {
    const { headers } = req;
    
    if (headers["x-appwrite-trigger"] !== "event") {
      log(headers["x-appwrite-trigger"]);
      return res.send("This function was not triggered by an appwrite event.");
    }

    const { name, email } = req.body;
    log(`Message about to be sent to ${email}`);
    const mailId = sendWelcomeMailWithCourier({ name, email });
    log(`Message sent: ${mailId}`);

    return res.send("Welcome email sent successfully!!");
  } catch (e: any) {
    log(`ERROR: An error happened, ${e}`);
    return res.send("An error happened, check the logs for more info");
  }
};
