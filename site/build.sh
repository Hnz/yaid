#!/bin/bash

bun build script.js --outdir dist --minify

cp darkmode.js assets/* node_modules/@picocss/pico/css/pico.min.css* dist
cp template.html dist/index.html
perl -p -i.bak -e 's/{{title}}/THE TITLE/' dist/index.html

app=`cat app.html && npx remarkable ../README.md` \
perl -p -i.bak -e 's/{{main}}/$ENV{app}/' dist/index.html

cp template.html dist/yaid-py.html
md=`cd ../yaid-py && cat README.md && pydoc-markdown -p yaid`
py=`echo "$md" | npx remarkable` \
perl -p -i.bak -e 's/{{main}}/$ENV{py}/' dist/yaid-py.html
