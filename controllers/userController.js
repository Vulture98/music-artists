import User from "../models/userModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import { AuthError, ForbiddenError, NotFoundError, ValidationError } from "../utils/error.js";
import successResponse from "../utils/successResponse.js";
import { comparePassword, generateHashPassword } from "../utils/hashedPwds.js";
import Logger from "../utils/logger.js";


const createUser = asyncHandler(async (req, res) => {
  console.log(`inside createUser ()`);
  const { email, password, role } = req.body;


  if (role === 'admin') {    
    return successResponse(res, 403, null, 'Forbidden Access/Operation not allowed.');
  }

  // const hashedPassword = await bcrypt.hash(password, 10);
  const hashedPassword = await generateHashPassword(password);
  console.log(`length of users: `, User.length);
  const newUser = new User({ email, password: hashedPassword, role });
  await newUser.save();
  // res.status(201).json(apiResponse(201, null, 'User created successfully'));
  return successResponse(res, 201, null, 'User created successfully');
});

// @desc    Get all users with pagination and filtering
// @route   GET /api/users
// @access  Admin only
const getAllUsers = asyncHandler(async (req, res) => {
  console.log(`inside getAllUsers ()`);  
  const { limit, offset, role } = req.query;

  // Convert limit and offset to numbers
  const limitNum = parseInt(limit) || 5;
  const offsetNum = parseInt(offset) || 0;

  // Build query
  const query = {};
  if (role) {
    query.role = role.trim().toLowerCase();
  }

  // Execute query with pagination
  const users = await User.find(query)
    .select('-password') // Exclude password from results
    .limit(limitNum)
    .skip(offsetNum)
    .sort({ createdAt: -1 }); // Sort by creation date, newest first

  // Format user data
  const formattedUsers = users.map(user => ({
    user_id: user.user_id,
    email: user.email,
    role: user.role,
    created_at: user.createdAt
  }));

  // const count = formattedUsers.length;
  // const result = [{ count }, ...formattedUsers];

  Logger.info(`Users retrieved successfully`);  
  return successResponse(res, 200, formattedUsers, 'Users retrieved successfully.');
});

const deleteUserById = asyncHandler(async (req, res) => {
  console.log(`inside deleteUserById ()`);
  const userId = req.params.id;
  const user = await User.findOne({ user_id: userId });

  if (user) {
    if (user.role === 'admin') {
      throw new ForbiddenError('Cannot delete admin user');
    }

    await User.deleteOne({ _id: user._id });
    return successResponse(res, 200, null, 'User removed');
  } else {
    throw new NotFoundError('User not found.');
  }
});

const updatePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new ValidationError('Please provide both old and new passwords');
  }

  const user = await User.findById(req.user._id);  
  const isPasswordValid = await comparePassword(oldPassword, user.password);
  if (!isPasswordValid) {
    throw new AuthError('Invalid old password');
  }

  user.password = await generateHashPassword(newPassword);
  await user.save();

  return successResponse(res, 204, null, 'Password updated successfully');
});

export {
  createUser,
  getAllUsers,
  deleteUserById,
  updatePassword,
};
