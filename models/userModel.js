const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SALT_ROUNDS = 10;

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "User name is a required field"],
      maxLength: [40, "User name length cannot exceed more than 40 character"],
    },
    email: {
      type: String,
      required: [true, "User email is a required data field"],
      unique: true,
      trim: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "email provided is invalid",
      ],
    },
    password: {
      type: String,
      required: [true, "password is a required data field"],
    },
    image: {
      public_id: String,
      url: String,
    },
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "address",
      autopopulate: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      value: Number,
      expiresAt: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Auto populate Address
UserSchema.plugin(require("mongoose-autopopulate"));

UserSchema.methods.matchPassword = async function (givenPass) {
  return await bcrypt.compare(givenPass, this.password);
};
UserSchema.methods.generateToken = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};
UserSchema.index({ "otp.expiresAt": 1 }, { expireAfterSeconds: 0 });
UserSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
  next();
});

const User = mongoose.model("user", UserSchema);
module.exports = User;
