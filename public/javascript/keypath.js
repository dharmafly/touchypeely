/*  Keypath.js - v1.1
 *  Copyright 2011, Aron Carroll
 *  Released under the MIT license
 *  More Information: http://github.com/aron/keypath.js
 */
(function (context, undefined) {

	var _keypath = context.keypath;

	/* Function for looking up a value in an object using a keypath string.
	 *
	 * Often useful when working with large objects such as JSON data returned
	 * from a server as it allows quick navigation to only the required
	 * information.
	 *
	 * object    - An Object to query.
	 * path      - A dot sepeated keypath String.
	 * fallback  - An optional fallback value to return.
	 * prototype - Boolean, if true keypath will traverse the prototype chain.
	 *
	 * Examples
	 *
	 *   var data = {
	 *     tracks: [
	 *     {
	 *       name: 'Michelle',
	 *       url: 'http://www.last.fm/music/The+Beatles/Rubber+Soul/Michelle',
	 *       album: {
	 *         name: 'Rubber Soul'
	 *         url: 'http://www.last.fm/music/The+Beatles/Rubber+Soul'
	 *         tracks: 12
	 *       },
	 *       artist: {
	 *         name: 'The Beatles',
	 *         url: 'http://www.last.fm/music/The+Beatles'
	 *       }
	 *     }
	 *   ]};
	 *
	 *   keypath(data, 'tracks.0.artist.name');
	 *   //=> 'The Beatles'
	 *
	 *   keypath(data, 'tracks.0.duration');
	 *   //=> null
	 *
	 *   keypath(data, 'tracks.0.duration', '2.42');
	 *   //=> '2.42'
	 *
	 * Returns the queried value if found. Otherwise returns null unless a
	 * fallback parameter is provided.
	 */
	function keypath(object, path, fallback, prototype) {
		var keys = (path || '').split('.'),
		    key;

		while (object && keys.length) {
			key = keys.shift();

			if (object.hasOwnProperty(key) || (prototype === true && object[key] !== undefined)) {
				object = object[key];

				if (keys.length === 0 && object !== undefined) {
					return object;
				}
			} else {
				break;
			}
		}

		return (arguments.length > 2) ? fallback : null;
	}

	/* Public: Restores the previous "keypath" property on the current
	 * scope and returns the function. Use this to redefine the
	 * function in a different namespace.
	 *
	 * Examples
	 *
	 *	 jQuery.keypath = keypath.noConflict();
	 *
	 * Returns keypath Function.
	 */
	keypath.noConflict = function () {
		context.keypath = _keypath;
		return keypath;
	};

	// Export depending on the environment.
	if (context.exports) {
		context.exports = keypath;
	} else {
		context.keypath = keypath;
	}

})(typeof module === 'object' ? module : this);
