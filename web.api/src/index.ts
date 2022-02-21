import express from "express";
import cors from 'cors';
import { setupDatabase } from './database';
import { registerRoutes } from "./routing"

setupDatabase();
const app = express();
app.use(cors());
app.use(express.json());
registerRoutes(app);

const port = process.env.PORT || 5000;
app.listen(port);

console.log("Application Running at: ", port);