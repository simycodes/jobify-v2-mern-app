import Job from "../models/JobModel.js";
import { StatusCodes } from 'http-status-codes';
import mongoose from "mongoose";
import day from "dayjs";
// import { NotFoundError } from "../errors/customErrors.js";

// GET ALL JOBS
export const getAllJobs = async (req, res) => {
  // console.log(req.user);
  // console.log(req.query);
  // Handling query params
  const { search, jobStatus, jobType, sort } = req.query;

  const queryOptions = {
    createdBy: req.user.userId,
  };

  if (search) {
    // queryOptions.position = position; // only gets jobs if position matches exact full job position
    queryOptions.$or = [
      // search value is used on as value for both position and company
      { position: { $regex: search, $options: "i" } },
      { company: { $regex: search, $options: "i" } },
    ];
  }

  if (jobStatus && jobStatus !== "all") {
    queryOptions.jobStatus = jobStatus;
  }
  if (jobType && jobType !== "all") {
    queryOptions.jobType = jobType;
  }

  // Handling sorting type using passed query params
  const sortOptions = {
    newest: "-createdAt",
    oldest: "createdAt",
    "a-z": "position",
    "z-a": "-position",
  };
  const sortKey = sortOptions[sort] || sortOptions.newest;

  // Pagination setup
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit; // skip first 10 jobs you on page 2, skip first 20 you on page 3 etc
  const jobs = await Job.find(queryOptions).sort(sortKey).skip(skip).limit(limit);
  
  // Calculate the possible number of pages to fit the total available number of jobs
  const totalJobs = await Job.countDocuments(queryOptions);
  const numberOfPages = Math.ceil(totalJobs / limit);

  // Get all Jobs basic setup (code below)
  // const jobs = await Job.find({ createdBy: req.user.userId });
  res.status(StatusCodes.OK).json({ totalJobs, numberOfPages, currentPage:page, jobs });
};

// CREATE A SINGLE JOB
export const createJob = async (req, res) => {
  // const { company, position } = req.body;
  // const job = await Job.create({ company, position });
  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);
  return res.status(StatusCodes.CREATED).json({ job });
};

// GET A SINGLE JOB
export const getJob = async (req, res) => {
  const id = req.params.id; // const {id} = req.params;
  const job = await Job.findById(id);

  // Functionality below taken to the validationMiddleware
  // if (!job) {
  //   // return res.status(404).json({ msg: `No job with id ${id}` });
  //   throw new NotFoundError(`No job with id ${id}`);
  // }

  return res.status(StatusCodes.OK).json({ job });
};

// EDIT/UPDATE JOB
export const updateJob = async (req, res) => {
  const { id } = req.params;
  const updatedJob = await Job.findByIdAndUpdate(id, req.body, {
    new: true, // this ensures the currently just updated job is sent back to front-end
  });
  // Functionality below taken to the validationMiddleware
  // if (!updateJob) throw new NotFoundError(`No job with id ${id}`);

  return res.status(StatusCodes.OK).json({ msg: "Job modified", updatedJob });
};

// DELETE JOB
export const deleteJob = async (req, res) => {
  const deletedJob = await Job.findByIdAndDelete(req.params.id);
  return res.status(StatusCodes.OK).json({ msg: "Job deleted successfully", job: deletedJob });

  // const { id } = req.params;
  // const job = await Job.findById(id);
  // if (!job) {
  //   return res.status(404).json({ msg: `No job with id ${id}` });
  // }
  // await Job.findByIdAndDelete(id);
  // return res.status(200).json({ msg: "Job deleted successfully" });
};


// SHOW STATS
export const showStats = async (req, res) => {
  // First part of response
  let stats = await Job.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
    { $group: { _id: "$jobStatus", count: { $sum: 1 } } },
  ]);
  // console.log(stats)
  // Convert stats above(array of objects) into a single object (removing id in the process)
  stats = stats.reduce((acc, curr) => {
    const { _id: title, count } = curr;
    acc[title] = count;
    return acc;
  }, {});
  // console.log(stats);
  const defaultStats = {
    pending: stats.pending || 0,
    interview: stats.interview || 0,
    declined: stats.declined || 0,
    accepted: stats.accepted || 0
  };

  // Second part of response
  let monthlyApplications = await Job.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
    {
      $group: {
        _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": -1, "_id.month": -1 } },
    { $limit: 6 },
  ]);

  monthlyApplications = monthlyApplications.map((item) => {
      const {_id: { year, month }, count,} = item;
      // day() js starts month at 0 hence -1 and mongodb starts at 1
      const date = day().month(month - 1) .year(year).format("MMM YY");
      return { date, count };
  }).reverse();

  res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications });
};
