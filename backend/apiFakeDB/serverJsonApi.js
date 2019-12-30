const fs = require('fs');
const path = require('path');

const patternCheck = /.*.json$/g;
let list = [];

function searchFilesFromfolder(dir) {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    if (fs.lstatSync(fullPath).isDirectory()) {
      searchFilesFromfolder(fullPath);
    } else {
      list = [...list, fullPath];
    }
  });
}

const readFile = (pathFile) => new Promise((resolve, reject) => {
  fs.readFile(pathFile, 'utf8', (error, data) => {
    if (error) return reject(error);
    return resolve(data);
  });
});

async function getJsonFiles() {
  let results = [];
  searchFilesFromfolder('backend/apiFakeDB/');
  const files = [...list];
  if (files.code) { console.log(`Error: ${files.code}`); return results; } // eslint-disable-line no-console
  files.filter((f) => f.match(patternCheck) !== null)
    .forEach((f) => { results = [...results, readFile(f)]; });
  const r = await Promise.all(results);
  return r.map((el) => JSON.parse(el));
}


module.exports = getJsonFiles;
