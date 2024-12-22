import asyncHandler from '../middlewares/asyncHandler.js';
import Album from '../models/albumModel.js';
import Artist from '../models/artistModel.js';
import apiResponse from '../utils/apiResponse.js';
import successResponse from '../utils/successResponse.js';
import { ConflictError, CustomError, NotFoundError, ValidationError } from '../utils/error.js';

// Get all albums
const getAllAlbums = asyncHandler(async (req, res) => {
  const { limit = 5, offset = 0, artist_id, year, hidden } = req.query;

  // Convert limit and offset to numbers
  const limitNum = parseInt(limit);
  const offsetNum = parseInt(offset);
  const yearNum = parseInt(year);
  const hiddenBool = hidden === 'true' || hidden === 'True';

  // Build query for filtering
  const query = {};
  if (artist_id !== undefined) {
    // Verify artist exists
    const artist = await Artist.findOne({ artist_id });
    if (!artist) {
      throw new NotFoundError('Artist not found.');
    }
    query.artist_id = artist_id;
  }
  if (!isNaN(yearNum)) {  // Only add to query if it's a valid number    
    query.year = yearNum;
  }
  if (hidden !== undefined) {
    query.hidden = hiddenBool;
  }
  // Get albums with pagination
  const albums = await Album.find(query)
    .limit(limitNum)
    .skip(offsetNum)
    .lean();

  if (!albums.length) {
    let message = 'No albums found';
    if (artist_id) message += ` for artist: ${artist_id},`;
    if (year) message += ` with year: ${year},`;
    if (hidden !== undefined) message += ` with hidden status: ${hidden}`;
    throw new NotFoundError(message);
  }
  // Format album data
  const results = await Promise.all(albums.map(async (album) => {
    const artist = await Artist.findOne({ artist_id: album.artist_id }).lean();
    return {
      album_id: album.album_id,
      // artist_name: artist.name,  //y retrieve again n again cz if u hard code if artist name changes it doesnt reflect here
      artist_name: artist ? artist.name : 'this artist has been deleted from database', // Handle null artist
      name: album.name,
      year: album.year,
      hidden: album.hidden
    };
  }));

  // const count = results.length;
  // const format = [{ count }, ...results];

  // res.status(200).json(apiResponse(200, format, 'Albums retrieved successfully.'));
  return successResponse(res, 200, results, 'Albums retrieved successfully.');
});

// Get album by ID
const getAlbumById = asyncHandler(async (req, res) => {
  const album = await Album.findOne({ album_id: req.params.id });

  if (!album) {
    throw new NotFoundError('Album not found.');
  }

  const formattedAlbum = {
    album_id: album.album_id,
    artist_id: album.artist_id,
    name: album.name,
    year: album.year,
    hidden: album.hidden
  };

  return successResponse(res, 200, formattedAlbum, 'Album retrieved successfully.');
});

// Add new album
const addAlbum = asyncHandler(async (req, res) => {
  const { name, year, hidden, artist_id } = req.body;

  // Check for missing fields
  if (!name || !artist_id) {
    throw new ValidationError('Album name and artist ID are required.', 400);
  }

  // Check if the album already exists for the given artist_id
  const existingAlbum = await Album.findOne({ name, artist_id });
  if (existingAlbum) {
    throw new ConflictError('Album already exists for this artist.', 409);
  }

  // Verify artist exists
  const artist = await Artist.findOne({ artist_id });
  if (!artist) {
    throw new NotFoundError('Artist not found.', 404);
  }

  const album = new Album({
    artist_id,
    name,
    year,
    hidden
  });

  await album.save();
  return successResponse(res, 201, album, 'Album created successfully.');
});

// Update album
const updateAlbum = asyncHandler(async (req, res) => {
  const { name, year, hidden, artist_id } = req.body;

  const album = await Album.findOne({ album_id: req.params.id });
  if (!album) {
    throw new NotFoundError('Album not found.');
  }

  if (artist_id) {
    // Verify artist exists
    const artist = await Artist.findOne({ artist_id });
    if (!artist) {
      throw new NotFoundError('Artist not found.');
    }
  }

  album.name = name || album.name;
  album.year = year !== undefined ? year : album.year;
  album.hidden = hidden !== undefined ? hidden : album.hidden;
  album.artist_id = artist_id || album.artist_id;

  await album.save();
  return successResponse(res, 204, null, 'Album updated successfully.');
});

// Delete album
const deleteAlbum = asyncHandler(async (req, res) => {
  const album = await Album.findOneAndDelete({ album_id: req.params.id });
  if (!album) {
    throw new NotFoundError('Album not found.');
  }
  return successResponse(res, 200, null, `Album: ${album.name} deleted successfully.`);
});

export {
  getAllAlbums,
  getAlbumById,
  addAlbum,
  updateAlbum,
  deleteAlbum
};