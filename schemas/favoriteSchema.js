import Joi from 'joi';
import sharedSchema from './sharedSchema.js';

const favoriteQuerySchema = Joi.object({
  limit: sharedSchema.limit,
  offset: sharedSchema.offset,
  category: Joi.string().valid('artist', 'album', 'track').required()
    .trim()
    .lowercase()
    .messages({
      'string.base': 'params: category must be a string.',
      'string.empty': 'params: Category cannot be empty.',
      'any.only': 'params: Category must be one of the following: [artist, album, track].',
      // 'any.required': 'params: Category is a required field.'
      // if its empty it doesnt come into ths end point so ...
    })  
});

const favoriteAddSchema = Joi.object({
  category: Joi.string()
    .trim()
    .lowercase()
    .valid('artist', 'album', 'track')
    .required()
    .messages({
      'string.base': 'Category must be a string.',
      'string.empty': 'Category cannot be empty.',
      'any.only': 'Category must be one of the items: [artist, album, track]',
      'any.required': 'Category is a required field.'
    }),

  item_id: sharedSchema.uuids.required()
});

export { favoriteQuerySchema, favoriteAddSchema };
