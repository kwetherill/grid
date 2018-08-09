
window.grid = (function(){
	console.log("window.grid");

	// members
	var resizers = [],
		delayers = [],
		starters = [],
		stoppers = [],
		

		// PHONE: 320x568, TABLET: 768x1024, DESKTOP: 1280 - 1440
		breaks = {xs: 400, sm: 500, md: 600, lg: 800, xl: 1100, xxl: 1400},
		breaks1 = {},
		maxwidth,
		htmltag,

		// init
		init = function(){
			
			var clock, intclock, w, h, calledint,
				// handlers
				onInterval = function(){
					calledint = true; // mark as called
					for(var i=0; i<delayers.length; i++) delayers[i](w, h);
				},
				onStart = function(){
					calledint = false; // reset to false
					if(intclock) clearTimeout(intclock);
					intclock = setInterval(onInterval, 400);
					for(var i=0; i<starters.length; i++) starters[i](w, h);
				},
				onStop = function(){
					if(!calledint) onInterval(); // did it get called?
					intclock = clearTimeout(intclock);
					clock = clearTimeout(clock);
					for(var i=0; i<stoppers.length; i++) stoppers[i](w, h);
				},
				onMove = function(obj){
					obj = (obj.srcElement || obj.currentTarget);
			        h = obj.innerHeight;
			        w = obj.innerWidth;

			        if(clock) clearTimeout(clock);
			        else onStart();
			        clock = setTimeout(onStop, 500);

			        for(var i=0; i<resizers.length; i++) resizers[i](w, h);

				};

			// add resize handler
			if(window.attachEvent) window.attachEvent('onresize', onMove);
			else if(window.addEventListener) window.addEventListener('resize', onMove);

			// get html tag
			htmltag = document.getElementsByTagName("html")[0];

			// break points
			for(var item in breaks) maxwidth = breaks1["grid-" + item] = breaks[item];
			//for(var item in breaks) breaks1["grid-" + item] = breaks2["grid-" + item] = breaks[item];
			//breaks2["grid-xl"] = true;

			// update on resize?
			on("resizedelay", update);

			// init update
			//console.log("TESTING");
			update();
		},

		getValue = function(dom){
			// --- WIP
			if(!dom) dom = htmltag;

			var value = false,
				width = dom.innerWidth;

			if(width <= maxwidth){
				for(var item in breaks1){
					if(width <= breaks1[item]) value = item;
				}
			}

			return value;
		},

		// event handle
		on = function(event, func){
			switch(event){
				case "resize": resizers.push(func); break;
				case "resizestart": starters.push(func); break;
				case "resizestop": stoppers.push(func); break;
				case "resizedelay": delayers.push(func); break;
			}
		},

		// internal
		helper = function(element, container){
			var width = container ? element.offsetWidth : window.innerWidth,
				classes = element.className.split(" "),
				newparts = [];

			//console.log("++++++++++++ YOOO 222: " + element.className);

			// remove classes
			if(classes.length > 1){
				for(var i=0; i<classes.length; i++){
					var c = classes[i];
					if(!breaks1[c]) newparts.push(c);
				}
			}

			// add classes
			if(width <= maxwidth){
				for(var item in breaks1){
					if(width <= breaks1[item]) newparts.push(item);
				}
			}

			// make classname
			element.className = newparts.join(" ");
		},

		updateMain = function(){
			helper(htmltag);
		},

		update = function(){
			helper(htmltag);
			var divs = document.getElementsByClassName("grid-container");
			for(var i=0; i<divs.length; i++) helper(divs[i], true);
		},

		END = 0;

	// initiate
	init();

	// public members
	return {
		value: getValue, // keep like this
		update: update,
		updateMain: updateMain,
		on: on
	}


})();


// requirejs module
if(window["define"]) define([], function(){return window.grid;});



