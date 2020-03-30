const fs = require('fs');

const frames = [
    { id: 401, time: 110 },
    { id: 609, time: 80 },
    { id: 610, time: 80 },
    { id: 611, time: 95 },
    { id: 610, time: 80 },
    { id: 609, time: 80 },
];
const imageSetName = "CLAW";

buffer = Buffer.alloc(32 + imageSetName.length + 20 * frames.length);
let offset = 0;
buffer.writeInt32LE(32, offset);
offset += 4 + 8;
buffer.writeInt32LE(frames.length, offset);
offset += 4;
buffer.writeInt32LE(imageSetName.length, offset);
offset += 4 + 12;
buffer.write(imageSetName, offset);
offset += imageSetName.length;

for (let i = 0; i < frames.length; i++) {
    offset += 2;
    buffer.writeInt16LE(3, offset);
    offset += 2 + 4;
    buffer.writeInt16LE(frames[i].id, offset);
    offset += 2;
    buffer.writeInt16LE(frames[i].time, offset);
    offset += 2 + 8;
}

fs.writeFileSync("FLY.ANI", buffer);
