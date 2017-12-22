let mix = require('laravel-mix');
let path = require('path');


// var plugins = [];

// This is for ESLint functionality
let rules = [
      // only lint local *.vue files
      {
        enforce: 'pre',
        test: /\.vue$/,
        loader: 'eslint-loader',
        exclude: /node_modules/
      }
    ]

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.js('resources/assets/js/productivity.js', 'public/js')
   .sass('resources/assets/sass/productivity.scss', 'public/css')
   .webpackConfig({
    //  resolve: {
    //    plugins: plugins,
    //  },
     module: {  // This is for ESLint functionality
       rules: rules,
     }
   })
   .options({
     extractVueStyles: true, // Extract .vue component styling to file, rather than inline.
     globalVueStyles: path.resolve('resources/assets/sass/_vue_global.scss'), // Variables file to be imported in every component.
  })
  .copyDirectory('public/js', '../../../public/vendor/productivity/js')
  .copyDirectory('public/css', '../../../public/vendor/productivity/css');

  // if (mix.inProduction()) {
  //     mix.version();
  //         // .copy('mix-manifest');
  // }
