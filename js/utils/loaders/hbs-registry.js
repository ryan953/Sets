define(["handlebars"], function(Handlebars) {
  return {

    // http://requirejs.org/docs/plugins.html#apiload
    load: function (name, parentRequire, onload, config) {
      parentRequire(['hbs-loader!' + name], function(raw) {
        Handlebars.templates[name] = raw;
        onload(raw);
      });
    }
  };
});
