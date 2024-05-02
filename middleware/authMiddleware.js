import { UnauthenticatedError } from "../errors/customErrors.js";
import { verifyJWT } from "../utils/tokenUtils.js";
import { UnauthorizedError, BadRequestError } from "../errors/customErrors.js";

export const authenticateUser = (req, res, next) => {
    // console.log("Auth Middleware Accessed");
    // console.log(req.cookies);
    const { token } = req.cookies;
    if(!token) throw new UnauthenticatedError("Authentication Invalid");

    try {
        // const user = verifyJWT(token);
        // console.log(user);
        const { userId, role } = verifyJWT(token);
        const testUser = userId === "66281a943a452142134e1c4f"; // In case userId is equal to id of testUser in database, testUser becomes true 
        req.user = { userId, role, testUser }; // add userId and role to the request body (user property to be specific)
        next();
    } catch (error) {
        throw new UnauthenticatedError("Authentication Invalid");
    }
   
}

export const authorizePermissions = (...roles) => { // ...roles converts roles into an array
  // req and res is used inside here, because authorizePermissions() is being called directly in the router and not passed as reference, hence with req, res inside here there will be errors
  return (req, res, next) => {
    console.log(roles);
    if (!roles.includes(req.user.role)) {
      throw new UnauthorizedError("Unauthorized to access this route");
    }
    next();
  };
};


export const checkForTestUser = (req, res, next) => {
  if (req.user.testUser) {
    throw new BadRequestError("Demo User. Read Only!");
  }
  next();
};