Glamor is built into three formats in the NPM distribution:

## CommonJS

Available in the `lib/` folder, and is set as the `main` build in `package.json`. Works in CommonJS environments.

## ES6 Modules

Available in the `es6/` folder. Works in environments with native ES6 modules.

## UMD

Available in the `umd/` folder. Works in CommonJS, AMD, and browsers under the `Glamor` object.

# Using in Node

`require('glamor')`, will load the CommonJS build by default. Should work out of the box.

# Using in the browser

The UMD build works out of the box; you can load it as a `<script>` tag.

To use with a module loader/bundler such as Webpack or Rollup, you need to make it browser-friendly. See [this issue](https://github.com/threepointone/glamor/issues/218) for details.

## Webpack

Use the `DefinePlugin`:

    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    })

## Rollup

Use `rollup-plugin-replace`:

```
rollup({
  entry: 'main.js',
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify( 'production' )
    })
  ]
}).then(...)
```
