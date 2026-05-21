import jwt from "jsonwebtoken";

export const cookieOptionsAccess = {
  httpOnly: true,
  secure: false,
  sameSite: "lax",
};

export const generateAccessToken = (user) => {

  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "1d"
    }
  );
};

export const generateRefreshToken = (user) => {

  return jwt.sign(
    {
      id: user._id
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7d"
    }
  );
};