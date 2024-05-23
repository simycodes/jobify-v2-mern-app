import { Router } from "express"
import rateLimiter from "express-rate-limit";
import { login, register, logout } from "../controllers/authController.js";
import { validateRegisterInput, validateLoginInput } from "../middleware/validationMiddleware.js";

const router = new Router();

// helps control and limit the rate of incoming requests from a specific IP address
// to protect the server from abuse, brute-force attacks, and potential denial-of-service (DoS) attacks
const apiLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15,
  message: { msg: "IP rate limit exceeded, retry in 15 minutes." },
});

router.post("/register",apiLimiter, validateRegisterInput, register);
router.post("/login",apiLimiter, validateLoginInput, login);
router.get("/logout", logout);

export default router;





