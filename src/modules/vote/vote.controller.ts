import { Router } from "express";
import voteService from "./service/vote.service.js";
import { authentication } from "../../middlewares/authentication.middleware.js";

const voteRouter = Router();




export { voteRouter };