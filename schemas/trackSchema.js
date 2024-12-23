import Joi from 'joi';
import sharedSchema from './sharedSchema.js';

const trackValidationSchema = {
  getTracksByQuery: Joi.object({
    limit: Joi.number().integer().min(1).default(5),
    offset: Joi.number().integer().min(0).default(0),
    artist_id: Joi.string(),
    album_id: Joi.string(),
    hidden: Joi.boolean()
  })
};

const trackQuerySchema = Joi.object({
  limit: sharedSchema.limit,
  offset: sharedSchema.offset,
  artist_id: sharedSchema.uuids,
  album_id: sharedSchema.uuids,
  hidden: sharedSchema.hidden
});

const addTrackSchema = Joi.object({
  artist_id: sharedSchema.uuids.required()
    .messages({
      'any.required': 'Artist ID is required',
      'string.empty': 'Artist ID cannot be empty'
    }),
  album_id: sharedSchema.uuids.required()
    .messages({
      'any.required': 'Album ID is required',
      'string.empty': 'Album ID cannot be empty'
    }),
  name: sharedSchema.name.required()
    .messages({
      'any.required': 'Track name is required',
      'string.empty': 'Track name cannot be empty',
      'string.base': 'Track name must be a string'
    }),
  duration: sharedSchema.duration.strict().required(),
  hidden: sharedSchema.hidden
});

const updateTrackSchema = Joi.object({
  artist_id: sharedSchema.uuids,
  album_id: sharedSchema.uuids,
  name: sharedSchema.name,
  duration: sharedSchema.duration.strict(),
  hidden: sharedSchema.hidden
});

export { trackValidationSchema, trackQuerySchema, addTrackSchema, updateTrackSchema };
