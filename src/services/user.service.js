const { User } = require("../models");

const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    const user = await findOneAndUpdate(
      { email: userBody.email },
      { name: userBody.name }
    );
    return user;
  } else {
    const user = await User.create(userBody);
    return user;
  }
};

module.exports = {
  createUser
};
