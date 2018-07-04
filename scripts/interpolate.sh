#!/usr/bin/env sh
#
# This script accept x paramenters and will interpolate the custom values from the passed variables inside the
# deployments file.

set -o errexit
set -o nounset

# Check if sed is installed
command -v sed >/dev/null 2>&1 || { echo "sed must be installed for this script! Aborting"; exit 1; }
# check if date is installed
command -v date >/dev/null 2>&1 || { echo "date must be installed for this script! Aborting"; exit 1; }

# Automatically get the folder where the source files must be placed.
__DIR=$(dirname "${0}")
SOURCE_DIR="${__DIR}/../kube-config"
# Check if the folder exists
if [ ! -d "${SOURCE_DIR}" ]; then echo "The ${SOURCE_DIR} folder does not exists. Aborting!"; exit 1; fi

# Enforce the creation and the emptiness of the destination folder where the interpolated files will be placed.
DEST_DIR="${__DIR}/../interpolated-files"
mkdir -p "${DEST_DIR}"
rm -fr "${DEST_DIR}"/*

# Create a variable that contains the current time in UTC
# Different flow if this script is running on Darwin or Linux machines.
if [ "$(uname)" = "Darwin" ]; then
  NOW_DATE="$(date -u +%FT%T%z)"
else
  NOW_DATE="$(date -I'seconds' -u)"
fi

interpolate_value() {
  local KEY=${1}
  local VALUE=${2}
  local FILE_PATH=${3}

  # The VALUE is being escaped for allow sed to working fine and don't f**k up the substitution
  sed -i.bck "s|${KEY}|${VALUE//&/\\&}|g" "${FILE_PATH}"
}

# Copy all the source files to DEST_DIR
cp -r "${SOURCE_DIR}"/* "${DEST_DIR}"

echo "Start files interpolations..."
for filePath in "${DEST_DIR}"/*.yml; do
  echo "Interpolating ${filePath}"
  interpolate_value "{{RELEASE_DATE}}" "${NOW_DATE}" "${filePath}"
  interpolate_value "{{AUTHOR_EMAIL}}" "${GITLAB_USER_EMAIL:-unset}" "${filePath}"
  interpolate_value "{{COMMIT_SHA}}" "${CI_COMMIT_SHA:-unset}" "${filePath}"
  interpolate_value "{{IMAGE_NAME}}" "${REMOTE_IMAGE_NAME}" "${filePath}"
done
rm -fr "${DEST_DIR}"/*.bck
echo "Finish files interpolations..."
