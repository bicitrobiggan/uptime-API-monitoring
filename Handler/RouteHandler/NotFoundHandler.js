/*
 * App name  :  uptime monotoring API
 * File      : NotFoundHandler.js
 * ShortPath : API/Handler/RouteHandler
 * Author    : Maruf Hasan
 * Description : User can define links by this
 * Date : 10 September 2021
 * path : storage/emulated/0/Android/data/io.spck/files/Nodejs/API/Handler/RouteHandler
 */

// module scaffolding
const NotFound = {};

//handle

NotFound.handle = function (Data, callBack) {
  callBack(404, {
    message: "url not found.",
  });
};

//export
module.exports = NotFound;
