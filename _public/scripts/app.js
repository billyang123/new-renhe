(function() {
  'use strict';

  var globals = typeof window === 'undefined' ? global : window;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var has = ({}).hasOwnProperty;

  var aliases = {};

  var endsWith = function(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
  };

  var unalias = function(alias, loaderPath) {
    var start = 0;
    if (loaderPath) {
      if (loaderPath.indexOf('components/' === 0)) {
        start = 'components/'.length;
      }
      if (loaderPath.indexOf('/', start) > 0) {
        loaderPath = loaderPath.substring(start, loaderPath.indexOf('/', start));
      }
    }
    var result = aliases[alias + '/index.js'] || aliases[loaderPath + '/deps/' + alias + '/index.js'];
    if (result) {
      return 'components/' + result.substring(0, result.length - '.js'.length);
    }
    return alias;
  };

  var expand = (function() {
    var reg = /^\.\.?(\/|$)/;
    return function(root, name) {
      var results = [], parts, part;
      parts = (reg.test(name) ? root + '/' + name : name).split('/');
      for (var i = 0, length = parts.length; i < length; i++) {
        part = parts[i];
        if (part === '..') {
          results.pop();
        } else if (part !== '.' && part !== '') {
          results.push(part);
        }
      }
      return results.join('/');
    };
  })();
  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var require = function(name, loaderPath) {
    var path = expand(name, '.');
    if (loaderPath == null) loaderPath = '/';
    path = unalias(name, loaderPath);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has.call(cache, dirIndex)) return cache[dirIndex].exports;
    if (has.call(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '" from '+ '"' + loaderPath + '"');
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  require.register = require.define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  require.list = function() {
    var result = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        result.push(item);
      }
    }
    return result;
  };

  require.brunch = true;
  globals.require = require;
})();
require.register("scripts/picshow", function(exports, require, module) {
(function($){
	var source   = $("#showpic-template").html();
	var template = Handlebars.compile(source); 
	var picShowFn = function(element, useroptions){
        var obj = this;
	    useroptions = (useroptions === undefined) ? {} : useroptions;
	    var options = $.extend({
           element: element
        }, useroptions);
        obj.Enode = $(options.element);
        obj.showPicBox = obj.Enode.siblings('[node-type="showPicBox"]');
        obj.Direction = 'smallcursor';
        obj.init = function() {    	
        	obj.Enode.find('a').click(function(){obj.toBig()})

        }
        obj.tosmall = function(){
        	obj.showPicBox.empty();
        	obj.Enode.show();
        }
        obj.toBig = function(){
        	obj.Enode.hide();
        	obj.showPicBox.html(template()).show().find('[action-type="tosmall"]').click(function(){obj.tosmall()});
        	obj.mouseInit(obj.showPicBox.find('[node-type="picShow"]'));
        }
        obj.mouseInit = function(el){
        	
        	el.on("mousemove",function(e){
        		if((e.pageX-el.offset().left)<Math.floor(el.width()/3)){
        			el.removeClass('smallcursor').removeClass('rightcursor').addClass('leftcursor');
        			obj.Direction = 'leftcursor';
        		}else if((e.pageX-el.offset().left)>Math.floor(el.width()*2/3)){
        			el.removeClass('leftcursor').removeClass('smallcursor').addClass('rightcursor');
        			obj.Direction = 'rightcursor';
        		}else{ 
        			el.removeClass('leftcursor').removeClass('rightcursor').addClass('smallcursor');
        			obj.Direction = 'smallcursor';
        		//console.log((e.pageX-el.offset().left) + ", " + (e.pageY-el.offset().top))
        		}
        	})
        	el.click(function(e){
        		if(obj.Direction == 'smallcursor'){
        			obj.tosmall();
        		}
        	})
        }
    }
    $.fn.picShow = function(options){
        return this.each(function(){
            var element = $(this);

            // Return early if this element already has a plugin instance
            if (element.data('picShow')) return;

            // Pass options and element to the plugin constructer
            var picShow = new picShowFn(this, options);
            picShow.init();
            // Store the plugin object in this element's data
            element.data('picShow', picShow);
        });
    }
    $('[node-type="feed_list_media_prev"]').picShow()
})(jQuery);
});

require.register("scripts/test", function(exports, require, module) {
var a = 1234
});

;require.register("scripts/widget/jquery-emotion", function(exports, require, module) {
/*!
 * jQuery Sina Emotion v2.1.0
 * http://www.clanfei.com/
 *
 * Copyright 2012-2014 Lanfei
 * Released under the MIT license
 *
 * Date: 2014-05-19T20:10:23+0800
 */
(function($) {

	var $target;

	var options;

	var emotions;

	var categories;

	var emotionsMap;

	var parsingArray = [];

	var defCategory = '默认';

	var initEvents = function() {
		$('body').bind({
			click: function() {
				$('#sinaEmotion').hide();
			}
		});

		$('#sinaEmotion').bind({
			click: function(event) {
				event.stopPropagation();
			}
		}).delegate('.prev', {
			click: function(event) {
				var page = $('#sinaEmotion .categories').data('page');
				showCatPage(page - 1);
				event.preventDefault();
			}
		}).delegate('.next', {
			click: function(event) {
				var page = $('#sinaEmotion .categories').data('page');
				showCatPage(page + 1);
				event.preventDefault();
			}
		}).delegate('.category', {
			click: function(event) {
				$('#sinaEmotion .categories .current').removeClass('current');
				showCategory($.trim($(this).addClass('current').text()));
				event.preventDefault();
			}
		}).delegate('.page', {
			click: function(event) {
				$('#sinaEmotion .pages .current').removeClass('current');
				var page = parseInt($(this).addClass('current').text() - 1);
				showFacePage(page);
				event.preventDefault();
			}
		}).delegate('.face', {
			click: function(event) {
				//$('#sinaEmotion').hide();
				$target.insertText($(this).children('img').prop('alt'));
				event.preventDefault();
			}
		});
	};

	var loadEmotions = function(callback) {

		if(emotions){
			callback && callback();
			return;
		}

		if (!options) {
			options = $.fn.sinaEmotion.options;
		}

		emotions = {};
		categories = [];
		emotionsMap = {};

		$('body').append('<div id="sinaEmotion">正在加载，请稍后...</div>');

		initEvents();

		$.getJSON('https://api.weibo.com/2/emotions.json?callback=?', {
			source: options.appKey,
			language: options.language
		}, function(json) {

			var item, category;
			var data = json.data;

			$('#sinaEmotion').html('<div class="right"><a href="#" class="prev">&laquo;</a><a href="#" class="next">&raquo;</a></div><ul class="categories"></ul><ul class="faces"></ul><ul class="pages"></ul>');

			for (var i = 0, l = data.length; i < l; ++i) {
				item = data[i];
				category = item.category || defCategory;

				if (!emotions[category]) {
					emotions[category] = [];
					categories.push(category);
				}

				emotions[category].push({
					icon: item.icon,
					phrase: item.phrase
				});

				emotionsMap[item.phrase] = item.icon;
			}

			$(parsingArray).parseEmotion();
			parsingArray = null;

			callback && callback();
		});
	};

	var showCatPage = function(page) {

		var html = '';
		var length = categories.length;
		var maxPage = Math.ceil(length / 5);
		var $categories = $('#sinaEmotion .categories');
		var category = $categories.data('category') || defCategory;

		page = (page + maxPage) % maxPage;

		for (var i = page * 5; i < length && i < (page + 1) * 5; ++i) {
			html += '<li class="item"><a href="#" class="category' + (category == categories[i] ? ' current' : '') + '">' + categories[i] + '</a></li>';
		}

		$categories.data('page', page).html(html);
	};

	var showCategory = function(category) {
		$('#sinaEmotion .categories').data('category', category);
		showFacePage(0);
		showPages();
	};

	var showFacePage = function(page) {

		var face;
		var html = '';
		var pageHtml = '';
		var rows = options.rows;
		var category = $('#sinaEmotion .categories').data('category');
		var faces = emotions[category];
		page = page || 0;

		for (var i = page * rows, l = faces.length; i < l && i < (page + 1) * rows; ++i) {
			face = faces[i];
			html += '<li class="item"><a href="#" class="face"><img class="sina-emotion" src="' + face.icon + '" alt="' + face.phrase + '" /></a></li>';
		}

		$('#sinaEmotion .faces').html(html);
	};

	var showPages = function() {

		var html = '';
		var rows = options.rows;
		var category = $('#sinaEmotion .categories').data('category');
		var faces = emotions[category];
		var length = faces.length;

		if (length > rows) {
			for (var i = 0, l = Math.ceil(length / rows); i < l; ++i) {
				html += '<li class="item"><a href="#" class="page' + (i == 0 ? ' current' : '') + '">' + (i + 1) + '</a></li>';
			}
			$('#sinaEmotion .pages').html(html).show();
		} else {
			$('#sinaEmotion .pages').hide();
		}
	};

	/**
	 * 为某个元素设置点击事件，点击弹出表情选择窗口
	 * @param  {[type]} target [description]
	 * @return {[type]}        [description]
	 */
	$.fn.sinaEmotion = function(target) {

		target = target || function(){
			return $(this).parents('form').find('textarea,input[type=text]').eq(0);
		};

		var $that = $(this).last();
		var offset = $that.offset();

		if($that.is(':visible')){
			if(typeof target == 'function'){
				$target = target.call($that);
			}else{
				$target = $(target);
			}

			loadEmotions(function(){
				showCategory(defCategory);
				showCatPage(0);
			});
			$('#sinaEmotion').css({
				top: offset.top + $that.outerHeight() + 5,
				left: offset.left
			}).show();
		}

		return this;
	};

	$.fn.parseEmotion = function() {

		if(! categories){
			parsingArray = $(this);
			loadEmotions();
		}else if(categories.length == 0){
			parsingArray = parsingArray.add($(this));
		}else{
			$(this).each(function() {

				var $this = $(this);
				var html = $this.html();

				html = html.replace(/<.*?>/g, function($1) {
					$1 = $1.replace('[', '&#91;');
					$1 = $1.replace(']', '&#93;');
					return $1;
				}).replace(/\[[^\[\]]*?\]/g, function($1) {
					var url = emotionsMap[$1];
					if (url) {
						return '<img class="sina-emotion" src="' + url + '" alt="' + $1 + '" />';
					}
					return $1;
				});

				$this.html(html);
			});
		}

		return this;
	};

	$.fn.insertText = function(text) {

		this.each(function() {

			if (this.tagName !== 'INPUT' && this.tagName !== 'TEXTAREA') {
				return;
			}
			if (document.selection) {
				this.focus();
				var cr = document.selection.createRange();
				cr.text = text;
				cr.collapse();
				cr.select();
			} else if (this.selectionStart !== undefined) {
				var start = this.selectionStart;
				var end = this.selectionEnd;
				this.value = this.value.substring(0, start) + text + this.value.substring(end, this.value.length);
				this.selectionStart = this.selectionEnd = start + text.length;
			} else {
				this.value += text;
			}
		});

		return this;
	}

	$.fn.sinaEmotion.options = {
		rows: 72,				// 每页显示的表情数
		language: 'cnname',		// 简体（cnname）、繁体（twname）
		appKey: '1362404091'	// 新浪微博开放平台的应用ID
	};
})(jQuery);
});


//# sourceMappingURL=app.js.map