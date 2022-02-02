/*
 * App name  :  uptime monotoring API
 * File      : userHandler.js
 * ShortPath : API/Handler/RouteHandler
 * Author    : Maruf Hasan
 * Description : User can define links by this
 * Date : 14 September 2021
 * path : storage/emulated/0/Android/data/io.spck/files/Nodejs/API/Handler/RouteHandler
 */

//decendencies
const utilities = require("../../assets/utilities.js");
const data = require("../../lib/data.js");
const tokenHandelar = require("./tokenHandler.js");

// module scaffolding
const user = {};

//handle
user.handle = function (Data, callBack) {
  const methods = ["get", "post", "put", "delete"];
  if (methods.indexOf(Data.method) >= 0) {
    user.method[Data.method](Data, callBack);
  } else {
    callBack(405, {
      error: "Method not allowed!",
    });
  }
};

user.method = {};

user.method.get = function (Data, callBack) {
  const phone =
    typeof Data.queryString.phone === "string" &&
    Data.queryString.phone.trim().length === 11
      ? Data.queryString.phone
      : false;
  if (phone) {
    // verify the token
    let token =
      typeof Data.headers.token === "string" ? Data.headers.token : false;

    tokenHandelar.verify(token, phone, (tokenId) => {
      if (tokenId) {
        data.read("user", phone, (error, data) => {
          let user = { ...utilities.parseJson(data) };
          if (!error && user) {
            delete user.password;
            callBack(200, { user });
          } else {
            callBack(404, {
              error: "user doesn't exists anymore!",
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
    callBack(404, {
      error: "user not found!",
    });
  }
};

user.method.post = function (Data, callBack) {
  const firstName =
    typeof Data.body.firstName === "string" &&
    Data.body.firstName.trim().length > 0
      ? Data.body.firstName
      : false;
  const lastName =
    typeof Data.body.lastName === "string" &&
    Data.body.lastName.trim().length > 0
      ? Data.body.lastName
      : false;
  const phone =
    typeof Data.body.phone === "string" && Data.body.phone.trim().length === 11
      ? Data.body.phone
      : false;
  const password =
    typeof Data.body.password === "string" &&
    Data.body.password.trim().length > 7
      ? Data.body.password
      : false;
  const TSagreement =
    typeof Data.body.TSagreement === "boolean" ? Data.body.TSagreement : false;
  if (firstName && lastName && phone && password && TSagreement) {
    data.read("user", phone, (error1) => {
      if (error1) {
        let userData = {
          firstName,
          lastName,
          phone,
          password: utilities.hash(password),
          TSagreement,
        };
        data.create("user", phone, userData, (success) => {
          if (success) {
            callBack(200, {
              message: "User created successfully!",
            });
          } else {
            callBack(500, {
              error: "Can't create user!",
            });
          }
        });
      } else {
        callBack(500, {
          error: "This is a sarver side error.",
        });
      }
    });
  } else {
    callBack(400, {
      error: "There is a problem in your request.",
    });
  }
};

user.method.put = function (Data, callBack) {
  const firstName =
    typeof Data.body.firstName === "string" &&
    Data.body.firstName.trim().length > 0
      ? Data.body.firstName
      : false;
  const lastName =
    typeof Data.body.lastName === "string" &&
    Data.body.lastName.trim().length > 0
      ? Data.body.lastName
      : false;
  const phone =
    typeof Data.body.phone === "string" && Data.body.phone.trim().length === 11
      ? Data.body.phone
      : false;
  const password =
    typeof Data.body.password === "string" &&
    Data.body.password.trim().length > 7
      ? Data.body.password
      : false;
  if (phone) {
    if (firstName || lastName || password) {
      // verify the token
      let token =
        typeof Data.headers.token === "string" ? Data.headers.token : false;

      tokenHandelar.verify(token, phone, (tokenId) => {
        if (tokenId) {
          data.read("user", phone, (error1, user) => {
            const userData = { ...utilities.parseJson(user) };
            if (!error1 && userData) {
              if (firstName) {
                userData.firstName = firstName;
              }
              if (lastName) {
                userData.lastName = lastName;
              }
              if (password) {
                userData.password = utilities.hash(password);
              }
              data.update("user", phone, userData, (success) => {
                if (success) {
                  callBack(200, {
                    message: "File updated successfully!",
                  });
                } else {
                  callBack(500, {
                    error: "File update is failed!",
                  });
                }
              });
            } else {
              callBack(404, {
                error: "User doesn't exists anymore!",
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
        error: "You have a mistake here. Please try again letter!",
      });
    }
  } else {
    callBack(400, {
      error: "Your phone number isn't found. Please try again letter!",
    });
  }
};
user.method.delete = function (Data, callBack) {
  const phone =
    typeof Data.queryString.phone === "string" &&
    Data.queryString.phone.trim().length === 11
      ? Data.queryString.phone
      : false;
  if (phone) {
    // verify the token
    let token =
      typeof Data.headers.token === "string" ? Data.headers.token : false;

    tokenHandelar.verify(token, phone, (tokenId) => {
      if (tokenId) {
        data.read("user", phone, (error, userData) => {
          if (!error && userData) {
            data.delete("user", phone, (success) => {
              if (success) {
                callBack(200, {
                  message: "User deleted successfully!",
                });
              } else {
                callBack(500, {
                  error: "Can't delete user!",
                });
              }
            });
          } else {
            callBack(404, {
              error: "User not found!",
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
      error: "Please input a valid number.",
    });
  }
};

//export
module.exports = user;
