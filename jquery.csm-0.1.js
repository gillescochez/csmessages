/*!
 * cs messages 0.1
 *    - http://csmessages.codeserenity.com/
 *
 * Copyright 2010, Gilles Cochez
 * Dual licensed under the MIT and GPL licenses.
 *    - http://www.opensource.org/licenses/mit-license.php
 *    - http://www.gnu.org/copyleft/gpl.html
 */

// bof closure
;(function($)
{
	// variables
	var
		reg = /(csm {(.*)})/, // regex to find element specific options
		x = {}, // plugin methods
		t; // global timeout
	
	// declaration
	x = $.fn.csm = function(o)
	{
		// overwrite defaults with passed options
		o = $.extend({}, $.fn.csm.defaults, o);
		
		// go through the set of elements
		$(this).each(function()
		{
			// reduce this )reduce footprint)
			var e = this;
			
			// sort element options (global if none found)
			e.eo = x.eo(e.className, o) || o;
			
			// close option?
			if (e.eo.close) x[e.eo.close](e);
			
			// flash option?
			if (e.eo.pulse) {
				x.pulse(e);
				$(e).bind('mouseover mouseout', function() { x.pulse(e); });
			};
		});
		
		// allow chainability
		return this;
	};
	
	// extend our method object
	$.extend(x,
	{
		// manual handling of close
		manual: function(e) {
			$('<a>').addClass('csm_close').click(function() { x.close(e); }).text(e.eo.label || '').appendTo(e);
		},
		
		// automatic handling of close
		auto: function(e) {
			e.t = setTimeout(function() { x.close(e); }, e.eo.delay);
		},
		
		// both manual and automatic handle of close
		both: function(e) {
			x.manual(e);
			x.auto(e);
		},
		
		// close the message box
		close: function(e) {
			$(e).unbind('mouseover mouseout');
			if (e.t) clearTimeout(e.t);
			if (e.eo.fx) $(e)[e.eo.fx](e.eo.speed, function(){ x.die(e); });
			else x.die(e);
		},
		
		// last function call (more stuff to come here)
		die: function(e) {
			$(e).remove();
		},
		
		// make the message box pulse (opacity)
		pulse: function(e) {
			if (!e.pulse) {
				e.pulse = true;
				x.fade(e);
			} else {
				e.pulse = false;
				$(e).stop().css('opacity', 1);
			};
		},
		
		// fade in/out the message box
		fade: function(e) {
			if (!e.op) e.op = 1;
			else e.op = 0;			
			$(e).fadeTo(e.eo.speed, e.op, function() { x.fade(e); });
		},
		
		// check and generate element specific options
		eo: function(str, o)
		{			
			// regex lookup / grab
			var l = reg.exec(str);
			
			// continue?
			if (l)
			{
				// clean l[0] up
				l[0] = l[0].replace(/csm /,'');
				l[0] = l[0].substr(1,l[0].length-2);
				
				// holding string / split in case of multiple settings
				var json = '', m = l[0].split(',');
				
				// loop through results
				$.each(m, function(i)
				{
					// regex lookup / grab
					var n = /(.*):(.*)/.exec(m[i]);
					
					// if data build and return
					if (n) json += '"'+n[1]+'":"'+n[2]+'"';
					if (m[i+1]) json += ',';
				});
				
				// if we are here nothing was found return false
				return $.extend({}, o, $.parseJSON('{'+json+'}'));
			}
			else return false;
		}
	});
	
	// default settings
	$.fn.csm.defaults = 
	{
		delay: 5000, // time (in milliseconds) to display the message before closing it
		speed: 400, // close animation speed in milliseconds
		fx: false, // fx to use on close ((string) fadeOut | (string) slideUp | (boolean) false)
		label: '', // close button text label uf any required
		close: 'manual', // (string) manual | (string) auto | (string) both | (boolean) false - set how to handle "close" functionality if at all
		pulse: false, // enable|disable the fading pulsate effect of messages
	};
	
// eof closure
})(jQuery);