import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import asyncHandler from './asyncHandler.js';
import { AuthError, ForbiddenError } from '../utils/error.js';

// Authenticate user & get token
const authenticate = asyncHandler(async (req, res, next) => {	

	const token = req.cookies.jwt;

	if (!token) {
		throw new AuthError('Authentication required: No token provided.', 401); // User is not authenticated
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = await User.findById(decoded.userId).select('-password');
		next();
	} catch (error) {
		throw new AuthError('Authentication failed: Invalid token', 401);
	}
});

// Check user role
const authorize = asyncHandler(async (req, res, next) => {
	console.log('User role:', req.user?.role);

	if (!req.user) {
		throw new AuthError('Authentication failed: No user found. Please log in again.', 401);
	}

	if (req.user.role !== 'admin') {
		throw new ForbiddenError(`Access denied: User role (${req.user.role}) does not have permission to access this route.`, 403);
	}

	console.log('Authorization successful');
	next();	
});

// Check user role
const authorizeMultiple = (roles = []) =>
	asyncHandler(async (req, res, next) => {		
		console.log('User role:', req.user?.role);

		if (!req.user) {
			throw new AuthError('Authentication failed: No user found. Please log in again.', 401);
		}

		if (!roles.includes(req.user.role)) {
			throw new ForbiddenError(`Access denied: User role (${req.user.role}) does not have permission to access this route.`, 403);
		}

		next();
	});


export { authenticate, authorize, authorizeMultiple };