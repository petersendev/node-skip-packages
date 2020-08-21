# skip-packages

This packages was created primarily for the ability to separate the installation of packages from a private registry to a later stage to better facilitate docker's caching mechanism when you have to use an authentication which changes on every build.

```
skip-packages

skips or unskips packages

Options:
  --help        Show help                                              [boolean]
  --version     Show version number                                    [boolean]
  --unskip, -u                                        [boolean] [default: false]
```

## configuration

Configuration is done via the package.json. Simply define the names of the packages in a "skip" section. Packages will then be moved from the dependencies section to a "skipped" section. Unskipping reverses this.

```json
{
    "dependencies": {
        "fs-extra-promise": "^1.0.1",
        "yargs": "^13.2.4"
    },
    "skip": [
        "yargs"
    ]
}
```