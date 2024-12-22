import Joi from "joi";

// Define reusable schema components
const sharedSchema = {
  uuids: Joi.string()
    .uuid({ version: 'uuidv4' })
    .messages({
      "string.pattern.base": "Invalid UUID format", // Correct way to set custom error message
      "any.required": "UUID is required" // Optional: custom message for required validation
    }),
  email: Joi.string().trim().email(),
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).*$/) // At least one lowercase, one uppercase, one number, and one special character
    .messages({
      'string.base': 'Password must be a string',
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 8 characters long',
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    }),
  limit: Joi.number()
    .integer()
    .min(0)
    .max(100)
    .allow(null, "") // Allows empty string or null
    .messages({
      "number.base": "Limit must be a number",
      "number.min": "Limit must be 0 or greater",
      "number.max": "Limit must be 100 or less",
      "number.integer": "Limit must be an integer",
    }),
  offset: Joi.number()
    .integer()
    .min(0)
    .max(500)
    .allow(null, "") // Allows empty string or null
    .messages({
      "number.base": "Offset must be a number.",
      "number.min": "Offset must be 0 or greater.",
      "number.max": "Offset must be 500 or less.",
      "number.integer": "Offset must be an integer.",
    }),
  artist_id: Joi.string()
    .messages({
      "string.base": "Artist ID must be a string.",
    }),
  album_id: Joi.string()
    .messages({
      "string.base": "Album ID must be a string.",
    }),
  hidden: Joi.boolean()
    .strict()
    .messages({
      // "boolean.base": "Hidden must be a boolean value.",
      "boolean.base": "Hidden must be a boolean value(if provided)", // Improved message
    }),
  hiddenParam: Joi.string()
    .valid('true', 'false', 'True', 'False')  // Only allow these two string values
    .messages({
      'any.only': 'Hidden must be either "true" or "false"'
    }),
  name: Joi.string().trim().lowercase().messages({
    "string.base": "Name must be a string.",
    "string.empty": "Name cannot be empty.",
  }),
  grammy: Joi.number()
    .integer()
    .min(0)
    .allow(null, "") // Allow null or empty string
    .strict()
    .messages({
      "number.base": "Grammy must be a number",
      "number.min": "Grammy must be 0 or greater",
      "number.integer": "Grammy must be an integer",
      "any.allow": "Grammy cannot be empty" // Custom message for empty values
    }),
  year: Joi.number()
    .integer()
    .min(1700)  // no albums before 1700
    .max(new Date().getFullYear())  // Current year as maximum
    .messages({
      "number.base": "Year must be a number",
      "number.integer": "Year must be an integer",
      "number.min": "Year cannot be earlier than 1700",
      "number.max": `Year cannot be later than ${new Date().getFullYear()}`
    }), 
  duration: Joi.number()
    .integer()
    .min(1)
    .max(10800)
    .messages({
      "number.base": "Duration must be a number.",
      "number.min": "Duration must be 1 or greater.",
      "number.max": "Duration cannot be more than 3 hours (10800 seconds).", 
      "number.integer": "Duration must be an integer."
    }),
};

export default sharedSchema;