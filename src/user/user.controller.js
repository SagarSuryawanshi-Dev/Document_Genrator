import AppError from "../utlis/apiError.js";
import sendResponse from "../utlis/apiResponse.js";
import User from "./user.Schema.js";
import bcrypt from "bcrypt";

// V1 - Simple Authentication (No JWT)
// Session will be stored in memory or using express-session

export const Register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      throw new AppError("Name, email and password are required", 400);
    }

    if (password.length < 6) {
      throw new AppError("Password must be at least 6 characters", 400);
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      throw new AppError("Email already registered", 409);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: "user"
    });

    // Return user without password
    const safeUser = await User.findById(user._id).select("-password");

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      data: safeUser
    });

  } catch (error) {
    next(error);
  }
};

export const Login = async (req, res, next) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      throw new AppError("Email and password are required", 400);
    }

    email = email.toLowerCase().trim();

    // Find user with password
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new AppError("Invalid email or password", 401);
    }

    // V1: Store user session (simple approach)
    // In V1, we'll just send user data back and let frontend handle it
    // V2 will use JWT tokens

    const safeUser = await User.findById(user._id).select("-password");

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: safeUser
    });

  } catch (error) {
    next(error);
  }
};

export const Logout = async (req, res, next) => {
  try {
    // V1: Simple logout (frontend will clear user data)
    // V2 will clear JWT tokens from cookies

    return sendResponse(res, 200, true, "Logout successful");

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