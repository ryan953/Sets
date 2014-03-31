define([], function() {
  var buildMap = {};

  return {
    // http://requirejs.org/docs/plugins.html#apiload
    load: function (name, parentRequire, onload, config) {
      parentRequire([name], onload);
    },

    write: function (pluginName, name, write) {
        write(
            "Thorax.Views['" + name + "'] = require('" + name + "');\n"
        );
    }
  };
});
