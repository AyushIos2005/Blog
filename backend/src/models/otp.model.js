const mon = require('mongoose');

const otpSchema = new mon.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    user: {
      type: mon.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
  },
  { timestamps: true } // yeh createdAt/updatedAt add karega
);

const otpModel = mon.model("OTP", otpSchema);

module.exports = otpModel;