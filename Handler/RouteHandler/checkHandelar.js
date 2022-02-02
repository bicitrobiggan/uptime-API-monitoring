/*
 * App name  :  uptime monotoring API
 * File      : checkHandelar.js
 * ShortPath : API/Handler/RouteHandler
 * Author    : Maruf Hasan
 * Description : User can define links by this
 * Date : 14 September 2021
 * path : storage/emulated/0/Android/data/io.spck/files/Nodejs/API/Handler/RouteHandler
 */

//decendencies
const { parseJson, randomString } = require("../../assets/utilities.js");
const data = require("../../lib/data.js");
const tokenHandelar = require("./tokenHandler.js");
const { maxChenge } = require("../../assets/Environment.js");

// module scaffolding
const check = {};

//handle
check.handle = function (Data, callBack) {
  const methods = ["get", "post", "put", "delete"];
  if (methods.indexOf(Data.method) >= 0) {
    check.method[Data.method](Data, callBack);
  } else {
    callBack(405, {
      error: "Method not allowed!",
    });
  }
};

check.method = {};

check.method.get = function (Data, callBack) {
  // validate input
  const id =
    typeof Data.queryString.id === "string" &&
    Data.queryString.id.trim().length === 20
      ? Data.queryString.id
      : false;
  if (id) {
    data.read("check", id, (error1, checkData) => {
      if (!error1 && checkData) {
        // check token
        let token =
          typeof Data.headers.token === "string" ? Data.headers.token : false;
        data.read("token", token, (error1, tokenData) => {
          if (!error1 && tokenData) {
            let userPhone = parseJson(tokenData).phone;
            tokenHandelar.verify(token, userPhone, (tokenIsValid) => {
              if (tokenIsValid) {
                callBack(200, parseJson(checkData));
              } else {
                callBack(403, {
                  error: "Authentication failure!",
                });
              }
            });
          } else {
            callBack(500, {
              error: "Token not found!",
            });
          }
        });
      } else {
        callBack(500, {
          error: "check not found!",
        });
      }
    });
  } else {
    callBack(400, {
      error: "wrong information!",
    });
  }
};

check.method.post = function (Data, callBack) {
  // validate input
  let protocol =
    typeof Data.body.protocol === "string" &&
    ["http", "https"].indexOf(Data.body.protocol) >= 0
      ? Data.body.protocol
      : false;
  let url =
    typeof Data.body.url === "string" && Data.body.url.trim().length > 0
      ? Data.body.url
      : false;
  let method =
    typeof Data.body.method === "string" &&
    ["GET", "POST", "PUT", "DELETE"].indexOf(Data.body.method) >= 0
      ? Data.body.method
      : false;
  let successCode =
    typeof Data.body.successCode === "object" &&
    Array.isArray(Data.body.successCode)
      ? Data.body.successCode
      : false;
  let timeoutSecond =
    typeof Data.body.timeoutSecond === "number" &&
    Data.body.timeoutSecond % 1 === 0 &&
    Data.body.timeoutSecond >= 1 &&
    Data.body.timeoutSecond <= 5
      ? Data.body.timeoutSecond
      : false;

  if (protocol && url && method && successCode && timeoutSecond) {
    // token check
    let token =
      typeof Data.headers.token === "string" ? Data.headers.token : false;

    // phone number by token
    data.read("token", token, (error1, tokenData) => {
      if (!error1 && tokenData) {
        let userPhone = parseJson(tokenData).phone;
        data.read("user", userPhone, (error2, userData) => {
          if (!error2 && userData) {
            tokenHandelar.verify(token, userPhone, (tokenIsValid) => {
              if (tokenIsValid) {
                let userObject = parseJson(userData);
                let userChecks =
                  typeof userObject.checks === "object" &&
                  Array.isArray(userObject.checks)
                    ? userObject.checks
                    : [];

                if (userChecks.length < maxChenge) {
                  // valid
                  let checkId = randomString(20);
                  let checkObj = {
                    id: checkId,
                    userPhone,
                    protocol,
                    url,
                    method,
                    successCode,
                    timeoutSecond,
                  };
                  // save data
                  data.create("check", checkId, checkObj, (success) => {
                    if (success) {
                      // add checks data
                      userObject.checks = userChecks;
                      userObject.checks.push(checkId);
                      data.update("user", userPhone, userObject, (success1) => {
                        if (success1) {
                          callBack(200, checkObj);
                        } else {
                          callBack(500, {
                            error: "can't save data in user file",
                          });
                        }
                      });
                    } else {
                      callBack(500, {
                        error: "can't create check",
                      });
                    }
                  });
                } else {
                  callBack(401, {
                    error: "You reached max check limit!",
                  });
                }
              } else {
                callBack(403, {
                  error: "Authentication failure!",
                });
              }
            });
          } else {
            callBack(403, {
              error: "User not found.",
            });
          }
        });
      } else {
        callBack(403, {
          error: "Authentication failure!",
        });
      }
    });
  } else {
    callBack(400, {
      error: "You have a problem in your request!",
    });
  }
};

check.method.put = function (Data, callBack) {
  // validate input
  const id =
    typeof Data.queryString.id === "string" &&
    Data.queryString.id.trim().length === 20
      ? Data.queryString.id
      : false;
  if (id) {
    let protocol =
      typeof Data.body.protocol === "string" &&
      ["http", "https"].indexOf(Data.body.protocol) >= 0
        ? Data.body.protocol
        : false;
    let url =
      typeof Data.body.url === "string" && Data.body.url.trim().length > 0
        ? Data.body.url
        : false;
    let method =
      typeof Data.body.method === "string" &&
      ["GET", "POST", "PUT", "DELETE"].indexOf(Data.body.method) >= 0
        ? Data.body.method
        : false;
    let successCode =
      typeof Data.body.successCode === "object" &&
      Array.isArray(Data.body.successCode)
        ? Data.body.successCode
        : false;
    let timeoutSecond =
      typeof Data.body.timeoutSecond === "number" &&
      Data.body.timeoutSecond % 1 === 0 &&
      Data.body.timeoutSecond >= 1 &&
      Data.body.timeoutSecond <= 5
        ? Data.body.timeoutSecond
        : false;
    if (protocol || url || method || successCode || timeoutSecond) {
      data.read("check", id, (error1, checkData) => {
        if (!error1 && checkData) {
          // check token
          let token =
            typeof Data.headers.token === "string" ? Data.headers.token : false;
          let checkObj = parseJson(checkData);
          tokenHandelar.verify(token, checkObj.userPhone, (tokenIsValid) => {
            if (tokenIsValid) {
              if (protocol) {
                checkObj.protocol = protocol;
              }
              if (url) {
                checkObj.url = url;
              }
              if (method) {
                checkObj.method = method;
              }
              if (successCode) {
                checkObj.successCode = successCode;
              }
              if (protocol) {
                checkObj.timeoutSecond = timeoutSecond;
              }
              data.update("check", id, checkObj, (success) => {
                if (success) {
                  callBack(200, {
                    message: "check updated!",
                  });
                } else {
                  callBack(500, {
                    error: "can't update check",
                  });
                }
              });
            } else {
              callBack(403, {
                error: "Authentication failure!",
              });
            }
          });
        } else {
          callBack(500, {
            error: "check not found!",
          });
        }
      });
    } else {
      callBack(400, {
        error: "Atleast update one thing",
      });
    }
  } else {
    callBack(400, {
      error: "you have a problem in your request!",
    });
  }
};

check.method.delete = function (Data, callBack) {
  const id =
    typeof Data.queryString.id === "string" &&
    Data.queryString.id.trim().length === 20
      ? Data.queryString.id
      : false;
  if (id) {
    data.read("check", id, (error1, checkData) => {
      if (!error1 && checkData) {
        // check token
        let token =
          typeof Data.headers.token === "string" ? Data.headers.token : false;
        data.read("token", token, (error1, tokenData) => {
          if (!error1 && tokenData) {
            let userPhone = parseJson(tokenData).phone;
            tokenHandelar.verify(token, userPhone, (tokenIsValid) => {
              if (tokenIsValid) {
                data.delete("check", id, (sussess) => {
                  if (sussess) {
                    callBack(200, {
                      message: "user deleted successfully",
                    });
                  } else {
                    callBack(500, {
                      error: "something went wrong!",
                    });
                  }
                });
              } else {
                callBack(403, {
                  error: "Authentication failure!",
                });
              }
            });
          } else {
            callBack(500, {
              error: "Token not found!",
            });
          }
        });
      } else {
        callBack(500, {
          error: "check not found!",
        });
      }
    });
  } else {
    callBack(400, {
      error: "wrong information!",
    });
  }
};

//export
module.exports = check;
