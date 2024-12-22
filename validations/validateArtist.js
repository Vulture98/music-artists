import { artistAddSchema, artistUpdateSchema, artistQuerySchema } from "../schemas/artistSchema.js";
import Logger from "../utils/logger.js";
import { ValidationError } from "../utils/error.js";
import Artist from '../models/artistModel.js';
import { ConflictError } from '../utils/error.js';
import asyncHandler from "../middlewares/asyncHandler.js";


const validateAddArtist = asyncHandler(async (req, res, next) => {  
  const { name, grammy, hidden } = req.body;
  
  const { error, value } = artistAddSchema.validate({ name, grammy, hidden }, { abortEarly: false });
  Logger.debug(`Error: ${error}`);
  Logger.debug(`Value: ${JSON.stringify(value)}`);

  if (error) {
    const errors = error.details.map((detail) => detail.message);
    throw new ValidationError(`Invalid input data: ${errors.join(' & ')}`);
  }

  next();
});

const validateUpdateArtist = asyncHandler(async (req, res, next) => {
  const { name, grammy, hidden } = req.body;

  const { error, value } = artistUpdateSchema.validate({ name, grammy, hidden }, { abortEarly: false });
  Logger.debug(`Error: ${error}`);
  Logger.debug(`Value: ${JSON.stringify(value)}`);

  if (error) {
    const errors = error.details.map((detail) => detail.message);
    throw new ValidationError(`Invalid input data: ${errors.join(' & ')}`);
  }

  next();
});

const verifyArtistAvailability = asyncHandler(async (req, res, next) => {  
  const { name } = req.body;

  // if (typeof name !== 'string') {
  //   throw new ValidationError(`Invalid type for name: expected a string, but got ${typeof name}`);
  // }

  // const trimmedName = name.trim().toLowerCase();
  // const existingArtist = await Artist.findOne({ name: trimmedName });
  const existingArtist = await Artist.findOne({ name });
  if (existingArtist) {
    Logger.warn(`Conflict: Attempted registration with an existing artist name - ${name}`);
    throw new ConflictError('Artist already in use.');
  }

  Logger.info(`Artist is available for registration: **${name}**`);
  next();
});

const validateArtistQuery = (req, res, next) => {  
  const { limit, offset, hidden, grammy } = req.query;

  const { error, value } = artistQuerySchema.validate({ limit, offset, hidden, grammy }, {
    abortEarly: false, // Capture all errors
  });
  Logger.debug(`Error: ${error}`);
  Logger.debug(`Value: ${JSON.stringify(value)}`);

  if (error) {
    const errors = error.details.map((detail) => detail.message);
    throw new ValidationError(`Invalid query parameters: ${errors.join(' & ')}`);
  }

  req.query = value; // Assign validated and transformed values
  next();
};

export { validateUpdateArtist, validateAddArtist, verifyArtistAvailability, validateArtistQuery };