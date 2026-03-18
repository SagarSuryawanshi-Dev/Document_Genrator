import sendResponse from "../utlis/apiResponse.js";

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  sendResponse(res, statusCode, err.message || "Internal Server Error");
};

export default errorHandler;
