/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from "express";
import { adapterRouter } from "../adapters/express/express-route-adapter";
import { makeLoginController } from "../factories/controllers/login/login-controller-factory";
import { makeSignUpController } from "../factories/controllers/signup/signup-controller-factory";

export default (router: Router): void => {
    router.post("/signup", adapterRouter(makeSignUpController()));
    router.post("/login", adapterRouter(makeLoginController()));
};
