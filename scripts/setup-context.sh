#!/usr/bin/env sh
#
# This script will setup the current context for the kubectl CLI using the arguments passed to it.

set -o errexit
set -o nounset

ENVIRONMENT="${1}"
CLUSTER_CERT="${2}"
CLUSTER_IP="${3}"
USER_TOKEN="${4}"
USER_ID="${ENVIRONMENT}-gitlab-ci"
CLUSTER_NAME="${ENVIRONMENT}-cluster"
CERT_PATH="${PWD}/${ENVIRONMENT}.pem"

# Check if kubectl is installed
command -v kubectl >/dev/null 2>&1 || { echo "kubectl must be installed for this script! Aborting"; exit 1; }

echo "${CLUSTER_CERT}" > "${CERT_PATH}"
kubectl config set-cluster "${CLUSTER_NAME}" --server="${CLUSTER_IP}" --certificate-authority="${CERT_PATH}"
kubectl config set-credentials "${USER_ID}" --token="${USER_TOKEN}"
kubectl config set-context "${ENVIRONMENT}" --cluster="${CLUSTER_NAME}" --user="${USER_ID}"
kubectl config use-context "${ENVIRONMENT}"
