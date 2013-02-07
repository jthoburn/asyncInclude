#asyncInclude

Copyright(c) 2012 James Thoburn, http://jthoburn.com

Dual licensed under the MIT or GPL Version 2 licenses.

#ABOUT

asyncInclude.js is a simple asynchronous javascript and CSS loader that loads urls dynamically
using a callback for "the smallest DOM ready ever" ( see http://dustindiaz.com/smallest-domready-ever )

##USAGE

asyncInclude adds a single object: `window.asyncInclude` with the following methods.


`.include()` adds scripts to the loader's stack. Scripts are included in the order they are added to the stack.


`.include()` can be called with either an `Array` of arrays (with 5 arguments each) or five arguments.

`.include(Array)` treats each item as a unique resource to load with 5 arguments:

`[0]` is the `src`

`[1]` is the `callback` you would like executed once the resource (javascript or css) has finished loading.

`[2]` is a string representing a `global` object in the window context.  If `window.hasOwnProperty(global) == true` then the script is not loaded.

`[3]` is the resource `type` (either `'js'` or `'css'`)

`[4]` is an array of strings of global objects upon which this script is dependent.  While the scripts are in theory loaded in the order in which they were passed to `asyncInclude.include()` !!!WARNING!!! property `async=true` is used.
For example, passing in an array `['jQuery','io']` for `myscript.js` will result in the callback for `myscript.js` not being executed until both `jQuery` and `io` are `window` methods and have had their callbacks executed.
Dependencies do not have to be scripts that were included using `asyncInclude.include();`!


`.include(src,callback,global,type,dependencies)` adds a single script to the stack.

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
Alternatively, you can force loading to begin by setting it to return true. `.ready = function(){ return true;}`.
