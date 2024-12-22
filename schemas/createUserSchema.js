import Joi from 'joi';

const createUserSchema = Joi.object({
  email: Joi.string()
    .pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/) // Regex for email validation
    .required()
    .messages({
      'string.base': 'Email must be a string',
      'string.empty': 'Email is required',
      'string.pattern.base': 'Email must be a valid email address',
    }),
  password: Joi.string()
    .min(8)
    .required()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).*$/) // At least one lowercase, one uppercase, one number, and one special character
    .messages({
      'string.base': 'Password must be a string',
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 8 characters long',
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    }),
  role: Joi.string()
    .required()
    .messages({
      'string.base': 'Role must be a string',
      'string.empty': 'Role is required n should be Editor or Viewer',
      // 'any.only': 'Role should be Editor or Viewer',
    }),
});

export default createUserSchema;