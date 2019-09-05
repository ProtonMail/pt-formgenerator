#!/usr/bin/env bash
set -eo pipefail

TREE="assets/img/shared";
DIR="./node_modules/design-system/$TREE";
FILES=("loading.gif" "");

if [ "$1" = 'copy' ]; then
    mkdir -p "src/$TREE";
    cp -r "$DIR/." "src/$TREE/.";
fi;

if [ "$1" = 'dist' ]; then
    mkdir -p "dist/$TREE";
    cp "./src/$TREE/loading.gif" "./dist/$TREE/loading.gif";
    npx svgo "./src/$TREE/loading-atom-smaller.svg" -o "./dist/$TREE/loading-atom-smaller.svg";
    npx svgo "./src/$TREE/sprite-for-css-only.svg" -o "./dist/$TREE/sprite-for-css-only.svg";
fi;
