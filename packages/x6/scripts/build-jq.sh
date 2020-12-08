 #!/bin/sh

name=jquery
version=3.5.1
target=./dist

cd node_modules
# rm -rf $name
# git clone https://github.com/jquery/jquery $name

cd $name
git checkout tags/$version -b $version
yarn
rm -rf $target
grunt custom:-ajax,-callbacks,-data,-deprecated,-event/alias,-event/trigger,-queue,-core/ready,-deferred,-exports/global,-serialize,-wrap dist:$target
