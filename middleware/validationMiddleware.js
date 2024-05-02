import { body, validationResult, param } from "express-validator";
import mongoose from "mongoose";

import { BadRequestError, NotFoundError, UnauthorizedError} from "../errors/customErrors.js";
import { JOB_STATUS, JOB_TYPE } from "../utils/constants.js";
import Job from "../models/JobModel.js";
import User from "../models/UserModel.js";

// withValidationErrors is a function that returns two middlewares, validateValues and (req, res, next)=> {}
// validateValues holds all validation rules for validation that validationResult when validating and giving errors
const withValidationErrors = (validateValues) => {
  // [] groups middleware together,[validateValues, (req, res, next)=> {}]below are middlewares
  return [validateValues, (req, res, next) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => error.msg); // errors.array() convert object to array and map on it
        if(errorMessages[0].startsWith("no job")) {
          throw new NotFoundError(errorMessages);
        }
        if (errorMessages[0].startsWith("not authorized")) {
          throw new UnauthorizedError("not authorized to access this resource/route");
        }
        throw new BadRequestError(errorMessages);
      }
      next();
    },
  ];
};

// [] is used to pass multiple middleware
// notEmpty().withMessage("Company is Required") are validation rules that will be used in
// the validationResult() function when validating incoming data and give correct results
export const validateJobInput = withValidationErrors([
  body("company").notEmpty().withMessage("Company is Required"),
  body("position").notEmpty().withMessage("Position is Required"),
  body("jobLocation").notEmpty().withMessage("Job Location is Required"),
  body("jobStatus").isIn(Object.values(JOB_STATUS)).withMessage("Invalid Job Status Value"),
  body("jobType").isIn(Object.values(JOB_TYPE)).withMessage("Invalid Job Type Value"),
]);

export const validateIdParam = withValidationErrors([
  param("id").custom(async (value, { req }) => {
    // custom access actual value of id param
    const isValidIdMongoId = mongoose.Types.ObjectId.isValid(value);
    if (!isValidIdMongoId) throw new BadRequestError("Invalid MongoDB id");

    // Check if job requested exits in database
    const job = await Job.findById(value);
    if (!job) throw new NotFoundError(`no job with id ${value}`);

    // Check if user sending request is an admin and if he created the job being requested
    const isAdmin = req.user.role === "admin";
    const isOwner = req.user.userId === job.createdBy.toString();
    if(!isAdmin && !isOwner) {
      throw new UnauthorizedError("not authorized to access this resource/route");
    }
  }),
  // async is needed to help return/throw the error manually without using withMessage() function, when using custom() in this function
]);

// Basic setup to valid incoming ids
// export const validateIdParam = withValidationErrors([
//   param("id")
//     .custom((value) => mongoose.Types.ObjectId.isValid(value))
//     .withMessage("invalid MongoDB id"),
// ]);

export const validateRegisterInput = withValidationErrors([
  body("name").notEmpty().withMessage("Name is Required"),
  body("email")
    .notEmpty().withMessage("Email is Required")
    .isEmail().withMessage("Invalid Email Format").custom(async(email)=> {
      const user = await User.findOne({email});
      if(user) throw new BadRequestError("Email Already Exists, Register With Another Email");
  } ),
  body("password")
    .notEmpty().withMessage("Password is Required")
    .isLength({ min:8 }).withMessage("Password Must be At least 8 Characters Long"),
  body("lastName").notEmpty().withMessage("Last Name is Required"),
  body("location").notEmpty().withMessage("Location is Required")
]);

export const validateLoginInput = withValidationErrors([
  body("email").notEmpty().withMessage("Email is Required").isEmail().withMessage("Invalid Email Format"),
  body("password").notEmpty().withMessage("Password is Required"),
]);

export const validateUserUpdate = withValidationErrors([
  body("name").notEmpty().withMessage("Name is Required"),
  body("email")
    .notEmpty()
    .withMessage("Email is Required")
    .isEmail()
    .withMessage("Invalid Email Format")
    .custom(async (email, { req }) => {
      const user = await User.findOne({ email });
      if (user && user._id.toString() !== req.user.userId)
        throw new BadRequestError(
          "Email Already Exists, Register With Another Email"
        );
    }),
  body("lastName").notEmpty().withMessage("Last Name is Required"),
  body("location").notEmpty().withMessage("Location is Required"),
]);