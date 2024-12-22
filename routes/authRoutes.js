import express from "express";
import {
    createUser,
    loginUser,
    logoutUser,
} from "../controllers/authController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import { validateCredentials, validateRegister, verifyEmailAvailability } from "../validations/validateUser.js";

const authRoutes = express.Router();


authRoutes
    .post("/register", verifyEmailAvailability, validateRegister, createUser)
    .post("/login", validateCredentials, loginUser) //verifyEmail
    .post("/logout", authenticate, logoutUser);

export default authRoutes;

