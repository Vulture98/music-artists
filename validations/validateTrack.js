import asyncHandler from '../middlewares/asyncHandler.js';
import Track from '../models/trackModel.js';
import Logger from '../utils/logger.js';
import { ConflictError, NotFoundError, ValidationError } from '../utils/error.js';
import Artist from '../models/artistModel.js';
import Album from '../models/albumModel.js';
import { trackQuerySchema, addTrackSchema, updateTrackSchema } from '../schemas/trackSchema.js';

const verifyTrackAvailability = asyncHandler(async (req, res, next) => {  
  console.log(`req.body: ${JSON.stringify(req.body)}`);
  const { name, artist_id, album_id } = req.body;

  if (!artist_id || !album_id || !name) {
    Logger.warn(`Validation error: Please provide all required fields: name, artist_id, album_id.`);
    throw new ValidationError('Please provide all required fields: name, artist_id, album_id.');
  }

  const existingTrack = await Track.findOne({ name });
  if (existingTrack) {
    Logger.warn(`Conflict: Attempted registration with an existing track name - ${name}`);
    throw new ConflictError('Track already in use.');
  }
  const existingArtist = await Artist.findOne({ artist_id });
  if (!existingArtist) {
    Logger.warn(`Notfound: Artist not found - ${artist_id}`);
    throw new NotFoundError('Artist not found with given id.');
  }
  const existingAlbum = await Album.findOne({ album_id });
  if (!existingAlbum) {
    Logger.warn(`Notfound: Album not found - ${album_id}`);
    throw new NotFoundError('Album not found with given id.');
  }

  Logger.info(`Track is available for registration: **${name}**`);
  next();
});

const validateAddTrack = asyncHandler(async (req, res, next) => {  
  const { artist_id, album_id, name, duration, hidden } = req.body;

  const { error, value } = addTrackSchema.validate(req.body);

  if (error) {
    const errors = error.details.map((detail) => detail.message);
    Logger.warn(`Validation error: ${errors.join(' & ')}`);
    throw new ValidationError(`Invalid input data: ${errors.join(' & ')}`);
  }
  
  next();
})

const validateUpdateTrack = asyncHandler(async (req, res, next) => {  
  const { artist_id, album_id, name, duration, hidden } = req.body;

  const { error, value } = updateTrackSchema.validate(req.body);

  if (error) {
    const errors = error.details.map((detail) => detail.message);
    Logger.warn(`Validation error: ${errors.join(' & ')}`);
    throw new ValidationError(`Invalid input data: ${errors.join(' & ')}`);
  }
  
  next();
})

const verifyTrackAvailabilityOnly = asyncHandler(async (req, res, next) => {  
  const { artist_id, album_id, name } = req.body
  const { id } = req.params;

  const existingTrack = await Track.findOne({ track_id: id });
  if (!existingTrack) {
    Logger.warn(`Notfound: Track not found - ${id}`);
    throw new NotFoundError('Track not found.');
  }
  if (name && name !== existingTrack.name) {    
    const existingNewTrackName = await Track.findOne({ name });
    if (existingNewTrackName) {
      Logger.warn(`Conflict: Attempted registration with an existing track name - ${name}`);
      throw new ConflictError('Track already in use.');
    }
  }
  if (artist_id) {
    const existingArtist = await Artist.findOne({ artist_id });
    if (!existingArtist) {
      Logger.warn(`Notfound: Artist not found - ${artist_id}`);
      throw new NotFoundError('Artist not found with given id.');
    }
  }
  if (album_id) {
    const existingAlbum = await Album.findOne({ album_id });
    if (!existingAlbum) {
      Logger.warn(`Notfound: Album not found - ${album_id}`);
      throw new NotFoundError('Album not found with given id.');
    }
  }
  Logger.info(`Track is available for registration: ${id}**`);
  next();
});

const validateTrackQuery = (req, res, next) => {  

  const { error, value } = trackQuerySchema.validate(req.query, {
    abortEarly: false,
  });

  if (error) {
    const errors = error.details.map((detail) => detail.message);
    throw new ValidationError(`Invalid query parameters: ${errors.join(' & ')}`);
  }

  req.query = value;
  next();
};



export { verifyTrackAvailability, verifyTrackAvailabilityOnly, validateTrackQuery, validateAddTrack, validateUpdateTrack };