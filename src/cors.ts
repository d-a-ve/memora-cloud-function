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
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin":
      !process.env.ALLOWED_ORIGINS || process.env.ALLOWED_ORIGINS === "*"
        ? "*"
        : req.headers["origin"],
  };
}
