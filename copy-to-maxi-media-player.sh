#!/usr/bin/env bash
rsync --exclude='copy-to-maxi-media-player.sh' --exclude='*.DS_Store' --exclude='coverage' --exclude='node_modules' --exclude='.git' --exclude='.idea' --exclude='dist' . ../maxi-media-player

find ../maxi-media-player -name "*" \
  -not -path "*/.idea/*" \
  -not -path "*/.git/*" \
  -not -path "*/node_modules/*" \
  -not -path "*/coverage/*" -type f \
  -exec gsed -i '/\/\/#ONLY_SONOS_CARD_START/,/\/\/#ONLY_SONOS_CARD_END/d' {} \; \
  -exec gsed -i 's/.*#ONLY_SONOS_CARD.*//g' {} \; \
  -exec gsed -i "s/'sonos-card'/'maxi-media-player'/g" {} \; \
  -exec gsed -i "s/'Sonos'/'Maxi Media Player'/g" {} \; \
  -exec gsed -i 's/custom-sonos-card/maxi-media-player/g' {} \; \
  -exec gsed -i 's/custom:sonos-card/custom:maxi-media-player/g' {} \; \
  -exec gsed -i 's/sonos-card-/mxmp-/g' {} \; \
  -exec gsed -i 's/sonos-/mxmp-/g' {} \; \
  -exec gsed -i 's/sonos-card-dispatch/mxmp-dispatch/g' {} \; \
  -exec gsed -i 's/Sonos Card/Maxi Media Player/g' {} \; \
  -exec gsed -i 's/Media player for your Sonos speakers/Media card for Home Assistant UI with a focus on managing multiple media players/g' {} \;
