const Parser = require("binary-parser").Parser;
const path = require('path');
const fs = require('fs');
const BufferReader = require('buffer-reader');

const EntryType = { FILE: 0, DIRECTORY: 1 };

const rezHeaderParser = new Parser()
    .endianess("little")
    .uint16("magic", { assert: 2573 })
    .string("editorHeader", { encoding: "ascii", length: 122, stripNull: true })
    .uint16("magic", { assert: 2573 })
    .uint8("magic2", { assert: 26 })
    .uint32("rezVersion")
    .uint32("mainDirOffset")
    .uint32("mainDirSize")
    .uint32("unkn1")
    .uint32("lastDirOffset");

function readRezEntry(reader) {
    const type = reader.nextInt32LE();
    const offset = reader.nextInt32LE();
    const length = reader.nextInt32LE();
    const time = reader.nextInt32LE();
    let name, id, extRev, unkn;
    switch (type) {
        default:
        case EntryType.FILE:
            id = reader.nextInt32LE();
            extRev = reader.nextString(4).replace(/\0/g, '');
            unkn = reader.nextInt32LE();
            name = reader.nextStringZero() + '.' + extRev.split('').reverse().join('');
            if (reader.nextInt8() !== 0) {
                throw new Error('Second zero termination not found!');
            }
            return { type, offset, length, time, name };
        case EntryType.DIRECTORY:
            name = reader.nextStringZero();
            return { type, offset, length, time, name };
    }
}

function readRezDirectoryContents(reader, offset, size) {
    reader.seek(offset);
    const endPos = offset + size;

    const dirs = [];
    try {
        while (reader.tell() < endPos) {
            dirs.push(readRezEntry(reader));
        }
    } catch (e) {
        console.error(e);
    }

    for (let i = 0; i < dirs.length; i++) {
        if (dirs[i].type === EntryType.DIRECTORY) {
            dirs[i].contents = readRezDirectoryContents(reader, dirs[i].offset, dirs[i].length);
        }
    }

    return dirs;
}

function unpackRezData(reader, rezStructure, output) {
    if (!fs.existsSync(output)) {
        fs.mkdirSync(output);
    }

    for (let i = 0; i < rezStructure.length; i++) {
        if (rezStructure[i].type === EntryType.DIRECTORY) {
            unpackRezData(reader, rezStructure[i].contents, path.resolve(output, rezStructure[i].name));
        } else if (rezStructure[i].type === EntryType.FILE) {
            reader.seek(rezStructure[i].offset);

            fs.writeFileSync(path.resolve(output, rezStructure[i].name), reader.nextBuffer(rezStructure[i].length));
        }
    }
}

if (process.argv[2] && process.argv[3]) {
    const rezPath = path.resolve(process.argv[2]);
    const outPath = path.resolve(process.argv[3]);

    const rezFileBuffer = fs.readFileSync(rezPath);
    const rezHeader = rezHeaderParser.parse(rezFileBuffer);

    const reader = new BufferReader(rezFileBuffer);
    const rezData = readRezDirectoryContents(reader, rezHeader.mainDirOffset, rezHeader.mainDirSize);
    rezData.type = EntryType.DIRECTORY;

    unpackRezData(reader, rezData, outPath);
} else {
    console.log("Call arguments for rezParser: REZ_FILE_PATH, OUTPUT_DIRECTORY_PATH.")
}
