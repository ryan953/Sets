define(['thorax'], function(Thorax) {
  "use strict";
  return {
    pluginBuilder: 'utils/loaders/view-registry-builder',

    // http://requirejs.org/docs/plugins.html#apiload
    load: function (name, parentRequire, onload, config) {
      parentRequire([name], function(raw) {
        Thorax.Views[name] = raw;
        onload(raw);
      });
    }
  };
});
