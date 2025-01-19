const sendResponse = (res, message, resCode = 400, err) => {
  if (process.env.NODE_ENV === "production") {
    res.status(resCode).json({
      message,
    });
  }
  if (process.env.NODE_ENV === "development") {
    res.status(resCode).json({
      message,
      err,
    });
  }
};

exports.sendErrorRes = async (err, req, res, next) => {
  const errCode = err?.code || 400;

  if (errCode === "SequelizeUniqueConstraintError") {
    if (err.sqlMessage.includes("rb_users.email"))
      return sendResponse(res, "Email already exists", 409);
    if (err.sqlMessage.includes("client_dbs.db_name"))
      return sendResponse(res, "Organisation already exists", 409);
    sendResponse(res, "Duplicate entry made");
  } else if (errCode === "ER_BAD_NULL_ERROR")
    sendResponse(res, "Provide all the required fields", 409);
  else if (err.message === "jwt expired")
    sendResponse(res, "Session Expired", err.statusCode, err.stack);
  else if (errCode === "ER_PARSE_ERROR")
    sendResponse(res, err.sqlMessage, 500, err.stack);
  else if (errCode === "ER_BAD_FIELD_ERROR")
    sendResponse(res, err.sqlMessage, 500, err.stack);
  else sendResponse(res, err.message, err.statusCode, err.stack);
};