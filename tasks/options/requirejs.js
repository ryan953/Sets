var grunt = require('grunt');

module.exports = {
    production: {
        options: {
            // baseUrl: 'tmp',
            // mainConfigFile: 'tmp/main.build.js', // wont work :/ see TODO: remove build duplication
            // name: '../bower_components/almond/almond',
            // include: ['main'],
            // exclude: ['coffee-script'],
            // stubModules: ['cs'],
            // out: 'dist/main.js',

            baseUrl: 'js',
            dir: 'dist/js',

            "optimize": "none", // "uglify"
            "skipDirOptimize": true,
            "generateSourceMaps": true,
            "skipPragmas": true,
            "skipModuleInsertion": false,
            "removeCombined": true,
            "wrap": false,
            "keepBuildDir": false,
            "enforceDefine": true,

            // "wrapShim": true,

            // removeCombined: true,
            // findNestedDependencies: true,
            // optimize: 'none',

            // these two are incompatible
            // preserveLicenseComments: false,
            // generateSourceMaps: true,
            
            paths: {
                'almond': '../bower_components/almond/almond',
                'jquery': '../bower_components/jquery/jquery',
                'underscore': '../bower_components/underscore/underscore',
                'backbone': '../bower_components/backbone/backbone',
                'handlebars': '../bower_components/handlebars/handlebars',
                'thorax': '../bower_components/thorax/thorax',
                'moment': '../bower_components/moment/moment',

                'domReady': '../bower_components/requirejs-domready/domReady',
                'text': '../bower_components/text/text',
                'hbs-loader': '../bower_components/requirejs-hbs/hbs',

                'no-click-delay': './lib/NoClickDelay',
                'backbone/local-storage': '../bower_components/backbone.localStorage/backbone.localStorage-min',

                'model': './utils/parent-model',
                'collection': './utils/parent-collection',
                'view': './utils/parent-view',

                'v': './utils/loaders/view-registry',
                'hbs': './utils/loaders/hbs-registry'
            },
            shim: {
                'underscore': {
                    deps: [],
                    exports: '_'
                },
                'backbone': {
                    deps: ['jquery', 'underscore'],
                    exports: 'Backbone'
                },
                'handlebars': {
                    exports: 'Handlebars'
                },
                'thorax': {
                    deps: ['backbone', 'handlebars'],
                    exports: 'Thorax'
                },
                'no-click-delay': {
                    deps: [],
                    exports: 'NoClickDelay'
                },
                'backbone/local-storage': {
                    deps: ['backbone'],
                    exports: 'Backbone.localStorage'
                }
            },
            "modules": [
                //First set up the common build layer.
                {
                    //module names are relative to baseUrl
                    "name": "bootstrap",
                    "create": true,
                    //List common dependencies here. Only need to list
                    //top level dependencies, "include" will find
                    //nested dependencies.
                    "include": [
                        "almond",
                        "underscore",
                        "backbone",
                        "thorax",
                        "moment",
                        "domReady",
                        "hbs",
                        "no-click-delay",
                        "backbone/local-storage",
                        "sets-ui/sets"
                        // "bootstrap.config"
                    ]
                },

                //Now set up a build layer for each main layer, but exclude
                //the common one. "exclude" will exclude nested
                //the nested, built dependencies from "common". Any
                //"exclude" that includes built modules should be
                //listed before the build layer that wants to exclude it.
                //The "page1" and "page2" modules are **not** the targets of
                //the optimization, because shim config is in play, and
                //shimmed dependencies need to maintain their load order.
                //In this example, common.js will hold jquery, so backbone
                //needs to be delayed from loading until common.js finishes.
                //That loading sequence is controlled in page1.js.
                {
                    //module names are relative to baseUrl/paths config
                    "name": "utils",
                    "create": true,
                    "include": [
                        "utils/clock",
                        "utils/orientation",
                        "utils/stop-watch",
                        "utils/time-display",
                        "model",
                        "collection",
                        "view",
                        "utils/model-cache-router"
                    ],
                    "exclude": ["bootstrap"]
                },

                {
                    "name": "game",
                    "create": true,
                    "include": [
                        "game/models/settings",
                        "game/models/help-game",
                        "game/models/sets",
                        "game/views/board"
                    ],
                    "exclude": ["bootstrap", "utils"]
                },

                {
                    "name": "lightbox",
                    "create": true,
                    "include": [
                        "lightbox/help",
                        "lightbox/settings",
                        "lightbox/stats"
                    ],
                    "exclude": ["bootstrap", "utils", "game"]
                },

                {
                    "name": "sets-ui",
                    "create": true,
                    "include": [
                        "sets-ui/sets",
                        "sets-ui/routers/game-router"
                    ],
                    "exclude": ["bootstrap", "utils", "lightbox", "game"]
                }
            ]
        }
    }
};