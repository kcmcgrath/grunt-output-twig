module.exports = function(Twig, options) {
	function relativePath(template, file) {
		var base,
			base_path,
			sep_chr = "/",
			new_path = [],
			val;

		if (template.url) {
			if (typeof template.base !== 'undefined') {
				base = template.base + ((template.base.charAt(template.base.length-1) === '/') ? '' : '/');
			} else {
				base = template.url;
			}
		} else if (template.path) {
			// Get the system-specific path separator
			var path = require("path"),
				sep = path.sep || sep_chr,
				relative = new RegExp("^\\.{1,2}" + sep.replace("\\", "\\\\"));

			if (template.base !== undefined && file.match(relative) == null) {
				file = file.replace(template.base, '');
				base = template.base + sep;
			} else {
				base = template.path;
			}

			base = base.replace(sep+sep, sep);
			sep_chr = sep;
		} else {
			throw new Twig.Error("Cannot extend an inline template.");
		}

		base_path = base.split(sep_chr);

		// Remove file from url
		base_path.pop();
		base_path = base_path.concat(file.split(sep_chr));

		while (base_path.length > 0) {
			val = base_path.shift();
			if (val === ".") {
				// Ignore
			} else if (val === ".." && new_path.length > 0 && new_path[new_path.length-1] !== "..") {
				new_path.pop();
			} else {
				new_path.push(val);
			}
		}

		var p = new_path.join(sep_chr);
			p = path.extname(p) === '' ? p + options.tmpext : p ;
		return p;
	}

	Twig.extend(function(Twig){
		Twig.Template.prototype.render = function (context, params) {
			params = params || {};

			var output,
				url;

			this.context = context || {};

			// Clear any previous state
			this.reset();
			if (params.blocks) {
				this.blocks = params.blocks;
			}

			output = Twig.parse.apply(this, [this.tokens, this.context]);

			// Does this template extend another
			if (this.extend) {
				var ext_template;

				// check if the template is provided inline
				if ( this.options.allowInlineIncludes ) {
					ext_template = Twig.Templates.load(this.extend);
					if ( ext_template ) {
						ext_template.options = this.options;
					}
				}

				// check for the template file via include
				if (!ext_template) {
					url = relativePath(this, this.extend);

					ext_template = Twig.Templates.loadRemote(url, {
						method: this.url?'ajax':'fs',
						base: this.base,
						async:  false,
						id:     url,
						options: this.options
					});
				}

				this.parent = ext_template;

				return this.parent.render(this.context, {
					blocks: this.blocks
				});
			}

			if (params.output === 'blocks') {
				return this.blocks;
			} else {
				return output;
			}
		};

		Twig.Template.prototype.importFile = function(file) {
			var url, sub_template;
			if ( !this.url && !this.path && this.options.allowInlineIncludes ) {
				sub_template = Twig.Templates.load(file);
				sub_template.options = this.options;
				if ( sub_template ) {
					return sub_template;
				}

				throw new Twig.Error("Didn't find the inline template by id");
			}

			url = relativePath(this, file);

			// Load blocks from an external file
			sub_template = Twig.Templates.loadRemote(url, {
				method: this.url?'ajax':'fs',
				base: this.base,
				async: false,
				options: this.options,
				id: url
			});

			return sub_template;
		};
	});
}