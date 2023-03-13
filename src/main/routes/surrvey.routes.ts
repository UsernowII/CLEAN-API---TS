/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from "express";
import { adapterRouter } from "../adapters/express/express-route-adapter";
import { makeAddSurveyController } from "../factories/controllers/add-survey/add-survey-controller-factory";

export default (router: Router): void => {
    router.post("/survey", adapterRouter(makeAddSurveyController()));
};
