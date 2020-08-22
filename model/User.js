const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { string } = require("@hapi/joi");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  email: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  password: {
    type: String,
    required: true,
    min: 6,
    max: 1024,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'UserRole',
  }
},{
  timestamps: true
});

userSchema.method('generateVerifyEmailToken', function () {
  var token = jwt.sign(
    {
      email: this.email,
      id: this._id,
      slug: 'antridoc-email-token',
    },
    process.env.TOKEN_SECRET
  );

  return token;
});

userSchema.method('generateForgotPasswordToken', function () {
  var token = jwt.sign(
    {
      email: this.email,
      id: this._id,
      slug: 'antridoc-forgot-password-token',
    },
    process.env.TOKEN_SECRET
  );

  return token;
});

module.exports = mongoose.model("User", userSchema);
