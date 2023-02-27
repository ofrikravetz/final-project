import express from "express";
import "./db/mongoose.js";
import userRouter from "./routers/user.js";
import bmReqRouter from './routers/bmreq.js'

const app = express();
const port = 1234;

app.use(express.json());
app.use(userRouter);
app.use(bmReqRouter);


app.listen(port, () => {
  console.log(`listening on port ${port}`);
});