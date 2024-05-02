import express from 'express';
import { getCurrentUser, getApplicationStats, updateUser } from '../controllers/userController.js';
import { validateUserUpdate } from '../middleware/validationMiddleware.js';
import { authorizePermissions } from '../middleware/authMiddleware.js';
import upload from "../middleware/multerMiddleware.js";
import { checkForTestUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get("/current-user", getCurrentUser); // [] just nicely groups middlewares - may be removed, no errors
router.get("/admin/app-stats", [authorizePermissions("admin"), getApplicationStats]);
router.patch("/update-user", checkForTestUser, upload.single("avatar"), validateUserUpdate, updateUser);

export default router;