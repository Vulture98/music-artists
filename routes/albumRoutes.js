import express from 'express';
import {
  getAllAlbums,
  getAlbumById,
  addAlbum,
  updateAlbum,
  deleteAlbum
} from '../controllers/albumController.js';
import { authenticate, authorize, authorizeMultiple } from '../middlewares/authMiddleware.js';
import { validateAddAlbum, verifyAlbumAvailability, verifyAlbumAvailabilityOnly, validateAlbumQuery } from '../validations/validateAlbum.js';
import { validateUuid } from '../validations/validateShared.js';

const albumRoutes = express.Router();

// GET /albums - Get all albums
albumRoutes.get('/', authenticate, validateAlbumQuery, getAllAlbums);

// GET /albums/:id - Get album by ID
albumRoutes.get('/:id', authenticate, validateUuid, getAlbumById);

// POST /albums/add-album - Create a new album
albumRoutes.post('/add-album', authenticate, authorizeMultiple(['admin', 'editor']), verifyAlbumAvailability, validateAddAlbum, addAlbum);

// PUT /albums/:id - Update an album
albumRoutes.put('/:id', authenticate, authorizeMultiple(['admin', 'editor']), validateUuid, verifyAlbumAvailabilityOnly, validateAddAlbum, updateAlbum);

// DELETE /albums/:id - Delete an album
albumRoutes.delete('/:id', authenticate, authorizeMultiple(['admin', 'editor']), validateUuid, deleteAlbum);

export default albumRoutes;