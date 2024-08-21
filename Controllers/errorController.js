const sendResponse = (res, message, resCode=400, err) => {
    res.status(resCode).json({
      message,
      err,
    });
  };
  
  exports.sendErrorRes = async (err, req, res, next) => {
    const errCode = err?.code || 400;
  
    if (errCode === "ER_DUP_ENTRY") {
      if (err.sqlMessage.includes("username"))
        return sendResponse(res, "User Name already exists", 409);
      sendResponse(res, "Email already exists");
    } else if (errCode === "ER_BAD_NULL_ERROR")
      sendResponse(res, "Provide all the required fields", 409);
    else if (err.message === "jwt expired")
      sendResponse(res, "Session Expired", err.statusCode, err);
    else if (errCode === "ER_PARSE_ERROR")
      sendResponse(res, err.sqlMessage, 500, err);
    else if (errCode === "ER_BAD_FIELD_ERROR")
      sendResponse(res, err.sqlMessage, 500, err);
    else sendResponse(res, err.message, err.statusCode, err.stack);
  };