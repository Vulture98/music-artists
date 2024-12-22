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
  artist_id: sharedSchema.artist_id.required(),
  album_id: sharedSchema.album_id.required(),
  name: sharedSchema.name.required(),
  duration: sharedSchema.duration.required(),
  hidden: sharedSchema.hidden
});

const updateTrackSchema = Joi.object({
  name: sharedSchema.name,
  duration: sharedSchema.duration,
  hidden: sharedSchema.hidden
});

export { trackValidationSchema, trackQuerySchema, addTrackSchema, updateTrackSchema };
