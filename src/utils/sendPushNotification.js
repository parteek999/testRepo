const OneSignal = require("onesignal-node");
const client = new OneSignal.Client(
  "ENV-KEYS",
  "ENV_KEYS"
);
const userClient = new OneSignal.UserClient(
  "ENV-keys"
);


var pushNotification = async (message,deviceToken) => {
  return new Promise((res, rej) => {
    const notification = {
      contents: {
        en:`${message}`,
      },
      headings: {
        en:"Buildit_Permits",
      },
      include_player_ids:deviceToken,
    };
    return client.createNotification(notification)
      .then((response) => {
        console.log("xcxxc",response);
         res(response);
      })
      .catch((e) => {
        console.log("fdfd",e);
         rej(e);
      });
  });
};


module.exports = {
  pushNotification,
};
