import jwt from "jsonwebtoken";
import User from "../user/user.Schema.js";
import AppError from "../utlis/apiError.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    //  Get token from headers OR cookies
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    //  If no token
    if (!token) {
      return next(new AppError("Not authorized. Please login.", 401));
    }

    //  Verify token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log("Decoded JWT:", decoded);

    //  Get user from DB
    const user = await User.findById(decoded.id).select("-password");
    console.log("User Found:", user);

    if (!user) {
      return next(new AppError("User no longer exists", 401));
    }

    //  Attach user to request
    req.user = user;

    next();
  } catch (error) {
    return next(new AppError("Invalid or expired token", 401));
  }
};