#!/usr/bin/env bash
set -euo pipefail

ROOT="/Users/kimjiwook/Downloads/haru-anbu-main"
SRC="$ROOT/07_디자인/영상"
OUT="$ROOT/web/making-of/public/media"

mkdir -p "$OUT/video" "$OUT/poster"

# Higgsfield 4차 진화 비교 컷 (CH05 grid)
INPUTS=(
  "1차제작/s3.mp4|iter1"
  "2차제작/s1.mp4|iter2"
  "3차제작_시나리오1/1-4(2차).mp4|iter3"
  "4차제작/시나리오2/hf_20260406_084353_9dcd1390-6d52-4529-b650-3f5220349faa.mp4|iter4"
)

for entry in "${INPUTS[@]}"; do
  IFS='|' read -r src name <<< "$entry"
  in="$SRC/$src"
  echo "→ encode $name  (src: $src)"

  ffmpeg -y -hide_banner -loglevel error -i "$in" \
    -vf "scale=1280:-2:flags=lanczos" \
    -c:v libx264 -crf 22 -preset fast -movflags +faststart -pix_fmt yuv420p \
    -an \
    "$OUT/video/$name.mp4"

  ffmpeg -y -hide_banner -loglevel error -i "$in" \
    -vf "scale=854:-2:flags=lanczos" \
    -c:v libx264 -crf 26 -preset fast -movflags +faststart -pix_fmt yuv420p \
    -an \
    "$OUT/video/$name-480.mp4"

  ffmpeg -y -hide_banner -loglevel error -ss 0.5 -i "$in" -vframes 1 \
    -vf "scale=1280:-2:flags=lanczos" -q:v 3 \
    "$OUT/poster/$name.jpg"
done

echo
echo "Done. Outputs:"
ls -lh "$OUT/video" "$OUT/poster"
