import "dotenv/config";
import express from "express";
import { Server } from "socket.io";
import http from "http";
import { routes, sockets } from "./src/routes";
import { setUp } from "src/server/SetUp";
import { setModels } from "src/models/ultils";

var expressApp = express();
const server = http.createServer(expressApp);

setUp(expressApp); // setup server
routes(expressApp); // setup APIs
setModels()

//setup socket.IO
export const io = new Server(server, {
  cors: {
    credentials: true,
  }
});

io.on("open", () => {
  console.log("socket open");
});

try {
  io.on("connection", (socket) => {
    sockets(socket, io);
  });
  io.on("connect_failed", function () { });
} catch (error) {
  console.log("socket connection failed", error)
}

let port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log("Ready on http://localhost:" + port);
});
