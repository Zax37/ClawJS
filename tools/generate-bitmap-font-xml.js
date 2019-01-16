var lineHeight = 33;
var selected = false;

var letters = {
  ' ': { x: 1, width: 0, advance: 12 },
  'A': { x: 1, width: 27, advance: 25 },
  'B': { x: 29, width: 24 },
  'C': { x: 54, width: 26 },
  'D': { x: 81, width: 26, advance: 25 },
  'E': { x: 108, width: 26 },
  'F': { x: 135, width: 24 },
  'G': { x: 160, width: 28 },
  'H': { x: 189, width: 28 },
  'I': { x: 218, width: 14 },
  'J': { x: 233, width: 24 },
  'K': { x: 258, width: 28 },
  'L': { x: 287, width: 23, advance: 21 },
  'M': { x: 311, width: 31 },
  'N': { x: 343, width: 26, advance: 24 },
  'O': { x: 370, width: 27 },
  'P': { x: 398, width: 23 },
  'Q': { x: 422, width: 27, height: 31, yOffset: 8 },
  'R': { x: 450, width: 27 },
  'S': { x: 478, width: 22 },
  'T': { x: 501, width: 27, advance: 25 },
  'U': { x: 529, width: 26 },
  'V': { x: 556, width: 28, xOffset: -1, advance: 26 },
  'W': { x: 585, width: 34 },
  'X': { x: 620, width: 25 },
  'Y': { x: 646, width: 27, xOffset: -3, advance: 24 },
  'Z': { x: 674, width: 22 },
  ':': { x: 698, y: 8, width: 9, height: 18 },
  '=': { x: 711, y: 8, width: 20, height: 11, yOffset: 16 },
  '_': { x: 710, y: 20, width: 27, height: 6, xOffset: 3, yOffset: 28 },
};

var xml = '<font><info face="font" size="128"/><common lineHeight="' + lineHeight + '"/><chars count="' + Object.keys(letters).length + '">';

Object.keys(letters).forEach((letter) => {
  var data = letters[letter];
  var x = data.x || 0;
  var y = data.y || 0;
  var width = data.width || 0;
  var height = data.height || 25;
  var advance = data.advance || width - 1;
  var xOffset = data.xOffset || 0;
  var yOffset = data.yOffset || lineHeight - height;

  if (selected) {
    x -= 1;
    width += 1;
    height += 1;
    xOffset -= 1;
    yOffset -= 1;
  }

  xml += `<char id="${letter.charCodeAt(0)}" x="${x}" y="${y}" width="${width}" height="${height}" xoffset="${xOffset}" yoffset="${yOffset}" xadvance="${advance}"/>`;
});

xml += '</chars></font>';

console.log(xml);