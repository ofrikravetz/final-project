import express from "express";
import BmReq from "../models/bmreq.js";
import auth from "../middleware/auth.js";
import User from "../models/user.js";

const bmReqRouter = new express.Router();

bmReqRouter.post("/api/reqs", auth, async (req, res) => {
  //   const bmReq = new BmReq(req.body);
  const bmReq = new BmReq({
    ...req.body,
    owner: req.user._id,
  });

  try {
    await bmReq.save();
    const io = req.app.get("socketio");
    io.emit("reqAdded");
    res.status(201).send({ bmReq });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

bmReqRouter.get("/api/reqowner/:id", auth, async (req, res) => {
  if (!req.user.isAdmin && !req.params.id === req.user._id) {
    return res.status(401).send();
  }
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

bmReqRouter.patch("/api/reqs/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["declineReason", "isApproved", "isOpen"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation || !req.user.isAdmin) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    const bmReq = await BmReq.findOne({ _id: req.params.id });
    updates.forEach((update) => (bmReq[update] = req.body[update]));
    await bmReq.save();

    if (!bmReq) {
      return res.status(400).send();
    }

    res.send(bmReq);
  } catch (e) {
    res.status(400).send();
  }
});

bmReqRouter.get("/api/reqs", auth, async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(401).send();
  }
  const match = {};

  if (req.query) {
    const filters = req.query;
    for (const key in filters) {
      match[key] = filters[key];
    }
  }

  let limit;
  if (req.query.limit) {
    delete match.limit;
    limit = req.query.limit;
  } else {
    limit = 50;
  }

  let order = "desc";
  if (req.query.sort) {
    delete match.sort;
    order = req.query.sort;
  }

  if (req.query.headline === "all") {
    delete match.headline;
  }

  if (req.query.isopen) {
    match.isOpen = req.query.isopen === "true";
  }

  let more = false;
  try {
    const reqs = await BmReq.find({ ...match })
      .limit(limit + 1)
      .sort({ time: order }).populate('owner');
    if (reqs.length > limit) {
      more = true;
      reqs.length = limit;
    }
    res.send({ reqs, more });
  } catch (e) {
    console.log(e.message);
    res.status(401).send({ error: e.message });
  }
});

bmReqRouter.get("/api/reqs/:id", auth, async (req, res) => {
  try {
    const bmReq = await BmReq.findOne({ _id: req.params.id });
    if (!req.user.isAdmin && !bmReq.owner._id === req.user._id) {
      return res.status(401).send();
    }

    if (!bmReq) {
      return res.status(404).send();
    }

    res.send(bmReq);
  } catch (e) {
    res.status(400).send();
  }
});

export default bmReqRouter;
