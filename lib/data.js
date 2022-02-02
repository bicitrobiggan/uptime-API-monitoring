/*
 * App name  :  uptime monotoring API
 * File      : data.js
 * ShortPath : API/lib
 * Author    : Maruf Hasan
 * Description : User can define links by this
 * Date : 12 September 2021
 * path : storage/emulated/0/Android/data/io.spck/files/Nodejs/API/lib
 */

//dependencies
const fs = require("fs");
const path = require("path");

//module scaffolding
const lib = {};

// base directory of current folder
lib.baseDir = path.join(__dirname, "../data");

//create file
lib.create = function (dir, file, data, callBack) {
  fs.open(
    `${lib.baseDir}/${dir}/${file}.json`,
    "wx",
    function (error, fileDescriptor) {
      if (!error && fileDescriptor) {
        const stringData = JSON.stringify(data);
        fs.writeFile(fileDescriptor, stringData, function (error2) {
          if (!error2) {
            fs.close(fileDescriptor, function (error3) {
              if (!error3) {
                callBack("File created successfully");
              } else {
                callBack("Error during the file has closing!");
              }
            });
          } else {
            callBack("Error during the file has writing!");
          }
        });
      } else {
        callBack(`Something went wrong for this ${error}`);
      }
    }
  );
};
//read data from file
lib.read = function (dir, file, callBack) {
  fs.readFile(
    `${lib.baseDir}/${dir}/${file}.json`,
    "utf-8",
    function (error, data) {
      callBack(error, data);
    }
  );
};
//update file data
lib.update = function (dir, file, data, callBack) {
  fs.open(
    `${lib.baseDir}/${dir}/${file}.json`,
    "r+",
    function (error, fileDescriptor) {
      if (!error && fileDescriptor) {
        const stringData = JSON.stringify(data);
        fs.ftruncate(fileDescriptor, (error2) => {
          if (!error2) {
            fs.writeFile(fileDescriptor, stringData, function (error3) {
              if (!error3) {
                fs.close(fileDescriptor, function (error4) {
                  if (!error4) {
                    callBack(`File updated successfully!`);
                  } else {
                    callBack(
                      `Error occurs during close file.Error is : ${error4}`
                    );
                  }
                });
              } else {
                callBack(`Error occurs during writeFile. Error is : ${error3}`);
              }
            });
          } else {
            callBack(
              "Error occurs during truncating file. Error is : " + error2
            );
          }
        });
      } else {
        callBack(`an error occurs. Error : ${error}`);
      }
    }
  );
};
//delete file
lib.delete = function (dir, file, callBack) {
  fs.unlink(`${lib.baseDir}/${dir}/${file}.json`, (error) => {
    if (!error) {
      callBack("File deleted successfully!");
    } else {
      callBack(
        "An error occurs when file is trying do deleteing. Error is : " + error
      );
    }
  });
};
//read dir
lib.list = function (dir, callBack) {
  fs.readdir(`${lib.baseDir}/${dir}`, "utf-8", function (error, filenames) {
    if (!error && filenames && filenames.length > 0) {
      let trimedFileName = [];
      filenames.forEach((filename) => {
        trimedFileName.push(filename.replace(".json", ""));
      });
      callBack(trimedFileName);
    } else {
      callBack("An error occured! Empty folder");
    }
  });
};
//exports
module.exports = lib;
