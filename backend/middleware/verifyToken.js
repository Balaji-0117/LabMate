const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {

    try {

        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                error: "Access denied"
            });
        }

        const token = authHeader.split(" ")[1];

        const verified = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = verified;

        next();

    } catch (err) {

        res.status(401).json({
            error: "Invalid token"
        });
    }
};

module.exports = verifyToken;
module.exports.checkRole = (...allowedRoles) => (req, res, next) => {
  if (!req.user || !allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};