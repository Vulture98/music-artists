import apiResponse from "./apiResponse.js";


const successResponse = (res, statusCode, data, message) => {
  return res.status(statusCode).json(apiResponse(statusCode, data, message, null));
};

export default successResponse
