# projen GitHub Demo

Releasing to private GitHub packages is super simple with the new `npmRegistryUrl` support!

## Steps To Create

* Create new project with `npx projen new jsii`
* Set the package name in `.projenrc.js` using `@scope/package-name`
  * e.g. `name: '@kcwinner/projen-github-demo'`
* Change the `jsiiFqn` value in `.projenrc.js
  * If you plan to only have on project type use `jsiiFqn: 'package-name.ProjectType'`
  * If you plan to have multiple types you can remove the value and let it detect automatically at install time
* Set npm dist tag and npm registry in `.projecrc.js`
  * `npmDistTag: 'latest'`
  * `npmRegistryUrl: 'https://npm.pkg.github.com'`
* Generate personal access token for the repository
  * Give it `write:packages` permission
  * Set it as the repository secret `NPM_TOKEN`

## Test Locally

*Disclaimer* - there is a [small bug](https://github.com/projen/projen/issues/597) with testing external modules locally

* Build with `yarn build`
* In a separate directory: `npx projen new --from ~/path/to/your/dist/js/package-name@x.x.x.jsii.tgz`

## Steps To Use After Publish

* Generate a github personal access token
* Authenticate against the GitHub NPM registry using your GitHub username and personal access token:
  `npm login --scope @yourorg --registry https://npm.pkg.github.com`
* Validate you can see the project
  * `npm view @yourorg/package-name`
* `npx projen new --from @yourorg/package-name`


## References

* [projen](https://github.com/projen/projen)
* [Configuring npm for use with GitHub Packages](https://docs.github.com/en/packages/guides/configuring-npm-for-use-with-github-packages)