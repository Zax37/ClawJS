const fs = require('fs');
const path = require('path');

const processImagesets = require("./process-imagesets");
const processMaps = require('./process-maps');
const processPalettes = require("./process-palettes");

const data = {
  levels: []
};

if (process.argv[2]) {
  let directory = path.resolve(process.argv[2]);
  processImagesets(directory);
} else {
  console.log("No REZ supplied, skipping pids parsing.")
}

processPalettes(data.levels);
processMaps(data.levels);