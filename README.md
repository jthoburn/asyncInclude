#asyncInclude

Copyright(c) 2012 James Thoburn, http://jthoburn.com

Dual licensed under the MIT or GPL Version 2 licenses.

#ABOUT

asyncInclude.js is a simple asynchronous javascript script loader that loads script urls dynamically
using a callback for "the smallest DOM ready ever" ( see http://dustindiaz.com/smallest-domready-ever )

##USAGE

asyncInclude adds a single object to its context.  If object is assigned to `context.loader` unless
`context.loader` were previously defined, in which case the object is assigned to `context.asyncJsInclude`.

the object has the following methods.

`.include()` adds scripts to the loader's stack. Scripts are included in the order they are added to the stack.


`.include()` can be called with either an `Array` and `Object` or three arguments.

`.include(array)` and `.include(object)` treat each item as a unique script with up to 3 properties.  The
script can be either a string, an object of the form `{ src: '', callback : fn, global : object }`, or an array
in which `[0]` is the `src`, `[1]` is the `callback`, and `[2]` is the `global` object.

`.include(src,callback,global)` adds a single script to the stack.

###GLOBAL
Many scripts and libraries add a single object to the context they are loaded in. Complicated sites sometimes will load multiple versions or sources of the same library (such as jQuery).  Passing the object for that library to the include script via `global` will result in a quick check to see if it exists, thus preventing multiple loads.  `global` will also be checked again just before a script is actually loaded in case you yourself try to load multiple scripts.  If a match is found at that time, the status for that script will be set to `PRE-EXISTING`. 

###Http(s)?
Any script with a defined http protocol is switched to the the protocol the webpage was served with. https protocols are left intact. Most javascript libary repositories (google, github, etc.) use https, and if your webpage is served with the https protocol your scripts should be too.

##STATUS

Every script you load through the `.include()` and all scripts already loaded when asyncInclude.js loads are given a status.  You can check the status of a script by calling `.status()` and looping through the included scripts or `.status(src)`.

Possible Status strings.
`PREVIOUSLY LOADED` : this script src was loaded before asyncInclude was loaded.
`WAITING` : this script src has not started loading yet, likely waiting for .ready() to return true.
`LOADING` : this script src has begun the process of loading but has not triggered `script.onload`
`OK` : this script has finished loading and any callback defined for it when `.include()` was called has now been triggered.
`PRE-EXISTING` : this script's `global` was found in the namespace before loading, so loading was aborted.
`REJECTED` : this script's `global` was found in the namespace when it was added, so no load was attempted.


##CALLBACKS

You can pass a callback function to be triggered when the script fires the `onload` event.

##READY

You can directly access the test used to determine the DOM ready state using `.ready()`.
Alternatively, you can force loading to begin by setting it to true. `.ready = true;`.
