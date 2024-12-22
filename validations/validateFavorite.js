import asyncHandler from "../middlewares/asyncHandler.js";
import { favoriteAddSchema, favoriteQuerySchema } from '../schemas/favoriteSchema.js';
import { ValidationError } from "../utils/error.js";
import Logger from "../utils/logger.js";

const validateAddFavorite = asyncHandler(async (req, res, next) => {  
  const { category, item_id } = req.body;

  const { error, value } = favoriteAddSchema.validate({ category, item_id }, { abortEarly: false });
  Logger.debug(`Error: ${error}`);
  Logger.debug(`Value: ${JSON.stringify(value)}`);

  if (error) {
    const errors = error.details.map((detail) => detail.message);
    throw new ValidationError(`Invalid input data: ${errors.join(' & ')}`);
  }

  next();
});

const validateQueryFavorite = asyncHandler(async (req, res, next) => {  
  const { category } = req.params;    
  const {limit, offset} = req.query;

  const { error, value } = favoriteQuerySchema.validate({ category, limit, offset }, { abortEarly: false });
  Logger.debug(`Error: ${error}`);
  Logger.debug(`Value: ${JSON.stringify(value)}`);

  if (error) {
    const errors = error.details.map((detail) => detail.message);
    throw new ValidationError(`Invalid input data: ${errors.join(' & ')}`);
  }

  next();
});

export { validateAddFavorite, validateQueryFavorite };