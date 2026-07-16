import 'dotenv/config';
import express, { NextFunction, Request, Response } from "express";
import * as controllers from "./modules/controller.index.js";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import { dbConnection } from './db/db.connection.js';
import { failedResponse, httpException } from './utils/index.js';

const app = express();
await dbConnection();

app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json());

app.use('/auth', controllers.authRouter);
app.use('/admin', controllers.adminRouter);
app.use('/driver', controllers.driverRouter);
app.use('/guide', controllers.guideRouter);
app.use('/lost_item', controllers.lostItemRouter);
app.use('/notifications', controllers.notificationRouter);
app.use('/place', controllers.placeRouter);
app.use('/review', controllers.reviewRouter);
app.use('/trip', controllers.tripRouter);
app.use('/user', controllers.userRouter);
app.use('/vehicle', controllers.vehicleRouter);
app.use('/vote', controllers.voteRouter);

app.get("/", (_, res) => {
    res.json({
        success: true,
        message: "TourMate API is running"
    });
});


app.use((req: Request, res: Response) => {
    return res.status(404).json(failedResponse("Route not found", 404));
});


app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {

    console.error(err);
    if (err instanceof httpException) {
        return res.status(err.statusCode).json(failedResponse(err.message, err.statusCode, err.error));
    }
    return res.status(500).json(failedResponse("Internal Server Error", 500, err));

});


app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});