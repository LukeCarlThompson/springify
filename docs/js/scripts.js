(function () {
	'use strict';

	/* **********************************************
	     Begin prism-core.js
	********************************************** */

	var _self = (typeof window !== 'undefined')
		? window   // if in browser
		: (
			(typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope)
			? self // if in worker
			: {}   // if in node js
		);

	/**
	 * Prism: Lightweight, robust, elegant syntax highlighting
	 * MIT license http://www.opensource.org/licenses/mit-license.php/
	 * @author Lea Verou http://lea.verou.me
	 */

	var Prism = (function (_self){

	// Private helper vars
	var lang = /\blang(?:uage)?-([\w-]+)\b/i;
	var uniqueId = 0;

	var _ = {
		manual: _self.Prism && _self.Prism.manual,
		disableWorkerMessageHandler: _self.Prism && _self.Prism.disableWorkerMessageHandler,
		util: {
			encode: function (tokens) {
				if (tokens instanceof Token) {
					return new Token(tokens.type, _.util.encode(tokens.content), tokens.alias);
				} else if (Array.isArray(tokens)) {
					return tokens.map(_.util.encode);
				} else {
					return tokens.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\u00a0/g, ' ');
				}
			},

			type: function (o) {
				return Object.prototype.toString.call(o).slice(8, -1);
			},

			objId: function (obj) {
				if (!obj['__id']) {
					Object.defineProperty(obj, '__id', { value: ++uniqueId });
				}
				return obj['__id'];
			},

			// Deep clone a language definition (e.g. to extend it)
			clone: function deepClone(o, visited) {
				var clone, id, type = _.util.type(o);
				visited = visited || {};

				switch (type) {
					case 'Object':
						id = _.util.objId(o);
						if (visited[id]) {
							return visited[id];
						}
						clone = {};
						visited[id] = clone;

						for (var key in o) {
							if (o.hasOwnProperty(key)) {
								clone[key] = deepClone(o[key], visited);
							}
						}

						return clone;

					case 'Array':
						id = _.util.objId(o);
						if (visited[id]) {
							return visited[id];
						}
						clone = [];
						visited[id] = clone;

						o.forEach(function (v, i) {
							clone[i] = deepClone(v, visited);
						});

						return clone;

					default:
						return o;
				}
			}
		},

		languages: {
			extend: function (id, redef) {
				var lang = _.util.clone(_.languages[id]);

				for (var key in redef) {
					lang[key] = redef[key];
				}

				return lang;
			},

			/**
			 * Insert a token before another token in a language literal
			 * As this needs to recreate the object (we cannot actually insert before keys in object literals),
			 * we cannot just provide an object, we need an object and a key.
			 * @param inside The key (or language id) of the parent
			 * @param before The key to insert before.
			 * @param insert Object with the key/value pairs to insert
			 * @param root The object that contains `inside`. If equal to Prism.languages, it can be omitted.
			 */
			insertBefore: function (inside, before, insert, root) {
				root = root || _.languages;
				var grammar = root[inside];
				var ret = {};

				for (var token in grammar) {
					if (grammar.hasOwnProperty(token)) {

						if (token == before) {
							for (var newToken in insert) {
								if (insert.hasOwnProperty(newToken)) {
									ret[newToken] = insert[newToken];
								}
							}
						}

						// Do not insert token which also occur in insert. See #1525
						if (!insert.hasOwnProperty(token)) {
							ret[token] = grammar[token];
						}
					}
				}

				var old = root[inside];
				root[inside] = ret;

				// Update references in other language definitions
				_.languages.DFS(_.languages, function(key, value) {
					if (value === old && key != inside) {
						this[key] = ret;
					}
				});

				return ret;
			},

			// Traverse a language definition with Depth First Search
			DFS: function DFS(o, callback, type, visited) {
				visited = visited || {};

				var objId = _.util.objId;

				for (var i in o) {
					if (o.hasOwnProperty(i)) {
						callback.call(o, i, o[i], type || i);

						var property = o[i],
						    propertyType = _.util.type(property);

						if (propertyType === 'Object' && !visited[objId(property)]) {
							visited[objId(property)] = true;
							DFS(property, callback, null, visited);
						}
						else if (propertyType === 'Array' && !visited[objId(property)]) {
							visited[objId(property)] = true;
							DFS(property, callback, i, visited);
						}
					}
				}
			}
		},
		plugins: {},

		highlightAll: function(async, callback) {
			_.highlightAllUnder(document, async, callback);
		},

		highlightAllUnder: function(container, async, callback) {
			var env = {
				callback: callback,
				selector: 'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'
			};

			_.hooks.run('before-highlightall', env);

			var elements = container.querySelectorAll(env.selector);

			for (var i=0, element; element = elements[i++];) {
				_.highlightElement(element, async === true, env.callback);
			}
		},

		highlightElement: function(element, async, callback) {
			// Find language
			var language = 'none', grammar, parent = element;

			while (parent && !lang.test(parent.className)) {
				parent = parent.parentNode;
			}

			if (parent) {
				language = (parent.className.match(lang) || [,'none'])[1].toLowerCase();
				grammar = _.languages[language];
			}

			// Set language on the element, if not present
			element.className = element.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;

			if (element.parentNode) {
				// Set language on the parent, for styling
				parent = element.parentNode;

				if (/pre/i.test(parent.nodeName)) {
					parent.className = parent.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;
				}
			}

			var code = element.textContent;

			var env = {
				element: element,
				language: language,
				grammar: grammar,
				code: code
			};

			var insertHighlightedCode = function (highlightedCode) {
				env.highlightedCode = highlightedCode;

				_.hooks.run('before-insert', env);

				env.element.innerHTML = env.highlightedCode;

				_.hooks.run('after-highlight', env);
				_.hooks.run('complete', env);
				callback && callback.call(env.element);
			};

			_.hooks.run('before-sanity-check', env);

			if (!env.code) {
				_.hooks.run('complete', env);
				return;
			}

			_.hooks.run('before-highlight', env);

			if (!env.grammar) {
				insertHighlightedCode(_.util.encode(env.code));
				return;
			}

			if (async && _self.Worker) {
				var worker = new Worker(_.filename);

				worker.onmessage = function(evt) {
					insertHighlightedCode(evt.data);
				};

				worker.postMessage(JSON.stringify({
					language: env.language,
					code: env.code,
					immediateClose: true
				}));
			}
			else {
				insertHighlightedCode(_.highlight(env.code, env.grammar, env.language));
			}
		},

		highlight: function (text, grammar, language) {
			var env = {
				code: text,
				grammar: grammar,
				language: language
			};
			_.hooks.run('before-tokenize', env);
			env.tokens = _.tokenize(env.code, env.grammar);
			_.hooks.run('after-tokenize', env);
			return Token.stringify(_.util.encode(env.tokens), env.language);
		},

		matchGrammar: function (text, strarr, grammar, index, startPos, oneshot, target) {
			for (var token in grammar) {
				if(!grammar.hasOwnProperty(token) || !grammar[token]) {
					continue;
				}

				if (token == target) {
					return;
				}

				var patterns = grammar[token];
				patterns = (_.util.type(patterns) === "Array") ? patterns : [patterns];

				for (var j = 0; j < patterns.length; ++j) {
					var pattern = patterns[j],
						inside = pattern.inside,
						lookbehind = !!pattern.lookbehind,
						greedy = !!pattern.greedy,
						lookbehindLength = 0,
						alias = pattern.alias;

					if (greedy && !pattern.pattern.global) {
						// Without the global flag, lastIndex won't work
						var flags = pattern.pattern.toString().match(/[imuy]*$/)[0];
						pattern.pattern = RegExp(pattern.pattern.source, flags + "g");
					}

					pattern = pattern.pattern || pattern;

					// Don’t cache length as it changes during the loop
					for (var i = index, pos = startPos; i < strarr.length; pos += strarr[i].length, ++i) {

						var str = strarr[i];

						if (strarr.length > text.length) {
							// Something went terribly wrong, ABORT, ABORT!
							return;
						}

						if (str instanceof Token) {
							continue;
						}

						if (greedy && i != strarr.length - 1) {
							pattern.lastIndex = pos;
							var match = pattern.exec(text);
							if (!match) {
								break;
							}

							var from = match.index + (lookbehind ? match[1].length : 0),
							    to = match.index + match[0].length,
							    k = i,
							    p = pos;

							for (var len = strarr.length; k < len && (p < to || (!strarr[k].type && !strarr[k - 1].greedy)); ++k) {
								p += strarr[k].length;
								// Move the index i to the element in strarr that is closest to from
								if (from >= p) {
									++i;
									pos = p;
								}
							}

							// If strarr[i] is a Token, then the match starts inside another Token, which is invalid
							if (strarr[i] instanceof Token) {
								continue;
							}

							// Number of tokens to delete and replace with the new match
							delNum = k - i;
							str = text.slice(pos, p);
							match.index -= pos;
						} else {
							pattern.lastIndex = 0;

							var match = pattern.exec(str),
								delNum = 1;
						}

						if (!match) {
							if (oneshot) {
								break;
							}

							continue;
						}

						if(lookbehind) {
							lookbehindLength = match[1] ? match[1].length : 0;
						}

						var from = match.index + lookbehindLength,
						    match = match[0].slice(lookbehindLength),
						    to = from + match.length,
						    before = str.slice(0, from),
						    after = str.slice(to);

						var args = [i, delNum];

						if (before) {
							++i;
							pos += before.length;
							args.push(before);
						}

						var wrapped = new Token(token, inside? _.tokenize(match, inside) : match, alias, match, greedy);

						args.push(wrapped);

						if (after) {
							args.push(after);
						}

						Array.prototype.splice.apply(strarr, args);

						if (delNum != 1)
							{ _.matchGrammar(text, strarr, grammar, i, pos, true, token); }

						if (oneshot)
							{ break; }
					}
				}
			}
		},

		tokenize: function(text, grammar) {
			var strarr = [text];

			var rest = grammar.rest;

			if (rest) {
				for (var token in rest) {
					grammar[token] = rest[token];
				}

				delete grammar.rest;
			}

			_.matchGrammar(text, strarr, grammar, 0, 0, false);

			return strarr;
		},

		hooks: {
			all: {},

			add: function (name, callback) {
				var hooks = _.hooks.all;

				hooks[name] = hooks[name] || [];

				hooks[name].push(callback);
			},

			run: function (name, env) {
				var callbacks = _.hooks.all[name];

				if (!callbacks || !callbacks.length) {
					return;
				}

				for (var i=0, callback; callback = callbacks[i++];) {
					callback(env);
				}
			}
		},

		Token: Token
	};

	_self.Prism = _;

	function Token(type, content, alias, matchedStr, greedy) {
		this.type = type;
		this.content = content;
		this.alias = alias;
		// Copy of the full string this token was created from
		this.length = (matchedStr || "").length|0;
		this.greedy = !!greedy;
	}

	Token.stringify = function(o, language) {
		if (typeof o == 'string') {
			return o;
		}

		if (Array.isArray(o)) {
			return o.map(function(element) {
				return Token.stringify(element, language);
			}).join('');
		}

		var env = {
			type: o.type,
			content: Token.stringify(o.content, language),
			tag: 'span',
			classes: ['token', o.type],
			attributes: {},
			language: language
		};

		if (o.alias) {
			var aliases = Array.isArray(o.alias) ? o.alias : [o.alias];
			Array.prototype.push.apply(env.classes, aliases);
		}

		_.hooks.run('wrap', env);

		var attributes = Object.keys(env.attributes).map(function(name) {
			return name + '="' + (env.attributes[name] || '').replace(/"/g, '&quot;') + '"';
		}).join(' ');

		return '<' + env.tag + ' class="' + env.classes.join(' ') + '"' + (attributes ? ' ' + attributes : '') + '>' + env.content + '</' + env.tag + '>';
	};

	if (!_self.document) {
		if (!_self.addEventListener) {
			// in Node.js
			return _;
		}

		if (!_.disableWorkerMessageHandler) {
			// In worker
			_self.addEventListener('message', function (evt) {
				var message = JSON.parse(evt.data),
					lang = message.language,
					code = message.code,
					immediateClose = message.immediateClose;

				_self.postMessage(_.highlight(code, _.languages[lang], lang));
				if (immediateClose) {
					_self.close();
				}
			}, false);
		}

		return _;
	}

	//Get current script and highlight
	var script = document.currentScript || [].slice.call(document.getElementsByTagName("script")).pop();

	if (script) {
		_.filename = script.src;

		if (!_.manual && !script.hasAttribute('data-manual')) {
			if(document.readyState !== "loading") {
				if (window.requestAnimationFrame) {
					window.requestAnimationFrame(_.highlightAll);
				} else {
					window.setTimeout(_.highlightAll, 16);
				}
			}
			else {
				document.addEventListener('DOMContentLoaded', _.highlightAll);
			}
		}
	}

	return _;

	})(_self);

	if (typeof module !== 'undefined' && module.exports) {
		module.exports = Prism;
	}

	// hack for components to work correctly in node.js
	if (typeof global !== 'undefined') {
		global.Prism = Prism;
	}


	/* **********************************************
	     Begin prism-markup.js
	********************************************** */

	Prism.languages.markup = {
		'comment': /<!--[\s\S]*?-->/,
		'prolog': /<\?[\s\S]+?\?>/,
		'doctype': /<!DOCTYPE[\s\S]+?>/i,
		'cdata': /<!\[CDATA\[[\s\S]*?]]>/i,
		'tag': {
			pattern: /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/i,
			greedy: true,
			inside: {
				'tag': {
					pattern: /^<\/?[^\s>\/]+/i,
					inside: {
						'punctuation': /^<\/?/,
						'namespace': /^[^\s>\/:]+:/
					}
				},
				'attr-value': {
					pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/i,
					inside: {
						'punctuation': [
							/^=/,
							{
								pattern: /^(\s*)["']|["']$/,
								lookbehind: true
							}
						]
					}
				},
				'punctuation': /\/?>/,
				'attr-name': {
					pattern: /[^\s>\/]+/,
					inside: {
						'namespace': /^[^\s>\/:]+:/
					}
				}

			}
		},
		'entity': /&#?[\da-z]{1,8};/i
	};

	Prism.languages.markup['tag'].inside['attr-value'].inside['entity'] =
		Prism.languages.markup['entity'];

	// Plugin to make entity title show the real entity, idea by Roman Komarov
	Prism.hooks.add('wrap', function(env) {

		if (env.type === 'entity') {
			env.attributes['title'] = env.content.replace(/&amp;/, '&');
		}
	});

	Object.defineProperty(Prism.languages.markup.tag, 'addInlined', {
		/**
		 * Adds an inlined language to markup.
		 *
		 * An example of an inlined language is CSS with `<style>` tags.
		 *
		 * @param {string} tagName The name of the tag that contains the inlined language. This name will be treated as
		 * case insensitive.
		 * @param {string} lang The language key.
		 * @example
		 * addInlined('style', 'css');
		 */
		value: function addInlined(tagName, lang) {
			var includedCdataInside = {};
			includedCdataInside['language-' + lang] = {
				pattern: /(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,
				lookbehind: true,
				inside: Prism.languages[lang]
			};
			includedCdataInside['cdata'] = /^<!\[CDATA\[|\]\]>$/i;

			var inside = {
				'included-cdata': {
					pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i,
					inside: includedCdataInside
				}
			};
			inside['language-' + lang] = {
				pattern: /[\s\S]+/,
				inside: Prism.languages[lang]
			};

			var def = {};
			def[tagName] = {
				pattern: RegExp(/(<__[\s\S]*?>)(?:<!\[CDATA\[[\s\S]*?\]\]>\s*|[\s\S])*?(?=<\/__>)/.source.replace(/__/g, tagName), 'i'),
				lookbehind: true,
				greedy: true,
				inside: inside
			};

			Prism.languages.insertBefore('markup', 'cdata', def);
		}
	});

	Prism.languages.xml = Prism.languages.extend('markup', {});
	Prism.languages.html = Prism.languages.markup;
	Prism.languages.mathml = Prism.languages.markup;
	Prism.languages.svg = Prism.languages.markup;


	/* **********************************************
	     Begin prism-css.js
	********************************************** */

	(function (Prism) {

		var string = /("|')(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/;

		Prism.languages.css = {
			'comment': /\/\*[\s\S]*?\*\//,
			'atrule': {
				pattern: /@[\w-]+[\s\S]*?(?:;|(?=\s*\{))/,
				inside: {
					'rule': /@[\w-]+/
					// See rest below
				}
			},
			'url': {
				pattern: RegExp('url\\((?:' + string.source + '|[^\n\r()]*)\\)', 'i'),
				inside: {
					'function': /^url/i,
					'punctuation': /^\(|\)$/
				}
			},
			'selector': RegExp('[^{}\\s](?:[^{};"\']|' + string.source + ')*?(?=\\s*\\{)'),
			'string': {
				pattern: string,
				greedy: true
			},
			'property': /[-_a-z\xA0-\uFFFF][-\w\xA0-\uFFFF]*(?=\s*:)/i,
			'important': /!important\b/i,
			'function': /[-a-z0-9]+(?=\()/i,
			'punctuation': /[(){};:,]/
		};

		Prism.languages.css['atrule'].inside.rest = Prism.languages.css;

		var markup = Prism.languages.markup;
		if (markup) {
			markup.tag.addInlined('style', 'css');

			Prism.languages.insertBefore('inside', 'attr-value', {
				'style-attr': {
					pattern: /\s*style=("|')(?:\\[\s\S]|(?!\1)[^\\])*\1/i,
					inside: {
						'attr-name': {
							pattern: /^\s*style/i,
							inside: markup.tag.inside
						},
						'punctuation': /^\s*=\s*['"]|['"]\s*$/,
						'attr-value': {
							pattern: /.+/i,
							inside: Prism.languages.css
						}
					},
					alias: 'language-css'
				}
			}, markup.tag);
		}

	}(Prism));


	/* **********************************************
	     Begin prism-clike.js
	********************************************** */

	Prism.languages.clike = {
		'comment': [
			{
				pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
				lookbehind: true
			},
			{
				pattern: /(^|[^\\:])\/\/.*/,
				lookbehind: true,
				greedy: true
			}
		],
		'string': {
			pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
			greedy: true
		},
		'class-name': {
			pattern: /((?:\b(?:class|interface|extends|implements|trait|instanceof|new)\s+)|(?:catch\s+\())[\w.\\]+/i,
			lookbehind: true,
			inside: {
				punctuation: /[.\\]/
			}
		},
		'keyword': /\b(?:if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,
		'boolean': /\b(?:true|false)\b/,
		'function': /\w+(?=\()/,
		'number': /\b0x[\da-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?/i,
		'operator': /--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*|\/|~|\^|%/,
		'punctuation': /[{}[\];(),.:]/
	};


	/* **********************************************
	     Begin prism-javascript.js
	********************************************** */

	Prism.languages.javascript = Prism.languages.extend('clike', {
		'class-name': [
			Prism.languages.clike['class-name'],
			{
				pattern: /(^|[^$\w\xA0-\uFFFF])[_$A-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\.(?:prototype|constructor))/,
				lookbehind: true
			}
		],
		'keyword': [
			{
				pattern: /((?:^|})\s*)(?:catch|finally)\b/,
				lookbehind: true
			},
			{
				pattern: /(^|[^.])\b(?:as|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,
				lookbehind: true
			} ],
		'number': /\b(?:(?:0[xX](?:[\dA-Fa-f](?:_[\dA-Fa-f])?)+|0[bB](?:[01](?:_[01])?)+|0[oO](?:[0-7](?:_[0-7])?)+)n?|(?:\d(?:_\d)?)+n|NaN|Infinity)\b|(?:\b(?:\d(?:_\d)?)+\.?(?:\d(?:_\d)?)*|\B\.(?:\d(?:_\d)?)+)(?:[Ee][+-]?(?:\d(?:_\d)?)+)?/,
		// Allow for all non-ASCII characters (See http://stackoverflow.com/a/2008444)
		'function': /#?[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,
		'operator': /-[-=]?|\+[+=]?|!=?=?|<<?=?|>>?>?=?|=(?:==?|>)?|&[&=]?|\|[|=]?|\*\*?=?|\/=?|~|\^=?|%=?|\?|\.{3}/
	});

	Prism.languages.javascript['class-name'][0].pattern = /(\b(?:class|interface|extends|implements|instanceof|new)\s+)[\w.\\]+/;

	Prism.languages.insertBefore('javascript', 'keyword', {
		'regex': {
			pattern: /((?:^|[^$\w\xA0-\uFFFF."'\])\s])\s*)\/(\[(?:[^\]\\\r\n]|\\.)*]|\\.|[^/\\\[\r\n])+\/[gimyus]{0,6}(?=\s*($|[\r\n,.;})\]]))/,
			lookbehind: true,
			greedy: true
		},
		// This must be declared before keyword because we use "function" inside the look-forward
		'function-variable': {
			pattern: /#?[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)\s*=>))/,
			alias: 'function'
		},
		'parameter': [
			{
				pattern: /(function(?:\s+[_$A-Za-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)?\s*\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\))/,
				lookbehind: true,
				inside: Prism.languages.javascript
			},
			{
				pattern: /[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*=>)/i,
				inside: Prism.languages.javascript
			},
			{
				pattern: /(\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\)\s*=>)/,
				lookbehind: true,
				inside: Prism.languages.javascript
			},
			{
				pattern: /((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:[_$A-Za-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*\s*)\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\)\s*\{)/,
				lookbehind: true,
				inside: Prism.languages.javascript
			}
		],
		'constant': /\b[A-Z](?:[A-Z_]|\dx?)*\b/
	});

	Prism.languages.insertBefore('javascript', 'string', {
		'template-string': {
			pattern: /`(?:\\[\s\S]|\${(?:[^{}]|{(?:[^{}]|{[^}]*})*})+}|(?!\${)[^\\`])*`/,
			greedy: true,
			inside: {
				'template-punctuation': {
					pattern: /^`|`$/,
					alias: 'string'
				},
				'interpolation': {
					pattern: /((?:^|[^\\])(?:\\{2})*)\${(?:[^{}]|{(?:[^{}]|{[^}]*})*})+}/,
					lookbehind: true,
					inside: {
						'interpolation-punctuation': {
							pattern: /^\${|}$/,
							alias: 'punctuation'
						},
						rest: Prism.languages.javascript
					}
				},
				'string': /[\s\S]+/
			}
		}
	});

	if (Prism.languages.markup) {
		Prism.languages.markup.tag.addInlined('script', 'javascript');
	}

	Prism.languages.js = Prism.languages.javascript;


	/* **********************************************
	     Begin prism-file-highlight.js
	********************************************** */

	(function () {
		if (typeof self === 'undefined' || !self.Prism || !self.document || !document.querySelector) {
			return;
		}

		/**
		 * @param {Element} [container=document]
		 */
		self.Prism.fileHighlight = function(container) {
			container = container || document;

			var Extensions = {
				'js': 'javascript',
				'py': 'python',
				'rb': 'ruby',
				'ps1': 'powershell',
				'psm1': 'powershell',
				'sh': 'bash',
				'bat': 'batch',
				'h': 'c',
				'tex': 'latex'
			};

			Array.prototype.slice.call(container.querySelectorAll('pre[data-src]')).forEach(function (pre) {
				// ignore if already loaded
				if (pre.hasAttribute('data-src-loaded')) {
					return;
				}

				// load current
				var src = pre.getAttribute('data-src');

				var language, parent = pre;
				var lang = /\blang(?:uage)?-([\w-]+)\b/i;
				while (parent && !lang.test(parent.className)) {
					parent = parent.parentNode;
				}

				if (parent) {
					language = (pre.className.match(lang) || [, ''])[1];
				}

				if (!language) {
					var extension = (src.match(/\.(\w+)$/) || [, ''])[1];
					language = Extensions[extension] || extension;
				}

				var code = document.createElement('code');
				code.className = 'language-' + language;

				pre.textContent = '';

				code.textContent = 'Loading…';

				pre.appendChild(code);

				var xhr = new XMLHttpRequest();

				xhr.open('GET', src, true);

				xhr.onreadystatechange = function () {
					if (xhr.readyState == 4) {

						if (xhr.status < 400 && xhr.responseText) {
							code.textContent = xhr.responseText;

							Prism.highlightElement(code);
							// mark as loaded
							pre.setAttribute('data-src-loaded', '');
						}
						else if (xhr.status >= 400) {
							code.textContent = '✖ Error ' + xhr.status + ' while fetching file: ' + xhr.statusText;
						}
						else {
							code.textContent = '✖ Error: File does not exist or is empty';
						}
					}
				};

				xhr.send(null);
			});

			if (Prism.plugins.toolbar) {
				Prism.plugins.toolbar.registerButton('download-file', function (env) {
					var pre = env.element.parentNode;
					if (!pre || !/pre/i.test(pre.nodeName) || !pre.hasAttribute('data-src') || !pre.hasAttribute('data-download-link')) {
						return;
					}
					var src = pre.getAttribute('data-src');
					var a = document.createElement('a');
					a.textContent = pre.getAttribute('data-download-link-label') || 'Download';
					a.setAttribute('download', '');
					a.href = src;
					return a;
				});
			}

		};

		document.addEventListener('DOMContentLoaded', function () {
			// execute inside handler, for dropping Event as argument
			self.Prism.fileHighlight();
		});

	})();

	function Springify(){
	var arguments$1 = arguments;
	for(var a=this,i=[],t=arguments.length;t--;){ i[t]=arguments$1[t]; }this.animating=!1;var n,p,e,o,m=0,u=10,s=30,r=20,c={output:0,velocity:0,amplitude:0},f=[],l=function(a,i,t){return a*(t-i)/100+i};i.map(function(i){void 0!==i.propName?(a[i.propName]=Object.assign({},c),a[i.propName].stiffness=i.input||m,a[i.propName].stiffness=i.stiffness||u,a[i.propName].damping=i.damping||s,a[i.propName].mass=i.mass||r,a[i.propName].input=i.input||m,a[i.propName].output=a[i.propName].input,f.push(a[i.propName])):a.callback=i;});var g=function(){var i;p=Date.now(),a.animating||(n=p-1),e=p-n,n=p,a.animating=!0,f.forEach(function(a){var i,t,n,p,o,m;t=l((i=a).stiffness,-1,-300),n=l(i.damping,-.4,-20),p=l(i.mass,.1,10),o=t*(i.output-i.input),m=n*i.velocity,i.amplitude=(o+m)/p,i.velocity+=i.amplitude*(e/1e3),i.output+=i.velocity*(e/1e3);}),(i=a).callback.apply(i,f),f.every(function(a){return Math.abs(a.velocity)<.5&&Math.abs(a.output-a.input)<.5})?(a.animating=!1,console.log("finished spring animation")):(cancelAnimationFrame(o),o=requestAnimationFrame(g));};this.animate=function(){a.animating||g();};}

	function sailboatDemo() {
	  var springySailboat = new Springify(
	    {
	      propName: "x",
	      input: 10,
	      stiffness: 10,
	      damping: 80,
	      mass: 50,
	    },
	    function(x) {
	      sailboat.style.left = (x.output) + "%";
	      sailboat.style.transform = "rotate(" + (x.velocity * -0.2) + "deg)";
	    }
	  );

	  var sailboat = document.querySelector(".sailboat");
	  var sailAway = document.querySelector(".sailboat--away");
	  var sailBack = document.querySelector(".sailboat--back");

	  sailAway.addEventListener("click", function () {
	    springySailboat.x.input = 90;
	    springySailboat.animate();
	  });

	  sailBack.addEventListener("click", function () {
	    springySailboat.x.input = 10;
	    springySailboat.animate();
	  });
	}

	function spiderDemo() {
	  var springySpider = new Springify(
	    {
	      propName: "x",
	      stiffness: 30,
	      damping: 50,
	      mass: 10,
	    },
	    function(x) {
	      spider.style.transform = "translateY(" + (x.output) + "px)";
	    }
	  );

	  var spider = document.querySelector(".spider");
	  var spiderArea = document.querySelector(".section--example-spider");

	  window.addEventListener("scroll", function () {
	    springySpider.x.input =
	      window.scrollY - spiderArea.offsetTop + window.innerHeight * 0.5;
	    springySpider.animate();
	  });
	}

	function heliDemo() {
	  var springyHelicopter = new Springify(
	    {
	      propName: "x",
	    },
	    {
	      propName: "y",
	    },
	    function(x, y) {
	      helicopter.style.transform = "translate(" + (x.output) + "px, " + (y.output) + "px) rotate(" + (x.velocity * 0.05) + "deg)";
	    }
	  );

	  var helicopter = document.querySelector(".helicopter");
	  var helicopterDemo = document.querySelector(".section--example-helicopter");

	  var helicopterMove = function (e) {
	    // normalize the mouse coordinates to the helicopter demo area
	    var helicopterDemoRect = helicopterDemo.getBoundingClientRect();
	    var relativeX =
	      e.clientX - (helicopterDemoRect.left + helicopterDemoRect.width * 0.5);

	    var relativeY =
	      e.clientY - (helicopterDemoRect.top + helicopterDemoRect.height * 0.5);

	    // Send our updated values as the inputs to the spring
	    springyHelicopter.x.input = relativeX;
	    springyHelicopter.y.input = relativeY;

	    // Start the animation
	    springyHelicopter.animate();
	  };

	  helicopterDemo.addEventListener("mousemove", function (e) { return helicopterMove(e); });
	  helicopterDemo.addEventListener("touchstart", function (e) { return helicopterMove(e); });
	}

	heliDemo();
	sailboatDemo();
	spiderDemo();

}());

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NyaXB0cy5qcyIsInNvdXJjZXMiOlsibm9kZV9tb2R1bGVzL3ByaXNtanMvcHJpc20uanMiLCJkaXN0L3NwcmluZ2lmeS5lc20uanMiLCJkb2NzL2pzL3NhaWxib2F0RGVtby5qcyIsImRvY3MvanMvc3BpZGVyRGVtby5qcyIsImRvY3MvanMvaGVsaURlbW8uanMiLCJkb2NzL2pzL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIlxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICBCZWdpbiBwcmlzbS1jb3JlLmpzXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5cbnZhciBfc2VsZiA9ICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJylcblx0PyB3aW5kb3cgICAvLyBpZiBpbiBicm93c2VyXG5cdDogKFxuXHRcdCh0eXBlb2YgV29ya2VyR2xvYmFsU2NvcGUgIT09ICd1bmRlZmluZWQnICYmIHNlbGYgaW5zdGFuY2VvZiBXb3JrZXJHbG9iYWxTY29wZSlcblx0XHQ/IHNlbGYgLy8gaWYgaW4gd29ya2VyXG5cdFx0OiB7fSAgIC8vIGlmIGluIG5vZGUganNcblx0KTtcblxuLyoqXG4gKiBQcmlzbTogTGlnaHR3ZWlnaHQsIHJvYnVzdCwgZWxlZ2FudCBzeW50YXggaGlnaGxpZ2h0aW5nXG4gKiBNSVQgbGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocC9cbiAqIEBhdXRob3IgTGVhIFZlcm91IGh0dHA6Ly9sZWEudmVyb3UubWVcbiAqL1xuXG52YXIgUHJpc20gPSAoZnVuY3Rpb24gKF9zZWxmKXtcblxuLy8gUHJpdmF0ZSBoZWxwZXIgdmFyc1xudmFyIGxhbmcgPSAvXFxibGFuZyg/OnVhZ2UpPy0oW1xcdy1dKylcXGIvaTtcbnZhciB1bmlxdWVJZCA9IDA7XG5cbnZhciBfID0ge1xuXHRtYW51YWw6IF9zZWxmLlByaXNtICYmIF9zZWxmLlByaXNtLm1hbnVhbCxcblx0ZGlzYWJsZVdvcmtlck1lc3NhZ2VIYW5kbGVyOiBfc2VsZi5QcmlzbSAmJiBfc2VsZi5QcmlzbS5kaXNhYmxlV29ya2VyTWVzc2FnZUhhbmRsZXIsXG5cdHV0aWw6IHtcblx0XHRlbmNvZGU6IGZ1bmN0aW9uICh0b2tlbnMpIHtcblx0XHRcdGlmICh0b2tlbnMgaW5zdGFuY2VvZiBUb2tlbikge1xuXHRcdFx0XHRyZXR1cm4gbmV3IFRva2VuKHRva2Vucy50eXBlLCBfLnV0aWwuZW5jb2RlKHRva2Vucy5jb250ZW50KSwgdG9rZW5zLmFsaWFzKTtcblx0XHRcdH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheSh0b2tlbnMpKSB7XG5cdFx0XHRcdHJldHVybiB0b2tlbnMubWFwKF8udXRpbC5lbmNvZGUpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmV0dXJuIHRva2Vucy5yZXBsYWNlKC8mL2csICcmYW1wOycpLnJlcGxhY2UoLzwvZywgJyZsdDsnKS5yZXBsYWNlKC9cXHUwMGEwL2csICcgJyk7XG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdHR5cGU6IGZ1bmN0aW9uIChvKSB7XG5cdFx0XHRyZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG8pLnNsaWNlKDgsIC0xKTtcblx0XHR9LFxuXG5cdFx0b2JqSWQ6IGZ1bmN0aW9uIChvYmopIHtcblx0XHRcdGlmICghb2JqWydfX2lkJ10pIHtcblx0XHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwgJ19faWQnLCB7IHZhbHVlOiArK3VuaXF1ZUlkIH0pO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIG9ialsnX19pZCddO1xuXHRcdH0sXG5cblx0XHQvLyBEZWVwIGNsb25lIGEgbGFuZ3VhZ2UgZGVmaW5pdGlvbiAoZS5nLiB0byBleHRlbmQgaXQpXG5cdFx0Y2xvbmU6IGZ1bmN0aW9uIGRlZXBDbG9uZShvLCB2aXNpdGVkKSB7XG5cdFx0XHR2YXIgY2xvbmUsIGlkLCB0eXBlID0gXy51dGlsLnR5cGUobyk7XG5cdFx0XHR2aXNpdGVkID0gdmlzaXRlZCB8fCB7fTtcblxuXHRcdFx0c3dpdGNoICh0eXBlKSB7XG5cdFx0XHRcdGNhc2UgJ09iamVjdCc6XG5cdFx0XHRcdFx0aWQgPSBfLnV0aWwub2JqSWQobyk7XG5cdFx0XHRcdFx0aWYgKHZpc2l0ZWRbaWRdKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gdmlzaXRlZFtpZF07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGNsb25lID0ge307XG5cdFx0XHRcdFx0dmlzaXRlZFtpZF0gPSBjbG9uZTtcblxuXHRcdFx0XHRcdGZvciAodmFyIGtleSBpbiBvKSB7XG5cdFx0XHRcdFx0XHRpZiAoby5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG5cdFx0XHRcdFx0XHRcdGNsb25lW2tleV0gPSBkZWVwQ2xvbmUob1trZXldLCB2aXNpdGVkKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRyZXR1cm4gY2xvbmU7XG5cblx0XHRcdFx0Y2FzZSAnQXJyYXknOlxuXHRcdFx0XHRcdGlkID0gXy51dGlsLm9iaklkKG8pO1xuXHRcdFx0XHRcdGlmICh2aXNpdGVkW2lkXSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHZpc2l0ZWRbaWRdO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRjbG9uZSA9IFtdO1xuXHRcdFx0XHRcdHZpc2l0ZWRbaWRdID0gY2xvbmU7XG5cblx0XHRcdFx0XHRvLmZvckVhY2goZnVuY3Rpb24gKHYsIGkpIHtcblx0XHRcdFx0XHRcdGNsb25lW2ldID0gZGVlcENsb25lKHYsIHZpc2l0ZWQpO1xuXHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0cmV0dXJuIGNsb25lO1xuXG5cdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0cmV0dXJuIG87XG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXG5cdGxhbmd1YWdlczoge1xuXHRcdGV4dGVuZDogZnVuY3Rpb24gKGlkLCByZWRlZikge1xuXHRcdFx0dmFyIGxhbmcgPSBfLnV0aWwuY2xvbmUoXy5sYW5ndWFnZXNbaWRdKTtcblxuXHRcdFx0Zm9yICh2YXIga2V5IGluIHJlZGVmKSB7XG5cdFx0XHRcdGxhbmdba2V5XSA9IHJlZGVmW2tleV07XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBsYW5nO1xuXHRcdH0sXG5cblx0XHQvKipcblx0XHQgKiBJbnNlcnQgYSB0b2tlbiBiZWZvcmUgYW5vdGhlciB0b2tlbiBpbiBhIGxhbmd1YWdlIGxpdGVyYWxcblx0XHQgKiBBcyB0aGlzIG5lZWRzIHRvIHJlY3JlYXRlIHRoZSBvYmplY3QgKHdlIGNhbm5vdCBhY3R1YWxseSBpbnNlcnQgYmVmb3JlIGtleXMgaW4gb2JqZWN0IGxpdGVyYWxzKSxcblx0XHQgKiB3ZSBjYW5ub3QganVzdCBwcm92aWRlIGFuIG9iamVjdCwgd2UgbmVlZCBhbiBvYmplY3QgYW5kIGEga2V5LlxuXHRcdCAqIEBwYXJhbSBpbnNpZGUgVGhlIGtleSAob3IgbGFuZ3VhZ2UgaWQpIG9mIHRoZSBwYXJlbnRcblx0XHQgKiBAcGFyYW0gYmVmb3JlIFRoZSBrZXkgdG8gaW5zZXJ0IGJlZm9yZS5cblx0XHQgKiBAcGFyYW0gaW5zZXJ0IE9iamVjdCB3aXRoIHRoZSBrZXkvdmFsdWUgcGFpcnMgdG8gaW5zZXJ0XG5cdFx0ICogQHBhcmFtIHJvb3QgVGhlIG9iamVjdCB0aGF0IGNvbnRhaW5zIGBpbnNpZGVgLiBJZiBlcXVhbCB0byBQcmlzbS5sYW5ndWFnZXMsIGl0IGNhbiBiZSBvbWl0dGVkLlxuXHRcdCAqL1xuXHRcdGluc2VydEJlZm9yZTogZnVuY3Rpb24gKGluc2lkZSwgYmVmb3JlLCBpbnNlcnQsIHJvb3QpIHtcblx0XHRcdHJvb3QgPSByb290IHx8IF8ubGFuZ3VhZ2VzO1xuXHRcdFx0dmFyIGdyYW1tYXIgPSByb290W2luc2lkZV07XG5cdFx0XHR2YXIgcmV0ID0ge307XG5cblx0XHRcdGZvciAodmFyIHRva2VuIGluIGdyYW1tYXIpIHtcblx0XHRcdFx0aWYgKGdyYW1tYXIuaGFzT3duUHJvcGVydHkodG9rZW4pKSB7XG5cblx0XHRcdFx0XHRpZiAodG9rZW4gPT0gYmVmb3JlKSB7XG5cdFx0XHRcdFx0XHRmb3IgKHZhciBuZXdUb2tlbiBpbiBpbnNlcnQpIHtcblx0XHRcdFx0XHRcdFx0aWYgKGluc2VydC5oYXNPd25Qcm9wZXJ0eShuZXdUb2tlbikpIHtcblx0XHRcdFx0XHRcdFx0XHRyZXRbbmV3VG9rZW5dID0gaW5zZXJ0W25ld1Rva2VuXTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIERvIG5vdCBpbnNlcnQgdG9rZW4gd2hpY2ggYWxzbyBvY2N1ciBpbiBpbnNlcnQuIFNlZSAjMTUyNVxuXHRcdFx0XHRcdGlmICghaW5zZXJ0Lmhhc093blByb3BlcnR5KHRva2VuKSkge1xuXHRcdFx0XHRcdFx0cmV0W3Rva2VuXSA9IGdyYW1tYXJbdG9rZW5dO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHR2YXIgb2xkID0gcm9vdFtpbnNpZGVdO1xuXHRcdFx0cm9vdFtpbnNpZGVdID0gcmV0O1xuXG5cdFx0XHQvLyBVcGRhdGUgcmVmZXJlbmNlcyBpbiBvdGhlciBsYW5ndWFnZSBkZWZpbml0aW9uc1xuXHRcdFx0Xy5sYW5ndWFnZXMuREZTKF8ubGFuZ3VhZ2VzLCBmdW5jdGlvbihrZXksIHZhbHVlKSB7XG5cdFx0XHRcdGlmICh2YWx1ZSA9PT0gb2xkICYmIGtleSAhPSBpbnNpZGUpIHtcblx0XHRcdFx0XHR0aGlzW2tleV0gPSByZXQ7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHRyZXR1cm4gcmV0O1xuXHRcdH0sXG5cblx0XHQvLyBUcmF2ZXJzZSBhIGxhbmd1YWdlIGRlZmluaXRpb24gd2l0aCBEZXB0aCBGaXJzdCBTZWFyY2hcblx0XHRERlM6IGZ1bmN0aW9uIERGUyhvLCBjYWxsYmFjaywgdHlwZSwgdmlzaXRlZCkge1xuXHRcdFx0dmlzaXRlZCA9IHZpc2l0ZWQgfHwge307XG5cblx0XHRcdHZhciBvYmpJZCA9IF8udXRpbC5vYmpJZDtcblxuXHRcdFx0Zm9yICh2YXIgaSBpbiBvKSB7XG5cdFx0XHRcdGlmIChvLmhhc093blByb3BlcnR5KGkpKSB7XG5cdFx0XHRcdFx0Y2FsbGJhY2suY2FsbChvLCBpLCBvW2ldLCB0eXBlIHx8IGkpO1xuXG5cdFx0XHRcdFx0dmFyIHByb3BlcnR5ID0gb1tpXSxcblx0XHRcdFx0XHQgICAgcHJvcGVydHlUeXBlID0gXy51dGlsLnR5cGUocHJvcGVydHkpO1xuXG5cdFx0XHRcdFx0aWYgKHByb3BlcnR5VHlwZSA9PT0gJ09iamVjdCcgJiYgIXZpc2l0ZWRbb2JqSWQocHJvcGVydHkpXSkge1xuXHRcdFx0XHRcdFx0dmlzaXRlZFtvYmpJZChwcm9wZXJ0eSldID0gdHJ1ZTtcblx0XHRcdFx0XHRcdERGUyhwcm9wZXJ0eSwgY2FsbGJhY2ssIG51bGwsIHZpc2l0ZWQpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNlIGlmIChwcm9wZXJ0eVR5cGUgPT09ICdBcnJheScgJiYgIXZpc2l0ZWRbb2JqSWQocHJvcGVydHkpXSkge1xuXHRcdFx0XHRcdFx0dmlzaXRlZFtvYmpJZChwcm9wZXJ0eSldID0gdHJ1ZTtcblx0XHRcdFx0XHRcdERGUyhwcm9wZXJ0eSwgY2FsbGJhY2ssIGksIHZpc2l0ZWQpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fSxcblx0cGx1Z2luczoge30sXG5cblx0aGlnaGxpZ2h0QWxsOiBmdW5jdGlvbihhc3luYywgY2FsbGJhY2spIHtcblx0XHRfLmhpZ2hsaWdodEFsbFVuZGVyKGRvY3VtZW50LCBhc3luYywgY2FsbGJhY2spO1xuXHR9LFxuXG5cdGhpZ2hsaWdodEFsbFVuZGVyOiBmdW5jdGlvbihjb250YWluZXIsIGFzeW5jLCBjYWxsYmFjaykge1xuXHRcdHZhciBlbnYgPSB7XG5cdFx0XHRjYWxsYmFjazogY2FsbGJhY2ssXG5cdFx0XHRzZWxlY3RvcjogJ2NvZGVbY2xhc3MqPVwibGFuZ3VhZ2UtXCJdLCBbY2xhc3MqPVwibGFuZ3VhZ2UtXCJdIGNvZGUsIGNvZGVbY2xhc3MqPVwibGFuZy1cIl0sIFtjbGFzcyo9XCJsYW5nLVwiXSBjb2RlJ1xuXHRcdH07XG5cblx0XHRfLmhvb2tzLnJ1bignYmVmb3JlLWhpZ2hsaWdodGFsbCcsIGVudik7XG5cblx0XHR2YXIgZWxlbWVudHMgPSBjb250YWluZXIucXVlcnlTZWxlY3RvckFsbChlbnYuc2VsZWN0b3IpO1xuXG5cdFx0Zm9yICh2YXIgaT0wLCBlbGVtZW50OyBlbGVtZW50ID0gZWxlbWVudHNbaSsrXTspIHtcblx0XHRcdF8uaGlnaGxpZ2h0RWxlbWVudChlbGVtZW50LCBhc3luYyA9PT0gdHJ1ZSwgZW52LmNhbGxiYWNrKTtcblx0XHR9XG5cdH0sXG5cblx0aGlnaGxpZ2h0RWxlbWVudDogZnVuY3Rpb24oZWxlbWVudCwgYXN5bmMsIGNhbGxiYWNrKSB7XG5cdFx0Ly8gRmluZCBsYW5ndWFnZVxuXHRcdHZhciBsYW5ndWFnZSA9ICdub25lJywgZ3JhbW1hciwgcGFyZW50ID0gZWxlbWVudDtcblxuXHRcdHdoaWxlIChwYXJlbnQgJiYgIWxhbmcudGVzdChwYXJlbnQuY2xhc3NOYW1lKSkge1xuXHRcdFx0cGFyZW50ID0gcGFyZW50LnBhcmVudE5vZGU7XG5cdFx0fVxuXG5cdFx0aWYgKHBhcmVudCkge1xuXHRcdFx0bGFuZ3VhZ2UgPSAocGFyZW50LmNsYXNzTmFtZS5tYXRjaChsYW5nKSB8fCBbLCdub25lJ10pWzFdLnRvTG93ZXJDYXNlKCk7XG5cdFx0XHRncmFtbWFyID0gXy5sYW5ndWFnZXNbbGFuZ3VhZ2VdO1xuXHRcdH1cblxuXHRcdC8vIFNldCBsYW5ndWFnZSBvbiB0aGUgZWxlbWVudCwgaWYgbm90IHByZXNlbnRcblx0XHRlbGVtZW50LmNsYXNzTmFtZSA9IGVsZW1lbnQuY2xhc3NOYW1lLnJlcGxhY2UobGFuZywgJycpLnJlcGxhY2UoL1xccysvZywgJyAnKSArICcgbGFuZ3VhZ2UtJyArIGxhbmd1YWdlO1xuXG5cdFx0aWYgKGVsZW1lbnQucGFyZW50Tm9kZSkge1xuXHRcdFx0Ly8gU2V0IGxhbmd1YWdlIG9uIHRoZSBwYXJlbnQsIGZvciBzdHlsaW5nXG5cdFx0XHRwYXJlbnQgPSBlbGVtZW50LnBhcmVudE5vZGU7XG5cblx0XHRcdGlmICgvcHJlL2kudGVzdChwYXJlbnQubm9kZU5hbWUpKSB7XG5cdFx0XHRcdHBhcmVudC5jbGFzc05hbWUgPSBwYXJlbnQuY2xhc3NOYW1lLnJlcGxhY2UobGFuZywgJycpLnJlcGxhY2UoL1xccysvZywgJyAnKSArICcgbGFuZ3VhZ2UtJyArIGxhbmd1YWdlO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHZhciBjb2RlID0gZWxlbWVudC50ZXh0Q29udGVudDtcblxuXHRcdHZhciBlbnYgPSB7XG5cdFx0XHRlbGVtZW50OiBlbGVtZW50LFxuXHRcdFx0bGFuZ3VhZ2U6IGxhbmd1YWdlLFxuXHRcdFx0Z3JhbW1hcjogZ3JhbW1hcixcblx0XHRcdGNvZGU6IGNvZGVcblx0XHR9O1xuXG5cdFx0dmFyIGluc2VydEhpZ2hsaWdodGVkQ29kZSA9IGZ1bmN0aW9uIChoaWdobGlnaHRlZENvZGUpIHtcblx0XHRcdGVudi5oaWdobGlnaHRlZENvZGUgPSBoaWdobGlnaHRlZENvZGU7XG5cblx0XHRcdF8uaG9va3MucnVuKCdiZWZvcmUtaW5zZXJ0JywgZW52KTtcblxuXHRcdFx0ZW52LmVsZW1lbnQuaW5uZXJIVE1MID0gZW52LmhpZ2hsaWdodGVkQ29kZTtcblxuXHRcdFx0Xy5ob29rcy5ydW4oJ2FmdGVyLWhpZ2hsaWdodCcsIGVudik7XG5cdFx0XHRfLmhvb2tzLnJ1bignY29tcGxldGUnLCBlbnYpO1xuXHRcdFx0Y2FsbGJhY2sgJiYgY2FsbGJhY2suY2FsbChlbnYuZWxlbWVudCk7XG5cdFx0fVxuXG5cdFx0Xy5ob29rcy5ydW4oJ2JlZm9yZS1zYW5pdHktY2hlY2snLCBlbnYpO1xuXG5cdFx0aWYgKCFlbnYuY29kZSkge1xuXHRcdFx0Xy5ob29rcy5ydW4oJ2NvbXBsZXRlJywgZW52KTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRfLmhvb2tzLnJ1bignYmVmb3JlLWhpZ2hsaWdodCcsIGVudik7XG5cblx0XHRpZiAoIWVudi5ncmFtbWFyKSB7XG5cdFx0XHRpbnNlcnRIaWdobGlnaHRlZENvZGUoXy51dGlsLmVuY29kZShlbnYuY29kZSkpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGlmIChhc3luYyAmJiBfc2VsZi5Xb3JrZXIpIHtcblx0XHRcdHZhciB3b3JrZXIgPSBuZXcgV29ya2VyKF8uZmlsZW5hbWUpO1xuXG5cdFx0XHR3b3JrZXIub25tZXNzYWdlID0gZnVuY3Rpb24oZXZ0KSB7XG5cdFx0XHRcdGluc2VydEhpZ2hsaWdodGVkQ29kZShldnQuZGF0YSk7XG5cdFx0XHR9O1xuXG5cdFx0XHR3b3JrZXIucG9zdE1lc3NhZ2UoSlNPTi5zdHJpbmdpZnkoe1xuXHRcdFx0XHRsYW5ndWFnZTogZW52Lmxhbmd1YWdlLFxuXHRcdFx0XHRjb2RlOiBlbnYuY29kZSxcblx0XHRcdFx0aW1tZWRpYXRlQ2xvc2U6IHRydWVcblx0XHRcdH0pKTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHRpbnNlcnRIaWdobGlnaHRlZENvZGUoXy5oaWdobGlnaHQoZW52LmNvZGUsIGVudi5ncmFtbWFyLCBlbnYubGFuZ3VhZ2UpKTtcblx0XHR9XG5cdH0sXG5cblx0aGlnaGxpZ2h0OiBmdW5jdGlvbiAodGV4dCwgZ3JhbW1hciwgbGFuZ3VhZ2UpIHtcblx0XHR2YXIgZW52ID0ge1xuXHRcdFx0Y29kZTogdGV4dCxcblx0XHRcdGdyYW1tYXI6IGdyYW1tYXIsXG5cdFx0XHRsYW5ndWFnZTogbGFuZ3VhZ2Vcblx0XHR9O1xuXHRcdF8uaG9va3MucnVuKCdiZWZvcmUtdG9rZW5pemUnLCBlbnYpO1xuXHRcdGVudi50b2tlbnMgPSBfLnRva2VuaXplKGVudi5jb2RlLCBlbnYuZ3JhbW1hcik7XG5cdFx0Xy5ob29rcy5ydW4oJ2FmdGVyLXRva2VuaXplJywgZW52KTtcblx0XHRyZXR1cm4gVG9rZW4uc3RyaW5naWZ5KF8udXRpbC5lbmNvZGUoZW52LnRva2VucyksIGVudi5sYW5ndWFnZSk7XG5cdH0sXG5cblx0bWF0Y2hHcmFtbWFyOiBmdW5jdGlvbiAodGV4dCwgc3RyYXJyLCBncmFtbWFyLCBpbmRleCwgc3RhcnRQb3MsIG9uZXNob3QsIHRhcmdldCkge1xuXHRcdGZvciAodmFyIHRva2VuIGluIGdyYW1tYXIpIHtcblx0XHRcdGlmKCFncmFtbWFyLmhhc093blByb3BlcnR5KHRva2VuKSB8fCAhZ3JhbW1hclt0b2tlbl0pIHtcblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHR9XG5cblx0XHRcdGlmICh0b2tlbiA9PSB0YXJnZXQpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHR2YXIgcGF0dGVybnMgPSBncmFtbWFyW3Rva2VuXTtcblx0XHRcdHBhdHRlcm5zID0gKF8udXRpbC50eXBlKHBhdHRlcm5zKSA9PT0gXCJBcnJheVwiKSA/IHBhdHRlcm5zIDogW3BhdHRlcm5zXTtcblxuXHRcdFx0Zm9yICh2YXIgaiA9IDA7IGogPCBwYXR0ZXJucy5sZW5ndGg7ICsraikge1xuXHRcdFx0XHR2YXIgcGF0dGVybiA9IHBhdHRlcm5zW2pdLFxuXHRcdFx0XHRcdGluc2lkZSA9IHBhdHRlcm4uaW5zaWRlLFxuXHRcdFx0XHRcdGxvb2tiZWhpbmQgPSAhIXBhdHRlcm4ubG9va2JlaGluZCxcblx0XHRcdFx0XHRncmVlZHkgPSAhIXBhdHRlcm4uZ3JlZWR5LFxuXHRcdFx0XHRcdGxvb2tiZWhpbmRMZW5ndGggPSAwLFxuXHRcdFx0XHRcdGFsaWFzID0gcGF0dGVybi5hbGlhcztcblxuXHRcdFx0XHRpZiAoZ3JlZWR5ICYmICFwYXR0ZXJuLnBhdHRlcm4uZ2xvYmFsKSB7XG5cdFx0XHRcdFx0Ly8gV2l0aG91dCB0aGUgZ2xvYmFsIGZsYWcsIGxhc3RJbmRleCB3b24ndCB3b3JrXG5cdFx0XHRcdFx0dmFyIGZsYWdzID0gcGF0dGVybi5wYXR0ZXJuLnRvU3RyaW5nKCkubWF0Y2goL1tpbXV5XSokLylbMF07XG5cdFx0XHRcdFx0cGF0dGVybi5wYXR0ZXJuID0gUmVnRXhwKHBhdHRlcm4ucGF0dGVybi5zb3VyY2UsIGZsYWdzICsgXCJnXCIpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cGF0dGVybiA9IHBhdHRlcm4ucGF0dGVybiB8fCBwYXR0ZXJuO1xuXG5cdFx0XHRcdC8vIERvbuKAmXQgY2FjaGUgbGVuZ3RoIGFzIGl0IGNoYW5nZXMgZHVyaW5nIHRoZSBsb29wXG5cdFx0XHRcdGZvciAodmFyIGkgPSBpbmRleCwgcG9zID0gc3RhcnRQb3M7IGkgPCBzdHJhcnIubGVuZ3RoOyBwb3MgKz0gc3RyYXJyW2ldLmxlbmd0aCwgKytpKSB7XG5cblx0XHRcdFx0XHR2YXIgc3RyID0gc3RyYXJyW2ldO1xuXG5cdFx0XHRcdFx0aWYgKHN0cmFyci5sZW5ndGggPiB0ZXh0Lmxlbmd0aCkge1xuXHRcdFx0XHRcdFx0Ly8gU29tZXRoaW5nIHdlbnQgdGVycmlibHkgd3JvbmcsIEFCT1JULCBBQk9SVCFcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAoc3RyIGluc3RhbmNlb2YgVG9rZW4pIHtcblx0XHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmIChncmVlZHkgJiYgaSAhPSBzdHJhcnIubGVuZ3RoIC0gMSkge1xuXHRcdFx0XHRcdFx0cGF0dGVybi5sYXN0SW5kZXggPSBwb3M7XG5cdFx0XHRcdFx0XHR2YXIgbWF0Y2ggPSBwYXR0ZXJuLmV4ZWModGV4dCk7XG5cdFx0XHRcdFx0XHRpZiAoIW1hdGNoKSB7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHR2YXIgZnJvbSA9IG1hdGNoLmluZGV4ICsgKGxvb2tiZWhpbmQgPyBtYXRjaFsxXS5sZW5ndGggOiAwKSxcblx0XHRcdFx0XHRcdCAgICB0byA9IG1hdGNoLmluZGV4ICsgbWF0Y2hbMF0ubGVuZ3RoLFxuXHRcdFx0XHRcdFx0ICAgIGsgPSBpLFxuXHRcdFx0XHRcdFx0ICAgIHAgPSBwb3M7XG5cblx0XHRcdFx0XHRcdGZvciAodmFyIGxlbiA9IHN0cmFyci5sZW5ndGg7IGsgPCBsZW4gJiYgKHAgPCB0byB8fCAoIXN0cmFycltrXS50eXBlICYmICFzdHJhcnJbayAtIDFdLmdyZWVkeSkpOyArK2spIHtcblx0XHRcdFx0XHRcdFx0cCArPSBzdHJhcnJba10ubGVuZ3RoO1xuXHRcdFx0XHRcdFx0XHQvLyBNb3ZlIHRoZSBpbmRleCBpIHRvIHRoZSBlbGVtZW50IGluIHN0cmFyciB0aGF0IGlzIGNsb3Nlc3QgdG8gZnJvbVxuXHRcdFx0XHRcdFx0XHRpZiAoZnJvbSA+PSBwKSB7XG5cdFx0XHRcdFx0XHRcdFx0KytpO1xuXHRcdFx0XHRcdFx0XHRcdHBvcyA9IHA7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0Ly8gSWYgc3RyYXJyW2ldIGlzIGEgVG9rZW4sIHRoZW4gdGhlIG1hdGNoIHN0YXJ0cyBpbnNpZGUgYW5vdGhlciBUb2tlbiwgd2hpY2ggaXMgaW52YWxpZFxuXHRcdFx0XHRcdFx0aWYgKHN0cmFycltpXSBpbnN0YW5jZW9mIFRva2VuKSB7XG5cdFx0XHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHQvLyBOdW1iZXIgb2YgdG9rZW5zIHRvIGRlbGV0ZSBhbmQgcmVwbGFjZSB3aXRoIHRoZSBuZXcgbWF0Y2hcblx0XHRcdFx0XHRcdGRlbE51bSA9IGsgLSBpO1xuXHRcdFx0XHRcdFx0c3RyID0gdGV4dC5zbGljZShwb3MsIHApO1xuXHRcdFx0XHRcdFx0bWF0Y2guaW5kZXggLT0gcG9zO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRwYXR0ZXJuLmxhc3RJbmRleCA9IDA7XG5cblx0XHRcdFx0XHRcdHZhciBtYXRjaCA9IHBhdHRlcm4uZXhlYyhzdHIpLFxuXHRcdFx0XHRcdFx0XHRkZWxOdW0gPSAxO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmICghbWF0Y2gpIHtcblx0XHRcdFx0XHRcdGlmIChvbmVzaG90KSB7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZihsb29rYmVoaW5kKSB7XG5cdFx0XHRcdFx0XHRsb29rYmVoaW5kTGVuZ3RoID0gbWF0Y2hbMV0gPyBtYXRjaFsxXS5sZW5ndGggOiAwO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHZhciBmcm9tID0gbWF0Y2guaW5kZXggKyBsb29rYmVoaW5kTGVuZ3RoLFxuXHRcdFx0XHRcdCAgICBtYXRjaCA9IG1hdGNoWzBdLnNsaWNlKGxvb2tiZWhpbmRMZW5ndGgpLFxuXHRcdFx0XHRcdCAgICB0byA9IGZyb20gKyBtYXRjaC5sZW5ndGgsXG5cdFx0XHRcdFx0ICAgIGJlZm9yZSA9IHN0ci5zbGljZSgwLCBmcm9tKSxcblx0XHRcdFx0XHQgICAgYWZ0ZXIgPSBzdHIuc2xpY2UodG8pO1xuXG5cdFx0XHRcdFx0dmFyIGFyZ3MgPSBbaSwgZGVsTnVtXTtcblxuXHRcdFx0XHRcdGlmIChiZWZvcmUpIHtcblx0XHRcdFx0XHRcdCsraTtcblx0XHRcdFx0XHRcdHBvcyArPSBiZWZvcmUubGVuZ3RoO1xuXHRcdFx0XHRcdFx0YXJncy5wdXNoKGJlZm9yZSk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0dmFyIHdyYXBwZWQgPSBuZXcgVG9rZW4odG9rZW4sIGluc2lkZT8gXy50b2tlbml6ZShtYXRjaCwgaW5zaWRlKSA6IG1hdGNoLCBhbGlhcywgbWF0Y2gsIGdyZWVkeSk7XG5cblx0XHRcdFx0XHRhcmdzLnB1c2god3JhcHBlZCk7XG5cblx0XHRcdFx0XHRpZiAoYWZ0ZXIpIHtcblx0XHRcdFx0XHRcdGFyZ3MucHVzaChhZnRlcik7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0QXJyYXkucHJvdG90eXBlLnNwbGljZS5hcHBseShzdHJhcnIsIGFyZ3MpO1xuXG5cdFx0XHRcdFx0aWYgKGRlbE51bSAhPSAxKVxuXHRcdFx0XHRcdFx0Xy5tYXRjaEdyYW1tYXIodGV4dCwgc3RyYXJyLCBncmFtbWFyLCBpLCBwb3MsIHRydWUsIHRva2VuKTtcblxuXHRcdFx0XHRcdGlmIChvbmVzaG90KVxuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cblx0dG9rZW5pemU6IGZ1bmN0aW9uKHRleHQsIGdyYW1tYXIpIHtcblx0XHR2YXIgc3RyYXJyID0gW3RleHRdO1xuXG5cdFx0dmFyIHJlc3QgPSBncmFtbWFyLnJlc3Q7XG5cblx0XHRpZiAocmVzdCkge1xuXHRcdFx0Zm9yICh2YXIgdG9rZW4gaW4gcmVzdCkge1xuXHRcdFx0XHRncmFtbWFyW3Rva2VuXSA9IHJlc3RbdG9rZW5dO1xuXHRcdFx0fVxuXG5cdFx0XHRkZWxldGUgZ3JhbW1hci5yZXN0O1xuXHRcdH1cblxuXHRcdF8ubWF0Y2hHcmFtbWFyKHRleHQsIHN0cmFyciwgZ3JhbW1hciwgMCwgMCwgZmFsc2UpO1xuXG5cdFx0cmV0dXJuIHN0cmFycjtcblx0fSxcblxuXHRob29rczoge1xuXHRcdGFsbDoge30sXG5cblx0XHRhZGQ6IGZ1bmN0aW9uIChuYW1lLCBjYWxsYmFjaykge1xuXHRcdFx0dmFyIGhvb2tzID0gXy5ob29rcy5hbGw7XG5cblx0XHRcdGhvb2tzW25hbWVdID0gaG9va3NbbmFtZV0gfHwgW107XG5cblx0XHRcdGhvb2tzW25hbWVdLnB1c2goY2FsbGJhY2spO1xuXHRcdH0sXG5cblx0XHRydW46IGZ1bmN0aW9uIChuYW1lLCBlbnYpIHtcblx0XHRcdHZhciBjYWxsYmFja3MgPSBfLmhvb2tzLmFsbFtuYW1lXTtcblxuXHRcdFx0aWYgKCFjYWxsYmFja3MgfHwgIWNhbGxiYWNrcy5sZW5ndGgpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRmb3IgKHZhciBpPTAsIGNhbGxiYWNrOyBjYWxsYmFjayA9IGNhbGxiYWNrc1tpKytdOykge1xuXHRcdFx0XHRjYWxsYmFjayhlbnYpO1xuXHRcdFx0fVxuXHRcdH1cblx0fSxcblxuXHRUb2tlbjogVG9rZW5cbn07XG5cbl9zZWxmLlByaXNtID0gXztcblxuZnVuY3Rpb24gVG9rZW4odHlwZSwgY29udGVudCwgYWxpYXMsIG1hdGNoZWRTdHIsIGdyZWVkeSkge1xuXHR0aGlzLnR5cGUgPSB0eXBlO1xuXHR0aGlzLmNvbnRlbnQgPSBjb250ZW50O1xuXHR0aGlzLmFsaWFzID0gYWxpYXM7XG5cdC8vIENvcHkgb2YgdGhlIGZ1bGwgc3RyaW5nIHRoaXMgdG9rZW4gd2FzIGNyZWF0ZWQgZnJvbVxuXHR0aGlzLmxlbmd0aCA9IChtYXRjaGVkU3RyIHx8IFwiXCIpLmxlbmd0aHwwO1xuXHR0aGlzLmdyZWVkeSA9ICEhZ3JlZWR5O1xufVxuXG5Ub2tlbi5zdHJpbmdpZnkgPSBmdW5jdGlvbihvLCBsYW5ndWFnZSkge1xuXHRpZiAodHlwZW9mIG8gPT0gJ3N0cmluZycpIHtcblx0XHRyZXR1cm4gbztcblx0fVxuXG5cdGlmIChBcnJheS5pc0FycmF5KG8pKSB7XG5cdFx0cmV0dXJuIG8ubWFwKGZ1bmN0aW9uKGVsZW1lbnQpIHtcblx0XHRcdHJldHVybiBUb2tlbi5zdHJpbmdpZnkoZWxlbWVudCwgbGFuZ3VhZ2UpO1xuXHRcdH0pLmpvaW4oJycpO1xuXHR9XG5cblx0dmFyIGVudiA9IHtcblx0XHR0eXBlOiBvLnR5cGUsXG5cdFx0Y29udGVudDogVG9rZW4uc3RyaW5naWZ5KG8uY29udGVudCwgbGFuZ3VhZ2UpLFxuXHRcdHRhZzogJ3NwYW4nLFxuXHRcdGNsYXNzZXM6IFsndG9rZW4nLCBvLnR5cGVdLFxuXHRcdGF0dHJpYnV0ZXM6IHt9LFxuXHRcdGxhbmd1YWdlOiBsYW5ndWFnZVxuXHR9O1xuXG5cdGlmIChvLmFsaWFzKSB7XG5cdFx0dmFyIGFsaWFzZXMgPSBBcnJheS5pc0FycmF5KG8uYWxpYXMpID8gby5hbGlhcyA6IFtvLmFsaWFzXTtcblx0XHRBcnJheS5wcm90b3R5cGUucHVzaC5hcHBseShlbnYuY2xhc3NlcywgYWxpYXNlcyk7XG5cdH1cblxuXHRfLmhvb2tzLnJ1bignd3JhcCcsIGVudik7XG5cblx0dmFyIGF0dHJpYnV0ZXMgPSBPYmplY3Qua2V5cyhlbnYuYXR0cmlidXRlcykubWFwKGZ1bmN0aW9uKG5hbWUpIHtcblx0XHRyZXR1cm4gbmFtZSArICc9XCInICsgKGVudi5hdHRyaWJ1dGVzW25hbWVdIHx8ICcnKS5yZXBsYWNlKC9cIi9nLCAnJnF1b3Q7JykgKyAnXCInO1xuXHR9KS5qb2luKCcgJyk7XG5cblx0cmV0dXJuICc8JyArIGVudi50YWcgKyAnIGNsYXNzPVwiJyArIGVudi5jbGFzc2VzLmpvaW4oJyAnKSArICdcIicgKyAoYXR0cmlidXRlcyA/ICcgJyArIGF0dHJpYnV0ZXMgOiAnJykgKyAnPicgKyBlbnYuY29udGVudCArICc8LycgKyBlbnYudGFnICsgJz4nO1xufTtcblxuaWYgKCFfc2VsZi5kb2N1bWVudCkge1xuXHRpZiAoIV9zZWxmLmFkZEV2ZW50TGlzdGVuZXIpIHtcblx0XHQvLyBpbiBOb2RlLmpzXG5cdFx0cmV0dXJuIF87XG5cdH1cblxuXHRpZiAoIV8uZGlzYWJsZVdvcmtlck1lc3NhZ2VIYW5kbGVyKSB7XG5cdFx0Ly8gSW4gd29ya2VyXG5cdFx0X3NlbGYuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGZ1bmN0aW9uIChldnQpIHtcblx0XHRcdHZhciBtZXNzYWdlID0gSlNPTi5wYXJzZShldnQuZGF0YSksXG5cdFx0XHRcdGxhbmcgPSBtZXNzYWdlLmxhbmd1YWdlLFxuXHRcdFx0XHRjb2RlID0gbWVzc2FnZS5jb2RlLFxuXHRcdFx0XHRpbW1lZGlhdGVDbG9zZSA9IG1lc3NhZ2UuaW1tZWRpYXRlQ2xvc2U7XG5cblx0XHRcdF9zZWxmLnBvc3RNZXNzYWdlKF8uaGlnaGxpZ2h0KGNvZGUsIF8ubGFuZ3VhZ2VzW2xhbmddLCBsYW5nKSk7XG5cdFx0XHRpZiAoaW1tZWRpYXRlQ2xvc2UpIHtcblx0XHRcdFx0X3NlbGYuY2xvc2UoKTtcblx0XHRcdH1cblx0XHR9LCBmYWxzZSk7XG5cdH1cblxuXHRyZXR1cm4gXztcbn1cblxuLy9HZXQgY3VycmVudCBzY3JpcHQgYW5kIGhpZ2hsaWdodFxudmFyIHNjcmlwdCA9IGRvY3VtZW50LmN1cnJlbnRTY3JpcHQgfHwgW10uc2xpY2UuY2FsbChkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcInNjcmlwdFwiKSkucG9wKCk7XG5cbmlmIChzY3JpcHQpIHtcblx0Xy5maWxlbmFtZSA9IHNjcmlwdC5zcmM7XG5cblx0aWYgKCFfLm1hbnVhbCAmJiAhc2NyaXB0Lmhhc0F0dHJpYnV0ZSgnZGF0YS1tYW51YWwnKSkge1xuXHRcdGlmKGRvY3VtZW50LnJlYWR5U3RhdGUgIT09IFwibG9hZGluZ1wiKSB7XG5cdFx0XHRpZiAod2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSkge1xuXHRcdFx0XHR3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKF8uaGlnaGxpZ2h0QWxsKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHdpbmRvdy5zZXRUaW1lb3V0KF8uaGlnaGxpZ2h0QWxsLCAxNik7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIF8uaGlnaGxpZ2h0QWxsKTtcblx0XHR9XG5cdH1cbn1cblxucmV0dXJuIF87XG5cbn0pKF9zZWxmKTtcblxuaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7XG5cdG1vZHVsZS5leHBvcnRzID0gUHJpc207XG59XG5cbi8vIGhhY2sgZm9yIGNvbXBvbmVudHMgdG8gd29yayBjb3JyZWN0bHkgaW4gbm9kZS5qc1xuaWYgKHR5cGVvZiBnbG9iYWwgIT09ICd1bmRlZmluZWQnKSB7XG5cdGdsb2JhbC5QcmlzbSA9IFByaXNtO1xufVxuXG5cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgQmVnaW4gcHJpc20tbWFya3VwLmpzXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5cblByaXNtLmxhbmd1YWdlcy5tYXJrdXAgPSB7XG5cdCdjb21tZW50JzogLzwhLS1bXFxzXFxTXSo/LS0+Lyxcblx0J3Byb2xvZyc6IC88XFw/W1xcc1xcU10rP1xcPz4vLFxuXHQnZG9jdHlwZSc6IC88IURPQ1RZUEVbXFxzXFxTXSs/Pi9pLFxuXHQnY2RhdGEnOiAvPCFcXFtDREFUQVxcW1tcXHNcXFNdKj9dXT4vaSxcblx0J3RhZyc6IHtcblx0XHRwYXR0ZXJuOiAvPFxcLz8oPyFcXGQpW15cXHM+XFwvPSQ8JV0rKD86XFxzKD86XFxzKlteXFxzPlxcLz1dKyg/Olxccyo9XFxzKig/OlwiW15cIl0qXCJ8J1teJ10qJ3xbXlxccydcIj49XSsoPz1bXFxzPl0pKXwoPz1bXFxzLz5dKSkpKyk/XFxzKlxcLz8+L2ksXG5cdFx0Z3JlZWR5OiB0cnVlLFxuXHRcdGluc2lkZToge1xuXHRcdFx0J3RhZyc6IHtcblx0XHRcdFx0cGF0dGVybjogL148XFwvP1teXFxzPlxcL10rL2ksXG5cdFx0XHRcdGluc2lkZToge1xuXHRcdFx0XHRcdCdwdW5jdHVhdGlvbic6IC9ePFxcLz8vLFxuXHRcdFx0XHRcdCduYW1lc3BhY2UnOiAvXlteXFxzPlxcLzpdKzovXG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHQnYXR0ci12YWx1ZSc6IHtcblx0XHRcdFx0cGF0dGVybjogLz1cXHMqKD86XCJbXlwiXSpcInwnW14nXSonfFteXFxzJ1wiPj1dKykvaSxcblx0XHRcdFx0aW5zaWRlOiB7XG5cdFx0XHRcdFx0J3B1bmN0dWF0aW9uJzogW1xuXHRcdFx0XHRcdFx0L149Lyxcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0cGF0dGVybjogL14oXFxzKilbXCInXXxbXCInXSQvLFxuXHRcdFx0XHRcdFx0XHRsb29rYmVoaW5kOiB0cnVlXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XVxuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0J3B1bmN0dWF0aW9uJzogL1xcLz8+Lyxcblx0XHRcdCdhdHRyLW5hbWUnOiB7XG5cdFx0XHRcdHBhdHRlcm46IC9bXlxccz5cXC9dKy8sXG5cdFx0XHRcdGluc2lkZToge1xuXHRcdFx0XHRcdCduYW1lc3BhY2UnOiAvXlteXFxzPlxcLzpdKzovXG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdH1cblx0fSxcblx0J2VudGl0eSc6IC8mIz9bXFxkYS16XXsxLDh9Oy9pXG59O1xuXG5QcmlzbS5sYW5ndWFnZXMubWFya3VwWyd0YWcnXS5pbnNpZGVbJ2F0dHItdmFsdWUnXS5pbnNpZGVbJ2VudGl0eSddID1cblx0UHJpc20ubGFuZ3VhZ2VzLm1hcmt1cFsnZW50aXR5J107XG5cbi8vIFBsdWdpbiB0byBtYWtlIGVudGl0eSB0aXRsZSBzaG93IHRoZSByZWFsIGVudGl0eSwgaWRlYSBieSBSb21hbiBLb21hcm92XG5QcmlzbS5ob29rcy5hZGQoJ3dyYXAnLCBmdW5jdGlvbihlbnYpIHtcblxuXHRpZiAoZW52LnR5cGUgPT09ICdlbnRpdHknKSB7XG5cdFx0ZW52LmF0dHJpYnV0ZXNbJ3RpdGxlJ10gPSBlbnYuY29udGVudC5yZXBsYWNlKC8mYW1wOy8sICcmJyk7XG5cdH1cbn0pO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoUHJpc20ubGFuZ3VhZ2VzLm1hcmt1cC50YWcsICdhZGRJbmxpbmVkJywge1xuXHQvKipcblx0ICogQWRkcyBhbiBpbmxpbmVkIGxhbmd1YWdlIHRvIG1hcmt1cC5cblx0ICpcblx0ICogQW4gZXhhbXBsZSBvZiBhbiBpbmxpbmVkIGxhbmd1YWdlIGlzIENTUyB3aXRoIGA8c3R5bGU+YCB0YWdzLlxuXHQgKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gdGFnTmFtZSBUaGUgbmFtZSBvZiB0aGUgdGFnIHRoYXQgY29udGFpbnMgdGhlIGlubGluZWQgbGFuZ3VhZ2UuIFRoaXMgbmFtZSB3aWxsIGJlIHRyZWF0ZWQgYXNcblx0ICogY2FzZSBpbnNlbnNpdGl2ZS5cblx0ICogQHBhcmFtIHtzdHJpbmd9IGxhbmcgVGhlIGxhbmd1YWdlIGtleS5cblx0ICogQGV4YW1wbGVcblx0ICogYWRkSW5saW5lZCgnc3R5bGUnLCAnY3NzJyk7XG5cdCAqL1xuXHR2YWx1ZTogZnVuY3Rpb24gYWRkSW5saW5lZCh0YWdOYW1lLCBsYW5nKSB7XG5cdFx0dmFyIGluY2x1ZGVkQ2RhdGFJbnNpZGUgPSB7fTtcblx0XHRpbmNsdWRlZENkYXRhSW5zaWRlWydsYW5ndWFnZS0nICsgbGFuZ10gPSB7XG5cdFx0XHRwYXR0ZXJuOiAvKF48IVxcW0NEQVRBXFxbKVtcXHNcXFNdKz8oPz1cXF1cXF0+JCkvaSxcblx0XHRcdGxvb2tiZWhpbmQ6IHRydWUsXG5cdFx0XHRpbnNpZGU6IFByaXNtLmxhbmd1YWdlc1tsYW5nXVxuXHRcdH07XG5cdFx0aW5jbHVkZWRDZGF0YUluc2lkZVsnY2RhdGEnXSA9IC9ePCFcXFtDREFUQVxcW3xcXF1cXF0+JC9pO1xuXG5cdFx0dmFyIGluc2lkZSA9IHtcblx0XHRcdCdpbmNsdWRlZC1jZGF0YSc6IHtcblx0XHRcdFx0cGF0dGVybjogLzwhXFxbQ0RBVEFcXFtbXFxzXFxTXSo/XFxdXFxdPi9pLFxuXHRcdFx0XHRpbnNpZGU6IGluY2x1ZGVkQ2RhdGFJbnNpZGVcblx0XHRcdH1cblx0XHR9O1xuXHRcdGluc2lkZVsnbGFuZ3VhZ2UtJyArIGxhbmddID0ge1xuXHRcdFx0cGF0dGVybjogL1tcXHNcXFNdKy8sXG5cdFx0XHRpbnNpZGU6IFByaXNtLmxhbmd1YWdlc1tsYW5nXVxuXHRcdH07XG5cblx0XHR2YXIgZGVmID0ge307XG5cdFx0ZGVmW3RhZ05hbWVdID0ge1xuXHRcdFx0cGF0dGVybjogUmVnRXhwKC8oPF9fW1xcc1xcU10qPz4pKD86PCFcXFtDREFUQVxcW1tcXHNcXFNdKj9cXF1cXF0+XFxzKnxbXFxzXFxTXSkqPyg/PTxcXC9fXz4pLy5zb3VyY2UucmVwbGFjZSgvX18vZywgdGFnTmFtZSksICdpJyksXG5cdFx0XHRsb29rYmVoaW5kOiB0cnVlLFxuXHRcdFx0Z3JlZWR5OiB0cnVlLFxuXHRcdFx0aW5zaWRlOiBpbnNpZGVcblx0XHR9O1xuXG5cdFx0UHJpc20ubGFuZ3VhZ2VzLmluc2VydEJlZm9yZSgnbWFya3VwJywgJ2NkYXRhJywgZGVmKTtcblx0fVxufSk7XG5cblByaXNtLmxhbmd1YWdlcy54bWwgPSBQcmlzbS5sYW5ndWFnZXMuZXh0ZW5kKCdtYXJrdXAnLCB7fSk7XG5QcmlzbS5sYW5ndWFnZXMuaHRtbCA9IFByaXNtLmxhbmd1YWdlcy5tYXJrdXA7XG5QcmlzbS5sYW5ndWFnZXMubWF0aG1sID0gUHJpc20ubGFuZ3VhZ2VzLm1hcmt1cDtcblByaXNtLmxhbmd1YWdlcy5zdmcgPSBQcmlzbS5sYW5ndWFnZXMubWFya3VwO1xuXG5cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgQmVnaW4gcHJpc20tY3NzLmpzXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5cbihmdW5jdGlvbiAoUHJpc20pIHtcblxuXHR2YXIgc3RyaW5nID0gLyhcInwnKSg/OlxcXFwoPzpcXHJcXG58W1xcc1xcU10pfCg/IVxcMSlbXlxcXFxcXHJcXG5dKSpcXDEvO1xuXG5cdFByaXNtLmxhbmd1YWdlcy5jc3MgPSB7XG5cdFx0J2NvbW1lbnQnOiAvXFwvXFwqW1xcc1xcU10qP1xcKlxcLy8sXG5cdFx0J2F0cnVsZSc6IHtcblx0XHRcdHBhdHRlcm46IC9AW1xcdy1dK1tcXHNcXFNdKj8oPzo7fCg/PVxccypcXHspKS8sXG5cdFx0XHRpbnNpZGU6IHtcblx0XHRcdFx0J3J1bGUnOiAvQFtcXHctXSsvXG5cdFx0XHRcdC8vIFNlZSByZXN0IGJlbG93XG5cdFx0XHR9XG5cdFx0fSxcblx0XHQndXJsJzoge1xuXHRcdFx0cGF0dGVybjogUmVnRXhwKCd1cmxcXFxcKCg/OicgKyBzdHJpbmcuc291cmNlICsgJ3xbXlxcblxccigpXSopXFxcXCknLCAnaScpLFxuXHRcdFx0aW5zaWRlOiB7XG5cdFx0XHRcdCdmdW5jdGlvbic6IC9edXJsL2ksXG5cdFx0XHRcdCdwdW5jdHVhdGlvbic6IC9eXFwofFxcKSQvXG5cdFx0XHR9XG5cdFx0fSxcblx0XHQnc2VsZWN0b3InOiBSZWdFeHAoJ1tee31cXFxcc10oPzpbXnt9O1wiXFwnXXwnICsgc3RyaW5nLnNvdXJjZSArICcpKj8oPz1cXFxccypcXFxceyknKSxcblx0XHQnc3RyaW5nJzoge1xuXHRcdFx0cGF0dGVybjogc3RyaW5nLFxuXHRcdFx0Z3JlZWR5OiB0cnVlXG5cdFx0fSxcblx0XHQncHJvcGVydHknOiAvWy1fYS16XFx4QTAtXFx1RkZGRl1bLVxcd1xceEEwLVxcdUZGRkZdKig/PVxccyo6KS9pLFxuXHRcdCdpbXBvcnRhbnQnOiAvIWltcG9ydGFudFxcYi9pLFxuXHRcdCdmdW5jdGlvbic6IC9bLWEtejAtOV0rKD89XFwoKS9pLFxuXHRcdCdwdW5jdHVhdGlvbic6IC9bKCl7fTs6LF0vXG5cdH07XG5cblx0UHJpc20ubGFuZ3VhZ2VzLmNzc1snYXRydWxlJ10uaW5zaWRlLnJlc3QgPSBQcmlzbS5sYW5ndWFnZXMuY3NzO1xuXG5cdHZhciBtYXJrdXAgPSBQcmlzbS5sYW5ndWFnZXMubWFya3VwO1xuXHRpZiAobWFya3VwKSB7XG5cdFx0bWFya3VwLnRhZy5hZGRJbmxpbmVkKCdzdHlsZScsICdjc3MnKTtcblxuXHRcdFByaXNtLmxhbmd1YWdlcy5pbnNlcnRCZWZvcmUoJ2luc2lkZScsICdhdHRyLXZhbHVlJywge1xuXHRcdFx0J3N0eWxlLWF0dHInOiB7XG5cdFx0XHRcdHBhdHRlcm46IC9cXHMqc3R5bGU9KFwifCcpKD86XFxcXFtcXHNcXFNdfCg/IVxcMSlbXlxcXFxdKSpcXDEvaSxcblx0XHRcdFx0aW5zaWRlOiB7XG5cdFx0XHRcdFx0J2F0dHItbmFtZSc6IHtcblx0XHRcdFx0XHRcdHBhdHRlcm46IC9eXFxzKnN0eWxlL2ksXG5cdFx0XHRcdFx0XHRpbnNpZGU6IG1hcmt1cC50YWcuaW5zaWRlXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHQncHVuY3R1YXRpb24nOiAvXlxccyo9XFxzKlsnXCJdfFsnXCJdXFxzKiQvLFxuXHRcdFx0XHRcdCdhdHRyLXZhbHVlJzoge1xuXHRcdFx0XHRcdFx0cGF0dGVybjogLy4rL2ksXG5cdFx0XHRcdFx0XHRpbnNpZGU6IFByaXNtLmxhbmd1YWdlcy5jc3Ncblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGFsaWFzOiAnbGFuZ3VhZ2UtY3NzJ1xuXHRcdFx0fVxuXHRcdH0sIG1hcmt1cC50YWcpO1xuXHR9XG5cbn0oUHJpc20pKTtcblxuXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgIEJlZ2luIHByaXNtLWNsaWtlLmpzXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5cblByaXNtLmxhbmd1YWdlcy5jbGlrZSA9IHtcblx0J2NvbW1lbnQnOiBbXG5cdFx0e1xuXHRcdFx0cGF0dGVybjogLyhefFteXFxcXF0pXFwvXFwqW1xcc1xcU10qPyg/OlxcKlxcL3wkKS8sXG5cdFx0XHRsb29rYmVoaW5kOiB0cnVlXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRwYXR0ZXJuOiAvKF58W15cXFxcOl0pXFwvXFwvLiovLFxuXHRcdFx0bG9va2JlaGluZDogdHJ1ZSxcblx0XHRcdGdyZWVkeTogdHJ1ZVxuXHRcdH1cblx0XSxcblx0J3N0cmluZyc6IHtcblx0XHRwYXR0ZXJuOiAvKFtcIiddKSg/OlxcXFwoPzpcXHJcXG58W1xcc1xcU10pfCg/IVxcMSlbXlxcXFxcXHJcXG5dKSpcXDEvLFxuXHRcdGdyZWVkeTogdHJ1ZVxuXHR9LFxuXHQnY2xhc3MtbmFtZSc6IHtcblx0XHRwYXR0ZXJuOiAvKCg/OlxcYig/OmNsYXNzfGludGVyZmFjZXxleHRlbmRzfGltcGxlbWVudHN8dHJhaXR8aW5zdGFuY2VvZnxuZXcpXFxzKyl8KD86Y2F0Y2hcXHMrXFwoKSlbXFx3LlxcXFxdKy9pLFxuXHRcdGxvb2tiZWhpbmQ6IHRydWUsXG5cdFx0aW5zaWRlOiB7XG5cdFx0XHRwdW5jdHVhdGlvbjogL1suXFxcXF0vXG5cdFx0fVxuXHR9LFxuXHQna2V5d29yZCc6IC9cXGIoPzppZnxlbHNlfHdoaWxlfGRvfGZvcnxyZXR1cm58aW58aW5zdGFuY2VvZnxmdW5jdGlvbnxuZXd8dHJ5fHRocm93fGNhdGNofGZpbmFsbHl8bnVsbHxicmVha3xjb250aW51ZSlcXGIvLFxuXHQnYm9vbGVhbic6IC9cXGIoPzp0cnVlfGZhbHNlKVxcYi8sXG5cdCdmdW5jdGlvbic6IC9cXHcrKD89XFwoKS8sXG5cdCdudW1iZXInOiAvXFxiMHhbXFxkYS1mXStcXGJ8KD86XFxiXFxkK1xcLj9cXGQqfFxcQlxcLlxcZCspKD86ZVsrLV0/XFxkKyk/L2ksXG5cdCdvcGVyYXRvcic6IC8tLT98XFwrXFwrP3whPT89P3w8PT98Pj0/fD09Pz0/fCYmP3xcXHxcXHw/fFxcP3xcXCp8XFwvfH58XFxefCUvLFxuXHQncHVuY3R1YXRpb24nOiAvW3t9W1xcXTsoKSwuOl0vXG59O1xuXG5cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgQmVnaW4gcHJpc20tamF2YXNjcmlwdC5qc1xuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuXG5QcmlzbS5sYW5ndWFnZXMuamF2YXNjcmlwdCA9IFByaXNtLmxhbmd1YWdlcy5leHRlbmQoJ2NsaWtlJywge1xuXHQnY2xhc3MtbmFtZSc6IFtcblx0XHRQcmlzbS5sYW5ndWFnZXMuY2xpa2VbJ2NsYXNzLW5hbWUnXSxcblx0XHR7XG5cdFx0XHRwYXR0ZXJuOiAvKF58W14kXFx3XFx4QTAtXFx1RkZGRl0pW18kQS1aXFx4QTAtXFx1RkZGRl1bJFxcd1xceEEwLVxcdUZGRkZdKig/PVxcLig/OnByb3RvdHlwZXxjb25zdHJ1Y3RvcikpLyxcblx0XHRcdGxvb2tiZWhpbmQ6IHRydWVcblx0XHR9XG5cdF0sXG5cdCdrZXl3b3JkJzogW1xuXHRcdHtcblx0XHRcdHBhdHRlcm46IC8oKD86Xnx9KVxccyopKD86Y2F0Y2h8ZmluYWxseSlcXGIvLFxuXHRcdFx0bG9va2JlaGluZDogdHJ1ZVxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0cGF0dGVybjogLyhefFteLl0pXFxiKD86YXN8YXN5bmMoPz1cXHMqKD86ZnVuY3Rpb25cXGJ8XFwofFskXFx3XFx4QTAtXFx1RkZGRl18JCkpfGF3YWl0fGJyZWFrfGNhc2V8Y2xhc3N8Y29uc3R8Y29udGludWV8ZGVidWdnZXJ8ZGVmYXVsdHxkZWxldGV8ZG98ZWxzZXxlbnVtfGV4cG9ydHxleHRlbmRzfGZvcnxmcm9tfGZ1bmN0aW9ufGdldHxpZnxpbXBsZW1lbnRzfGltcG9ydHxpbnxpbnN0YW5jZW9mfGludGVyZmFjZXxsZXR8bmV3fG51bGx8b2Z8cGFja2FnZXxwcml2YXRlfHByb3RlY3RlZHxwdWJsaWN8cmV0dXJufHNldHxzdGF0aWN8c3VwZXJ8c3dpdGNofHRoaXN8dGhyb3d8dHJ5fHR5cGVvZnx1bmRlZmluZWR8dmFyfHZvaWR8d2hpbGV8d2l0aHx5aWVsZClcXGIvLFxuXHRcdFx0bG9va2JlaGluZDogdHJ1ZVxuXHRcdH0sXG5cdF0sXG5cdCdudW1iZXInOiAvXFxiKD86KD86MFt4WF0oPzpbXFxkQS1GYS1mXSg/Ol9bXFxkQS1GYS1mXSk/KSt8MFtiQl0oPzpbMDFdKD86X1swMV0pPykrfDBbb09dKD86WzAtN10oPzpfWzAtN10pPykrKW4/fCg/OlxcZCg/Ol9cXGQpPykrbnxOYU58SW5maW5pdHkpXFxifCg/OlxcYig/OlxcZCg/Ol9cXGQpPykrXFwuPyg/OlxcZCg/Ol9cXGQpPykqfFxcQlxcLig/OlxcZCg/Ol9cXGQpPykrKSg/OltFZV1bKy1dPyg/OlxcZCg/Ol9cXGQpPykrKT8vLFxuXHQvLyBBbGxvdyBmb3IgYWxsIG5vbi1BU0NJSSBjaGFyYWN0ZXJzIChTZWUgaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMjAwODQ0NClcblx0J2Z1bmN0aW9uJzogLyM/W18kYS16QS1aXFx4QTAtXFx1RkZGRl1bJFxcd1xceEEwLVxcdUZGRkZdKig/PVxccyooPzpcXC5cXHMqKD86YXBwbHl8YmluZHxjYWxsKVxccyopP1xcKCkvLFxuXHQnb3BlcmF0b3InOiAvLVstPV0/fFxcK1srPV0/fCE9Pz0/fDw8Pz0/fD4+Pz4/PT98PSg/Oj09P3w+KT98JlsmPV0/fFxcfFt8PV0/fFxcKlxcKj89P3xcXC89P3x+fFxcXj0/fCU9P3xcXD98XFwuezN9L1xufSk7XG5cblByaXNtLmxhbmd1YWdlcy5qYXZhc2NyaXB0WydjbGFzcy1uYW1lJ11bMF0ucGF0dGVybiA9IC8oXFxiKD86Y2xhc3N8aW50ZXJmYWNlfGV4dGVuZHN8aW1wbGVtZW50c3xpbnN0YW5jZW9mfG5ldylcXHMrKVtcXHcuXFxcXF0rLztcblxuUHJpc20ubGFuZ3VhZ2VzLmluc2VydEJlZm9yZSgnamF2YXNjcmlwdCcsICdrZXl3b3JkJywge1xuXHQncmVnZXgnOiB7XG5cdFx0cGF0dGVybjogLygoPzpefFteJFxcd1xceEEwLVxcdUZGRkYuXCInXFxdKVxcc10pXFxzKilcXC8oXFxbKD86W15cXF1cXFxcXFxyXFxuXXxcXFxcLikqXXxcXFxcLnxbXi9cXFxcXFxbXFxyXFxuXSkrXFwvW2dpbXl1c117MCw2fSg/PVxccyooJHxbXFxyXFxuLC47fSlcXF1dKSkvLFxuXHRcdGxvb2tiZWhpbmQ6IHRydWUsXG5cdFx0Z3JlZWR5OiB0cnVlXG5cdH0sXG5cdC8vIFRoaXMgbXVzdCBiZSBkZWNsYXJlZCBiZWZvcmUga2V5d29yZCBiZWNhdXNlIHdlIHVzZSBcImZ1bmN0aW9uXCIgaW5zaWRlIHRoZSBsb29rLWZvcndhcmRcblx0J2Z1bmN0aW9uLXZhcmlhYmxlJzoge1xuXHRcdHBhdHRlcm46IC8jP1tfJGEtekEtWlxceEEwLVxcdUZGRkZdWyRcXHdcXHhBMC1cXHVGRkZGXSooPz1cXHMqWz06XVxccyooPzphc3luY1xccyopPyg/OlxcYmZ1bmN0aW9uXFxifCg/OlxcKCg/OlteKCldfFxcKFteKCldKlxcKSkqXFwpfFtfJGEtekEtWlxceEEwLVxcdUZGRkZdWyRcXHdcXHhBMC1cXHVGRkZGXSopXFxzKj0+KSkvLFxuXHRcdGFsaWFzOiAnZnVuY3Rpb24nXG5cdH0sXG5cdCdwYXJhbWV0ZXInOiBbXG5cdFx0e1xuXHRcdFx0cGF0dGVybjogLyhmdW5jdGlvbig/OlxccytbXyRBLVphLXpcXHhBMC1cXHVGRkZGXVskXFx3XFx4QTAtXFx1RkZGRl0qKT9cXHMqXFwoXFxzKikoPyFcXHMpKD86W14oKV18XFwoW14oKV0qXFwpKSs/KD89XFxzKlxcKSkvLFxuXHRcdFx0bG9va2JlaGluZDogdHJ1ZSxcblx0XHRcdGluc2lkZTogUHJpc20ubGFuZ3VhZ2VzLmphdmFzY3JpcHRcblx0XHR9LFxuXHRcdHtcblx0XHRcdHBhdHRlcm46IC9bXyRhLXpcXHhBMC1cXHVGRkZGXVskXFx3XFx4QTAtXFx1RkZGRl0qKD89XFxzKj0+KS9pLFxuXHRcdFx0aW5zaWRlOiBQcmlzbS5sYW5ndWFnZXMuamF2YXNjcmlwdFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0cGF0dGVybjogLyhcXChcXHMqKSg/IVxccykoPzpbXigpXXxcXChbXigpXSpcXCkpKz8oPz1cXHMqXFwpXFxzKj0+KS8sXG5cdFx0XHRsb29rYmVoaW5kOiB0cnVlLFxuXHRcdFx0aW5zaWRlOiBQcmlzbS5sYW5ndWFnZXMuamF2YXNjcmlwdFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0cGF0dGVybjogLygoPzpcXGJ8XFxzfF4pKD8hKD86YXN8YXN5bmN8YXdhaXR8YnJlYWt8Y2FzZXxjYXRjaHxjbGFzc3xjb25zdHxjb250aW51ZXxkZWJ1Z2dlcnxkZWZhdWx0fGRlbGV0ZXxkb3xlbHNlfGVudW18ZXhwb3J0fGV4dGVuZHN8ZmluYWxseXxmb3J8ZnJvbXxmdW5jdGlvbnxnZXR8aWZ8aW1wbGVtZW50c3xpbXBvcnR8aW58aW5zdGFuY2VvZnxpbnRlcmZhY2V8bGV0fG5ld3xudWxsfG9mfHBhY2thZ2V8cHJpdmF0ZXxwcm90ZWN0ZWR8cHVibGljfHJldHVybnxzZXR8c3RhdGljfHN1cGVyfHN3aXRjaHx0aGlzfHRocm93fHRyeXx0eXBlb2Z8dW5kZWZpbmVkfHZhcnx2b2lkfHdoaWxlfHdpdGh8eWllbGQpKD8hWyRcXHdcXHhBMC1cXHVGRkZGXSkpKD86W18kQS1aYS16XFx4QTAtXFx1RkZGRl1bJFxcd1xceEEwLVxcdUZGRkZdKlxccyopXFwoXFxzKikoPyFcXHMpKD86W14oKV18XFwoW14oKV0qXFwpKSs/KD89XFxzKlxcKVxccypcXHspLyxcblx0XHRcdGxvb2tiZWhpbmQ6IHRydWUsXG5cdFx0XHRpbnNpZGU6IFByaXNtLmxhbmd1YWdlcy5qYXZhc2NyaXB0XG5cdFx0fVxuXHRdLFxuXHQnY29uc3RhbnQnOiAvXFxiW0EtWl0oPzpbQS1aX118XFxkeD8pKlxcYi9cbn0pO1xuXG5QcmlzbS5sYW5ndWFnZXMuaW5zZXJ0QmVmb3JlKCdqYXZhc2NyaXB0JywgJ3N0cmluZycsIHtcblx0J3RlbXBsYXRlLXN0cmluZyc6IHtcblx0XHRwYXR0ZXJuOiAvYCg/OlxcXFxbXFxzXFxTXXxcXCR7KD86W157fV18eyg/Oltee31dfHtbXn1dKn0pKn0pK318KD8hXFwkeylbXlxcXFxgXSkqYC8sXG5cdFx0Z3JlZWR5OiB0cnVlLFxuXHRcdGluc2lkZToge1xuXHRcdFx0J3RlbXBsYXRlLXB1bmN0dWF0aW9uJzoge1xuXHRcdFx0XHRwYXR0ZXJuOiAvXmB8YCQvLFxuXHRcdFx0XHRhbGlhczogJ3N0cmluZydcblx0XHRcdH0sXG5cdFx0XHQnaW50ZXJwb2xhdGlvbic6IHtcblx0XHRcdFx0cGF0dGVybjogLygoPzpefFteXFxcXF0pKD86XFxcXHsyfSkqKVxcJHsoPzpbXnt9XXx7KD86W157fV18e1tefV0qfSkqfSkrfS8sXG5cdFx0XHRcdGxvb2tiZWhpbmQ6IHRydWUsXG5cdFx0XHRcdGluc2lkZToge1xuXHRcdFx0XHRcdCdpbnRlcnBvbGF0aW9uLXB1bmN0dWF0aW9uJzoge1xuXHRcdFx0XHRcdFx0cGF0dGVybjogL15cXCR7fH0kLyxcblx0XHRcdFx0XHRcdGFsaWFzOiAncHVuY3R1YXRpb24nXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRyZXN0OiBQcmlzbS5sYW5ndWFnZXMuamF2YXNjcmlwdFxuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0J3N0cmluZyc6IC9bXFxzXFxTXSsvXG5cdFx0fVxuXHR9XG59KTtcblxuaWYgKFByaXNtLmxhbmd1YWdlcy5tYXJrdXApIHtcblx0UHJpc20ubGFuZ3VhZ2VzLm1hcmt1cC50YWcuYWRkSW5saW5lZCgnc2NyaXB0JywgJ2phdmFzY3JpcHQnKTtcbn1cblxuUHJpc20ubGFuZ3VhZ2VzLmpzID0gUHJpc20ubGFuZ3VhZ2VzLmphdmFzY3JpcHQ7XG5cblxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICBCZWdpbiBwcmlzbS1maWxlLWhpZ2hsaWdodC5qc1xuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuXG4oZnVuY3Rpb24gKCkge1xuXHRpZiAodHlwZW9mIHNlbGYgPT09ICd1bmRlZmluZWQnIHx8ICFzZWxmLlByaXNtIHx8ICFzZWxmLmRvY3VtZW50IHx8ICFkb2N1bWVudC5xdWVyeVNlbGVjdG9yKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBwYXJhbSB7RWxlbWVudH0gW2NvbnRhaW5lcj1kb2N1bWVudF1cblx0ICovXG5cdHNlbGYuUHJpc20uZmlsZUhpZ2hsaWdodCA9IGZ1bmN0aW9uKGNvbnRhaW5lcikge1xuXHRcdGNvbnRhaW5lciA9IGNvbnRhaW5lciB8fCBkb2N1bWVudDtcblxuXHRcdHZhciBFeHRlbnNpb25zID0ge1xuXHRcdFx0J2pzJzogJ2phdmFzY3JpcHQnLFxuXHRcdFx0J3B5JzogJ3B5dGhvbicsXG5cdFx0XHQncmInOiAncnVieScsXG5cdFx0XHQncHMxJzogJ3Bvd2Vyc2hlbGwnLFxuXHRcdFx0J3BzbTEnOiAncG93ZXJzaGVsbCcsXG5cdFx0XHQnc2gnOiAnYmFzaCcsXG5cdFx0XHQnYmF0JzogJ2JhdGNoJyxcblx0XHRcdCdoJzogJ2MnLFxuXHRcdFx0J3RleCc6ICdsYXRleCdcblx0XHR9O1xuXG5cdFx0QXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoJ3ByZVtkYXRhLXNyY10nKSkuZm9yRWFjaChmdW5jdGlvbiAocHJlKSB7XG5cdFx0XHQvLyBpZ25vcmUgaWYgYWxyZWFkeSBsb2FkZWRcblx0XHRcdGlmIChwcmUuaGFzQXR0cmlidXRlKCdkYXRhLXNyYy1sb2FkZWQnKSkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdC8vIGxvYWQgY3VycmVudFxuXHRcdFx0dmFyIHNyYyA9IHByZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtc3JjJyk7XG5cblx0XHRcdHZhciBsYW5ndWFnZSwgcGFyZW50ID0gcHJlO1xuXHRcdFx0dmFyIGxhbmcgPSAvXFxibGFuZyg/OnVhZ2UpPy0oW1xcdy1dKylcXGIvaTtcblx0XHRcdHdoaWxlIChwYXJlbnQgJiYgIWxhbmcudGVzdChwYXJlbnQuY2xhc3NOYW1lKSkge1xuXHRcdFx0XHRwYXJlbnQgPSBwYXJlbnQucGFyZW50Tm9kZTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKHBhcmVudCkge1xuXHRcdFx0XHRsYW5ndWFnZSA9IChwcmUuY2xhc3NOYW1lLm1hdGNoKGxhbmcpIHx8IFssICcnXSlbMV07XG5cdFx0XHR9XG5cblx0XHRcdGlmICghbGFuZ3VhZ2UpIHtcblx0XHRcdFx0dmFyIGV4dGVuc2lvbiA9IChzcmMubWF0Y2goL1xcLihcXHcrKSQvKSB8fCBbLCAnJ10pWzFdO1xuXHRcdFx0XHRsYW5ndWFnZSA9IEV4dGVuc2lvbnNbZXh0ZW5zaW9uXSB8fCBleHRlbnNpb247XG5cdFx0XHR9XG5cblx0XHRcdHZhciBjb2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY29kZScpO1xuXHRcdFx0Y29kZS5jbGFzc05hbWUgPSAnbGFuZ3VhZ2UtJyArIGxhbmd1YWdlO1xuXG5cdFx0XHRwcmUudGV4dENvbnRlbnQgPSAnJztcblxuXHRcdFx0Y29kZS50ZXh0Q29udGVudCA9ICdMb2FkaW5n4oCmJztcblxuXHRcdFx0cHJlLmFwcGVuZENoaWxkKGNvZGUpO1xuXG5cdFx0XHR2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cblx0XHRcdHhoci5vcGVuKCdHRVQnLCBzcmMsIHRydWUpO1xuXG5cdFx0XHR4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRpZiAoeGhyLnJlYWR5U3RhdGUgPT0gNCkge1xuXG5cdFx0XHRcdFx0aWYgKHhoci5zdGF0dXMgPCA0MDAgJiYgeGhyLnJlc3BvbnNlVGV4dCkge1xuXHRcdFx0XHRcdFx0Y29kZS50ZXh0Q29udGVudCA9IHhoci5yZXNwb25zZVRleHQ7XG5cblx0XHRcdFx0XHRcdFByaXNtLmhpZ2hsaWdodEVsZW1lbnQoY29kZSk7XG5cdFx0XHRcdFx0XHQvLyBtYXJrIGFzIGxvYWRlZFxuXHRcdFx0XHRcdFx0cHJlLnNldEF0dHJpYnV0ZSgnZGF0YS1zcmMtbG9hZGVkJywgJycpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNlIGlmICh4aHIuc3RhdHVzID49IDQwMCkge1xuXHRcdFx0XHRcdFx0Y29kZS50ZXh0Q29udGVudCA9ICfinJYgRXJyb3IgJyArIHhoci5zdGF0dXMgKyAnIHdoaWxlIGZldGNoaW5nIGZpbGU6ICcgKyB4aHIuc3RhdHVzVGV4dDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHRjb2RlLnRleHRDb250ZW50ID0gJ+KcliBFcnJvcjogRmlsZSBkb2VzIG5vdCBleGlzdCBvciBpcyBlbXB0eSc7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXG5cdFx0XHR4aHIuc2VuZChudWxsKTtcblx0XHR9KTtcblxuXHRcdGlmIChQcmlzbS5wbHVnaW5zLnRvb2xiYXIpIHtcblx0XHRcdFByaXNtLnBsdWdpbnMudG9vbGJhci5yZWdpc3RlckJ1dHRvbignZG93bmxvYWQtZmlsZScsIGZ1bmN0aW9uIChlbnYpIHtcblx0XHRcdFx0dmFyIHByZSA9IGVudi5lbGVtZW50LnBhcmVudE5vZGU7XG5cdFx0XHRcdGlmICghcHJlIHx8ICEvcHJlL2kudGVzdChwcmUubm9kZU5hbWUpIHx8ICFwcmUuaGFzQXR0cmlidXRlKCdkYXRhLXNyYycpIHx8ICFwcmUuaGFzQXR0cmlidXRlKCdkYXRhLWRvd25sb2FkLWxpbmsnKSkge1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0XHR2YXIgc3JjID0gcHJlLmdldEF0dHJpYnV0ZSgnZGF0YS1zcmMnKTtcblx0XHRcdFx0dmFyIGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG5cdFx0XHRcdGEudGV4dENvbnRlbnQgPSBwcmUuZ2V0QXR0cmlidXRlKCdkYXRhLWRvd25sb2FkLWxpbmstbGFiZWwnKSB8fCAnRG93bmxvYWQnO1xuXHRcdFx0XHRhLnNldEF0dHJpYnV0ZSgnZG93bmxvYWQnLCAnJyk7XG5cdFx0XHRcdGEuaHJlZiA9IHNyYztcblx0XHRcdFx0cmV0dXJuIGE7XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0fTtcblxuXHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgZnVuY3Rpb24gKCkge1xuXHRcdC8vIGV4ZWN1dGUgaW5zaWRlIGhhbmRsZXIsIGZvciBkcm9wcGluZyBFdmVudCBhcyBhcmd1bWVudFxuXHRcdHNlbGYuUHJpc20uZmlsZUhpZ2hsaWdodCgpO1xuXHR9KTtcblxufSkoKTtcbiIsImZ1bmN0aW9uIFNwcmluZ2lmeSgpe2Zvcih2YXIgYT10aGlzLGk9W10sdD1hcmd1bWVudHMubGVuZ3RoO3QtLTspaVt0XT1hcmd1bWVudHNbdF07dGhpcy5hbmltYXRpbmc9ITE7dmFyIG4scCxlLG8sbT0wLHU9MTAscz0zMCxyPTIwLGM9e291dHB1dDowLHZlbG9jaXR5OjAsYW1wbGl0dWRlOjB9LGY9W10sbD1mdW5jdGlvbihhLGksdCl7cmV0dXJuIGEqKHQtaSkvMTAwK2l9O2kubWFwKGZ1bmN0aW9uKGkpe3ZvaWQgMCE9PWkucHJvcE5hbWU/KGFbaS5wcm9wTmFtZV09T2JqZWN0LmFzc2lnbih7fSxjKSxhW2kucHJvcE5hbWVdLnN0aWZmbmVzcz1pLmlucHV0fHxtLGFbaS5wcm9wTmFtZV0uc3RpZmZuZXNzPWkuc3RpZmZuZXNzfHx1LGFbaS5wcm9wTmFtZV0uZGFtcGluZz1pLmRhbXBpbmd8fHMsYVtpLnByb3BOYW1lXS5tYXNzPWkubWFzc3x8cixhW2kucHJvcE5hbWVdLmlucHV0PWkuaW5wdXR8fG0sYVtpLnByb3BOYW1lXS5vdXRwdXQ9YVtpLnByb3BOYW1lXS5pbnB1dCxmLnB1c2goYVtpLnByb3BOYW1lXSkpOmEuY2FsbGJhY2s9aX0pO3ZhciBnPWZ1bmN0aW9uKCl7dmFyIGk7cD1EYXRlLm5vdygpLGEuYW5pbWF0aW5nfHwobj1wLTEpLGU9cC1uLG49cCxhLmFuaW1hdGluZz0hMCxmLmZvckVhY2goZnVuY3Rpb24oYSl7dmFyIGksdCxuLHAsbyxtO3Q9bCgoaT1hKS5zdGlmZm5lc3MsLTEsLTMwMCksbj1sKGkuZGFtcGluZywtLjQsLTIwKSxwPWwoaS5tYXNzLC4xLDEwKSxvPXQqKGkub3V0cHV0LWkuaW5wdXQpLG09bippLnZlbG9jaXR5LGkuYW1wbGl0dWRlPShvK20pL3AsaS52ZWxvY2l0eSs9aS5hbXBsaXR1ZGUqKGUvMWUzKSxpLm91dHB1dCs9aS52ZWxvY2l0eSooZS8xZTMpfSksKGk9YSkuY2FsbGJhY2suYXBwbHkoaSxmKSxmLmV2ZXJ5KGZ1bmN0aW9uKGEpe3JldHVybiBNYXRoLmFicyhhLnZlbG9jaXR5KTwuNSYmTWF0aC5hYnMoYS5vdXRwdXQtYS5pbnB1dCk8LjV9KT8oYS5hbmltYXRpbmc9ITEsY29uc29sZS5sb2coXCJmaW5pc2hlZCBzcHJpbmcgYW5pbWF0aW9uXCIpKTooY2FuY2VsQW5pbWF0aW9uRnJhbWUobyksbz1yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZykpfTt0aGlzLmFuaW1hdGU9ZnVuY3Rpb24oKXthLmFuaW1hdGluZ3x8ZygpfX1leHBvcnQgZGVmYXVsdCBTcHJpbmdpZnk7IiwiaW1wb3J0IFNwcmluZ2lmeSBmcm9tIFwiLi4vLi4vZGlzdC9zcHJpbmdpZnkuZXNtLmpzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCkge1xuICBjb25zdCBzcHJpbmd5U2FpbGJvYXQgPSBuZXcgU3ByaW5naWZ5KFxuICAgIHtcbiAgICAgIHByb3BOYW1lOiBcInhcIixcbiAgICAgIGlucHV0OiAxMCxcbiAgICAgIHN0aWZmbmVzczogMTAsXG4gICAgICBkYW1waW5nOiA4MCxcbiAgICAgIG1hc3M6IDUwLFxuICAgIH0sXG4gICAgZnVuY3Rpb24oeCkge1xuICAgICAgc2FpbGJvYXQuc3R5bGUubGVmdCA9IGAke3gub3V0cHV0fSVgO1xuICAgICAgc2FpbGJvYXQuc3R5bGUudHJhbnNmb3JtID0gYHJvdGF0ZSgke3gudmVsb2NpdHkgKiAtMC4yfWRlZylgO1xuICAgIH1cbiAgKTtcblxuICBjb25zdCBzYWlsYm9hdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuc2FpbGJvYXRcIik7XG4gIGNvbnN0IHNhaWxBd2F5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5zYWlsYm9hdC0tYXdheVwiKTtcbiAgY29uc3Qgc2FpbEJhY2sgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnNhaWxib2F0LS1iYWNrXCIpO1xuXG4gIHNhaWxBd2F5LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgc3ByaW5neVNhaWxib2F0LnguaW5wdXQgPSA5MDtcbiAgICBzcHJpbmd5U2FpbGJvYXQuYW5pbWF0ZSgpO1xuICB9KTtcblxuICBzYWlsQmFjay5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgIHNwcmluZ3lTYWlsYm9hdC54LmlucHV0ID0gMTA7XG4gICAgc3ByaW5neVNhaWxib2F0LmFuaW1hdGUoKTtcbiAgfSk7XG59XG4iLCJpbXBvcnQgU3ByaW5naWZ5IGZyb20gXCIuLi8uLi9kaXN0L3NwcmluZ2lmeS5lc20uanNcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XG4gIGNvbnN0IHNwcmluZ3lTcGlkZXIgPSBuZXcgU3ByaW5naWZ5KFxuICAgIHtcbiAgICAgIHByb3BOYW1lOiBcInhcIixcbiAgICAgIHN0aWZmbmVzczogMzAsXG4gICAgICBkYW1waW5nOiA1MCxcbiAgICAgIG1hc3M6IDEwLFxuICAgIH0sXG4gICAgZnVuY3Rpb24oeCkge1xuICAgICAgc3BpZGVyLnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGVZKCR7eC5vdXRwdXR9cHgpYDtcbiAgICB9XG4gICk7XG5cbiAgY29uc3Qgc3BpZGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5zcGlkZXJcIik7XG4gIGNvbnN0IHNwaWRlckFyZWEgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnNlY3Rpb24tLWV4YW1wbGUtc3BpZGVyXCIpO1xuXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwic2Nyb2xsXCIsICgpID0+IHtcbiAgICBzcHJpbmd5U3BpZGVyLnguaW5wdXQgPVxuICAgICAgd2luZG93LnNjcm9sbFkgLSBzcGlkZXJBcmVhLm9mZnNldFRvcCArIHdpbmRvdy5pbm5lckhlaWdodCAqIDAuNTtcbiAgICBzcHJpbmd5U3BpZGVyLmFuaW1hdGUoKTtcbiAgfSk7XG59XG4iLCJpbXBvcnQgU3ByaW5naWZ5IGZyb20gXCIuLi8uLi9kaXN0L3NwcmluZ2lmeS5lc20uanNcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XG4gIGNvbnN0IHNwcmluZ3lIZWxpY29wdGVyID0gbmV3IFNwcmluZ2lmeShcbiAgICB7XG4gICAgICBwcm9wTmFtZTogXCJ4XCIsXG4gICAgfSxcbiAgICB7XG4gICAgICBwcm9wTmFtZTogXCJ5XCIsXG4gICAgfSxcbiAgICBmdW5jdGlvbih4LCB5KSB7XG4gICAgICBoZWxpY29wdGVyLnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGUoJHt4Lm91dHB1dH1weCwgJHtcbiAgICAgICAgeS5vdXRwdXRcbiAgICAgIH1weCkgcm90YXRlKCR7eC52ZWxvY2l0eSAqIDAuMDV9ZGVnKWA7XG4gICAgfVxuICApO1xuXG4gIGNvbnN0IGhlbGljb3B0ZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmhlbGljb3B0ZXJcIik7XG4gIGNvbnN0IGhlbGljb3B0ZXJEZW1vID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5zZWN0aW9uLS1leGFtcGxlLWhlbGljb3B0ZXJcIik7XG5cbiAgY29uc3QgaGVsaWNvcHRlck1vdmUgPSAoZSkgPT4ge1xuICAgIC8vIG5vcm1hbGl6ZSB0aGUgbW91c2UgY29vcmRpbmF0ZXMgdG8gdGhlIGhlbGljb3B0ZXIgZGVtbyBhcmVhXG4gICAgY29uc3QgaGVsaWNvcHRlckRlbW9SZWN0ID0gaGVsaWNvcHRlckRlbW8uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3QgcmVsYXRpdmVYID1cbiAgICAgIGUuY2xpZW50WCAtIChoZWxpY29wdGVyRGVtb1JlY3QubGVmdCArIGhlbGljb3B0ZXJEZW1vUmVjdC53aWR0aCAqIDAuNSk7XG5cbiAgICBjb25zdCByZWxhdGl2ZVkgPVxuICAgICAgZS5jbGllbnRZIC0gKGhlbGljb3B0ZXJEZW1vUmVjdC50b3AgKyBoZWxpY29wdGVyRGVtb1JlY3QuaGVpZ2h0ICogMC41KTtcblxuICAgIC8vIFNlbmQgb3VyIHVwZGF0ZWQgdmFsdWVzIGFzIHRoZSBpbnB1dHMgdG8gdGhlIHNwcmluZ1xuICAgIHNwcmluZ3lIZWxpY29wdGVyLnguaW5wdXQgPSByZWxhdGl2ZVg7XG4gICAgc3ByaW5neUhlbGljb3B0ZXIueS5pbnB1dCA9IHJlbGF0aXZlWTtcblxuICAgIC8vIFN0YXJ0IHRoZSBhbmltYXRpb25cbiAgICBzcHJpbmd5SGVsaWNvcHRlci5hbmltYXRlKCk7XG4gIH07XG5cbiAgaGVsaWNvcHRlckRlbW8uYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBlID0+IGhlbGljb3B0ZXJNb3ZlKGUpKTtcbiAgaGVsaWNvcHRlckRlbW8uYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoc3RhcnRcIiwgZSA9PiBoZWxpY29wdGVyTW92ZShlKSk7XG59XG4iLCJpbXBvcnQgJ3ByaXNtanMnO1xuXG5pbXBvcnQgU3ByaW5naWZ5IGZyb20gXCIuLi8uLi9kaXN0L3NwcmluZ2lmeS5lc20uanNcIjtcblxuaW1wb3J0IHNhaWxib2F0RGVtbyBmcm9tIFwiLi9zYWlsYm9hdERlbW8uanNcIjtcbmltcG9ydCBzcGlkZXJEZW1vIGZyb20gXCIuL3NwaWRlckRlbW8uanNcIjtcbmltcG9ydCBoZWxpRGVtbyBmcm9tIFwiLi9oZWxpRGVtby5qc1wiO1xuXG5oZWxpRGVtbygpO1xuc2FpbGJvYXREZW1vKCk7XG5zcGlkZXJEZW1vKCk7XG5cblxuXG5cblxuXG5cbmNvbnN0IHNpZ21vaWQgPSB4ID0+IHggLyAoMSArIE1hdGguYWJzKHggKiAwLjAxKSk7XG4iXSwibmFtZXMiOlsiYXJndW1lbnRzIiwiY29uc3QiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Q0FLQSxJQUFJLEtBQUssR0FBRyxDQUFDLE9BQU8sTUFBTSxLQUFLLFdBQVc7SUFDdkMsTUFBTTs7R0FFUCxDQUFDLE9BQU8saUJBQWlCLEtBQUssV0FBVyxJQUFJLElBQUksWUFBWSxpQkFBaUI7S0FDNUUsSUFBSTtLQUNKLEVBQUU7R0FDSixDQUFDOzs7Ozs7OztDQVFILElBQUksS0FBSyxHQUFHLENBQUMsVUFBVSxLQUFLLENBQUM7OztDQUc3QixJQUFJLElBQUksR0FBRyw2QkFBNkIsQ0FBQztDQUN6QyxJQUFJLFFBQVEsR0FBRyxDQUFDLENBQUM7O0NBRWpCLElBQUksQ0FBQyxHQUFHO0VBQ1AsTUFBTSxFQUFFLEtBQUssQ0FBQyxLQUFLLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNO0VBQ3pDLDJCQUEyQixFQUFFLEtB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QyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FB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
