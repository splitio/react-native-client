# Contributing to the Split React Native SDK

Split SDK is an open source project and we welcome feedback and contribution. The information below describes how to build the project with your changes, run the tests, and send the Pull Request(PR).

## Development

### Development process

1. Fork the repository and create a topic branch from `development` branch. Please use a descriptive name for your branch.
2. While developing, use descriptive messages in your commits. Avoid short or meaningless sentences like: "fix bug".
3. Make sure to add tests for both positive and negative cases.
4. If your changes have any impact on the public API, make sure you update the TypeScript declaration files as well as it's related test file.
5. Run the linter script of the project and fix any issues you find.
6. Run the build script and make sure it runs with no errors.
7. Run all tests and make sure there are no failures.
8. `git push` your changes to GitHub within your topic branch.
9. Open a Pull Request(PR) from your forked repo and into the `development` branch of the original repository.
10. When creating your PR, please fill out all the fields of the PR template, as applicable, for the project.
11. Check for conflicts once the pull request is created to make sure your PR can be merged cleanly into `development`.
12. Keep an eye out for any feedback or comments from Split's SDK team.

### Building the SDK

The build is done with the command `npm run build`. Refer to [package.json](package.json) for more insight on the build script.

### Running tests

All tests can be run at once with the command `npm run test`.

### Linting and other useful checks

Consider running the linter and type check script (`npm run check`) and fixing any issues before pushing your changes.

If you want to debug your changes consuming it from a test application, you could use the React Native App example at `/example` folder:

```bash
cd example/
npm install
npm run android # to run in an Android emulator
npm run ios # to run on a iOS emulator
```

Remember to check and follow the [React Native setting up guidelines](https://reactnative.dev/docs/environment-setup) before running the example.

# Contact

If you have any other questions or need to contact us directly in a private manner send us a note at sdks@split.io