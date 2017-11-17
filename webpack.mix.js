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

// // This plugin short-circuits all Vue.js warning code
// plugins.push(new webpack.DefinePlugin({
//   'process.env': {
//     NODE_ENV: '"production"'
//   }
// }));
//
// // This plugin minifies with dead-code elimination
// plugins.push(new webpack.optimize.UglifyJsPlugin({
//   compress: {
//     warnings: false
//   }
// }));

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
     uglify: {
       compress: {
         warnings: false
       }
     }, // Uglify-specific options. https://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
  });
