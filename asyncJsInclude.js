	
	window['asyncInclude'] = new function() {
		
		var inc = this;
		
		//standardized __SCRIPTS__,__FILE__ and __DIR__ references
		var __STATUS__ = {},
			__SCRIPTS__ = document.getElementsByTagName('script');
			
		inc['__DIR__'] = ( inc['__FILE__'] = __SCRIPTS__[__SCRIPTS__.length-1].src ).split('?')[0].split('/').slice(0, -1).join('/') + '/';
		
		//add preloaded scripts to status object
		var index = __SCRIPTS__.length;
		while(index--) {
			if( !__STATUS__.hasOwnProperty(__SCRIPTS__[index].src) )
				__STATUS__[__SCRIPTS__[index].src] = { 'status': 'PREVIOUSLY LOADED' , callback : false};
		}
		
		//test dom status, or alternatively set this to true to force scripts to load
		inc['ready'] = function(){ return !/in/.test(document.readyState);};
		
		//allow status checks
		inc['status'] = function(f) { if(!f) return __STATUS__; return __STATUS__[urlprotocol(f)]['status']; };
		
		//check if a variable is defined
		function defined(v) {
			try { v; }
			catch(e) {
				return false;
			}
			return !(null == v && null !== v);
		};
	
		//check is a script's source is present or has previously been requested with .include()
		function initiated(s) {
			if(__STATUS__.hasOwnProperty( urlprotocol(s) ) )
				return true;
			var index = __SCRIPTS__.length;
			while(index--) {
				if(__SCRIPTS__[index].src = s)
					return true;
				}
			return false;
		};
	
		//return the given url with a fixed protocol to keep pages secure
		function urlprotocol(f) {
			if(! f.indexOf('http:') )
				return f;
			return f.replace('http:','https:');
		};
		
		//load script
		function load(f) {
			if(defined(__STATUS__[f].global))
				__STATUS__[f]['status'] += "PRE-EXISTING";
			else {
				var s = document.createElement('script');
				s.type = 'text/javascript';
				s.async = true;
				s.src = f;
				__SCRIPTS__[0].parentNode.insertBefore(s,__SCRIPTS__[0]);
				__SCRIPTS__.push(s);
				__STATUS__[f]['status'] += ' LOADING';
				s.onload= function(){ __STATUS__[f]['status'] += ' OK'; if( !! __STATUS__[f].callback ) __STATUS__[f].callback(); };
			}
		};
		
		function loadCSS(f) {
			var s = document.createElement('link');
			s.type='text/css';
			s.rel='stylesheet';
			s.href=f;
			__SCRIPTS__[0].parentNode.insertBefore(s,__SCRIPTS__[0]);
			__STATUS__[f]['status'] += ' LOADING';
			s.onload= function(){ __STATUS__[f]['status'] += ' OK'; if( !! __STATUS__[f].callback ) __STATUS__[f].callback(); };
		};
		
		//push unique script's to __status__
		function push(f,c,b,d) { if( !defined(b) && !initiated(f) ) __STATUS__[urlprotocol(f)] = { 'status' : 'WAITING', callback : c , global : b , type : d }; if(inc['ready']()) { if( d == 'js' ) load(urlprotocol(f)); else loadCSS(urlprotocol(f)); } else __STATUS__[urlprotocol(f)]['status'] += " REJECTED"; };
		
		//our collection function for adding scripts to the loader
		inc['include'] = function(f,c,b,d) {
			if(Object.prototype.toString.call(f) == '[object Array]') {
				var a = f.length;
				for(var o=0;o<a;o++)
					push(f[o][0],f[o][1],f[o][2],f[o][3]);
			}
			else
				push(f,c,b,d);
		};
	
		//document ready callback: see http://dustindiaz.com/smallest-domready-ever , alternative is comment #217 here http://dean.edwards.name/weblog/2006/06/again/#comment367184 
		function r(f){!inc['ready']()?setTimeout((function(){ r(f); }),9):f()};
	
		//load everything once the page is ready	
		r(function(){
			var length = __SCRIPTS__.length;
			for(i = 0, j=__SCRIPTS__[i]; i < length; i++) {
				if(__STATUS__[j]['status'].indexOf('LOADING') === -1 ) {
					if(__STATUS__[j].type == 'js')	load(j);
					else	loadCSS(j);
					}
				}
			});
	
	};
