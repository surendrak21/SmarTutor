// backend/middleware/authenticate.js
const jwt = require("jsonwebtoken");
const User = require("../model/UserSchema");

const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies?.jwtoken;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const rootUser = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });

    if (!rootUser) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }

    req.token = token;
    req.rootUser = rootUser;
    req.userID = rootUser._id;
    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    return res.status(401).json({ error: "Unauthorized" });
  }
};

module.exports = authenticate;
