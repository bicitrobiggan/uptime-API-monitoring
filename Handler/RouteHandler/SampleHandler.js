/*
 * App name  :  uptime monotoring API
 * File      : SampleHandler.js
 * ShortPath : API/Handler/RouteHandler
 * Author    : Maruf Hasan
 * Description : User can define links by this
 * Date : 10 September 2021
 * path : storage/emulated/0/Android/data/io.spck/files/Nodejs/API/Handler/RouteHandler
 */

// module scaffolding
const sample = {};

//handle

sample.handle = function (Data, callBack) {
  callBack(200, {
    message: "This is sample.",
  });
};

//export
module.exports = sample;
