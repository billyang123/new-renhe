exports.config =
  paths:
    watched: ['app/styles', 'app/scripts', 'app/assets']
    public: '_public' # export path
  files:

    javascripts:
      joinTo:#'javascripts/app.js' 
        'scripts/app.js' : /^app/
        'scripts/vendor.js' : /^bower_components/
      order:
        before: [
          'bower_components/jquery/dist/jquery.js'
          'bower_components/jquery-ujs/src/rails.js'
          'bower_components/handlebars/handlebars.js'
        ]
      pluginHelpers: 'scripts/vendor.js'
    stylesheets:
      joinTo:'styles/app.css'
      
    templates:
       joinTo: 'scripts/app.js'

  modules:
    nameCleaner: (path) ->
      path.replace(/^app\//, '') # root dir
  #   wrapper: (path, data) ->
  #     return 'require.define({#{path}, function (exports, require, module) {#{data}}});\n\n'
  # conventions:
  #   assets: /images(\/|\)/
  conventions:
    assets: /^app\/assets\//

 