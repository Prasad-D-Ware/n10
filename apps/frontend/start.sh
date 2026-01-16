#!/bin/bash

# Frontend start script for production deployment
# This script builds the app if needed and starts the production server

set -e

echo "Starting frontend production server..."

# Check if dist directory exists, if not, build the app
if [ ! -d "dist" ]; then
  echo "Build directory not found. Building the app..."
  npm run build
else
  echo "Build directory found. Skipping build."
fi

# Start the production server
echo "Starting production server on 0.0.0.0:5173..."
npm run start
