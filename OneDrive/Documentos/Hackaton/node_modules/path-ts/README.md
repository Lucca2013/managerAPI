# What is Path TS?

`path-ts` extends Node's `path` module with type safety.

```ts
import { join, ext, parse, basename, dirname } from "path-ts"

const path = join("foo", "bar", "baz") // 'foo/bar/baz'

const dir = dirname("foo/bar/baz.txt") // 'foo/bar'

const base = basename("foo/bar/baz.txt") // 'baz.txt'

const ext = extname("foo/bar/baz.txt") // '.txt'

const parsed = parse("/foo/bar/baz.txt")

parsed.root // '/'
parsed.dir // '/foo/bar'
parsed.base // 'baz.txt'
parsed.ext // '.txt'
parsed.name // 'baz'
```

[![npm version](https://img.shields.io/npm/v/path-ts.svg)](https://www.npmjs.com/package/path-ts)

# Installation

```bash
yarn add path-ts
# or
npm install path-ts
```

When configuring TypeScript, you'll have better results if you enable `strict` mode in your `tsconfig.json`:

```json
{
	"compilerOptions": {
		"strict": true
	}
}
```

## Browser Usage

`path-ts` depends on Node's built-in `path` module, however it can be polyfilled in a browser in ESBuild or Webpack allowing you to use the same type-safe path utilities in both the browser and Node.

# Path Builder API

`path-ts` provides a fluent API for building _absolute_ paths. This is useful when you want to build paths dynamically.

```ts
import { PathBuilder } from "path-ts"

const builder = PathBuilder.from("/foo")

// Builders act like immutable strings that can be appended by calling them like functions...
const childBuilder = resultBuilder("bar")
console.log(childBuilder) // '/foo/bar'
```

## Repo relative paths

Path Builders can be used to create type-safe path aliases relative to the root of your project:

```ts
import { PathBuilder, Join } from "path-ts"
import { fileURLToPath } from "node:url"
import { resolve } from "node:path"

/**
 * Aliased path to the root of the repository.
 */
export type RepoRootAlias = "@your-namespace/repo-root"

/**
 * Compiled directory name for TS output files.
 */
export const OutDirectoryName = "out"
export type OutDirectoryName = typeof OutDirectoryName

/**
 * The directory path of the current file, post-compilation.
 */
const __dirname = dirname(fileURLToPath(import.meta.url)) as Join<[RepoRootAlias, ...OutDirectoryName], "/">

/**
 * The absolute path to the root of the repository.
 */
const RepoRootAbsolutePath = resolve(__dirname, ...PathReflection.map(() => ".."))
type RepoRootAbsolutePath = RepoRootAlias

/**
 * Path builder relative to the repo root.
 */
export const repoRootPathBuilder = createPathBuilderResolver<RepoRootAlias>(RepoRootAbsolutePath)
```

### Usage

You can then build paths relative to the root of your project in a type-safe way:

```ts
import { repoRootPathBuilder } from "@your-namespace/repo-root"

const path = repoRootPathBuilder("src", "index.ts") // `@your-namespace/repo-root/src/index.ts`
```

## Mono-Repo Path Builders

You can create higher-order path builders that are specific to a certain directory in a monorepo:

```ts
type MonoRepoPackageName = "package-1" | "package-2"

/**
 * Path builder relative to a specific package's output directory.
 */
export function packageOutPathBuilder<P extends MonoRepoPackageName, S extends string[]>(
	packageName: P,
	...pathSegments: S
): PathBuilder<Join<[RepoRootAlias, P, OutDirectoryName, ...S], "/">> & string {
	return packagePathBuilder(packageName, OutDirectoryName, ...pathSegments)
}
```

# License

`path-ts` is licensed under the AGPL-3.0 license. Generally,
this means that you can use the software for free, but you must share
any modifications you make to the software.

For more information on commercial usage licensing, please contact us at
`hello@sister.software`
