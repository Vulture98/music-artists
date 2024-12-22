import asyncHandler from '../middlewares/asyncHandler.js';
import { registerSchema, loginSchema, addUserSchema } from '../schemas/registerSchema.js';
import { ConflictError, ValidationError } from '../utils/error.js';
import User from '../models/userModel.js';
import Logger from '../utils/logger.js';

const verifyEmailAvailability = asyncHandler(async (req, res, next) => {  
  const { email } = req.body;  
  const existingUser = await User.findOne({ email });
  if (existingUser) {    
    Logger.warn(`Conflict: Attempted registration with an existing email - ${email}`);
    throw new ConflictError('Email already in use.');
  }
  next();
});

const validateRegister = asyncHandler(async (req, res, next) => {
  const { error } = registerSchema.validate(req.body);
  if (error) {
    Logger.error(`Validation error: ${error.details[0].message}`);
    throw new ValidationError(error.details[0].message);
  }
  next();
});

const verifyEmail = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const { error } = registerSchema.extract('email').validate(email);
  if (error) {
    Logger.warn(`Invalid email format: ${email}`);
    throw new ValidationError(`Invalid email format`);
  }
  next();
});

const validateCredentials = asyncHandler(async (req, res, next) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    Logger.warn(`Invalid format: ${error}`);
    throw new ValidationError(`Invalid format ${error}`);
  }

  next();
});

const validateAddUser = asyncHandler(async (req, res, next) => {
  const { error } = addUserSchema.validate(req.body);
  if (error) {
    Logger.error(`Validation error: ${error.details[0].message}`);
    throw new ValidationError(error.details[0].message);
  }
  next();
});


export { verifyEmailAvailability, verifyEmail, validateRegister, validateCredentials, validateAddUser };