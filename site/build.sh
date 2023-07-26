#!/bin/bash

cp template.html dist/index.html
perl -p -i.bak -e 's/{{title}}/THE TITLE/' dist/index.html
app=`cat app.html && node_modules/.bin/remarkable ../README.md` perl -p -i.bak -e 's/{{main}}/$ENV{app}/' dist/index.html

cd ../yaid-py
py=`pydoc-markdown -p yaid`
