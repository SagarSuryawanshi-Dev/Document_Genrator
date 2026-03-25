import AppError from "../utlis/apiError.js";
import sendResponse from "../utlis/apiResponse.js";
import User from "./user.Schema.js";
import bcrypt from "bcrypt";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utlis/tokenGenerator.js";

export const Login = async (req, res, next) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError("Email and password are required", 400));
    }

    email = email.toLowerCase().trim();

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new AppError("Invalid email or password", 401));
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return next(new AppError("Invalid email or password", 401));
    }

    //  FIXED
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({

      success: true,
      message: "Login successful",
      accessToken,
      user
    });

  } catch (error) {
    next(error);
  }
};

export const Logout = async (req, res, next) => {
  try {
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax", // 🔥 IMPORTANT (not Strict for dev)
    };

    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);

    return sendResponse(res, 200, true, "Logout Successful");
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};

// Get current user profile (for protected routes)
export const GetProfile = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      throw new AppError("User ID is required", 400);
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      data: user
    });

  } catch (error) {
    next(error);
  }
};

// Update user profile
export const UpdateProfile = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { name, email, role } = req.body;

    if (!userId) {
      throw new AppError("User ID is required", 400);
    }

    const updateData = {};

    if (name) updateData.name = name.trim();
    if (email) updateData.email = email.toLowerCase().trim();

    // 👇 Add this line to allow role update
    if (role) updateData.role = role;

    if (Object.keys(updateData).length === 0) {
      throw new AppError("No data provided to update", 400);
    }

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { returnDocument: "after", runValidators: true }
    ).select("-password");

    if (!user) {
      throw new AppError("User not found", 404);
    }
    console.log("BODY:", req.body);
    console.log("REQ BODY:", req.body);
    console.log("ROLE:", req.body.role);

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: user
    });

  } catch (error) {
    next(error);
  }
};
