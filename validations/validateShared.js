import asyncHandler from "../middlewares/asyncHandler.js";
import sharedSchema from "../schemas/sharedSchema.js";
import { ValidationError } from "../utils/error.js";
import Logger from "../utils/logger.js";

const validateUuid = asyncHandler(async (req, res, next) => {  
  const { id } = req.params;
  const { error, value } = sharedSchema.uuids.validate(id);
  console.log(`uuid err: ${error}`);
  console.log(`uuid val: ${value}`);

  Logger.debug(`Validating UUID: ${id}`);

  if (error) {
    const errors = error.details.map((detail) => detail.message);
    Logger.warn(`UUID Validation Error: ${errors}`);
    throw new ValidationError(`Invalid UUID: ${errors}`);
  }

  Logger.info(`UUID validation passed: ${value}`);
  next(); // Proceed to the next middleware
});

export { validateUuid };