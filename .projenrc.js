const { JsiiProject } = require('projen');

const project = new JsiiProject({
  author: 'Ken Winner',
  authorAddress: 'kcswinner@gmail.com',
  defaultReleaseBranch: 'main',
  jsiiFqn: "projen.JsiiProject",
  name: 'projen-github-demo',
  repositoryUrl: 'https://github.com/kcwinner/projen-github-demo.git',

  npmDistTag: 'latest',                                                     /* Tags can be used to provide an alias instead of version numbers. */
  npmRegistryUrl: 'https://registry.npmjs.org',                             /* The base URL of the npm package registry. */
});

project.synth();