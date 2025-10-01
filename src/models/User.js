import mongoose from "mongoose";
import { payoutMethodSchema } from "./PayoutMethod.js";


const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  username:{ type: String, unique: true }, 
  referredBy: { type: String, default: null },
  status:{
    type: String,
    enum: ["free", "admin_fee_paid", "membership_paid", "fully_active"],
    default: "free",
  },
    role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  
  adminFeePaid: { type: Boolean, default: false },
  membershipFeePaid: { type: Boolean, default: false },
  payoutMethods: [payoutMethodSchema],
},
{ timestamps: true } );

export const User = mongoose.models.User || mongoose.model("User", userSchema);


// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema({
//   username: { type: String, required: true },
//   email: { type: String, required: true },
//   passwordHash: { type: String, required: true },

//   role: {
//     type: String,
//     enum: ["admin", "member"],
//     default: "member",
//   },
//   membershipStatus: {
//     type: String,
//     enum: ["free", "admin_fee_paid", "membership_paid", "fully_active"],
//     default: "free",
//   },

//   sponsor: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     default: null,
//   },

//   payoutMethods: [{
//     method: String,
//     details: mongoose.Schema.Types.Mixed,
//   }],

//   socialLinks: {
//     facebook: String,
//     twitter: String,
//     instagram: String,
//     linkedin: String,
//   },

//   downline: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//   }],

//   directReferrals: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//   }],

//   passedUpReferrals: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//   }],

//   adminFeePaid: { type: Boolean, default: false },
//   membershipFeePaid: { type: Boolean, default: false },

//   affiliateId: { type: String },

//   profileImage: { type: String, default: '/images/default-avatar.png' },

//   earnings: {
//     total: { type: Number, default: 0 },
//     available: { type: Number, default: 0 },
//     withdrawn: { type: Number, default: 0 },
//   },

//   notifications: [{
//     type: { type: String },
//     message: String,
//     read: { type: Boolean, default: false },
//     createdAt: { type: Date, default: Date.now },
//   }],
// }, { timestamps: true });

// /* INDEXES for Performance */
// userSchema.index({ sponsor: 1 });       // For fast downline/referral queries
// userSchema.index({ username: 1 });     // For login & affiliate link lookups
// userSchema.index({ email: 1 });        // For login & duplicate check
// userSchema.index({ affiliateId: 1 }, { unique: true });
// userSchema.index({ role: 1 });         // For admin/member filter pages
// userSchema.index({ membershipStatus: 1 }); // For filtering active/inactive members

// export const User = mongoose.models.User || mongoose.model("User", userSchema);

