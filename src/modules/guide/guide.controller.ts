import { Router } from "express";
import guideService from "./service/guide.service.js";
import { authentication } from "../../middlewares/authentication.middleware.js";
import { authorization } from "../../middlewares/authorization.middleware.js";
import { hostUpload } from "../../middlewares/upload.middlewares.js";
import { fileTypes, roleEnum } from "../../common/index.js";

const guideRouter = Router();

// Get all guides
guideRouter.get(
    "/",
    guideService.getGuides
);

// Search guides
guideRouter.get(
    "/search",
    guideService.searchGuides
);

// Get guide by id
guideRouter.get(
    "/:id",
    guideService.getGuideById
);

// Create guide
guideRouter.post(
    "/",
    authentication,
    authorization([roleEnum.ADMIN]),
    guideService.createGuide
);

// Update guide
guideRouter.patch(
    "/:id",
    authentication,
    authorization([roleEnum.ADMIN]),
    guideService.updateGuide
);

// Delete guide
guideRouter.delete(
    "/:id",
    authentication,
    authorization([roleEnum.ADMIN]),
    guideService.deleteGuide
);

// Update availability
guideRouter.patch(
    "/:id/availability",
    authentication,
    authorization([roleEnum.GUIDE, roleEnum.ADMIN]),
    guideService.updateAvailability
);

// Upload certificate
guideRouter.post(
    "/:id/certificate",
    authentication,
    authorization([roleEnum.GUIDE, roleEnum.ADMIN]),
    hostUpload([fileTypes.IMAGE, fileTypes.APPLICATION]).single("certificate"),
    guideService.uploadCertificate
);

// Delete certificate
guideRouter.delete(
    "/:id/certificate",
    authentication,
    authorization([roleEnum.GUIDE, roleEnum.ADMIN]),
    guideService.deleteCertificate
);

export { guideRouter };