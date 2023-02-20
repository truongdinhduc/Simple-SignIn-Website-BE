import express from "express";
import { getServerInformation } from "src/controllers/ServerController";

/* Các controllers */
import { getMyInformation, signIn, signInWithGoogle, signUp } from "src/controllers/UserController";
import { createRoute } from "src/server/CreateRoute";

const routes = (app: express.Application) => {
    createRoute(app, 'GET', '', getServerInformation)
    createRoute(app, 'POST', 'user/sign-in', signIn)
    createRoute(app, 'POST', 'user/sign-in-with-google', signInWithGoogle)
    createRoute(app, 'POST', 'user/sign-up', signUp)
    createRoute(app, 'GET', 'user/my-information', getMyInformation)
}

// Các kết nối realtime
const sockets = (socket: any, io: any) => {
    try {
        io.on("connect_failed", function () {});
    } catch (err) {
        console.log(err)
    }  
}

export {
    routes,
    sockets
};