/*
 * App name  :  uptime monotoring API
 * File      : index.js
 * ShortPath : App
 * Author    : Maruf Hasan
 * Description : User can define links by this
 * Date : 10 September 2021
 * path : storage/emulated/0/Android/data/io.spck/files/Nodejs/App
 */

// dependents
const server = require("./lib/server");
const worker = require("./lib/worker");
// module scaffolding
const app = {};

app.init = () => {
  // call server
  server.init();
  //call worker
  worker.init();
};

app.init();

// export and share
module.exports = app;
