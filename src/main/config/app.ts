import express from "express";
import setupMiddaleware from "./middlewares";
import setupRoutes from "./routes";

const app = express();
setupMiddaleware(app);
setupRoutes(app);

export default app;
