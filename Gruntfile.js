/*
 * grunt-output-twig
 * https://github.com/kcmcgrath/grunt-output-twig
 *
 * Copyright (c) 2013 Kevin McGrath
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
				
		jshint: {
			all: [
				'Gruntfile.js',
				'tasks/*.js',
				'<%= nodeunit.tests %>',
			],
			options: {
				jshintrc: '.jshintrc',
			},
		},

		// Before generating any new files, remove any previously-created files.
		clean: {
			tests: ['test/output'],
		},

		// Configuration to be run (and then tested).
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

		// Unit tests.
		nodeunit: {
			tests: ['test/*_test.js'],
		},

	});

	// Actually load this plugin's task(s).
	grunt.loadTasks('tasks');

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-nodeunit');

	// Whenever the "test" task is run, first clean the "tmp" dir, then run this
	// plugin's task(s), then test the result.
	grunt.registerTask('test', ['clean', 'output_twig', 'nodeunit']);

	// By default, lint and run all tests.
	grunt.registerTask('default', ['jshint', 'test']);

};
