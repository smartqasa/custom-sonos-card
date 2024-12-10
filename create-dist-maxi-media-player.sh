#!/usr/bin/env bash
DIR="dist-maxi-media-player"
FILE="maxi-media-player.js"
mkdir -p $DIR

if ! command -v gsed >/dev/null 2>&1
then
    alias gsed=sed
fi

cp dist/custom-sonos-card.js $DIR/$FILE
cd $DIR || exit
gsed -i 's/"sonos-card"/"maxi-media-player"/g' $FILE
gsed -i 's/"Sonos"/"Maxi Media Player"/g' $FILE
gsed -i 's/sonos-card-/mxmp-/g' $FILE
gsed -i 's/sonos-/mxmp-/g' $FILE
gsed -i 's/sonos-card-dispatch/mxmp-dispatch/g' $FILE
gsed -i 's/Sonos Card/Maxi Media Player/g' $FILE
gsed -i 's/Media player for your Sonos speakers/Media card for Home Assistant UI with a focus on managing multiple media players/g' $FILE

FILE="README.md"
cd ..
cp $FILE $DIR/
cd $DIR || exit
gsed -i '/\/\/#ONLY_SONOS_CARD_START/,/\/\/#ONLY_SONOS_CARD_END/d' $FILE
gsed -i ':a;N;$!ba;s/[^\n]*#ONLY_SONOS_CARD[^\n]*\n//g' $FILE
gsed -i 's/custom-sonos-card/maxi-media-player/g' $FILE
gsed -i 's/custom:sonos-card/custom:maxi-media-player/g' $FILE
gsed -i 's/Sonos Card/Maxi Media Player/g' $FILE
