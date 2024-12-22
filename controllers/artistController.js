import asyncHandler from '../middlewares/asyncHandler.js';
import Artist from '../models/artistModel.js';
import successResponse from '../utils/successResponse.js';
import { NotFoundError } from '../utils/error.js';

// Get all artists
const getAllArtists = asyncHandler(async (req, res) => {
	// const { limit = 5, offset = 0, grammy, hidden } = req.query;
	const { limit, offset, grammy, hidden } = req.query;

	// Convert limit and offset to numbers
	const limitNum = parseInt(limit) || 5;
	const offsetNum = parseInt(offset) || 0;

	// Build query for filtering
	const query = {};
	if (grammy !== undefined) {
		const grammyNum = parseInt(grammy);
		query.grammy = grammyNum; // Filter artists by Grammy count
	}

	// Check if hidden is provided and convert to boolean
	if (hidden !== undefined) {
		const hiddenBool = hidden === true;
		query.hidden = hiddenBool; // Filter by visibility status
	}
	// Execute query with pagination
	const artists = await Artist.find(query)
		.limit(limitNum)
		.skip(offsetNum)
		.sort({ createdAt: -1 }); // Sort by creation date, newest first

	// Check if artists were found
	if (artists.length === 0) {
		// Construct the response message based on provided parameters
		let message = 'No artists found with ';
		if (grammy !== undefined) {
			message += `grammy count: ${grammy} `;
		}
		if (hidden !== undefined) {
			message += `hidden status: ${hidden}`;
		}		
		return successResponse(res, 404, null, message);
	}

	// Format artist data
	const formattedArtists = artists.map(artist => ({
		artist_id: artist.artist_id,
		name: artist.name,
		grammy: artist.grammy,
		hidden: artist.hidden,
	}));
	// const count = formattedArtists.length;
	// const result = [{ count }, ...formattedArtists];
	
	return successResponse(res, 200, formattedArtists, 'Artists retrieved successfully.');
});

// Get artist by ID
const getArtistById = asyncHandler(async (req, res) => {
	const artist = await Artist.findOne({ artist_id: req.params.id });

	if (artist) {
		const formattedArtist = {
			artist_id: artist.artist_id,
			name: artist.name,
			grammy: artist.grammy,
			hidden: artist.hidden,
		};		
		return successResponse(res, 200, formattedArtist, 'Artist retrieved successfully.');
	} else {		
		throw new NotFoundError('Artist not found.');
	}
});

// Create a new artist
const addArtist = asyncHandler(async (req, res) => {
	const { name, grammy, hidden } = req.body;

	// Create a new artist
	const artist = new Artist({ name, grammy, hidden });
	await artist.save();

	return successResponse(res, 201, null, 'Artist created successfully.');
});

// Update artist by ID
const updateArtist = asyncHandler(async (req, res) => {
	const { id } = req.params;
	const { name, grammy, hidden } = req.body;

	const artist = await Artist.findOne({ artist_id: id });
	if (artist) {
		artist.name = name.trim().toLowerCase() || artist.name;
		artist.grammy = grammy !== undefined ? grammy : artist.grammy;
		artist.hidden = hidden !== undefined ? hidden : artist.hidden;

		await artist.save();		
		return successResponse(res, 204, null, 'Artist updated successfully.');
	} else {
		throw new NotFoundError('Artist not found.', 404);
	}
});

// Delete artist by ID
const deleteArtist = asyncHandler(async (req, res) => {
	const artist = await Artist.findOneAndDelete({ artist_id: req.params.id });
	if (artist) {
		return successResponse(res, 200, null, 'Artist deleted successfully.');
	} else {
		throw new NotFoundError('Artist not found.');
	}
});

export {
	getAllArtists,
	getArtistById,
	addArtist,
	updateArtist,
	deleteArtist
};