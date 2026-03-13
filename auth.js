const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // Expect token in Authorization header: "Bearer <token>"
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    // Attach decoded user payload to request for downstream use
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
  }
};