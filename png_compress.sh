#!/bin/bash

# uses pngcrush, can be installed with apt using `apt install pngcrush`

mkdir -p compressed
for i in *.png; do
  dest="./compressed/$i"
  if [ -e "$dest" ]; then
    echo "File '$i' already exists in the compressed folder. Skipping..."
  else
    pngcrush -rem alla -q -reduce -brute "$i" "$dest"
  fi
done
