const { JsiiProject } = require('projen');

const project = new JsiiProject({
  name: '@kcwinner/projen-github-demo',
  repositoryUrl: 'https://github.com/kcwinner/projen-github-demo.git',
  author: 'Ken Winner',
  authorAddress: 'kcswinner@gmail.com',
  defaultReleaseBranch: 'main',

  devDeps: [
    'fs-extra',
    '@types/fs-extra@^8', // This will break if it's on 9
  ],
  deps: ['projen'],
  peerDeps: ['projen'],

  dependabot: false, // Disabling because it is a demo project
  mergify: false, // Disabling because it is a demo project

  npmDistTag: 'latest', /* Tags can be used to provide an alias instead of version numbers. */
  npmRegistryUrl: 'https://npm.pkg.github.com',
});

project.synth();