/*
 * App name  :  uptime monotoring API
 * File      : tokenHandler.js
 * ShortPath : API/Handler/RouteHandler
 * Author    : Maruf Hasan
 * Description : User can define links by this
 * Date : 14 September 2021
 * path : storage/emulated/0/Android/data/io.spck/files/Nodejs/API/Handler/RouteHandler
 */

//decendencies
const { parseJson } = require("../../assets/utilities.js");
const utilities = require("../../assets/utilities.js");
const data = require("../../lib/data.js");

// module scaffolding
const token = {};

let ExpTime = 1000 * 60 * 60 * 24 * 30 * 12;

//handle
token.handle = function (Data, callBack) {
  const methods = ["get", "post", "put", "delete"];
  if (methods.indexOf(Data.method) >= 0) {
    token.method[Data.method](Data, callBack);
  } else {
    callBack(405, {
      error: "Method not allowed!",
    });
  }
};

token.method = {};

token.method.get = function (Data, callBack) {
  const id =
    typeof Data.queryString.id === "string" &&
    Data.queryString.id.trim().length === 20
      ? Data.queryString.id
      : false;
  data.read("token", id, (error2, data2) => {
    let userData = { ...utilities.parseJson(data2) };
    delete userData.password;
    if (!error2) {
      callBack(200, userData);
    } else {
      callBack(500, {
        error: "Token can not be found!",
      });
    }
  });
};

token.method.post = function (Data, callBack) {
  const phone =
    typeof Data.body.phone === "string" && Data.body.phone.trim().length === 11
      ? Data.body.phone
      : false;
  const password =
    typeof Data.body.password === "string" &&
    Data.body.password.trim().length > 7
      ? Data.body.password
      : false;
  if (phone && password) {
    const cryptidPassword = utilities.hash(password);
    data.read("user", phone, (error, data1) => {
      if (!error && data1) {
        const token = utilities.randomString(20);
        let userData = { ...utilities.parseJson(data1) };
        if (userData.password === cryptidPassword) {
          data.read("token", token, (error2) => {
            const expire = new Date().getTime() + ExpTime;
            if (error2) {
              let tokenData = {
                phone,
                password: cryptidPassword,
                expire,
                id: token,
              };
              data.create("token", token, tokenData, (success) => {
                if (success) {
                  callBack(200, {
                    message: "Token created successfully!",
                  });
                } else {
                  callBack(500, {
                    error: "Token can't be created.",
                  });
                }
              });
            } else {
              callBack(500, {
                error: "Token has already placed.",
              });
            }
          });
        } else {
          callBack(400, {
            error: "Your password is not correct.",
          });
        }
      } else {
        callBack(404, {
          error: "user not found!",
        });
      }
    });
  } else {
    callBack(400, {
      error: "There is a problem in your submission!",
    });
  }
};

token.method.put = function (Data, callBack) {
  const id =
    typeof Data.body.id === "string" && Data.body.extend === true
      ? Data.body.id
      : false;
  const extend =
    typeof Data.body.extend === "boolean" && Data.body.extend === true
      ? true
      : false;
  if (id && extend) {
    data.read("token", id, (err, tokenData) => {
      if (!err && tokenData) {
        let tokenObj = parseJson(tokenData);
        if (tokenObj.expire > Date.now()) {
          tokenObj.expire = Date.now() + ExpTime;
          data.update("token", id, tokenObj, (success) => {
            if (success) {
              callBack(200, {
                success: "token expire date is updated!",
              });
            } else {
              callBack(500, {
                error: "can't update expire date!",
              });
            }
          });
        } else {
          callBack(400, {
            error: "token already expires",
          });
        }
      } else {
        callBack(404, {
          error: "something went wrong!",
        });
      }
    });
  } else {
    callBack(400, {
      error: "There was a aproblem in your request",
    });
  }
};

token.method.delete = function (Data, callBack) {
  const id =
    typeof Data.queryString.id === "string" &&
    Data.queryString.id.trim().length === 20
      ? Data.queryString.id
      : false;
  if (id) {
    data.read("token", id, (error, userData) => {
      if (!error && userData) {
        data.delete("token", id, (success) => {
          if (success) {
            callBack(200, {
              message: "Token deleted successfully!",
            });
          } else {
            callBack(500, {
              error: "Can't delete token!",
            });
          }
        });
      } else {
        callBack(404, {
          error: "token not found!",
        });
      }
    });
  } else {
    callBack(400, {
      error: "Please input the right id.",
    });
  }
};

token.verify = (id, phone, callback) => {
  data.read("token", id, (err, tokenData) => {
    if (!err && tokenData) {
      let tkndata = typeof tokenData === "string" ? parseJson(tokenData) : {};
      if (tkndata.phone === phone && tkndata.expire > Date.now()) {
        callback(true);
      } else {
        callback(false);
      }
    } else {
      callback(false);
    }
  });
};

module.exports = token;
