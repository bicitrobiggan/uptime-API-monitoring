/*
 * App name  :  uptime monotoring API
 * File      : notification.js
 * ShortPath : API/assets
 * Author    : Maruf Hasan
 * Description : notification sending by using twilio
 * Date : 29 January , 2022
 * path : storage/emulated/0/Android/data/io.spck/files/Nodejs/API/assets
 */

// dependencies
const https = require("https");
const { twilio } = require("./Environment.js");
const querystring = require("querystring");
// module scuffholding
const notification = {};

notification.sendTwilioSms = (phone, msg, callback) => {
  // input valodation
  const userPhone =
    typeof phone === "string" && phone.trim().length === 11 ? phone : false;
  const userMsg =
    typeof msg === "string" &&
    msg.trim().length > 0 &&
    msg.trim().length <= 1600
      ? msg
      : false;
  if (userPhone && userMsg) {
    const payload = {
      From: twilio.fromPhone,
      To: `+88${userPhone}`,
      Body: userMsg,
    };
    // stringify payload
    const payLoadString = querystring.stringify(payload);
    // request
    const reqDetails = {
      hostname: "api.twilio.com",
      path: `/2010-04-01/Accounts/${twilio.accountSid}/Messages.json`,
      method: "POST",
      auth: `${twilio.accountSid}:${twilio.authToken}`,
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
    };
    const req = https.request(reqDetails, (res) => {
      const status = res.statusCode;
      if (status === 200 || status === 201) {
        callback(false);
      } else {
        callback(`status code is ${status}`);
      }
    });
    req.on("error", (e) => {
      callback(e);
    });
    req.write(payLoadString);
    req.end();
  } else {
    callback("invalid input!");
  }
};

// export and share
module.exports = notification;
