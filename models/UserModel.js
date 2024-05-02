import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  lastName: {
    type: String,
    default: "last name",
  },
  location: {
    type: String,
    default: "my city",
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  avatar: String,
  avatarPublicId: String,
});

// Removing the password property from every User instance created - this helps to send
// user data to the frontend that does not have password in it - for security purposes
UserSchema.methods.toJSON = function () {
  // function key word needed in order to use this keyword inside the function, arrow function will give errors when this is used inside
  var obj = this.toObject(); // this.toObject(); is instance of User Schema
  delete obj.password;
  return obj;
};

export default mongoose.model("User", UserSchema);
