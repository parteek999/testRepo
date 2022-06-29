const { User } = require("../models/index");
const { userType } = require("../config/appConstant");

const Run = async () => {
  let password = "$2a$08$8QBeUqrXcf334kMMrDS1euP5nbn00MZpP5Yi4PBucI9MIdASz8qDC";
  let adminDetails = {
    name: "Sbar Admin",
    email: "admin@test.com",
    password: password,    //123456
    userType: userType.ADMIN,
  };
  CreateAdmin(adminDetails);
};

const CreateAdmin = async (adminDetails) => {
  try {
    let adminData = await User.findOneAndUpdate(
      { email: adminDetails.email },
      adminDetails,
      { lean: true, upsert: true, new: true }
    );
    console.log("=================");

    return adminData;
  } catch (err) {
    console.log(
      "**********************************************************************",
      err
    );
  }
};
module.exports = Run;
