Migrations are shown as diffs so you can see what you need to replace. Lines prefixed with `-` show the code before the migration and lines prefixed with `+` show the code after migration.

# Migrating from `v2` to `v3`

`v2` currently lives in the [`master`](https://github.com/threepointone/glamor/tree/master) branch. `v3` currently lives in the [`v3`](https://github.com/threepointone/glamor/tree/v3) branch.

## Independent packages

Glamor was converted to a monorepo. See [#204](https://github.com/threepointone/glamor/issues/204) for the motivation behind this. If you required or imported one of the following files before, you should now install them as standalone package:

- `glamor/aphrodite` → `glamor-aphrodite`
- `glamor/lib/autoprefix` → `glamor-autoprefixer`
- `glamor/babel-hoist` → `babel-plugin-glamor`
- `glamor/jsxstyle` → `glamor-jsxstyle`
- `glamor/ous` → `glamor-ous`
- `glamor/react` → `glamor-react`
- `glamor/reset` → `glamor-reset`
- `glamor/server` → `glamor-server`
- `glamor/styled` → `glamor-styled`
- `glamor/utils` → `glamor-utils`

The following diff shows the migration from `glamor/react` to `glamor-react`, but the step is similar for every other package, too. Note that  `glamor-react` re-exports `glamor` for convenience so you don't need to install `glamor` separately.

```diff
{
  "name": "your-project",
  "dependencies": {
-    "glamor": "^2.0.0"
+    "glamor-react": "^3.0.0"
  }
}
```

```diff
-import { createElement } from 'glamor/react';
+import { createElement } from 'glamor-react';
```
