# node.js backup & copy script

Usage: --src or -s [string] --dest or -d [string]

Options:
  --version, -v                                                        [boolean]
  --src, -s      provide a path to copy files from.                   [required]
  --dest, -d     provide a path to copy files to.                     [required]
  --help 

If files set read only attribute they will not be copied
If destination file same as source it will be overwritten 

Script doesn't try to do anything fancy with permissions etc. Just a simple copy of each file.
