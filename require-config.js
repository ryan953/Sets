/**
 * This is the main entry point for requirejs in this application. This file is
 * used as the second stop in the require.config chain by the following
 * initial require.config calls:
 *
 * - tasks/requirejs.js, used by grunt-contrib-requirejs for production builds
 * - test/index.html used by mocha in the browser and mocha_phantomjs
 * - test/main.karma.js used by the karma test runner
 * - public/index.html used by you while you develop your app
 *
 * In all cases, this file is the __second__ link of the requirejs configuration
 * chain, which is why it does not have a `baseUrl`. The job of this file
 * is to set up paths shared by all consumers of requirejs in this app.
 *
 * When running tests, test/main.js is the next stop, where more paths are
 * defined that are test specific
 *
 */

/**
 * If using karma, change the base path to /base/ which is where karma's built
 * in server serves files from. The file must be included in the files karma
 * is being told to serve in order for requirejs to pick it up. To include
 * and additional file add the file or glob a directory where the file exists
 * in the karma configuration files array. Make sure include is set to false.
 * We don't want to include the file on the page b/c requirejs will take of that
 * and ensure async happens correctly.
 */

var pathPrefix;
if (window.__karma__) {
    pathPrefix = '/base/';
} else {
    pathPrefix = '../';
}


require.config({
    dir: '/public/js',
    deps: ['sets-ui/sets'],
    paths: {
        'jquery': pathPrefix + 'bower_components/jquery/jquery',
        'underscore': pathPrefix + 'bower_components/underscore/underscore',
        'backbone': pathPrefix + 'bower_components/backbone/backbone',
        'handlebars': pathPrefix + 'bower_components/handlebars/handlebars',
        'thorax': pathPrefix + 'bower_components/thorax/thorax',
        'moment': pathPrefix + 'bower_components/moment/moment',
        // 'coffee-script': pathPrefix + 'bower_components/coffee-script/index',
        // 'cs': pathPrefix + 'bower_components/require-cs/cs',
    
        'domReady': pathPrefix + 'bower_components/requirejs-domReady/domready',
        'text': pathPrefix + 'bower_components/text/text',
        'hbs-loader': pathPrefix + 'bower_components/requirejs-hbs/hbs',
        
        'no-click-delay': pathPrefix + 'js/lib/NoClickDelay',
        'backbone/local-storage': pathPrefix + 'bower_components/backbone.localStorage/backbone.localStorage-min',

        'backbone-identity-map': pathPrefix + 'bower_components/backbone-identity-map/backbone-identity-map',

        'model': pathPrefix + 'js/utils/parent-model',
        'collection': pathPrefix + 'js/utils/parent-collection',
        'view': pathPrefix + 'js/utils/parent-view',

        'v': pathPrefix + 'js/utils/loaders/view-registry',
        'hbs': pathPrefix + 'js/utils/loaders/hbs-registry'
    },
    shim: {
        'underscore': {
            exports: '_'
        },
        'backbone': {
            deps: ['jquery', 'underscore'],
            exports: 'Backbone'
        },
        'backbone-identity-map': {
            'deps': ['underscore', 'backbone'],
            'exports': 'Backbone.IdentityMap',
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
                "thorax",
                "moment",
                "domReady",
                "hbs",
                "no-click-delay",
                "backbone/local-storage"
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
                "sets-ui/routers/game-router"
            ],
            "exclude": ["bootstrap", "utils", "lightbox", "game"]
        }
    ]
});