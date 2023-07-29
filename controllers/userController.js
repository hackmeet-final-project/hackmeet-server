const { comparePassword } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");
const { User } = require("../models");

class UserController {
  static async registerUser(req, res, next) {
    const { email, password } = req.body;
    try {
      const newUser = await User.create({ email, password });
      res.status(201).json({
        userId: newUser.id,
        email: newUser.email,
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    const { email, password } = req.body;
    try {
      if (!email) {
        throw { name: "BADREQUEST", message: "Email is required" };
      }
      if (!password) {
        throw { name: "BADREQUEST", message: "Password is required" };
      }
      let user = await User.findOne({
        where: {
          email,
        },
      });
      if (!user || !comparePassword(password, user.password)) {
        throw { name: "FAILEDLOGIN" };
      }
      let access_token = signToken({ id: user.id });
      res.status(200).json({ access_token });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;
