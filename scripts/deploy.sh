#!/usr/bin/env sh
#
# The script will apply the files founded in the interpolated-files folder.
# It will follow the order described in the TEMPLATES variable.

set -o errexit
set -o nounset

# Check if kubectl is installed
command -v kubectl >/dev/null 2>&1 || { echo "kubectl must be installed for this script! Aborting"; exit 1; }

# Automatically get the folder where the interpolated files must be placed.
__DIR=$(dirname "${0}")
DEPLOY_DIR="${__DIR}/../interpolated-files"

# Check if the folder exists
if [ ! -d "${DEPLOY_DIR}" ]; then echo "The ${DEPLOY_DIR} folder does not exists. Aborting!"; exit 1; fi

apply_from_file_template() {
  local TEMPLATE="${1}"
  for filePath in "${DEPLOY_DIR}"/*."${TEMPLATE}.yml"; do
    echo "Deploying ${TEMPLATE} from file ${filePath}"
    kubectl apply -f ${filePath}
  done
}

TEMPLATES="service deployment"

echo "Start deploy of files in context:"
kubectl config current-context
for template in ${TEMPLATES}; do
  apply_from_file_template "${template}"
done
