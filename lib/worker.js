/*
 * App name  :  uptime monotoring API
 * File      : worker.js
 * ShortPath : API/lib
 * Author    : Maruf Hasan
 * Description : start the workers
 * Date : 10 September 2021
 * path : storage/emulated/0/Android/data/io.spck/files/Nodejs/API/lib
 */

// dependencies
const url = require("url");
const http = require("http");
const https = require("https");
const data = require("./data");
const utilities = require("../assets/utilities");
const notification = require("../assets/notification");
// module scaffolding
const worker = {};

//loop the check checking
worker.loop = () => {
  setInterval(() => {
    worker.gatherAllChecks();
  }, 1000 * 5);
};
// get all the checks
worker.gatherAllChecks = () => {
  data.list("check", (checks, err) => {
    if (!err && checks && checks.length > 0) {
      checks.forEach((check) => {
        data.read("check", check, (err1, checkData) => {
          if (!err1 && checkData) {
            // valid the data
            worker.validateCheckData(utilities.parseJson(checkData));
          } else {
            console.log("Error : can't read files");
          }
        });
      });
    } else {
      console.log("an error occured. any checks not found!", err);
    }
  });
};
// validate check data
worker.validateCheckData = (rawcheckData) => {
  let checkData = rawcheckData;
  if (checkData && checkData.id) {
    checkData.state =
      typeof checkData.state === "string" &&
      ["up", "down"].indexOf(checkData.state) > -1
        ? checkData.state
        : "down";
    checkData.lastCheckTime =
      typeof checkData.lastCheckTime === "number" && checkData.lastCheckTime > 0
        ? checkData.lastCheckTime
        : false;
    worker.performCheck(checkData);
  } else {
    console.log("Error : invalid checkData", checkData);
  }
};
// prepare check
worker.performCheck = (checkData) => {
  let checkOutcome = {
    error: false,
    responseCode: false,
    send: false,
  };
  const parseUrl = url.parse(`${checkData.protocol}://${checkData.url}`, true);
  const hostname = parseUrl.hostname;
  const path = parseUrl.path;
  const reqDetails = {
    protocol: `${checkData.protocol}:`,
    hostname,
    path,
    method: checkData.method.toUpperCase(),
    timeoutSecond: checkData.timeoutSecond * 1000,
  };
  const protocolToUse = checkData.protocol === "https" ? https : http;
  const req = protocolToUse.request(reqDetails, (res) => {
    if (!checkOutcome.send) {
      checkOutcome.send = true;
      checkOutcome.responseCode = res.statusCode;
      console.log(checkOutcome.responseCode);
      worker.processCheckOutcome(checkData, checkOutcome);
    }
  });
  req.on("error", (e) => {
    if (!checkOutcome.send) {
      checkOutcome = {
        error: true,
        reason: e,
        send: true,
      };
      worker.processCheckOutcome(checkData, checkOutcome);
    }
  });
  req.on("timeout", () => {
    if (!checkOutcome.send) {
      checkOutcome = {
        error: true,
        reason: "timeout",
        send: true,
      };
      worker.processCheckOutcome(checkData, checkOutcome);
    }
  });
  req.end();
};
// prcess checkout
worker.processCheckOutcome = (checkData, checkOutcome) => {
  let state =
    !checkOutcome.error &&
    checkOutcome.responseCode &&
    checkData.successCode.indexOf(checkOutcome.responseCode) > -1
      ? "up"
      : "down";
  let needAlert =
    checkData.lastCheckTime && checkData.state !== state ? true : false;
  const newCheckData = checkData;
  newCheckData.state = state;
  newCheckData.lastCheckTime = Date.now();

  // update the check data
  data.update("check", newCheckData.id, newCheckData, (success) => {
    if (success) {
      // check if alert needed or not
      if (needAlert) {
        worker.alertUser(newCheckData);
      } else {
        console.log("alert not neede!");
      }
    } else {
      console.log("can't update file!");
    }
  });
};
// alert user
worker.alertUser = (userData) => {
  let msg = `Alert : your check for ${userData.method.toUpperCase()} for ${
    userData.protocol
  }://${userData.url} is ${userData.state} now!`;
  notification.sendTwilioSms(userData.userPhone, msg, (error) => {
    if (!error) {
      console.log("sms send successfully.", msg);
    } else {
      console.log("sms not send!", error);
    }
  });
};
// start the workers
worker.init = () => {
  worker.gatherAllChecks();
  worker.loop();
};

//exort and share
module.exports = worker;
