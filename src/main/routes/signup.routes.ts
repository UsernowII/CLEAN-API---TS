import { Router } from "express";
import { makeSignUpController } from "../factories/signup/signup-factory";
import { adapterRouter } from "../adapters/express/express-route-adapter";

export default (router: Router): void => {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    router.post("/signup", adapterRouter(makeSignUpController()));
};
