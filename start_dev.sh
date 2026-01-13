#!/bin/bash

# Explicitly load NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Ensure we are using the LTS version we installed
nvm use --lts

# Install dependencies if missing (safety check)
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Run the dev server using the explicit node executable
echo "Starting Development Server with Node $(node -v)..."
node node_modules/vite/bin/vite.js
