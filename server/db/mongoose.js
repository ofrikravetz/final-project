import mongoose from "mongoose";

mongoose.set("strictQuery", true);
mongoose.connect("mongodb+srv://ofriki1234:verysecret123@cluster0.rtkocfi.mongodb.net/user-manager-api?retryWrites=true&w=majority", {
  useNewUrlParser: true,
}, (err) => {
    if (err) {
        console.log(err);
    }
});


