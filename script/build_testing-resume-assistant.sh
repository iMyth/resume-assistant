#!/bin/bash

alias cnpm="npm --registry=https://registry.npm.taobao.org --cache=$HOME/.npm/.cache/cnpm  --disturl=https://npm.taobao.org/dist  --userconfig=$HOME/.cnpmrc"
curdir=`pwd`
cp -a  /data/node_modules_resume-assistant/node_modules/ ./
cd $curdir && cnpm install && cnpm run build
sudo rm -rf ./node_modules/ 
