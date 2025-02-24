# TypeScript Scaffold with Bun.js

[![Formatted with Biome](https://img.shields.io/badge/Formatted_with-Biome-60a5fa?style=flat&logo=biome)](https://biomejs.dev/)
[![Linted with Biome](https://img.shields.io/badge/Linted_with-Biome-60a5fa?style=flat&logo=biome)](https://biomejs.dev)
[![Checked with Biome](https://img.shields.io/badge/Checked_with-Biome-60a5fa?style=flat&logo=biome)](https://biomejs.dev)

## Setup

Install `bun` (SEE: [mise.toml](./mise.toml)):

```sh
mise install
```

Install dependencies:

```sh
bun install
```

Start database (SEE: [compose.yml](./compose.yml)):

```sh
docker compose up -d
```

migration:

```sh
bun run migration:migrate
```

## Run example

```sh
bun src/index.ts
```
