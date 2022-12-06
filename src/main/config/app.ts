import express from "express";
import setupMiddaleware from "./middlewares";

const app = express();
setupMiddaleware(app);

export default app;
