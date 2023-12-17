/* Third Party Libraries */
require("dotenv").config();
const path = require("path");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
/* Third Party Libraries */

/* Local Files */
const secret = process.env.JWT_SECRET;
/* Local Files */

let ContractorRegistrationSchema = new Schema(
  {
    fullName: {
      type: String,
      default: null,
      trim: true,
    },
    userName: {
      type: String,
      default: null,
      trim: true,
    },
    companyName: {
      type: String,
      default: null,
      trim: true,
    },
    companyLogo: {
      type: String,
      default: null,
    },
    countryCode: {
      type: String,
      default: null,
    },
    phone: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      default: null,
    },
    password: {
      type: String,
      select: false,
      default: null,
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
    otp: {
      type: Number,
      default: null,
    },
    otpGeneratedAt: {
      type: Date,
      default: null,
    },
    isOtpVerified: {
      type: Boolean,
      default: false,
    },
    resetPasswordOtp: {
      type: Number,
      default: null,
    },
    resetPasswordOtpGeneratedAt: {
      type: Date,
      default: null,
    },
    isResetPasswordOtpVerified: {
      type: Boolean,
      default: false,
    },
    emailToken: {
      type: String,
      default: null,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isOnboardCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

ContractorRegistrationSchema.methods.generateToken = function (session) {
  let contractor = this;
  const access = "auth";
  const token = jwt
    .sign(
      {
        _id: contractor._id.toHexString(),
        access,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30, /// 30 Days
      },
      secret
    )
    .toString();

  contractor.tokens.push({
    access,
    token,
  });

  return contractor.save({ session }).then(() => {
    return contractor;
  });
};

ContractorRegistrationSchema.statics.findByToken = function (token) {
  const contractor = this;
  const decoded = jwt.verify(token, secret);
  return contractor.findOne({
    _id: decoded._id,
    "tokens.token": token,
  });
};

module.exports = mongoose.model(
  "ContractorRegistration",
  ContractorRegistrationSchema
);
