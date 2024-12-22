import express from 'express';
import {
  getAllTracks,
  getTrackById,
  addTrack,
  updateTrack,
  deleteTrack
} from '../controllers/trackController.js';
import { authenticate, authorize, authorizeMultiple } from '../middlewares/authMiddleware.js';
import { verifyTrackAvailability, verifyTrackAvailabilityOnly, validateTrackQuery, validateAddTrack, validateUpdateTrack } from '../validations/validateTrack.js';
import { validateUuid } from '../validations/validateShared.js';


const trackRoutes = express.Router();



// app.use("/tracks", trackRoutes);

// GET /tracks - Get all tracks
trackRoutes.get('/', validateTrackQuery, getAllTracks);

// GET /tracks/:id - Get track by ID
trackRoutes.get('/:id', authenticate, validateUuid, getTrackById);

// POST /tracks/add-track - Create a new track
trackRoutes.post('/add-track', authenticate, authorizeMultiple(['admin', 'editor']), verifyTrackAvailability, validateAddTrack, addTrack);

// PUT /tracks/:id - Update a track
trackRoutes.put('/:id', authenticate, authorizeMultiple(['admin', 'editor']), validateUuid, verifyTrackAvailabilityOnly, validateUpdateTrack, updateTrack);

// DELETE /tracks/:id - Delete a track
trackRoutes.delete('/:id', authenticate, authorizeMultiple(['admin', 'editor']), validateUuid, verifyTrackAvailabilityOnly, deleteTrack);

export default trackRoutes;
