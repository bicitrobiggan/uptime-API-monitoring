/*
 * App name  :  uptime monotoring API
 * File      : HandleUser.js
 * ShortPath : API/assets
 * Author    : Maruf Hasan
 * Description : User can define links by this
 * Date : 11 September 2021
 * path : storage/emulated/0/Android/data/io.spck/files/Nodejs/API/assets
 */

//dependencies
const url = require("url");
const { StringDecoder } = require("string_decoder");
const route = require("../route.js");
const NotFound = require("../Handler/RouteHandler/NotFoundHandler.js");
const utilities = require("./utilities.js");

//module scaffolding
const handleUser = {};

//HandleUser
handleUser.handeler = function (req, res) {
  const url_parse = url.parse(req.url, true);
  let trimedpath = url_parse.pathname.replace(/(^\/+)|(\/+$)/g, "");
  const method = req.method.toLowerCase();
  const queryString = url_parse.query;
  const headers = req.headers;

  let AllData = {
    url_parse,
    trimedpath,
    headers,
    queryString,
    method,
  };

  const choiceHandler = route[trimedpath] ? route[trimedpath] : NotFound.handle;

  let realData = "";
  const decoder = new StringDecoder("utf-8");
  req.on("data", (chunk) => {
    realData += decoder.write(chunk);
  });
  req.on("end", () => {
    realData += decoder.end();
    AllData.body = utilities.parseJson(realData);
    choiceHandler(AllData, (statusCode, payLoad) => {
      statusCode = typeof statusCode === "number" ? statusCode : 500;
      payLoad = typeof payLoad === "object" ? payLoad : {};
      const payLoadString = JSON.stringify(payLoad);
      res.setHeader("Content-Type", "application/json");
      res.writeHead(statusCode);
      res.write(payLoadString);
      res.end();
    });
  });
};

// export fn
module.exports = handleUser;
