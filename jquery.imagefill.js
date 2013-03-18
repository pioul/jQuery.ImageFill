/*
 * jQuery Image Fill
 * http://pioul.fr/jquery-imagefill
 *
 * Copyright 2013, Philippe Masset
 * Dual licensed under the MIT or GPL Version 2 licenses
 */
(function($){
	$.fn.imagefill = function(options){
	
		// options
		options = $.extend(
			{},
			// default options
			{
				container: null, // CSS selector if the container isn't the image's immediate parent (ie '.container')
				fadingDuration: 500, // number|0; when greater than 0, images will load hidden, then fade in over the specified duration
			},
			options
		);
	
		var t = $(this);
		t.each(function(){
			
			var t = $(this),
				data = {
					// vars
					options: options,
					image: t,
					container: options.container? t.closest(options.container) : t.parent(),
					// initialization stuff
					init: function(){
						// set needed CSS properties on the container and the image
						this.container.css('overflow', 'hidden');
						this.image.css('position', 'relative');
					},
					// show the image
					show: function(){
						if(this.options.fadingDuration){
							this.image.fadeIn(this.options.fadingDuration);
						} else {
							this.image.show();
						}
					},
					// fill the container
					fillContainer: function(){
						var containerWidth = this.container.width(),
							containerHeight = this.container.height(),
							imageWidth = this.image.width(),
							imageHeight = this.image.height(),
							widthRatio = imageWidth / containerWidth,
							heightRatio = imageHeight / containerHeight;
						
						if(widthRatio < heightRatio){
							var newImageProperties = {
								width: containerWidth,
								height: imageHeight / widthRatio
							};
							newImageProperties.top = - (newImageProperties.height - containerHeight) / 2;
						} else {
							var newImageProperties = {
								width: imageWidth / heightRatio,
								height: containerHeight
							};
							newImageProperties.left = - (newImageProperties.width - containerWidth) / 2;
						}
						
						this.image
							.css(newImageProperties)
							.trigger("fillsContainer", [newImageProperties]);
					}
				};
			
			// save data into the DOM
			data.image.data("imagefill", data);
			
			// only execute jQuery.imagefill if the image has a container
			if(data.container.length){
				data.init();
				// if the image is already loaded (jQuery.imagefill executed late, or cached image)
				if(data.image[0].complete){
					// fill its container
					setTimeout($.proxy(function(){
						this.fillContainer();
					}, data), 0);
				// if the image hasn't finished loading yet
				} else {
					// hide the image before / when it's loading
					data.image.hide();
					// execute jQuery.imagefill when the image has finished loading
					data.image.bind("load", function(){
						var data = $(this).data("imagefill");
						// show the image when it has finished loading
						data.show();
						// fill its container
						data.fillContainer();
					});
				}
			}
			
		});
		return t;
		
	};
})(jQuery);