type Context = {
  req: any;
  res: any;
  log: (msg: any) => void;
  error: (msg: any) => void;
};

export default async ({ req, res, log }: Context) => {
  try {
    const { body, headers, header } = req;
    log({ body, headers, header });
    return res.send("Function ran successfully!!");
  } catch (e: any) {
    log(`ERROR: An error happened, ${e}`);
    return res.send("An error happened, check the logs for more info");
  }
};
