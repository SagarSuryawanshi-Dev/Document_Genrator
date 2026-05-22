import jwt from "jsonwebtoken";

export const cookieOptionsAccess = {
  httpOnly: true,
  secure: false,
  sameSite: "lax",
};

export const generateAccessToken = (user) => {

  return jwt.sign(
    {
      // NEW V2 CLAIMS
      id: user._id,
      email: user.email,
      role: user.role,

      // BACKWARD COMPATIBILITY FOR V1
      userId: user._id,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "1d",
    }
  );
};

export const generateRefreshToken = (user) => {

  return jwt.sign(
    {
      // V2
      id: user._id,

      // V1 compatibility
      userId: user._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

// import jwt from "jsonwebtoken";

// export const cookieOptionsAccess = {
//   httpOnly: true,
//   secure: false, // true only in HTTPS
//   sameSite: "lax",
// }

// export const generateAccessToken = (userId) => {
//   return jwt.sign(
//     { id: userId }, 
//     process.env.ACCESS_TOKEN_SECRET,
//     { expiresIn: "1d" }
//   );
// };

// export const generateRefreshToken = (userId) => {
//   return jwt.sign(
//     { id: userId },
//     process.env.REFRESH_TOKEN_SECRET,
//     { expiresIn: "7d" }
//   );
// };