// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema({
//   name: String,
//   email: { type: String, unique: true },
//   password: String,
//   referralId: { type: String, unique: true }, // Unique referral code
//   referredBy: { type: String, default: null }, // Stores the referralId of the user who referred them
//   isActive: { type: Boolean, default: false }
// });

// export const User = mongoose.models.User || mongoose.model("User", userSchema);

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  referralId: { type: String, unique: true }, // Unique referral code
  referredBy: { type: String, default: null }, // Stores the referralId of the user who referred them
  isActive: { type: Boolean, default: false },
  role: { type: String, enum: ["user", "admin"], default: "user" } // ✅ Added role
});

export const User = mongoose.models.User || mongoose.model("User", userSchema);
