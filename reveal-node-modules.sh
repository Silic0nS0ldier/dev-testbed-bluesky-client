
set -eu

# Copies `node_modules` out from Bazel
echo "Building node_modules"
bazel build \
    //:node_modules \
    //build_tools:node_modules \
    //build_defs/rollup_bundle:node_modules \
    //vendor:node_modules \
    //web_app:node_modules

echo "Cleaning old node_modules"
rm -rf ./node_modules
rm -rf ./build_tools/node_modules
rm -rf ./build_defs/rollup_bundle/node_modules
rm -rf ./vendor/node_modules
rm -rf ./web_app/node_modules

echo "Copying new node_modules"
cp -r ./.bazel/bin/node_modules ./
cp -r ./.bazel/bin/build_tools/node_modules ./build_tools/
cp -r ./.bazel/bin/build_defs/rollup_bundle/node_modules ./build_defs/rollup_bundle/
cp -r ./.bazel/bin/vendor/node_modules ./vendor/
cp -r ./.bazel/bin/web_app/node_modules ./web_app/
