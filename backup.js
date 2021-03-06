#!/usr/bin/env node
// **********************
// Simple Node.js Backup script
// @Author: Eralp Kor
// *********************
// Usage: --src or -s [string] --dest or -d [string]
// node backup.js --help
// If files set read only attribute they will not be copied
// If destination file same as source it will be overwritten 

// Color references 
const Reset = "\x1b[0m";
const Red = "\x1b[31m";
const Blue = "\x1b[34m";
const Green = "\u001b[36m";

const fs = require('fs');
const path = require('path');
const args = require('yargs');
const now = (new Date()).toJSON().slice(0, 16).replace(/[-T]/g, '-');

// Get user inputs, src and dest paths.
args.option({
  'src': {
    alias: 's',
    describe: 'provide a path to copy files from.',
    demandOption: true
  },
  'dest': {
    alias: 'd',
    describe: 'provide a path to copy files to.',
    demandOption: true
  },
  'version': {
    alias: 'v'
  }
})
.usage('Usage: --src or -s [string] --dest or -d [string]')
.help()
.argv

var sourcePath = args.argv.s;
var destinationPath = args.argv.d;

function getDestinationPath(baseDirectory) {
  const date = (new Date()).toJSON().slice(0, 10).replace(/[-T]/g, '-');
  return baseDirectory + date;
}

// Copy files recursive
async function copyEverything(src, dest) {
  // Get files to copy from source directory
  let filesToCopy = await fs.readdirSync(src, {
    withFileTypes: true
  });
  // Make recursive directories
  await fs.mkdir(dest, {
    recursive: true
  }, (err) => {
    if (err) throw err;
  });

  for (let file of filesToCopy) {
    let srcPath = path.join(src, file.name);
    let destPath = path.join(dest, file.name);

    if (file.isDirectory()) {
      try {
        await copyEverything(srcPath, destPath);
      } catch (err) {
        console.log(`${Red}Something went wrong ${err}${Reset}`);
      }
    } else {
      try {
        await fs.copyFileSync(srcPath, destPath);
      } catch (err) {
        console.log(`${Red}Cannot finish the backup ${err}${Reset}`);
      }
    }
  }
}

// Run backup script and time stamp
async function backup() {
  console.log(`${Blue}Backup started: ${now}${Reset}`);
  let dest = getDestinationPath(destinationPath);
  try {
    await copyEverything(sourcePath, dest);
  } catch (error) {
    console.log(`${Red}Cannot write log files: ${error} ${Reset}`);
  }
}

backup()
  .then(() => {
    console.log(`${Green}Backup ended: ${now} ${Reset}`);
  })
  .catch((err) => {
    console.log(`${Red}Did not work... ${err} ${Reset}`);
  });

// EOF  