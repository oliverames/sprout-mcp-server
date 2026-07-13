# Releasing

The npm package, server, and MCPB manifest carry the same version. Update these files together:

- `package.json` and `package-lock.json`
- `manifest.json`
- `SERVER_VERSION` in `src/constants.ts`
- `CHANGELOG.md`

## Release checks

Run the checks from a clean working tree on the intended release commit.

```bash
npm ci
npm run check
gitleaks detect --source . --no-banner --redact
gitleaks git . --no-banner --redact
```

Confirm npm identity and registry state before publishing:

```bash
npm whoami
npm view @oliverames/sprout-mcp-server version
npm publish --access public
```

After npm accepts the package, confirm its version, integrity, and `gitHead`. Tag the commit that produced the published files. If the package was published from uncommitted changes, compare its compiled `dist/` directory with candidate commits before choosing the tag. Do not move an existing release tag to make the history look tidy.

Create an annotated `vX.Y.Z` tag, push it, and create the GitHub release with short notes tied to the changelog. Verify the GitHub Actions run and the npm package after publication.
