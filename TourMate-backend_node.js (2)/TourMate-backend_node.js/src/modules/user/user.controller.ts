import { Router } from "express";
import userService from "./service/user.service.js";
import { authentication } from "../../middlewares/authentication.middleware.js";
import { authorization } from "../../middlewares/authorization.middleware.js";
import { roleEnum } from "../../common/index.js";
import { hostUpload } from "../../middlewares/upload.middlewares.js";


const userRouter = Router();

// Get current user id
userRouter.get("/current_user_id", authentication, userService.getCurrentUserId);

// Get users
userRouter.get("/users", authentication, authorization([roleEnum.ADMIN]), userService.getUsers);

// Update user
userRouter.put("/update_user", authentication, userService.updateUser);

// Upload profile image
userRouter.post("/profile_image", authentication,hostUpload(["image"]).single("profile_image"), userService.uploadProfileImage);

// Delete profile image
userRouter.delete("/delete_image", authentication, userService.deleteProfileImage);

// Delete account
userRouter.delete("/delete_account", authentication, userService.deleteAccount);

// Get user by id
userRouter.get("/:id", userService.getUserById)

export { userRouter };