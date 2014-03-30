define(["thorax"], function(Thorax) {
  return {

    // http://requirejs.org/docs/plugins.html#apiload
    load: function (name, parentRequire, onload, config) {
      parentRequire([name], function(raw) {
        Thorax.Views[name] = raw;
        onload(raw);
      });
    }
  };
});
