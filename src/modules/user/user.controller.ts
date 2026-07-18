import { Router } from "express";
import userService from "./service/user.service.js";
import { authentication } from "../../middlewares/authentication.middleware.js";


const userRouter = Router();

// Get user by id
userRouter.get("/:id", userService.getUserById)

// Get current user id
userRouter.get("/current_user_id", authentication, userService.getCurrentUserId);

// Update user
userRouter.patch("/update_users", authentication, userService.updateUser);

// Get users
userRouter.get("/lists", authentication, userService.getUsers);

// Upload profile image
userRouter.post("/profile_image", authentication, userService.uploadProfileImage);

// Delete profile image
userRouter.delete("/profile_image", authentication, userService.deleteProfileImage);

// Delete account
userRouter.delete("/delete_account", authentication, userService.deleteAccount);

export { userRouter };