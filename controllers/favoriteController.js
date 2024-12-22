import asyncHandler from '../middlewares/asyncHandler.js';
import Favorite from '../models/favoriteModel.js';
import Artist from '../models/artistModel.js';
import Album from '../models/albumModel.js';
import Track from '../models/trackModel.js';
import { NotFoundError } from '../utils/error.js';
import successResponse from '../utils/successResponse.js';

// Get favorites by category
const getFavorites = asyncHandler(async (req, res) => {
  const category = req.params.category.trim().toLowerCase();
  const { limit = 5, offset = 0 } = req.query;
  const user_id = req.user.user_id;

  // Convert limit and offset to numbers
  const limitNum = parseInt(limit);
  const offsetNum = parseInt(offset);

  const favorites = await Favorite.find({ user_id, category })
    .limit(limitNum)
    .skip(offsetNum)
    .lean();
  // .sort({ createdAt: -1 });

  if (!favorites.length) {
    throw new NotFoundError(`No ${category} favorites found.`);
  }

  const formattedFavorites = favorites.map((favorite) => {
    return {
      favorite_id: favorite.favorite_id,
      category: favorite.category,
      item_id: favorite.item_id,
      name: favorite.name,
    };
  });

  // const count = favorites.length;
  // const format = [{ count }, ...formattedFavorites];

  return successResponse(res, 200, formattedFavorites, 'Favorites retrieved successfully.');
});

// Add favorite
const addFavorite = asyncHandler(async (req, res) => {
  const category = req.body.category.trim().toLowerCase();
  const { item_id } = req.body;
  const user_id = req.user.user_id;

  // Verify item exists and get its name based on category
  let itemName;
  switch (category) {
    case 'artist':
      const artist = await Artist.findOne({ artist_id: item_id });
      if (!artist) {
        throw new NotFoundError('Artist not found.');
      }
      itemName = artist.name;
      break;

    case 'album':
      const album = await Album.findOne({ album_id: item_id });
      if (!album) {
        throw new NotFoundError('Album not found.');
      }
      itemName = album.name;
      break;

    case 'track':
      const track = await Track.findOne({ track_id: item_id });
      if (!track) {
        throw new NotFoundError('Track not found.');
      }
      itemName = track.name;
      break;

    default:
      throw new ValidationError('Invalid category.');
  }

  // Check if already favorited
  const existingFavorite = await Favorite.findOne({
    user_id,
    category,
    item_id
  });
  if (existingFavorite) {
    throw new ConflictError(`${category} is already in favorites.`);
  }

  return successResponse(res, 201, null, `Favorite ${category} added successfully.`);
});

// Remove favorite
const removeFavorite = asyncHandler(async (req, res) => {
  const { id: favorite_id } = req.params;
  const user_id = req.user.user_id;

  const favorite = await Favorite.findOne({ favorite_id, user_id });

  if (!favorite) {
    throw new NotFoundError('Favorite not found.');
  }

  await Favorite.deleteOne({ favorite_id });

  return successResponse(res, 200, null, 'Favorite removed successfully.');
});

export {
  getFavorites,
  addFavorite,
  removeFavorite
};
