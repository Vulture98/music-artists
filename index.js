import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cookieParser from 'cookie-parser';
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import artistRoutes from "./routes/artistRoutes.js";
import albumRoutes from "./routes/albumRoutes.js";
import trackRoutes from "./routes/trackRoutes.js";
import favoritesRoutes from "./routes/favoritesRoutes.js";
import apiResponse from "./utils/apiResponse.js";
import successResponse from "./utils/successResponse.js";
import { CustomError, NotFoundError } from "./utils/error.js";

dotenv.config();
const PORT = process.env.PORT || 5000;
connectDB();

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes 
app.use("/api/v1/", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/artists", artistRoutes);
app.use("/api/v1/albums", albumRoutes);
app.use("/api/v1/tracks", trackRoutes);
app.use("/api/v1/favorites", favoritesRoutes);

app.get("/", (req, res) => {
  // return res.status(200).json(apiResponse(200, null, "Hello from MusicArtists", null));
  return successResponse(res, 200, null, "Hello from MusicArtists");
});

// Catch-all route for undefined routes
app.use((req, res) => {    
  throw new NotFoundError(`Cannot ${req.method} ${req.originalUrl}`, 404);
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.log(`inside global err() -> err: ${JSON.stringify(err)}`);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json(
    apiResponse(
      err.statusCode,
      null,
      null,
      err.message,
      process.env.NODE_ENV === 'development' ? err.stack : undefined
    )
  );
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;