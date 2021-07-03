# typescript-starter-cycle
An opinionated starter for Cycle.js projects powered by TypeScript.

## Opinions
* TypeScript rocks. We use TypeScript as much as possible.
* Visual Studio Code rocks. We use Visual Studio Code as the recommended editor.
* Webpack rocks. We use webpack only.

## Features
* TypeScript
* Webpack
* TypeStyle for styles
* Simple routing with layouts
* Hot Module Reloading
* Async imports and dynamic routing
* Visual Studio Code integrations

### Planned
* Unit testing with Mocha and Chai
* UI Integration tests with Cypress
* Explanation of folder structure
* Wiki section on recommended/best practices
* Better README (duh!)

## Notes

### Visual Studio Code Specifics
This repository is optimized for [Visual Studio Code](https://code.visualstudio.com/).
We have launch configurations, an editor config file, and workspace settings.

To make full use of these, you need the following extensions:
* [Debugger for Chrome](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome)
* [EditorConfig for VS Code](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)

### Troubleshooting / Tips
* If using on Windows machines, make sure you have the [build tools](https://github.com/felixrieseberg/windows-build-tools) ready before doing an `npm install`.
* If hosting on a subdirectory, you need to change the `PROJECT_PUBLIC_PATH` in `webpack.config.js` only for production. You can do this by changing line #32 of the file to `const PROJECT_PUBLIC_PATH = __PROD__ ? '<your-public-path-here>' : '/';`
* If you need help with something, or have feedback, suggestions, feel free to open an issue on this repository.
