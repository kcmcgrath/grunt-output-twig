/*
 * grunt-output-twig
 * https://github.com/kcmcgrath/grunt-output-twig
 *
 * Copyright (c) 2013 Kevi r the MIT license.
 */

'use strict';

module.exports = function(grunt) {

	// Please see the Grunt documentation for more information regarding task
	// creation: http://gruntjs.com/creating-tasks

	var _ = grunt.util._;
	var path = require('path');
	var Twig = require("twig");

	/**
	 * GRUNT Task
	 */
	grunt.registerMultiTask("output_twig", "An extensions of Grunt Include Replace to leverage npm twig templates. Allows for dealmess workflow between frontend prototyping and CRAFT CMS (or similiar) templating", function() {
		var options = this.options({
			docroot: false,
			tmpext: '.html',
			context: { message : "Hello World" }
		});	

		/**
		 * TWIG Alterations
		 * Bring render and import functions to this context in order to set a default extension.
		 */
		require('./../lib/twig_overrides')(Twig,options);

		
		/**
		 * BEGIN Grunt Iteration
		 */	
		this.files.forEach(function(f) {
			f.src.forEach(function(src) {
				if (!grunt.file.isFile(src)) { return; }
				
				var output,
					contents = grunt.file.read(src);
				var template = new Twig.twig({
					data: contents
				});

				var basepath = path.resolve(path.dirname(src), path.resolve(options.docroot));
				var relpath = path.relative(basepath, path.dirname(src)) || '/';

				template.base = basepath;
				template.path = relpath;

				grunt.log.debug('template', template);

				try { output = template.render(options.context); }
				catch(e) { grunt.fail.warn('File "' + f.dest + '" FAILED. Reason: '+e); }
				
				grunt.log.debug('output', output);

				// Write the destination file.
				grunt.file.write(f.dest, output);

				// Print a success message.
				grunt.log.writeln('File "' + f.dest + '" created.');
			});
		});

	});

};
