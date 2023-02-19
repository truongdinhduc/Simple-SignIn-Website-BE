import express from "express";
import cors from "cors";
import { connectToMongoDB } from "./ConnectToDatabase";

const setUp = (app: express.Application) => {
    app.use(cors());
    app.use(express.json()); // to support JSON-encoded bodies
    app.use(
        express.urlencoded({
            // to support URL-encoded bodies
            extended: true,
        })
    );

    app.use(function (req: express.Request, res: express.Response, next: express.NextFunction) {
        // Website you wish to allow to connect
        res.setHeader("Access-Control-Allow-Origin", "*");

        // Request methods you wish to allow
        res.setHeader(
            "Access-Control-Allow-Methods",
            "GET, POST, OPTIONS, PUT, PATCH, DELETE"
        );

        // Request headers you wish to allow
        res.setHeader(
            "Access-Control-Allow-Headers",
            "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization"
        );
        next();
    });

    // Connect to database
    connectToMongoDB((process.env.DATABASE_URL), () => { });
    return app;
};

export {
    setUp,
};
