/*
Converts PDF to text 
Usage: node pdf2text.cjs <pdf-filename> [chunksize:int | "all" ]

Notes: 
1. output file is <pdf-filename-with-extension.txt>
2. chunking not implemented
*/

const fs = require('fs');
//import fs from 'fs'
//import pdf from 'pdf-parse'
const pdf = require('pdf-parse')

function writeTextToFile(pathname, textstring) {
    try {
        fs.writeFileSync(pathname, textstring);
    } catch (err) {
        console.log(`Error writing to ${pathname}: ${err}`);
    }
}

function fileExists(pathname) {
    try {
        fs.statSync(pathname);
        return true;
    } catch (err) {
        if (err.code === 'ENOENT') {
            return false;
        } else {
            throw err;
        }
    }
}

// Get the command-line arguments
const args = process.argv.slice(2)
if (args.length <= 0 ) {
    console.log("Error args missing arg1 is pathname , arg2 is 'all' or chunksize default is 1024")
    process.exit(-1);
}
// Parse the arguments
const DEFAULTSIZE=1024
const pname = args[0];
var chunksize = DEFAULTSIZE
if (args.length>1) {
    chunksize = parseInt(args[1])
    if (isNaN(chunksize)) {
        chunksize='all' // implies all text no chunking
    }
}
console.log(`Pathname  :${pname}`);
console.log(`Chunksize :${chunksize}`);

if (!fileExists(pname)) {
    console.log(`${pname} : Does not exist`)
} 

let dataBuffer = fs.readFileSync(pname);
pdf(dataBuffer).then(function(data){
    let fname = pname.split(".")[0]+'.txt'
    writeTextToFile(fname, data.text);
})


// Example usage:

