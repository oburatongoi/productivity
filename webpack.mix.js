let mix = require('laravel-mix');
let WebpackShellPlugin = require('webpack-shell-plugin');
var path = require('path');

var plugins = [];

// This plugin allows you to run any shell commands before or after webpack builds
plugins.push(new WebpackShellPlugin({
  onBuildStart:[],
  onBuildEnd:[],
  onBuildExit:['echo vendor-pub && echo "Vendor files have been published"']
}));

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
     resolve: {
       plugins: plugins
     }
   })
   .options({
     extractVueStyles: true, // Extract .vue component styling to file, rather than inline.
     globalVueStyles: path.resolve('resources/assets/sass/_vue_global.scss'), // Variables file to be imported in every component.
  });
