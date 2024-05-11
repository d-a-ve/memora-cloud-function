type Context = {
  req: any;
  res: any;
  log: (msg: any) => void;
  error: (msg: any) => void;
};

export default async ({ req, res, log }: Context) => {
  try {
    const { body } = req;

    log(JSON.stringify(body));
    return res.send("Request went well");
  } catch (e: any) {
    log(`ERROR: An error happened, ${e}`);
    return res.send("An error happened, check the logs for more info");
  }
};
