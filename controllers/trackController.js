import asyncHandler from '../middlewares/asyncHandler.js';
import Track from '../models/trackModel.js';
import Artist from '../models/artistModel.js';
import Album from '../models/albumModel.js';
import apiResponse from '../utils/apiResponse.js';
import { NotFoundError } from '../utils/error.js';
import successResponse from '../utils/successResponse.js';

// Get all tracks
const getAllTracks = asyncHandler(async (req, res) => {	
	const { limit = 5, offset = 0, artist_id, album_id, hidden } = req.query;

	// Convert limit and offset to numbers
	const limitNum = parseInt(limit);
	const offsetNum = parseInt(offset);

	// Build query for filtering
	const query = {};
	if (artist_id !== undefined) {
		// Verify artist exists
		const artist = await Artist.findOne({ artist_id });
		if (!artist) {			
			throw NotFoundError('Artist not found.');
		}
		query.artist_id = artist_id;
	}

	if (album_id !== undefined) {
		// Verify album exists
		const album = await Album.findOne({ album_id });
		if (!album) {			
			throw NotFoundError('Album not found.');
		}
		query.album_id = album_id;
	}

	if (hidden !== undefined) {
		query.hidden = hidden === 'true';
	}

	// Get tracks with pagination
	const tracks = await Track.find(query)
		.limit(limitNum)
		.skip(offsetNum)
		.lean();

	if (!tracks.length) {		
		throw new NotFoundError('No tracks found.');
	}

	const result = await Promise.all(tracks.map(async (track) => {
		const artist = await Artist.findOne({ artist_id: track.artist_id }).lean();
		const album = await Album.findOne({ album_id: track.album_id }).lean();
		return {
			track_id: track.track_id,
			artist_name: artist ? artist.name : 'this artist has been deleted from database', // Handle null artist
			album_name: album ? album.name : 'this album has been deleted from database', // Handle null album
			name: track.name,
			duration: track.duration,
			hidden: track.hidden
		}
	}));
	// const count = result.length
	// const format = [{ count }, ...result]
		
	return successResponse(res, 200, result, 'Tracks retrieved successfully.');
});

// Get track by ID
const getTrackById = asyncHandler(async (req, res) => {
	const { id } = req.params;

	const track = await Track.findOne({ track_id: id }).lean();

	if (!track) {		
		throw new NotFoundError('Track not found.');
	}

	const artist = await Artist.findOne({ artist_id: track.artist_id }).lean();
	const album = await Album.findOne({ album_id: track.album_id }).lean();

	const formattedTrack = {
		track_id: track.track_id,
		artist_name: artist.name,
		album_name: album.name,
		name: track.name,
		duration: track.duration,
		hidden: track.hidden
	};
	
	return successResponse(res, 200, formattedTrack, 'Track retrieved successfully.');
});

// Add new track
const addTrack = asyncHandler(async (req, res) => {	
	const { name, duration, hidden, artist_id, album_id } = req.body;

	// Create new track
	const track = await Track({
		artist_id,
		album_id,
		name,
		duration,
		hidden,
	});

	await track.save();

	return successResponse(res, 201, null, 'Track created successfully.');
});

// Delete track
const deleteTrack = asyncHandler(async (req, res) => {
	const { id } = req.params;

	const track = await Track.findOne({ track_id: id });

	if (!track) {
		throw new NotFoundError('Track not found.');
	}

	await Track.deleteOne({ track_id: id });

	return successResponse(res, 200, null, 'Track deleted successfully.');
});

// Update track
const updateTrack = asyncHandler(async (req, res) => {
	const { id } = req.params;
	const { name, duration, hidden, artist_id, album_id } = req.body;

	const track = await Track.findOne({ track_id: id });

	// Update only provided fields
	if (artist_id) track.artist_id = artist_id;
	if (album_id) track.album_id = album_id;
	if (name) track.name = name;
	if (duration) track.duration = duration;
	if (hidden !== undefined) track.hidden = hidden;
	
	await track.save();

	return successResponse(res, 200, null, 'Track updated successfully.');
});

export {
	getAllTracks,
	getTrackById,
	addTrack,
	updateTrack,
	deleteTrack
};
