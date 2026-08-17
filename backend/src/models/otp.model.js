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
    expiresAt: {
      // TTL index: MongoDB auto-deletes the doc once this time passes,
      // so an old OTP can never be reused/validated after 10 minutes.
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 10 * 60 * 1000),
    },
  },
  { timestamps: true } // yeh createdAt/updatedAt add karega
);

otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const otpModel = mon.model("OTP", otpSchema);

module.exports = otpModel;