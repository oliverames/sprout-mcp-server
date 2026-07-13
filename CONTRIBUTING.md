# Contributing

Bug reports and focused pull requests are welcome. Please open an issue before starting a large feature so we can agree on the API shape and scope first.

## Local setup

You need Node.js 20.19 or newer.

```bash
npm ci
npm run check
```

`npm run check` compiles the TypeScript, runs the tests, audits production dependencies, and inspects the npm package contents.

## Pull requests

Keep each pull request to one change. Add or update tests for behavior changes, and update the tool catalog if you add or remove a tool. The catalog test checks the exact list that MCP clients receive.

Do not commit credentials, exported API responses, account IDs, or downloaded application packages. Use placeholders in fixtures and documentation.

By contributing, you agree that your contribution is licensed under the MIT License.
