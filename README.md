Bucket Versioning
Versioning is a means of keeping multiple variants of an object in the same bucket. You can use versioning to preserve, retrieve, and restore every version of every object stored in your Amazon S3 bucket. With versioning, you can easily recover from both unintended user actions and application failures

After creating the bucket you can upload files and folders to the bucket, and configure additional bucket settings.

run the below command to creatde package.json
npm init -y

to ignore node modules
echo "node_modules" >> .gitignore

Add typescript as a dependency
npm install --save-dev typescript
The flag --save-dev will tell NPM to install Typescript as a devDependency. The difference between a devDependency and a dependency is that devDependencies will only be installed when you run npm install, but not when the end-user installs the package.
For example, Typescript is only needed when developing the package, but it’s not needed while using the package.

In order to compile Typescript we also need a tsconfig.json file so let’s add it to the project root:
{
  "compilerOptions": {
    "target": "es5",
    "module": "commonjs",
    "declaration": true,
    "outDir": "./lib",
    "strict": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "**/__tests__/*"]
}

You normally don’t want to have auto-generated files under source control i.e. files added to these folders wont be shown in changes section of Source to commmit
node_modules
/lib

An awesome package should include strict rules for linting and formatting. Especially if you want more collaborators later on. Let’s add Prettier and TsLint!
npm install --save-dev prettier tslint tslint-config-prettier

In the root, add a tslint.json:

{
   "extends": ["tslint:recommended", "tslint-config-prettier"]
}
And a .prettierrc

{
  "printWidth": 120,
  "trailingComma": "all",
  "singleQuote": true
}

*************In our .gitignore file, we added /lib since we don’t want the build-files in our git repository. The opposite goes for a published package. We don’t want the source code, only the build-files!

This can be solved in two ways. One way is to blacklist files/folders in a .npmignore file. Should have looked something like this in our case:
src
tsconfig.json
tslint.json
.prettierrc

However, blacklisting files is not a good practice. Every new file/folder added to the root needs to be added to the .npmignore file as well! Instead, you should whitelist the files /folders you want to publish. This can be done by adding the files property in package.json:
“files”: [“lib/**/*”]

Setup Testing with Jest:

npm install --save-dev jest ts-jest @types/jest
Create a new file in the root and name it jestconfig.json:

Remove the old test script in package.json and change it to:

"test": "jest --config jestconfig.json",

Use the magic scripts in NPM
For an awesome package, we should of course automate as much as possible. We’re about to dig into some scripts in npm: prepare, prepublishOnly, preversion, version and postversion

prepare will run both BEFORE the package is packed and published, and on local npm install. Perfect for running building the code. Add this script to package.json

"prepare" : "npm run build"
prepublishOnly will run BEFORE prepare and ONLY on npm publish. Here we will run our test and lint to make sure we don’t publish bad code:

"prepublishOnly" : "npm test && npm run lint"
preversion will run before bumping a new package version. To be extra sure that we’re not bumping a version with bad code, why not run lint here as well? 😃

"preversion" : "npm run lint"
Version will run after a new version has been bumped. If your package has a git repository, like in our case, a commit and a new version-tag will be made every time you bump a new version. This command will run BEFORE the commit is made. One idea is to run the formatter here and so no ugly code will pass into the new version:

"version" : "npm run format && git add -A src"
Postversion will run after the commit has been made. A perfect place for pushing the commit as well as the tag.

"postversion" : "git push && git push --tags"
This is how my scripts section in package.json looks like:

"scripts": {
   "test": "jest --config jestconfig.json",
   "build": "tsc",
   "format": "prettier --write \"src/**/*.ts\" \"src/**/*.js\"",
   "lint": "tslint -p tsconfig.json",
   "prepare": "npm run build",
   "prepublishOnly": "npm test && npm run lint",
   "preversion": "npm run lint",
   "version": "npm run format && git add -A src",
   "postversion": "git push && git push --tags"
}

To publish in npm:

run npm login to login to your NPM account.
npm publish

Bumping a new version
Let’s bump a new patch version of the package:

npm version patch
Our preversion, version, and postversion will run, create a new tag in git and push it to our remote repository. Now publish again:

npm publish
And now you have a new version

To run a ts file in node (by converting to js):
tsc <file-name>.ts
node <file-name>.js

To test the package locally:
npm link - This will create the package in your local global npm package. To find the path -> npm prefix -g

Each time you republish a package, you need to modify the version, else you will get error.