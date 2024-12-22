import Joi from "joi";
import sharedSchema from "./sharedSchema.js";

const usersQuerySchema = Joi.object({
  limit: sharedSchema.limit,
  offset: sharedSchema.offset,
  role: Joi.string()
    .trim()
    .lowercase()
    .allow("", null)
    .valid("editor", "viewer")
    .messages({
      "string.base": "Role must be a string.",
      "any.only": "Role must be either 'Editor' or 'Viewer'.",
    }),
});

export default usersQuerySchema;