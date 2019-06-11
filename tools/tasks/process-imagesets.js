const fs = require('fs');
const path = require('path');
const pidParser = require("../parsers/pid-parser");

function processImagesets(directory) {
  console.log("Parsing imagesets in: " + directory);

  const items = fs.readdirSync(directory);
  items.forEach(imageset => {
    const imageSetFileName = path.join(__dirname, '../../resources/imagesets', `${imageset}.json`);
    const mappingName = imageset.startsWith("LEVEL") ? "LEVEL" : imageset;
    try {
      const pidFilesPath = path.join(directory, imageset, 'IMAGES');
      const imageSetData = JSON.parse(fs.readFileSync(imageSetFileName));
      imageSetData.textures[0].frames.forEach(frame => {
        if (frame.filename.endsWith('.png')) {
          const pidPath = path.join(pidFilesPath, frame.filename.replace('.png', '.pid'));
          try {
            const pid = pidParser.parse(fs.readFileSync(pidPath));
            let path = frame.filename.split('/');
            let I = path.pop().match(/([^1-9]*)([0-9]*).*$/)[2];
            frame.anchor = {
              x: 0.5 - (pid.offsetX / pid.width).toPrecision(4),
              y: 0.5 - (pid.offsetY / pid.height).toPrecision(4)
            };
            frame.filename = mappingName + '_' + path.join('_') + I;
          } catch (e) {
            console.error("Failed to process " + pidPath);
          }
        }
      });
      fs.writeFileSync(imageSetFileName,JSON.stringify(imageSetData));
    } catch (e) {
      console.log(`${imageset} imageset not found or corrupt, skipping`);
    }
  });
}

module.exports = processImagesets;