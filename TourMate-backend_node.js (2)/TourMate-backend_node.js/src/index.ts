import 'dotenv/config';
import {createServer} from "http";
import path from "path";
import { fileURLToPath } from "url";

import express, { NextFunction, Request, Response } from "express";
import * as controllers from "./modules/controller.index.js";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import { dbConnection } from './db/db.connection.js';
import { failedResponse, httpException } from './utils/index.js';
import { initSocket } from './socket/socket.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
await dbConnection();

app.use(cors());
app.use(helmet({ contentSecurityPolicy: false }));
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
app.use('/location', controllers.locationRouter);

const distPath = path.resolve(__dirname, '../../../tourmate_frontend/tourmate-frontend/dist/tourmate-frontend');
app.use(express.static(distPath));

app.use((req: Request, res: Response) => {
    return res.sendFile(path.join(distPath, 'index.html'));
});

app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {

    console.error(err);
    if (err instanceof httpException) {
        return res.status(err.statusCode).json(failedResponse(err.message, err.statusCode, err.error));
    }
    return res.status(500).json(failedResponse("Internal Server Error", 500, err));

});

const server = createServer(app);
initSocket(server);

server.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});