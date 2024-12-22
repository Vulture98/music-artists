import Joi from "joi";
import sharedSchema from "./sharedSchema.js";

const artistQuerySchema = Joi.object({
  limit: sharedSchema.limit,
  offset: sharedSchema.offset,
  grammy: Joi.number()
    .integer()
    .min(0)
    // .allow(null, '') // Allow null or empty string
    .messages({
      "number.base": "Grammy must be a number.",
      "number.min": "Grammy must be 0 or greater.",
      "number.integer": "Grammy must be an integer.",
      // "any.allow": "Grammy cannot be empty." // Custom message for empty values
    }),
  hidden: sharedSchema.hiddenParam,  
});

const artistAddSchema = Joi.object({
  name: sharedSchema.name.required(),
  grammy: sharedSchema.grammy,
  hidden: sharedSchema.hidden
});

const artistUpdateSchema = Joi.object({
  name: sharedSchema.name,
  grammy: sharedSchema.grammy,
  hidden: sharedSchema.hidden
});

export { artistQuerySchema, artistAddSchema, artistUpdateSchema };













// grammy: Joi.alternatives()
//   .try(
//     Joi.boolean(),
//     Joi.string()
//       .valid("yes", "no")
//       .insensitive(),
//     Joi.number().integer().min(0)
//   )
//   .custom((value, helpers) => {
//     if (typeof value === "string" && (value.toLowerCase() === "yes" || value.toLowerCase() === "no")) {
//       return value.toLowerCase() === "yes"; // Convert "yes" to true, "no" to false
//     }
//     return value;
//   })
//   .messages({
//     "alternatives.types": "Grammy must be true/false, yes/no, or a number >= 0.",
//     "boolean.base": "Grammy must be true or false.",
//     "number.base": "Grammy must be a valid number.",
//     "string.valid": "Grammy must be 'yes' or 'no' if using a string.",
//   }),



// grammy: Joi.alternatives()
//   .try(
//     Joi.boolean(), // true/false
//     Joi.string()
//       .valid("yes", "no"), // yes/no
//     Joi.number()
//       .integer()
//       .min(0) // Non-negative integers
//   )
//   .required()
//   .messages({
//     "alternatives.types": "Grammy must be true, false, yes, no, or a non-negative integer.",
//     "any.required": "Grammy is required.",
//   }),