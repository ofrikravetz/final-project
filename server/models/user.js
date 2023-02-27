import mongoose from "mongoose";
import validator from "validator";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
const { Schema } = mongoose;

mongoose.set("strictQuery", true);

const userSchema = new Schema({
  email: {
    type: String,
    index: true,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("כתובת המייל אינה תקינה.");
      }
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minLength: 8,
  },
  isAdmin: { type: Boolean, default: false },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

userSchema.virtual("bmreqs", {
  ref: "BmReq",
  localField: '_id',
  foreignField: 'owner',
});

userSchema.methods.generateAuthToken = async function () {
  const token = jwt.sign({ _id: this._id.toString() }, "connection", {
    expiresIn: "7 days",
  });
  this.tokens = this.tokens.concat({ token });
  await this.save();
  return token;
};

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("אחד השדות שהזנת אינם נכונים.");
  }

  const isMatch = await bcryptjs.compare(password, user.password);
  if (!isMatch) {
    throw new Error("אחד השדות שהזנת אינם נכונים.");
  }

  return user;
};

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcryptjs.hash(this.password, 8);
  }

  next();
});

const User = mongoose.model("User", userSchema);

export default User;
