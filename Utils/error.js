module.exports = class AppError extends Error {
    constructor(statusCode, message) {
      super(message);
  
      this.statusCode = statusCode;
      this.status = `${String(statusCode)[0] === "4" ? "Fail" : "error"}`;
  
      Error.captureStackTrace(this, this.constructor);
    }
  };
  