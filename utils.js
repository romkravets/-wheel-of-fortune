const fs = require("fs");
const minimist = require("minimist");

const entries = require("./entries.json");
const rimraf = require("rimraf");

const promisifiedRemove = pageName =>
  new Promise((resolve, reject) => {
    rimraf(`./src/${pageName}`, e => {
      if (e) {
        reject(e);
      }
      resolve();
    });
  });

const readFilePromisified = path => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, "utf8", (e, result) => {
      if (e) {
        reject(e);
      }
      resolve(result);
    });
  });
};

const writeFile = (path, data) =>
  new Promise((resolve, reject) => {
    if (data === undefined) {
      reject(
        "When you create file, data is undefined, please check second arg at writeFilePromisified"
      );
    }
    fs.writeFile(path, data, e => {
      if (e) {
        reject(e);
      }
      resolve();
    });
  });

const removePage = async pageName => {
  if (!pageName) {
    throw "Please provide page name as argument `npm run page:remove [name-of-page]`";
  }

  if (Object.keys(entries).indexOf(pageName) === -1) {
    throw "You don't have page with provided name";
  }

  const newEntries = Object.keys(entries).reduce((_entr, _pageName) => {
    if (_pageName !== pageName) {
      _entr[_pageName] = entries[_pageName];
    }
    return _entr;
  }, {});

  await promisifiedRemove(pageName);

  fs.writeFile(
    `./entries.json`,
    `${JSON.stringify(newEntries, null, 2)}`,
    function(err) {
      if (err) throw err;
      console.log(
        "Entries updated." + "<br/>" + JSON.stringify(newEntries, null, 2)
      );
    }
  );
};

module.exports = {
  removePage,
  writeFile,
  readFilePromisified
};
