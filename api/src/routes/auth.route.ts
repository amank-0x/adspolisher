import { Router } from "express";
import { resetPasswordWithLink, resetPasswordWithOtp, sendResetLink } from "../controller/auth.controller.js";
import {
  forgotPasswordEmailLimiter,
  forgotPasswordIpLimiter,
  resetPasswordIpLimiter,
} from "../middleware/password-reset-rate-limit.middleware.js";

//api/v1/auth
const authRouter: Router = Router();

authRouter.post(
  "/forget-password",
  forgotPasswordIpLimiter,
  forgotPasswordEmailLimiter,
  sendResetLink,
);

authRouter.post("/reset-password", resetPasswordIpLimiter, resetPasswordWithLink);
authRouter.post("/reset-password/otp", resetPasswordIpLimiter, resetPasswordWithOtp);

export default authRouter;
