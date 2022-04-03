const jwt = require("jsonwebtoken");
const models = require("../models");

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, `${process.env.JWT_SECRET_KEY}`);
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      throw "Invalid user ID";
    } else {
      const user = await models.User.findOne({
        where: { id: userId },
      });
      if (!user) {
        throw "User not found";
      }
      res.locals.user = user;
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error("Invalid request!"),
    });
  }
};
