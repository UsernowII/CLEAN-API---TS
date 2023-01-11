import { Router } from "express";
import { makeSignUpController } from "../factories/signup/signup";
import { adapterRouter } from "./adapters/express-route-adapter";

export default (router: Router): void => {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    router.post("/signup", adapterRouter(makeSignUpController()));
};
