#!/usr/bin/env bash
# exit on error
set -o errexit

npm install
npm run build
echo "Frontend build completed" 