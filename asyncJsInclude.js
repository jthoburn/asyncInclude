window['asyncInclude'] = new function() {
		
		var inc = this;
		
		//standardized __SCRIPTS__,__FILE__ and __DIR__ references
		var __STATUS__ = [],
			__SCRIPTS__ = document.getElementsByTagName('script');
		
		/*
			functions/vars for use as an included file or own file when you need location vars
			
			var dirname = function(path) {
   				return path.replace(/\\/g,'/').replace(/\/[^\/]*$/, '');
			};
			
			//make a link absolute v. relative
			var justify = function(path) {
				var count = (path.match(/\.\.\//g)||[]).length, base = inc['__DIR__'];
				if( count ) {
					while( count-- )
						base = dirname(base);
					return base + '/' + path.replace(/\.\.\//g,'');
				}
				return path;
			}
			
			//included file
			inc['__DIR__'] = dirname( inc['__FILE__'] = __SCRIPTS__[__SCRIPTS__.length-1].src )) + '/';
			
			//embeded script
			inc['__DIR__'] = dirname( inc['__FILE__'] = window.location.href ) + '/';
		*/
		
		//test dom status, or alternatively set this to true to force scripts to load
		inc['ready'] = function(){ return !/in/.test(document.readyState);};
		
		//allow status checks
		inc['status'] = function(f) { if(!f) return __STATUS__; var a = __STATUS__.length; while(a--){ if( __STATUS__[a]['src'] == f) return __STATUS__[a]['status'];} };
		
		//check if a global is defined
		function defined(v) {
			return window.hasOwnProperty(v);
		};
		
		//check if a script exists in the __STATUS__ array
		function get(s) {
			var a = __STATUS__.length;
			while(a--){
				if( __STATUS__[a]['src'] == a)
					return __STATUS__[a];
			}
			return false;
		};
	
		//return the given url with a fixed protocol to keep pages secure
		function urlprotocol(f) {
			if(! f.indexOf('http:') )
				return f;
			return f.replace('http:','https:');
		};
		
		//whether we're ready to run a callback
		var isReady = function(f) {
			var num = f.dependencies.length, ready = true;	
			while( num-- ) {
				if( !window.hasOwnProperty( f.dependencies[num] ) )
					ready = false;
				}
			return ready;
		};
		
		var getByGlobal = function(g) {
			var a = __STATUS__.length;
			while(a--){
				if( __STATUS__[a].global == g)
					return __STATUS__[a];
			}
			return false;
		};
		
		var loadWhenReady = function(f){
			var num = f.dependencies.length,ref;
			
			while( num-- ) {
				if( !window.hasOwnProperty( f.dependencies[num] ) ) {
					if(ref = getByGlobal(f.dependencies[num]) ) {
						if( !!ref.callback )
							ref.callback = (function(){ ref.callback(); if( isReady(f) ) f.callback(); });
						else
							ref.callback = (function(){ if( isReady(f) ) f.callback(); });
						}
					else {
						var TO = function(){isReady(f)?f.callback():setTimeout( (function(){ TO(); }), 15);};
						TO();
					}
				}
			}
					
		};
		
		//load script
		var load = function(f) {
			if( defined(f.global) )
				f['status'] += "PRE-EXISTING";
			else {
				var s = document.createElement('script');
				s.type = 'text/javascript';
				s.async = true;
				s.src = urlprotocol(f['src']);
				__SCRIPTS__[0].parentNode.insertBefore(s,__SCRIPTS__[0]);
				f['status'] += ' LOADING';
				s.onload= function(){ f['status'] += ' OK'; if( !!f['callback'] ) !f['dependencies']?f['callback']():loadWhenReady(f); };
			}
		};
		
		var loadCSS = function(f) {
			var s = document.createElement('link');
			s.type='text/css';
			s.rel='stylesheet';
			s.href=urlprotocol(f['src']);
			__SCRIPTS__[0].parentNode.insertBefore(s,__SCRIPTS__[0]);
			f['status'] += ' LOADING';
			s.onload= function(){ f['status'] += ' OK'; if( !! f.callback ) f.callback(); };
		};
		
		//push unique script's to __status__
		var push = function(f,c,b,d,e) {
			var s = get(f);
			if( !s && (d == 'css' || !defined(b)) ) {
				__STATUS__.push({ 'src' : f, 'status' : 'WAITING', 'callback' : c , 'global' : b , 'type' : d , 'dependencies' : e });
				if( inc['ready']() ) { 
					if( d == 'js' ) load(get(f));
					else loadCSS(get(f));
				}
			}
			else
				if(s) s['status'] += " REJECTED";
		};
		
		
		//add preloaded scripts to status object
		var index = __SCRIPTS__.length;
		while(index--) {
			if( __SCRIPTS__[index]['src'] != '' && !get(__SCRIPTS__[index]['src']) ) {
				push( __SCRIPTS__[index]['src'], false, '', 'js',false );
				(get(__SCRIPTS__[index]['src']))['status'] = 'PRE-EXISTING';
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
				if( __STATUS__[i]['status'].indexOf('LOADING') === -1 ) {
					if(__STATUS__[i].type == 'js')	load(__STATUS__[i]);
					else	loadCSS(__STATUS__[i]);
					}
				}
			}) );
	
	};
