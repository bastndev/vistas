# 📦 First Publish

```bash
# Login (only once)
npm login --auth-type=web

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

```ts
bun pm version patch; git push --follow-tags; bun publish
```

## Bug fix

```bash
bun pm version patch #0.1.2
bun publish
```

## New feature

```bash
bun pm version minor #0.2.0
bun publish
```

## Breaking change

```bash
bun pm version major  #2.0.0
bun publish
```

### One-line update (recommended)

```bash
bun pm version patch && git push --follow-tags && bun publish
```
