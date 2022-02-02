/*
 * App name  :  uptime monotoring API
 * File      : route.js
 * ShortPath : App
 * Author    : Maruf Hasan
 * Description : User can define links by this
 * Date : 10 September 2021
 * path : storage/emulated/0/Android/data/io.spck/files/Nodejs/App
 */

//imports
const sample = require("./Handler/RouteHandler/SampleHandler.js");
const user = require("./Handler/RouteHandler/userHandler.js");
const token = require("./Handler/RouteHandler/tokenHandler.js");
const check = require("./Handler/RouteHandler/checkHandelar.js");
// module scaffolding
const routes = {
  sample: sample.handle,
  user: user.handle,
  token: token.handle,
  check: check.handle,
};

//export
module.exports = routes;
