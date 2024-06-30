/// Split file having n lines to two files T_filename and V_filename
/// given m% as first argument
///  and  list of filenames as second arg onwards
/// Usage node split.js 5% <filename> ...

import fs from 'fs'
function readTextFile(filename) {
    try {
        let file = fs.readFileSync(filename, 'utf8');
        let lines = file.toString().split('\n');
        return lines;
    } catch (err) {
        console.log(err);
        return [];
    }
}

function writeFile(textLines, filename) {
    try {
        fs.writeFileSync(filename, textLines, 'utf8');
    } catch (error) {
        console.error(`Error writing JSON file: ${filename}`);
    }
}

function random(m, n) {
    let result = [];
    for (let i = 0; i < n; i++) {
        let randomInt = Math.floor(Math.random() * m);
        if (result.includes(randomInt)) { // there is possibility that we will get a shorter array than n
            randomInt = Math.floor(Math.random() * m);
        }
        result.push(randomInt);
    }
    return result;
}


function randomSplit(arr, n) {
    const trainSet = [];
    const valSet = [];
    const valIdx = random(arr.length,n); // random indices for valset

    for (let i = 0; i < arr.length; i++) {
        if (valIdx.includes(i)) {
            valSet.push(arr[i]);
        } else {
            trainSet.push(arr[i]);
        }
    }

    return [trainSet, valSet];
}

function sumAll(ary) {
    return ary.reduce(function(total, i) { return total + i })
}
// Get the command-line arguments
const args = process.argv.slice(2)
if (args.length < 2 ) {
    console.log("Error args missing requires atleast two args split% and  pathname of text file")
    console.log("node split.js 5% filename1 filename2...")
    process.exit(-1);
}
const fnames = args.slice(1);
const split = parseInt(args[0])

console.log(`Splitting ${fnames} by ${split} percent`);

const allFiles = fnames.map((f)=>{return readTextFile(f)})
const allSizes = allFiles.map((n)=>{return n.length});
const valSize = allSizes.map((s)=>{return parseInt(s*split/100)})
const trainSize = allSizes.map((s,i)=>{return s-valSize[i]})
console.log(fnames)
console.log(`total data set ${allSizes} total ${sumAll(allSizes)}`)
console.log(`validation set ${valSize} total ${sumAll(valSize)}`)
console.log(`training   set ${trainSize}  total ${sumAll(trainSize)}`);

// iterate of over all files to split in train and valset
for (let i=0;i<allFiles.length;i++) {
    const data = allFiles[i]; // full data set of a file
    const n = valSize[i] // size validation set
    const [trn,val]=randomSplit(data,n);
    const fname = fnames[i]; // file name
    const t_fname = "T_"+fname // training filename
    const v_fname = "V_"+fname // validation filename
    console.log(`writing ${val.length} recs to ${v_fname}`)
    writeFile(val.join('\n'),v_fname);
    console.log(`writing ${trn.length} recs to ${t_fname}`)
    writeFile(trn.join('\n'),t_fname);
} 
