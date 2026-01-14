#!/bin/bash

# Explicitly load NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Ensure we have the LTS version installed and use it
nvm install --lts
nvm use --lts

# Install dependencies if missing (safety check)
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Run the dev server using npm run dev (concurrently vite and server)
echo "Starting Development Server with Node $(node -v)..."
npm run dev
