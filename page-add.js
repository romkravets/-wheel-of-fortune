// include node fs module
const fs = require("fs");
const minimist = require("minimist");
const argv = process.argv.slice(2);
const pageName = minimist(argv)["_"][0];
const stylesType = minimist(argv)["styles"];
const entries = require("./entries.json");
const util = require("util");
const { removePage, writeFile, readFilePromisified } = require("./utils");

const SUPPORTED_STYLES = ["css", "scss"];
const pathToFile = `${__dirname}/src/${pageName}/${pageName}`;

const FgRed = "\x1b[31m";
const FgGreen = "\x1b[32m";

String.prototype.insert = function(index, string) {
  if (index > 0)
    return (
      this.substring(0, index) + string + this.substring(index, this.length)
    );

  return string + this;
};

function checkValid(str) {
  const re = /^[a-z\d_]{0,30}$/;
  return re.test(str);
}

const readTemplate = async () =>
  await readFilePromisified(`${__dirname}/templates/base.html`);

const updateIndex = async () => {
  const tmpl = await readFilePromisified(`${__dirname}/src/index/index.html`);
  const indexOfEndOfpage = tmpl.indexOf("</body>");
  const u = tmpl.insert(
    indexOfEndOfpage,
    `<a href='./${pageName}.html' data-testid='${pageName}'>${pageName}</a>`
  );
  await writeFile(`${__dirname}/src/index/index.html`, u);
};
const revertChanges = async pageName => {
  await removePage(pageName);
};

const exists = util.promisify(fs.exists);
const mkdir = util.promisify(fs.mkdir);

const createDir = async () => {
  try {
    const dir = `${__dirname}/src/${pageName}`;
    const isExists = await exists(dir);
    if (!isExists) {
      await mkdir(dir);
    }
  } catch (e) {
    throw "Directory was not created";
  }
};
const validate = async (pageName, stylesType) => {
  if (!checkValid(pageName)) {
    throw "Validation error: имя страницы должно содержать только символы в нижнем регистре разделенные через _ например home_work_1";
  }

  if (!stylesType || SUPPORTED_STYLES.indexOf(stylesType) === -1) {
    throw `!!Validation error: используй только поддерживаемые форматы CSS или SCSS, команда должан быть npm run page:add [имя страницы] -- --styles=[scss или css] !!`;
  }
};

const addPage = async (pageName, stylesType = SUPPORTED_STYLES[0]) => {
  try {
    if (!pageName) {
      throw `!!Validation error: не указано имя страницы для создания, команда должан быть npm run page:add [имя страницы] -- --styles=[scss или css]!!`;
    }

    const dir = `${__dirname}/src/${pageName}`;
    const isExists = await exists(dir);

    if (isExists) {
      console.log(`${FgRed}`, "!!!Page already exists!!!");
      return;
    }

    await validate(pageName, stylesType);
    await createDir();
    const htmlTemplate = await readTemplate();
    const renderedTemplate = htmlTemplate.replace("${pageName}", pageName);
    await updateIndex("TEST");
    await writeFile(`${pathToFile}.html`, renderedTemplate);
    await writeFile(`${pathToFile}.${stylesType}`, "");
    await writeFile(
      `${pathToFile}.js`,
      `import './${pageName}.${stylesType}';`
    );

    entries[pageName] = [`./src/${pageName}/${pageName}.js`];

    await writeFile(
      `${__dirname}/entries.json`,
      `${JSON.stringify(entries, null, 2)}`
    );
    console.log(
      `${FgGreen}`,
      "Page successfully created" + JSON.stringify(entries, null, 2)
    );
  } catch (e) {
    revertChanges(pageName);
    console.log(`${FgRed}`, e);
  }
};

addPage(pageName, stylesType);
