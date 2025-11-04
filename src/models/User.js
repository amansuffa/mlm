import mongoose from "mongoose";
import { payoutMethodSchema } from "./PayoutMethod.js";

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    username: { type: String, unique: true },
    referredBy: { type: String, default: null },

    sponsor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    hasFirstSale: { type: Boolean, default: false },
    firstSaleLocked: { type: Boolean, default: false },
    firstSaleLockedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    firstSaleLockedAt: { type: Date, default: null },

    status: {
      type: String,
      enum: ["free", "admin_fee_paid", "membership_paid", "fully_active"],
      default: "free",
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String, default: null },

    adminFeePaid: { type: Boolean, default: false },
    membershipFeePaid: { type: Boolean, default: false },

    payoutMethods: [payoutMethodSchema],
    
    firstName: { type: String, default: "" },
    middleName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    profilePicture: { type: String, default: "" },
    phone: {
      countryCode: { type: String, default: "" },
      number: { type: String, default: "" },
    },
    address: {
      country: { type: String, default: "" },
      province: { type: String, default: "" },
      city: { type: String, default: "" },
    },
    socialMedia: {
      facebook: { type: String, default: "" },
      instagram: { type: String, default: "" },
      tiktok: { type: String, default: "" },
      whatsapp: { type: String, default: "" },
    },
    pendingEmail: { type: String, default: "" },
    emailChangeToken: { type: String, default: "" },
    emailChangeExpires: { type: Date, default: null },

    // Fee Distribution Fields
    directInvitesCount: { type: Number, default: 0 }, 
    earnings: {
      total: { type: Number, default: 0 }, 
    },
    passupReferrals: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    //   notifications: [{
    //     type: { type: String },
    //     message: String,
    //     read: { type: Boolean, default: false },
    //     createdAt: { type: Date, default: Date.now },
    //   }],
  },
  { timestamps: true }
);

// /* INDEXES for Performance */
// userSchema.index({ sponsor: 1 });       // For fast downline/referral queries
// userSchema.index({ username: 1 });     // For login & affiliate link lookups
// userSchema.index({ email: 1 });        // For login & duplicate check
// userSchema.index({ affiliateId: 1 }, { unique: true });
// userSchema.index({ role: 1 });         // For admin/member filter pages
// userSchema.index({ membershipStatus: 1 }); // For filtering active/inactive members

export const User = mongoose.models.User || mongoose.model("User", userSchema);
