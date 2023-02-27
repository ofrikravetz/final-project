import mongoose from "mongoose";
const { Schema } = mongoose;

mongoose.set("strictQuery", true);

const bmReqSchema = new Schema({
  headline: {
    type: String,
    required: true,
    trim: true,
  },
  reason: {
    type: String,
    required: true,
    trim: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  isApproved: {
    type: Boolean,
    required: false,
    default: false,
  },
  isOpen: {
    type: Boolean,
    default: true,
  },
  time: {
    type: Date,
    required: true,
  },
  declineReason : {
    type: String,
    required: false
  }
});

const BmReq = mongoose.model("BmReq", bmReqSchema);

export default BmReq;
