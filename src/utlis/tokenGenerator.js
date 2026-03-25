import jwt from "jsonwebtoken";


export const cookieOptionsAccess = {
  httpOnly: true,
  secure: false, // true only in HTTPS
  sameSite: "lax",
}

export const generateAccessToken = (userId) => {
  return jwt.sign(
    { id: userId }, 
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1d" }
  );
};

export const generateRefreshToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
};
