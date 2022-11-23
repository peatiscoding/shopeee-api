# Releasing NPM package with script.

## Step 0. make sure we are using correct node version to build
##    NO: Hard stop
##    YES: Continue
## Step 1. Check if current version already exists?
##    YES, --patch false: Hard stop
##    YES, --patch true: npm version patch > continue
##    NO: Continue
## Step 3. build with tsup
##    NO: Hard stop
##    SUCCESS: Coninue
## Step 4. npm publish
## Step 5. git tag v<package-version>
## Step 6. git push


CODE_PATH=.
if [ ! -f "$CODE_PATH/package.json" ]
then
  echo "$CODE_PATH/package.json does not exists."
  exit 1;
fi

# Current Node version
NODE_VERSION=$(node --version)
NVM_REQUIRED=$(cat .nvmrc | grep -e '^v')*
PACKAGE_JSON_REQUIRED=v$(cat $CODE_PATH/package.json | jq .engines.node | sed 's/[^0-9.]//g')*

NPM_PACKAGE=$(cat $CODE_PATH/package.json | grep -m 1 name | sed 's/"name": "\(.*\)",/\1/g')
NPM_VERSION=$(npm view $NPM_PACKAGE version || echo 0.0.0)
CODE_VERSION=$(cat $CODE_PATH/package.json | grep -m 1 version | sed 's/[^0-9.]//g')

echo "(NODE)\n\tRequired by nvm '$NVM_REQUIRED';\n\tRequired by package.json '$PACKAGE_JSON_REQUIRED';\n\tCurrent '$NODE_VERSION';"
echo "(PACKAGE)\n\tON REGISTRY '$NPM_VERSION';\n\tSource Code '$CODE_VERSION';"

if [[ "$NODE_VERSION" == $PACKAGE_JSON_REQUIRED ]]
then
  echo "NODE Version satisfied package.json.";
else
  echo "NODE Version did not satisfied package json requirement $PACKAGE_JSON_REQUIRED. but got $NODE_VERSION."
  exit 1;
fi

if [[ "$NODE_VERSION" == $NVM_REQUIRED ]]
then
  echo "NODE Version satisfied nvm."
else
  echo "NODE Version did not satisfied nvm requirement $NVM_REQUIRED. but got $NODE_VERSION."
  exit 1;
fi

if [ "$NPM_VERSION" = "$CODE_VERSION" ]
then
  echo "Version already matched nothing to do. bye..";
  exit 0;
fi

npm run build
npm publish
git tag release-v$CODE_VERSION
# git push