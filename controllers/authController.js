import User from '../models/userModel.js';
import asyncHandler from '../middlewares/asyncHandler.js';
import createToken from '../utils/createToken.js';
import { AuthError, ValidationError } from '../utils/error.js';
import successResponse from '../utils/successResponse.js';
import { generateHashPassword, comparePassword } from '../utils/hashedPwds.js';
import Logger from '../utils/logger.js';

// Create a new user
const createUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const hashedPassword = await generateHashPassword(password);
    // Log the number of users
    const userCount = await User.countDocuments();
    Logger.info(`Number of users: ${userCount}`);
    // Create a new user
    const newUser = new User({
        email,
        password: hashedPassword,
        role: userCount === 0 ? 'admin' : 'viewer', // Assign role based on user count
    });
    await newUser.save();
    return successResponse(res, 201, null, 'User created successfully');
});

// Login user
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!password) {
        throw new ValidationError('Password is required.');
    }

    const user = await User.findOne({ email });

    if (!user) {
        Logger.error('User not found');
        throw new AuthError('Authentication failed: No user found with that email.');
    }
    if (!(await comparePassword(password, user.password))) {
        Logger.error('Invalid credentials...');
        throw new AuthError('Authentication failed: Invalid credentials.');
    }

    const token = createToken(res, user._id);

    Logger.info('Login successful');
    return successResponse(res, 200, token, 'Login successful');
});

// Logout user
const logoutUser = asyncHandler(async (req, res) => {
    res.clearCookie('jwt');
    Logger.info('Logout successful');
    return successResponse(res, 200, null, 'Logout successful');
});


export {
    createUser,
    loginUser,
    logoutUser,
};