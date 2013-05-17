(function(){
	var a = function() {
		
		var inc = this;
		
		//standardized __SCRIPTS__,__FILE__ and __DIR__ references
		var __STATUS__ = [],
			__SCRIPTS__ = document.getElementsByTagName('script');
		
		
		//test dom status, or alternatively set this to true to force scripts to load
		inc['ready'] = function(){ return !/in/.test(document.readyState);};
		
		//allow status checks
		inc['status'] = function(f) { if(!f) return __STATUS__; var a = __STATUS__.length; while(a--){ if( __STATUS__[a]['s'] == f) return __STATUS__[a]['m'];} };
		
		
		//check if a script exists in the __STATUS__ array
		function getS(s) {
			var a = __STATUS__.length;
			while(a--){
				if( __STATUS__[a]['s'] == a)
					return __STATUS__[a];
			}
			return false;
		};
	
		//return the given url with a fixed protocol to keep pages secure
		function urlprotocol(f) {
			if( !f.indexOf('http:') )
				return f;
			return f.replace('http:','https:');
		};
		
		//whether we're ready to run a callback
		var isReady = function(f) {
			var num = f['d'].length, ready = true;	
			while( num-- ) {
				if( !window.hasOwnProperty( f['d'][num] ) )
					ready = false;
				}
			return ready;
		};
		
		var getByGlobal = function(g) {
			var a = __STATUS__.length;
			while(a--){
				if( __STATUS__[a]['g'] == g)
					return __STATUS__[a];
			}
			return false;
		};
		
		//waits to load until dependencies are loaded		
		var loadWhenReady = function(f){
			
			if( !f['d'])
				load(f);
			else {
				
				//setting it to script onload turned out problematic
				var TO = function(){ if( isReady(f) ) load(f); else setTimeout( (function(){ TO(); }), 20);};
				TO();
					}
		};
		
		
		//load script
		var load = function(f) {
			if( window.hasOwnProperty(f['g']) )
				f['m'] += "PRE-EXISTING";
			else {
				var s = document.createElement('script');
				s.type = 'text/javascript';
				s.async = true;
				s.src = urlprotocol(f['s']);
				__SCRIPTS__[0].parentNode.insertBefore(s,__SCRIPTS__[0]);
				f['m'] += ' LOADING';
				s.onload= (function(){ f['m'] += ' OK'; if( !!f['c'] ) f['c'](); });
			}
		};
		
		var loadCSS = function(f) {
			var s = document.createElement('link');
			s.type='text/css';
			s.rel='stylesheet';
			s.href=urlprotocol(f['s']);
			__SCRIPTS__[0].parentNode.insertBefore(s,__SCRIPTS__[0]);
			f['m'] += ' LOADING';
			s.onload= function(){ f['m'] += ' OK'; if( !! f['c'] ) f['c'](); };
		};
		
		//push unique script's to __status__
		var push = function(f,c,b,d,e) {
			var s = getS(f);
			if( !s && (d == 'css' || !window.hasOwnProperty(b)) ) {
				__STATUS__.push({ 's' : f, 'm' : 'WAITING', 'c' : c , 'g' : b , 't' : d , 'd' : e });
				if( inc['ready']() ) { 
					if( d == 'js' ) load(getS(f));
					else loadCSS(getS(f));
				}
			}
			else
				if(s) s['m'] += " REJECTED";
		};
		
		
		//add preloaded scripts to status object
		var index = __SCRIPTS__.length;
		while(index--) {
			if( __SCRIPTS__[index]['src'] != '' && !getS(__SCRIPTS__[index]['src']) ) {
				push( __SCRIPTS__[index]['src'], false, '', 'js',false );
				(getS(__SCRIPTS__[index]['src']))['m'] = 'PRE-EXISTING';
				}
		}
		
		
		
		//our collection function for adding scripts to the loader
		inc['include'] = function(f,c,b,d,e) {
			if(Object.prototype.toString.call(f) == '[object Array]') {
				var a = f.length;
				for(var o=0;o<a;o++)
					push(f[o][0],f[o][1],f[o][2],f[o][3],f[o][4]);
					
			}
			else
				push(f,c,b,d,e);
		};
	
		//document ready callback: see http://dustindiaz.com/smallest-domready-ever , alternative is comment #217 here http://dean.edwards.name/weblog/2006/06/again/#comment367184 
		function r(f){ !inc['ready']()?setTimeout((function(){ r(f); }),15):f()};
	
		//load everything once the page is ready	
		r( (function(){
			var length = __STATUS__.length;
			for(i = 0; i < length; i++) {
				if( __STATUS__[i]['m'].indexOf('LOADING') === -1 ) {
					if(__STATUS__[i]['t'] == 'js')	loadWhenReady(__STATUS__[i]);
					else	loadCSS(__STATUS__[i]);
					}
				}
			}) );
	
	};
	window['asyncInclude'] = new a();
})();
