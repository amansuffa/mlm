


import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  username:{ type: String, unique: true },
  referralId: { type: String, unique: true },
  referredBy: { type: String, default: null }, 
  status:{type: String, default: "Free Member"}, 
  role: { type: String, default: "user" },
},
{ timestamps: true } );

export const User = mongoose.models.User || mongoose.model("User", userSchema);