const crypto = require("crypto");
const authModel = require("../models/auth.model");
const tokenBlacklistModel = require("../models/blacklist.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { generateOtp, getOtpHtml } = require("../utils/util");
const sendEmail = require("../services/email.service");
const otpModel = require("../models/otp.model");

function hashOtp(otp) {
  return crypto.createHash("sha256").update(otp).digest("hex");
}

function safeCompareHex(a, b) {
  if (!a || !b || a.length !== b.length) return false;
  return crypto.timingSafeEqual(Buffer.from(a, "hex"), Buffer.from(b, "hex"));
}

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 24 * 60 * 60 * 1000,
};

async function UserRegister(req, res) {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Please Provide username, email and password",
      });
    }

    const isUserAlreadyExisted = await authModel.findOne({
      $or: [{ username }, { email }],
    });

    if (isUserAlreadyExisted) {
      return res.status(409).json({ message: "User Already Existed" });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await authModel.create({
      username,
      email,
      password: hash,
    });

    const otp = generateOtp();
    const html = getOtpHtml(otp);
    const otpHash = hashOtp(otp);

    await otpModel.deleteMany({ email });
    await otpModel.create({
      email,
      user: user._id,
      otp: otpHash,
    });

    await sendEmail(email, "OTP Verification", `YOUR OTP CODE IS ${otp}`, html);

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_KEY,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, cookieOptions);

    const { password: _pw, ...safeUser } = user.toObject();

    return res.status(201).json({
      message: "User Successfully Registered",
      user: safeUser, // ✅ password hash ab response mein nahi jayega
      token,
    });
  } catch (err) {
    console.error("UserRegister error:", err.message);
    return res.status(500).json({ message: "Something went wrong" });
  }
}

async function userotpVerfication(req, res) {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "email and otp are required" });
    }

    const user = await authModel.findOne({ email }); // ✅ authModel use kiya
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otpRecord = await otpModel
      .findOne({ email, user: user._id })
      .sort({ createdAt: -1 });

    if (!otpRecord) {
      return res
        .status(400)
        .json({ message: "OTP not found or already used, please request again" });
    }

    const incomingHash = hashOtp(otp);
    if (!safeCompareHex(otpRecord.otp, incomingHash)) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    user.status = true;
    await user.save();

    await otpModel.deleteOne({ _id: otpRecord._id });

    return res.status(200).json({
      message: `${user.email} has been verified`,
    });
  } catch (err) {
    console.error("userotpVerfication error:", err.message);
    return res.status(500).json({ message: "Something went wrong" });
  }
}

async function UserLogin(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "email and Password is required" });
    }

    const user = await authModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_KEY,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, cookieOptions); // ✅ ab consistent cookie options

    return res.status(200).json({
      message: `User ${user.username} LoggedIn Succefully`,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("UserLogin error:", err.message);
    return res.status(500).json({ message: "Something went wrong" });
  }
}

async function getMeController(req, res) {
  try {
    const user = await authModel.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "user detail fetched succesfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("getMeController error:", err.message);
    return res.status(500).json({ message: "Something went wrong" });
  }
}

async function UserLogout(req, res) {
  try {
    const token = req.cookies.token;
    if (token) {
      await tokenBlacklistModel.create({ token });
    }

    res.clearCookie("token");

    return res.status(200).json({ message: "User logged Out successfully" });
  } catch (err) {
    console.error("UserLogout error:", err.message);
    return res.status(500).json({ message: "Something went wrong" });
  }
}

async function changePassword(req, res) {
  try {
    const { oldPassword, newPassword, confirmNewPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmNewPassword) {
      return res
        .status(400)
        .json({ message: "Current and new and confirm password needs" });
    }
    if (newPassword !== confirmNewPassword) {
      return res
        .status(400)
        .json({ message: "new password and confirmNewPassword are not Same" });
    }

    // ✅ authMiddleware pehle se req.user set kar chuka hoga, dubara jwt.verify karne ki zaroorat nahi
    const user = await authModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Current Password is Not matched with Pervious" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("changePassword error:", err.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function forgetPassword(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await authModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = generateOtp();
    const html = getOtpHtml(otp);
    const otpHash = hashOtp(otp); // ✅ ab hash store hoga, plain text nahi

    user.resetOtp = otpHash;
    user.resetOtpExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    await sendEmail(user.email, "Reset Password OTP", `Your OTP is ${otp}`, html);

    return res.status(200).json({ message: "OTP sent successfully." });
  } catch (err) {
    console.error("forgetPassword error:", err.message);
    return res.status(500).json({ message: err.message });
  }
}

async function resetPassword(req, res) {
  try {
    const { email, otp, newPassword, confirmNewPassword } = req.body;

    if (!email || !otp || !newPassword || !confirmNewPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await authModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.resetOtp || !user.resetOtpExpires) {
      return res.status(400).json({ message: "No OTP request found, please request again" });
    }

    if (user.resetOtpExpires < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    const incomingHash = hashOtp(otp);
    if (!safeCompareHex(user.resetOtp, incomingHash)) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetOtp = undefined;
    user.resetOtpExpires = undefined;

    await user.save();

    return res.status(200).json({ message: "Password reset successfully." });
  } catch (err) {
    console.error("resetPassword error:", err.message);
    return res.status(500).json({ message: err.message });
  }
}

module.exports = {
  UserRegister,
  UserLogin,
  getMeController,
  UserLogout,
  userotpVerfication,
  changePassword,
  forgetPassword,
  resetPassword,
};