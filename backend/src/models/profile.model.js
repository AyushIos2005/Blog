const mon = require("mongoose");

const profileSchema = new mon.Schema(
  {
    user: {
      type: mon.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // one profile per user
    },
    profileImage: {
      type: String,
    },
    fullName: {
      type: String,
      required: [true, "Please enter full name"],
    },
    dateOfBirth: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ["M", "F", "Other"],
    },
    socialMediaLinks: [
      {
        type: String,
      },
    ],
    bio: {
      type: String,
    },
    currentProfession: {
      type: String,
    },
    educationStatus: {
      type: String,
      enum: ["High School", "Graduate", "College Student"],
    },
  },
  { timestamps: true }
);

// virtual age, computed from dateOfBirth instead of stored
profileSchema.virtual("age").get(function () {
  if (!this.dateOfBirth) return null;
  const diff = Date.now() - this.dateOfBirth.getTime();
  return Math.abs(new Date(diff).getUTCFullYear() - 1970);
});

profileSchema.set("toJSON", { virtuals: true });
profileSchema.set("toObject", { virtuals: true });

const profileModel = mon.model("Profile", profileSchema);

module.exports = profileModel;