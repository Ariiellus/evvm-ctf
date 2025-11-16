# GitHub Workflows Documentation

## Overview

This directory contains GitHub Actions workflows for automated publishing and release management of the EVVM TypeScript Library.

**🔒 Security Update (November 2025)**: This workflow has been updated to comply with npm's new security policies, using OIDC Trusted Publishers instead of legacy tokens.

## Workflows

### `publish.yml` - Automated Publishing and Release Workflow

This workflow automatically handles version bumping, npm publishing, and GitHub release creation when code is pushed to the `main` branch.

#### Workflow Features

- **Automatic Version Bumping**: Based on commit message prefixes
- **NPM Publishing**: Publishes to npm registry with public access
- **GitHub Releases**: Creates releases with version tags and changelogs
- **Git Tagging**: Automatically creates and pushes version tags

#### Version Bumping Strategy

The workflow determines version increments based on commit message prefixes:

| Commit Prefix | Version Bump | Example Change |
|---------------|--------------|----------------|
| `MAJOR:` | Major version | 1.0.0 → 2.0.0 |
| `MINOR:` | Minor version | 1.0.0 → 1.1.0 |
| Any other | Patch version | 1.0.0 → 1.0.1 |

#### Usage Examples

##### Major Version Release
```bash
git commit -m "MAJOR: breaking API changes for signature validation"
git push origin main
# Results in: 1.0.0 → 2.0.0
```

##### Minor Version Release
```bash
git commit -m "MINOR: add new generic signature builder functionality"
git push origin main
# Results in: 1.0.0 → 1.1.0
```

##### Patch Version Release (Default)
```bash
git commit -m "fix: correct validation bug in name service"
git commit -m "feat: improve error handling"
git commit -m "docs: update README examples"
git commit -m "refactor: optimize hash utilities"
git push origin main
# Results in: 1.0.0 → 1.0.1
```

#### Workflow Steps

1. **Code Checkout**: Fetches repository with full history
2. **Node.js Setup**: Configures Node.js 20.x environment
3. **Dependency Installation**: Runs `npm ci` to install dependencies
4. **Build Process**: Executes `npm run build` to compile the library
5. **Git Configuration**: Sets up GitHub Actions bot for commits
6. **Change Detection**: Collects commit messages since last release
7. **Version Bump Detection**: Analyzes commits to determine version increment
8. **Version Update**: Updates `package.json` with new version
9. **Version Commit**: Commits the version change back to repository
10. **NPM Publishing**: Publishes package to npm registry with OIDC authentication and provenance attestation
11. **Git Tagging**: Creates and pushes version tag
12. **GitHub Release**: Creates release with changelog and version info

#### Release Format

The workflow creates GitHub releases with the following format:

```
Release v1.0.7
Auto-generated release for version v1.0.7

## Changes:

- fix: update license from MIT to EVVM-NONCOMMERCIAL-1.0
- feat: add new signature validation method
- docs: update README with examples
```

#### Security & Authentication

This workflow uses **Trusted Publishers (OIDC)** for secure npm publishing:

- **No secrets required**: Uses GitHub's OIDC tokens for authentication
- **Automatic provenance**: Provides attestation for published packages
- **Enhanced security**: Eliminates long-lived token risks

#### Required Secrets

~~The workflow no longer requires any npm tokens~~ - **DEPRECATED as of November 2025**

- ~~`NPM_TOKEN`~~: No longer needed with OIDC trusted publishing
- `GITHUB_TOKEN`: Automatically provided by GitHub Actions (no setup needed)

#### Permissions

The workflow requires the following permissions:
- `contents: write` - For creating releases and pushing commits
- `packages: write` - For npm publishing
- `id-token: write` - **NEW**: Required for OIDC trusted publishing

## Setup Instructions

### 1. NPM Trusted Publishing Setup (OIDC)

**⚠️ Updated for npm Security Changes (November 2025)**

1. Log in to your npm account at https://www.npmjs.com/
2. Navigate to your profile settings → **Trusted Publishers**
3. Click **"Add Trusted Publisher"** and select **"GitHub Actions"**
4. Configure the trusted publisher:
   - **Repository owner**: `EVVM-org`
   - **Repository name**: `EVVM-viem-signature-library`
   - **Workflow filename**: `publish.yml`
   - **Branch**: `main`
   - **Environment** (optional): leave empty unless using specific environments

### ~~1. NPM Token Setup~~ - **DEPRECATED**

~~This method is no longer supported as of November 2025 due to npm security policy changes:~~
- ~~Classic tokens have been permanently disabled~~
- ~~Granular tokens now have maximum 90-day expiration~~
- ~~Use OIDC trusted publishing instead~~

### 2. Repository Configuration

Ensure your repository has:
- Branch protection rules for `main` branch (optional but recommended)
- Required status checks configured (optional)
- Proper collaborator permissions
- **GitHub Actions enabled** with permission to access OIDC tokens
- **Remove any existing `NPM_TOKEN` secrets** from repository settings

### 3. Package.json Configuration

Verify your `package.json` includes:
```json
{
  "name": "@evvm/viem-signature-library",
  "version": "1.0.0",
  "scripts": {
    "build": "rollup -c"
  }
}
```

## Troubleshooting

### Common Issues

#### Workflow Fails on NPM Publish
- **Cause**: OIDC trusted publishing not configured properly
- **Solution**: Verify trusted publisher setup in npm settings matches repository details exactly
- **Alternative**: Check that `id-token: write` permission is included in workflow

#### Version Bump Not Working
- **Cause**: Incorrect commit message format
- **Solution**: Ensure commit messages start with `MAJOR:` or `MINOR:` for non-patch versions

#### Build Failure
- **Cause**: TypeScript compilation errors or missing dependencies
- **Solution**: Run `npm run build` locally to identify and fix issues

#### Permission Denied Errors
- **Cause**: Insufficient repository permissions or OIDC configuration issues
- **Solution**: Verify workflow permissions in repository settings and npm trusted publisher configuration

#### OIDC Authentication Failures
- **Cause**: Mismatch between npm trusted publisher config and repository details
- **Solution**: Ensure exact match of owner, repository name, workflow file, and branch in npm settings

### Manual Override

If you need to manually trigger a specific version:

1. Temporarily modify the workflow file
2. Or use npm version commands locally (requires npm authentication):
   ```bash
   # For local publishing, you'll need granular access tokens (max 90 days)
   npm version patch|minor|major
   git push origin main --tags
   ```

**Note**: Local npm publishing now requires granular access tokens with limited lifetime (max 90 days) due to npm security policy changes.

## Best Practices

### Commit Message Guidelines

- Use clear, descriptive commit messages
- Only use `MAJOR:` for breaking changes that affect API compatibility
- Use `MINOR:` for new features that don't break existing functionality
- Regular commits (fixes, docs, refactoring) will automatically be patch versions

### Testing Before Release

- Always test your changes locally before pushing to main
- Consider using feature branches and pull requests for larger changes
- Run `npm run build` and `npm test` locally before committing

### Version Strategy

- **Patch (1.0.x)**: Bug fixes, documentation updates, internal improvements
- **Minor (1.x.0)**: New features, additional functionality, non-breaking enhancements
- **Major (x.0.0)**: Breaking changes, API modifications, architectural changes

## Monitoring

### Workflow Status

Monitor workflow execution:
- Check the **Actions** tab in your GitHub repository
- Review build logs for any failures
- Verify successful npm publication in the npm registry
- Confirm GitHub releases are created properly

### Release Verification

After each release:
1. Verify the new version appears on npm: `npm view @evvm/viem-signature-library`
2. Check that the GitHub release includes proper changelog
3. Confirm the version tag exists in the repository
4. Test installation: `npm install @evvm/viem-signature-library@latest`
5. Verify provenance attestation appears on the npm package page (indicates secure OIDC publishing)

## Security Migration (November 2025)

### npm Security Policy Changes

In November 2025, npm implemented significant security improvements:

#### What Changed:
- **Classic tokens permanently disabled**: All legacy classic tokens were revoked
- **Granular token limits**: New tokens limited to 90 days maximum expiration (default 7 days)
- **TOTP 2FA deprecated**: New TOTP setups disabled, WebAuthn/passkeys required

#### Migration Benefits:
- ✅ **No token management**: Eliminates token rotation and expiration concerns
- ✅ **Enhanced security**: Uses temporary, job-specific credentials
- ✅ **Automatic provenance**: Provides attestation for package authenticity
- ✅ **Phishing resistant**: No long-lived secrets to compromise
- ✅ **Better audit trails**: Complete traceability of package publications

#### Migration Steps Completed:
1. ✅ Added `id-token: write` permission to workflow
2. ✅ Removed dependency on `NODE_AUTH_TOKEN`
3. ✅ Added `--provenance` flag for automatic attestation
4. ✅ Updated documentation to reflect OIDC usage

#### Required Manual Setup:
- Configure npm trusted publisher (see setup instructions above)
- Remove old `NPM_TOKEN` secrets from repository
- Verify OIDC authentication in first workflow run

### Fallback Options

If OIDC setup fails temporarily:
- Create granular access tokens (max 90 days) for emergency publishing
- Use WebAuthn/passkeys for 2FA instead of TOTP
- Consider environment-specific trusted publishers for staging workflows