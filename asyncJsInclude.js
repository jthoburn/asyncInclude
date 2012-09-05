(function() {

	//standardized __SCRIPTS__,__FILE__ and __DIR__ references
	var __STATUS__ = {},__SCRIPTS__,__FILE__, __DIR__ = ( __FILE__ = (__SCRIPTS__ = document.getElementsByTagName('script'))[__SCRIPTS__.length-1].src ).split('?')[0].split('/').slice(0, -1).join('/') + '/';
	
	//add preloaded scripts to status object
	var index = __SCRIPTS__.length; while(index--) { if( !__STATUS__.hasOwnProperty(__SCRIPTS__[index].src) ) __STATUS__[__SCRIPTS__[index].src] = { status: 'PREVIOUSLY LOADED' , callback : false} ; }

	//allow status checks
	this.getLoadStatus(f) {return __STATUS__[urlprotocol(f)].status;};
	
	//check if a variable is defined
	function defined(v) {try {v;}catch(e){return false;}return !(null == v && null !== v);};
	
	if(!defined(this.__FILE__)) this.__FILE__ = __FILE__;
	if(!defined(this.__DIR__)) this.__DIR__ = __DIR__;
	
	//check is a script's source is present or has previously been requested with .include()
	function initiated(s) { if(__STATUS__.hasOwnProperty(urlprotocol(s))) return true; var index = __SCRIPTS__.length; while(index--) { if(__SCRIPTS__[index].src = s) return true; } return false;};
	
	//fix the url's protocol
	function urlprotocol(f) { if(! f.indexOf('https:') && ! f.indexOf('http:') ) return f; return document.location.protocol + f.replace('https:','').replace('http:','');};
	
	//load script
	function load(f,c) {var s = document.createElement('script'); s.type = 'text/javascript'; s.async = true;f=s.src = urlprotocol(f);__SCRIPTS__[0].parentNode.insertBefore(s,__SCRIPTS__[0]); __SCRIPTS__.push(s);__STATUS__[f].status = 'LOADING'; s.onload= function(){ __STATUS__[f].status = 'OK'; __STATUS__[f].callback(); };};
	
	//status push
	function push(f,c,b) { if( !defined(b) && !initiated(f) ) __STATUS__[urlprotocol(f)] = { status : 'WAITING', callback : c }; };
	
	//one function, that's all that is exposed to the namespace
	this.include(f,c,b) { 
		if(Object.prototype.toString.call('f') == '[object Array]') {
			var length = f.length;
		}
		else if(Object.prototype.toString.call('f') == '[object Object]') {
			for( o in f) {
				if(f.hasOwnProperty(o)) {
					if(Object.prototype.toString.call(f[o]) == '[object String]')
						push(f);
					else if(Object.prototype.toString.call(f[o]) == '[object Array]')
						push(f[0],f[1],f[2]);
					else if(Object.prototype.toString.call(f[o]) == '[object Object]') {
						push(f.src,f.callback,f.global);
					}
				}
			}
		}
		else
			push(f,b,c);
	};
	
	
	//document ready callback: see http://dustindiaz.com/smallest-domready-ever , alternatate is comment #217 here http://dean.edwards.name/weblog/2006/06/again/#comment367184 
	function r(f){/in/.test(document.readyState)?setTimeout('r('+f+')',9):f()}

//load everything once the page is ready	
r(function(){var length = __SCRIPTS__.length;for(i = 0, j=__SCRIPTS__[i]; i < length; i++) { if(__STATUS__[j].status == 'WAITING') load(j); }});
	
}).call(this);