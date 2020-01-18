const minimist = require('minimist');
const argv = process.argv.slice(2);
const pageName = minimist(argv)['_'][0];
const removePage = require(`${__dirname}/utils.js`).removePage;
removePage(pageName);
