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