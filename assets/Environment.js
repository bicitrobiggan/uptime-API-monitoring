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
    fromPhone: "+17755425652",
    accountSid: "ACf0734c1a1a2421d22bbaa30d2b15220d",
    authToken: "cdd959a0419e7a0abd5773a438c5c9c5",
  },
};

Environment.production = {
  port: 4000,
  envName: "production",
  SecretKey: "bijihijibjihji",
  maxChenge: 5,
  twilio: {
    fromPhone: "+17755425652",
    AccountSid: "ACf0734c1a1a2421d22bbaa30d2b15220d",
    authToken: "cdd959a0419e7a0abd5773a438c5c9c5",
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
