#!/bin/bash

if [ "$#" -ne 2 ]; then
  echo "Usage: $0 <python_script.py>"
  exit 1
fi

target_directory="./data_handling/scripts"

cd "$target_directory" || exit 1

echo "$2" | sudo -S python3 "$1"

cd ..
cd ..

unset password
