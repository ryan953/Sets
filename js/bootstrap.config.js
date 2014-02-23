requirejs.config({
    baseUrl: '.',
    paths: {
        almond: '../../bower_components/almond/almond',
        jquery: '../../bower_components/jquery/jquery',
        underscore: '../../bower_components/underscore/underscore',
        backbone: '../../bower_components/backbone/backbone',
        handlebars: '../../bower_components/handlebars/handlebars.amd',
        thorax: '../../bower_components/thorax/thorax',
        moment: '../../bower_components/moment/moment',
        domReady: '../../bower_components/requirejs-domready/domReady',

        'no-click-delay': 'lib/NoClickDelay',
        'backbone/local-storage': '../../bower_components/backbone.localStorage/backbone.localStorage-min'
    },
    shim: {
        backbone: {
            deps: ['jquery', 'underscore'],
            exports: 'Backbone'
        },
        underscore: {
            exports: '_'
        },
        thorax: {
            deps: [
                'jquery',
                'underscore',
                'backbone',
                'handlebars'
            ],
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
    }
});
