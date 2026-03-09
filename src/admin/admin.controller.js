import AppError from "../utlis/apiError.js";
import sendResponse from "../utlis/apiResponse.js";
import User from "../user/user.Schema.js";
import bcrypt from "bcrypt";


export const Signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return next(new AppError("All fields are required", 400));
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError("User already exists", 409));
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    user.password = undefined;

    return sendResponse(res, 201, true, "User created successfully", user);
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

export const getAllUsers = async (req,res,next) => {
  try {
     const users = await User.find().select("-password").sort({ createdAt: -1 })
     
     return sendResponse(res,200,"user fetched successfully",users)

  } catch (error) {
    return next(new AppError(error.message, 500));
  }
}
