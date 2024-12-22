import express from "express";
import {
    getAllUsers,
    createUser,
    deleteUserById,
    updatePassword,
} from "../controllers/userController.js";
import { authenticate, authorize } from "../middlewares/authMiddleware.js";
import { validateAddUser, validateUserQuery, verifyEmailAvailability } from "../validations/validateUser.js";
import { validateUuid } from "../validations/validateShared.js";


const userRoutes = express.Router();

userRoutes.get("/", authenticate, authorize, validateUserQuery, getAllUsers);
userRoutes.post("/add-user", authenticate, authorize, verifyEmailAvailability, validateAddUser, createUser);
userRoutes.delete("/:id", authenticate, authorize, validateUuid, deleteUserById);
userRoutes.put("/update-password", authenticate, updatePassword);



export default userRoutes;
