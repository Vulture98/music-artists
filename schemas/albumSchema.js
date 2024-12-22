import Joi from "joi";
import sharedSchema from "./sharedSchema.js";

const albumQuerySchema = Joi.object({
  limit: sharedSchema.limit,
  offset: sharedSchema.offset,
  artist_id: Joi.string()
    .messages({
      "string.base": "Artist ID must be a string.",
    }),
  year: sharedSchema.year,
  hidden: sharedSchema.hiddenParam,
});

const addAlbumSchema = Joi.object({
  // artist_id: Joi.string().required(),
  artist_id: sharedSchema.uuids,
  name: Joi.string().required(),
  year: sharedSchema.year,
  hidden: sharedSchema.hidden

});

export { albumQuerySchema, addAlbumSchema };