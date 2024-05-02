import { StatusCodes } from "http-status-codes";

// Error Middleware - Handle all errors that occur in the routes controller while
// processing the requests on the API.
// This is called when a throw new Error('there is an error'); OR new <customError> such as
// NotFoundError() statement is run in the controller of the API. If any error occurs in the controller, this route handles that error.
const errorHandlerMiddleware = (err, req, res, next) => {
  // console.log(err); // err, holds the thrown error in the controller eg. throw new NotFoundError(`No job with id ${id}`);
  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  const msg = err.message || "Something went wrong, please try again later";
  res.status(statusCode).json({ msg });
};

export default errorHandlerMiddleware;