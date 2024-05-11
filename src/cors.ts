export function isOriginPermitted(req: any) {
  if (
    !process.env.ALLOWED_ORIGINS ||
    process.env.ALLOWED_ORIGINS === "*" ||
    !req.headers["origin"]
  )
    return true;

  const allowedOriginsArray = process.env.ALLOWED_ORIGINS.split(",");
  return allowedOriginsArray.includes(req.headers["origin"]);
}

export function getCorsHeaders(req: any) {
  if (!req.headers["origin"]) return {};

  return {
    // "Access-Control-Allow-Headers": "Origin, Accept, , Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Access-Control-Allow-Origin",
    "Content-Type": "application/json; charset=utf-8",
    // "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PATCH",
    "Access-Control-Allow-Origin": '*'
      // !process.env.ALLOWED_ORIGINS || process.env.ALLOWED_ORIGINS === "*"
      //   ? "*"
      //   : req.headers["origin"],
  };
}
