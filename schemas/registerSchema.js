import Joi from 'joi';
import sharedSchema from './sharedSchema.js';

const registerSchema = Joi.object({
  email: sharedSchema.email.required(),
  password: sharedSchema.password.required(),

});

const loginSchema = Joi.object({
  email: sharedSchema.email.required(),
  password: Joi.string()
    .required()
    .messages({
      'string.base': 'Password must be a string',
      'string.empty': 'Password is required',
    }),
});

const addUserSchema = Joi.object({
  email: sharedSchema.email.required(),
  password: sharedSchema.password.required(),
  role: Joi.string()
    .trim()
    .lowercase()
    .valid('editor', 'viewer') // Define valid roles        
    .messages({
      'string.base': 'Role must be a string.',
      'any.only': 'Role can only be one of the following: editor, viewer.',
    }),
});
export { registerSchema, loginSchema, addUserSchema };