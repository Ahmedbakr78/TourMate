import { Router } from "express";
import authService from "./service/auth.service.js";


const authRouter = Router();

// Sign up
authRouter.post('/signup', authService.signUp);


export { authRouter };