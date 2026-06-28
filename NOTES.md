# 📦 First Publish

```bash
# Login (only once)
bun login --auth-type=web

# Verify session
bun whoami

# Check if the package name is available
bun pm view <package-name>

# Review the files that will be published
bun pm pack --dry-run

# Publish
bun publish
```

<!-- --- // TODO: -->

# 🚀 Update Package

## Bug fix

```bash
bun pm version patch
bun publish
```

## New feature

```bash
bun pm version minor
bun publish
```

## Breaking change

```bash
bun pm version major
bun publish
```

### One-line update (recommended)

```bash
bun pm version patch && git push --follow-tags && bun publish
```
