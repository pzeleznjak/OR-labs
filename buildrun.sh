echo 'Transpiling started'
tsc
echo 'Transpiling finished'
echo 'Copying required files'
rsync -av --exclude '*.ts' src/ dist/
echo 'Copying finished'
echo 'Running server.js'
node dist/server.js 
