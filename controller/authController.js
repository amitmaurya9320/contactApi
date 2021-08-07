const createError = require("http-errors");
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require("../helper/jwt_helper");
const { registerSchema, loginSchema } = require("../helper/validationSchema");
const User = require("../model/User");
module.exports = {
  register: async (req, res, next) => {
    try {
      const result = await registerSchema.validateAsync(req.body);
      const doesExist = await User.findOne({
        $or: [{ email: result.email }, { userName: result.userName }],
      });

      if (doesExist) {
        throw createError.Conflict(
          `${
            doesExist === result.email ? result.email : result.userName
          }  already exist`
        );
      }

      const user = new User(result);
      const saveUser = await user.save();
      const { password, ...others } = saveUser._doc;
      const accessToken = await signAccessToken(saveUser.id);
      const refreshToken = await signRefreshToken(saveUser.id);
      res.status(200).json({ user: others, accessToken, refreshToken });
    } catch (err) {
      if (err.isJoi === true) err.status = 422;
      next(err);
    }
  },
  login: async (req, res, next) => {
    try {
      const result = await loginSchema.validateAsync(req.body);

      const user = await User.findOne({ userName: result.userName });

      if (!user) throw createError.NotFound("User not register");

      const isMatch = await user.isValidPassword(result.password);

      if (!isMatch)
        throw createError.Unauthorized("Username/password not valid");

      const accessToken = await signAccessToken(user.id);
      const refreshToken = await signRefreshToken(user.id);
      const { password, ...others } = user._doc;
      res.status(200).send({ user: others, accessToken, refreshToken });
    } catch (err) {
      next(err);
    }
  },
  refreshToken: async (req, res, next) => {
    try {
      const refreshToken = req.body.refreshToken;

      if (!refreshToken) throw createError.BadRequest();

      const userId = await verifyRefreshToken(refreshToken);

      const accessToken = await signAccessToken(userId);
      const refToken = await signRefreshToken(userId);
      res.send({ accessToken, refreshToken: refToken });
    } catch (err) {
      next(err);
    }
  },
  logout: async (req, res, next) => {
    res.status(200).json({ status: "logout success" });
  },
};
