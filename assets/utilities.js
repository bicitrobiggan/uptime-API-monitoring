/*
 * App name  :  uptime monotoring API
 * File      : utilities.js
 * ShortPath : API/assets
 * Author    : Maruf Hasan
 * Description : User can define links by this
 * Date : 15 September 2021
 * path : storage/emulated/0/Android/data/io.spck/files/Nodejs/API/assets
 */

//dependencies
const crypto = require("crypto");
const environmentToExp = require("./Environment.js");
// module scaffolding
const utilities = {};

utilities.parseJson = function (jsonString) {
  let output;
  try {
    output = JSON.parse(jsonString);
  } catch {
    output = {};
  }
  return output;
};
//hash
utilities.hash = function (string) {
  if (typeof string === "string" && string.length > 0) {
    return crypto
      .createHmac("sha256", environmentToExp.SecretKey)
      .update(string)
      .digest("hex");
  } else {
    return false;
  }
};
//random carecter genaretor

utilities.randomString = function (length) {
  const len = length;
  let possibleChar =
    "asdfghjklzxcvbnmqwertyuiop12345678901234567890@#!%&**$@#!%&**$";
  let possibleCharArray = [...possibleChar];
  let output = "";
  for (let i = 0; i < len; i++) {
    let luck =
      Math.floor(Math.random() * 36) % 2 === 0 ? 36 : possibleCharArray.length;
    let upLowCase = Math.floor(Math.random() * luck);
    let main;
    if (upLowCase < 26 && upLowCase % 2 === 0) {
      main = possibleCharArray[upLowCase].toUpperCase();
    } else {
      main = possibleCharArray[upLowCase];
    }
    output += main;
  }
  return output;
};

//export
module.exports = utilities;
