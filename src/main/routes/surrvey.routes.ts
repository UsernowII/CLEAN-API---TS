/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from "express";
import { adapterRouter } from "../adapters/express/express-route-adapter";
import { makeAddSurveyController } from "../factories/controllers/survey/add-survey/add-survey-controller-factory";
import { makeAuthMiddleware } from "../factories/middlewares/auth-middleware-factory";
import { adapterMiddleware } from "../adapters/express/express-middleware-adapter";

export default (router: Router): void => {
    const adminAuth = adapterMiddleware(makeAuthMiddleware("admin"));
    router.post("/survey", adminAuth, adapterRouter(makeAddSurveyController()));
};
