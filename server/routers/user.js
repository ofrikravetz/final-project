import express from "express";
import User from "../models/user.js";
import jwt from "jsonwebtoken";
import auth from "../middleware/auth.js";

const userRouter = new express.Router();

userRouter.patch("/api/users", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(404).send();
  }

  user.password = req.body.password;
  await user.save();
  const token = await user.generateAuthToken();
  let expiresIn = jwt.verify(token, "connection").exp;
  res.send({ user, token, expiresIn });
});

userRouter.post("/api/users/signin", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    const token = await user.generateAuthToken();
    let expiresIn = jwt.verify(token, "connection").exp;
    res.status(201).send({ user, token, expiresIn });
  } catch (e) {
    console.log(e.message);
    res.status(400).send({ error: e.message });
  }
});

userRouter.post("/api/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    let expiresIn = jwt.verify(token, "connection").exp;
    res.send({ user, token, expiresIn });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

userRouter.post("/api/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();

    res.send();
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});

userRouter.get("/api/user/bmreqs", auth, async (req, res) => {
  try {
    await req.user.populate("bmreqs");
    const bmreqs = req.user.bmreqs;
    res.send({ bmreqs, user: req.user });
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});

userRouter.patch("/api/user/email", auth, async (req, res) => {
  try {
    if (!req.body.email) {
      res.status(400).send("invalid updates");
    }
    req.user.email = req.body.email;
    await req.user.save();
    res.send(req.user);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

userRouter.get("/api/users", (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch((e) => {
      res.status(500).send();
    });
});

export default userRouter;
