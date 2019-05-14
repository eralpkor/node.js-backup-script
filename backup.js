#!/usr/bin/env node
// **********************
// Simple Node.js Backup script
// @Author: Eralp Kor
// *********************
// Change sourcePath and destinationPath to backup files
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
// .coerce(['src', 'dest'], path.resolve)
// .demandOption(['src', 'dest'], 'Please provide both source path and destination path arguments to work with this tool.')
.help()
.argv

console.log(args.argv.p, args.argv.d)

// Add your own source and destination paths.
// const sourcePath = 'C:\\Users\\Eralp\\Desktop\\fullstack-dev\\';
// const destinationPath = '\\\\KOR-NAS\\iTunes\\my_backup\\';

var sourcePath = args.argv.s;
var destinationPath = args.argv.d;
console.log(sourcePath, destinationPath)

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