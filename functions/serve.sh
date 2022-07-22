# build project
yarn build

# Copy template files
cp -r ./src/templates ./lib/src

# Run firebase emulator
firebase emulators:start --only functions