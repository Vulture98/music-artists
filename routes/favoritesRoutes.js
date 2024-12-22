import express from 'express';
import {
  getFavorites,
  addFavorite,
  removeFavorite
} from '../controllers/favoriteController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { validateAddFavorite, validateQueryFavorite } from '../validations/validateFavorite.js';
import { validateUuid } from '../validations/validateShared.js';

const favoritesRoutes = express.Router();

// GET /favorites/:category - Get favorites by category
favoritesRoutes.get('/:category', authenticate, validateQueryFavorite, getFavorites);

// POST /favorites/add-favorite - Add a favorite
favoritesRoutes.post('/add-favorite', authenticate, validateAddFavorite, addFavorite);


// DELETE /favorites/remove-favorite/:id - Remove a favorite
favoritesRoutes.delete('/remove-favorite/:id', authenticate, validateUuid, removeFavorite);

export default favoritesRoutes;