import { Router } from "express";
import authService from "./service/auth.service.js";
import { authentication } from "../../middlewares/authentication.middleware.js";


const authRouter = Router();

// Sign up
authRouter.post('/signup', authService.signUp);

//confirm email
authRouter.post('/confirm_email', authService.confirmEmail);

//send otp again
authRouter.post('/send_otp_again', authService.sendOtpAgain);

// Login
authRouter.post("/signin", authService.signIn);

// Refresh Access Token
authRouter.post("/refresh_token", authService.refreshToken);

// Logout
authRouter.post("/logout", authentication, authService.logOut);

// Forgot Password
authRouter.post("/forgot_password", authService.forgotPassword);

// Reset Password
authRouter.patch("/reset_password", authService.resetPassword);

// Change Password
authRouter.patch("/change_password", authentication, authService.changePassword);

// Verify Reset Code
authRouter.post("/verify_reset_code", authService.verifyResetCode);

// Get Logged In User
authRouter.get("/me", authentication, authService.getLoggedInUser);

export { authRouter };