import asyncHandler from '../middlewares/asyncHandler.js';
import Album from '../models/albumModel.js';
import Logger from '../utils/logger.js';
import { ConflictError, NotFoundError, ValidationError } from '../utils/error.js';
import Artist from '../models/artistModel.js';
import { albumQuerySchema, addAlbumSchema } from '../schemas/albumSchema.js';

const verifyAlbumAvailability = asyncHandler(async (req, res, next) => {  
  const { name, artist_id } = req.body;

  const existingAlbum = await Album.findOne({ name });
  if (existingAlbum) {
    Logger.warn(`Conflict: Attempted registration with an existing album name - ${name}`);
    throw new ConflictError('Album already in use.');
  }
  const existingArtist = await Artist.findOne({ artist_id });
  if (!existingArtist) {
    Logger.warn(`Notfound: Artist not found - ${artist_id}`);
    throw new NotFoundError('Artist not found with given id.');
  }

  Logger.info(`Album is available for registration: **${name}**`);
  next();
});

const verifyAlbumAvailabilityOnly = asyncHandler(async (req, res, next) => {  
  const { artist_id } = req.body;

  const existingAlbum = await Album.findOne({ artist_id });
  if (!existingAlbum) {
    Logger.warn(`Notfound: Album not found - ${artist_id}`);
    throw new NotFoundError('Album not found.');
  }

  Logger.info(`Album is available for registration: ${artist_id}**`);
  next();
});

const validateAlbumQuery = (req, res, next) => {
  const { error, value } = albumQuerySchema.validate(req.query, {
    abortEarly: false,
  });

  if (error) {
    const errors = error.details.map((detail) => detail.message);    
    throw new ValidationError(`Invalid query parameters: ${errors.join(' & ')}`);
  }

  req.query = value;
  next();
};

const validateAddAlbum = asyncHandler(async (req, res, next) => {  
  const { name, year, hidden, artist_id } = req.body;

  const { error, value } = addAlbumSchema.validate({ artist_id, name, year, hidden });

  if (error) {
    const errors = error.details.map((detail) => detail.message);
    throw new ValidationError(`Invalid input data: ${errors.join(' & ')}`);
  }
  
  next();
})

export { verifyAlbumAvailability, verifyAlbumAvailabilityOnly, validateAlbumQuery, validateAddAlbum };