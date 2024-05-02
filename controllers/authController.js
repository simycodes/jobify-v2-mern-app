import { StatusCodes } from "http-status-codes";
import User from "../models/UserModel.js";
import { hashPassword, comparePassword } from "../utils/passwordUtils.js";
import { UnauthenticatedError } from "../errors/customErrors.js";
import { createJWT } from "../utils/tokenUtils.js";

export const register = async(req, res) => {
    const isFirstUserAccount = await User.countDocuments() === 0;
    req.body.role = isFirstUserAccount? "admin" : "user"; // adds role property to body and sets it to either admin or user

    // Hash the incoming user password before storing it on the database when creating new user
    const hashedPassword = await hashPassword(req.body.password);
    req.body.password = hashedPassword;

    await User.create(req.body);
    res.status(StatusCodes.CREATED).json({ msg: "User registered successfully" })
}

export const login = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    throw new UnauthenticatedError(
      "Invalid Credentials - Unknown Email Address"
    );
  // Verify user password
  const isPasswordCorrect = await comparePassword(
    req.body.password,
    user.password
  );
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  // Create JWT token and send it to front-end in a cookie - not storing it in local storage
  const token = createJWT({ userId: user._id, role: user.role });
  // Create cookie that is not readable by JS on frontend that will hold the JWT token
  const oneDay = 1000 * 60 * 60 * 24;
  res.cookie("token", token, {
    httpOnly: true, // cant be read by JS code on frontend
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === "production", // cookie to be sent only in https not http
  });
  res.status(StatusCodes.OK).json({ msg: "User logged in successfully" });

  // NOTE: Once the cookie having the JWT token is sent back to the frontend when loggin
  // in, the cookie becomes automatically attached (part of the request headers) and sent
  // back to the server when ever the signed in user makes a request to the server. The
  // cookie having the JWT token is then added via the request headers and decoded to
  // get the user details and see if user is authenticated. The cookie on the server is 
  // accessed with the help of the cookie parser package, app.use(cookieParser());

  // Alternative for above code
  // const user = await User.findOne({ email: req.body.email });
  // const isValidUser = user && await comparePassword(req.body.password, user.password);
  // if(!isValidUser) = throw new UnauthenticatedError("Invalid Credentials");
};

export const logout = async (req, res) => {
  res.cookie("token", "logout", { // logout becomes the new value inside the "token" - cant access anything with it as actual token is removed
    httpOnly: true,
    expires: new Date(Date.now()), // removes the token immediately
  }); 
  res.status(StatusCodes.OK).json({ msg: "user logged out"});
}


