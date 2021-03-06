# projen GitHub Demo

Releasing to private GitHub packages is super simple with the new `npmRegistryUrl` support!

## Steps To Create

* Create new project
```bash
npx projen new jsii
```

* Set the package name using `@scope/package-name`
  * e.g. `name: '@kcwinner/projen-github-demo'`
* Set npm dist tag and npm registry
  * `npmDistTag: 'latest'`
  * `npmRegistryUrl: 'https://npm.pkg.github.com'`
* Generate personal access token for the repository
  * Give it `write:packages` permission
  * Set it as the repository secret `NPM_TOKEN`

## Steps To Use

* Generate a github personal access token
* Authenticate against the GitHub NPM registry using your GitHub username and personal access token:
  `npm login --scope @yourorg --registry https://npm.pkg.github.com`
* Validate you can see the project
  * `npm view @yourorg/package-name`
* `npx projen new --from @yourorg/package-name`