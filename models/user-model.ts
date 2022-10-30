import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  screenName: String,
  facebookId: String,
  profileImageUrl: String,
});

const User = mongoose.model("users", userSchema);

export default User;
