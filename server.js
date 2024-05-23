import "express-async-errors"; // must first on top, It acts as try and catch to handle async/await errors in the controller functions.
import express from "express";
const app = express(); // Create app server app
import * as dotenv from "dotenv";
dotenv.config(); // Enable dotenv to access env variables
import morgan from "morgan";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cloudinary from "cloudinary";

// Security Packages
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";

// Routers
import jobsRouter from "./routes/jobRouter.js";
import authRouter from "./routes/authRouter.js";
import userRouter from "./routes/userRouter.js"

// public - imports enabling image upload to the server
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";

// Middlewares
import errorHandlerMiddleware from "./middleware/errorHandlerMiddleware.js";
import {authenticateUser, authorizePermissions } from "./middleware/authMiddleware.js";

// Check environment status
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev")); // shows types of http requests incoming in api in the console
}

// Cloudinary config setup
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// syntax used when dealing ES6 modules when use of __dirname is needed, common js does not need such when dealing with __dirname
const __dirname = dirname(fileURLToPath(import.meta.url));
// Connecting to the public folder where uploaded images will be stored
app.use(express.static(path.resolve(__dirname, "./client/dist")));

// Enable receiving of cookies in server placed in the request headers
app.use(cookieParser());
// Enable receiving data in JSON format from front-end/client
app.use(express.json());
// Adding security middlewares
app.use(helmet()); // sets security HTTP headers to avoid potential security threats, such as cross-site scripting (XSS) attacks
app.use(mongoSanitize()); // sanitizes incoming user data to avoid NoSQL injection database attacks

// All auth routes requests
app.use("/api/v1/auth", authRouter);

// All user routes requests
app.use("/api/v1/users", authenticateUser, userRouter);

// All job routes requests
app.use("/api/v1/jobs", authenticateUser, jobsRouter);

// Handling all front end requests - must be placed here after all server routes and before
// the route/resource error route, else there will be errors
// This also makes sure the client production app folder inside dist(used public first) 
// folder gets connected to this server and all react clients requests are correctly 
// handled by the server
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./client/dist", "index.html"));
});

// Resource/route Not Found Middleware - If user tries accessing a route not defined
// on the API, give this error. Must be put after all defined routes in the API.
app.use("*", (req, res) => {
  res.status(404).json({ msg: "resource/route not found" });
});

// Error Middleware - Handle all errors that occur in the routes controller while
// processing the requests on the API. Must be placed as the last route.
// This is called when a throw new Error('there is an error'); OR new <customError> such as
// NotFoundError() statement is run in the controller of the API. If any error occurs in the controller, this route handles that error.
app.use(errorHandlerMiddleware);

// Port number variable - When deployed, hosting value will be used in process.env.PORT
const port = process.env.PORT || 5000;

// Start the app server after connecting to the database
try {
  await mongoose.connect(process.env.MONGO_URL);
  app.listen(port, () => {
    console.log(`Server is running on PORT ${port}....`);
  });
} catch (error) {
  console.log(error);
  process.exit(1);
}
