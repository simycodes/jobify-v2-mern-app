import { StatusCodes } from "http-status-codes";
import cloudinary from "cloudinary";
import User from "../models/UserModel.js";
import Job from "../models/JobModel.js";
import { formatImage } from "../middleware/multerMiddleware.js";

export const getCurrentUser = async(req, res) => {
    const user = await User.findOne({ _id: req.user.userId });
    const userWithoutPassword = user.toJSON(); // user become an object when password was removed from it in User model
    res.status(StatusCodes.OK).json({ user: userWithoutPassword });
}

export const getApplicationStats = async (req, res) => {
    const users = await User.countDocuments();
    const jobs = await Job.countDocuments();
    res.status(StatusCodes.OK).json({ users, jobs });
    
    // const userProfiles = await User.find();
    // const jobProfiles = await Job.find();
    // res.status(StatusCodes.OK).json({ users, jobs, userProfiles, jobProfiles });
};

export const updateUser = async (req, res) => {
    // console.log(req.file); // Shows details of the uploaded image file
    // Remove password from incoming user data if its supplied/No password changes will happen in this route
    const updatedUser = {...req.body};
    delete updatedUser.password;

    // Check if avatar/user profile image is being changed/was uploaded
    if(req.file) {
        const file = formatImage(req.file);
        const response = await cloudinary.v2.uploader.upload(file);
        updatedUser.avatar = response.secure_url;
        updatedUser.avatarPublicId = response.public_id;
    }

    // console.log(bodyWithoutPassword);
    const updatedUserResponse = await User.findByIdAndUpdate(req.user.userId, updatedUser);
    // updatedUserResponse is the old instance before the update is made - hence old avatar id can be retrieved from this instance
    if (req.file && updatedUserResponse.avatarPublicId) {
      await cloudinary.v2.uploader.destroy(updatedUserResponse.avatarPublicId); // delete old avatar on cloudinary
    }

    res.status(StatusCodes.OK).json({ msg: "user updated successfully" });
};