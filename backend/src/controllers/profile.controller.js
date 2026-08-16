const profileModel = require("../models/profile.model");
const userModel = require("../models/auth.model");
const uploadFile = require("../services/storage.service");

// CREATE profile
async function createProfile(req, res) {
    try {
        const userId = req.user.id;

        const userExists = await userModel.findById(userId);
        if (!userExists) {
            return res.status(404).json({ message: "User not found" });
        }

        const existingProfile = await profileModel.findOne({ user: userId });
        if (existingProfile) {
            return res.status(409).json({ message: "Profile already exists for this user" });
        }

        let profileImageUrl;

        // agar image file bheji hai to imagekit pe upload karo
        if (req.file) {
            const result = await uploadFile(req.file.buffer, req.file.originalname);
            profileImageUrl = result.url;
        }

        const {
            fullName,
            dateOfBirth,
            gender,
            socialMediaLinks,
            bio,
            currentProfession,
            educationStatus,
        } = req.body;

        const profile = await profileModel.create({
            user: userId,
            profileImage: profileImageUrl,
            fullName,
            dateOfBirth,
            gender,
            socialMediaLinks,
            bio,
            currentProfession,
            educationStatus,
        });

        return res.status(201).json({
            message: "Profile created successfully",
            profile,
        });
    } catch (error) {
        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map((e) => e.message);
            return res.status(400).json({ message: messages.join(", ") });
        }
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}

// UPDATE profile
async function updateProfile(req, res) {
    try {
        const profileId = req.params.id;
        const userId = req.user.id;

        const allowedUpdates = [
            "fullName",
            "dateOfBirth",
            "gender",
            "socialMediaLinks",
            "bio",
            "currentProfession",
            "educationStatus",
        ];

        const updates = {};
        for (const key of allowedUpdates) {
            if (req.body[key] !== undefined) {
                updates[key] = req.body[key];
            }
        }

        // agar naya image aaya hai to purana delete kar ke naya upload karo
        if (req.file) {
            const result = await uploadFile(req.file.buffer, req.file.originalname);
            updates.profileImage = result.url;
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ message: "No valid fields provided to update" });
        }

        const profile = await profileModel.findOneAndUpdate(
            { _id: profileId, user: userId },
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!profile) {
            return res.status(404).json({ message: "Profile not found or you do not have permission to update it" });
        }

        return res.status(200).json({
            message: "Profile updated successfully",
            profile,
        });
    } catch (error) {
        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map((e) => e.message);
            return res.status(400).json({ message: messages.join(", ") });
        }
        if (error.name === "CastError") {
            return res.status(400).json({ message: "Invalid profile id" });
        }
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}
// DELETE profile
async function deleteProfile(req, res) {
    try {
        const userId = req.user.id;

        const profile = await profileModel.findOneAndDelete({ user: userId });

        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        return res.status(200).json({ message: "Profile deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}

// GET profile
async function getProfile(req, res) {
    try {
        // Allow fetching your own profile, or another user's via params
        const userId = req.params.userId || req.user.id;

        const profile = await profileModel.findOne({ user: userId }).populate(
            "user",
            "-password" // adjust based on your User schema's fields
        );

        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        return res.status(200).json({ profile });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}

module.exports = {
    createProfile,
    updateProfile,
    deleteProfile,
    getProfile,
};