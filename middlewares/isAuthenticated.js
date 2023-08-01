const { verifyToken } = require("../helpers/jwt");
const { User } = require("../models");

module.exports = async (req, res, next) => {
  try {
    let { access_token } = req.headers;
    if (!access_token) {
      throw { name: "INVALIDTOKEN" };
    }
    let payload = verifyToken(access_token);
    let user = await User.findByPk(payload.id);
    if (!user) {
      throw { name: "INVALIDTOKEN" };
    }

    req.user = { id: payload.id };

    next();
  } catch (error) {
    next(error);
  }
}