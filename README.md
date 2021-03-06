# projen GitHub Demo

Releasing to private GitHub packages is super simple with the new `npmRegistryUrl` support!

## Steps

* Create new project
```bash
npx projen new jsii
```

* Set the package name using `@scope/package-name`
  * e.g. `name: '@kcwinner/projen-github-demo'`
* Set npm dist tag and npm registry
  * `npmDistTag: 'latest'`
  * `npmRegistryUrl: 'https://npm.pkg.github.com'`