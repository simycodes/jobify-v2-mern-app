import { Router } from 'express';
const router = Router();
import { validateJobInput, validateIdParam } from "../middleware/validationMiddleware.js";
import { checkForTestUser } from '../middleware/authMiddleware.js';

// Get all job controllers
import { getAllJobs, createJob, getJob, updateJob, deleteJob, showStats } from '../controllers/jobController.js';


router.get('/', getAllJobs);
router.post("/", checkForTestUser, validateJobInput, createJob);
router.get("/stats", showStats); // always placed before :id to avoid param errors in connection to :id as express reads from top to bottom
router.get("/:id", validateIdParam, getJob);
router.patch("/:id", checkForTestUser, validateIdParam, validateJobInput, updateJob);
router.delete("/:id", checkForTestUser, validateIdParam, deleteJob);


// router.route('/').get(getAllJobs).post(createJob);
// router.route('/:id').get(getJob).patch(updateJob).delete(deleteJob);

export default router;