#!/bin/bash

if [ "$#" -ne 1 ]; then
  echo "Usage: $0 sudo_password"
  exit 1
fi

target_directory="./data_handling/dumps"

cd "$target_directory" || exit 1

echo "$1" | sudo -S rm -rf or_instructions.csv
echo "$1" | sudo -S rm -rf or_instructions.json
echo "$1" | sudo -S rm -rf or_filtered_instructions.csv
echo "$1" | sudo -S rm -rf or_filtered_instructions.json

unset password
