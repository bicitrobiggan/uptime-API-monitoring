/*
 * App name  :  uptime monotoring API
 * File      : server.js
 * ShortPath : API/lib
 * Author    : Maruf Hasan
 * Description : start the server
 * Date : 10 September 2021
 * path : storage/emulated/0/Android/data/io.spck/files/Nodejs/API/lib
 */

// dependents
const http = require("http");
const { handeler } = require("./../assets/HandleUser.js");
//const notification = require("./../assets/notification.js");
//const lib = require('./lib/data.js');
// module scaffolding
const server = {};

//server environment
const Environment = require("./../assets/Environment.js");
server.handelUser = handeler;

//create a server
server.createServer = function () {
  http.createServer(server.handelUser).listen(Environment.port, () => {
    console.log(`server started successfully on ${Environment.port} port`);
  });
};

// start the workers
server.init = () => {
  server.createServer();
};

//exort and share
module.exports = server;
