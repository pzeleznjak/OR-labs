if [ "$#" -ne 1 ]; then
  echo "Usage: $0 sudo_password"
  exit 1
fi

echo 'Transpiling started'
tsc
echo 'Transpiling finished'
echo 'Copying required files'
rsync -av --exclude '*.ts' src/ dist/
echo 'Copying finished'
echo 'Running server.js'
echo "$1" | sudo -S node dist/server.js 
