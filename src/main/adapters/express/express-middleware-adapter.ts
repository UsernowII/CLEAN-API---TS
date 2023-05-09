import { NextFunction, Request, Response } from "express";
import { HttpRequest, HttpResponse, Middleware } from "../../../presentation/protocols";

export const adapterMiddleware = (middleware: Middleware) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const httpRequest: HttpRequest = {
            headers: req.headers
        };
        console.log(req.headers, "REQUEST");
        const httpResponse: HttpResponse = await middleware.handle(httpRequest);
        if (httpResponse.statusCode === 200) {
            Object.assign(req, httpResponse.body);
            return next();
        }
        res.status(httpResponse.statusCode).json({
            error: httpResponse.body.message
        });
    };
};
