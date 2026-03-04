import AppError from "../utlis/apiError.js";
import sendResponse from "../utlis/apiResponse.js";
import User from "./user.Schema.js";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utlis/tokenGenerator.js";

export const Login = async (req, res, next) => {
  let { email, password } = req.body;

  if (!email || !password) {
    throw new AppError("Email and password are required", 400);
  }

  email = email.toLowerCase().trim();

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError("Invalid email or password", 401);
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  res.cookie("accessToken", accessToken, cookieOptionsAccess);
  res.cookie("refreshToken", refreshToken, cookieOptionsRefresh);

  const safeUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  return res.status(200).json({
    success: true,
    message: "Login successful",
    data: safeUser,
  });
};

export const Logout = async (req, res, next) => {
  try {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    return sendResponse(res, 200, true, "Logout Successful");
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};
