import 'dotenv/config';
import express from "express";
import { dbConnection } from './db/db.connection.js';


const app = express();
dbConnection();





app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});