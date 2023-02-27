import express from "express";
import "./db/mongoose.js";
import http from "http";
import { Server } from "socket.io";
import userRouter from "./routers/user.js";
import bmReqRouter from "./routers/bmreq.js";
import cors from "cors";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});
const port = 1234;

app.use(express.json());
app.use(cors());
app.use(userRouter);
app.use(bmReqRouter);

app.set('socketio', io);

server.listen(port, () => {
  console.log(`listening on port ${port}`);
});
