const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const config = require("./config");
const { tokenTypes } = require("./appConstant");
const { User } = require("../models");
const { userType } = require("./appConstant");

const jwtOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (payload, done) => {
  try {
    if (payload.type !== tokenTypes.ACCESS) {
      throw new Error("Invalid token type");
    }
    let user;
    switch (payload.role) {
      case userType.USER:
        user = await User.findOne({ _id: payload.sub }).lean();
        break;
      case userType.ADMIN:
        user = await User.findOne({
          _id: payload.sub,
          userType: userType.ADMIN,
        }).lean();
        break;
      default:
        user = null;
    }
    user.role = payload.role;
    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (error) {
    done(error, false);
  }
};


const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

module.exports = {
  jwtStrategy,
};
