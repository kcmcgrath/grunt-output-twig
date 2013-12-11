# grunt-output-twig

> A Grunt version of npm twig. Allows for twig template to be compiled through grunt. The CRAFT CMS (http://buildwithcraft.com) was used for sample templates (and the whole reason I tried to do this in the first place). Not all TWIG capabilities are present, per the npm twig project. Notes on limitations are available here: https://github.com/justjohn/twig.js/wiki/Implementation-Notes

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-output-twig --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-output-twig');
```

## The "output_twig" task

### Overview
In your project's Gruntfile, add a section named `output_twig` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  output_twig: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### Options

#### options.docroot
Type: `String`
Default value: null

*Required*. The root path of twig templates. Needed to complete paths for proper include/extend references

#### options.tmpext
Type: `String`
Default value: `.html`

The extension of twig templates. Needed to complete paths for proper include/extend references

#### options.context
Type: `Object`
Default value: `{ message : "Hello World" }`

An object containing all variables to pass to twig templates

### Usage Examples

#### Default Options

```js
grunt.initConfig({
  output_twig: {
    settings: {
      options: {
        docroot: 'test/templates/'
      },
      files: [
        {
          expand: true,
          cwd: 'test/templates/',
          src: ['**/*.html','!_**/*', '!**/_*', '!_*'],
          dest: 'test/output/',
          ext: '.html'
        }
      ]
    }
  },
});
```

#### Custom Options
In this example, custom options are used to return more advanced template variables as thier argument - allowing for rendering of more integrated templates.

```js
grunt.initConfig({
  output_twig: {
    settings: {
      options: {
        docroot: 'test/templates/',
        tmpext: '.html',
        context: {
          url: function(input){ return input; },
          forms: {
            errorList: function(input){ return input; }
          },
          account: {
            email: 'email',
            username: 'user',
            getErrors: function(input){ return input; }
          },
          group: function(input){ return input; },
          slice: function(input){ return input; }
        }
      },
      files: [
        {
          expand: true,
          cwd: 'test/templates/',
          src: ['**/*.html','!_**/*', '!**/_*', '!_*'],
          dest: 'test/output/',
          ext: '.html'
        }
      ]
    }
  },
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
