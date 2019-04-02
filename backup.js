// **********************
// Simple Node.js Backup script
// @Author: Eralp Kor
// *********************
// Change sourcePath and destinationPath to backup files
// If files set read only attribute they will not be copied
// If destination file same as source it will be overwritten 

const fs = require('fs');
const path = require('path');
const now = (new Date()).toJSON().slice(0, 16).replace(/[-T]/g, '-');
// Add your own source and destination paths.
const sourcePath = 'C:\\Users\\';
const destinationPath = '\\\\network_drive\\';

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
        console.log(`\x1b[31mSomething went wrong ${err}`);
      }
    } else {
      try {
        await fs.copyFileSync(srcPath, destPath);
      } catch (err) {
        console.log(`\x1b[31mCannot finish the backup ${err}`);
      }
    }
  }
}

// Run backup script and time stamp
async function backup() {
  console.log(`\x1b[34mBackup started: ${now}`);
  let dest = getDestinationPath(destinationPath);
  try {
    await copyEverything(sourcePath, dest);
  } catch (error) {
    console.log(`\x1b[31mCannot write log files: ${error}`);
  }
}

backup()
  .then(() => {
    console.log(`Backup ended: ${now}`);
  })
  .catch((err) => {
    console.log(`\x1b[31m Did not work... ${err}`);
  });