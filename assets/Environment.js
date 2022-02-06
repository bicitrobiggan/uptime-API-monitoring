/*
 * App name  :  uptime monotoring API
 * File      : Environment.js
 * ShortPath : App
 * Author    : Maruf Hasan
 * Description : User can define links by this
 * Date : 11 September 2021
 * path : storage/emulated/0/Android/data/io.spck/files/Nodejs/App
 */

// module scaffolding
const Environment = {};

//Environment Library
Environment.default = {
  port: 3060,
  envName: "default",
  SecretKey: "hjibjihijibiji",
  maxChenge: 5,
  twilio: {
    fromPhone: "{a twilio provided phone number)",
    accountSid: "{Account SID}",
    authToken: "{Auth Token}",
  },
};

Environment.production = {
  port: 4000,
  envName: "production",
  SecretKey: "bijihijibjihji",
  maxChenge: 5,
  twilio: {
    fromPhone: "{a twilio provided phone number)",
    accountSid: "{Account SID}",
    authToken: "{Auth Token}",
  },
};

Environment.poor = {
  port: 1000,
  envName: "poor",
};
// Environment checking
const currentEnvironment =
  typeof process.env.Name === "string" ? process.env.Name : "default";
const EnvironmentToExport =
  typeof Environment[currentEnvironment] === "object"
    ? Environment[currentEnvironment]
    : Environment["default"];

// exports
module.exports = EnvironmentToExport;
