Migrations are shown as diffs so you can see what you need to replace. Lines prefixed with `-` show the code before the migration and lines prefixed with `+` show the code after migration.

# Migrating from `v2` to `v3`

`v2` currently lives in the [`master`](https://github.com/threepointone/glamor/tree/master) branch. `v3` currently lives in the [`v3`](https://github.com/threepointone/glamor/tree/v3) branch.

## Independent packages

Glamor was converted to a monorepo. See https://github.com/threepointone/glamor/issues/204 for the motivation behind this. If you required or imported one of the following files before, you should read this migration step:

- `glamor/aphrodite`
- `glamor/jsxstyle`
- `glamor/ous`
- `glamor/react`
- `glamor/reset`
- `glamor/styled`
- `glamor/utils`

Everyone of this file is now a separate package which is prefixed with `glamor-`. E.g. `glamor/react` is now a package called `glamor-react`. You need to change your `require` or `import` accordingly and add the package as a new dependency in your `package.json`. The following diff shows the migration from `glamor/react` to `glamor-react`, but the step is similar for every other package, too.

```diff
{
  "name": "your-project",
  "dependencies": {
-    "glamor": "^2.0.0"
+    "glamor": "^3.0.0",
+    "glamor-react": "^3.0.0"
  }
}
```

```diff
-import { createElement } from 'glamor/react';
+import { createElement } from 'glamor-react';
```
