const mix = require('laravel-mix');
const nodeDir = 'node_modules/';
const assets = 'resources/assets/';

// Plugins
mix
    .copy(nodeDir + 'jquery/dist/jquery.min.js', 'app/assets/node/js/jquery.min.js')
    .copy(nodeDir + 'bootstrap/dist/css/bootstrap.min.css', 'app/assets/node/css/bootstrap.min.css')
    .copy(nodeDir + 'bootstrap/dist/fonts', 'app/assets/node/fonts')
;