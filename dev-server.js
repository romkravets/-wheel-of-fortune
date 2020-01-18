const kill = require("kill-port");
const express = require("express");
const contants = require("./constants");
const FgBlue = "\x1b[34m";
const FgYellow = "\x1b[33m";
const app = express();
const PORT = contants.PORT;
const ip = require("ip");

(async () => {
  try {
    const ipv4 = ip.address();
    await kill(PORT, "http");
    app.use(express.static(`./${contants.BUILD_DIR}`));

    app.listen(PORT, () => {
      console.log(`${FgBlue}`, `Example app listening on`);
      console.log(`${FgYellow}`, `http://localhost:${PORT}`);
      console.log(`${FgYellow}`, `http://${ipv4}:${PORT}`);
      console.log(FgBlue, "  ");
    });
  } catch (e) {
    console.log("Что-то пошло не так !!!", e);
  }
})();
