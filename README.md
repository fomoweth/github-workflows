# GitHub Workflows

> Reusable GitHub Actions workflows and actions for Solidity and Foundry projects.

## Table of Contents

- [Workflows](#workflows)
  - [Foundry CI](#foundry-ci)
  - [Foundry Docs](#foundry-docs)
- [Actions](#actions)
  - [RPC Environment](#rpc-environment)
- [License](#license)

## Workflows

### Foundry CI

Runs formatting, build, and test checks for Foundry projects.

```text
forge fmt --check
forge build --sizes
forge test -vvv
```

#### Inputs

| Input             | Description                 | Default   |
| ----------------- | --------------------------- | --------- |
| `foundry-version` | Foundry version to install. | `stable`  |
| `foundry-profile` | Foundry profile to use.     | `default` |

#### Secrets

| Secret            | Description                                      | Required |
| ----------------- | ------------------------------------------------ | -------- |
| `alchemy-api-key` | Alchemy API key used to configure RPC endpoints. | No       |
| `infura-api-key`  | Infura API key used to configure RPC endpoints.  | No       |

#### Usage

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
  workflow_dispatch:

jobs:
  ci:
    name: Continuous Integration
    uses: fomoweth/github-workflows/.github/workflows/foundry-ci.yml@main
    with:
      foundry-profile: ci
```

RPC credentials can be passed to the reusable workflow when fork-based tests require them:

```yaml
jobs:
  ci:
    name: Continuous Integration
    uses: fomoweth/github-workflows/.github/workflows/foundry-ci.yml@main
    with:
      foundry-profile: ci
    secrets:
      alchemy-api-key: ${{ secrets.ALCHEMY_API_KEY }}
      infura-api-key: ${{ secrets.INFURA_API_KEY }}
```

When neither secret is provided, the RPC environment action succeeds without exporting any `RPC_*` variables.

### Foundry Docs

Builds Foundry documentation and deploys the generated site to GitHub Pages.

The workflow runs `forge doc --build` using Foundry `v1.7.1` by default.

If the repository does not contain a root `book.toml`, the workflow creates a temporary configuration using the current repository name:

```toml
[output.html]
site-url = "/<repository-name>/"
```

If `book.toml` already exists, the existing configuration is used unchanged.

#### Inputs

| Input             | Description                 | Default  |
| ----------------- | --------------------------- | -------- |
| `foundry-version` | Foundry version to install. | `v1.7.1` |

#### Usage

```yaml
name: Docs

on:
  push:
    branches: [main]
  workflow_dispatch:

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  docs:
    name: Documentation
    permissions:
      contents: read
      pages: write
      id-token: write
    uses: fomoweth/github-workflows/.github/workflows/foundry-docs.yml@main
```

The caller must grant `contents: read`, `pages: write`, and `id-token: write` permissions for the reusable workflow to build and deploy the GitHub Pages artifact.

## Actions

### RPC Environment

Configures chain-specific `RPC_*` environment variables using Alchemy and Infura API keys.

Alchemy takes precedence for chains supported by both providers. Infura is used when Alchemy is unavailable for a supported chain.

A provider is skipped when its API key is not supplied. When neither API key is provided, the action succeeds without exporting any `RPC_*` variables.

See the [supported chains](https://github.com/fomoweth/github-workflows/blob/main/actions/rpc-env/src/constants.ts) for the complete list.

#### Inputs

| Input             | Description      | Required |
| ----------------- | ---------------- | -------- |
| `alchemy-api-key` | Alchemy API key. | No       |
| `infura-api-key`  | Infura API key.  | No       |

#### Usage

```yaml
- name: Configure RPC Environment
  uses: fomoweth/github-workflows/actions/rpc-env@main
  with:
    alchemy-api-key: ${{ secrets.ALCHEMY_API_KEY }}
    infura-api-key: ${{ secrets.INFURA_API_KEY }}
```

Generated variables use the `RPC_<CHAIN>` naming convention, for example:

```text
RPC_MAINNET
RPC_OPTIMISM
RPC_ARBITRUM
RPC_BASE
```

## License

This project is licensed under the [MIT License](LICENSE).
