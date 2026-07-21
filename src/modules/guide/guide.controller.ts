import { Router } from "express";
import guideService from "./service/guide.service.js";
import { authentication } from "../../middlewares/authentication.middleware.js";
import { authorization } from "../../middlewares/authorization.middleware.js";
import { hostUpload } from "../../middlewares/upload.middlewares.js";
import { fileTypes, roleEnum } from "../../common/index.js";

const guideRouter = Router();

// Create guide
guideRouter.post("/create_guide", authentication, authorization([roleEnum.TOURIST]), hostUpload([fileTypes.IMAGE, fileTypes.APPLICATION]).single("certificate"), guideService.createGuide);

// Update guide
guideRouter.patch("/update/:id", authentication, authorization([roleEnum.ADMIN, roleEnum.GUIDE]), guideService.updateGuide);

// delete guide
guideRouter.delete("/delete/:id", authentication, authorization([roleEnum.ADMIN, roleEnum.GUIDE]), guideService.deleteGuide);

// Get guide by id
guideRouter.get("/get/:id", guideService.getGuideById);

// Get all guides
guideRouter.get("/all", guideService.getGuides);

// Search guides
guideRouter.get("/search", guideService.searchGuides);


export { guideRouter };