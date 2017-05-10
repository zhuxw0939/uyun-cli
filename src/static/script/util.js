/**
 * Created by zxw on 2017/1/16.
 */
/*
if (!Object.assign) {
	Object.defineProperty(Object, "assign", {
		enumerable: false,
		configurable: true,
		writable: true,
		value: function(target, firstSource) {
			"use strict";
			if (target === undefined || target === null)
				throw new TypeError("Cannot convert first argument to object");
			var to = Object(target);
			for (var i = 1; i < arguments.length; i++) {
				var nextSource = arguments[i];
				if (nextSource === undefined || nextSource === null) continue;
				var keysArray = Object.keys(Object(nextSource));
				for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
					var nextKey = keysArray[nextIndex];
					var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
					if (desc !== undefined && desc.enumerable) to[nextKey] = nextSource[nextKey];
				}
			}
			return to;
		}
	});
}*/

if (typeof Object.assign != 'function') {
	Object.assign = function(target) {
		'use strict';
		if (target == null) {
			throw new TypeError('Cannot convert undefined or null to object');
		}

		target = Object(target);
		for (var index = 1; index < arguments.length; index++) {
			var source = arguments[index];
			if (source != null) {
				for (var key in source) {
					if (Object.prototype.hasOwnProperty.call(source, key)) {
						target[key] = source[key];
					}
				}
			}
		}
		return target;
	};
}

if (!Array.prototype.findIndex) {
	Array.prototype.findIndex = function(predicate) {
		if (this === null) {
			throw new TypeError('Array.prototype.findIndex called on null or undefined');
		}
		if (typeof predicate !== 'function') {
			throw new TypeError('predicate must be a function');
		}
		var list = Object(this);
		var length = list.length >>> 0;
		var thisArg = arguments[1];
		var value;

		for (var i = 0; i < length; i++) {
			value = list[i];
			if (predicate.call(thisArg, value, i, list)) {
				return i;
			}
		}
		return -1;
	};
}


if (!Array.prototype.find) {
	Array.prototype.find = function(predicate) {
		'use strict';
		if (this == null) {
			throw new TypeError('Array.prototype.find called on null or undefined');
		}
		if (typeof predicate !== 'function') {
			throw new TypeError('predicate must be a function');
		}
		var list = Object(this);
		var length = list.length >>> 0;
		var thisArg = arguments[1];
		var value;

		for (var i = 0; i < length; i++) {
			value = list[i];
			if (predicate.call(thisArg, value, i, list)) {
				return value;
			}
		}
		return undefined;
	};
}

String.prototype.windowOpen = function (target){
	var url = this;
	var a = document.createElement("a");
	a.setAttribute("href", url);
	if(target == null){
		target = '';
	}
	a.setAttribute("target", target);
	document.body.appendChild(a);
	if(a.click){
		a.click();
	}else{
		try{
			var evt = document.createEvent('Event');
			a.initEvent('click', true, true);
			a.dispatchEvent(evt);
		}catch(e){
			window.open(url);
		}
	}
	document.body.removeChild(a);
};