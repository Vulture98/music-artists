import express from 'express';
import {
    getAllArtists,
    getArtistById,
    addArtist,
    updateArtist,
    deleteArtist
} from '../controllers/artistController.js';
import { authenticate, authorize, authorizeMultiple } from '../middlewares/authMiddleware.js';
import { validateUpdateArtist, validateAddArtist, verifyArtistAvailability, validateArtistQuery } from '../validations/validateArtist.js';
import { validateUuid } from '../validations/validateShared.js';

const artistRoutes = express.Router();



// app.use("/artists", artistRoutes);

// GET /artists - Get all artists
artistRoutes.get('/', validateArtistQuery, getAllArtists);

// GET /artists/:id - Get artist by ID
artistRoutes.get('/:id', validateUuid, getArtistById);

// POST /artists/add-artist - Create a new artist
artistRoutes.post('/add-artist', authenticate, authorizeMultiple(['admin', 'editor']), verifyArtistAvailability, validateAddArtist, addArtist);

// PUT /artists/:id - Update artist by ID
artistRoutes.put('/:id', authenticate, authorizeMultiple(['admin', 'editor']), validateUuid, validateUpdateArtist, updateArtist);

// DELETE /artists/:id - Delete artist by ID
artistRoutes.delete('/:id', authenticate, authorizeMultiple(['admin', 'editor']), validateUuid, deleteArtist);

export default artistRoutes;
