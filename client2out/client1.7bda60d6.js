// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"../node_modules/base64-js/index.js":[function(require,module,exports) {
'use strict'

exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  for (var i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(
      uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)
    ))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}

},{}],"../node_modules/ieee754/index.js":[function(require,module,exports) {
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],"../node_modules/isarray/index.js":[function(require,module,exports) {
var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

},{}],"../node_modules/buffer/index.js":[function(require,module,exports) {

var global = arguments[3];
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')
var isArray = require('isarray')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  var actual = that.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual)
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array)
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

},{"base64-js":"../node_modules/base64-js/index.js","ieee754":"../node_modules/ieee754/index.js","isarray":"../node_modules/isarray/index.js","buffer":"../node_modules/buffer/index.js"}],"../browser/browser.js":[function(require,module,exports) {
var define;
var global = arguments[3];
var Buffer = require("buffer").Buffer;
parcelRequire = function (e, r, n, t) {
  var i = "function" == typeof parcelRequire && parcelRequire,
      o = "function" == typeof require && require;

  function u(n, t) {
    if (!r[n]) {
      if (!e[n]) {
        var f = "function" == typeof parcelRequire && parcelRequire;
        if (!t && f) return f(n, !0);
        if (i) return i(n, !0);
        if (o && "string" == typeof n) return o(n);
        var c = new Error("Cannot find module '" + n + "'");
        throw c.code = "MODULE_NOT_FOUND", c;
      }

      p.resolve = function (r) {
        return e[n][1][r] || r;
      }, p.cache = {};
      var l = r[n] = new u.Module(n);
      e[n][0].call(l.exports, p, l, l.exports, this);
    }

    return r[n].exports;

    function p(e) {
      return u(p.resolve(e));
    }
  }

  u.isParcelRequire = !0, u.Module = function (e) {
    this.id = e, this.bundle = u, this.exports = {};
  }, u.modules = e, u.cache = r, u.parent = i, u.register = function (r, n) {
    e[r] = [function (e, r) {
      r.exports = n;
    }, {}];
  };

  for (var f = 0; f < n.length; f++) u(n[f]);

  if (n.length) {
    var c = u(n[n.length - 1]);
    "object" == typeof exports && "undefined" != typeof module ? module.exports = c : "function" == typeof define && define.amd ? define(function () {
      return c;
    }) : t && (this[t] = c);
  }

  return u;
}({
  "SvC3": [function (require, module, exports) {
    var define;
    var e;
    !function (t, n) {
      if ("object" == typeof exports && "object" == typeof module) module.exports = n();else if ("function" == typeof e && e.amd) e([], n);else {
        var r = n();

        for (var o in r) ("object" == typeof exports ? exports : t)[o] = r[o];
      }
    }(this, function () {
      return function (e) {
        var t = {};

        function n(r) {
          if (t[r]) return t[r].exports;
          var o = t[r] = {
            i: r,
            l: !1,
            exports: {}
          };
          return e[r].call(o.exports, o, o.exports, n), o.l = !0, o.exports;
        }

        return n.m = e, n.c = t, n.i = function (e) {
          return e;
        }, n.d = function (e, t, r) {
          n.o(e, t) || Object.defineProperty(e, t, {
            configurable: !1,
            enumerable: !0,
            get: r
          });
        }, n.n = function (e) {
          var t = e && e.__esModule ? function () {
            return e.default;
          } : function () {
            return e;
          };
          return n.d(t, "a", t), t;
        }, n.o = function (e, t) {
          return Object.prototype.hasOwnProperty.call(e, t);
        }, n.p = "", n(n.s = 17);
      }([function (e, t, n) {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0
        });
        var r = n(4);
        t.Metadata = r.BrowserHeaders;
      }, function (e, t, n) {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0
        }), t.debug = function () {
          for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];

          console.debug ? console.debug.apply(null, e) : console.log.apply(null, e);
        };
      }, function (e, t, n) {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0
        });
        var r = null;

        t.default = function (e) {
          null === r ? (r = [e], setTimeout(function () {
            !function e() {
              if (r) {
                var t = r;
                r = null;

                for (var n = 0; n < t.length; n++) try {
                  t[n]();
                } catch (s) {
                  null === r && (r = [], setTimeout(function () {
                    e();
                  }, 0));

                  for (var o = t.length - 1; o > n; o--) r.unshift(t[o]);

                  throw s;
                }
              }
            }();
          }, 0)) : r.push(e);
        };
      }, function (e, t, n) {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0
        });
        var r = n(0),
            o = n(10),
            s = n(5),
            i = n(1),
            a = n(2),
            u = n(6),
            d = n(19);

        t.client = function (e, t) {
          return new c(e, t);
        };

        var c = function () {
          function e(e, t) {
            this.started = !1, this.sentFirstMessage = !1, this.completed = !1, this.closed = !1, this.finishedSending = !1, this.onHeadersCallbacks = [], this.onMessageCallbacks = [], this.onEndCallbacks = [], this.parser = new o.ChunkParser(), this.methodDefinition = e, this.props = t, this.createTransport();
          }

          return e.prototype.createTransport = function () {
            var e = this.props.host + "/" + this.methodDefinition.service.serviceName + "/" + this.methodDefinition.methodName,
                t = {
              methodDefinition: this.methodDefinition,
              debug: this.props.debug || !1,
              url: e,
              onHeaders: this.onTransportHeaders.bind(this),
              onChunk: this.onTransportChunk.bind(this),
              onEnd: this.onTransportEnd.bind(this)
            };
            this.props.transport ? this.transport = this.props.transport(t) : this.transport = u.makeDefaultTransport(t);
          }, e.prototype.onTransportHeaders = function (e, t) {
            if (this.props.debug && i.debug("onHeaders", e, t), this.closed) this.props.debug && i.debug("grpc.onHeaders received after request was closed - ignoring");else if (0 === t) ;else {
              this.responseHeaders = e, this.props.debug && i.debug("onHeaders.responseHeaders", JSON.stringify(this.responseHeaders, null, 2));
              var n = p(e);
              this.props.debug && i.debug("onHeaders.gRPCStatus", n);
              var r = n && n >= 0 ? n : s.httpStatusToCode(t);
              this.props.debug && i.debug("onHeaders.code", r);
              var o = e.get("grpc-message") || [];

              if (this.props.debug && i.debug("onHeaders.gRPCMessage", o), this.rawOnHeaders(e), r !== s.Code.OK) {
                var a = this.decodeGRPCStatus(o[0]);
                this.rawOnError(r, a, e);
              }
            }
          }, e.prototype.onTransportChunk = function (e) {
            var t = this;
            if (this.closed) this.props.debug && i.debug("grpc.onChunk received after request was closed - ignoring");else {
              var n = [];

              try {
                n = this.parser.parse(e);
              } catch (a) {
                return this.props.debug && i.debug("onChunk.parsing error", a, a.message), void this.rawOnError(s.Code.Internal, "parsing error: " + a.message);
              }

              n.forEach(function (e) {
                if (e.chunkType === o.ChunkType.MESSAGE) {
                  var n = t.methodDefinition.responseType.deserializeBinary(e.data);
                  t.rawOnMessage(n);
                } else e.chunkType === o.ChunkType.TRAILERS && (t.responseHeaders ? (t.responseTrailers = new r.Metadata(e.trailers), t.props.debug && i.debug("onChunk.trailers", t.responseTrailers)) : (t.responseHeaders = new r.Metadata(e.trailers), t.rawOnHeaders(t.responseHeaders)));
              });
            }
          }, e.prototype.onTransportEnd = function () {
            if (this.props.debug && i.debug("grpc.onEnd"), this.closed) this.props.debug && i.debug("grpc.onEnd received after request was closed - ignoring");else if (void 0 !== this.responseTrailers) {
              var e = p(this.responseTrailers);

              if (null !== e) {
                var t = this.responseTrailers.get("grpc-message"),
                    n = this.decodeGRPCStatus(t[0]);
                this.rawOnEnd(e, n, this.responseTrailers);
              } else this.rawOnError(s.Code.Internal, "Response closed without grpc-status (Trailers provided)");
            } else {
              if (void 0 === this.responseHeaders) return void this.rawOnError(s.Code.Unknown, "Response closed without headers");
              var r = p(this.responseHeaders),
                  o = this.responseHeaders.get("grpc-message");
              if (this.props.debug && i.debug("grpc.headers only response ", r, o), null === r) return void this.rawOnEnd(s.Code.Unknown, "Response closed without grpc-status (Headers only)", this.responseHeaders);
              var a = this.decodeGRPCStatus(o[0]);
              this.rawOnEnd(r, a, this.responseHeaders);
            }
          }, e.prototype.decodeGRPCStatus = function (e) {
            if (!e) return "";

            try {
              return decodeURIComponent(e);
            } catch (t) {
              return e;
            }
          }, e.prototype.rawOnEnd = function (e, t, n) {
            var r = this;
            this.props.debug && i.debug("rawOnEnd", e, t, n), this.completed || (this.completed = !0, this.onEndCallbacks.forEach(function (o) {
              a.default(function () {
                r.closed || o(e, t, n);
              });
            }));
          }, e.prototype.rawOnHeaders = function (e) {
            this.props.debug && i.debug("rawOnHeaders", e), this.completed || this.onHeadersCallbacks.forEach(function (t) {
              a.default(function () {
                t(e);
              });
            });
          }, e.prototype.rawOnError = function (e, t, n) {
            var o = this;
            void 0 === n && (n = new r.Metadata()), this.props.debug && i.debug("rawOnError", e, t), this.completed || (this.completed = !0, this.onEndCallbacks.forEach(function (r) {
              a.default(function () {
                o.closed || r(e, t, n);
              });
            }));
          }, e.prototype.rawOnMessage = function (e) {
            var t = this;
            this.props.debug && i.debug("rawOnMessage", e.toObject()), this.completed || this.closed || this.onMessageCallbacks.forEach(function (n) {
              a.default(function () {
                t.closed || n(e);
              });
            });
          }, e.prototype.onHeaders = function (e) {
            this.onHeadersCallbacks.push(e);
          }, e.prototype.onMessage = function (e) {
            this.onMessageCallbacks.push(e);
          }, e.prototype.onEnd = function (e) {
            this.onEndCallbacks.push(e);
          }, e.prototype.start = function (e) {
            if (this.started) throw new Error("Client already started - cannot .start()");
            this.started = !0;
            var t = new r.Metadata(e || {});
            t.set("content-type", "application/grpc-web+proto"), t.set("x-grpc-web", "1"), this.transport.start(t);
          }, e.prototype.send = function (e) {
            if (!this.started) throw new Error("Client not started - .start() must be called before .send()");
            if (this.closed) throw new Error("Client already closed - cannot .send()");
            if (this.finishedSending) throw new Error("Client already finished sending - cannot .send()");
            if (!this.methodDefinition.requestStream && this.sentFirstMessage) throw new Error("Message already sent for non-client-streaming method - cannot .send()");
            this.sentFirstMessage = !0;
            var t = d.frameRequest(e);
            this.transport.sendMessage(t);
          }, e.prototype.finishSend = function () {
            if (!this.started) throw new Error("Client not started - .finishSend() must be called before .close()");
            if (this.closed) throw new Error("Client already closed - cannot .send()");
            if (this.finishedSending) throw new Error("Client already finished sending - cannot .finishSend()");
            this.finishedSending = !0, this.transport.finishSend();
          }, e.prototype.close = function () {
            if (!this.started) throw new Error("Client not started - .start() must be called before .close()");
            if (this.closed) throw new Error("Client already closed - cannot .close()");
            this.closed = !0, this.props.debug && i.debug("request.abort aborting request"), this.transport.cancel();
          }, e;
        }();

        function p(e) {
          var t = e.get("grpc-status") || [];
          if (t.length > 0) try {
            var n = t[0];
            return parseInt(n, 10);
          } catch (r) {
            return null;
          }
          return null;
        }
      }, function (e, t, n) {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0
        });
        var r = n(14);
        t.BrowserHeaders = r.BrowserHeaders;
      }, function (e, t, n) {
        "use strict";

        var r;
        Object.defineProperty(t, "__esModule", {
          value: !0
        }), function (e) {
          e[e.OK = 0] = "OK", e[e.Canceled = 1] = "Canceled", e[e.Unknown = 2] = "Unknown", e[e.InvalidArgument = 3] = "InvalidArgument", e[e.DeadlineExceeded = 4] = "DeadlineExceeded", e[e.NotFound = 5] = "NotFound", e[e.AlreadyExists = 6] = "AlreadyExists", e[e.PermissionDenied = 7] = "PermissionDenied", e[e.ResourceExhausted = 8] = "ResourceExhausted", e[e.FailedPrecondition = 9] = "FailedPrecondition", e[e.Aborted = 10] = "Aborted", e[e.OutOfRange = 11] = "OutOfRange", e[e.Unimplemented = 12] = "Unimplemented", e[e.Internal = 13] = "Internal", e[e.Unavailable = 14] = "Unavailable", e[e.DataLoss = 15] = "DataLoss", e[e.Unauthenticated = 16] = "Unauthenticated";
        }(r = t.Code || (t.Code = {})), t.httpStatusToCode = function (e) {
          switch (e) {
            case 0:
              return r.Internal;

            case 200:
              return r.OK;

            case 400:
              return r.InvalidArgument;

            case 401:
              return r.Unauthenticated;

            case 403:
              return r.PermissionDenied;

            case 404:
              return r.NotFound;

            case 409:
              return r.Aborted;

            case 412:
              return r.FailedPrecondition;

            case 429:
              return r.ResourceExhausted;

            case 499:
              return r.Canceled;

            case 500:
              return r.Unknown;

            case 501:
              return r.Unimplemented;

            case 503:
              return r.Unavailable;

            case 504:
              return r.DeadlineExceeded;

            default:
              return r.Unknown;
          }
        };
      }, function (e, t, n) {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0
        });

        var r = n(8),
            o = function o(e) {
          return r.CrossBrowserHttpTransport({
            withCredentials: !1
          })(e);
        };

        t.setDefaultTransportFactory = function (e) {
          o = e;
        }, t.makeDefaultTransport = function (e) {
          return o(e);
        };
      }, function (e, t, n) {
        "use strict";

        var r = this && this.__assign || function () {
          return (r = Object.assign || function (e) {
            for (var t, n = 1, r = arguments.length; n < r; n++) for (var o in t = arguments[n]) Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o]);

            return e;
          }).apply(this, arguments);
        };

        Object.defineProperty(t, "__esModule", {
          value: !0
        });
        var o = n(0),
            s = n(1),
            i = n(2);

        t.FetchReadableStreamTransport = function (e) {
          return function (t) {
            return function (e, t) {
              return e.debug && s.debug("fetchRequest", e), new a(e, t);
            }(t, e);
          };
        };

        var a = function () {
          function e(e, t) {
            this.cancelled = !1, this.controller = window.AbortController && new AbortController(), this.options = e, this.init = t;
          }

          return e.prototype.pump = function (e, t) {
            var n = this;
            if (this.reader = e, this.cancelled) return this.options.debug && s.debug("Fetch.pump.cancel at first pump"), void this.reader.cancel();
            this.reader.read().then(function (e) {
              if (e.done) return i.default(function () {
                n.options.onEnd();
              }), t;
              i.default(function () {
                n.options.onChunk(e.value);
              }), n.pump(n.reader, t);
            }).catch(function (e) {
              n.cancelled ? n.options.debug && s.debug("Fetch.catch - request cancelled") : (n.cancelled = !0, n.options.debug && s.debug("Fetch.catch", e.message), i.default(function () {
                n.options.onEnd(e);
              }));
            });
          }, e.prototype.send = function (e) {
            var t = this;
            fetch(this.options.url, r({}, this.init, {
              headers: this.metadata.toHeaders(),
              method: "POST",
              body: e,
              signal: this.controller && this.controller.signal
            })).then(function (e) {
              if (t.options.debug && s.debug("Fetch.response", e), i.default(function () {
                t.options.onHeaders(new o.Metadata(e.headers), e.status);
              }), !e.body) return e;
              t.pump(e.body.getReader(), e);
            }).catch(function (e) {
              t.cancelled ? t.options.debug && s.debug("Fetch.catch - request cancelled") : (t.cancelled = !0, t.options.debug && s.debug("Fetch.catch", e.message), i.default(function () {
                t.options.onEnd(e);
              }));
            });
          }, e.prototype.sendMessage = function (e) {
            this.send(e);
          }, e.prototype.finishSend = function () {}, e.prototype.start = function (e) {
            this.metadata = e;
          }, e.prototype.cancel = function () {
            this.cancelled ? this.options.debug && s.debug("Fetch.abort.cancel already cancelled") : (this.cancelled = !0, this.reader ? (this.options.debug && s.debug("Fetch.abort.cancel"), this.reader.cancel()) : this.options.debug && s.debug("Fetch.abort.cancel before reader"), this.controller && this.controller.abort());
          }, e;
        }();

        t.detectFetchSupport = function () {
          return "undefined" != typeof Response && Response.prototype.hasOwnProperty("body") && "function" == typeof Headers;
        };
      }, function (e, t, n) {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0
        });
        var r = n(7),
            o = n(9);

        t.CrossBrowserHttpTransport = function (e) {
          if (r.detectFetchSupport()) {
            var t = {
              credentials: e.withCredentials ? "include" : "same-origin"
            };
            return r.FetchReadableStreamTransport(t);
          }

          return o.XhrTransport({
            withCredentials: e.withCredentials
          });
        };
      }, function (e, t, n) {
        "use strict";

        var _r,
            o = this && this.__extends || (_r = function r(e, t) {
          return (_r = Object.setPrototypeOf || {
            __proto__: []
          } instanceof Array && function (e, t) {
            e.__proto__ = t;
          } || function (e, t) {
            for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n]);
          })(e, t);
        }, function (e, t) {
          function n() {
            this.constructor = e;
          }

          _r(e, t), e.prototype = null === t ? Object.create(t) : (n.prototype = t.prototype, new n());
        });

        Object.defineProperty(t, "__esModule", {
          value: !0
        });
        var s = n(0),
            i = n(1),
            a = n(2),
            u = n(18);

        t.XhrTransport = function (e) {
          return function (t) {
            if (u.detectMozXHRSupport()) return new c(t, e);
            if (u.detectXHROverrideMimeTypeSupport()) return new d(t, e);
            throw new Error("This environment's XHR implementation cannot support binary transfer.");
          };
        };

        var d = function () {
          function e(e, t) {
            this.options = e, this.init = t;
          }

          return e.prototype.onProgressEvent = function () {
            var e = this;
            this.options.debug && i.debug("XHR.onProgressEvent.length: ", this.xhr.response.length);
            var t = this.xhr.response.substr(this.index);
            this.index = this.xhr.response.length;
            var n = h(t);
            a.default(function () {
              e.options.onChunk(n);
            });
          }, e.prototype.onLoadEvent = function () {
            var e = this;
            this.options.debug && i.debug("XHR.onLoadEvent"), a.default(function () {
              e.options.onEnd();
            });
          }, e.prototype.onStateChange = function () {
            var e = this;
            this.options.debug && i.debug("XHR.onStateChange", this.xhr.readyState), this.xhr.readyState === XMLHttpRequest.HEADERS_RECEIVED && a.default(function () {
              e.options.onHeaders(new s.Metadata(e.xhr.getAllResponseHeaders()), e.xhr.status);
            });
          }, e.prototype.sendMessage = function (e) {
            this.xhr.send(e);
          }, e.prototype.finishSend = function () {}, e.prototype.start = function (e) {
            var t = this;
            this.metadata = e;
            var n = new XMLHttpRequest();
            this.xhr = n, n.open("POST", this.options.url), this.configureXhr(), this.metadata.forEach(function (e, t) {
              n.setRequestHeader(e, t.join(", "));
            }), n.withCredentials = Boolean(this.init.withCredentials), n.addEventListener("readystatechange", this.onStateChange.bind(this)), n.addEventListener("progress", this.onProgressEvent.bind(this)), n.addEventListener("loadend", this.onLoadEvent.bind(this)), n.addEventListener("error", function (e) {
              t.options.debug && i.debug("XHR.error", e), a.default(function () {
                t.options.onEnd(e.error);
              });
            });
          }, e.prototype.configureXhr = function () {
            this.xhr.responseType = "text", this.xhr.overrideMimeType("text/plain; charset=x-user-defined");
          }, e.prototype.cancel = function () {
            this.options.debug && i.debug("XHR.abort"), this.xhr.abort();
          }, e;
        }();

        t.XHR = d;

        var c = function (e) {
          function t() {
            return null !== e && e.apply(this, arguments) || this;
          }

          return o(t, e), t.prototype.configureXhr = function () {
            this.options.debug && i.debug("MozXHR.configureXhr: setting responseType to 'moz-chunked-arraybuffer'"), this.xhr.responseType = "moz-chunked-arraybuffer";
          }, t.prototype.onProgressEvent = function () {
            var e = this,
                t = this.xhr.response;
            this.options.debug && i.debug("MozXHR.onProgressEvent: ", new Uint8Array(t)), a.default(function () {
              e.options.onChunk(new Uint8Array(t));
            });
          }, t;
        }(d);

        function p(e, t) {
          var n = e.charCodeAt(t);

          if (n >= 55296 && n <= 56319) {
            var r = e.charCodeAt(t + 1);
            r >= 56320 && r <= 57343 && (n = 65536 + (n - 55296 << 10) + (r - 56320));
          }

          return n;
        }

        function h(e) {
          for (var t = new Uint8Array(e.length), n = 0, r = 0; r < e.length; r++) {
            var o = String.prototype.codePointAt ? e.codePointAt(r) : p(e, r);
            t[n++] = 255 & o;
          }

          return t;
        }

        t.MozChunkedArrayBufferXHR = c, t.stringToArrayBuffer = h;
      }, function (e, t, n) {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0
        });

        var r,
            o = n(0),
            s = function s(e) {
          return 9 === e || 10 === e || 13 === e;
        };

        function i(e) {
          return s(e) || e >= 32 && e <= 126;
        }

        function a(e) {
          for (var t = 0; t !== e.length; ++t) if (!i(e[t])) throw new Error("Metadata is not valid (printable) ASCII");

          return String.fromCharCode.apply(String, Array.prototype.slice.call(e));
        }

        function u(e) {
          return 128 == (128 & e.getUint8(0));
        }

        function d(e) {
          return e.getUint32(1, !1);
        }

        function c(e, t, n) {
          return e.byteLength - t >= n;
        }

        function p(e, t, n) {
          if (e.slice) return e.slice(t, n);
          var r = e.length;
          void 0 !== n && (r = n);

          for (var o = new Uint8Array(r - t), s = 0, i = t; i < r; i++) o[s++] = e[i];

          return o;
        }

        t.decodeASCII = a, t.encodeASCII = function (e) {
          for (var t = new Uint8Array(e.length), n = 0; n !== e.length; ++n) {
            var r = e.charCodeAt(n);
            if (!i(r)) throw new Error("Metadata contains invalid ASCII");
            t[n] = r;
          }

          return t;
        }, function (e) {
          e[e.MESSAGE = 1] = "MESSAGE", e[e.TRAILERS = 2] = "TRAILERS";
        }(r = t.ChunkType || (t.ChunkType = {}));

        var h = function () {
          function e() {
            this.buffer = null, this.position = 0;
          }

          return e.prototype.parse = function (e, t) {
            if (0 === e.length && t) return [];
            var n,
                s = [];
            if (null == this.buffer) this.buffer = e, this.position = 0;else if (this.position === this.buffer.byteLength) this.buffer = e, this.position = 0;else {
              var i = this.buffer.byteLength - this.position,
                  h = new Uint8Array(i + e.byteLength),
                  f = p(this.buffer, this.position);
              h.set(f, 0);
              var l = new Uint8Array(e);
              h.set(l, i), this.buffer = h, this.position = 0;
            }

            for (;;) {
              if (!c(this.buffer, this.position, 5)) return s;
              var g = p(this.buffer, this.position, this.position + 5),
                  b = new DataView(g.buffer, g.byteOffset, g.byteLength),
                  y = d(b);
              if (!c(this.buffer, this.position, 5 + y)) return s;
              var v = p(this.buffer, this.position + 5, this.position + 5 + y);
              if (this.position += 5 + y, u(b)) return s.push({
                chunkType: r.TRAILERS,
                trailers: (n = v, new o.Metadata(a(n)))
              }), s;
              s.push({
                chunkType: r.MESSAGE,
                data: v
              });
            }
          }, e;
        }();

        t.ChunkParser = h;
      }, function (e, t, n) {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0
        });
        var r = n(3);

        t.invoke = function (e, t) {
          if (e.requestStream) throw new Error(".invoke cannot be used with client-streaming methods. Use .client instead.");
          var n = r.client(e, {
            host: t.host,
            transport: t.transport,
            debug: t.debug
          });
          return t.onHeaders && n.onHeaders(t.onHeaders), t.onMessage && n.onMessage(t.onMessage), t.onEnd && n.onEnd(t.onEnd), n.start(t.metadata), n.send(t.request), n.finishSend(), {
            close: function close() {
              n.close();
            }
          };
        };
      }, function (e, t, n) {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0
        });
        var r,
            o = n(1),
            s = n(2),
            i = n(10);
        !function (e) {
          e[e.FINISH_SEND = 1] = "FINISH_SEND";
        }(r || (r = {}));
        var a = new Uint8Array([1]);

        t.WebsocketTransport = function () {
          return function (e) {
            return function (e) {
              e.debug && o.debug("websocketRequest", e);

              var t,
                  n = function (e) {
                if ("https://" === e.substr(0, 8)) return "wss://" + e.substr(8);
                if ("http://" === e.substr(0, 7)) return "ws://" + e.substr(7);
                throw new Error("Websocket transport constructed with non-https:// or http:// host.");
              }(e.url),
                  u = [];

              function d(e) {
                if (e === r.FINISH_SEND) t.send(a);else {
                  var n = e,
                      o = new Int8Array(n.byteLength + 1);
                  o.set(new Uint8Array([0])), o.set(n, 1), t.send(o);
                }
              }

              return {
                sendMessage: function sendMessage(e) {
                  t && t.readyState !== t.CONNECTING ? d(e) : u.push(e);
                },
                finishSend: function finishSend() {
                  t && t.readyState !== t.CONNECTING ? d(r.FINISH_SEND) : u.push(r.FINISH_SEND);
                },
                start: function start(r) {
                  (t = new WebSocket(n, ["grpc-websockets"])).binaryType = "arraybuffer", t.onopen = function () {
                    var n;
                    e.debug && o.debug("websocketRequest.onopen"), t.send((n = "", r.forEach(function (e, t) {
                      n += e + ": " + t.join(", ") + "\r\n";
                    }), i.encodeASCII(n))), u.forEach(function (e) {
                      d(e);
                    });
                  }, t.onclose = function (t) {
                    e.debug && o.debug("websocketRequest.onclose", t), s.default(function () {
                      e.onEnd();
                    });
                  }, t.onerror = function (t) {
                    e.debug && o.debug("websocketRequest.onerror", t);
                  }, t.onmessage = function (t) {
                    s.default(function () {
                      e.onChunk(new Uint8Array(t.data));
                    });
                  };
                },
                cancel: function cancel() {
                  e.debug && o.debug("websocket.abort"), s.default(function () {
                    t.close();
                  });
                }
              };
            }(e);
          };
        };
      }, function (e, t, n) {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0
        });
        var r = n(0),
            o = n(3);

        t.unary = function (e, t) {
          if (e.responseStream) throw new Error(".unary cannot be used with server-streaming methods. Use .invoke or .client instead.");
          if (e.requestStream) throw new Error(".unary cannot be used with client-streaming methods. Use .client instead.");
          var n = null,
              s = null,
              i = o.client(e, {
            host: t.host,
            transport: t.transport,
            debug: t.debug
          });
          return i.onHeaders(function (e) {
            n = e;
          }), i.onMessage(function (e) {
            s = e;
          }), i.onEnd(function (e, o, i) {
            t.onEnd({
              status: e,
              statusMessage: o,
              headers: n || new r.Metadata(),
              message: s,
              trailers: i
            });
          }), i.start(t.metadata), i.send(t.request), i.finishSend(), {
            close: function close() {
              i.close();
            }
          };
        };
      }, function (e, t, n) {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0
        });
        var r = n(16);

        var o = function () {
          function e(e, t) {
            void 0 === e && (e = {}), void 0 === t && (t = {
              splitValues: !1
            });
            var n,
                o = this;
            if (this.headersMap = {}, e) if ("undefined" != typeof Headers && e instanceof Headers) r.getHeaderKeys(e).forEach(function (n) {
              r.getHeaderValues(e, n).forEach(function (e) {
                t.splitValues ? o.append(n, r.splitHeaderValue(e)) : o.append(n, e);
              });
            });else if ("object" == typeof (n = e) && "object" == typeof n.headersMap && "function" == typeof n.forEach) e.forEach(function (e, t) {
              o.append(e, t);
            });else if ("undefined" != typeof Map && e instanceof Map) {
              e.forEach(function (e, t) {
                o.append(t, e);
              });
            } else "string" == typeof e ? this.appendFromString(e) : "object" == typeof e && Object.getOwnPropertyNames(e).forEach(function (t) {
              var n = e[t];
              Array.isArray(n) ? n.forEach(function (e) {
                o.append(t, e);
              }) : o.append(t, n);
            });
          }

          return e.prototype.appendFromString = function (e) {
            for (var t = e.split("\r\n"), n = 0; n < t.length; n++) {
              var r = t[n],
                  o = r.indexOf(":");

              if (o > 0) {
                var s = r.substring(0, o).trim(),
                    i = r.substring(o + 1).trim();
                this.append(s, i);
              }
            }
          }, e.prototype.delete = function (e, t) {
            var n = r.normalizeName(e);
            if (void 0 === t) delete this.headersMap[n];else {
              var o = this.headersMap[n];

              if (o) {
                var s = o.indexOf(t);
                s >= 0 && o.splice(s, 1), 0 === o.length && delete this.headersMap[n];
              }
            }
          }, e.prototype.append = function (e, t) {
            var n = this,
                o = r.normalizeName(e);
            Array.isArray(this.headersMap[o]) || (this.headersMap[o] = []), Array.isArray(t) ? t.forEach(function (e) {
              n.headersMap[o].push(r.normalizeValue(e));
            }) : this.headersMap[o].push(r.normalizeValue(t));
          }, e.prototype.set = function (e, t) {
            var n = r.normalizeName(e);

            if (Array.isArray(t)) {
              var o = [];
              t.forEach(function (e) {
                o.push(r.normalizeValue(e));
              }), this.headersMap[n] = o;
            } else this.headersMap[n] = [r.normalizeValue(t)];
          }, e.prototype.has = function (e, t) {
            var n = this.headersMap[r.normalizeName(e)];
            if (!Array.isArray(n)) return !1;

            if (void 0 !== t) {
              var o = r.normalizeValue(t);
              return n.indexOf(o) >= 0;
            }

            return !0;
          }, e.prototype.get = function (e) {
            var t = this.headersMap[r.normalizeName(e)];
            return void 0 !== t ? t.concat() : [];
          }, e.prototype.forEach = function (e) {
            var t = this;
            Object.getOwnPropertyNames(this.headersMap).forEach(function (n) {
              e(n, t.headersMap[n]);
            }, this);
          }, e.prototype.toHeaders = function () {
            if ("undefined" != typeof Headers) {
              var e = new Headers();
              return this.forEach(function (t, n) {
                n.forEach(function (n) {
                  e.append(t, n);
                });
              }), e;
            }

            throw new Error("Headers class is not defined");
          }, e;
        }();

        t.BrowserHeaders = o;
      }, function (e, t) {
        e.exports = {
          iterateHeaders: function iterateHeaders(e, t) {
            for (var n = e[Symbol.iterator](), r = n.next(); !r.done;) t(r.value[0]), r = n.next();
          },
          iterateHeadersKeys: function iterateHeadersKeys(e, t) {
            for (var n = e.keys(), r = n.next(); !r.done;) t(r.value), r = n.next();
          }
        };
      }, function (e, t, n) {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0
        });
        var r = n(15);

        function o(e) {
          return e;
        }

        t.normalizeName = function (e) {
          if ("string" != typeof e && (e = String(e)), /[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(e)) throw new TypeError("Invalid character in header field name");
          return e.toLowerCase();
        }, t.normalizeValue = function (e) {
          return "string" != typeof e && (e = String(e)), e;
        }, t.getHeaderValues = function (e, t) {
          var n = o(e);
          if (n instanceof Headers && n.getAll) return n.getAll(t);
          var r = n.get(t);
          return r && "string" == typeof r ? [r] : r;
        }, t.getHeaderKeys = function (e) {
          var t = o(e),
              n = {},
              s = [];
          return t.keys ? r.iterateHeadersKeys(t, function (e) {
            n[e] || (n[e] = !0, s.push(e));
          }) : t.forEach ? t.forEach(function (e, t) {
            n[t] || (n[t] = !0, s.push(t));
          }) : r.iterateHeaders(t, function (e) {
            var t = e[0];
            n[t] || (n[t] = !0, s.push(t));
          }), s;
        }, t.splitHeaderValue = function (e) {
          var t = [];
          return e.split(", ").forEach(function (e) {
            e.split(",").forEach(function (e) {
              t.push(e);
            });
          }), t;
        };
      }, function (e, t, n) {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0
        });
        var r = n(4),
            o = n(6),
            s = n(7),
            i = n(12),
            a = n(9),
            u = n(8),
            d = n(5),
            c = n(11),
            p = n(13),
            h = n(3);
        !function (e) {
          e.setDefaultTransport = o.setDefaultTransportFactory, e.CrossBrowserHttpTransport = u.CrossBrowserHttpTransport, e.FetchReadableStreamTransport = s.FetchReadableStreamTransport, e.XhrTransport = a.XhrTransport, e.WebsocketTransport = i.WebsocketTransport, e.Code = d.Code, e.Metadata = r.BrowserHeaders, e.client = function (e, t) {
            return h.client(e, t);
          }, e.invoke = c.invoke, e.unary = p.unary;
        }(t.grpc || (t.grpc = {}));
      }, function (e, t, n) {
        "use strict";

        var r;

        function o() {
          if (void 0 !== r) return r;

          if (XMLHttpRequest) {
            r = new XMLHttpRequest();

            try {
              r.open("GET", "https://localhost");
            } catch (e) {}
          }

          return r;
        }

        function s(e) {
          var t = o();
          if (!t) return !1;

          try {
            return t.responseType = e, t.responseType === e;
          } catch (n) {}

          return !1;
        }

        Object.defineProperty(t, "__esModule", {
          value: !0
        }), t.xhrSupportsResponseType = s, t.detectMozXHRSupport = function () {
          return "undefined" != typeof XMLHttpRequest && s("moz-chunked-arraybuffer");
        }, t.detectXHROverrideMimeTypeSupport = function () {
          return "undefined" != typeof XMLHttpRequest && XMLHttpRequest.prototype.hasOwnProperty("overrideMimeType");
        };
      }, function (e, t, n) {
        "use strict";

        Object.defineProperty(t, "__esModule", {
          value: !0
        }), t.frameRequest = function (e) {
          var t = e.serializeBinary(),
              n = new ArrayBuffer(t.byteLength + 5);
          return new DataView(n, 1, 4).setUint32(0, t.length, !1), new Uint8Array(n, 5).set(t), new Uint8Array(n);
        };
      }]);
    });
  }, {}],
  "p5a1": [function (require, module, exports) {
    var global = arguments[3];
    var r,
        e = arguments[3];
    exports.fetch = s(e.fetch) && s(e.ReadableStream), exports.writableStream = s(e.WritableStream), exports.abortController = s(e.AbortController), exports.blobConstructor = !1;

    try {
      new Blob([new ArrayBuffer(1)]), exports.blobConstructor = !0;
    } catch (f) {}

    function t() {
      if (void 0 !== r) return r;

      if (e.XMLHttpRequest) {
        r = new e.XMLHttpRequest();

        try {
          r.open("GET", e.XDomainRequest ? "/" : "https://example.com");
        } catch (f) {
          r = null;
        }
      } else r = null;

      return r;
    }

    function o(r) {
      var e = t();
      if (!e) return !1;

      try {
        return e.responseType = r, e.responseType === r;
      } catch (f) {}

      return !1;
    }

    var a = void 0 !== e.ArrayBuffer,
        n = a && s(e.ArrayBuffer.prototype.slice);

    function s(r) {
      return "function" == typeof r;
    }

    exports.arraybuffer = exports.fetch || a && o("arraybuffer"), exports.msstream = !exports.fetch && n && o("ms-stream"), exports.mozchunkedarraybuffer = !exports.fetch && a && o("moz-chunked-arraybuffer"), exports.overrideMimeType = exports.fetch || !!t() && s(t().overrideMimeType), exports.vbArray = s(e.VBArray), r = null;
  }, {}],
  "4Bm0": [function (require, module, exports) {
    "function" == typeof Object.create ? module.exports = function (t, e) {
      t.super_ = e, t.prototype = Object.create(e.prototype, {
        constructor: {
          value: t,
          enumerable: !1,
          writable: !0,
          configurable: !0
        }
      });
    } : module.exports = function (t, e) {
      t.super_ = e;

      var o = function o() {};

      o.prototype = e.prototype, t.prototype = new o(), t.prototype.constructor = t;
    };
  }, {}],
  "pBGv": [function (require, module, exports) {
    var t,
        e,
        n = module.exports = {};

    function r() {
      throw new Error("setTimeout has not been defined");
    }

    function o() {
      throw new Error("clearTimeout has not been defined");
    }

    function i(e) {
      if (t === setTimeout) return setTimeout(e, 0);
      if ((t === r || !t) && setTimeout) return t = setTimeout, setTimeout(e, 0);

      try {
        return t(e, 0);
      } catch (n) {
        try {
          return t.call(null, e, 0);
        } catch (n) {
          return t.call(this, e, 0);
        }
      }
    }

    function u(t) {
      if (e === clearTimeout) return clearTimeout(t);
      if ((e === o || !e) && clearTimeout) return e = clearTimeout, clearTimeout(t);

      try {
        return e(t);
      } catch (n) {
        try {
          return e.call(null, t);
        } catch (n) {
          return e.call(this, t);
        }
      }
    }

    !function () {
      try {
        t = "function" == typeof setTimeout ? setTimeout : r;
      } catch (n) {
        t = r;
      }

      try {
        e = "function" == typeof clearTimeout ? clearTimeout : o;
      } catch (n) {
        e = o;
      }
    }();
    var c,
        s = [],
        l = !1,
        a = -1;

    function f() {
      l && c && (l = !1, c.length ? s = c.concat(s) : a = -1, s.length && h());
    }

    function h() {
      if (!l) {
        var t = i(f);
        l = !0;

        for (var e = s.length; e;) {
          for (c = s, s = []; ++a < e;) c && c[a].run();

          a = -1, e = s.length;
        }

        c = null, l = !1, u(t);
      }
    }

    function m(t, e) {
      this.fun = t, this.array = e;
    }

    function p() {}

    n.nextTick = function (t) {
      var e = new Array(arguments.length - 1);
      if (arguments.length > 1) for (var n = 1; n < arguments.length; n++) e[n - 1] = arguments[n];
      s.push(new m(t, e)), 1 !== s.length || l || i(h);
    }, m.prototype.run = function () {
      this.fun.apply(null, this.array);
    }, n.title = "browser", n.browser = !0, n.env = {}, n.argv = [], n.version = "", n.versions = {}, n.on = p, n.addListener = p, n.once = p, n.off = p, n.removeListener = p, n.removeAllListeners = p, n.emit = p, n.prependListener = p, n.prependOnceListener = p, n.listeners = function (t) {
      return [];
    }, n.binding = function (t) {
      throw new Error("process.binding is not supported");
    }, n.cwd = function () {
      return "/";
    }, n.chdir = function (t) {
      throw new Error("process.chdir is not supported");
    }, n.umask = function () {
      return 0;
    };
  }, {}],
  "Yj0v": [function (require, module, exports) {
    var process = require("process");

    var n = require("process");

    function e(e, r, t, c) {
      if ("function" != typeof e) throw new TypeError('"callback" argument must be a function');
      var i,
          l,
          u = arguments.length;

      switch (u) {
        case 0:
        case 1:
          return n.nextTick(e);

        case 2:
          return n.nextTick(function () {
            e.call(null, r);
          });

        case 3:
          return n.nextTick(function () {
            e.call(null, r, t);
          });

        case 4:
          return n.nextTick(function () {
            e.call(null, r, t, c);
          });

        default:
          for (i = new Array(u - 1), l = 0; l < i.length;) i[l++] = arguments[l];

          return n.nextTick(function () {
            e.apply(null, i);
          });
      }
    }

    !n.version || 0 === n.version.indexOf("v0.") || 0 === n.version.indexOf("v1.") && 0 !== n.version.indexOf("v1.8.") ? module.exports = {
      nextTick: e
    } : module.exports = n;
  }, {
    "process": "pBGv"
  }],
  "REa7": [function (require, module, exports) {
    var r = {}.toString;

    module.exports = Array.isArray || function (t) {
      return "[object Array]" == r.call(t);
    };
  }, {}],
  "FRpO": [function (require, module, exports) {
    "use strict";

    var e,
        t = "object" == typeof Reflect ? Reflect : null,
        n = t && "function" == typeof t.apply ? t.apply : function (e, t, n) {
      return Function.prototype.apply.call(e, t, n);
    };

    function r(e) {
      console && console.warn && console.warn(e);
    }

    e = t && "function" == typeof t.ownKeys ? t.ownKeys : Object.getOwnPropertySymbols ? function (e) {
      return Object.getOwnPropertyNames(e).concat(Object.getOwnPropertySymbols(e));
    } : function (e) {
      return Object.getOwnPropertyNames(e);
    };

    var i = Number.isNaN || function (e) {
      return e != e;
    };

    function o() {
      o.init.call(this);
    }

    module.exports = o, o.EventEmitter = o, o.prototype._events = void 0, o.prototype._eventsCount = 0, o.prototype._maxListeners = void 0;
    var s = 10;

    function u(e) {
      return void 0 === e._maxListeners ? o.defaultMaxListeners : e._maxListeners;
    }

    function f(e, t, n, i) {
      var o, s, f;
      if ("function" != typeof n) throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof n);
      if (void 0 === (s = e._events) ? (s = e._events = Object.create(null), e._eventsCount = 0) : (void 0 !== s.newListener && (e.emit("newListener", t, n.listener ? n.listener : n), s = e._events), f = s[t]), void 0 === f) f = s[t] = n, ++e._eventsCount;else if ("function" == typeof f ? f = s[t] = i ? [n, f] : [f, n] : i ? f.unshift(n) : f.push(n), (o = u(e)) > 0 && f.length > o && !f.warned) {
        f.warned = !0;
        var p = new Error("Possible EventEmitter memory leak detected. " + f.length + " " + String(t) + " listeners added. Use emitter.setMaxListeners() to increase limit");
        p.name = "MaxListenersExceededWarning", p.emitter = e, p.type = t, p.count = f.length, r(p);
      }
      return e;
    }

    function p() {
      for (var e = [], t = 0; t < arguments.length; t++) e.push(arguments[t]);

      this.fired || (this.target.removeListener(this.type, this.wrapFn), this.fired = !0, n(this.listener, this.target, e));
    }

    function v(e, t, n) {
      var r = {
        fired: !1,
        wrapFn: void 0,
        target: e,
        type: t,
        listener: n
      },
          i = p.bind(r);
      return i.listener = n, r.wrapFn = i, i;
    }

    function h(e, t, n) {
      var r = e._events;
      if (void 0 === r) return [];
      var i = r[t];
      return void 0 === i ? [] : "function" == typeof i ? n ? [i.listener || i] : [i] : n ? y(i) : c(i, i.length);
    }

    function a(e) {
      var t = this._events;

      if (void 0 !== t) {
        var n = t[e];
        if ("function" == typeof n) return 1;
        if (void 0 !== n) return n.length;
      }

      return 0;
    }

    function c(e, t) {
      for (var n = new Array(t), r = 0; r < t; ++r) n[r] = e[r];

      return n;
    }

    function l(e, t) {
      for (; t + 1 < e.length; t++) e[t] = e[t + 1];

      e.pop();
    }

    function y(e) {
      for (var t = new Array(e.length), n = 0; n < t.length; ++n) t[n] = e[n].listener || e[n];

      return t;
    }

    Object.defineProperty(o, "defaultMaxListeners", {
      enumerable: !0,
      get: function get() {
        return s;
      },
      set: function set(e) {
        if ("number" != typeof e || e < 0 || i(e)) throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + e + ".");
        s = e;
      }
    }), o.init = function () {
      void 0 !== this._events && this._events !== Object.getPrototypeOf(this)._events || (this._events = Object.create(null), this._eventsCount = 0), this._maxListeners = this._maxListeners || void 0;
    }, o.prototype.setMaxListeners = function (e) {
      if ("number" != typeof e || e < 0 || i(e)) throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + e + ".");
      return this._maxListeners = e, this;
    }, o.prototype.getMaxListeners = function () {
      return u(this);
    }, o.prototype.emit = function (e) {
      for (var t = [], r = 1; r < arguments.length; r++) t.push(arguments[r]);

      var i = "error" === e,
          o = this._events;
      if (void 0 !== o) i = i && void 0 === o.error;else if (!i) return !1;

      if (i) {
        var s;
        if (t.length > 0 && (s = t[0]), s instanceof Error) throw s;
        var u = new Error("Unhandled error." + (s ? " (" + s.message + ")" : ""));
        throw u.context = s, u;
      }

      var f = o[e];
      if (void 0 === f) return !1;
      if ("function" == typeof f) n(f, this, t);else {
        var p = f.length,
            v = c(f, p);

        for (r = 0; r < p; ++r) n(v[r], this, t);
      }
      return !0;
    }, o.prototype.addListener = function (e, t) {
      return f(this, e, t, !1);
    }, o.prototype.on = o.prototype.addListener, o.prototype.prependListener = function (e, t) {
      return f(this, e, t, !0);
    }, o.prototype.once = function (e, t) {
      if ("function" != typeof t) throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof t);
      return this.on(e, v(this, e, t)), this;
    }, o.prototype.prependOnceListener = function (e, t) {
      if ("function" != typeof t) throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof t);
      return this.prependListener(e, v(this, e, t)), this;
    }, o.prototype.removeListener = function (e, t) {
      var n, r, i, o, s;
      if ("function" != typeof t) throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof t);
      if (void 0 === (r = this._events)) return this;
      if (void 0 === (n = r[e])) return this;
      if (n === t || n.listener === t) 0 == --this._eventsCount ? this._events = Object.create(null) : (delete r[e], r.removeListener && this.emit("removeListener", e, n.listener || t));else if ("function" != typeof n) {
        for (i = -1, o = n.length - 1; o >= 0; o--) if (n[o] === t || n[o].listener === t) {
          s = n[o].listener, i = o;
          break;
        }

        if (i < 0) return this;
        0 === i ? n.shift() : l(n, i), 1 === n.length && (r[e] = n[0]), void 0 !== r.removeListener && this.emit("removeListener", e, s || t);
      }
      return this;
    }, o.prototype.off = o.prototype.removeListener, o.prototype.removeAllListeners = function (e) {
      var t, n, r;
      if (void 0 === (n = this._events)) return this;
      if (void 0 === n.removeListener) return 0 === arguments.length ? (this._events = Object.create(null), this._eventsCount = 0) : void 0 !== n[e] && (0 == --this._eventsCount ? this._events = Object.create(null) : delete n[e]), this;

      if (0 === arguments.length) {
        var i,
            o = Object.keys(n);

        for (r = 0; r < o.length; ++r) "removeListener" !== (i = o[r]) && this.removeAllListeners(i);

        return this.removeAllListeners("removeListener"), this._events = Object.create(null), this._eventsCount = 0, this;
      }

      if ("function" == typeof (t = n[e])) this.removeListener(e, t);else if (void 0 !== t) for (r = t.length - 1; r >= 0; r--) this.removeListener(e, t[r]);
      return this;
    }, o.prototype.listeners = function (e) {
      return h(this, e, !0);
    }, o.prototype.rawListeners = function (e) {
      return h(this, e, !1);
    }, o.listenerCount = function (e, t) {
      return "function" == typeof e.listenerCount ? e.listenerCount(t) : a.call(e, t);
    }, o.prototype.listenerCount = a, o.prototype.eventNames = function () {
      return this._eventsCount > 0 ? e(this._events) : [];
    };
  }, {}],
  "1ExO": [function (require, module, exports) {
    module.exports = require("events").EventEmitter;
  }, {
    "events": "FRpO"
  }],
  "yh9p": [function (require, module, exports) {
    "use strict";

    exports.byteLength = u, exports.toByteArray = i, exports.fromByteArray = d;

    for (var r = [], t = [], e = "undefined" != typeof Uint8Array ? Uint8Array : Array, n = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", o = 0, a = n.length; o < a; ++o) r[o] = n[o], t[n.charCodeAt(o)] = o;

    function h(r) {
      var t = r.length;
      if (t % 4 > 0) throw new Error("Invalid string. Length must be a multiple of 4");
      var e = r.indexOf("=");
      return -1 === e && (e = t), [e, e === t ? 0 : 4 - e % 4];
    }

    function u(r) {
      var t = h(r),
          e = t[0],
          n = t[1];
      return 3 * (e + n) / 4 - n;
    }

    function c(r, t, e) {
      return 3 * (t + e) / 4 - e;
    }

    function i(r) {
      for (var n, o = h(r), a = o[0], u = o[1], i = new e(c(r, a, u)), f = 0, A = u > 0 ? a - 4 : a, d = 0; d < A; d += 4) n = t[r.charCodeAt(d)] << 18 | t[r.charCodeAt(d + 1)] << 12 | t[r.charCodeAt(d + 2)] << 6 | t[r.charCodeAt(d + 3)], i[f++] = n >> 16 & 255, i[f++] = n >> 8 & 255, i[f++] = 255 & n;

      return 2 === u && (n = t[r.charCodeAt(d)] << 2 | t[r.charCodeAt(d + 1)] >> 4, i[f++] = 255 & n), 1 === u && (n = t[r.charCodeAt(d)] << 10 | t[r.charCodeAt(d + 1)] << 4 | t[r.charCodeAt(d + 2)] >> 2, i[f++] = n >> 8 & 255, i[f++] = 255 & n), i;
    }

    function f(t) {
      return r[t >> 18 & 63] + r[t >> 12 & 63] + r[t >> 6 & 63] + r[63 & t];
    }

    function A(r, t, e) {
      for (var n, o = [], a = t; a < e; a += 3) n = (r[a] << 16 & 16711680) + (r[a + 1] << 8 & 65280) + (255 & r[a + 2]), o.push(f(n));

      return o.join("");
    }

    function d(t) {
      for (var e, n = t.length, o = n % 3, a = [], h = 0, u = n - o; h < u; h += 16383) a.push(A(t, h, h + 16383 > u ? u : h + 16383));

      return 1 === o ? (e = t[n - 1], a.push(r[e >> 2] + r[e << 4 & 63] + "==")) : 2 === o && (e = (t[n - 2] << 8) + t[n - 1], a.push(r[e >> 10] + r[e >> 4 & 63] + r[e << 2 & 63] + "=")), a.join("");
    }

    t["-".charCodeAt(0)] = 62, t["_".charCodeAt(0)] = 63;
  }, {}],
  "JgNJ": [function (require, module, exports) {
    exports.read = function (a, o, t, r, h) {
      var M,
          p,
          w = 8 * h - r - 1,
          f = (1 << w) - 1,
          e = f >> 1,
          i = -7,
          N = t ? h - 1 : 0,
          n = t ? -1 : 1,
          s = a[o + N];

      for (N += n, M = s & (1 << -i) - 1, s >>= -i, i += w; i > 0; M = 256 * M + a[o + N], N += n, i -= 8);

      for (p = M & (1 << -i) - 1, M >>= -i, i += r; i > 0; p = 256 * p + a[o + N], N += n, i -= 8);

      if (0 === M) M = 1 - e;else {
        if (M === f) return p ? NaN : 1 / 0 * (s ? -1 : 1);
        p += Math.pow(2, r), M -= e;
      }
      return (s ? -1 : 1) * p * Math.pow(2, M - r);
    }, exports.write = function (a, o, t, r, h, M) {
      var p,
          w,
          f,
          e = 8 * M - h - 1,
          i = (1 << e) - 1,
          N = i >> 1,
          n = 23 === h ? Math.pow(2, -24) - Math.pow(2, -77) : 0,
          s = r ? 0 : M - 1,
          u = r ? 1 : -1,
          l = o < 0 || 0 === o && 1 / o < 0 ? 1 : 0;

      for (o = Math.abs(o), isNaN(o) || o === 1 / 0 ? (w = isNaN(o) ? 1 : 0, p = i) : (p = Math.floor(Math.log(o) / Math.LN2), o * (f = Math.pow(2, -p)) < 1 && (p--, f *= 2), (o += p + N >= 1 ? n / f : n * Math.pow(2, 1 - N)) * f >= 2 && (p++, f /= 2), p + N >= i ? (w = 0, p = i) : p + N >= 1 ? (w = (o * f - 1) * Math.pow(2, h), p += N) : (w = o * Math.pow(2, N - 1) * Math.pow(2, h), p = 0)); h >= 8; a[t + s] = 255 & w, s += u, w /= 256, h -= 8);

      for (p = p << h | w, e += h; e > 0; a[t + s] = 255 & p, s += u, p /= 256, e -= 8);

      a[t + s - u] |= 128 * l;
    };
  }, {}],
  "dskh": [function (require, module, exports) {
    var global = arguments[3];

    var t = arguments[3],
        r = require("base64-js"),
        e = require("ieee754"),
        n = require("isarray");

    function i() {
      try {
        var t = new Uint8Array(1);
        return t.__proto__ = {
          __proto__: Uint8Array.prototype,
          foo: function foo() {
            return 42;
          }
        }, 42 === t.foo() && "function" == typeof t.subarray && 0 === t.subarray(1, 1).byteLength;
      } catch (r) {
        return !1;
      }
    }

    function o() {
      return f.TYPED_ARRAY_SUPPORT ? 2147483647 : 1073741823;
    }

    function u(t, r) {
      if (o() < r) throw new RangeError("Invalid typed array length");
      return f.TYPED_ARRAY_SUPPORT ? (t = new Uint8Array(r)).__proto__ = f.prototype : (null === t && (t = new f(r)), t.length = r), t;
    }

    function f(t, r, e) {
      if (!(f.TYPED_ARRAY_SUPPORT || this instanceof f)) return new f(t, r, e);

      if ("number" == typeof t) {
        if ("string" == typeof r) throw new Error("If encoding is specified then the first argument must be a string");
        return c(this, t);
      }

      return s(this, t, r, e);
    }

    function s(t, r, e, n) {
      if ("number" == typeof r) throw new TypeError('"value" argument must not be a number');
      return "undefined" != typeof ArrayBuffer && r instanceof ArrayBuffer ? g(t, r, e, n) : "string" == typeof r ? l(t, r, e) : y(t, r);
    }

    function h(t) {
      if ("number" != typeof t) throw new TypeError('"size" argument must be a number');
      if (t < 0) throw new RangeError('"size" argument must not be negative');
    }

    function a(t, r, e, n) {
      return h(r), r <= 0 ? u(t, r) : void 0 !== e ? "string" == typeof n ? u(t, r).fill(e, n) : u(t, r).fill(e) : u(t, r);
    }

    function c(t, r) {
      if (h(r), t = u(t, r < 0 ? 0 : 0 | w(r)), !f.TYPED_ARRAY_SUPPORT) for (var e = 0; e < r; ++e) t[e] = 0;
      return t;
    }

    function l(t, r, e) {
      if ("string" == typeof e && "" !== e || (e = "utf8"), !f.isEncoding(e)) throw new TypeError('"encoding" must be a valid string encoding');
      var n = 0 | v(r, e),
          i = (t = u(t, n)).write(r, e);
      return i !== n && (t = t.slice(0, i)), t;
    }

    function p(t, r) {
      var e = r.length < 0 ? 0 : 0 | w(r.length);
      t = u(t, e);

      for (var n = 0; n < e; n += 1) t[n] = 255 & r[n];

      return t;
    }

    function g(t, r, e, n) {
      if (r.byteLength, e < 0 || r.byteLength < e) throw new RangeError("'offset' is out of bounds");
      if (r.byteLength < e + (n || 0)) throw new RangeError("'length' is out of bounds");
      return r = void 0 === e && void 0 === n ? new Uint8Array(r) : void 0 === n ? new Uint8Array(r, e) : new Uint8Array(r, e, n), f.TYPED_ARRAY_SUPPORT ? (t = r).__proto__ = f.prototype : t = p(t, r), t;
    }

    function y(t, r) {
      if (f.isBuffer(r)) {
        var e = 0 | w(r.length);
        return 0 === (t = u(t, e)).length ? t : (r.copy(t, 0, 0, e), t);
      }

      if (r) {
        if ("undefined" != typeof ArrayBuffer && r.buffer instanceof ArrayBuffer || "length" in r) return "number" != typeof r.length || W(r.length) ? u(t, 0) : p(t, r);
        if ("Buffer" === r.type && n(r.data)) return p(t, r.data);
      }

      throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.");
    }

    function w(t) {
      if (t >= o()) throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + o().toString(16) + " bytes");
      return 0 | t;
    }

    function d(t) {
      return +t != t && (t = 0), f.alloc(+t);
    }

    function v(t, r) {
      if (f.isBuffer(t)) return t.length;
      if ("undefined" != typeof ArrayBuffer && "function" == typeof ArrayBuffer.isView && (ArrayBuffer.isView(t) || t instanceof ArrayBuffer)) return t.byteLength;
      "string" != typeof t && (t = "" + t);
      var e = t.length;
      if (0 === e) return 0;

      for (var n = !1;;) switch (r) {
        case "ascii":
        case "latin1":
        case "binary":
          return e;

        case "utf8":
        case "utf-8":
        case void 0:
          return $(t).length;

        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return 2 * e;

        case "hex":
          return e >>> 1;

        case "base64":
          return K(t).length;

        default:
          if (n) return $(t).length;
          r = ("" + r).toLowerCase(), n = !0;
      }
    }

    function E(t, r, e) {
      var n = !1;
      if ((void 0 === r || r < 0) && (r = 0), r > this.length) return "";
      if ((void 0 === e || e > this.length) && (e = this.length), e <= 0) return "";
      if ((e >>>= 0) <= (r >>>= 0)) return "";

      for (t || (t = "utf8");;) switch (t) {
        case "hex":
          return x(this, r, e);

        case "utf8":
        case "utf-8":
          return Y(this, r, e);

        case "ascii":
          return L(this, r, e);

        case "latin1":
        case "binary":
          return D(this, r, e);

        case "base64":
          return S(this, r, e);

        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return C(this, r, e);

        default:
          if (n) throw new TypeError("Unknown encoding: " + t);
          t = (t + "").toLowerCase(), n = !0;
      }
    }

    function b(t, r, e) {
      var n = t[r];
      t[r] = t[e], t[e] = n;
    }

    function R(t, r, e, n, i) {
      if (0 === t.length) return -1;

      if ("string" == typeof e ? (n = e, e = 0) : e > 2147483647 ? e = 2147483647 : e < -2147483648 && (e = -2147483648), e = +e, isNaN(e) && (e = i ? 0 : t.length - 1), e < 0 && (e = t.length + e), e >= t.length) {
        if (i) return -1;
        e = t.length - 1;
      } else if (e < 0) {
        if (!i) return -1;
        e = 0;
      }

      if ("string" == typeof r && (r = f.from(r, n)), f.isBuffer(r)) return 0 === r.length ? -1 : _(t, r, e, n, i);
      if ("number" == typeof r) return r &= 255, f.TYPED_ARRAY_SUPPORT && "function" == typeof Uint8Array.prototype.indexOf ? i ? Uint8Array.prototype.indexOf.call(t, r, e) : Uint8Array.prototype.lastIndexOf.call(t, r, e) : _(t, [r], e, n, i);
      throw new TypeError("val must be string, number or Buffer");
    }

    function _(t, r, e, n, i) {
      var o,
          u = 1,
          f = t.length,
          s = r.length;

      if (void 0 !== n && ("ucs2" === (n = String(n).toLowerCase()) || "ucs-2" === n || "utf16le" === n || "utf-16le" === n)) {
        if (t.length < 2 || r.length < 2) return -1;
        u = 2, f /= 2, s /= 2, e /= 2;
      }

      function h(t, r) {
        return 1 === u ? t[r] : t.readUInt16BE(r * u);
      }

      if (i) {
        var a = -1;

        for (o = e; o < f; o++) if (h(t, o) === h(r, -1 === a ? 0 : o - a)) {
          if (-1 === a && (a = o), o - a + 1 === s) return a * u;
        } else -1 !== a && (o -= o - a), a = -1;
      } else for (e + s > f && (e = f - s), o = e; o >= 0; o--) {
        for (var c = !0, l = 0; l < s; l++) if (h(t, o + l) !== h(r, l)) {
          c = !1;
          break;
        }

        if (c) return o;
      }

      return -1;
    }

    function A(t, r, e, n) {
      e = Number(e) || 0;
      var i = t.length - e;
      n ? (n = Number(n)) > i && (n = i) : n = i;
      var o = r.length;
      if (o % 2 != 0) throw new TypeError("Invalid hex string");
      n > o / 2 && (n = o / 2);

      for (var u = 0; u < n; ++u) {
        var f = parseInt(r.substr(2 * u, 2), 16);
        if (isNaN(f)) return u;
        t[e + u] = f;
      }

      return u;
    }

    function m(t, r, e, n) {
      return Q($(r, t.length - e), t, e, n);
    }

    function P(t, r, e, n) {
      return Q(G(r), t, e, n);
    }

    function T(t, r, e, n) {
      return P(t, r, e, n);
    }

    function B(t, r, e, n) {
      return Q(K(r), t, e, n);
    }

    function U(t, r, e, n) {
      return Q(H(r, t.length - e), t, e, n);
    }

    function S(t, e, n) {
      return 0 === e && n === t.length ? r.fromByteArray(t) : r.fromByteArray(t.slice(e, n));
    }

    function Y(t, r, e) {
      e = Math.min(t.length, e);

      for (var n = [], i = r; i < e;) {
        var o,
            u,
            f,
            s,
            h = t[i],
            a = null,
            c = h > 239 ? 4 : h > 223 ? 3 : h > 191 ? 2 : 1;
        if (i + c <= e) switch (c) {
          case 1:
            h < 128 && (a = h);
            break;

          case 2:
            128 == (192 & (o = t[i + 1])) && (s = (31 & h) << 6 | 63 & o) > 127 && (a = s);
            break;

          case 3:
            o = t[i + 1], u = t[i + 2], 128 == (192 & o) && 128 == (192 & u) && (s = (15 & h) << 12 | (63 & o) << 6 | 63 & u) > 2047 && (s < 55296 || s > 57343) && (a = s);
            break;

          case 4:
            o = t[i + 1], u = t[i + 2], f = t[i + 3], 128 == (192 & o) && 128 == (192 & u) && 128 == (192 & f) && (s = (15 & h) << 18 | (63 & o) << 12 | (63 & u) << 6 | 63 & f) > 65535 && s < 1114112 && (a = s);
        }
        null === a ? (a = 65533, c = 1) : a > 65535 && (a -= 65536, n.push(a >>> 10 & 1023 | 55296), a = 56320 | 1023 & a), n.push(a), i += c;
      }

      return O(n);
    }

    exports.Buffer = f, exports.SlowBuffer = d, exports.INSPECT_MAX_BYTES = 50, f.TYPED_ARRAY_SUPPORT = void 0 !== t.TYPED_ARRAY_SUPPORT ? t.TYPED_ARRAY_SUPPORT : i(), exports.kMaxLength = o(), f.poolSize = 8192, f._augment = function (t) {
      return t.__proto__ = f.prototype, t;
    }, f.from = function (t, r, e) {
      return s(null, t, r, e);
    }, f.TYPED_ARRAY_SUPPORT && (f.prototype.__proto__ = Uint8Array.prototype, f.__proto__ = Uint8Array, "undefined" != typeof Symbol && Symbol.species && f[Symbol.species] === f && Object.defineProperty(f, Symbol.species, {
      value: null,
      configurable: !0
    })), f.alloc = function (t, r, e) {
      return a(null, t, r, e);
    }, f.allocUnsafe = function (t) {
      return c(null, t);
    }, f.allocUnsafeSlow = function (t) {
      return c(null, t);
    }, f.isBuffer = function (t) {
      return !(null == t || !t._isBuffer);
    }, f.compare = function (t, r) {
      if (!f.isBuffer(t) || !f.isBuffer(r)) throw new TypeError("Arguments must be Buffers");
      if (t === r) return 0;

      for (var e = t.length, n = r.length, i = 0, o = Math.min(e, n); i < o; ++i) if (t[i] !== r[i]) {
        e = t[i], n = r[i];
        break;
      }

      return e < n ? -1 : n < e ? 1 : 0;
    }, f.isEncoding = function (t) {
      switch (String(t).toLowerCase()) {
        case "hex":
        case "utf8":
        case "utf-8":
        case "ascii":
        case "latin1":
        case "binary":
        case "base64":
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return !0;

        default:
          return !1;
      }
    }, f.concat = function (t, r) {
      if (!n(t)) throw new TypeError('"list" argument must be an Array of Buffers');
      if (0 === t.length) return f.alloc(0);
      var e;
      if (void 0 === r) for (r = 0, e = 0; e < t.length; ++e) r += t[e].length;
      var i = f.allocUnsafe(r),
          o = 0;

      for (e = 0; e < t.length; ++e) {
        var u = t[e];
        if (!f.isBuffer(u)) throw new TypeError('"list" argument must be an Array of Buffers');
        u.copy(i, o), o += u.length;
      }

      return i;
    }, f.byteLength = v, f.prototype._isBuffer = !0, f.prototype.swap16 = function () {
      var t = this.length;
      if (t % 2 != 0) throw new RangeError("Buffer size must be a multiple of 16-bits");

      for (var r = 0; r < t; r += 2) b(this, r, r + 1);

      return this;
    }, f.prototype.swap32 = function () {
      var t = this.length;
      if (t % 4 != 0) throw new RangeError("Buffer size must be a multiple of 32-bits");

      for (var r = 0; r < t; r += 4) b(this, r, r + 3), b(this, r + 1, r + 2);

      return this;
    }, f.prototype.swap64 = function () {
      var t = this.length;
      if (t % 8 != 0) throw new RangeError("Buffer size must be a multiple of 64-bits");

      for (var r = 0; r < t; r += 8) b(this, r, r + 7), b(this, r + 1, r + 6), b(this, r + 2, r + 5), b(this, r + 3, r + 4);

      return this;
    }, f.prototype.toString = function () {
      var t = 0 | this.length;
      return 0 === t ? "" : 0 === arguments.length ? Y(this, 0, t) : E.apply(this, arguments);
    }, f.prototype.equals = function (t) {
      if (!f.isBuffer(t)) throw new TypeError("Argument must be a Buffer");
      return this === t || 0 === f.compare(this, t);
    }, f.prototype.inspect = function () {
      var t = "",
          r = exports.INSPECT_MAX_BYTES;
      return this.length > 0 && (t = this.toString("hex", 0, r).match(/.{2}/g).join(" "), this.length > r && (t += " ... ")), "<Buffer " + t + ">";
    }, f.prototype.compare = function (t, r, e, n, i) {
      if (!f.isBuffer(t)) throw new TypeError("Argument must be a Buffer");
      if (void 0 === r && (r = 0), void 0 === e && (e = t ? t.length : 0), void 0 === n && (n = 0), void 0 === i && (i = this.length), r < 0 || e > t.length || n < 0 || i > this.length) throw new RangeError("out of range index");
      if (n >= i && r >= e) return 0;
      if (n >= i) return -1;
      if (r >= e) return 1;
      if (this === t) return 0;

      for (var o = (i >>>= 0) - (n >>>= 0), u = (e >>>= 0) - (r >>>= 0), s = Math.min(o, u), h = this.slice(n, i), a = t.slice(r, e), c = 0; c < s; ++c) if (h[c] !== a[c]) {
        o = h[c], u = a[c];
        break;
      }

      return o < u ? -1 : u < o ? 1 : 0;
    }, f.prototype.includes = function (t, r, e) {
      return -1 !== this.indexOf(t, r, e);
    }, f.prototype.indexOf = function (t, r, e) {
      return R(this, t, r, e, !0);
    }, f.prototype.lastIndexOf = function (t, r, e) {
      return R(this, t, r, e, !1);
    }, f.prototype.write = function (t, r, e, n) {
      if (void 0 === r) n = "utf8", e = this.length, r = 0;else if (void 0 === e && "string" == typeof r) n = r, e = this.length, r = 0;else {
        if (!isFinite(r)) throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
        r |= 0, isFinite(e) ? (e |= 0, void 0 === n && (n = "utf8")) : (n = e, e = void 0);
      }
      var i = this.length - r;
      if ((void 0 === e || e > i) && (e = i), t.length > 0 && (e < 0 || r < 0) || r > this.length) throw new RangeError("Attempt to write outside buffer bounds");
      n || (n = "utf8");

      for (var o = !1;;) switch (n) {
        case "hex":
          return A(this, t, r, e);

        case "utf8":
        case "utf-8":
          return m(this, t, r, e);

        case "ascii":
          return P(this, t, r, e);

        case "latin1":
        case "binary":
          return T(this, t, r, e);

        case "base64":
          return B(this, t, r, e);

        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return U(this, t, r, e);

        default:
          if (o) throw new TypeError("Unknown encoding: " + n);
          n = ("" + n).toLowerCase(), o = !0;
      }
    }, f.prototype.toJSON = function () {
      return {
        type: "Buffer",
        data: Array.prototype.slice.call(this._arr || this, 0)
      };
    };
    var I = 4096;

    function O(t) {
      var r = t.length;
      if (r <= I) return String.fromCharCode.apply(String, t);

      for (var e = "", n = 0; n < r;) e += String.fromCharCode.apply(String, t.slice(n, n += I));

      return e;
    }

    function L(t, r, e) {
      var n = "";
      e = Math.min(t.length, e);

      for (var i = r; i < e; ++i) n += String.fromCharCode(127 & t[i]);

      return n;
    }

    function D(t, r, e) {
      var n = "";
      e = Math.min(t.length, e);

      for (var i = r; i < e; ++i) n += String.fromCharCode(t[i]);

      return n;
    }

    function x(t, r, e) {
      var n = t.length;
      (!r || r < 0) && (r = 0), (!e || e < 0 || e > n) && (e = n);

      for (var i = "", o = r; o < e; ++o) i += Z(t[o]);

      return i;
    }

    function C(t, r, e) {
      for (var n = t.slice(r, e), i = "", o = 0; o < n.length; o += 2) i += String.fromCharCode(n[o] + 256 * n[o + 1]);

      return i;
    }

    function M(t, r, e) {
      if (t % 1 != 0 || t < 0) throw new RangeError("offset is not uint");
      if (t + r > e) throw new RangeError("Trying to access beyond buffer length");
    }

    function k(t, r, e, n, i, o) {
      if (!f.isBuffer(t)) throw new TypeError('"buffer" argument must be a Buffer instance');
      if (r > i || r < o) throw new RangeError('"value" argument is out of bounds');
      if (e + n > t.length) throw new RangeError("Index out of range");
    }

    function N(t, r, e, n) {
      r < 0 && (r = 65535 + r + 1);

      for (var i = 0, o = Math.min(t.length - e, 2); i < o; ++i) t[e + i] = (r & 255 << 8 * (n ? i : 1 - i)) >>> 8 * (n ? i : 1 - i);
    }

    function z(t, r, e, n) {
      r < 0 && (r = 4294967295 + r + 1);

      for (var i = 0, o = Math.min(t.length - e, 4); i < o; ++i) t[e + i] = r >>> 8 * (n ? i : 3 - i) & 255;
    }

    function F(t, r, e, n, i, o) {
      if (e + n > t.length) throw new RangeError("Index out of range");
      if (e < 0) throw new RangeError("Index out of range");
    }

    function j(t, r, n, i, o) {
      return o || F(t, r, n, 4, 3.4028234663852886e38, -3.4028234663852886e38), e.write(t, r, n, i, 23, 4), n + 4;
    }

    function q(t, r, n, i, o) {
      return o || F(t, r, n, 8, 1.7976931348623157e308, -1.7976931348623157e308), e.write(t, r, n, i, 52, 8), n + 8;
    }

    f.prototype.slice = function (t, r) {
      var e,
          n = this.length;
      if ((t = ~~t) < 0 ? (t += n) < 0 && (t = 0) : t > n && (t = n), (r = void 0 === r ? n : ~~r) < 0 ? (r += n) < 0 && (r = 0) : r > n && (r = n), r < t && (r = t), f.TYPED_ARRAY_SUPPORT) (e = this.subarray(t, r)).__proto__ = f.prototype;else {
        var i = r - t;
        e = new f(i, void 0);

        for (var o = 0; o < i; ++o) e[o] = this[o + t];
      }
      return e;
    }, f.prototype.readUIntLE = function (t, r, e) {
      t |= 0, r |= 0, e || M(t, r, this.length);

      for (var n = this[t], i = 1, o = 0; ++o < r && (i *= 256);) n += this[t + o] * i;

      return n;
    }, f.prototype.readUIntBE = function (t, r, e) {
      t |= 0, r |= 0, e || M(t, r, this.length);

      for (var n = this[t + --r], i = 1; r > 0 && (i *= 256);) n += this[t + --r] * i;

      return n;
    }, f.prototype.readUInt8 = function (t, r) {
      return r || M(t, 1, this.length), this[t];
    }, f.prototype.readUInt16LE = function (t, r) {
      return r || M(t, 2, this.length), this[t] | this[t + 1] << 8;
    }, f.prototype.readUInt16BE = function (t, r) {
      return r || M(t, 2, this.length), this[t] << 8 | this[t + 1];
    }, f.prototype.readUInt32LE = function (t, r) {
      return r || M(t, 4, this.length), (this[t] | this[t + 1] << 8 | this[t + 2] << 16) + 16777216 * this[t + 3];
    }, f.prototype.readUInt32BE = function (t, r) {
      return r || M(t, 4, this.length), 16777216 * this[t] + (this[t + 1] << 16 | this[t + 2] << 8 | this[t + 3]);
    }, f.prototype.readIntLE = function (t, r, e) {
      t |= 0, r |= 0, e || M(t, r, this.length);

      for (var n = this[t], i = 1, o = 0; ++o < r && (i *= 256);) n += this[t + o] * i;

      return n >= (i *= 128) && (n -= Math.pow(2, 8 * r)), n;
    }, f.prototype.readIntBE = function (t, r, e) {
      t |= 0, r |= 0, e || M(t, r, this.length);

      for (var n = r, i = 1, o = this[t + --n]; n > 0 && (i *= 256);) o += this[t + --n] * i;

      return o >= (i *= 128) && (o -= Math.pow(2, 8 * r)), o;
    }, f.prototype.readInt8 = function (t, r) {
      return r || M(t, 1, this.length), 128 & this[t] ? -1 * (255 - this[t] + 1) : this[t];
    }, f.prototype.readInt16LE = function (t, r) {
      r || M(t, 2, this.length);
      var e = this[t] | this[t + 1] << 8;
      return 32768 & e ? 4294901760 | e : e;
    }, f.prototype.readInt16BE = function (t, r) {
      r || M(t, 2, this.length);
      var e = this[t + 1] | this[t] << 8;
      return 32768 & e ? 4294901760 | e : e;
    }, f.prototype.readInt32LE = function (t, r) {
      return r || M(t, 4, this.length), this[t] | this[t + 1] << 8 | this[t + 2] << 16 | this[t + 3] << 24;
    }, f.prototype.readInt32BE = function (t, r) {
      return r || M(t, 4, this.length), this[t] << 24 | this[t + 1] << 16 | this[t + 2] << 8 | this[t + 3];
    }, f.prototype.readFloatLE = function (t, r) {
      return r || M(t, 4, this.length), e.read(this, t, !0, 23, 4);
    }, f.prototype.readFloatBE = function (t, r) {
      return r || M(t, 4, this.length), e.read(this, t, !1, 23, 4);
    }, f.prototype.readDoubleLE = function (t, r) {
      return r || M(t, 8, this.length), e.read(this, t, !0, 52, 8);
    }, f.prototype.readDoubleBE = function (t, r) {
      return r || M(t, 8, this.length), e.read(this, t, !1, 52, 8);
    }, f.prototype.writeUIntLE = function (t, r, e, n) {
      (t = +t, r |= 0, e |= 0, n) || k(this, t, r, e, Math.pow(2, 8 * e) - 1, 0);
      var i = 1,
          o = 0;

      for (this[r] = 255 & t; ++o < e && (i *= 256);) this[r + o] = t / i & 255;

      return r + e;
    }, f.prototype.writeUIntBE = function (t, r, e, n) {
      (t = +t, r |= 0, e |= 0, n) || k(this, t, r, e, Math.pow(2, 8 * e) - 1, 0);
      var i = e - 1,
          o = 1;

      for (this[r + i] = 255 & t; --i >= 0 && (o *= 256);) this[r + i] = t / o & 255;

      return r + e;
    }, f.prototype.writeUInt8 = function (t, r, e) {
      return t = +t, r |= 0, e || k(this, t, r, 1, 255, 0), f.TYPED_ARRAY_SUPPORT || (t = Math.floor(t)), this[r] = 255 & t, r + 1;
    }, f.prototype.writeUInt16LE = function (t, r, e) {
      return t = +t, r |= 0, e || k(this, t, r, 2, 65535, 0), f.TYPED_ARRAY_SUPPORT ? (this[r] = 255 & t, this[r + 1] = t >>> 8) : N(this, t, r, !0), r + 2;
    }, f.prototype.writeUInt16BE = function (t, r, e) {
      return t = +t, r |= 0, e || k(this, t, r, 2, 65535, 0), f.TYPED_ARRAY_SUPPORT ? (this[r] = t >>> 8, this[r + 1] = 255 & t) : N(this, t, r, !1), r + 2;
    }, f.prototype.writeUInt32LE = function (t, r, e) {
      return t = +t, r |= 0, e || k(this, t, r, 4, 4294967295, 0), f.TYPED_ARRAY_SUPPORT ? (this[r + 3] = t >>> 24, this[r + 2] = t >>> 16, this[r + 1] = t >>> 8, this[r] = 255 & t) : z(this, t, r, !0), r + 4;
    }, f.prototype.writeUInt32BE = function (t, r, e) {
      return t = +t, r |= 0, e || k(this, t, r, 4, 4294967295, 0), f.TYPED_ARRAY_SUPPORT ? (this[r] = t >>> 24, this[r + 1] = t >>> 16, this[r + 2] = t >>> 8, this[r + 3] = 255 & t) : z(this, t, r, !1), r + 4;
    }, f.prototype.writeIntLE = function (t, r, e, n) {
      if (t = +t, r |= 0, !n) {
        var i = Math.pow(2, 8 * e - 1);
        k(this, t, r, e, i - 1, -i);
      }

      var o = 0,
          u = 1,
          f = 0;

      for (this[r] = 255 & t; ++o < e && (u *= 256);) t < 0 && 0 === f && 0 !== this[r + o - 1] && (f = 1), this[r + o] = (t / u >> 0) - f & 255;

      return r + e;
    }, f.prototype.writeIntBE = function (t, r, e, n) {
      if (t = +t, r |= 0, !n) {
        var i = Math.pow(2, 8 * e - 1);
        k(this, t, r, e, i - 1, -i);
      }

      var o = e - 1,
          u = 1,
          f = 0;

      for (this[r + o] = 255 & t; --o >= 0 && (u *= 256);) t < 0 && 0 === f && 0 !== this[r + o + 1] && (f = 1), this[r + o] = (t / u >> 0) - f & 255;

      return r + e;
    }, f.prototype.writeInt8 = function (t, r, e) {
      return t = +t, r |= 0, e || k(this, t, r, 1, 127, -128), f.TYPED_ARRAY_SUPPORT || (t = Math.floor(t)), t < 0 && (t = 255 + t + 1), this[r] = 255 & t, r + 1;
    }, f.prototype.writeInt16LE = function (t, r, e) {
      return t = +t, r |= 0, e || k(this, t, r, 2, 32767, -32768), f.TYPED_ARRAY_SUPPORT ? (this[r] = 255 & t, this[r + 1] = t >>> 8) : N(this, t, r, !0), r + 2;
    }, f.prototype.writeInt16BE = function (t, r, e) {
      return t = +t, r |= 0, e || k(this, t, r, 2, 32767, -32768), f.TYPED_ARRAY_SUPPORT ? (this[r] = t >>> 8, this[r + 1] = 255 & t) : N(this, t, r, !1), r + 2;
    }, f.prototype.writeInt32LE = function (t, r, e) {
      return t = +t, r |= 0, e || k(this, t, r, 4, 2147483647, -2147483648), f.TYPED_ARRAY_SUPPORT ? (this[r] = 255 & t, this[r + 1] = t >>> 8, this[r + 2] = t >>> 16, this[r + 3] = t >>> 24) : z(this, t, r, !0), r + 4;
    }, f.prototype.writeInt32BE = function (t, r, e) {
      return t = +t, r |= 0, e || k(this, t, r, 4, 2147483647, -2147483648), t < 0 && (t = 4294967295 + t + 1), f.TYPED_ARRAY_SUPPORT ? (this[r] = t >>> 24, this[r + 1] = t >>> 16, this[r + 2] = t >>> 8, this[r + 3] = 255 & t) : z(this, t, r, !1), r + 4;
    }, f.prototype.writeFloatLE = function (t, r, e) {
      return j(this, t, r, !0, e);
    }, f.prototype.writeFloatBE = function (t, r, e) {
      return j(this, t, r, !1, e);
    }, f.prototype.writeDoubleLE = function (t, r, e) {
      return q(this, t, r, !0, e);
    }, f.prototype.writeDoubleBE = function (t, r, e) {
      return q(this, t, r, !1, e);
    }, f.prototype.copy = function (t, r, e, n) {
      if (e || (e = 0), n || 0 === n || (n = this.length), r >= t.length && (r = t.length), r || (r = 0), n > 0 && n < e && (n = e), n === e) return 0;
      if (0 === t.length || 0 === this.length) return 0;
      if (r < 0) throw new RangeError("targetStart out of bounds");
      if (e < 0 || e >= this.length) throw new RangeError("sourceStart out of bounds");
      if (n < 0) throw new RangeError("sourceEnd out of bounds");
      n > this.length && (n = this.length), t.length - r < n - e && (n = t.length - r + e);
      var i,
          o = n - e;
      if (this === t && e < r && r < n) for (i = o - 1; i >= 0; --i) t[i + r] = this[i + e];else if (o < 1e3 || !f.TYPED_ARRAY_SUPPORT) for (i = 0; i < o; ++i) t[i + r] = this[i + e];else Uint8Array.prototype.set.call(t, this.subarray(e, e + o), r);
      return o;
    }, f.prototype.fill = function (t, r, e, n) {
      if ("string" == typeof t) {
        if ("string" == typeof r ? (n = r, r = 0, e = this.length) : "string" == typeof e && (n = e, e = this.length), 1 === t.length) {
          var i = t.charCodeAt(0);
          i < 256 && (t = i);
        }

        if (void 0 !== n && "string" != typeof n) throw new TypeError("encoding must be a string");
        if ("string" == typeof n && !f.isEncoding(n)) throw new TypeError("Unknown encoding: " + n);
      } else "number" == typeof t && (t &= 255);

      if (r < 0 || this.length < r || this.length < e) throw new RangeError("Out of range index");
      if (e <= r) return this;
      var o;
      if (r >>>= 0, e = void 0 === e ? this.length : e >>> 0, t || (t = 0), "number" == typeof t) for (o = r; o < e; ++o) this[o] = t;else {
        var u = f.isBuffer(t) ? t : $(new f(t, n).toString()),
            s = u.length;

        for (o = 0; o < e - r; ++o) this[o + r] = u[o % s];
      }
      return this;
    };
    var V = /[^+\/0-9A-Za-z-_]/g;

    function X(t) {
      if ((t = J(t).replace(V, "")).length < 2) return "";

      for (; t.length % 4 != 0;) t += "=";

      return t;
    }

    function J(t) {
      return t.trim ? t.trim() : t.replace(/^\s+|\s+$/g, "");
    }

    function Z(t) {
      return t < 16 ? "0" + t.toString(16) : t.toString(16);
    }

    function $(t, r) {
      var e;
      r = r || 1 / 0;

      for (var n = t.length, i = null, o = [], u = 0; u < n; ++u) {
        if ((e = t.charCodeAt(u)) > 55295 && e < 57344) {
          if (!i) {
            if (e > 56319) {
              (r -= 3) > -1 && o.push(239, 191, 189);
              continue;
            }

            if (u + 1 === n) {
              (r -= 3) > -1 && o.push(239, 191, 189);
              continue;
            }

            i = e;
            continue;
          }

          if (e < 56320) {
            (r -= 3) > -1 && o.push(239, 191, 189), i = e;
            continue;
          }

          e = 65536 + (i - 55296 << 10 | e - 56320);
        } else i && (r -= 3) > -1 && o.push(239, 191, 189);

        if (i = null, e < 128) {
          if ((r -= 1) < 0) break;
          o.push(e);
        } else if (e < 2048) {
          if ((r -= 2) < 0) break;
          o.push(e >> 6 | 192, 63 & e | 128);
        } else if (e < 65536) {
          if ((r -= 3) < 0) break;
          o.push(e >> 12 | 224, e >> 6 & 63 | 128, 63 & e | 128);
        } else {
          if (!(e < 1114112)) throw new Error("Invalid code point");
          if ((r -= 4) < 0) break;
          o.push(e >> 18 | 240, e >> 12 & 63 | 128, e >> 6 & 63 | 128, 63 & e | 128);
        }
      }

      return o;
    }

    function G(t) {
      for (var r = [], e = 0; e < t.length; ++e) r.push(255 & t.charCodeAt(e));

      return r;
    }

    function H(t, r) {
      for (var e, n, i, o = [], u = 0; u < t.length && !((r -= 2) < 0); ++u) n = (e = t.charCodeAt(u)) >> 8, i = e % 256, o.push(i), o.push(n);

      return o;
    }

    function K(t) {
      return r.toByteArray(X(t));
    }

    function Q(t, r, e, n) {
      for (var i = 0; i < n && !(i + e >= r.length || i >= t.length); ++i) r[i + e] = t[i];

      return i;
    }

    function W(t) {
      return t != t;
    }
  }, {
    "base64-js": "yh9p",
    "ieee754": "JgNJ",
    "isarray": "REa7",
    "buffer": "dskh"
  }],
  "38Wu": [function (require, module, exports) {
    var r = require("buffer"),
        e = r.Buffer;

    function n(r, e) {
      for (var n in r) e[n] = r[n];
    }

    function o(r, n, o) {
      return e(r, n, o);
    }

    e.from && e.alloc && e.allocUnsafe && e.allocUnsafeSlow ? module.exports = r : (n(r, exports), exports.Buffer = o), n(e, o), o.from = function (r, n, o) {
      if ("number" == typeof r) throw new TypeError("Argument must not be a number");
      return e(r, n, o);
    }, o.alloc = function (r, n, o) {
      if ("number" != typeof r) throw new TypeError("Argument must be a number");
      var f = e(r);
      return void 0 !== n ? "string" == typeof o ? f.fill(n, o) : f.fill(n) : f.fill(0), f;
    }, o.allocUnsafe = function (r) {
      if ("number" != typeof r) throw new TypeError("Argument must be a number");
      return e(r);
    }, o.allocUnsafeSlow = function (e) {
      if ("number" != typeof e) throw new TypeError("Argument must be a number");
      return r.SlowBuffer(e);
    };
  }, {
    "buffer": "dskh"
  }],
  "Q14w": [function (require, module, exports) {
    var Buffer = require("buffer").Buffer;

    var r = require("buffer").Buffer;

    function t(r) {
      return Array.isArray ? Array.isArray(r) : "[object Array]" === a(r);
    }

    function e(r) {
      return "boolean" == typeof r;
    }

    function n(r) {
      return null === r;
    }

    function o(r) {
      return null == r;
    }

    function i(r) {
      return "number" == typeof r;
    }

    function u(r) {
      return "string" == typeof r;
    }

    function s(r) {
      return "symbol" == typeof r;
    }

    function f(r) {
      return void 0 === r;
    }

    function p(r) {
      return "[object RegExp]" === a(r);
    }

    function c(r) {
      return "object" == typeof r && null !== r;
    }

    function l(r) {
      return "[object Date]" === a(r);
    }

    function y(r) {
      return "[object Error]" === a(r) || r instanceof Error;
    }

    function x(r) {
      return "function" == typeof r;
    }

    function b(r) {
      return null === r || "boolean" == typeof r || "number" == typeof r || "string" == typeof r || "symbol" == typeof r || void 0 === r;
    }

    function a(r) {
      return Object.prototype.toString.call(r);
    }

    exports.isArray = t, exports.isBoolean = e, exports.isNull = n, exports.isNullOrUndefined = o, exports.isNumber = i, exports.isString = u, exports.isSymbol = s, exports.isUndefined = f, exports.isRegExp = p, exports.isObject = c, exports.isDate = l, exports.isError = y, exports.isFunction = x, exports.isPrimitive = b, exports.isBuffer = r.isBuffer;
  }, {
    "buffer": "dskh"
  }],
  "70rD": [function (require, module, exports) {}, {}],
  "wl+m": [function (require, module, exports) {
    "use strict";

    function t(t, n) {
      if (!(t instanceof n)) throw new TypeError("Cannot call a class as a function");
    }

    var n = require("safe-buffer").Buffer,
        e = require("util");

    function i(t, n, e) {
      t.copy(n, e);
    }

    module.exports = function () {
      function e() {
        t(this, e), this.head = null, this.tail = null, this.length = 0;
      }

      return e.prototype.push = function (t) {
        var n = {
          data: t,
          next: null
        };
        this.length > 0 ? this.tail.next = n : this.head = n, this.tail = n, ++this.length;
      }, e.prototype.unshift = function (t) {
        var n = {
          data: t,
          next: this.head
        };
        0 === this.length && (this.tail = n), this.head = n, ++this.length;
      }, e.prototype.shift = function () {
        if (0 !== this.length) {
          var t = this.head.data;
          return 1 === this.length ? this.head = this.tail = null : this.head = this.head.next, --this.length, t;
        }
      }, e.prototype.clear = function () {
        this.head = this.tail = null, this.length = 0;
      }, e.prototype.join = function (t) {
        if (0 === this.length) return "";

        for (var n = this.head, e = "" + n.data; n = n.next;) e += t + n.data;

        return e;
      }, e.prototype.concat = function (t) {
        if (0 === this.length) return n.alloc(0);
        if (1 === this.length) return this.head.data;

        for (var e = n.allocUnsafe(t >>> 0), h = this.head, a = 0; h;) i(h.data, e, a), a += h.data.length, h = h.next;

        return e;
      }, e;
    }(), e && e.inspect && e.inspect.custom && (module.exports.prototype[e.inspect.custom] = function () {
      var t = e.inspect({
        length: this.length
      });
      return this.constructor.name + " " + t;
    });
  }, {
    "safe-buffer": "38Wu",
    "util": "70rD"
  }],
  "GRUB": [function (require, module, exports) {
    "use strict";

    var t = require("process-nextick-args");

    function e(e, a) {
      var r = this,
          s = this._readableState && this._readableState.destroyed,
          d = this._writableState && this._writableState.destroyed;
      return s || d ? (a ? a(e) : !e || this._writableState && this._writableState.errorEmitted || t.nextTick(i, this, e), this) : (this._readableState && (this._readableState.destroyed = !0), this._writableState && (this._writableState.destroyed = !0), this._destroy(e || null, function (e) {
        !a && e ? (t.nextTick(i, r, e), r._writableState && (r._writableState.errorEmitted = !0)) : a && a(e);
      }), this);
    }

    function a() {
      this._readableState && (this._readableState.destroyed = !1, this._readableState.reading = !1, this._readableState.ended = !1, this._readableState.endEmitted = !1), this._writableState && (this._writableState.destroyed = !1, this._writableState.ended = !1, this._writableState.ending = !1, this._writableState.finished = !1, this._writableState.errorEmitted = !1);
    }

    function i(t, e) {
      t.emit("error", e);
    }

    module.exports = {
      destroy: e,
      undestroy: a
    };
  }, {
    "process-nextick-args": "Yj0v"
  }],
  "yM1o": [function (require, module, exports) {
    var global = arguments[3];
    var r = arguments[3];

    function t(r, t) {
      if (e("noDeprecation")) return r;
      var n = !1;
      return function () {
        if (!n) {
          if (e("throwDeprecation")) throw new Error(t);
          e("traceDeprecation") ? console.trace(t) : console.warn(t), n = !0;
        }

        return r.apply(this, arguments);
      };
    }

    function e(t) {
      try {
        if (!r.localStorage) return !1;
      } catch (n) {
        return !1;
      }

      var e = r.localStorage[t];
      return null != e && "true" === String(e).toLowerCase();
    }

    module.exports = t;
  }, {}],
  "WSyY": [function (require, module, exports) {
    var process = require("process");

    var global = arguments[3];

    var e = require("process"),
        t = arguments[3],
        n = require("process-nextick-args");

    function r(e, t, n) {
      this.chunk = e, this.encoding = t, this.callback = n, this.next = null;
    }

    function i(e) {
      var t = this;
      this.next = null, this.entry = null, this.finish = function () {
        W(t, e);
      };
    }

    module.exports = g;
    var o,
        s = !e.browser && ["v0.10", "v0.9."].indexOf(e.version.slice(0, 5)) > -1 ? setImmediate : n.nextTick;
    g.WritableState = y;

    var f = require("core-util-is");

    f.inherits = require("inherits");

    var u = {
      deprecate: require("util-deprecate")
    },
        a = require("./internal/streams/stream"),
        c = require("safe-buffer").Buffer,
        d = t.Uint8Array || function () {};

    function l(e) {
      return c.from(e);
    }

    function h(e) {
      return c.isBuffer(e) || e instanceof d;
    }

    var b,
        p = require("./internal/streams/destroy");

    function w() {}

    function y(e, t) {
      o = o || require("./_stream_duplex"), e = e || {};
      var n = t instanceof o;
      this.objectMode = !!e.objectMode, n && (this.objectMode = this.objectMode || !!e.writableObjectMode);
      var r = e.highWaterMark,
          s = e.writableHighWaterMark,
          f = this.objectMode ? 16 : 16384;
      this.highWaterMark = r || 0 === r ? r : n && (s || 0 === s) ? s : f, this.highWaterMark = Math.floor(this.highWaterMark), this.finalCalled = !1, this.needDrain = !1, this.ending = !1, this.ended = !1, this.finished = !1, this.destroyed = !1;
      var u = !1 === e.decodeStrings;
      this.decodeStrings = !u, this.defaultEncoding = e.defaultEncoding || "utf8", this.length = 0, this.writing = !1, this.corked = 0, this.sync = !0, this.bufferProcessing = !1, this.onwrite = function (e) {
        S(t, e);
      }, this.writecb = null, this.writelen = 0, this.bufferedRequest = null, this.lastBufferedRequest = null, this.pendingcb = 0, this.prefinished = !1, this.errorEmitted = !1, this.bufferedRequestCount = 0, this.corkedRequestsFree = new i(this);
    }

    function g(e) {
      if (o = o || require("./_stream_duplex"), !(b.call(g, this) || this instanceof o)) return new g(e);
      this._writableState = new y(e, this), this.writable = !0, e && ("function" == typeof e.write && (this._write = e.write), "function" == typeof e.writev && (this._writev = e.writev), "function" == typeof e.destroy && (this._destroy = e.destroy), "function" == typeof e.final && (this._final = e.final)), a.call(this);
    }

    function k(e, t) {
      var r = new Error("write after end");
      e.emit("error", r), n.nextTick(t, r);
    }

    function v(e, t, r, i) {
      var o = !0,
          s = !1;
      return null === r ? s = new TypeError("May not write null values to stream") : "string" == typeof r || void 0 === r || t.objectMode || (s = new TypeError("Invalid non-string/buffer chunk")), s && (e.emit("error", s), n.nextTick(i, s), o = !1), o;
    }

    function q(e, t, n) {
      return e.objectMode || !1 === e.decodeStrings || "string" != typeof t || (t = c.from(t, n)), t;
    }

    function _(e, t, n, r, i, o) {
      if (!n) {
        var s = q(t, r, i);
        r !== s && (n = !0, i = "buffer", r = s);
      }

      var f = t.objectMode ? 1 : r.length;
      t.length += f;
      var u = t.length < t.highWaterMark;

      if (u || (t.needDrain = !0), t.writing || t.corked) {
        var a = t.lastBufferedRequest;
        t.lastBufferedRequest = {
          chunk: r,
          encoding: i,
          isBuf: n,
          callback: o,
          next: null
        }, a ? a.next = t.lastBufferedRequest : t.bufferedRequest = t.lastBufferedRequest, t.bufferedRequestCount += 1;
      } else m(e, t, !1, f, r, i, o);

      return u;
    }

    function m(e, t, n, r, i, o, s) {
      t.writelen = r, t.writecb = s, t.writing = !0, t.sync = !0, n ? e._writev(i, t.onwrite) : e._write(i, o, t.onwrite), t.sync = !1;
    }

    function x(e, t, r, i, o) {
      --t.pendingcb, r ? (n.nextTick(o, i), n.nextTick(T, e, t), e._writableState.errorEmitted = !0, e.emit("error", i)) : (o(i), e._writableState.errorEmitted = !0, e.emit("error", i), T(e, t));
    }

    function R(e) {
      e.writing = !1, e.writecb = null, e.length -= e.writelen, e.writelen = 0;
    }

    function S(e, t) {
      var n = e._writableState,
          r = n.sync,
          i = n.writecb;
      if (R(n), t) x(e, n, r, t, i);else {
        var o = E(n);
        o || n.corked || n.bufferProcessing || !n.bufferedRequest || j(e, n), r ? s(M, e, n, o, i) : M(e, n, o, i);
      }
    }

    function M(e, t, n, r) {
      n || B(e, t), t.pendingcb--, r(), T(e, t);
    }

    function B(e, t) {
      0 === t.length && t.needDrain && (t.needDrain = !1, e.emit("drain"));
    }

    function j(e, t) {
      t.bufferProcessing = !0;
      var n = t.bufferedRequest;

      if (e._writev && n && n.next) {
        var r = t.bufferedRequestCount,
            o = new Array(r),
            s = t.corkedRequestsFree;
        s.entry = n;

        for (var f = 0, u = !0; n;) o[f] = n, n.isBuf || (u = !1), n = n.next, f += 1;

        o.allBuffers = u, m(e, t, !0, t.length, o, "", s.finish), t.pendingcb++, t.lastBufferedRequest = null, s.next ? (t.corkedRequestsFree = s.next, s.next = null) : t.corkedRequestsFree = new i(t), t.bufferedRequestCount = 0;
      } else {
        for (; n;) {
          var a = n.chunk,
              c = n.encoding,
              d = n.callback;
          if (m(e, t, !1, t.objectMode ? 1 : a.length, a, c, d), n = n.next, t.bufferedRequestCount--, t.writing) break;
        }

        null === n && (t.lastBufferedRequest = null);
      }

      t.bufferedRequest = n, t.bufferProcessing = !1;
    }

    function E(e) {
      return e.ending && 0 === e.length && null === e.bufferedRequest && !e.finished && !e.writing;
    }

    function C(e, t) {
      e._final(function (n) {
        t.pendingcb--, n && e.emit("error", n), t.prefinished = !0, e.emit("prefinish"), T(e, t);
      });
    }

    function P(e, t) {
      t.prefinished || t.finalCalled || ("function" == typeof e._final ? (t.pendingcb++, t.finalCalled = !0, n.nextTick(C, e, t)) : (t.prefinished = !0, e.emit("prefinish")));
    }

    function T(e, t) {
      var n = E(t);
      return n && (P(e, t), 0 === t.pendingcb && (t.finished = !0, e.emit("finish"))), n;
    }

    function F(e, t, r) {
      t.ending = !0, T(e, t), r && (t.finished ? n.nextTick(r) : e.once("finish", r)), t.ended = !0, e.writable = !1;
    }

    function W(e, t, n) {
      var r = e.entry;

      for (e.entry = null; r;) {
        var i = r.callback;
        t.pendingcb--, i(n), r = r.next;
      }

      t.corkedRequestsFree ? t.corkedRequestsFree.next = e : t.corkedRequestsFree = e;
    }

    f.inherits(g, a), y.prototype.getBuffer = function () {
      for (var e = this.bufferedRequest, t = []; e;) t.push(e), e = e.next;

      return t;
    }, function () {
      try {
        Object.defineProperty(y.prototype, "buffer", {
          get: u.deprecate(function () {
            return this.getBuffer();
          }, "_writableState.buffer is deprecated. Use _writableState.getBuffer instead.", "DEP0003")
        });
      } catch (e) {}
    }(), "function" == typeof Symbol && Symbol.hasInstance && "function" == typeof Function.prototype[Symbol.hasInstance] ? (b = Function.prototype[Symbol.hasInstance], Object.defineProperty(g, Symbol.hasInstance, {
      value: function value(e) {
        return !!b.call(this, e) || this === g && e && e._writableState instanceof y;
      }
    })) : b = function b(e) {
      return e instanceof this;
    }, g.prototype.pipe = function () {
      this.emit("error", new Error("Cannot pipe, not readable"));
    }, g.prototype.write = function (e, t, n) {
      var r = this._writableState,
          i = !1,
          o = !r.objectMode && h(e);
      return o && !c.isBuffer(e) && (e = l(e)), "function" == typeof t && (n = t, t = null), o ? t = "buffer" : t || (t = r.defaultEncoding), "function" != typeof n && (n = w), r.ended ? k(this, n) : (o || v(this, r, e, n)) && (r.pendingcb++, i = _(this, r, o, e, t, n)), i;
    }, g.prototype.cork = function () {
      this._writableState.corked++;
    }, g.prototype.uncork = function () {
      var e = this._writableState;
      e.corked && (e.corked--, e.writing || e.corked || e.finished || e.bufferProcessing || !e.bufferedRequest || j(this, e));
    }, g.prototype.setDefaultEncoding = function (e) {
      if ("string" == typeof e && (e = e.toLowerCase()), !(["hex", "utf8", "utf-8", "ascii", "binary", "base64", "ucs2", "ucs-2", "utf16le", "utf-16le", "raw"].indexOf((e + "").toLowerCase()) > -1)) throw new TypeError("Unknown encoding: " + e);
      return this._writableState.defaultEncoding = e, this;
    }, Object.defineProperty(g.prototype, "writableHighWaterMark", {
      enumerable: !1,
      get: function get() {
        return this._writableState.highWaterMark;
      }
    }), g.prototype._write = function (e, t, n) {
      n(new Error("_write() is not implemented"));
    }, g.prototype._writev = null, g.prototype.end = function (e, t, n) {
      var r = this._writableState;
      "function" == typeof e ? (n = e, e = null, t = null) : "function" == typeof t && (n = t, t = null), null != e && this.write(e, t), r.corked && (r.corked = 1, this.uncork()), r.ending || r.finished || F(this, r, n);
    }, Object.defineProperty(g.prototype, "destroyed", {
      get: function get() {
        return void 0 !== this._writableState && this._writableState.destroyed;
      },
      set: function set(e) {
        this._writableState && (this._writableState.destroyed = e);
      }
    }), g.prototype.destroy = p.destroy, g.prototype._undestroy = p.undestroy, g.prototype._destroy = function (e, t) {
      this.end(), t(e);
    };
  }, {
    "process-nextick-args": "Yj0v",
    "core-util-is": "Q14w",
    "inherits": "4Bm0",
    "util-deprecate": "yM1o",
    "./internal/streams/stream": "1ExO",
    "safe-buffer": "38Wu",
    "./internal/streams/destroy": "GRUB",
    "./_stream_duplex": "Hba+",
    "process": "pBGv"
  }],
  "Hba+": [function (require, module, exports) {
    "use strict";

    var e = require("process-nextick-args"),
        t = Object.keys || function (e) {
      var t = [];

      for (var r in e) t.push(r);

      return t;
    };

    module.exports = l;

    var r = require("core-util-is");

    r.inherits = require("inherits");

    var i = require("./_stream_readable"),
        a = require("./_stream_writable");

    r.inherits(l, i);

    for (var o = t(a.prototype), s = 0; s < o.length; s++) {
      var n = o[s];
      l.prototype[n] || (l.prototype[n] = a.prototype[n]);
    }

    function l(e) {
      if (!(this instanceof l)) return new l(e);
      i.call(this, e), a.call(this, e), e && !1 === e.readable && (this.readable = !1), e && !1 === e.writable && (this.writable = !1), this.allowHalfOpen = !0, e && !1 === e.allowHalfOpen && (this.allowHalfOpen = !1), this.once("end", h);
    }

    function h() {
      this.allowHalfOpen || this._writableState.ended || e.nextTick(d, this);
    }

    function d(e) {
      e.end();
    }

    Object.defineProperty(l.prototype, "writableHighWaterMark", {
      enumerable: !1,
      get: function get() {
        return this._writableState.highWaterMark;
      }
    }), Object.defineProperty(l.prototype, "destroyed", {
      get: function get() {
        return void 0 !== this._readableState && void 0 !== this._writableState && this._readableState.destroyed && this._writableState.destroyed;
      },
      set: function set(e) {
        void 0 !== this._readableState && void 0 !== this._writableState && (this._readableState.destroyed = e, this._writableState.destroyed = e);
      }
    }), l.prototype._destroy = function (t, r) {
      this.push(null), this.end(), e.nextTick(r, t);
    };
  }, {
    "process-nextick-args": "Yj0v",
    "core-util-is": "Q14w",
    "inherits": "4Bm0",
    "./_stream_readable": "DHrQ",
    "./_stream_writable": "WSyY"
  }],
  "z0rv": [function (require, module, exports) {
    "use strict";

    var t = require("safe-buffer").Buffer,
        e = t.isEncoding || function (t) {
      switch ((t = "" + t) && t.toLowerCase()) {
        case "hex":
        case "utf8":
        case "utf-8":
        case "ascii":
        case "binary":
        case "base64":
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
        case "raw":
          return !0;

        default:
          return !1;
      }
    };

    function s(t) {
      if (!t) return "utf8";

      for (var e;;) switch (t) {
        case "utf8":
        case "utf-8":
          return "utf8";

        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return "utf16le";

        case "latin1":
        case "binary":
          return "latin1";

        case "base64":
        case "ascii":
        case "hex":
          return t;

        default:
          if (e) return;
          t = ("" + t).toLowerCase(), e = !0;
      }
    }

    function i(i) {
      var a = s(i);
      if ("string" != typeof a && (t.isEncoding === e || !e(i))) throw new Error("Unknown encoding: " + i);
      return a || i;
    }

    function a(e) {
      var s;

      switch (this.encoding = i(e), this.encoding) {
        case "utf16le":
          this.text = c, this.end = f, s = 4;
          break;

        case "utf8":
          this.fillLast = l, s = 4;
          break;

        case "base64":
          this.text = d, this.end = g, s = 3;
          break;

        default:
          return this.write = N, void (this.end = v);
      }

      this.lastNeed = 0, this.lastTotal = 0, this.lastChar = t.allocUnsafe(s);
    }

    function r(t) {
      return t <= 127 ? 0 : t >> 5 == 6 ? 2 : t >> 4 == 14 ? 3 : t >> 3 == 30 ? 4 : t >> 6 == 2 ? -1 : -2;
    }

    function n(t, e, s) {
      var i = e.length - 1;
      if (i < s) return 0;
      var a = r(e[i]);
      return a >= 0 ? (a > 0 && (t.lastNeed = a - 1), a) : --i < s || -2 === a ? 0 : (a = r(e[i])) >= 0 ? (a > 0 && (t.lastNeed = a - 2), a) : --i < s || -2 === a ? 0 : (a = r(e[i])) >= 0 ? (a > 0 && (2 === a ? a = 0 : t.lastNeed = a - 3), a) : 0;
    }

    function h(t, e, s) {
      if (128 != (192 & e[0])) return t.lastNeed = 0, "�";

      if (t.lastNeed > 1 && e.length > 1) {
        if (128 != (192 & e[1])) return t.lastNeed = 1, "�";
        if (t.lastNeed > 2 && e.length > 2 && 128 != (192 & e[2])) return t.lastNeed = 2, "�";
      }
    }

    function l(t) {
      var e = this.lastTotal - this.lastNeed,
          s = h(this, t, e);
      return void 0 !== s ? s : this.lastNeed <= t.length ? (t.copy(this.lastChar, e, 0, this.lastNeed), this.lastChar.toString(this.encoding, 0, this.lastTotal)) : (t.copy(this.lastChar, e, 0, t.length), void (this.lastNeed -= t.length));
    }

    function u(t, e) {
      var s = n(this, t, e);
      if (!this.lastNeed) return t.toString("utf8", e);
      this.lastTotal = s;
      var i = t.length - (s - this.lastNeed);
      return t.copy(this.lastChar, 0, i), t.toString("utf8", e, i);
    }

    function o(t) {
      var e = t && t.length ? this.write(t) : "";
      return this.lastNeed ? e + "�" : e;
    }

    function c(t, e) {
      if ((t.length - e) % 2 == 0) {
        var s = t.toString("utf16le", e);

        if (s) {
          var i = s.charCodeAt(s.length - 1);
          if (i >= 55296 && i <= 56319) return this.lastNeed = 2, this.lastTotal = 4, this.lastChar[0] = t[t.length - 2], this.lastChar[1] = t[t.length - 1], s.slice(0, -1);
        }

        return s;
      }

      return this.lastNeed = 1, this.lastTotal = 2, this.lastChar[0] = t[t.length - 1], t.toString("utf16le", e, t.length - 1);
    }

    function f(t) {
      var e = t && t.length ? this.write(t) : "";

      if (this.lastNeed) {
        var s = this.lastTotal - this.lastNeed;
        return e + this.lastChar.toString("utf16le", 0, s);
      }

      return e;
    }

    function d(t, e) {
      var s = (t.length - e) % 3;
      return 0 === s ? t.toString("base64", e) : (this.lastNeed = 3 - s, this.lastTotal = 3, 1 === s ? this.lastChar[0] = t[t.length - 1] : (this.lastChar[0] = t[t.length - 2], this.lastChar[1] = t[t.length - 1]), t.toString("base64", e, t.length - s));
    }

    function g(t) {
      var e = t && t.length ? this.write(t) : "";
      return this.lastNeed ? e + this.lastChar.toString("base64", 0, 3 - this.lastNeed) : e;
    }

    function N(t) {
      return t.toString(this.encoding);
    }

    function v(t) {
      return t && t.length ? this.write(t) : "";
    }

    exports.StringDecoder = a, a.prototype.write = function (t) {
      if (0 === t.length) return "";
      var e, s;

      if (this.lastNeed) {
        if (void 0 === (e = this.fillLast(t))) return "";
        s = this.lastNeed, this.lastNeed = 0;
      } else s = 0;

      return s < t.length ? e ? e + this.text(t, s) : this.text(t, s) : e || "";
    }, a.prototype.end = o, a.prototype.text = u, a.prototype.fillLast = function (t) {
      if (this.lastNeed <= t.length) return t.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed), this.lastChar.toString(this.encoding, 0, this.lastTotal);
      t.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, t.length), this.lastNeed -= t.length;
    };
  }, {
    "safe-buffer": "38Wu"
  }],
  "DHrQ": [function (require, module, exports) {
    var global = arguments[3];

    var process = require("process");

    var e = arguments[3],
        t = require("process"),
        n = require("process-nextick-args");

    module.exports = _;

    var r,
        i = require("isarray");

    _.ReadableState = w;

    var a = require("events").EventEmitter,
        d = function d(e, t) {
      return e.listeners(t).length;
    },
        o = require("./internal/streams/stream"),
        s = require("safe-buffer").Buffer,
        u = e.Uint8Array || function () {};

    function l(e) {
      return s.from(e);
    }

    function h(e) {
      return s.isBuffer(e) || e instanceof u;
    }

    var p = require("core-util-is");

    p.inherits = require("inherits");

    var f = require("util"),
        c = void 0;

    c = f && f.debuglog ? f.debuglog("stream") : function () {};

    var g,
        b = require("./internal/streams/BufferList"),
        m = require("./internal/streams/destroy");

    p.inherits(_, o);
    var v = ["error", "close", "destroy", "pause", "resume"];

    function y(e, t, n) {
      if ("function" == typeof e.prependListener) return e.prependListener(t, n);
      e._events && e._events[t] ? i(e._events[t]) ? e._events[t].unshift(n) : e._events[t] = [n, e._events[t]] : e.on(t, n);
    }

    function w(e, t) {
      e = e || {};

      var n = t instanceof (r = r || require("./_stream_duplex"));

      this.objectMode = !!e.objectMode, n && (this.objectMode = this.objectMode || !!e.readableObjectMode);
      var i = e.highWaterMark,
          a = e.readableHighWaterMark,
          d = this.objectMode ? 16 : 16384;
      this.highWaterMark = i || 0 === i ? i : n && (a || 0 === a) ? a : d, this.highWaterMark = Math.floor(this.highWaterMark), this.buffer = new b(), this.length = 0, this.pipes = null, this.pipesCount = 0, this.flowing = null, this.ended = !1, this.endEmitted = !1, this.reading = !1, this.sync = !0, this.needReadable = !1, this.emittedReadable = !1, this.readableListening = !1, this.resumeScheduled = !1, this.destroyed = !1, this.defaultEncoding = e.defaultEncoding || "utf8", this.awaitDrain = 0, this.readingMore = !1, this.decoder = null, this.encoding = null, e.encoding && (g || (g = require("string_decoder/").StringDecoder), this.decoder = new g(e.encoding), this.encoding = e.encoding);
    }

    function _(e) {
      if (r = r || require("./_stream_duplex"), !(this instanceof _)) return new _(e);
      this._readableState = new w(e, this), this.readable = !0, e && ("function" == typeof e.read && (this._read = e.read), "function" == typeof e.destroy && (this._destroy = e.destroy)), o.call(this);
    }

    function M(e, t, n, r, i) {
      var a,
          d = e._readableState;
      null === t ? (d.reading = !1, x(e, d)) : (i || (a = k(d, t)), a ? e.emit("error", a) : d.objectMode || t && t.length > 0 ? ("string" == typeof t || d.objectMode || Object.getPrototypeOf(t) === s.prototype || (t = l(t)), r ? d.endEmitted ? e.emit("error", new Error("stream.unshift() after end event")) : S(e, d, t, !0) : d.ended ? e.emit("error", new Error("stream.push() after EOF")) : (d.reading = !1, d.decoder && !n ? (t = d.decoder.write(t), d.objectMode || 0 !== t.length ? S(e, d, t, !1) : C(e, d)) : S(e, d, t, !1))) : r || (d.reading = !1));
      return j(d);
    }

    function S(e, t, n, r) {
      t.flowing && 0 === t.length && !t.sync ? (e.emit("data", n), e.read(0)) : (t.length += t.objectMode ? 1 : n.length, r ? t.buffer.unshift(n) : t.buffer.push(n), t.needReadable && q(e)), C(e, t);
    }

    function k(e, t) {
      var n;
      return h(t) || "string" == typeof t || void 0 === t || e.objectMode || (n = new TypeError("Invalid non-string/buffer chunk")), n;
    }

    function j(e) {
      return !e.ended && (e.needReadable || e.length < e.highWaterMark || 0 === e.length);
    }

    Object.defineProperty(_.prototype, "destroyed", {
      get: function get() {
        return void 0 !== this._readableState && this._readableState.destroyed;
      },
      set: function set(e) {
        this._readableState && (this._readableState.destroyed = e);
      }
    }), _.prototype.destroy = m.destroy, _.prototype._undestroy = m.undestroy, _.prototype._destroy = function (e, t) {
      this.push(null), t(e);
    }, _.prototype.push = function (e, t) {
      var n,
          r = this._readableState;
      return r.objectMode ? n = !0 : "string" == typeof e && ((t = t || r.defaultEncoding) !== r.encoding && (e = s.from(e, t), t = ""), n = !0), M(this, e, t, !1, n);
    }, _.prototype.unshift = function (e) {
      return M(this, e, null, !0, !1);
    }, _.prototype.isPaused = function () {
      return !1 === this._readableState.flowing;
    }, _.prototype.setEncoding = function (e) {
      return g || (g = require("string_decoder/").StringDecoder), this._readableState.decoder = new g(e), this._readableState.encoding = e, this;
    };
    var R = 8388608;

    function E(e) {
      return e >= R ? e = R : (e--, e |= e >>> 1, e |= e >>> 2, e |= e >>> 4, e |= e >>> 8, e |= e >>> 16, e++), e;
    }

    function L(e, t) {
      return e <= 0 || 0 === t.length && t.ended ? 0 : t.objectMode ? 1 : e != e ? t.flowing && t.length ? t.buffer.head.data.length : t.length : (e > t.highWaterMark && (t.highWaterMark = E(e)), e <= t.length ? e : t.ended ? t.length : (t.needReadable = !0, 0));
    }

    function x(e, t) {
      if (!t.ended) {
        if (t.decoder) {
          var n = t.decoder.end();
          n && n.length && (t.buffer.push(n), t.length += t.objectMode ? 1 : n.length);
        }

        t.ended = !0, q(e);
      }
    }

    function q(e) {
      var t = e._readableState;
      t.needReadable = !1, t.emittedReadable || (c("emitReadable", t.flowing), t.emittedReadable = !0, t.sync ? n.nextTick(W, e) : W(e));
    }

    function W(e) {
      c("emit readable"), e.emit("readable"), B(e);
    }

    function C(e, t) {
      t.readingMore || (t.readingMore = !0, n.nextTick(D, e, t));
    }

    function D(e, t) {
      for (var n = t.length; !t.reading && !t.flowing && !t.ended && t.length < t.highWaterMark && (c("maybeReadMore read 0"), e.read(0), n !== t.length);) n = t.length;

      t.readingMore = !1;
    }

    function O(e) {
      return function () {
        var t = e._readableState;
        c("pipeOnDrain", t.awaitDrain), t.awaitDrain && t.awaitDrain--, 0 === t.awaitDrain && d(e, "data") && (t.flowing = !0, B(e));
      };
    }

    function T(e) {
      c("readable nexttick read 0"), e.read(0);
    }

    function U(e, t) {
      t.resumeScheduled || (t.resumeScheduled = !0, n.nextTick(P, e, t));
    }

    function P(e, t) {
      t.reading || (c("resume read 0"), e.read(0)), t.resumeScheduled = !1, t.awaitDrain = 0, e.emit("resume"), B(e), t.flowing && !t.reading && e.read(0);
    }

    function B(e) {
      var t = e._readableState;

      for (c("flow", t.flowing); t.flowing && null !== e.read(););
    }

    function H(e, t) {
      return 0 === t.length ? null : (t.objectMode ? n = t.buffer.shift() : !e || e >= t.length ? (n = t.decoder ? t.buffer.join("") : 1 === t.buffer.length ? t.buffer.head.data : t.buffer.concat(t.length), t.buffer.clear()) : n = I(e, t.buffer, t.decoder), n);
      var n;
    }

    function I(e, t, n) {
      var r;
      return e < t.head.data.length ? (r = t.head.data.slice(0, e), t.head.data = t.head.data.slice(e)) : r = e === t.head.data.length ? t.shift() : n ? A(e, t) : F(e, t), r;
    }

    function A(e, t) {
      var n = t.head,
          r = 1,
          i = n.data;

      for (e -= i.length; n = n.next;) {
        var a = n.data,
            d = e > a.length ? a.length : e;

        if (d === a.length ? i += a : i += a.slice(0, e), 0 === (e -= d)) {
          d === a.length ? (++r, n.next ? t.head = n.next : t.head = t.tail = null) : (t.head = n, n.data = a.slice(d));
          break;
        }

        ++r;
      }

      return t.length -= r, i;
    }

    function F(e, t) {
      var n = s.allocUnsafe(e),
          r = t.head,
          i = 1;

      for (r.data.copy(n), e -= r.data.length; r = r.next;) {
        var a = r.data,
            d = e > a.length ? a.length : e;

        if (a.copy(n, n.length - e, 0, d), 0 === (e -= d)) {
          d === a.length ? (++i, r.next ? t.head = r.next : t.head = t.tail = null) : (t.head = r, r.data = a.slice(d));
          break;
        }

        ++i;
      }

      return t.length -= i, n;
    }

    function z(e) {
      var t = e._readableState;
      if (t.length > 0) throw new Error('"endReadable()" called on non-empty stream');
      t.endEmitted || (t.ended = !0, n.nextTick(G, t, e));
    }

    function G(e, t) {
      e.endEmitted || 0 !== e.length || (e.endEmitted = !0, t.readable = !1, t.emit("end"));
    }

    function J(e, t) {
      for (var n = 0, r = e.length; n < r; n++) if (e[n] === t) return n;

      return -1;
    }

    _.prototype.read = function (e) {
      c("read", e), e = parseInt(e, 10);
      var t = this._readableState,
          n = e;
      if (0 !== e && (t.emittedReadable = !1), 0 === e && t.needReadable && (t.length >= t.highWaterMark || t.ended)) return c("read: emitReadable", t.length, t.ended), 0 === t.length && t.ended ? z(this) : q(this), null;
      if (0 === (e = L(e, t)) && t.ended) return 0 === t.length && z(this), null;
      var r,
          i = t.needReadable;
      return c("need readable", i), (0 === t.length || t.length - e < t.highWaterMark) && c("length less than watermark", i = !0), t.ended || t.reading ? c("reading or ended", i = !1) : i && (c("do read"), t.reading = !0, t.sync = !0, 0 === t.length && (t.needReadable = !0), this._read(t.highWaterMark), t.sync = !1, t.reading || (e = L(n, t))), null === (r = e > 0 ? H(e, t) : null) ? (t.needReadable = !0, e = 0) : t.length -= e, 0 === t.length && (t.ended || (t.needReadable = !0), n !== e && t.ended && z(this)), null !== r && this.emit("data", r), r;
    }, _.prototype._read = function (e) {
      this.emit("error", new Error("_read() is not implemented"));
    }, _.prototype.pipe = function (e, r) {
      var i = this,
          a = this._readableState;

      switch (a.pipesCount) {
        case 0:
          a.pipes = e;
          break;

        case 1:
          a.pipes = [a.pipes, e];
          break;

        default:
          a.pipes.push(e);
      }

      a.pipesCount += 1, c("pipe count=%d opts=%j", a.pipesCount, r);
      var o = (!r || !1 !== r.end) && e !== t.stdout && e !== t.stderr ? u : v;

      function s(t, n) {
        c("onunpipe"), t === i && n && !1 === n.hasUnpiped && (n.hasUnpiped = !0, c("cleanup"), e.removeListener("close", b), e.removeListener("finish", m), e.removeListener("drain", l), e.removeListener("error", g), e.removeListener("unpipe", s), i.removeListener("end", u), i.removeListener("end", v), i.removeListener("data", f), h = !0, !a.awaitDrain || e._writableState && !e._writableState.needDrain || l());
      }

      function u() {
        c("onend"), e.end();
      }

      a.endEmitted ? n.nextTick(o) : i.once("end", o), e.on("unpipe", s);
      var l = O(i);
      e.on("drain", l);
      var h = !1;
      var p = !1;

      function f(t) {
        c("ondata"), p = !1, !1 !== e.write(t) || p || ((1 === a.pipesCount && a.pipes === e || a.pipesCount > 1 && -1 !== J(a.pipes, e)) && !h && (c("false write response, pause", i._readableState.awaitDrain), i._readableState.awaitDrain++, p = !0), i.pause());
      }

      function g(t) {
        c("onerror", t), v(), e.removeListener("error", g), 0 === d(e, "error") && e.emit("error", t);
      }

      function b() {
        e.removeListener("finish", m), v();
      }

      function m() {
        c("onfinish"), e.removeListener("close", b), v();
      }

      function v() {
        c("unpipe"), i.unpipe(e);
      }

      return i.on("data", f), y(e, "error", g), e.once("close", b), e.once("finish", m), e.emit("pipe", i), a.flowing || (c("pipe resume"), i.resume()), e;
    }, _.prototype.unpipe = function (e) {
      var t = this._readableState,
          n = {
        hasUnpiped: !1
      };
      if (0 === t.pipesCount) return this;
      if (1 === t.pipesCount) return e && e !== t.pipes ? this : (e || (e = t.pipes), t.pipes = null, t.pipesCount = 0, t.flowing = !1, e && e.emit("unpipe", this, n), this);

      if (!e) {
        var r = t.pipes,
            i = t.pipesCount;
        t.pipes = null, t.pipesCount = 0, t.flowing = !1;

        for (var a = 0; a < i; a++) r[a].emit("unpipe", this, n);

        return this;
      }

      var d = J(t.pipes, e);
      return -1 === d ? this : (t.pipes.splice(d, 1), t.pipesCount -= 1, 1 === t.pipesCount && (t.pipes = t.pipes[0]), e.emit("unpipe", this, n), this);
    }, _.prototype.on = function (e, t) {
      var r = o.prototype.on.call(this, e, t);
      if ("data" === e) !1 !== this._readableState.flowing && this.resume();else if ("readable" === e) {
        var i = this._readableState;
        i.endEmitted || i.readableListening || (i.readableListening = i.needReadable = !0, i.emittedReadable = !1, i.reading ? i.length && q(this) : n.nextTick(T, this));
      }
      return r;
    }, _.prototype.addListener = _.prototype.on, _.prototype.resume = function () {
      var e = this._readableState;
      return e.flowing || (c("resume"), e.flowing = !0, U(this, e)), this;
    }, _.prototype.pause = function () {
      return c("call pause flowing=%j", this._readableState.flowing), !1 !== this._readableState.flowing && (c("pause"), this._readableState.flowing = !1, this.emit("pause")), this;
    }, _.prototype.wrap = function (e) {
      var t = this,
          n = this._readableState,
          r = !1;

      for (var i in e.on("end", function () {
        if (c("wrapped end"), n.decoder && !n.ended) {
          var e = n.decoder.end();
          e && e.length && t.push(e);
        }

        t.push(null);
      }), e.on("data", function (i) {
        (c("wrapped data"), n.decoder && (i = n.decoder.write(i)), n.objectMode && null == i) || (n.objectMode || i && i.length) && (t.push(i) || (r = !0, e.pause()));
      }), e) void 0 === this[i] && "function" == typeof e[i] && (this[i] = function (t) {
        return function () {
          return e[t].apply(e, arguments);
        };
      }(i));

      for (var a = 0; a < v.length; a++) e.on(v[a], this.emit.bind(this, v[a]));

      return this._read = function (t) {
        c("wrapped _read", t), r && (r = !1, e.resume());
      }, this;
    }, Object.defineProperty(_.prototype, "readableHighWaterMark", {
      enumerable: !1,
      get: function get() {
        return this._readableState.highWaterMark;
      }
    }), _._fromList = H;
  }, {
    "process-nextick-args": "Yj0v",
    "isarray": "REa7",
    "events": "FRpO",
    "./internal/streams/stream": "1ExO",
    "safe-buffer": "38Wu",
    "core-util-is": "Q14w",
    "inherits": "4Bm0",
    "util": "70rD",
    "./internal/streams/BufferList": "wl+m",
    "./internal/streams/destroy": "GRUB",
    "./_stream_duplex": "Hba+",
    "string_decoder/": "z0rv",
    "process": "pBGv"
  }],
  "7tlB": [function (require, module, exports) {
    "use strict";

    module.exports = n;

    var t = require("./_stream_duplex"),
        r = require("core-util-is");

    function e(t, r) {
      var e = this._transformState;
      e.transforming = !1;
      var n = e.writecb;
      if (!n) return this.emit("error", new Error("write callback called multiple times"));
      e.writechunk = null, e.writecb = null, null != r && this.push(r), n(t);
      var i = this._readableState;
      i.reading = !1, (i.needReadable || i.length < i.highWaterMark) && this._read(i.highWaterMark);
    }

    function n(r) {
      if (!(this instanceof n)) return new n(r);
      t.call(this, r), this._transformState = {
        afterTransform: e.bind(this),
        needTransform: !1,
        transforming: !1,
        writecb: null,
        writechunk: null,
        writeencoding: null
      }, this._readableState.needReadable = !0, this._readableState.sync = !1, r && ("function" == typeof r.transform && (this._transform = r.transform), "function" == typeof r.flush && (this._flush = r.flush)), this.on("prefinish", i);
    }

    function i() {
      var t = this;
      "function" == typeof this._flush ? this._flush(function (r, e) {
        a(t, r, e);
      }) : a(this, null, null);
    }

    function a(t, r, e) {
      if (r) return t.emit("error", r);
      if (null != e && t.push(e), t._writableState.length) throw new Error("Calling transform done when ws.length != 0");
      if (t._transformState.transforming) throw new Error("Calling transform done when still transforming");
      return t.push(null);
    }

    r.inherits = require("inherits"), r.inherits(n, t), n.prototype.push = function (r, e) {
      return this._transformState.needTransform = !1, t.prototype.push.call(this, r, e);
    }, n.prototype._transform = function (t, r, e) {
      throw new Error("_transform() is not implemented");
    }, n.prototype._write = function (t, r, e) {
      var n = this._transformState;

      if (n.writecb = e, n.writechunk = t, n.writeencoding = r, !n.transforming) {
        var i = this._readableState;
        (n.needTransform || i.needReadable || i.length < i.highWaterMark) && this._read(i.highWaterMark);
      }
    }, n.prototype._read = function (t) {
      var r = this._transformState;
      null !== r.writechunk && r.writecb && !r.transforming ? (r.transforming = !0, this._transform(r.writechunk, r.writeencoding, r.afterTransform)) : r.needTransform = !0;
    }, n.prototype._destroy = function (r, e) {
      var n = this;

      t.prototype._destroy.call(this, r, function (t) {
        e(t), n.emit("close");
      });
    };
  }, {
    "./_stream_duplex": "Hba+",
    "core-util-is": "Q14w",
    "inherits": "4Bm0"
  }],
  "nwyA": [function (require, module, exports) {
    "use strict";

    module.exports = i;

    var r = require("./_stream_transform"),
        e = require("core-util-is");

    function i(e) {
      if (!(this instanceof i)) return new i(e);
      r.call(this, e);
    }

    e.inherits = require("inherits"), e.inherits(i, r), i.prototype._transform = function (r, e, i) {
      i(null, r);
    };
  }, {
    "./_stream_transform": "7tlB",
    "core-util-is": "Q14w",
    "inherits": "4Bm0"
  }],
  "tzeh": [function (require, module, exports) {
    exports = module.exports = require("./lib/_stream_readable.js"), exports.Stream = exports, exports.Readable = exports, exports.Writable = require("./lib/_stream_writable.js"), exports.Duplex = require("./lib/_stream_duplex.js"), exports.Transform = require("./lib/_stream_transform.js"), exports.PassThrough = require("./lib/_stream_passthrough.js");
  }, {
    "./lib/_stream_readable.js": "DHrQ",
    "./lib/_stream_writable.js": "WSyY",
    "./lib/_stream_duplex.js": "Hba+",
    "./lib/_stream_transform.js": "7tlB",
    "./lib/_stream_passthrough.js": "nwyA"
  }],
  "Ux+i": [function (require, module, exports) {
    var process = require("process");

    var Buffer = require("buffer").Buffer;

    var global = arguments[3];

    var e = require("process"),
        r = require("buffer").Buffer,
        t = arguments[3],
        s = require("./capability"),
        a = require("inherits"),
        o = require("readable-stream"),
        n = exports.readyStates = {
      UNSENT: 0,
      OPENED: 1,
      HEADERS_RECEIVED: 2,
      LOADING: 3,
      DONE: 4
    },
        u = exports.IncomingMessage = function (a, n, u, i) {
      var c = this;

      if (o.Readable.call(c), c._mode = u, c.headers = {}, c.rawHeaders = [], c.trailers = {}, c.rawTrailers = [], c.on("end", function () {
        e.nextTick(function () {
          c.emit("close");
        });
      }), "fetch" === u) {
        if (c._fetchResponse = n, c.url = n.url, c.statusCode = n.status, c.statusMessage = n.statusText, n.headers.forEach(function (e, r) {
          c.headers[r.toLowerCase()] = e, c.rawHeaders.push(r, e);
        }), s.writableStream) {
          var d = new WritableStream({
            write: function write(e) {
              return new Promise(function (t, s) {
                c._destroyed ? s() : c.push(new r(e)) ? t() : c._resumeFetch = t;
              });
            },
            close: function close() {
              t.clearTimeout(i), c._destroyed || c.push(null);
            },
            abort: function abort(e) {
              c._destroyed || c.emit("error", e);
            }
          });

          try {
            return void n.body.pipeTo(d).catch(function (e) {
              t.clearTimeout(i), c._destroyed || c.emit("error", e);
            });
          } catch (p) {}
        }

        var h = n.body.getReader();
        !function e() {
          h.read().then(function (s) {
            if (!c._destroyed) {
              if (s.done) return t.clearTimeout(i), void c.push(null);
              c.push(new r(s.value)), e();
            }
          }).catch(function (e) {
            t.clearTimeout(i), c._destroyed || c.emit("error", e);
          });
        }();
      } else {
        if (c._xhr = a, c._pos = 0, c.url = a.responseURL, c.statusCode = a.status, c.statusMessage = a.statusText, a.getAllResponseHeaders().split(/\r?\n/).forEach(function (e) {
          var r = e.match(/^([^:]+):\s*(.*)/);

          if (r) {
            var t = r[1].toLowerCase();
            "set-cookie" === t ? (void 0 === c.headers[t] && (c.headers[t] = []), c.headers[t].push(r[2])) : void 0 !== c.headers[t] ? c.headers[t] += ", " + r[2] : c.headers[t] = r[2], c.rawHeaders.push(r[1], r[2]);
          }
        }), c._charset = "x-user-defined", !s.overrideMimeType) {
          var f = c.rawHeaders["mime-type"];

          if (f) {
            var l = f.match(/;\s*charset=([^;])(;|$)/);
            l && (c._charset = l[1].toLowerCase());
          }

          c._charset || (c._charset = "utf-8");
        }
      }
    };

    a(u, o.Readable), u.prototype._read = function () {
      var e = this._resumeFetch;
      e && (this._resumeFetch = null, e());
    }, u.prototype._onXHRProgress = function () {
      var e = this,
          s = e._xhr,
          a = null;

      switch (e._mode) {
        case "text:vbarray":
          if (s.readyState !== n.DONE) break;

          try {
            a = new t.VBArray(s.responseBody).toArray();
          } catch (d) {}

          if (null !== a) {
            e.push(new r(a));
            break;
          }

        case "text":
          try {
            a = s.responseText;
          } catch (d) {
            e._mode = "text:vbarray";
            break;
          }

          if (a.length > e._pos) {
            var o = a.substr(e._pos);

            if ("x-user-defined" === e._charset) {
              for (var u = new r(o.length), i = 0; i < o.length; i++) u[i] = 255 & o.charCodeAt(i);

              e.push(u);
            } else e.push(o, e._charset);

            e._pos = a.length;
          }

          break;

        case "arraybuffer":
          if (s.readyState !== n.DONE || !s.response) break;
          a = s.response, e.push(new r(new Uint8Array(a)));
          break;

        case "moz-chunked-arraybuffer":
          if (a = s.response, s.readyState !== n.LOADING || !a) break;
          e.push(new r(new Uint8Array(a)));
          break;

        case "ms-stream":
          if (a = s.response, s.readyState !== n.LOADING) break;
          var c = new t.MSStreamReader();
          c.onprogress = function () {
            c.result.byteLength > e._pos && (e.push(new r(new Uint8Array(c.result.slice(e._pos)))), e._pos = c.result.byteLength);
          }, c.onload = function () {
            e.push(null);
          }, c.readAsArrayBuffer(a);
      }

      e._xhr.readyState === n.DONE && "ms-stream" !== e._mode && e.push(null);
    };
  }, {
    "./capability": "p5a1",
    "inherits": "4Bm0",
    "readable-stream": "tzeh",
    "process": "pBGv",
    "buffer": "dskh"
  }],
  "+AH4": [function (require, module, exports) {
    var e = require("buffer").Buffer;

    module.exports = function (f) {
      if (f instanceof Uint8Array) {
        if (0 === f.byteOffset && f.byteLength === f.buffer.byteLength) return f.buffer;
        if ("function" == typeof f.buffer.slice) return f.buffer.slice(f.byteOffset, f.byteOffset + f.byteLength);
      }

      if (e.isBuffer(f)) {
        for (var r = new Uint8Array(f.length), t = f.length, n = 0; n < t; n++) r[n] = f[n];

        return r.buffer;
      }

      throw new Error("Argument must be a Buffer");
    };
  }, {
    "buffer": "dskh"
  }],
  "yL7F": [function (require, module, exports) {
    var Buffer = require("buffer").Buffer;

    var global = arguments[3];

    var process = require("process");

    var e = require("buffer").Buffer,
        t = arguments[3],
        r = require("process"),
        o = require("./capability"),
        n = require("inherits"),
        i = require("./response"),
        s = require("readable-stream"),
        a = require("to-arraybuffer"),
        c = i.IncomingMessage,
        u = i.readyStates;

    function d(e, t) {
      return o.fetch && t ? "fetch" : o.mozchunkedarraybuffer ? "moz-chunked-arraybuffer" : o.msstream ? "ms-stream" : o.arraybuffer && e ? "arraybuffer" : o.vbArray && e ? "text:vbarray" : "text";
    }

    var f = module.exports = function (t) {
      var r,
          n = this;
      s.Writable.call(n), n._opts = t, n._body = [], n._headers = {}, t.auth && n.setHeader("Authorization", "Basic " + new e(t.auth).toString("base64")), Object.keys(t.headers).forEach(function (e) {
        n.setHeader(e, t.headers[e]);
      });
      var i = !0;
      if ("disable-fetch" === t.mode || "requestTimeout" in t && !o.abortController) i = !1, r = !0;else if ("prefer-streaming" === t.mode) r = !1;else if ("allow-wrong-content-type" === t.mode) r = !o.overrideMimeType;else {
        if (t.mode && "default" !== t.mode && "prefer-fast" !== t.mode) throw new Error("Invalid value for opts.mode");
        r = !0;
      }
      n._mode = d(r, i), n._fetchTimer = null, n.on("finish", function () {
        n._onFinish();
      });
    };

    function h(e) {
      try {
        var t = e.status;
        return null !== t && 0 !== t;
      } catch (r) {
        return !1;
      }
    }

    n(f, s.Writable), f.prototype.setHeader = function (e, t) {
      var r = e.toLowerCase();
      -1 === p.indexOf(r) && (this._headers[r] = {
        name: e,
        value: t
      });
    }, f.prototype.getHeader = function (e) {
      var t = this._headers[e.toLowerCase()];

      return t ? t.value : null;
    }, f.prototype.removeHeader = function (e) {
      delete this._headers[e.toLowerCase()];
    }, f.prototype._onFinish = function () {
      var n = this;

      if (!n._destroyed) {
        var i = n._opts,
            s = n._headers,
            c = null;
        "GET" !== i.method && "HEAD" !== i.method && (c = o.arraybuffer ? a(e.concat(n._body)) : o.blobConstructor ? new t.Blob(n._body.map(function (e) {
          return a(e);
        }), {
          type: (s["content-type"] || {}).value || ""
        }) : e.concat(n._body).toString());
        var d = [];

        if (Object.keys(s).forEach(function (e) {
          var t = s[e].name,
              r = s[e].value;
          Array.isArray(r) ? r.forEach(function (e) {
            d.push([t, e]);
          }) : d.push([t, r]);
        }), "fetch" === n._mode) {
          var f = null;

          if (o.abortController) {
            var h = new AbortController();
            f = h.signal, n._fetchAbortController = h, "requestTimeout" in i && 0 !== i.requestTimeout && (n._fetchTimer = t.setTimeout(function () {
              n.emit("requestTimeout"), n._fetchAbortController && n._fetchAbortController.abort();
            }, i.requestTimeout));
          }

          t.fetch(n._opts.url, {
            method: n._opts.method,
            headers: d,
            body: c || void 0,
            mode: "cors",
            credentials: i.withCredentials ? "include" : "same-origin",
            signal: f
          }).then(function (e) {
            n._fetchResponse = e, n._connect();
          }, function (e) {
            t.clearTimeout(n._fetchTimer), n._destroyed || n.emit("error", e);
          });
        } else {
          var p = n._xhr = new t.XMLHttpRequest();

          try {
            p.open(n._opts.method, n._opts.url, !0);
          } catch (l) {
            return void r.nextTick(function () {
              n.emit("error", l);
            });
          }

          "responseType" in p && (p.responseType = n._mode.split(":")[0]), "withCredentials" in p && (p.withCredentials = !!i.withCredentials), "text" === n._mode && "overrideMimeType" in p && p.overrideMimeType("text/plain; charset=x-user-defined"), "requestTimeout" in i && (p.timeout = i.requestTimeout, p.ontimeout = function () {
            n.emit("requestTimeout");
          }), d.forEach(function (e) {
            p.setRequestHeader(e[0], e[1]);
          }), n._response = null, p.onreadystatechange = function () {
            switch (p.readyState) {
              case u.LOADING:
              case u.DONE:
                n._onXHRProgress();

            }
          }, "moz-chunked-arraybuffer" === n._mode && (p.onprogress = function () {
            n._onXHRProgress();
          }), p.onerror = function () {
            n._destroyed || n.emit("error", new Error("XHR error"));
          };

          try {
            p.send(c);
          } catch (l) {
            return void r.nextTick(function () {
              n.emit("error", l);
            });
          }
        }
      }
    }, f.prototype._onXHRProgress = function () {
      h(this._xhr) && !this._destroyed && (this._response || this._connect(), this._response._onXHRProgress());
    }, f.prototype._connect = function () {
      var e = this;
      e._destroyed || (e._response = new c(e._xhr, e._fetchResponse, e._mode, e._fetchTimer), e._response.on("error", function (t) {
        e.emit("error", t);
      }), e.emit("response", e._response));
    }, f.prototype._write = function (e, t, r) {
      this._body.push(e), r();
    }, f.prototype.abort = f.prototype.destroy = function () {
      this._destroyed = !0, t.clearTimeout(this._fetchTimer), this._response && (this._response._destroyed = !0), this._xhr ? this._xhr.abort() : this._fetchAbortController && this._fetchAbortController.abort();
    }, f.prototype.end = function (e, t, r) {
      "function" == typeof e && (r = e, e = void 0), s.Writable.prototype.end.call(this, e, t, r);
    }, f.prototype.flushHeaders = function () {}, f.prototype.setTimeout = function () {}, f.prototype.setNoDelay = function () {}, f.prototype.setSocketKeepAlive = function () {};
    var p = ["accept-charset", "accept-encoding", "access-control-request-headers", "access-control-request-method", "connection", "content-length", "cookie", "cookie2", "date", "dnt", "expect", "host", "keep-alive", "origin", "referer", "te", "trailer", "transfer-encoding", "upgrade", "via"];
  }, {
    "./capability": "p5a1",
    "inherits": "4Bm0",
    "./response": "Ux+i",
    "readable-stream": "tzeh",
    "to-arraybuffer": "+AH4",
    "buffer": "dskh",
    "process": "pBGv"
  }],
  "K5Tb": [function (require, module, exports) {
    module.exports = o;
    var r = Object.prototype.hasOwnProperty;

    function o() {
      for (var o = {}, t = 0; t < arguments.length; t++) {
        var e = arguments[t];

        for (var a in e) r.call(e, a) && (o[a] = e[a]);
      }

      return o;
    }
  }, {}],
  "9OpT": [function (require, module, exports) {
    module.exports = {
      100: "Continue",
      101: "Switching Protocols",
      102: "Processing",
      200: "OK",
      201: "Created",
      202: "Accepted",
      203: "Non-Authoritative Information",
      204: "No Content",
      205: "Reset Content",
      206: "Partial Content",
      207: "Multi-Status",
      208: "Already Reported",
      226: "IM Used",
      300: "Multiple Choices",
      301: "Moved Permanently",
      302: "Found",
      303: "See Other",
      304: "Not Modified",
      305: "Use Proxy",
      307: "Temporary Redirect",
      308: "Permanent Redirect",
      400: "Bad Request",
      401: "Unauthorized",
      402: "Payment Required",
      403: "Forbidden",
      404: "Not Found",
      405: "Method Not Allowed",
      406: "Not Acceptable",
      407: "Proxy Authentication Required",
      408: "Request Timeout",
      409: "Conflict",
      410: "Gone",
      411: "Length Required",
      412: "Precondition Failed",
      413: "Payload Too Large",
      414: "URI Too Long",
      415: "Unsupported Media Type",
      416: "Range Not Satisfiable",
      417: "Expectation Failed",
      418: "I'm a teapot",
      421: "Misdirected Request",
      422: "Unprocessable Entity",
      423: "Locked",
      424: "Failed Dependency",
      425: "Unordered Collection",
      426: "Upgrade Required",
      428: "Precondition Required",
      429: "Too Many Requests",
      431: "Request Header Fields Too Large",
      451: "Unavailable For Legal Reasons",
      500: "Internal Server Error",
      501: "Not Implemented",
      502: "Bad Gateway",
      503: "Service Unavailable",
      504: "Gateway Timeout",
      505: "HTTP Version Not Supported",
      506: "Variant Also Negotiates",
      507: "Insufficient Storage",
      508: "Loop Detected",
      509: "Bandwidth Limit Exceeded",
      510: "Not Extended",
      511: "Network Authentication Required"
    };
  }, {}],
  "FIMm": [function (require, module, exports) {
    var global = arguments[3];
    var define;
    var o,
        e = arguments[3];
    !function (n) {
      var r = "object" == typeof exports && exports && !exports.nodeType && exports,
          t = "object" == typeof module && module && !module.nodeType && module,
          u = "object" == typeof e && e;
      u.global !== u && u.window !== u && u.self !== u || (n = u);
      var i,
          f,
          c = 2147483647,
          l = 36,
          s = 1,
          p = 26,
          a = 38,
          d = 700,
          h = 72,
          v = 128,
          g = "-",
          w = /^xn--/,
          x = /[^\x20-\x7E]/,
          y = /[\x2E\u3002\uFF0E\uFF61]/g,
          m = {
        overflow: "Overflow: input needs wider integers to process",
        "not-basic": "Illegal input >= 0x80 (not a basic code point)",
        "invalid-input": "Invalid input"
      },
          C = l - s,
          b = Math.floor,
          j = String.fromCharCode;

      function A(o) {
        throw new RangeError(m[o]);
      }

      function I(o, e) {
        for (var n = o.length, r = []; n--;) r[n] = e(o[n]);

        return r;
      }

      function E(o, e) {
        var n = o.split("@"),
            r = "";
        return n.length > 1 && (r = n[0] + "@", o = n[1]), r + I((o = o.replace(y, ".")).split("."), e).join(".");
      }

      function F(o) {
        for (var e, n, r = [], t = 0, u = o.length; t < u;) (e = o.charCodeAt(t++)) >= 55296 && e <= 56319 && t < u ? 56320 == (64512 & (n = o.charCodeAt(t++))) ? r.push(((1023 & e) << 10) + (1023 & n) + 65536) : (r.push(e), t--) : r.push(e);

        return r;
      }

      function O(o) {
        return I(o, function (o) {
          var e = "";
          return o > 65535 && (e += j((o -= 65536) >>> 10 & 1023 | 55296), o = 56320 | 1023 & o), e += j(o);
        }).join("");
      }

      function S(o, e) {
        return o + 22 + 75 * (o < 26) - ((0 != e) << 5);
      }

      function T(o, e, n) {
        var r = 0;

        for (o = n ? b(o / d) : o >> 1, o += b(o / e); o > C * p >> 1; r += l) o = b(o / C);

        return b(r + (C + 1) * o / (o + a));
      }

      function L(o) {
        var e,
            n,
            r,
            t,
            u,
            i,
            f,
            a,
            d,
            w,
            x,
            y = [],
            m = o.length,
            C = 0,
            j = v,
            I = h;

        for ((n = o.lastIndexOf(g)) < 0 && (n = 0), r = 0; r < n; ++r) o.charCodeAt(r) >= 128 && A("not-basic"), y.push(o.charCodeAt(r));

        for (t = n > 0 ? n + 1 : 0; t < m;) {
          for (u = C, i = 1, f = l; t >= m && A("invalid-input"), ((a = (x = o.charCodeAt(t++)) - 48 < 10 ? x - 22 : x - 65 < 26 ? x - 65 : x - 97 < 26 ? x - 97 : l) >= l || a > b((c - C) / i)) && A("overflow"), C += a * i, !(a < (d = f <= I ? s : f >= I + p ? p : f - I)); f += l) i > b(c / (w = l - d)) && A("overflow"), i *= w;

          I = T(C - u, e = y.length + 1, 0 == u), b(C / e) > c - j && A("overflow"), j += b(C / e), C %= e, y.splice(C++, 0, j);
        }

        return O(y);
      }

      function M(o) {
        var e,
            n,
            r,
            t,
            u,
            i,
            f,
            a,
            d,
            w,
            x,
            y,
            m,
            C,
            I,
            E = [];

        for (y = (o = F(o)).length, e = v, n = 0, u = h, i = 0; i < y; ++i) (x = o[i]) < 128 && E.push(j(x));

        for (r = t = E.length, t && E.push(g); r < y;) {
          for (f = c, i = 0; i < y; ++i) (x = o[i]) >= e && x < f && (f = x);

          for (f - e > b((c - n) / (m = r + 1)) && A("overflow"), n += (f - e) * m, e = f, i = 0; i < y; ++i) if ((x = o[i]) < e && ++n > c && A("overflow"), x == e) {
            for (a = n, d = l; !(a < (w = d <= u ? s : d >= u + p ? p : d - u)); d += l) I = a - w, C = l - w, E.push(j(S(w + I % C, 0))), a = b(I / C);

            E.push(j(S(a, 0))), u = T(n, m, r == t), n = 0, ++r;
          }

          ++n, ++e;
        }

        return E.join("");
      }

      if (i = {
        version: "1.4.1",
        ucs2: {
          decode: F,
          encode: O
        },
        decode: L,
        encode: M,
        toASCII: function toASCII(o) {
          return E(o, function (o) {
            return x.test(o) ? "xn--" + M(o) : o;
          });
        },
        toUnicode: function toUnicode(o) {
          return E(o, function (o) {
            return w.test(o) ? L(o.slice(4).toLowerCase()) : o;
          });
        }
      }, "function" == typeof o && "object" == typeof o.amd && o.amd) o("punycode", function () {
        return i;
      });else if (r && t) {
        if (module.exports == r) t.exports = i;else for (f in i) i.hasOwnProperty(f) && (r[f] = i[f]);
      } else n.punycode = i;
    }(this);
  }, {}],
  "5YsI": [function (require, module, exports) {
    "use strict";

    module.exports = {
      isString: function isString(n) {
        return "string" == typeof n;
      },
      isObject: function isObject(n) {
        return "object" == typeof n && null !== n;
      },
      isNull: function isNull(n) {
        return null === n;
      },
      isNullOrUndefined: function isNullOrUndefined(n) {
        return null == n;
      }
    };
  }, {}],
  "J6GP": [function (require, module, exports) {
    "use strict";

    function r(r, e) {
      return Object.prototype.hasOwnProperty.call(r, e);
    }

    module.exports = function (t, n, o, a) {
      n = n || "&", o = o || "=";
      var s = {};
      if ("string" != typeof t || 0 === t.length) return s;
      var p = /\+/g;
      t = t.split(n);
      var u = 1e3;
      a && "number" == typeof a.maxKeys && (u = a.maxKeys);
      var c = t.length;
      u > 0 && c > u && (c = u);

      for (var i = 0; i < c; ++i) {
        var y,
            l,
            f,
            v,
            b = t[i].replace(p, "%20"),
            d = b.indexOf(o);
        d >= 0 ? (y = b.substr(0, d), l = b.substr(d + 1)) : (y = b, l = ""), f = decodeURIComponent(y), v = decodeURIComponent(l), r(s, f) ? e(s[f]) ? s[f].push(v) : s[f] = [s[f], v] : s[f] = v;
      }

      return s;
    };

    var e = Array.isArray || function (r) {
      return "[object Array]" === Object.prototype.toString.call(r);
    };
  }, {}],
  "bvhO": [function (require, module, exports) {
    "use strict";

    var n = function n(_n) {
      switch (typeof _n) {
        case "string":
          return _n;

        case "boolean":
          return _n ? "true" : "false";

        case "number":
          return isFinite(_n) ? _n : "";

        default:
          return "";
      }
    };

    module.exports = function (o, u, c, a) {
      return u = u || "&", c = c || "=", null === o && (o = void 0), "object" == typeof o ? r(t(o), function (t) {
        var a = encodeURIComponent(n(t)) + c;
        return e(o[t]) ? r(o[t], function (e) {
          return a + encodeURIComponent(n(e));
        }).join(u) : a + encodeURIComponent(n(o[t]));
      }).join(u) : a ? encodeURIComponent(n(a)) + c + encodeURIComponent(n(o)) : "";
    };

    var e = Array.isArray || function (n) {
      return "[object Array]" === Object.prototype.toString.call(n);
    };

    function r(n, e) {
      if (n.map) return n.map(e);

      for (var r = [], t = 0; t < n.length; t++) r.push(e(n[t], t));

      return r;
    }

    var t = Object.keys || function (n) {
      var e = [];

      for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && e.push(r);

      return e;
    };
  }, {}],
  "+00f": [function (require, module, exports) {
    "use strict";

    exports.decode = exports.parse = require("./decode"), exports.encode = exports.stringify = require("./encode");
  }, {
    "./decode": "J6GP",
    "./encode": "bvhO"
  }],
  "Mej7": [function (require, module, exports) {
    "use strict";

    var t = require("punycode"),
        s = require("./util");

    function h() {
      this.protocol = null, this.slashes = null, this.auth = null, this.host = null, this.port = null, this.hostname = null, this.hash = null, this.search = null, this.query = null, this.pathname = null, this.path = null, this.href = null;
    }

    exports.parse = b, exports.resolve = O, exports.resolveObject = d, exports.format = q, exports.Url = h;

    var e = /^([a-z0-9.+-]+:)/i,
        a = /:[0-9]*$/,
        r = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,
        o = ["<", ">", '"', "`", " ", "\r", "\n", "\t"],
        n = ["{", "}", "|", "\\", "^", "`"].concat(o),
        i = ["'"].concat(n),
        l = ["%", "/", "?", ";", "#"].concat(i),
        p = ["/", "?", "#"],
        c = 255,
        u = /^[+a-z0-9A-Z_-]{0,63}$/,
        f = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,
        m = {
      javascript: !0,
      "javascript:": !0
    },
        v = {
      javascript: !0,
      "javascript:": !0
    },
        g = {
      http: !0,
      https: !0,
      ftp: !0,
      gopher: !0,
      file: !0,
      "http:": !0,
      "https:": !0,
      "ftp:": !0,
      "gopher:": !0,
      "file:": !0
    },
        y = require("querystring");

    function b(t, e, a) {
      if (t && s.isObject(t) && t instanceof h) return t;
      var r = new h();
      return r.parse(t, e, a), r;
    }

    function q(t) {
      return s.isString(t) && (t = b(t)), t instanceof h ? t.format() : h.prototype.format.call(t);
    }

    function O(t, s) {
      return b(t, !1, !0).resolve(s);
    }

    function d(t, s) {
      return t ? b(t, !1, !0).resolveObject(s) : s;
    }

    h.prototype.parse = function (h, a, o) {
      if (!s.isString(h)) throw new TypeError("Parameter 'url' must be a string, not " + typeof h);
      var n = h.indexOf("?"),
          b = -1 !== n && n < h.indexOf("#") ? "?" : "#",
          q = h.split(b);
      q[0] = q[0].replace(/\\/g, "/");
      var O = h = q.join(b);

      if (O = O.trim(), !o && 1 === h.split("#").length) {
        var d = r.exec(O);
        if (d) return this.path = O, this.href = O, this.pathname = d[1], d[2] ? (this.search = d[2], this.query = a ? y.parse(this.search.substr(1)) : this.search.substr(1)) : a && (this.search = "", this.query = {}), this;
      }

      var j = e.exec(O);

      if (j) {
        var x = (j = j[0]).toLowerCase();
        this.protocol = x, O = O.substr(j.length);
      }

      if (o || j || O.match(/^\/\/[^@\/]+@[^@\/]+/)) {
        var A = "//" === O.substr(0, 2);
        !A || j && v[j] || (O = O.substr(2), this.slashes = !0);
      }

      if (!v[j] && (A || j && !g[j])) {
        for (var C, I, w = -1, U = 0; U < p.length; U++) {
          -1 !== (k = O.indexOf(p[U])) && (-1 === w || k < w) && (w = k);
        }

        -1 !== (I = -1 === w ? O.lastIndexOf("@") : O.lastIndexOf("@", w)) && (C = O.slice(0, I), O = O.slice(I + 1), this.auth = decodeURIComponent(C)), w = -1;

        for (U = 0; U < l.length; U++) {
          var k;
          -1 !== (k = O.indexOf(l[U])) && (-1 === w || k < w) && (w = k);
        }

        -1 === w && (w = O.length), this.host = O.slice(0, w), O = O.slice(w), this.parseHost(), this.hostname = this.hostname || "";
        var N = "[" === this.hostname[0] && "]" === this.hostname[this.hostname.length - 1];
        if (!N) for (var R = this.hostname.split(/\./), S = (U = 0, R.length); U < S; U++) {
          var $ = R[U];

          if ($ && !$.match(u)) {
            for (var z = "", H = 0, L = $.length; H < L; H++) $.charCodeAt(H) > 127 ? z += "x" : z += $[H];

            if (!z.match(u)) {
              var Z = R.slice(0, U),
                  _ = R.slice(U + 1),
                  E = $.match(f);

              E && (Z.push(E[1]), _.unshift(E[2])), _.length && (O = "/" + _.join(".") + O), this.hostname = Z.join(".");
              break;
            }
          }
        }
        this.hostname.length > c ? this.hostname = "" : this.hostname = this.hostname.toLowerCase(), N || (this.hostname = t.toASCII(this.hostname));
        var P = this.port ? ":" + this.port : "",
            T = this.hostname || "";
        this.host = T + P, this.href += this.host, N && (this.hostname = this.hostname.substr(1, this.hostname.length - 2), "/" !== O[0] && (O = "/" + O));
      }

      if (!m[x]) for (U = 0, S = i.length; U < S; U++) {
        var B = i[U];

        if (-1 !== O.indexOf(B)) {
          var D = encodeURIComponent(B);
          D === B && (D = escape(B)), O = O.split(B).join(D);
        }
      }
      var F = O.indexOf("#");
      -1 !== F && (this.hash = O.substr(F), O = O.slice(0, F));
      var G = O.indexOf("?");

      if (-1 !== G ? (this.search = O.substr(G), this.query = O.substr(G + 1), a && (this.query = y.parse(this.query)), O = O.slice(0, G)) : a && (this.search = "", this.query = {}), O && (this.pathname = O), g[x] && this.hostname && !this.pathname && (this.pathname = "/"), this.pathname || this.search) {
        P = this.pathname || "";
        var J = this.search || "";
        this.path = P + J;
      }

      return this.href = this.format(), this;
    }, h.prototype.format = function () {
      var t = this.auth || "";
      t && (t = (t = encodeURIComponent(t)).replace(/%3A/i, ":"), t += "@");
      var h = this.protocol || "",
          e = this.pathname || "",
          a = this.hash || "",
          r = !1,
          o = "";
      this.host ? r = t + this.host : this.hostname && (r = t + (-1 === this.hostname.indexOf(":") ? this.hostname : "[" + this.hostname + "]"), this.port && (r += ":" + this.port)), this.query && s.isObject(this.query) && Object.keys(this.query).length && (o = y.stringify(this.query));
      var n = this.search || o && "?" + o || "";
      return h && ":" !== h.substr(-1) && (h += ":"), this.slashes || (!h || g[h]) && !1 !== r ? (r = "//" + (r || ""), e && "/" !== e.charAt(0) && (e = "/" + e)) : r || (r = ""), a && "#" !== a.charAt(0) && (a = "#" + a), n && "?" !== n.charAt(0) && (n = "?" + n), h + r + (e = e.replace(/[?#]/g, function (t) {
        return encodeURIComponent(t);
      })) + (n = n.replace("#", "%23")) + a;
    }, h.prototype.resolve = function (t) {
      return this.resolveObject(b(t, !1, !0)).format();
    }, h.prototype.resolveObject = function (t) {
      if (s.isString(t)) {
        var e = new h();
        e.parse(t, !1, !0), t = e;
      }

      for (var a = new h(), r = Object.keys(this), o = 0; o < r.length; o++) {
        var n = r[o];
        a[n] = this[n];
      }

      if (a.hash = t.hash, "" === t.href) return a.href = a.format(), a;

      if (t.slashes && !t.protocol) {
        for (var i = Object.keys(t), l = 0; l < i.length; l++) {
          var p = i[l];
          "protocol" !== p && (a[p] = t[p]);
        }

        return g[a.protocol] && a.hostname && !a.pathname && (a.path = a.pathname = "/"), a.href = a.format(), a;
      }

      if (t.protocol && t.protocol !== a.protocol) {
        if (!g[t.protocol]) {
          for (var c = Object.keys(t), u = 0; u < c.length; u++) {
            var f = c[u];
            a[f] = t[f];
          }

          return a.href = a.format(), a;
        }

        if (a.protocol = t.protocol, t.host || v[t.protocol]) a.pathname = t.pathname;else {
          for (var m = (t.pathname || "").split("/"); m.length && !(t.host = m.shift()););

          t.host || (t.host = ""), t.hostname || (t.hostname = ""), "" !== m[0] && m.unshift(""), m.length < 2 && m.unshift(""), a.pathname = m.join("/");
        }

        if (a.search = t.search, a.query = t.query, a.host = t.host || "", a.auth = t.auth, a.hostname = t.hostname || t.host, a.port = t.port, a.pathname || a.search) {
          var y = a.pathname || "",
              b = a.search || "";
          a.path = y + b;
        }

        return a.slashes = a.slashes || t.slashes, a.href = a.format(), a;
      }

      var q = a.pathname && "/" === a.pathname.charAt(0),
          O = t.host || t.pathname && "/" === t.pathname.charAt(0),
          d = O || q || a.host && t.pathname,
          j = d,
          x = a.pathname && a.pathname.split("/") || [],
          A = (m = t.pathname && t.pathname.split("/") || [], a.protocol && !g[a.protocol]);
      if (A && (a.hostname = "", a.port = null, a.host && ("" === x[0] ? x[0] = a.host : x.unshift(a.host)), a.host = "", t.protocol && (t.hostname = null, t.port = null, t.host && ("" === m[0] ? m[0] = t.host : m.unshift(t.host)), t.host = null), d = d && ("" === m[0] || "" === x[0])), O) a.host = t.host || "" === t.host ? t.host : a.host, a.hostname = t.hostname || "" === t.hostname ? t.hostname : a.hostname, a.search = t.search, a.query = t.query, x = m;else if (m.length) x || (x = []), x.pop(), x = x.concat(m), a.search = t.search, a.query = t.query;else if (!s.isNullOrUndefined(t.search)) {
        if (A) a.hostname = a.host = x.shift(), (k = !!(a.host && a.host.indexOf("@") > 0) && a.host.split("@")) && (a.auth = k.shift(), a.host = a.hostname = k.shift());
        return a.search = t.search, a.query = t.query, s.isNull(a.pathname) && s.isNull(a.search) || (a.path = (a.pathname ? a.pathname : "") + (a.search ? a.search : "")), a.href = a.format(), a;
      }
      if (!x.length) return a.pathname = null, a.search ? a.path = "/" + a.search : a.path = null, a.href = a.format(), a;

      for (var C = x.slice(-1)[0], I = (a.host || t.host || x.length > 1) && ("." === C || ".." === C) || "" === C, w = 0, U = x.length; U >= 0; U--) "." === (C = x[U]) ? x.splice(U, 1) : ".." === C ? (x.splice(U, 1), w++) : w && (x.splice(U, 1), w--);

      if (!d && !j) for (; w--; w) x.unshift("..");
      !d || "" === x[0] || x[0] && "/" === x[0].charAt(0) || x.unshift(""), I && "/" !== x.join("/").substr(-1) && x.push("");
      var k,
          N = "" === x[0] || x[0] && "/" === x[0].charAt(0);
      A && (a.hostname = a.host = N ? "" : x.length ? x.shift() : "", (k = !!(a.host && a.host.indexOf("@") > 0) && a.host.split("@")) && (a.auth = k.shift(), a.host = a.hostname = k.shift()));
      return (d = d || a.host && x.length) && !N && x.unshift(""), x.length ? a.pathname = x.join("/") : (a.pathname = null, a.path = null), s.isNull(a.pathname) && s.isNull(a.search) || (a.path = (a.pathname ? a.pathname : "") + (a.search ? a.search : "")), a.auth = t.auth || a.auth, a.slashes = a.slashes || t.slashes, a.href = a.format(), a;
    }, h.prototype.parseHost = function () {
      var t = this.host,
          s = a.exec(t);
      s && (":" !== (s = s[0]) && (this.port = s.substr(1)), t = t.substr(0, t.length - s.length)), t && (this.hostname = t);
    };
  }, {
    "punycode": "FIMm",
    "./util": "5YsI",
    "querystring": "+00f"
  }],
  "KKrj": [function (require, module, exports) {
    var global = arguments[3];

    var e = arguments[3],
        t = require("./lib/request"),
        r = require("./lib/response"),
        n = require("xtend"),
        o = require("builtin-status-codes"),
        s = require("url"),
        u = exports;

    u.request = function (r, o) {
      r = "string" == typeof r ? s.parse(r) : n(r);
      var u = -1 === e.location.protocol.search(/^https?:$/) ? "http:" : "",
          E = r.protocol || u,
          a = r.hostname || r.host,
          C = r.port,
          i = r.path || "/";
      a && -1 !== a.indexOf(":") && (a = "[" + a + "]"), r.url = (a ? E + "//" + a : "") + (C ? ":" + C : "") + i, r.method = (r.method || "GET").toUpperCase(), r.headers = r.headers || {};
      var T = new t(r);
      return o && T.on("response", o), T;
    }, u.get = function (e, t) {
      var r = u.request(e, t);
      return r.end(), r;
    }, u.ClientRequest = t, u.IncomingMessage = r.IncomingMessage, u.Agent = function () {}, u.Agent.defaultMaxSockets = 4, u.globalAgent = new u.Agent(), u.STATUS_CODES = o, u.METHODS = ["CHECKOUT", "CONNECT", "COPY", "DELETE", "GET", "HEAD", "LOCK", "M-SEARCH", "MERGE", "MKACTIVITY", "MKCOL", "MOVE", "NOTIFY", "OPTIONS", "PATCH", "POST", "PROPFIND", "PROPPATCH", "PURGE", "PUT", "REPORT", "SEARCH", "SUBSCRIBE", "TRACE", "UNLOCK", "UNSUBSCRIBE"];
  }, {
    "./lib/request": "yL7F",
    "./lib/response": "Ux+i",
    "xtend": "K5Tb",
    "builtin-status-codes": "9OpT",
    "url": "Mej7"
  }],
  "wVMl": [function (require, module, exports) {
    var t = require("http"),
        r = require("url"),
        o = module.exports;

    for (var e in t) t.hasOwnProperty(e) && (o[e] = t[e]);

    function p(t) {
      if ("string" == typeof t && (t = r.parse(t)), t.protocol || (t.protocol = "https:"), "https:" !== t.protocol) throw new Error('Protocol "' + t.protocol + '" not supported. Expected "https:"');
      return t;
    }

    o.request = function (r, o) {
      return r = p(r), t.request.call(this, r, o);
    }, o.get = function (r, o) {
      return r = p(r), t.get.call(this, r, o);
    };
  }, {
    "http": "KKrj",
    "url": "Mej7"
  }],
  "d10I": [function (require, module, exports) {
    var Buffer = require("buffer").Buffer;

    var t = require("buffer").Buffer;

    Object.defineProperty(exports, "__esModule", {
      value: !0
    });

    var e = require("http"),
        o = require("https"),
        n = require("url"),
        r = require("@improbable-eng/grpc-web");

    function s() {
      return function (t) {
        return new i(t);
      };
    }

    exports.NodeHttpTransport = s;

    var i = function () {
      function t(t) {
        this.options = t;
      }

      return t.prototype.sendMessage = function (t) {
        this.request.write(a(t)), this.request.end();
      }, t.prototype.finishSend = function () {}, t.prototype.responseCallback = function (t) {
        var e = this;
        this.options.debug && console.log("NodeHttp.response", t.statusCode);
        var o = p(t.headers);
        this.options.onHeaders(new r.grpc.Metadata(o), t.statusCode), t.on("data", function (t) {
          e.options.debug && console.log("NodeHttp.data", t), e.options.onChunk(u(t));
        }), t.on("end", function () {
          e.options.debug && console.log("NodeHttp.end"), e.options.onEnd();
        });
      }, t.prototype.start = function (t) {
        var r = this,
            s = {};
        t.forEach(function (t, e) {
          s[t] = e.join(", ");
        });
        var i = n.parse(this.options.url),
            p = {
          host: i.hostname,
          port: i.port ? parseInt(i.port) : void 0,
          path: i.path,
          headers: s,
          method: "POST"
        };
        "https:" === i.protocol ? this.request = o.request(p, this.responseCallback.bind(this)) : this.request = e.request(p, this.responseCallback.bind(this)), this.request.on("error", function (t) {
          r.options.debug && console.log("NodeHttp.error", t), r.options.onEnd(t);
        });
      }, t.prototype.cancel = function () {
        this.options.debug && console.log("NodeHttp.abort"), this.request.abort();
      }, t;
    }();

    function p(t) {
      var e = {};

      for (var o in t) {
        var n = t[o];
        t.hasOwnProperty(o) && void 0 !== n && (e[o] = n);
      }

      return e;
    }

    function u(t) {
      for (var e = new Uint8Array(t.length), o = 0; o < t.length; o++) e[o] = t[o];

      return e;
    }

    function a(e) {
      for (var o = new t(e.byteLength), n = 0; n < o.length; n++) o[n] = e[n];

      return o;
    }
  }, {
    "http": "KKrj",
    "https": "wVMl",
    "url": "Mej7",
    "@improbable-eng/grpc-web": "SvC3",
    "buffer": "dskh"
  }],
  "V57G": [function (require, module, exports) {
    module.exports = !1;
  }, {}],
  "S7GR": [function (require, module, exports) {
    var global = arguments[3];

    var Buffer = require("buffer").Buffer;

    var global = arguments[3],
        Buffer = require("buffer").Buffer,
        $jscomp = {
      scope: {},
      getGlobal: function getGlobal(e) {
        return "undefined" != typeof window && window === e ? e : void 0 !== global ? global : e;
      }
    };

    $jscomp.global = $jscomp.getGlobal(this), $jscomp.initSymbol = function () {
      $jscomp.global.Symbol || ($jscomp.global.Symbol = $jscomp.Symbol), $jscomp.initSymbol = function () {};
    }, $jscomp.symbolCounter_ = 0, $jscomp.Symbol = function (e) {
      return "jscomp_symbol_" + e + $jscomp.symbolCounter_++;
    }, $jscomp.initSymbolIterator = function () {
      $jscomp.initSymbol(), $jscomp.global.Symbol.iterator || ($jscomp.global.Symbol.iterator = $jscomp.global.Symbol("iterator")), $jscomp.initSymbolIterator = function () {};
    }, $jscomp.makeIterator = function (e) {
      $jscomp.initSymbolIterator(), $jscomp.initSymbol(), $jscomp.initSymbolIterator();
      var t = e[Symbol.iterator];
      if (t) return t.call(e);
      var r = 0;
      return {
        next: function next() {
          return r < e.length ? {
            done: !1,
            value: e[r++]
          } : {
            done: !0
          };
        }
      };
    }, $jscomp.arrayFromIterator = function (e) {
      for (var t, r = []; !(t = e.next()).done;) r.push(t.value);

      return r;
    }, $jscomp.arrayFromIterable = function (e) {
      return e instanceof Array ? e : $jscomp.arrayFromIterator($jscomp.makeIterator(e));
    }, $jscomp.inherits = function (e, t) {
      function r() {}

      for (var o in r.prototype = t.prototype, e.prototype = new r(), e.prototype.constructor = e, t) if (Object.defineProperties) {
        var n = Object.getOwnPropertyDescriptor(t, o);
        n && Object.defineProperty(e, o, n);
      } else e[o] = t[o];
    }, $jscomp.array = $jscomp.array || {}, $jscomp.iteratorFromArray = function (e, t) {
      $jscomp.initSymbolIterator(), e instanceof String && (e += "");
      var r = 0,
          o = {
        next: function next() {
          if (r < e.length) {
            var n = r++;
            return {
              value: t(n, e[n]),
              done: !1
            };
          }

          return o.next = function () {
            return {
              done: !0,
              value: void 0
            };
          }, o.next();
        }
      };
      return $jscomp.initSymbol(), $jscomp.initSymbolIterator(), o[Symbol.iterator] = function () {
        return o;
      }, o;
    }, $jscomp.findInternal = function (e, t, r) {
      e instanceof String && (e = String(e));

      for (var o = e.length, n = 0; n < o; n++) {
        var s = e[n];
        if (t.call(r, s, n, e)) return {
          i: n,
          v: s
        };
      }

      return {
        i: -1,
        v: void 0
      };
    }, $jscomp.array.from = function (e, t, r) {
      $jscomp.initSymbolIterator(), t = null != t ? t : function (e) {
        return e;
      };
      var o = [];
      if ($jscomp.initSymbol(), $jscomp.initSymbolIterator(), "function" == typeof (n = e[Symbol.iterator]) && (e = n.call(e)), "function" == typeof e.next) for (; !(n = e.next()).done;) o.push(t.call(r, n.value));else for (var n = e.length, s = 0; s < n; s++) o.push(t.call(r, e[s]));
      return o;
    }, $jscomp.array.of = function (e) {
      return $jscomp.array.from(arguments);
    }, $jscomp.array.entries = function () {
      return $jscomp.iteratorFromArray(this, function (e, t) {
        return [e, t];
      });
    }, $jscomp.array.installHelper_ = function (e, t) {
      !Array.prototype[e] && Object.defineProperties && Object.defineProperty && Object.defineProperty(Array.prototype, e, {
        configurable: !0,
        enumerable: !1,
        writable: !0,
        value: t
      });
    }, $jscomp.array.entries$install = function () {
      $jscomp.array.installHelper_("entries", $jscomp.array.entries);
    }, $jscomp.array.keys = function () {
      return $jscomp.iteratorFromArray(this, function (e) {
        return e;
      });
    }, $jscomp.array.keys$install = function () {
      $jscomp.array.installHelper_("keys", $jscomp.array.keys);
    }, $jscomp.array.values = function () {
      return $jscomp.iteratorFromArray(this, function (e, t) {
        return t;
      });
    }, $jscomp.array.values$install = function () {
      $jscomp.array.installHelper_("values", $jscomp.array.values);
    }, $jscomp.array.copyWithin = function (e, t, r) {
      var o = this.length;
      if (e = Number(e), t = Number(t), r = Number(null != r ? r : o), e < t) for (r = Math.min(r, o); t < r;) t in this ? this[e++] = this[t++] : (delete this[e++], t++);else for (e += (r = Math.min(r, o + t - e)) - t; r > t;) --r in this ? this[--e] = this[r] : delete this[e];
      return this;
    }, $jscomp.array.copyWithin$install = function () {
      $jscomp.array.installHelper_("copyWithin", $jscomp.array.copyWithin);
    }, $jscomp.array.fill = function (e, t, r) {
      var o = this.length || 0;

      for (0 > t && (t = Math.max(0, o + t)), (null == r || r > o) && (r = o), 0 > (r = Number(r)) && (r = Math.max(0, o + r)), t = Number(t || 0); t < r; t++) this[t] = e;

      return this;
    }, $jscomp.array.fill$install = function () {
      $jscomp.array.installHelper_("fill", $jscomp.array.fill);
    }, $jscomp.array.find = function (e, t) {
      return $jscomp.findInternal(this, e, t).v;
    }, $jscomp.array.find$install = function () {
      $jscomp.array.installHelper_("find", $jscomp.array.find);
    }, $jscomp.array.findIndex = function (e, t) {
      return $jscomp.findInternal(this, e, t).i;
    }, $jscomp.array.findIndex$install = function () {
      $jscomp.array.installHelper_("findIndex", $jscomp.array.findIndex);
    }, $jscomp.ASSUME_NO_NATIVE_MAP = !1, $jscomp.Map$isConformant = function () {
      if ($jscomp.ASSUME_NO_NATIVE_MAP) return !1;
      var e = $jscomp.global.Map;
      if (!e || !e.prototype.entries || "function" != typeof Object.seal) return !1;

      try {
        var t = Object.seal({
          x: 4
        }),
            r = new e($jscomp.makeIterator([[t, "s"]]));
        if ("s" != r.get(t) || 1 != r.size || r.get({
          x: 4
        }) || r.set({
          x: 4
        }, "t") != r || 2 != r.size) return !1;
        var o = r.entries(),
            n = o.next();
        return !n.done && n.value[0] == t && "s" == n.value[1] && !((n = o.next()).done || 4 != n.value[0].x || "t" != n.value[1] || !o.next().done);
      } catch (s) {
        return !1;
      }
    }, $jscomp.Map = function (e) {
      if (this.data_ = {}, this.head_ = $jscomp.Map.createHead(), this.size = 0, e) {
        e = $jscomp.makeIterator(e);

        for (var t; !(t = e.next()).done;) t = t.value, this.set(t[0], t[1]);
      }
    }, $jscomp.Map.prototype.set = function (e, t) {
      var r = $jscomp.Map.maybeGetEntry(this, e);
      return r.list || (r.list = this.data_[r.id] = []), r.entry ? r.entry.value = t : (r.entry = {
        next: this.head_,
        previous: this.head_.previous,
        head: this.head_,
        key: e,
        value: t
      }, r.list.push(r.entry), this.head_.previous.next = r.entry, this.head_.previous = r.entry, this.size++), this;
    }, $jscomp.Map.prototype.delete = function (e) {
      return !(!(e = $jscomp.Map.maybeGetEntry(this, e)).entry || !e.list) && (e.list.splice(e.index, 1), e.list.length || delete this.data_[e.id], e.entry.previous.next = e.entry.next, e.entry.next.previous = e.entry.previous, e.entry.head = null, this.size--, !0);
    }, $jscomp.Map.prototype.clear = function () {
      this.data_ = {}, this.head_ = this.head_.previous = $jscomp.Map.createHead(), this.size = 0;
    }, $jscomp.Map.prototype.has = function (e) {
      return !!$jscomp.Map.maybeGetEntry(this, e).entry;
    }, $jscomp.Map.prototype.get = function (e) {
      return (e = $jscomp.Map.maybeGetEntry(this, e).entry) && e.value;
    }, $jscomp.Map.prototype.entries = function () {
      return $jscomp.Map.makeIterator_(this, function (e) {
        return [e.key, e.value];
      });
    }, $jscomp.Map.prototype.keys = function () {
      return $jscomp.Map.makeIterator_(this, function (e) {
        return e.key;
      });
    }, $jscomp.Map.prototype.values = function () {
      return $jscomp.Map.makeIterator_(this, function (e) {
        return e.value;
      });
    }, $jscomp.Map.prototype.forEach = function (e, t) {
      for (var r, o = this.entries(); !(r = o.next()).done;) r = r.value, e.call(t, r[1], r[0], this);
    }, $jscomp.Map.maybeGetEntry = function (e, t) {
      var r = $jscomp.Map.getId(t),
          o = e.data_[r];
      if (o && Object.prototype.hasOwnProperty.call(e.data_, r)) for (var n = 0; n < o.length; n++) {
        var s = o[n];
        if (t != t && s.key != s.key || t === s.key) return {
          id: r,
          list: o,
          index: n,
          entry: s
        };
      }
      return {
        id: r,
        list: o,
        index: -1,
        entry: void 0
      };
    }, $jscomp.Map.makeIterator_ = function (e, t) {
      var r = e.head_,
          o = {
        next: function next() {
          if (r) {
            for (; r.head != e.head_;) r = r.previous;

            for (; r.next != r.head;) return r = r.next, {
              done: !1,
              value: t(r)
            };

            r = null;
          }

          return {
            done: !0,
            value: void 0
          };
        }
      };
      return $jscomp.initSymbol(), $jscomp.initSymbolIterator(), o[Symbol.iterator] = function () {
        return o;
      }, o;
    }, $jscomp.Map.mapIndex_ = 0, $jscomp.Map.createHead = function () {
      var e = {};
      return e.previous = e.next = e.head = e;
    }, $jscomp.Map.getId = function (e) {
      if (!(e instanceof Object)) return "p_" + e;
      if (!($jscomp.Map.idKey in e)) try {
        $jscomp.Map.defineProperty(e, $jscomp.Map.idKey, {
          value: ++$jscomp.Map.mapIndex_
        });
      } catch (t) {}
      return $jscomp.Map.idKey in e ? e[$jscomp.Map.idKey] : "o_ " + e;
    }, $jscomp.Map.defineProperty = Object.defineProperty ? function (e, t, r) {
      Object.defineProperty(e, t, {
        value: String(r)
      });
    } : function (e, t, r) {
      e[t] = String(r);
    }, $jscomp.Map.Entry = function () {}, $jscomp.Map$install = function () {
      $jscomp.initSymbol(), $jscomp.initSymbolIterator(), $jscomp.Map$isConformant() ? $jscomp.Map = $jscomp.global.Map : ($jscomp.initSymbol(), $jscomp.initSymbolIterator(), $jscomp.Map.prototype[Symbol.iterator] = $jscomp.Map.prototype.entries, $jscomp.initSymbol(), $jscomp.Map.idKey = Symbol("map-id-key"), $jscomp.Map$install = function () {});
    }, $jscomp.math = $jscomp.math || {}, $jscomp.math.clz32 = function (e) {
      if (0 === (e = Number(e) >>> 0)) return 32;
      var t = 0;
      return 0 == (4294901760 & e) && (e <<= 16, t += 16), 0 == (4278190080 & e) && (e <<= 8, t += 8), 0 == (4026531840 & e) && (e <<= 4, t += 4), 0 == (3221225472 & e) && (e <<= 2, t += 2), 0 == (2147483648 & e) && t++, t;
    }, $jscomp.math.imul = function (e, t) {
      var r = 65535 & (e = Number(e)),
          o = 65535 & (t = Number(t));
      return r * o + ((e >>> 16 & 65535) * o + r * (t >>> 16 & 65535) << 16 >>> 0) | 0;
    }, $jscomp.math.sign = function (e) {
      return 0 === (e = Number(e)) || isNaN(e) ? e : 0 < e ? 1 : -1;
    }, $jscomp.math.log10 = function (e) {
      return Math.log(e) / Math.LN10;
    }, $jscomp.math.log2 = function (e) {
      return Math.log(e) / Math.LN2;
    }, $jscomp.math.log1p = function (e) {
      if (.25 > (e = Number(e)) && -.25 < e) {
        for (var t = e, r = 1, o = e, n = 0, s = 1; n != o;) o = (n = o) + (s *= -1) * (t *= e) / ++r;

        return o;
      }

      return Math.log(1 + e);
    }, $jscomp.math.expm1 = function (e) {
      if (.25 > (e = Number(e)) && -.25 < e) {
        for (var t = e, r = 1, o = e, n = 0; n != o;) o = (n = o) + (t *= e / ++r);

        return o;
      }

      return Math.exp(e) - 1;
    }, $jscomp.math.cosh = function (e) {
      return e = Number(e), (Math.exp(e) + Math.exp(-e)) / 2;
    }, $jscomp.math.sinh = function (e) {
      return 0 === (e = Number(e)) ? e : (Math.exp(e) - Math.exp(-e)) / 2;
    }, $jscomp.math.tanh = function (e) {
      if (0 === (e = Number(e))) return e;
      var t = (1 - (t = Math.exp(-2 * Math.abs(e)))) / (1 + t);
      return 0 > e ? -t : t;
    }, $jscomp.math.acosh = function (e) {
      return e = Number(e), Math.log(e + Math.sqrt(e * e - 1));
    }, $jscomp.math.asinh = function (e) {
      if (0 === (e = Number(e))) return e;
      var t = Math.log(Math.abs(e) + Math.sqrt(e * e + 1));
      return 0 > e ? -t : t;
    }, $jscomp.math.atanh = function (e) {
      return e = Number(e), ($jscomp.math.log1p(e) - $jscomp.math.log1p(-e)) / 2;
    }, $jscomp.math.hypot = function (e, t, r) {
      e = Number(e), t = Number(t);
      var o,
          n,
          s,
          i = Math.max(Math.abs(e), Math.abs(t));

      for (o = 2; o < arguments.length; o++) i = Math.max(i, Math.abs(arguments[o]));

      if (1e100 < i || 1e-100 > i) {
        for (s = (e /= i) * e + (t /= i) * t, o = 2; o < arguments.length; o++) s += (n = Number(arguments[o]) / i) * n;

        return Math.sqrt(s) * i;
      }

      for (s = e * e + t * t, o = 2; o < arguments.length; o++) s += (n = Number(arguments[o])) * n;

      return Math.sqrt(s);
    }, $jscomp.math.trunc = function (e) {
      if (e = Number(e), isNaN(e) || 1 / 0 === e || -1 / 0 === e || 0 === e) return e;
      var t = Math.floor(Math.abs(e));
      return 0 > e ? -t : t;
    }, $jscomp.math.cbrt = function (e) {
      if (0 === e) return e;
      e = Number(e);
      var t = Math.pow(Math.abs(e), 1 / 3);
      return 0 > e ? -t : t;
    }, $jscomp.number = $jscomp.number || {}, $jscomp.number.isFinite = function (e) {
      return "number" == typeof e && !isNaN(e) && 1 / 0 !== e && -1 / 0 !== e;
    }, $jscomp.number.isInteger = function (e) {
      return !!$jscomp.number.isFinite(e) && e === Math.floor(e);
    }, $jscomp.number.isNaN = function (e) {
      return "number" == typeof e && isNaN(e);
    }, $jscomp.number.isSafeInteger = function (e) {
      return $jscomp.number.isInteger(e) && Math.abs(e) <= $jscomp.number.MAX_SAFE_INTEGER;
    }, $jscomp.number.EPSILON = Math.pow(2, -52), $jscomp.number.MAX_SAFE_INTEGER = 9007199254740991, $jscomp.number.MIN_SAFE_INTEGER = -9007199254740991, $jscomp.object = $jscomp.object || {}, $jscomp.object.assign = function (e, t) {
      for (var r = 1; r < arguments.length; r++) {
        var o = arguments[r];
        if (o) for (var n in o) Object.prototype.hasOwnProperty.call(o, n) && (e[n] = o[n]);
      }

      return e;
    }, $jscomp.object.is = function (e, t) {
      return e === t ? 0 !== e || 1 / e == 1 / t : e != e && t != t;
    }, $jscomp.ASSUME_NO_NATIVE_SET = !1, $jscomp.Set$isConformant = function () {
      if ($jscomp.ASSUME_NO_NATIVE_SET) return !1;
      var e = $jscomp.global.Set;
      if (!e || !e.prototype.entries || "function" != typeof Object.seal) return !1;

      try {
        var t = Object.seal({
          x: 4
        }),
            r = new e($jscomp.makeIterator([t]));
        if (!r.has(t) || 1 != r.size || r.add(t) != r || 1 != r.size || r.add({
          x: 4
        }) != r || 2 != r.size) return !1;
        var o = r.entries(),
            n = o.next();
        return !n.done && n.value[0] == t && n.value[1] == t && !(n = o.next()).done && n.value[0] != t && 4 == n.value[0].x && n.value[1] == n.value[0] && o.next().done;
      } catch (s) {
        return !1;
      }
    }, $jscomp.Set = function (e) {
      if (this.map_ = new $jscomp.Map(), e) {
        e = $jscomp.makeIterator(e);

        for (var t; !(t = e.next()).done;) this.add(t.value);
      }

      this.size = this.map_.size;
    }, $jscomp.Set.prototype.add = function (e) {
      return this.map_.set(e, e), this.size = this.map_.size, this;
    }, $jscomp.Set.prototype.delete = function (e) {
      return e = this.map_.delete(e), this.size = this.map_.size, e;
    }, $jscomp.Set.prototype.clear = function () {
      this.map_.clear(), this.size = 0;
    }, $jscomp.Set.prototype.has = function (e) {
      return this.map_.has(e);
    }, $jscomp.Set.prototype.entries = function () {
      return this.map_.entries();
    }, $jscomp.Set.prototype.values = function () {
      return this.map_.values();
    }, $jscomp.Set.prototype.forEach = function (e, t) {
      var r = this;
      this.map_.forEach(function (o) {
        return e.call(t, o, o, r);
      });
    }, $jscomp.Set$install = function () {
      $jscomp.Map$install(), $jscomp.Set$isConformant() ? $jscomp.Set = $jscomp.global.Set : ($jscomp.initSymbol(), $jscomp.initSymbolIterator(), $jscomp.Set.prototype[Symbol.iterator] = $jscomp.Set.prototype.values, $jscomp.Set$install = function () {});
    }, $jscomp.string = $jscomp.string || {}, $jscomp.checkStringArgs = function (e, t, r) {
      if (null == e) throw new TypeError("The 'this' value for String.prototype." + r + " must not be null or undefined");
      if (t instanceof RegExp) throw new TypeError("First argument to String.prototype." + r + " must not be a regular expression");
      return e + "";
    }, $jscomp.string.fromCodePoint = function (e) {
      for (var t = "", r = 0; r < arguments.length; r++) {
        var o = Number(arguments[r]);
        if (0 > o || 1114111 < o || o !== Math.floor(o)) throw new RangeError("invalid_code_point " + o);
        65535 >= o ? t += String.fromCharCode(o) : (o -= 65536, t += String.fromCharCode(o >>> 10 & 1023 | 55296), t += String.fromCharCode(1023 & o | 56320));
      }

      return t;
    }, $jscomp.string.repeat = function (e) {
      var t = $jscomp.checkStringArgs(this, null, "repeat");
      if (0 > e || 1342177279 < e) throw new RangeError("Invalid count value");
      e |= 0;

      for (var r = ""; e;) 1 & e && (r += t), (e >>>= 1) && (t += t);

      return r;
    }, $jscomp.string.repeat$install = function () {
      String.prototype.repeat || (String.prototype.repeat = $jscomp.string.repeat);
    }, $jscomp.string.codePointAt = function (e) {
      var t = $jscomp.checkStringArgs(this, null, "codePointAt"),
          r = t.length;

      if (0 <= (e = Number(e) || 0) && e < r) {
        e |= 0;
        var o = t.charCodeAt(e);
        return 55296 > o || 56319 < o || e + 1 === r ? o : 56320 > (e = t.charCodeAt(e + 1)) || 57343 < e ? o : 1024 * (o - 55296) + e + 9216;
      }
    }, $jscomp.string.codePointAt$install = function () {
      String.prototype.codePointAt || (String.prototype.codePointAt = $jscomp.string.codePointAt);
    }, $jscomp.string.includes = function (e, t) {
      return -1 !== $jscomp.checkStringArgs(this, e, "includes").indexOf(e, t || 0);
    }, $jscomp.string.includes$install = function () {
      String.prototype.includes || (String.prototype.includes = $jscomp.string.includes);
    }, $jscomp.string.startsWith = function (e, t) {
      var r = $jscomp.checkStringArgs(this, e, "startsWith");
      e += "";

      for (var o = r.length, n = e.length, s = Math.max(0, Math.min(0 | t, r.length)), i = 0; i < n && s < o;) if (r[s++] != e[i++]) return !1;

      return i >= n;
    }, $jscomp.string.startsWith$install = function () {
      String.prototype.startsWith || (String.prototype.startsWith = $jscomp.string.startsWith);
    }, $jscomp.string.endsWith = function (e, t) {
      var r = $jscomp.checkStringArgs(this, e, "endsWith");
      e += "", void 0 === t && (t = r.length);

      for (var o = Math.max(0, Math.min(0 | t, r.length)), n = e.length; 0 < n && 0 < o;) if (r[--o] != e[--n]) return !1;

      return 0 >= n;
    }, $jscomp.string.endsWith$install = function () {
      String.prototype.endsWith || (String.prototype.endsWith = $jscomp.string.endsWith);
    };
    var COMPILED = !0,
        goog = goog || {};
    goog.global = this, goog.isDef = function (e) {
      return void 0 !== e;
    }, goog.exportPath_ = function (e, t, r) {
      e = e.split("."), r = r || goog.global, e[0] in r || !r.execScript || r.execScript("var " + e[0]);

      for (var o; e.length && (o = e.shift());) !e.length && goog.isDef(t) ? r[o] = t : r = r[o] ? r[o] : r[o] = {};
    }, goog.define = function (e, t) {
      var r = t;
      COMPILED || (goog.global.CLOSURE_UNCOMPILED_DEFINES && Object.prototype.hasOwnProperty.call(goog.global.CLOSURE_UNCOMPILED_DEFINES, e) ? r = goog.global.CLOSURE_UNCOMPILED_DEFINES[e] : goog.global.CLOSURE_DEFINES && Object.prototype.hasOwnProperty.call(goog.global.CLOSURE_DEFINES, e) && (r = goog.global.CLOSURE_DEFINES[e])), goog.exportPath_(e, r);
    }, goog.DEBUG = !0, goog.LOCALE = "en", goog.TRUSTED_SITE = !0, goog.STRICT_MODE_COMPATIBLE = !1, goog.DISALLOW_TEST_ONLY_CODE = COMPILED && !goog.DEBUG, goog.ENABLE_CHROME_APP_SAFE_SCRIPT_LOADING = !1, goog.provide = function (e) {
      if (!COMPILED && goog.isProvided_(e)) throw Error('Namespace "' + e + '" already declared.');
      goog.constructNamespace_(e);
    }, goog.constructNamespace_ = function (e, t) {
      if (!COMPILED) {
        delete goog.implicitNamespaces_[e];

        for (var r = e; (r = r.substring(0, r.lastIndexOf("."))) && !goog.getObjectByName(r);) goog.implicitNamespaces_[r] = !0;
      }

      goog.exportPath_(e, t);
    }, goog.VALID_MODULE_RE_ = /^[a-zA-Z_$][a-zA-Z0-9._$]*$/, goog.module = function (e) {
      if (!goog.isString(e) || !e || -1 == e.search(goog.VALID_MODULE_RE_)) throw Error("Invalid module identifier");
      if (!goog.isInModuleLoader_()) throw Error("Module " + e + " has been loaded incorrectly.");
      if (goog.moduleLoaderState_.moduleName) throw Error("goog.module may only be called once per module.");

      if (goog.moduleLoaderState_.moduleName = e, !COMPILED) {
        if (goog.isProvided_(e)) throw Error('Namespace "' + e + '" already declared.');
        delete goog.implicitNamespaces_[e];
      }
    }, goog.module.get = function (e) {
      return goog.module.getInternal_(e);
    }, goog.module.getInternal_ = function (e) {
      if (!COMPILED) return goog.isProvided_(e) ? e in goog.loadedModules_ ? goog.loadedModules_[e] : goog.getObjectByName(e) : null;
    }, goog.moduleLoaderState_ = null, goog.isInModuleLoader_ = function () {
      return null != goog.moduleLoaderState_;
    }, goog.module.declareLegacyNamespace = function () {
      if (!COMPILED && !goog.isInModuleLoader_()) throw Error("goog.module.declareLegacyNamespace must be called from within a goog.module");
      if (!COMPILED && !goog.moduleLoaderState_.moduleName) throw Error("goog.module must be called prior to goog.module.declareLegacyNamespace.");
      goog.moduleLoaderState_.declareLegacyNamespace = !0;
    }, goog.setTestOnly = function (e) {
      if (goog.DISALLOW_TEST_ONLY_CODE) throw e = e || "", Error("Importing test-only code into non-debug environment" + (e ? ": " + e : "."));
    }, goog.forwardDeclare = function (e) {}, COMPILED || (goog.isProvided_ = function (e) {
      return e in goog.loadedModules_ || !goog.implicitNamespaces_[e] && goog.isDefAndNotNull(goog.getObjectByName(e));
    }, goog.implicitNamespaces_ = {
      "goog.module": !0
    }), goog.getObjectByName = function (e, t) {
      for (var r, o = e.split("."), n = t || goog.global; r = o.shift();) {
        if (!goog.isDefAndNotNull(n[r])) return null;
        n = n[r];
      }

      return n;
    }, goog.globalize = function (e, t) {
      var r,
          o = t || goog.global;

      for (r in e) o[r] = e[r];
    }, goog.addDependency = function (e, t, r, o) {
      if (goog.DEPENDENCIES_ENABLED) {
        var n;
        e = e.replace(/\\/g, "/");

        for (var s = goog.dependencies_, i = 0; n = t[i]; i++) s.nameToPath[n] = e, s.pathIsModule[e] = !!o;

        for (o = 0; t = r[o]; o++) e in s.requires || (s.requires[e] = {}), s.requires[e][t] = !0;
      }
    }, goog.ENABLE_DEBUG_LOADER = !0, goog.logToConsole_ = function (e) {
      goog.global.console && goog.global.console.error(e);
    }, goog.require = function (e) {
      if (!COMPILED) {
        if (goog.ENABLE_DEBUG_LOADER && goog.IS_OLD_IE_ && goog.maybeProcessDeferredDep_(e), goog.isProvided_(e)) return goog.isInModuleLoader_() ? goog.module.getInternal_(e) : null;

        if (goog.ENABLE_DEBUG_LOADER) {
          var t = goog.getPathFromDeps_(e);
          if (t) return goog.writeScripts_(t), null;
        }

        throw e = "goog.require could not find: " + e, goog.logToConsole_(e), Error(e);
      }
    }, goog.basePath = "", goog.nullFunction = function () {}, goog.abstractMethod = function () {
      throw Error("unimplemented abstract method");
    }, goog.addSingletonGetter = function (e) {
      e.getInstance = function () {
        return e.instance_ ? e.instance_ : (goog.DEBUG && (goog.instantiatedSingletons_[goog.instantiatedSingletons_.length] = e), e.instance_ = new e());
      };
    }, goog.instantiatedSingletons_ = [], goog.LOAD_MODULE_USING_EVAL = !0, goog.SEAL_MODULE_EXPORTS = goog.DEBUG, goog.loadedModules_ = {}, goog.DEPENDENCIES_ENABLED = !COMPILED && goog.ENABLE_DEBUG_LOADER, goog.DEPENDENCIES_ENABLED && (goog.dependencies_ = {
      pathIsModule: {},
      nameToPath: {},
      requires: {},
      visited: {},
      written: {},
      deferred: {}
    }, goog.inHtmlDocument_ = function () {
      var e = goog.global.document;
      return null != e && "write" in e;
    }, goog.findBasePath_ = function () {
      if (goog.isDef(goog.global.CLOSURE_BASE_PATH)) goog.basePath = goog.global.CLOSURE_BASE_PATH;else if (goog.inHtmlDocument_()) for (var e = goog.global.document.getElementsByTagName("SCRIPT"), t = e.length - 1; 0 <= t; --t) {
        var r = e[t].src,
            o = -1 == (o = r.lastIndexOf("?")) ? r.length : o;

        if ("base.js" == r.substr(o - 7, 7)) {
          goog.basePath = r.substr(0, o - 7);
          break;
        }
      }
    }, goog.importScript_ = function (e, t) {
      (goog.global.CLOSURE_IMPORT_SCRIPT || goog.writeScriptTag_)(e, t) && (goog.dependencies_.written[e] = !0);
    }, goog.IS_OLD_IE_ = !(goog.global.atob || !goog.global.document || !goog.global.document.all), goog.importModule_ = function (e) {
      goog.importScript_("", 'goog.retrieveAndExecModule_("' + e + '");') && (goog.dependencies_.written[e] = !0);
    }, goog.queuedModules_ = [], goog.wrapModule_ = function (e, t) {
      return goog.LOAD_MODULE_USING_EVAL && goog.isDef(goog.global.JSON) ? "goog.loadModule(" + goog.global.JSON.stringify(t + "\n//# sourceURL=" + e + "\n") + ");" : 'goog.loadModule(function(exports) {"use strict";' + t + "\n;return exports});\n//# sourceURL=" + e + "\n";
    }, goog.loadQueuedModules_ = function () {
      var e = goog.queuedModules_.length;

      if (0 < e) {
        var t = goog.queuedModules_;
        goog.queuedModules_ = [];

        for (var r = 0; r < e; r++) goog.maybeProcessDeferredPath_(t[r]);
      }
    }, goog.maybeProcessDeferredDep_ = function (e) {
      goog.isDeferredModule_(e) && goog.allDepsAreAvailable_(e) && (e = goog.getPathFromDeps_(e), goog.maybeProcessDeferredPath_(goog.basePath + e));
    }, goog.isDeferredModule_ = function (e) {
      return !(!(e = goog.getPathFromDeps_(e)) || !goog.dependencies_.pathIsModule[e]) && goog.basePath + e in goog.dependencies_.deferred;
    }, goog.allDepsAreAvailable_ = function (e) {
      if ((e = goog.getPathFromDeps_(e)) && e in goog.dependencies_.requires) for (var t in goog.dependencies_.requires[e]) if (!goog.isProvided_(t) && !goog.isDeferredModule_(t)) return !1;
      return !0;
    }, goog.maybeProcessDeferredPath_ = function (e) {
      if (e in goog.dependencies_.deferred) {
        var t = goog.dependencies_.deferred[e];
        delete goog.dependencies_.deferred[e], goog.globalEval(t);
      }
    }, goog.loadModuleFromUrl = function (e) {
      goog.retrieveAndExecModule_(e);
    }, goog.loadModule = function (e) {
      var t = goog.moduleLoaderState_;

      try {
        var r;
        if (goog.moduleLoaderState_ = {
          moduleName: void 0,
          declareLegacyNamespace: !1
        }, goog.isFunction(e)) r = e.call(goog.global, {});else {
          if (!goog.isString(e)) throw Error("Invalid module definition");
          r = goog.loadModuleFromSource_.call(goog.global, e);
        }
        var o = goog.moduleLoaderState_.moduleName;
        if (!goog.isString(o) || !o) throw Error('Invalid module name "' + o + '"');
        goog.moduleLoaderState_.declareLegacyNamespace ? goog.constructNamespace_(o, r) : goog.SEAL_MODULE_EXPORTS && Object.seal && Object.seal(r), goog.loadedModules_[o] = r;
      } finally {
        goog.moduleLoaderState_ = t;
      }
    }, goog.loadModuleFromSource_ = function (a) {
      return eval(a), {};
    }, goog.writeScriptSrcNode_ = function (e) {
      goog.global.document.write('<script type="text/javascript" src="' + e + '"><\/script>');
    }, goog.appendScriptSrcNode_ = function (e) {
      var t = goog.global.document,
          r = t.createElement("script");
      r.type = "text/javascript", r.src = e, r.defer = !1, r.async = !1, t.head.appendChild(r);
    }, goog.writeScriptTag_ = function (e, t) {
      if (goog.inHtmlDocument_()) {
        var r = goog.global.document;

        if (!goog.ENABLE_CHROME_APP_SAFE_SCRIPT_LOADING && "complete" == r.readyState) {
          if (/\bdeps.js$/.test(e)) return !1;
          throw Error('Cannot write "' + e + '" after document load');
        }

        var o = goog.IS_OLD_IE_;
        return void 0 === t ? o ? (o = " onreadystatechange='goog.onScriptLoad_(this, " + ++goog.lastNonModuleScriptIndex_ + ")' ", r.write('<script type="text/javascript" src="' + e + '"' + o + "><\/script>")) : goog.ENABLE_CHROME_APP_SAFE_SCRIPT_LOADING ? goog.appendScriptSrcNode_(e) : goog.writeScriptSrcNode_(e) : r.write('<script type="text/javascript">' + t + "<\/script>"), !0;
      }

      return !1;
    }, goog.lastNonModuleScriptIndex_ = 0, goog.onScriptLoad_ = function (e, t) {
      return "complete" == e.readyState && goog.lastNonModuleScriptIndex_ == t && goog.loadQueuedModules_(), !0;
    }, goog.writeScripts_ = function (e) {
      var t = [],
          r = {},
          o = goog.dependencies_;

      for (function e(n) {
        if (!((n in o.written) || (n in o.visited))) {
          if (o.visited[n] = !0, (n in o.requires)) for (var s in o.requires[n]) if (!goog.isProvided_(s)) {
            if (!(s in o.nameToPath)) throw Error("Undefined nameToPath for " + s);
            e(o.nameToPath[s]);
          }
          (n in r) || (r[n] = !0, t.push(n));
        }
      }(e), e = 0; e < t.length; e++) {
        var n = t[e];
        goog.dependencies_.written[n] = !0;
      }

      var s = goog.moduleLoaderState_;

      for (goog.moduleLoaderState_ = null, e = 0; e < t.length; e++) {
        if (!(n = t[e])) throw goog.moduleLoaderState_ = s, Error("Undefined script input");
        o.pathIsModule[n] ? goog.importModule_(goog.basePath + n) : goog.importScript_(goog.basePath + n);
      }

      goog.moduleLoaderState_ = s;
    }, goog.getPathFromDeps_ = function (e) {
      return e in goog.dependencies_.nameToPath ? goog.dependencies_.nameToPath[e] : null;
    }, goog.findBasePath_(), goog.global.CLOSURE_NO_DEPS || goog.importScript_(goog.basePath + "deps.js")), goog.normalizePath_ = function (e) {
      e = e.split("/");

      for (var t = 0; t < e.length;) "." == e[t] ? e.splice(t, 1) : t && ".." == e[t] && e[t - 1] && ".." != e[t - 1] ? e.splice(--t, 2) : t++;

      return e.join("/");
    }, goog.loadFileSync_ = function (e) {
      if (goog.global.CLOSURE_LOAD_FILE_SYNC) return goog.global.CLOSURE_LOAD_FILE_SYNC(e);
      var t = new goog.global.XMLHttpRequest();
      return t.open("get", e, !1), t.send(), t.responseText;
    }, goog.retrieveAndExecModule_ = function (e) {
      if (!COMPILED) {
        var t = e;
        e = goog.normalizePath_(e);
        var r = goog.global.CLOSURE_IMPORT_SCRIPT || goog.writeScriptTag_,
            o = goog.loadFileSync_(e);
        if (null == o) throw Error("load of " + e + "failed");
        o = goog.wrapModule_(e, o), goog.IS_OLD_IE_ ? (goog.dependencies_.deferred[t] = o, goog.queuedModules_.push(t)) : r(e, o);
      }
    }, goog.typeOf = function (e) {
      var t = typeof e;

      if ("object" == t) {
        if (!e) return "null";
        if (e instanceof Array) return "array";
        if (e instanceof Object) return t;
        var r = Object.prototype.toString.call(e);
        if ("[object Window]" == r) return "object";
        if ("[object Array]" == r || "number" == typeof e.length && void 0 !== e.splice && void 0 !== e.propertyIsEnumerable && !e.propertyIsEnumerable("splice")) return "array";
        if ("[object Function]" == r || void 0 !== e.call && void 0 !== e.propertyIsEnumerable && !e.propertyIsEnumerable("call")) return "function";
      } else if ("function" == t && void 0 === e.call) return "object";

      return t;
    }, goog.isNull = function (e) {
      return null === e;
    }, goog.isDefAndNotNull = function (e) {
      return null != e;
    }, goog.isArray = function (e) {
      return "array" == goog.typeOf(e);
    }, goog.isArrayLike = function (e) {
      var t = goog.typeOf(e);
      return "array" == t || "object" == t && "number" == typeof e.length;
    }, goog.isDateLike = function (e) {
      return goog.isObject(e) && "function" == typeof e.getFullYear;
    }, goog.isString = function (e) {
      return "string" == typeof e;
    }, goog.isBoolean = function (e) {
      return "boolean" == typeof e;
    }, goog.isNumber = function (e) {
      return "number" == typeof e;
    }, goog.isFunction = function (e) {
      return "function" == goog.typeOf(e);
    }, goog.isObject = function (e) {
      var t = typeof e;
      return "object" == t && null != e || "function" == t;
    }, goog.getUid = function (e) {
      return e[goog.UID_PROPERTY_] || (e[goog.UID_PROPERTY_] = ++goog.uidCounter_);
    }, goog.hasUid = function (e) {
      return !!e[goog.UID_PROPERTY_];
    }, goog.removeUid = function (e) {
      null !== e && "removeAttribute" in e && e.removeAttribute(goog.UID_PROPERTY_);

      try {
        delete e[goog.UID_PROPERTY_];
      } catch (t) {}
    }, goog.UID_PROPERTY_ = "closure_uid_" + (1e9 * Math.random() >>> 0), goog.uidCounter_ = 0, goog.getHashCode = goog.getUid, goog.removeHashCode = goog.removeUid, goog.cloneObject = function (e) {
      if ("object" == (r = goog.typeOf(e)) || "array" == r) {
        if (e.clone) return e.clone();
        var t,
            r = "array" == r ? [] : {};

        for (t in e) r[t] = goog.cloneObject(e[t]);

        return r;
      }

      return e;
    }, goog.bindNative_ = function (e, t, r) {
      return e.call.apply(e.bind, arguments);
    }, goog.bindJs_ = function (e, t, r) {
      if (!e) throw Error();

      if (2 < arguments.length) {
        var o = Array.prototype.slice.call(arguments, 2);
        return function () {
          var r = Array.prototype.slice.call(arguments);
          return Array.prototype.unshift.apply(r, o), e.apply(t, r);
        };
      }

      return function () {
        return e.apply(t, arguments);
      };
    }, goog.bind = function (e, t, r) {
      return Function.prototype.bind && -1 != Function.prototype.bind.toString().indexOf("native code") ? goog.bind = goog.bindNative_ : goog.bind = goog.bindJs_, goog.bind.apply(null, arguments);
    }, goog.partial = function (e, t) {
      var r = Array.prototype.slice.call(arguments, 1);
      return function () {
        var t = r.slice();
        return t.push.apply(t, arguments), e.apply(this, t);
      };
    }, goog.mixin = function (e, t) {
      for (var r in t) e[r] = t[r];
    }, goog.now = goog.TRUSTED_SITE && Date.now || function () {
      return +new Date();
    }, goog.globalEval = function (e) {
      if (goog.global.execScript) goog.global.execScript(e, "JavaScript");else {
        if (!goog.global.eval) throw Error("goog.globalEval not available");
        if (null == goog.evalWorksForGlobals_) if (goog.global.eval("var _evalTest_ = 1;"), void 0 !== goog.global._evalTest_) {
          try {
            delete goog.global._evalTest_;
          } catch (o) {}

          goog.evalWorksForGlobals_ = !0;
        } else goog.evalWorksForGlobals_ = !1;
        if (goog.evalWorksForGlobals_) goog.global.eval(e);else {
          var t = goog.global.document,
              r = t.createElement("SCRIPT");
          r.type = "text/javascript", r.defer = !1, r.appendChild(t.createTextNode(e)), t.body.appendChild(r), t.body.removeChild(r);
        }
      }
    }, goog.evalWorksForGlobals_ = null, goog.getCssName = function (e, t) {
      var r = function r(e) {
        return goog.cssNameMapping_[e] || e;
      },
          o = function o(e) {
        e = e.split("-");

        for (var t = [], o = 0; o < e.length; o++) t.push(r(e[o]));

        return t.join("-");
      };

      o = goog.cssNameMapping_ ? "BY_WHOLE" == goog.cssNameMappingStyle_ ? r : o : function (e) {
        return e;
      };
      return t ? e + "-" + o(t) : o(e);
    }, goog.setCssNameMapping = function (e, t) {
      goog.cssNameMapping_ = e, goog.cssNameMappingStyle_ = t;
    }, !COMPILED && goog.global.CLOSURE_CSS_NAME_MAPPING && (goog.cssNameMapping_ = goog.global.CLOSURE_CSS_NAME_MAPPING), goog.getMsg = function (e, t) {
      return t && (e = e.replace(/\{\$([^}]+)}/g, function (e, r) {
        return null != t && r in t ? t[r] : e;
      })), e;
    }, goog.getMsgWithFallback = function (e, t) {
      return e;
    }, goog.exportSymbol = function (e, t, r) {
      goog.exportPath_(e, t, r);
    }, goog.exportProperty = function (e, t, r) {
      e[t] = r;
    }, goog.inherits = function (e, t) {
      function r() {}

      r.prototype = t.prototype, e.superClass_ = t.prototype, e.prototype = new r(), e.prototype.constructor = e, e.base = function (e, r, o) {
        for (var n = Array(arguments.length - 2), s = 2; s < arguments.length; s++) n[s - 2] = arguments[s];

        return t.prototype[r].apply(e, n);
      };
    }, goog.base = function (e, t, r) {
      var o = arguments.callee.caller;
      if (goog.STRICT_MODE_COMPATIBLE || goog.DEBUG && !o) throw Error("arguments.caller not defined.  goog.base() cannot be used with strict mode code. See http://www.ecma-international.org/ecma-262/5.1/#sec-C");

      if (o.superClass_) {
        for (var n = Array(arguments.length - 1), s = 1; s < arguments.length; s++) n[s - 1] = arguments[s];

        return o.superClass_.constructor.apply(e, n);
      }

      for (n = Array(arguments.length - 2), s = 2; s < arguments.length; s++) n[s - 2] = arguments[s];

      s = !1;

      for (var i = e.constructor; i; i = i.superClass_ && i.superClass_.constructor) if (i.prototype[t] === o) s = !0;else if (s) return i.prototype[t].apply(e, n);

      if (e[t] === o) return e.constructor.prototype[t].apply(e, n);
      throw Error("goog.base called from a method of one name to a method of a different name");
    }, goog.scope = function (e) {
      e.call(goog.global);
    }, COMPILED || (goog.global.COMPILED = COMPILED), goog.defineClass = function (e, t) {
      var r = t.constructor,
          o = t.statics;
      return r && r != Object.prototype.constructor || (r = function r() {
        throw Error("cannot instantiate an interface (no constructor defined).");
      }), r = goog.defineClass.createSealingConstructor_(r, e), e && goog.inherits(r, e), delete t.constructor, delete t.statics, goog.defineClass.applyProperties_(r.prototype, t), null != o && (o instanceof Function ? o(r) : goog.defineClass.applyProperties_(r, o)), r;
    }, goog.defineClass.SEAL_CLASS_INSTANCES = goog.DEBUG, goog.defineClass.createSealingConstructor_ = function (e, t) {
      if (goog.defineClass.SEAL_CLASS_INSTANCES && Object.seal instanceof Function) {
        if (t && t.prototype && t.prototype[goog.UNSEALABLE_CONSTRUCTOR_PROPERTY_]) return e;

        var r = function r() {
          var t = e.apply(this, arguments) || this;
          return t[goog.UID_PROPERTY_] = t[goog.UID_PROPERTY_], this.constructor === r && Object.seal(t), t;
        };

        return r;
      }

      return e;
    }, goog.defineClass.OBJECT_PROTOTYPE_FIELDS_ = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" "), goog.defineClass.applyProperties_ = function (e, t) {
      for (var r in t) Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);

      for (var o = 0; o < goog.defineClass.OBJECT_PROTOTYPE_FIELDS_.length; o++) r = goog.defineClass.OBJECT_PROTOTYPE_FIELDS_[o], Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);
    }, goog.tagUnsealableClass = function (e) {
      !COMPILED && goog.defineClass.SEAL_CLASS_INSTANCES && (e.prototype[goog.UNSEALABLE_CONSTRUCTOR_PROPERTY_] = !0);
    }, goog.UNSEALABLE_CONSTRUCTOR_PROPERTY_ = "goog_defineClass_legacy_unsealable", goog.dom = {}, goog.dom.NodeType = {
      ELEMENT: 1,
      ATTRIBUTE: 2,
      TEXT: 3,
      CDATA_SECTION: 4,
      ENTITY_REFERENCE: 5,
      ENTITY: 6,
      PROCESSING_INSTRUCTION: 7,
      COMMENT: 8,
      DOCUMENT: 9,
      DOCUMENT_TYPE: 10,
      DOCUMENT_FRAGMENT: 11,
      NOTATION: 12
    }, goog.debug = {}, goog.debug.Error = function (e) {
      if (Error.captureStackTrace) Error.captureStackTrace(this, goog.debug.Error);else {
        var t = Error().stack;
        t && (this.stack = t);
      }
      e && (this.message = String(e)), this.reportErrorToServer = !0;
    }, goog.inherits(goog.debug.Error, Error), goog.debug.Error.prototype.name = "CustomError", goog.string = {}, goog.string.DETECT_DOUBLE_ESCAPING = !1, goog.string.FORCE_NON_DOM_HTML_UNESCAPING = !1, goog.string.Unicode = {
      NBSP: " "
    }, goog.string.startsWith = function (e, t) {
      return 0 == e.lastIndexOf(t, 0);
    }, goog.string.endsWith = function (e, t) {
      var r = e.length - t.length;
      return 0 <= r && e.indexOf(t, r) == r;
    }, goog.string.caseInsensitiveStartsWith = function (e, t) {
      return 0 == goog.string.caseInsensitiveCompare(t, e.substr(0, t.length));
    }, goog.string.caseInsensitiveEndsWith = function (e, t) {
      return 0 == goog.string.caseInsensitiveCompare(t, e.substr(e.length - t.length, t.length));
    }, goog.string.caseInsensitiveEquals = function (e, t) {
      return e.toLowerCase() == t.toLowerCase();
    }, goog.string.subs = function (e, t) {
      for (var r = e.split("%s"), o = "", n = Array.prototype.slice.call(arguments, 1); n.length && 1 < r.length;) o += r.shift() + n.shift();

      return o + r.join("%s");
    }, goog.string.collapseWhitespace = function (e) {
      return e.replace(/[\s\xa0]+/g, " ").replace(/^\s+|\s+$/g, "");
    }, goog.string.isEmptyOrWhitespace = function (e) {
      return /^[\s\xa0]*$/.test(e);
    }, goog.string.isEmptyString = function (e) {
      return 0 == e.length;
    }, goog.string.isEmpty = goog.string.isEmptyOrWhitespace, goog.string.isEmptyOrWhitespaceSafe = function (e) {
      return goog.string.isEmptyOrWhitespace(goog.string.makeSafe(e));
    }, goog.string.isEmptySafe = goog.string.isEmptyOrWhitespaceSafe, goog.string.isBreakingWhitespace = function (e) {
      return !/[^\t\n\r ]/.test(e);
    }, goog.string.isAlpha = function (e) {
      return !/[^a-zA-Z]/.test(e);
    }, goog.string.isNumeric = function (e) {
      return !/[^0-9]/.test(e);
    }, goog.string.isAlphaNumeric = function (e) {
      return !/[^a-zA-Z0-9]/.test(e);
    }, goog.string.isSpace = function (e) {
      return " " == e;
    }, goog.string.isUnicodeChar = function (e) {
      return 1 == e.length && " " <= e && "~" >= e || "" <= e && "�" >= e;
    }, goog.string.stripNewlines = function (e) {
      return e.replace(/(\r\n|\r|\n)+/g, " ");
    }, goog.string.canonicalizeNewlines = function (e) {
      return e.replace(/(\r\n|\r|\n)/g, "\n");
    }, goog.string.normalizeWhitespace = function (e) {
      return e.replace(/\xa0|\s/g, " ");
    }, goog.string.normalizeSpaces = function (e) {
      return e.replace(/\xa0|[ \t]+/g, " ");
    }, goog.string.collapseBreakingSpaces = function (e) {
      return e.replace(/[\t\r\n ]+/g, " ").replace(/^[\t\r\n ]+|[\t\r\n ]+$/g, "");
    }, goog.string.trim = goog.TRUSTED_SITE && String.prototype.trim ? function (e) {
      return e.trim();
    } : function (e) {
      return e.replace(/^[\s\xa0]+|[\s\xa0]+$/g, "");
    }, goog.string.trimLeft = function (e) {
      return e.replace(/^[\s\xa0]+/, "");
    }, goog.string.trimRight = function (e) {
      return e.replace(/[\s\xa0]+$/, "");
    }, goog.string.caseInsensitiveCompare = function (e, t) {
      var r = String(e).toLowerCase(),
          o = String(t).toLowerCase();
      return r < o ? -1 : r == o ? 0 : 1;
    }, goog.string.numberAwareCompare_ = function (e, t, r) {
      if (e == t) return 0;
      if (!e) return -1;
      if (!t) return 1;

      for (var o = e.toLowerCase().match(r), n = t.toLowerCase().match(r), s = Math.min(o.length, n.length), i = 0; i < s; i++) {
        r = o[i];
        var a = n[i];
        if (r != a) return e = parseInt(r, 10), !isNaN(e) && (t = parseInt(a, 10), !isNaN(t) && e - t) ? e - t : r < a ? -1 : 1;
      }

      return o.length != n.length ? o.length - n.length : e < t ? -1 : 1;
    }, goog.string.intAwareCompare = function (e, t) {
      return goog.string.numberAwareCompare_(e, t, /\d+|\D+/g);
    }, goog.string.floatAwareCompare = function (e, t) {
      return goog.string.numberAwareCompare_(e, t, /\d+|\.\d+|\D+/g);
    }, goog.string.numerateCompare = goog.string.floatAwareCompare, goog.string.urlEncode = function (e) {
      return encodeURIComponent(String(e));
    }, goog.string.urlDecode = function (e) {
      return decodeURIComponent(e.replace(/\+/g, " "));
    }, goog.string.newLineToBr = function (e, t) {
      return e.replace(/(\r\n|\r|\n)/g, t ? "<br />" : "<br>");
    }, goog.string.htmlEscape = function (e, t) {
      if (t) e = e.replace(goog.string.AMP_RE_, "&amp;").replace(goog.string.LT_RE_, "&lt;").replace(goog.string.GT_RE_, "&gt;").replace(goog.string.QUOT_RE_, "&quot;").replace(goog.string.SINGLE_QUOTE_RE_, "&#39;").replace(goog.string.NULL_RE_, "&#0;"), goog.string.DETECT_DOUBLE_ESCAPING && (e = e.replace(goog.string.E_RE_, "&#101;"));else {
        if (!goog.string.ALL_RE_.test(e)) return e;
        -1 != e.indexOf("&") && (e = e.replace(goog.string.AMP_RE_, "&amp;")), -1 != e.indexOf("<") && (e = e.replace(goog.string.LT_RE_, "&lt;")), -1 != e.indexOf(">") && (e = e.replace(goog.string.GT_RE_, "&gt;")), -1 != e.indexOf('"') && (e = e.replace(goog.string.QUOT_RE_, "&quot;")), -1 != e.indexOf("'") && (e = e.replace(goog.string.SINGLE_QUOTE_RE_, "&#39;")), -1 != e.indexOf("\0") && (e = e.replace(goog.string.NULL_RE_, "&#0;")), goog.string.DETECT_DOUBLE_ESCAPING && -1 != e.indexOf("e") && (e = e.replace(goog.string.E_RE_, "&#101;"));
      }
      return e;
    }, goog.string.AMP_RE_ = /&/g, goog.string.LT_RE_ = /</g, goog.string.GT_RE_ = />/g, goog.string.QUOT_RE_ = /"/g, goog.string.SINGLE_QUOTE_RE_ = /'/g, goog.string.NULL_RE_ = /\x00/g, goog.string.E_RE_ = /e/g, goog.string.ALL_RE_ = goog.string.DETECT_DOUBLE_ESCAPING ? /[\x00&<>"'e]/ : /[\x00&<>"']/, goog.string.unescapeEntities = function (e) {
      return goog.string.contains(e, "&") ? !goog.string.FORCE_NON_DOM_HTML_UNESCAPING && "document" in goog.global ? goog.string.unescapeEntitiesUsingDom_(e) : goog.string.unescapePureXmlEntities_(e) : e;
    }, goog.string.unescapeEntitiesWithDocument = function (e, t) {
      return goog.string.contains(e, "&") ? goog.string.unescapeEntitiesUsingDom_(e, t) : e;
    }, goog.string.unescapeEntitiesUsingDom_ = function (e, t) {
      var r,
          o = {
        "&amp;": "&",
        "&lt;": "<",
        "&gt;": ">",
        "&quot;": '"'
      };
      return r = t ? t.createElement("div") : goog.global.document.createElement("div"), e.replace(goog.string.HTML_ENTITY_PATTERN_, function (e, t) {
        var n = o[e];
        if (n) return n;

        if ("#" == t.charAt(0)) {
          var s = Number("0" + t.substr(1));
          isNaN(s) || (n = String.fromCharCode(s));
        }

        return n || (r.innerHTML = e + " ", n = r.firstChild.nodeValue.slice(0, -1)), o[e] = n;
      });
    }, goog.string.unescapePureXmlEntities_ = function (e) {
      return e.replace(/&([^;]+);/g, function (e, t) {
        switch (t) {
          case "amp":
            return "&";

          case "lt":
            return "<";

          case "gt":
            return ">";

          case "quot":
            return '"';

          default:
            if ("#" == t.charAt(0)) {
              var r = Number("0" + t.substr(1));
              if (!isNaN(r)) return String.fromCharCode(r);
            }

            return e;
        }
      });
    }, goog.string.HTML_ENTITY_PATTERN_ = /&([^;\s<&]+);?/g, goog.string.whitespaceEscape = function (e, t) {
      return goog.string.newLineToBr(e.replace(/  /g, " &#160;"), t);
    }, goog.string.preserveSpaces = function (e) {
      return e.replace(/(^|[\n ]) /g, "$1" + goog.string.Unicode.NBSP);
    }, goog.string.stripQuotes = function (e, t) {
      for (var r = t.length, o = 0; o < r; o++) {
        var n = 1 == r ? t : t.charAt(o);
        if (e.charAt(0) == n && e.charAt(e.length - 1) == n) return e.substring(1, e.length - 1);
      }

      return e;
    }, goog.string.truncate = function (e, t, r) {
      return r && (e = goog.string.unescapeEntities(e)), e.length > t && (e = e.substring(0, t - 3) + "..."), r && (e = goog.string.htmlEscape(e)), e;
    }, goog.string.truncateMiddle = function (e, t, r, o) {
      if (r && (e = goog.string.unescapeEntities(e)), o && e.length > t) {
        o > t && (o = t);
        var n = e.length - o;
        e = e.substring(0, t - o) + "..." + e.substring(n);
      } else e.length > t && (o = Math.floor(t / 2), n = e.length - o, e = e.substring(0, o + t % 2) + "..." + e.substring(n));

      return r && (e = goog.string.htmlEscape(e)), e;
    }, goog.string.specialEscapeChars_ = {
      "\0": "\\0",
      "\b": "\\b",
      "\f": "\\f",
      "\n": "\\n",
      "\r": "\\r",
      "\t": "\\t",
      "\v": "\\x0B",
      '"': '\\"',
      "\\": "\\\\",
      "<": "<"
    }, goog.string.jsEscapeCache_ = {
      "'": "\\'"
    }, goog.string.quote = function (e) {
      e = String(e);

      for (var t = ['"'], r = 0; r < e.length; r++) {
        var o = e.charAt(r),
            n = o.charCodeAt(0);
        t[r + 1] = goog.string.specialEscapeChars_[o] || (31 < n && 127 > n ? o : goog.string.escapeChar(o));
      }

      return t.push('"'), t.join("");
    }, goog.string.escapeString = function (e) {
      for (var t = [], r = 0; r < e.length; r++) t[r] = goog.string.escapeChar(e.charAt(r));

      return t.join("");
    }, goog.string.escapeChar = function (e) {
      if (e in goog.string.jsEscapeCache_) return goog.string.jsEscapeCache_[e];
      if (e in goog.string.specialEscapeChars_) return goog.string.jsEscapeCache_[e] = goog.string.specialEscapeChars_[e];
      var t,
          r = e.charCodeAt(0);
      return 31 < r && 127 > r ? t = e : (256 > r ? (t = "\\x", (16 > r || 256 < r) && (t += "0")) : (t = "\\u", 4096 > r && (t += "0")), t += r.toString(16).toUpperCase()), goog.string.jsEscapeCache_[e] = t;
    }, goog.string.contains = function (e, t) {
      return -1 != e.indexOf(t);
    }, goog.string.caseInsensitiveContains = function (e, t) {
      return goog.string.contains(e.toLowerCase(), t.toLowerCase());
    }, goog.string.countOf = function (e, t) {
      return e && t ? e.split(t).length - 1 : 0;
    }, goog.string.removeAt = function (e, t, r) {
      var o = e;
      return 0 <= t && t < e.length && 0 < r && (o = e.substr(0, t) + e.substr(t + r, e.length - t - r)), o;
    }, goog.string.remove = function (e, t) {
      var r = new RegExp(goog.string.regExpEscape(t), "");
      return e.replace(r, "");
    }, goog.string.removeAll = function (e, t) {
      var r = new RegExp(goog.string.regExpEscape(t), "g");
      return e.replace(r, "");
    }, goog.string.regExpEscape = function (e) {
      return String(e).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1").replace(/\x08/g, "\\x08");
    }, goog.string.repeat = String.prototype.repeat ? function (e, t) {
      return e.repeat(t);
    } : function (e, t) {
      return Array(t + 1).join(e);
    }, goog.string.padNumber = function (e, t, r) {
      return -1 == (r = (e = goog.isDef(r) ? e.toFixed(r) : String(e)).indexOf(".")) && (r = e.length), goog.string.repeat("0", Math.max(0, t - r)) + e;
    }, goog.string.makeSafe = function (e) {
      return null == e ? "" : String(e);
    }, goog.string.buildString = function (e) {
      return Array.prototype.join.call(arguments, "");
    }, goog.string.getRandomString = function () {
      return Math.floor(2147483648 * Math.random()).toString(36) + Math.abs(Math.floor(2147483648 * Math.random()) ^ goog.now()).toString(36);
    }, goog.string.compareVersions = function (e, t) {
      for (var r = 0, o = goog.string.trim(String(e)).split("."), n = goog.string.trim(String(t)).split("."), s = Math.max(o.length, n.length), i = 0; 0 == r && i < s; i++) {
        var a = o[i] || "",
            g = n[i] || "",
            p = RegExp("(\\d*)(\\D*)", "g"),
            u = RegExp("(\\d*)(\\D*)", "g");

        do {
          var l = p.exec(a) || ["", "", ""],
              c = u.exec(g) || ["", "", ""];
          if (0 == l[0].length && 0 == c[0].length) break;
          r = 0 == l[1].length ? 0 : parseInt(l[1], 10);
          var d = 0 == c[1].length ? 0 : parseInt(c[1], 10);
          r = goog.string.compareElements_(r, d) || goog.string.compareElements_(0 == l[2].length, 0 == c[2].length) || goog.string.compareElements_(l[2], c[2]);
        } while (0 == r);
      }

      return r;
    }, goog.string.compareElements_ = function (e, t) {
      return e < t ? -1 : e > t ? 1 : 0;
    }, goog.string.hashCode = function (e) {
      for (var t = 0, r = 0; r < e.length; ++r) t = 31 * t + e.charCodeAt(r) >>> 0;

      return t;
    }, goog.string.uniqueStringCounter_ = 2147483648 * Math.random() | 0, goog.string.createUniqueString = function () {
      return "goog_" + goog.string.uniqueStringCounter_++;
    }, goog.string.toNumber = function (e) {
      var t = Number(e);
      return 0 == t && goog.string.isEmptyOrWhitespace(e) ? NaN : t;
    }, goog.string.isLowerCamelCase = function (e) {
      return /^[a-z]+([A-Z][a-z]*)*$/.test(e);
    }, goog.string.isUpperCamelCase = function (e) {
      return /^([A-Z][a-z]*)+$/.test(e);
    }, goog.string.toCamelCase = function (e) {
      return String(e).replace(/\-([a-z])/g, function (e, t) {
        return t.toUpperCase();
      });
    }, goog.string.toSelectorCase = function (e) {
      return String(e).replace(/([A-Z])/g, "-$1").toLowerCase();
    }, goog.string.toTitleCase = function (e, t) {
      var r = goog.isString(t) ? goog.string.regExpEscape(t) : "\\s";
      return e.replace(new RegExp("(^" + (r ? "|[" + r + "]+" : "") + ")([a-z])", "g"), function (e, t, r) {
        return t + r.toUpperCase();
      });
    }, goog.string.capitalize = function (e) {
      return String(e.charAt(0)).toUpperCase() + String(e.substr(1)).toLowerCase();
    }, goog.string.parseInt = function (e) {
      return isFinite(e) && (e = String(e)), goog.isString(e) ? /^\s*-?0x/i.test(e) ? parseInt(e, 16) : parseInt(e, 10) : NaN;
    }, goog.string.splitLimit = function (e, t, r) {
      e = e.split(t);

      for (var o = []; 0 < r && e.length;) o.push(e.shift()), r--;

      return e.length && o.push(e.join(t)), o;
    }, goog.string.editDistance = function (e, t) {
      var r = [],
          o = [];
      if (e == t) return 0;
      if (!e.length || !t.length) return Math.max(e.length, t.length);

      for (var n = 0; n < t.length + 1; n++) r[n] = n;

      for (n = 0; n < e.length; n++) {
        o[0] = n + 1;

        for (var s = 0; s < t.length; s++) o[s + 1] = Math.min(o[s] + 1, r[s + 1] + 1, r[s] + Number(e[n] != t[s]));

        for (s = 0; s < r.length; s++) r[s] = o[s];
      }

      return o[t.length];
    }, goog.asserts = {}, goog.asserts.ENABLE_ASSERTS = goog.DEBUG, goog.asserts.AssertionError = function (e, t) {
      t.unshift(e), goog.debug.Error.call(this, goog.string.subs.apply(null, t)), t.shift(), this.messagePattern = e;
    }, goog.inherits(goog.asserts.AssertionError, goog.debug.Error), goog.asserts.AssertionError.prototype.name = "AssertionError", goog.asserts.DEFAULT_ERROR_HANDLER = function (e) {
      throw e;
    }, goog.asserts.errorHandler_ = goog.asserts.DEFAULT_ERROR_HANDLER, goog.asserts.doAssertFailure_ = function (e, t, r, o) {
      var n = "Assertion failed";

      if (r) {
        n = n + ": " + r;
        var s = o;
      } else e && (n += ": " + e, s = t);

      e = new goog.asserts.AssertionError("" + n, s || []), goog.asserts.errorHandler_(e);
    }, goog.asserts.setErrorHandler = function (e) {
      goog.asserts.ENABLE_ASSERTS && (goog.asserts.errorHandler_ = e);
    }, goog.asserts.assert = function (e, t, r) {
      return goog.asserts.ENABLE_ASSERTS && !e && goog.asserts.doAssertFailure_("", null, t, Array.prototype.slice.call(arguments, 2)), e;
    }, goog.asserts.fail = function (e, t) {
      goog.asserts.ENABLE_ASSERTS && goog.asserts.errorHandler_(new goog.asserts.AssertionError("Failure" + (e ? ": " + e : ""), Array.prototype.slice.call(arguments, 1)));
    }, goog.asserts.assertNumber = function (e, t, r) {
      return goog.asserts.ENABLE_ASSERTS && !goog.isNumber(e) && goog.asserts.doAssertFailure_("Expected number but got %s: %s.", [goog.typeOf(e), e], t, Array.prototype.slice.call(arguments, 2)), e;
    }, goog.asserts.assertString = function (e, t, r) {
      return goog.asserts.ENABLE_ASSERTS && !goog.isString(e) && goog.asserts.doAssertFailure_("Expected string but got %s: %s.", [goog.typeOf(e), e], t, Array.prototype.slice.call(arguments, 2)), e;
    }, goog.asserts.assertFunction = function (e, t, r) {
      return goog.asserts.ENABLE_ASSERTS && !goog.isFunction(e) && goog.asserts.doAssertFailure_("Expected function but got %s: %s.", [goog.typeOf(e), e], t, Array.prototype.slice.call(arguments, 2)), e;
    }, goog.asserts.assertObject = function (e, t, r) {
      return goog.asserts.ENABLE_ASSERTS && !goog.isObject(e) && goog.asserts.doAssertFailure_("Expected object but got %s: %s.", [goog.typeOf(e), e], t, Array.prototype.slice.call(arguments, 2)), e;
    }, goog.asserts.assertArray = function (e, t, r) {
      return goog.asserts.ENABLE_ASSERTS && !goog.isArray(e) && goog.asserts.doAssertFailure_("Expected array but got %s: %s.", [goog.typeOf(e), e], t, Array.prototype.slice.call(arguments, 2)), e;
    }, goog.asserts.assertBoolean = function (e, t, r) {
      return goog.asserts.ENABLE_ASSERTS && !goog.isBoolean(e) && goog.asserts.doAssertFailure_("Expected boolean but got %s: %s.", [goog.typeOf(e), e], t, Array.prototype.slice.call(arguments, 2)), e;
    }, goog.asserts.assertElement = function (e, t, r) {
      return !goog.asserts.ENABLE_ASSERTS || goog.isObject(e) && e.nodeType == goog.dom.NodeType.ELEMENT || goog.asserts.doAssertFailure_("Expected Element but got %s: %s.", [goog.typeOf(e), e], t, Array.prototype.slice.call(arguments, 2)), e;
    }, goog.asserts.assertInstanceof = function (e, t, r, o) {
      return !goog.asserts.ENABLE_ASSERTS || e instanceof t || goog.asserts.doAssertFailure_("Expected instanceof %s but got %s.", [goog.asserts.getType_(t), goog.asserts.getType_(e)], r, Array.prototype.slice.call(arguments, 3)), e;
    }, goog.asserts.assertObjectPrototypeIsIntact = function () {
      for (var e in Object.prototype) goog.asserts.fail(e + " should not be enumerable in Object.prototype.");
    }, goog.asserts.getType_ = function (e) {
      return e instanceof Function ? e.displayName || e.name || "unknown type name" : e instanceof Object ? e.constructor.displayName || e.constructor.name || Object.prototype.toString.call(e) : null === e ? "null" : typeof e;
    };
    var jspb = {
      Map: function Map(e, t) {
        this.arr_ = e, this.valueCtor_ = t, this.map_ = {}, this.arrClean = !0, 0 < this.arr_.length && this.loadFromArray_();
      }
    };
    jspb.Map.prototype.loadFromArray_ = function () {
      for (var e = 0; e < this.arr_.length; e++) {
        var t = this.arr_[e],
            r = t[0];
        this.map_[r.toString()] = new jspb.Map.Entry_(r, t[1]);
      }

      this.arrClean = !0;
    }, jspb.Map.prototype.toArray = function () {
      if (this.arrClean) {
        if (this.valueCtor_) {
          var e,
              t = this.map_;

          for (e in t) if (Object.prototype.hasOwnProperty.call(t, e)) {
            var r = t[e].valueWrapper;
            r && r.toArray();
          }
        }
      } else {
        for (this.arr_.length = 0, (t = this.stringKeys_()).sort(), e = 0; e < t.length; e++) {
          var o = this.map_[t[e]];
          (r = o.valueWrapper) && r.toArray(), this.arr_.push([o.key, o.value]);
        }

        this.arrClean = !0;
      }

      return this.arr_;
    }, jspb.Map.prototype.toObject = function (e, t) {
      for (var r = this.toArray(), o = [], n = 0; n < r.length; n++) {
        var s = this.map_[r[n][0].toString()];
        this.wrapEntry_(s);
        var i = s.valueWrapper;
        i ? (goog.asserts.assert(t), o.push([s.key, t(e, i)])) : o.push([s.key, s.value]);
      }

      return o;
    }, jspb.Map.fromObject = function (e, t, r) {
      t = new jspb.Map([], t);

      for (var o = 0; o < e.length; o++) {
        var n = e[o][0],
            s = r(e[o][1]);
        t.set(n, s);
      }

      return t;
    }, jspb.Map.ArrayIteratorIterable_ = function (e) {
      this.idx_ = 0, this.arr_ = e;
    }, jspb.Map.ArrayIteratorIterable_.prototype.next = function () {
      return this.idx_ < this.arr_.length ? {
        done: !1,
        value: this.arr_[this.idx_++]
      } : {
        done: !0,
        value: void 0
      };
    }, $jscomp.initSymbol(), "undefined" != typeof Symbol && ($jscomp.initSymbol(), $jscomp.initSymbolIterator(), jspb.Map.ArrayIteratorIterable_.prototype[Symbol.iterator] = function () {
      return this;
    }), jspb.Map.prototype.getLength = function () {
      return this.stringKeys_().length;
    }, jspb.Map.prototype.clear = function () {
      this.map_ = {}, this.arrClean = !1;
    }, jspb.Map.prototype.del = function (e) {
      e = e.toString();
      var t = this.map_.hasOwnProperty(e);
      return delete this.map_[e], this.arrClean = !1, t;
    }, jspb.Map.prototype.getEntryList = function () {
      var e = [],
          t = this.stringKeys_();
      t.sort();

      for (var r = 0; r < t.length; r++) {
        var o = this.map_[t[r]];
        e.push([o.key, o.value]);
      }

      return e;
    }, jspb.Map.prototype.entries = function () {
      var e = [],
          t = this.stringKeys_();
      t.sort();

      for (var r = 0; r < t.length; r++) {
        var o = this.map_[t[r]];
        e.push([o.key, this.wrapEntry_(o)]);
      }

      return new jspb.Map.ArrayIteratorIterable_(e);
    }, jspb.Map.prototype.keys = function () {
      var e = [],
          t = this.stringKeys_();
      t.sort();

      for (var r = 0; r < t.length; r++) e.push(this.map_[t[r]].key);

      return new jspb.Map.ArrayIteratorIterable_(e);
    }, jspb.Map.prototype.values = function () {
      var e = [],
          t = this.stringKeys_();
      t.sort();

      for (var r = 0; r < t.length; r++) e.push(this.wrapEntry_(this.map_[t[r]]));

      return new jspb.Map.ArrayIteratorIterable_(e);
    }, jspb.Map.prototype.forEach = function (e, t) {
      var r = this.stringKeys_();
      r.sort();

      for (var o = 0; o < r.length; o++) {
        var n = this.map_[r[o]];
        e.call(t, this.wrapEntry_(n), n.key, this);
      }
    }, jspb.Map.prototype.set = function (e, t) {
      var r = new jspb.Map.Entry_(e);
      return this.valueCtor_ ? (r.valueWrapper = t, r.value = t.toArray()) : r.value = t, this.map_[e.toString()] = r, this.arrClean = !1, this;
    }, jspb.Map.prototype.wrapEntry_ = function (e) {
      return this.valueCtor_ ? (e.valueWrapper || (e.valueWrapper = new this.valueCtor_(e.value)), e.valueWrapper) : e.value;
    }, jspb.Map.prototype.get = function (e) {
      if (e = this.map_[e.toString()]) return this.wrapEntry_(e);
    }, jspb.Map.prototype.has = function (e) {
      return e.toString() in this.map_;
    }, jspb.Map.prototype.serializeBinary = function (e, t, r, o, n) {
      var s = this.stringKeys_();
      s.sort();

      for (var i = 0; i < s.length; i++) {
        var a = this.map_[s[i]];
        t.beginSubMessage(e), r.call(t, 1, a.key), this.valueCtor_ ? o.call(t, 2, this.wrapEntry_(a), n) : o.call(t, 2, a.value), t.endSubMessage();
      }
    }, jspb.Map.deserializeBinary = function (e, t, r, o, n, s) {
      for (var i = void 0; t.nextField() && !t.isEndGroup();) {
        var a = t.getFieldNumber();
        1 == a ? s = r.call(t) : 2 == a && (e.valueCtor_ ? (goog.asserts.assert(n), i = new e.valueCtor_(), o.call(t, i, n)) : i = o.call(t));
      }

      goog.asserts.assert(null != s), goog.asserts.assert(null != i), e.set(s, i);
    }, jspb.Map.prototype.stringKeys_ = function () {
      var e,
          t = this.map_,
          r = [];

      for (e in t) Object.prototype.hasOwnProperty.call(t, e) && r.push(e);

      return r;
    }, jspb.Map.Entry_ = function (e, t) {
      this.key = e, this.value = t, this.valueWrapper = void 0;
    }, goog.array = {}, goog.NATIVE_ARRAY_PROTOTYPES = goog.TRUSTED_SITE, goog.array.ASSUME_NATIVE_FUNCTIONS = !1, goog.array.peek = function (e) {
      return e[e.length - 1];
    }, goog.array.last = goog.array.peek, goog.array.indexOf = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.indexOf) ? function (e, t, r) {
      return goog.asserts.assert(null != e.length), Array.prototype.indexOf.call(e, t, r);
    } : function (e, t, r) {
      if (r = null == r ? 0 : 0 > r ? Math.max(0, e.length + r) : r, goog.isString(e)) return goog.isString(t) && 1 == t.length ? e.indexOf(t, r) : -1;

      for (; r < e.length; r++) if (r in e && e[r] === t) return r;

      return -1;
    }, goog.array.lastIndexOf = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.lastIndexOf) ? function (e, t, r) {
      return goog.asserts.assert(null != e.length), Array.prototype.lastIndexOf.call(e, t, null == r ? e.length - 1 : r);
    } : function (e, t, r) {
      if (0 > (r = null == r ? e.length - 1 : r) && (r = Math.max(0, e.length + r)), goog.isString(e)) return goog.isString(t) && 1 == t.length ? e.lastIndexOf(t, r) : -1;

      for (; 0 <= r; r--) if (r in e && e[r] === t) return r;

      return -1;
    }, goog.array.forEach = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.forEach) ? function (e, t, r) {
      goog.asserts.assert(null != e.length), Array.prototype.forEach.call(e, t, r);
    } : function (e, t, r) {
      for (var o = e.length, n = goog.isString(e) ? e.split("") : e, s = 0; s < o; s++) s in n && t.call(r, n[s], s, e);
    }, goog.array.forEachRight = function (e, t, r) {
      var o = e.length,
          n = goog.isString(e) ? e.split("") : e;

      for (o = o - 1; 0 <= o; --o) o in n && t.call(r, n[o], o, e);
    }, goog.array.filter = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.filter) ? function (e, t, r) {
      return goog.asserts.assert(null != e.length), Array.prototype.filter.call(e, t, r);
    } : function (e, t, r) {
      for (var o = e.length, n = [], s = 0, i = goog.isString(e) ? e.split("") : e, a = 0; a < o; a++) if (a in i) {
        var g = i[a];
        t.call(r, g, a, e) && (n[s++] = g);
      }

      return n;
    }, goog.array.map = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.map) ? function (e, t, r) {
      return goog.asserts.assert(null != e.length), Array.prototype.map.call(e, t, r);
    } : function (e, t, r) {
      for (var o = e.length, n = Array(o), s = goog.isString(e) ? e.split("") : e, i = 0; i < o; i++) i in s && (n[i] = t.call(r, s[i], i, e));

      return n;
    }, goog.array.reduce = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.reduce) ? function (e, t, r, o) {
      return goog.asserts.assert(null != e.length), o && (t = goog.bind(t, o)), Array.prototype.reduce.call(e, t, r);
    } : function (e, t, r, o) {
      var n = r;
      return goog.array.forEach(e, function (r, s) {
        n = t.call(o, n, r, s, e);
      }), n;
    }, goog.array.reduceRight = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.reduceRight) ? function (e, t, r, o) {
      return goog.asserts.assert(null != e.length), goog.asserts.assert(null != t), o && (t = goog.bind(t, o)), Array.prototype.reduceRight.call(e, t, r);
    } : function (e, t, r, o) {
      var n = r;
      return goog.array.forEachRight(e, function (r, s) {
        n = t.call(o, n, r, s, e);
      }), n;
    }, goog.array.some = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.some) ? function (e, t, r) {
      return goog.asserts.assert(null != e.length), Array.prototype.some.call(e, t, r);
    } : function (e, t, r) {
      for (var o = e.length, n = goog.isString(e) ? e.split("") : e, s = 0; s < o; s++) if (s in n && t.call(r, n[s], s, e)) return !0;

      return !1;
    }, goog.array.every = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.every) ? function (e, t, r) {
      return goog.asserts.assert(null != e.length), Array.prototype.every.call(e, t, r);
    } : function (e, t, r) {
      for (var o = e.length, n = goog.isString(e) ? e.split("") : e, s = 0; s < o; s++) if (s in n && !t.call(r, n[s], s, e)) return !1;

      return !0;
    }, goog.array.count = function (e, t, r) {
      var o = 0;
      return goog.array.forEach(e, function (e, n, s) {
        t.call(r, e, n, s) && ++o;
      }, r), o;
    }, goog.array.find = function (e, t, r) {
      return 0 > (t = goog.array.findIndex(e, t, r)) ? null : goog.isString(e) ? e.charAt(t) : e[t];
    }, goog.array.findIndex = function (e, t, r) {
      for (var o = e.length, n = goog.isString(e) ? e.split("") : e, s = 0; s < o; s++) if (s in n && t.call(r, n[s], s, e)) return s;

      return -1;
    }, goog.array.findRight = function (e, t, r) {
      return 0 > (t = goog.array.findIndexRight(e, t, r)) ? null : goog.isString(e) ? e.charAt(t) : e[t];
    }, goog.array.findIndexRight = function (e, t, r) {
      var o = e.length,
          n = goog.isString(e) ? e.split("") : e;

      for (o = o - 1; 0 <= o; o--) if (o in n && t.call(r, n[o], o, e)) return o;

      return -1;
    }, goog.array.contains = function (e, t) {
      return 0 <= goog.array.indexOf(e, t);
    }, goog.array.isEmpty = function (e) {
      return 0 == e.length;
    }, goog.array.clear = function (e) {
      if (!goog.isArray(e)) for (var t = e.length - 1; 0 <= t; t--) delete e[t];
      e.length = 0;
    }, goog.array.insert = function (e, t) {
      goog.array.contains(e, t) || e.push(t);
    }, goog.array.insertAt = function (e, t, r) {
      goog.array.splice(e, r, 0, t);
    }, goog.array.insertArrayAt = function (e, t, r) {
      goog.partial(goog.array.splice, e, r, 0).apply(null, t);
    }, goog.array.insertBefore = function (e, t, r) {
      var o;
      2 == arguments.length || 0 > (o = goog.array.indexOf(e, r)) ? e.push(t) : goog.array.insertAt(e, t, o);
    }, goog.array.remove = function (e, t) {
      var r,
          o = goog.array.indexOf(e, t);
      return (r = 0 <= o) && goog.array.removeAt(e, o), r;
    }, goog.array.removeAt = function (e, t) {
      return goog.asserts.assert(null != e.length), 1 == Array.prototype.splice.call(e, t, 1).length;
    }, goog.array.removeIf = function (e, t, r) {
      return 0 <= (t = goog.array.findIndex(e, t, r)) && (goog.array.removeAt(e, t), !0);
    }, goog.array.removeAllIf = function (e, t, r) {
      var o = 0;
      return goog.array.forEachRight(e, function (n, s) {
        t.call(r, n, s, e) && goog.array.removeAt(e, s) && o++;
      }), o;
    }, goog.array.concat = function (e) {
      return Array.prototype.concat.apply(Array.prototype, arguments);
    }, goog.array.join = function (e) {
      return Array.prototype.concat.apply(Array.prototype, arguments);
    }, goog.array.toArray = function (e) {
      var t = e.length;

      if (0 < t) {
        for (var r = Array(t), o = 0; o < t; o++) r[o] = e[o];

        return r;
      }

      return [];
    }, goog.array.clone = goog.array.toArray, goog.array.extend = function (e, t) {
      for (var r = 1; r < arguments.length; r++) {
        var o = arguments[r];

        if (goog.isArrayLike(o)) {
          var n = e.length || 0,
              s = o.length || 0;
          e.length = n + s;

          for (var i = 0; i < s; i++) e[n + i] = o[i];
        } else e.push(o);
      }
    }, goog.array.splice = function (e, t, r, o) {
      return goog.asserts.assert(null != e.length), Array.prototype.splice.apply(e, goog.array.slice(arguments, 1));
    }, goog.array.slice = function (e, t, r) {
      return goog.asserts.assert(null != e.length), 2 >= arguments.length ? Array.prototype.slice.call(e, t) : Array.prototype.slice.call(e, t, r);
    }, goog.array.removeDuplicates = function (e, t, r) {
      t = t || e;

      var o = function o(e) {
        return goog.isObject(e) ? "o" + goog.getUid(e) : (typeof e).charAt(0) + e;
      };

      r = r || o;
      o = {};

      for (var n = 0, s = 0; s < e.length;) {
        var i = e[s++],
            a = r(i);
        Object.prototype.hasOwnProperty.call(o, a) || (o[a] = !0, t[n++] = i);
      }

      t.length = n;
    }, goog.array.binarySearch = function (e, t, r) {
      return goog.array.binarySearch_(e, r || goog.array.defaultCompare, !1, t);
    }, goog.array.binarySelect = function (e, t, r) {
      return goog.array.binarySearch_(e, t, !0, void 0, r);
    }, goog.array.binarySearch_ = function (e, t, r, o, n) {
      for (var s, i = 0, a = e.length; i < a;) {
        var g,
            p = i + a >> 1;
        0 < (g = r ? t.call(n, e[p], p, e) : t(o, e[p])) ? i = p + 1 : (a = p, s = !g);
      }

      return s ? i : ~i;
    }, goog.array.sort = function (e, t) {
      e.sort(t || goog.array.defaultCompare);
    }, goog.array.stableSort = function (e, t) {
      for (var r = 0; r < e.length; r++) e[r] = {
        index: r,
        value: e[r]
      };

      var o = t || goog.array.defaultCompare;

      for (goog.array.sort(e, function (e, t) {
        return o(e.value, t.value) || e.index - t.index;
      }), r = 0; r < e.length; r++) e[r] = e[r].value;
    }, goog.array.sortByKey = function (e, t, r) {
      var o = r || goog.array.defaultCompare;
      goog.array.sort(e, function (e, r) {
        return o(t(e), t(r));
      });
    }, goog.array.sortObjectsByKey = function (e, t, r) {
      goog.array.sortByKey(e, function (e) {
        return e[t];
      }, r);
    }, goog.array.isSorted = function (e, t, r) {
      t = t || goog.array.defaultCompare;

      for (var o = 1; o < e.length; o++) {
        var n = t(e[o - 1], e[o]);
        if (0 < n || 0 == n && r) return !1;
      }

      return !0;
    }, goog.array.equals = function (e, t, r) {
      if (!goog.isArrayLike(e) || !goog.isArrayLike(t) || e.length != t.length) return !1;
      var o = e.length;
      r = r || goog.array.defaultCompareEquality;

      for (var n = 0; n < o; n++) if (!r(e[n], t[n])) return !1;

      return !0;
    }, goog.array.compare3 = function (e, t, r) {
      r = r || goog.array.defaultCompare;

      for (var o = Math.min(e.length, t.length), n = 0; n < o; n++) {
        var s = r(e[n], t[n]);
        if (0 != s) return s;
      }

      return goog.array.defaultCompare(e.length, t.length);
    }, goog.array.defaultCompare = function (e, t) {
      return e > t ? 1 : e < t ? -1 : 0;
    }, goog.array.inverseDefaultCompare = function (e, t) {
      return -goog.array.defaultCompare(e, t);
    }, goog.array.defaultCompareEquality = function (e, t) {
      return e === t;
    }, goog.array.binaryInsert = function (e, t, r) {
      return 0 > (r = goog.array.binarySearch(e, t, r)) && (goog.array.insertAt(e, t, -(r + 1)), !0);
    }, goog.array.binaryRemove = function (e, t, r) {
      return 0 <= (t = goog.array.binarySearch(e, t, r)) && goog.array.removeAt(e, t);
    }, goog.array.bucket = function (e, t, r) {
      for (var o = {}, n = 0; n < e.length; n++) {
        var s = e[n],
            i = t.call(r, s, n, e);
        goog.isDef(i) && (o[i] || (o[i] = [])).push(s);
      }

      return o;
    }, goog.array.toObject = function (e, t, r) {
      var o = {};
      return goog.array.forEach(e, function (n, s) {
        o[t.call(r, n, s, e)] = n;
      }), o;
    }, goog.array.range = function (e, t, r) {
      var o = [],
          n = 0,
          s = e;
      if (void 0 !== t && (n = e, s = t), 0 > (r = r || 1) * (s - n)) return [];
      if (0 < r) for (e = n; e < s; e += r) o.push(e);else for (e = n; e > s; e += r) o.push(e);
      return o;
    }, goog.array.repeat = function (e, t) {
      for (var r = [], o = 0; o < t; o++) r[o] = e;

      return r;
    }, goog.array.flatten = function (e) {
      for (var t = [], r = 0; r < arguments.length; r++) {
        var o = arguments[r];
        if (goog.isArray(o)) for (var n = 0; n < o.length; n += 8192) for (var s = goog.array.slice(o, n, n + 8192), i = (s = goog.array.flatten.apply(null, s), 0); i < s.length; i++) t.push(s[i]);else t.push(o);
      }

      return t;
    }, goog.array.rotate = function (e, t) {
      return goog.asserts.assert(null != e.length), e.length && (0 < (t %= e.length) ? Array.prototype.unshift.apply(e, e.splice(-t, t)) : 0 > t && Array.prototype.push.apply(e, e.splice(0, -t))), e;
    }, goog.array.moveItem = function (e, t, r) {
      goog.asserts.assert(0 <= t && t < e.length), goog.asserts.assert(0 <= r && r < e.length), t = Array.prototype.splice.call(e, t, 1), Array.prototype.splice.call(e, r, 0, t[0]);
    }, goog.array.zip = function (e) {
      if (!arguments.length) return [];

      for (var t = [], r = arguments[0].length, o = 1; o < arguments.length; o++) arguments[o].length < r && (r = arguments[o].length);

      for (o = 0; o < r; o++) {
        for (var n = [], s = 0; s < arguments.length; s++) n.push(arguments[s][o]);

        t.push(n);
      }

      return t;
    }, goog.array.shuffle = function (e, t) {
      for (var r = t || Math.random, o = e.length - 1; 0 < o; o--) {
        var n = Math.floor(r() * (o + 1)),
            s = e[o];
        e[o] = e[n], e[n] = s;
      }
    }, goog.array.copyByIndex = function (e, t) {
      var r = [];
      return goog.array.forEach(t, function (t) {
        r.push(e[t]);
      }), r;
    }, jspb.BinaryConstants = {}, jspb.ConstBinaryMessage = function () {}, jspb.BinaryMessage = function () {}, jspb.BinaryConstants.FieldType = {
      INVALID: -1,
      DOUBLE: 1,
      FLOAT: 2,
      INT64: 3,
      UINT64: 4,
      INT32: 5,
      FIXED64: 6,
      FIXED32: 7,
      BOOL: 8,
      STRING: 9,
      GROUP: 10,
      MESSAGE: 11,
      BYTES: 12,
      UINT32: 13,
      ENUM: 14,
      SFIXED32: 15,
      SFIXED64: 16,
      SINT32: 17,
      SINT64: 18,
      FHASH64: 30,
      VHASH64: 31
    }, jspb.BinaryConstants.WireType = {
      INVALID: -1,
      VARINT: 0,
      FIXED64: 1,
      DELIMITED: 2,
      START_GROUP: 3,
      END_GROUP: 4,
      FIXED32: 5
    }, jspb.BinaryConstants.FieldTypeToWireType = function (e) {
      var t = jspb.BinaryConstants.FieldType,
          r = jspb.BinaryConstants.WireType;

      switch (e) {
        case t.INT32:
        case t.INT64:
        case t.UINT32:
        case t.UINT64:
        case t.SINT32:
        case t.SINT64:
        case t.BOOL:
        case t.ENUM:
        case t.VHASH64:
          return r.VARINT;

        case t.DOUBLE:
        case t.FIXED64:
        case t.SFIXED64:
        case t.FHASH64:
          return r.FIXED64;

        case t.STRING:
        case t.MESSAGE:
        case t.BYTES:
          return r.DELIMITED;

        case t.FLOAT:
        case t.FIXED32:
        case t.SFIXED32:
          return r.FIXED32;

        default:
          return r.INVALID;
      }
    }, jspb.BinaryConstants.INVALID_FIELD_NUMBER = -1, jspb.BinaryConstants.FLOAT32_EPS = 1.401298464324817e-45, jspb.BinaryConstants.FLOAT32_MIN = 1.1754943508222875e-38, jspb.BinaryConstants.FLOAT32_MAX = 3.4028234663852886e38, jspb.BinaryConstants.FLOAT64_EPS = 5e-324, jspb.BinaryConstants.FLOAT64_MIN = 2.2250738585072014e-308, jspb.BinaryConstants.FLOAT64_MAX = 1.7976931348623157e308, jspb.BinaryConstants.TWO_TO_20 = 1048576, jspb.BinaryConstants.TWO_TO_23 = 8388608, jspb.BinaryConstants.TWO_TO_31 = 2147483648, jspb.BinaryConstants.TWO_TO_32 = 4294967296, jspb.BinaryConstants.TWO_TO_52 = 4503599627370496, jspb.BinaryConstants.TWO_TO_63 = 0x8000000000000000, jspb.BinaryConstants.TWO_TO_64 = 0x10000000000000000, jspb.BinaryConstants.ZERO_HASH = "\0\0\0\0\0\0\0\0", goog.crypt = {}, goog.crypt.stringToByteArray = function (e) {
      for (var t = [], r = 0, o = 0; o < e.length; o++) {
        for (var n = e.charCodeAt(o); 255 < n;) t[r++] = 255 & n, n >>= 8;

        t[r++] = n;
      }

      return t;
    }, goog.crypt.byteArrayToString = function (e) {
      if (8192 >= e.length) return String.fromCharCode.apply(null, e);

      for (var t = "", r = 0; r < e.length; r += 8192) {
        var o = goog.array.slice(e, r, r + 8192);
        t = t + String.fromCharCode.apply(null, o);
      }

      return t;
    }, goog.crypt.byteArrayToHex = function (e) {
      return goog.array.map(e, function (e) {
        return 1 < (e = e.toString(16)).length ? e : "0" + e;
      }).join("");
    }, goog.crypt.hexToByteArray = function (e) {
      goog.asserts.assert(0 == e.length % 2, "Key string length must be multiple of 2");

      for (var t = [], r = 0; r < e.length; r += 2) t.push(parseInt(e.substring(r, r + 2), 16));

      return t;
    }, goog.crypt.stringToUtf8ByteArray = function (e) {
      for (var t = [], r = 0, o = 0; o < e.length; o++) {
        var n = e.charCodeAt(o);
        128 > n ? t[r++] = n : (2048 > n ? t[r++] = n >> 6 | 192 : (55296 == (64512 & n) && o + 1 < e.length && 56320 == (64512 & e.charCodeAt(o + 1)) ? (n = 65536 + ((1023 & n) << 10) + (1023 & e.charCodeAt(++o)), t[r++] = n >> 18 | 240, t[r++] = n >> 12 & 63 | 128) : t[r++] = n >> 12 | 224, t[r++] = n >> 6 & 63 | 128), t[r++] = 63 & n | 128);
      }

      return t;
    }, goog.crypt.utf8ByteArrayToString = function (e) {
      for (var t = [], r = 0, o = 0; r < e.length;) {
        if (128 > (i = e[r++])) t[o++] = String.fromCharCode(i);else if (191 < i && 224 > i) {
          var n = e[r++];
          t[o++] = String.fromCharCode((31 & i) << 6 | 63 & n);
        } else if (239 < i && 365 > i) {
          n = e[r++];
          var s = e[r++],
              i = ((7 & i) << 18 | (63 & n) << 12 | (63 & s) << 6 | 63 & e[r++]) - 65536;
          t[o++] = String.fromCharCode(55296 + (i >> 10)), t[o++] = String.fromCharCode(56320 + (1023 & i));
        } else n = e[r++], s = e[r++], t[o++] = String.fromCharCode((15 & i) << 12 | (63 & n) << 6 | 63 & s);
      }

      return t.join("");
    }, goog.crypt.xorByteArray = function (e, t) {
      goog.asserts.assert(e.length == t.length, "XOR array lengths must match");

      for (var r = [], o = 0; o < e.length; o++) r.push(e[o] ^ t[o]);

      return r;
    }, goog.labs = {}, goog.labs.userAgent = {}, goog.labs.userAgent.util = {}, goog.labs.userAgent.util.getNativeUserAgentString_ = function () {
      var e = goog.labs.userAgent.util.getNavigator_();
      return e && (e = e.userAgent) ? e : "";
    }, goog.labs.userAgent.util.getNavigator_ = function () {
      return goog.global.navigator;
    }, goog.labs.userAgent.util.userAgent_ = goog.labs.userAgent.util.getNativeUserAgentString_(), goog.labs.userAgent.util.setUserAgent = function (e) {
      goog.labs.userAgent.util.userAgent_ = e || goog.labs.userAgent.util.getNativeUserAgentString_();
    }, goog.labs.userAgent.util.getUserAgent = function () {
      return goog.labs.userAgent.util.userAgent_;
    }, goog.labs.userAgent.util.matchUserAgent = function (e) {
      var t = goog.labs.userAgent.util.getUserAgent();
      return goog.string.contains(t, e);
    }, goog.labs.userAgent.util.matchUserAgentIgnoreCase = function (e) {
      var t = goog.labs.userAgent.util.getUserAgent();
      return goog.string.caseInsensitiveContains(t, e);
    }, goog.labs.userAgent.util.extractVersionTuples = function (e) {
      for (var t, r = RegExp("(\\w[\\w ]+)/([^\\s]+)\\s*(?:\\((.*?)\\))?", "g"), o = []; t = r.exec(e);) o.push([t[1], t[2], t[3] || void 0]);

      return o;
    }, goog.labs.userAgent.platform = {}, goog.labs.userAgent.platform.isAndroid = function () {
      return goog.labs.userAgent.util.matchUserAgent("Android");
    }, goog.labs.userAgent.platform.isIpod = function () {
      return goog.labs.userAgent.util.matchUserAgent("iPod");
    }, goog.labs.userAgent.platform.isIphone = function () {
      return goog.labs.userAgent.util.matchUserAgent("iPhone") && !goog.labs.userAgent.util.matchUserAgent("iPod") && !goog.labs.userAgent.util.matchUserAgent("iPad");
    }, goog.labs.userAgent.platform.isIpad = function () {
      return goog.labs.userAgent.util.matchUserAgent("iPad");
    }, goog.labs.userAgent.platform.isIos = function () {
      return goog.labs.userAgent.platform.isIphone() || goog.labs.userAgent.platform.isIpad() || goog.labs.userAgent.platform.isIpod();
    }, goog.labs.userAgent.platform.isMacintosh = function () {
      return goog.labs.userAgent.util.matchUserAgent("Macintosh");
    }, goog.labs.userAgent.platform.isLinux = function () {
      return goog.labs.userAgent.util.matchUserAgent("Linux");
    }, goog.labs.userAgent.platform.isWindows = function () {
      return goog.labs.userAgent.util.matchUserAgent("Windows");
    }, goog.labs.userAgent.platform.isChromeOS = function () {
      return goog.labs.userAgent.util.matchUserAgent("CrOS");
    }, goog.labs.userAgent.platform.getVersion = function () {
      var e = goog.labs.userAgent.util.getUserAgent(),
          t = "";
      return goog.labs.userAgent.platform.isWindows() ? t = (e = (t = /Windows (?:NT|Phone) ([0-9.]+)/).exec(e)) ? e[1] : "0.0" : goog.labs.userAgent.platform.isIos() ? t = (e = (t = /(?:iPhone|iPod|iPad|CPU)\s+OS\s+(\S+)/).exec(e)) && e[1].replace(/_/g, ".") : goog.labs.userAgent.platform.isMacintosh() ? t = (e = (t = /Mac OS X ([0-9_.]+)/).exec(e)) ? e[1].replace(/_/g, ".") : "10" : goog.labs.userAgent.platform.isAndroid() ? t = (e = (t = /Android\s+([^\);]+)(\)|;)/).exec(e)) && e[1] : goog.labs.userAgent.platform.isChromeOS() && (t = (e = (t = /(?:CrOS\s+(?:i686|x86_64)\s+([0-9.]+))/).exec(e)) && e[1]), t || "";
    }, goog.labs.userAgent.platform.isVersionOrHigher = function (e) {
      return 0 <= goog.string.compareVersions(goog.labs.userAgent.platform.getVersion(), e);
    }, goog.object = {}, goog.object.forEach = function (e, t, r) {
      for (var o in e) t.call(r, e[o], o, e);
    }, goog.object.filter = function (e, t, r) {
      var o,
          n = {};

      for (o in e) t.call(r, e[o], o, e) && (n[o] = e[o]);

      return n;
    }, goog.object.map = function (e, t, r) {
      var o,
          n = {};

      for (o in e) n[o] = t.call(r, e[o], o, e);

      return n;
    }, goog.object.some = function (e, t, r) {
      for (var o in e) if (t.call(r, e[o], o, e)) return !0;

      return !1;
    }, goog.object.every = function (e, t, r) {
      for (var o in e) if (!t.call(r, e[o], o, e)) return !1;

      return !0;
    }, goog.object.getCount = function (e) {
      var t,
          r = 0;

      for (t in e) r++;

      return r;
    }, goog.object.getAnyKey = function (e) {
      for (var t in e) return t;
    }, goog.object.getAnyValue = function (e) {
      for (var t in e) return e[t];
    }, goog.object.contains = function (e, t) {
      return goog.object.containsValue(e, t);
    }, goog.object.getValues = function (e) {
      var t,
          r = [],
          o = 0;

      for (t in e) r[o++] = e[t];

      return r;
    }, goog.object.getKeys = function (e) {
      var t,
          r = [],
          o = 0;

      for (t in e) r[o++] = t;

      return r;
    }, goog.object.getValueByKeys = function (e, t) {
      for (var r = (o = goog.isArrayLike(t)) ? t : arguments, o = o ? 0 : 1; o < r.length && (e = e[r[o]], goog.isDef(e)); o++);

      return e;
    }, goog.object.containsKey = function (e, t) {
      return null !== e && t in e;
    }, goog.object.containsValue = function (e, t) {
      for (var r in e) if (e[r] == t) return !0;

      return !1;
    }, goog.object.findKey = function (e, t, r) {
      for (var o in e) if (t.call(r, e[o], o, e)) return o;
    }, goog.object.findValue = function (e, t, r) {
      return (t = goog.object.findKey(e, t, r)) && e[t];
    }, goog.object.isEmpty = function (e) {
      for (var t in e) return !1;

      return !0;
    }, goog.object.clear = function (e) {
      for (var t in e) delete e[t];
    }, goog.object.remove = function (e, t) {
      var r;
      return (r = t in e) && delete e[t], r;
    }, goog.object.add = function (e, t, r) {
      if (null !== e && t in e) throw Error('The object already contains the key "' + t + '"');
      goog.object.set(e, t, r);
    }, goog.object.get = function (e, t, r) {
      return null !== e && t in e ? e[t] : r;
    }, goog.object.set = function (e, t, r) {
      e[t] = r;
    }, goog.object.setIfUndefined = function (e, t, r) {
      return t in e ? e[t] : e[t] = r;
    }, goog.object.setWithReturnValueIfNotSet = function (e, t, r) {
      return t in e ? e[t] : (r = r(), e[t] = r);
    }, goog.object.equals = function (e, t) {
      for (var r in e) if (!(r in t) || e[r] !== t[r]) return !1;

      for (r in t) if (!(r in e)) return !1;

      return !0;
    }, goog.object.clone = function (e) {
      var t,
          r = {};

      for (t in e) r[t] = e[t];

      return r;
    }, goog.object.unsafeClone = function (e) {
      if ("object" == (r = goog.typeOf(e)) || "array" == r) {
        if (goog.isFunction(e.clone)) return e.clone();
        var t,
            r = "array" == r ? [] : {};

        for (t in e) r[t] = goog.object.unsafeClone(e[t]);

        return r;
      }

      return e;
    }, goog.object.transpose = function (e) {
      var t,
          r = {};

      for (t in e) r[e[t]] = t;

      return r;
    }, goog.object.PROTOTYPE_FIELDS_ = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" "), goog.object.extend = function (e, t) {
      for (var r, o, n = 1; n < arguments.length; n++) {
        for (r in o = arguments[n]) e[r] = o[r];

        for (var s = 0; s < goog.object.PROTOTYPE_FIELDS_.length; s++) r = goog.object.PROTOTYPE_FIELDS_[s], Object.prototype.hasOwnProperty.call(o, r) && (e[r] = o[r]);
      }
    }, goog.object.create = function (e) {
      var t = arguments.length;
      if (1 == t && goog.isArray(arguments[0])) return goog.object.create.apply(null, arguments[0]);
      if (t % 2) throw Error("Uneven number of arguments");

      for (var r = {}, o = 0; o < t; o += 2) r[arguments[o]] = arguments[o + 1];

      return r;
    }, goog.object.createSet = function (e) {
      var t = arguments.length;
      if (1 == t && goog.isArray(arguments[0])) return goog.object.createSet.apply(null, arguments[0]);

      for (var r = {}, o = 0; o < t; o++) r[arguments[o]] = !0;

      return r;
    }, goog.object.createImmutableView = function (e) {
      var t = e;
      return Object.isFrozen && !Object.isFrozen(e) && (t = Object.create(e), Object.freeze(t)), t;
    }, goog.object.isImmutableView = function (e) {
      return !!Object.isFrozen && Object.isFrozen(e);
    }, goog.labs.userAgent.browser = {}, goog.labs.userAgent.browser.matchOpera_ = function () {
      return goog.labs.userAgent.util.matchUserAgent("Opera") || goog.labs.userAgent.util.matchUserAgent("OPR");
    }, goog.labs.userAgent.browser.matchIE_ = function () {
      return goog.labs.userAgent.util.matchUserAgent("Trident") || goog.labs.userAgent.util.matchUserAgent("MSIE");
    }, goog.labs.userAgent.browser.matchEdge_ = function () {
      return goog.labs.userAgent.util.matchUserAgent("Edge");
    }, goog.labs.userAgent.browser.matchFirefox_ = function () {
      return goog.labs.userAgent.util.matchUserAgent("Firefox");
    }, goog.labs.userAgent.browser.matchSafari_ = function () {
      return goog.labs.userAgent.util.matchUserAgent("Safari") && !(goog.labs.userAgent.browser.matchChrome_() || goog.labs.userAgent.browser.matchCoast_() || goog.labs.userAgent.browser.matchOpera_() || goog.labs.userAgent.browser.matchEdge_() || goog.labs.userAgent.browser.isSilk() || goog.labs.userAgent.util.matchUserAgent("Android"));
    }, goog.labs.userAgent.browser.matchCoast_ = function () {
      return goog.labs.userAgent.util.matchUserAgent("Coast");
    }, goog.labs.userAgent.browser.matchIosWebview_ = function () {
      return (goog.labs.userAgent.util.matchUserAgent("iPad") || goog.labs.userAgent.util.matchUserAgent("iPhone")) && !goog.labs.userAgent.browser.matchSafari_() && !goog.labs.userAgent.browser.matchChrome_() && !goog.labs.userAgent.browser.matchCoast_() && goog.labs.userAgent.util.matchUserAgent("AppleWebKit");
    }, goog.labs.userAgent.browser.matchChrome_ = function () {
      return (goog.labs.userAgent.util.matchUserAgent("Chrome") || goog.labs.userAgent.util.matchUserAgent("CriOS")) && !goog.labs.userAgent.browser.matchOpera_() && !goog.labs.userAgent.browser.matchEdge_();
    }, goog.labs.userAgent.browser.matchAndroidBrowser_ = function () {
      return goog.labs.userAgent.util.matchUserAgent("Android") && !(goog.labs.userAgent.browser.isChrome() || goog.labs.userAgent.browser.isFirefox() || goog.labs.userAgent.browser.isOpera() || goog.labs.userAgent.browser.isSilk());
    }, goog.labs.userAgent.browser.isOpera = goog.labs.userAgent.browser.matchOpera_, goog.labs.userAgent.browser.isIE = goog.labs.userAgent.browser.matchIE_, goog.labs.userAgent.browser.isEdge = goog.labs.userAgent.browser.matchEdge_, goog.labs.userAgent.browser.isFirefox = goog.labs.userAgent.browser.matchFirefox_, goog.labs.userAgent.browser.isSafari = goog.labs.userAgent.browser.matchSafari_, goog.labs.userAgent.browser.isCoast = goog.labs.userAgent.browser.matchCoast_, goog.labs.userAgent.browser.isIosWebview = goog.labs.userAgent.browser.matchIosWebview_, goog.labs.userAgent.browser.isChrome = goog.labs.userAgent.browser.matchChrome_, goog.labs.userAgent.browser.isAndroidBrowser = goog.labs.userAgent.browser.matchAndroidBrowser_, goog.labs.userAgent.browser.isSilk = function () {
      return goog.labs.userAgent.util.matchUserAgent("Silk");
    }, goog.labs.userAgent.browser.getVersion = function () {
      function e(e) {
        return e = goog.array.find(e, o), r[e] || "";
      }

      var t = goog.labs.userAgent.util.getUserAgent();
      if (goog.labs.userAgent.browser.isIE()) return goog.labs.userAgent.browser.getIEVersion_(t);
      t = goog.labs.userAgent.util.extractVersionTuples(t);
      var r = {};
      goog.array.forEach(t, function (e) {
        r[e[0]] = e[1];
      });
      var o = goog.partial(goog.object.containsKey, r);
      return goog.labs.userAgent.browser.isOpera() ? e(["Version", "Opera", "OPR"]) : goog.labs.userAgent.browser.isEdge() ? e(["Edge"]) : goog.labs.userAgent.browser.isChrome() ? e(["Chrome", "CriOS"]) : (t = t[2]) && t[1] || "";
    }, goog.labs.userAgent.browser.isVersionOrHigher = function (e) {
      return 0 <= goog.string.compareVersions(goog.labs.userAgent.browser.getVersion(), e);
    }, goog.labs.userAgent.browser.getIEVersion_ = function (e) {
      if ((t = /rv: *([\d\.]*)/.exec(e)) && t[1]) return t[1];
      var t = "",
          r = /MSIE +([\d\.]+)/.exec(e);
      if (r && r[1]) if (e = /Trident\/(\d.\d)/.exec(e), "7.0" == r[1]) {
        if (e && e[1]) switch (e[1]) {
          case "4.0":
            t = "8.0";
            break;

          case "5.0":
            t = "9.0";
            break;

          case "6.0":
            t = "10.0";
            break;

          case "7.0":
            t = "11.0";
        } else t = "7.0";
      } else t = r[1];
      return t;
    }, goog.labs.userAgent.engine = {}, goog.labs.userAgent.engine.isPresto = function () {
      return goog.labs.userAgent.util.matchUserAgent("Presto");
    }, goog.labs.userAgent.engine.isTrident = function () {
      return goog.labs.userAgent.util.matchUserAgent("Trident") || goog.labs.userAgent.util.matchUserAgent("MSIE");
    }, goog.labs.userAgent.engine.isEdge = function () {
      return goog.labs.userAgent.util.matchUserAgent("Edge");
    }, goog.labs.userAgent.engine.isWebKit = function () {
      return goog.labs.userAgent.util.matchUserAgentIgnoreCase("WebKit") && !goog.labs.userAgent.engine.isEdge();
    }, goog.labs.userAgent.engine.isGecko = function () {
      return goog.labs.userAgent.util.matchUserAgent("Gecko") && !goog.labs.userAgent.engine.isWebKit() && !goog.labs.userAgent.engine.isTrident() && !goog.labs.userAgent.engine.isEdge();
    }, goog.labs.userAgent.engine.getVersion = function () {
      if (t = goog.labs.userAgent.util.getUserAgent()) {
        var e,
            t = goog.labs.userAgent.util.extractVersionTuples(t),
            r = goog.labs.userAgent.engine.getEngineTuple_(t);
        if (r) return "Gecko" == r[0] ? goog.labs.userAgent.engine.getVersionForKey_(t, "Firefox") : r[1];
        if ((t = t[0]) && (e = t[2]) && (e = /Trident\/([^\s;]+)/.exec(e))) return e[1];
      }

      return "";
    }, goog.labs.userAgent.engine.getEngineTuple_ = function (e) {
      if (!goog.labs.userAgent.engine.isEdge()) return e[1];

      for (var t = 0; t < e.length; t++) {
        var r = e[t];
        if ("Edge" == r[0]) return r;
      }
    }, goog.labs.userAgent.engine.isVersionOrHigher = function (e) {
      return 0 <= goog.string.compareVersions(goog.labs.userAgent.engine.getVersion(), e);
    }, goog.labs.userAgent.engine.getVersionForKey_ = function (e, t) {
      var r = goog.array.find(e, function (e) {
        return t == e[0];
      });
      return r && r[1] || "";
    }, goog.userAgent = {}, goog.userAgent.ASSUME_IE = !1, goog.userAgent.ASSUME_EDGE = !1, goog.userAgent.ASSUME_GECKO = !1, goog.userAgent.ASSUME_WEBKIT = !1, goog.userAgent.ASSUME_MOBILE_WEBKIT = !1, goog.userAgent.ASSUME_OPERA = !1, goog.userAgent.ASSUME_ANY_VERSION = !1, goog.userAgent.BROWSER_KNOWN_ = goog.userAgent.ASSUME_IE || goog.userAgent.ASSUME_EDGE || goog.userAgent.ASSUME_GECKO || goog.userAgent.ASSUME_MOBILE_WEBKIT || goog.userAgent.ASSUME_WEBKIT || goog.userAgent.ASSUME_OPERA, goog.userAgent.getUserAgentString = function () {
      return goog.labs.userAgent.util.getUserAgent();
    }, goog.userAgent.getNavigator = function () {
      return goog.global.navigator || null;
    }, goog.userAgent.OPERA = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_OPERA : goog.labs.userAgent.browser.isOpera(), goog.userAgent.IE = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_IE : goog.labs.userAgent.browser.isIE(), goog.userAgent.EDGE = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_EDGE : goog.labs.userAgent.engine.isEdge(), goog.userAgent.EDGE_OR_IE = goog.userAgent.EDGE || goog.userAgent.IE, goog.userAgent.GECKO = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_GECKO : goog.labs.userAgent.engine.isGecko(), goog.userAgent.WEBKIT = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_WEBKIT || goog.userAgent.ASSUME_MOBILE_WEBKIT : goog.labs.userAgent.engine.isWebKit(), goog.userAgent.isMobile_ = function () {
      return goog.userAgent.WEBKIT && goog.labs.userAgent.util.matchUserAgent("Mobile");
    }, goog.userAgent.MOBILE = goog.userAgent.ASSUME_MOBILE_WEBKIT || goog.userAgent.isMobile_(), goog.userAgent.SAFARI = goog.userAgent.WEBKIT, goog.userAgent.determinePlatform_ = function () {
      var e = goog.userAgent.getNavigator();
      return e && e.platform || "";
    }, goog.userAgent.PLATFORM = goog.userAgent.determinePlatform_(), goog.userAgent.ASSUME_MAC = !1, goog.userAgent.ASSUME_WINDOWS = !1, goog.userAgent.ASSUME_LINUX = !1, goog.userAgent.ASSUME_X11 = !1, goog.userAgent.ASSUME_ANDROID = !1, goog.userAgent.ASSUME_IPHONE = !1, goog.userAgent.ASSUME_IPAD = !1, goog.userAgent.PLATFORM_KNOWN_ = goog.userAgent.ASSUME_MAC || goog.userAgent.ASSUME_WINDOWS || goog.userAgent.ASSUME_LINUX || goog.userAgent.ASSUME_X11 || goog.userAgent.ASSUME_ANDROID || goog.userAgent.ASSUME_IPHONE || goog.userAgent.ASSUME_IPAD, goog.userAgent.MAC = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_MAC : goog.labs.userAgent.platform.isMacintosh(), goog.userAgent.WINDOWS = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_WINDOWS : goog.labs.userAgent.platform.isWindows(), goog.userAgent.isLegacyLinux_ = function () {
      return goog.labs.userAgent.platform.isLinux() || goog.labs.userAgent.platform.isChromeOS();
    }, goog.userAgent.LINUX = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_LINUX : goog.userAgent.isLegacyLinux_(), goog.userAgent.isX11_ = function () {
      var e = goog.userAgent.getNavigator();
      return !!e && goog.string.contains(e.appVersion || "", "X11");
    }, goog.userAgent.X11 = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_X11 : goog.userAgent.isX11_(), goog.userAgent.ANDROID = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_ANDROID : goog.labs.userAgent.platform.isAndroid(), goog.userAgent.IPHONE = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_IPHONE : goog.labs.userAgent.platform.isIphone(), goog.userAgent.IPAD = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_IPAD : goog.labs.userAgent.platform.isIpad(), goog.userAgent.operaVersion_ = function () {
      var e = goog.global.opera.version;

      try {
        return e();
      } catch (t) {
        return e;
      }
    }, goog.userAgent.determineVersion_ = function () {
      if (goog.userAgent.OPERA && goog.global.opera) return goog.userAgent.operaVersion_();
      var e = "",
          t = goog.userAgent.getVersionRegexResult_();
      return t && (e = t ? t[1] : ""), goog.userAgent.IE && (t = goog.userAgent.getDocumentMode_()) > parseFloat(e) ? String(t) : e;
    }, goog.userAgent.getVersionRegexResult_ = function () {
      var e = goog.userAgent.getUserAgentString();
      return goog.userAgent.GECKO ? /rv\:([^\);]+)(\)|;)/.exec(e) : goog.userAgent.EDGE ? /Edge\/([\d\.]+)/.exec(e) : goog.userAgent.IE ? /\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/.exec(e) : goog.userAgent.WEBKIT ? /WebKit\/(\S+)/.exec(e) : void 0;
    }, goog.userAgent.getDocumentMode_ = function () {
      var e = goog.global.document;
      return e ? e.documentMode : void 0;
    }, goog.userAgent.VERSION = goog.userAgent.determineVersion_(), goog.userAgent.compare = function (e, t) {
      return goog.string.compareVersions(e, t);
    }, goog.userAgent.isVersionOrHigherCache_ = {}, goog.userAgent.isVersionOrHigher = function (e) {
      return goog.userAgent.ASSUME_ANY_VERSION || goog.userAgent.isVersionOrHigherCache_[e] || (goog.userAgent.isVersionOrHigherCache_[e] = 0 <= goog.string.compareVersions(goog.userAgent.VERSION, e));
    }, goog.userAgent.isVersion = goog.userAgent.isVersionOrHigher, goog.userAgent.isDocumentModeOrHigher = function (e) {
      return Number(goog.userAgent.DOCUMENT_MODE) >= e;
    }, goog.userAgent.isDocumentMode = goog.userAgent.isDocumentModeOrHigher, goog.userAgent.DOCUMENT_MODE = function () {
      var e = goog.global.document,
          t = goog.userAgent.getDocumentMode_();
      return e && goog.userAgent.IE ? t || ("CSS1Compat" == e.compatMode ? parseInt(goog.userAgent.VERSION, 10) : 5) : void 0;
    }(), goog.userAgent.product = {}, goog.userAgent.product.ASSUME_FIREFOX = !1, goog.userAgent.product.ASSUME_IPHONE = !1, goog.userAgent.product.ASSUME_IPAD = !1, goog.userAgent.product.ASSUME_ANDROID = !1, goog.userAgent.product.ASSUME_CHROME = !1, goog.userAgent.product.ASSUME_SAFARI = !1, goog.userAgent.product.PRODUCT_KNOWN_ = goog.userAgent.ASSUME_IE || goog.userAgent.ASSUME_EDGE || goog.userAgent.ASSUME_OPERA || goog.userAgent.product.ASSUME_FIREFOX || goog.userAgent.product.ASSUME_IPHONE || goog.userAgent.product.ASSUME_IPAD || goog.userAgent.product.ASSUME_ANDROID || goog.userAgent.product.ASSUME_CHROME || goog.userAgent.product.ASSUME_SAFARI, goog.userAgent.product.OPERA = goog.userAgent.OPERA, goog.userAgent.product.IE = goog.userAgent.IE, goog.userAgent.product.EDGE = goog.userAgent.EDGE, goog.userAgent.product.FIREFOX = goog.userAgent.product.PRODUCT_KNOWN_ ? goog.userAgent.product.ASSUME_FIREFOX : goog.labs.userAgent.browser.isFirefox(), goog.userAgent.product.isIphoneOrIpod_ = function () {
      return goog.labs.userAgent.platform.isIphone() || goog.labs.userAgent.platform.isIpod();
    }, goog.userAgent.product.IPHONE = goog.userAgent.product.PRODUCT_KNOWN_ ? goog.userAgent.product.ASSUME_IPHONE : goog.userAgent.product.isIphoneOrIpod_(), goog.userAgent.product.IPAD = goog.userAgent.product.PRODUCT_KNOWN_ ? goog.userAgent.product.ASSUME_IPAD : goog.labs.userAgent.platform.isIpad(), goog.userAgent.product.ANDROID = goog.userAgent.product.PRODUCT_KNOWN_ ? goog.userAgent.product.ASSUME_ANDROID : goog.labs.userAgent.browser.isAndroidBrowser(), goog.userAgent.product.CHROME = goog.userAgent.product.PRODUCT_KNOWN_ ? goog.userAgent.product.ASSUME_CHROME : goog.labs.userAgent.browser.isChrome(), goog.userAgent.product.isSafariDesktop_ = function () {
      return goog.labs.userAgent.browser.isSafari() && !goog.labs.userAgent.platform.isIos();
    }, goog.userAgent.product.SAFARI = goog.userAgent.product.PRODUCT_KNOWN_ ? goog.userAgent.product.ASSUME_SAFARI : goog.userAgent.product.isSafariDesktop_(), goog.crypt.base64 = {}, goog.crypt.base64.byteToCharMap_ = null, goog.crypt.base64.charToByteMap_ = null, goog.crypt.base64.byteToCharMapWebSafe_ = null, goog.crypt.base64.ENCODED_VALS_BASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", goog.crypt.base64.ENCODED_VALS = goog.crypt.base64.ENCODED_VALS_BASE + "+/=", goog.crypt.base64.ENCODED_VALS_WEBSAFE = goog.crypt.base64.ENCODED_VALS_BASE + "-_.", goog.crypt.base64.ASSUME_NATIVE_SUPPORT_ = goog.userAgent.GECKO || goog.userAgent.WEBKIT && !goog.userAgent.product.SAFARI || goog.userAgent.OPERA, goog.crypt.base64.HAS_NATIVE_ENCODE_ = goog.crypt.base64.ASSUME_NATIVE_SUPPORT_ || "function" == typeof goog.global.btoa, goog.crypt.base64.HAS_NATIVE_DECODE_ = goog.crypt.base64.ASSUME_NATIVE_SUPPORT_ || !goog.userAgent.product.SAFARI && !goog.userAgent.IE && "function" == typeof goog.global.atob, goog.crypt.base64.encodeByteArray = function (e, t) {
      goog.asserts.assert(goog.isArrayLike(e), "encodeByteArray takes an array as a parameter"), goog.crypt.base64.init_();

      for (var r = t ? goog.crypt.base64.byteToCharMapWebSafe_ : goog.crypt.base64.byteToCharMap_, o = [], n = 0; n < e.length; n += 3) {
        var s = e[n],
            i = n + 1 < e.length,
            a = i ? e[n + 1] : 0,
            g = n + 2 < e.length,
            p = s >> 2,
            u = (s = (3 & s) << 4 | a >> 4, a = (15 & a) << 2 | (u = g ? e[n + 2] : 0) >> 6, 63 & u);
        g || (u = 64, i || (a = 64)), o.push(r[p], r[s], r[a], r[u]);
      }

      return o.join("");
    }, goog.crypt.base64.encodeString = function (e, t) {
      return goog.crypt.base64.HAS_NATIVE_ENCODE_ && !t ? goog.global.btoa(e) : goog.crypt.base64.encodeByteArray(goog.crypt.stringToByteArray(e), t);
    }, goog.crypt.base64.decodeString = function (e, t) {
      if (goog.crypt.base64.HAS_NATIVE_DECODE_ && !t) return goog.global.atob(e);
      var r = "";
      return goog.crypt.base64.decodeStringInternal_(e, function (e) {
        r += String.fromCharCode(e);
      }), r;
    }, goog.crypt.base64.decodeStringToByteArray = function (e, t) {
      var r = [];
      return goog.crypt.base64.decodeStringInternal_(e, function (e) {
        r.push(e);
      }), r;
    }, goog.crypt.base64.decodeStringToUint8Array = function (e) {
      goog.asserts.assert(!goog.userAgent.IE || goog.userAgent.isVersionOrHigher("10"), "Browser does not support typed arrays");
      var t = new Uint8Array(Math.ceil(3 * e.length / 4)),
          r = 0;
      return goog.crypt.base64.decodeStringInternal_(e, function (e) {
        t[r++] = e;
      }), t.subarray(0, r);
    }, goog.crypt.base64.decodeStringInternal_ = function (e, t) {
      function r(t) {
        for (; o < e.length;) {
          var r = e.charAt(o++),
              n = goog.crypt.base64.charToByteMap_[r];
          if (null != n) return n;
          if (!goog.string.isEmptyOrWhitespace(r)) throw Error("Unknown base64 encoding at char: " + r);
        }

        return t;
      }

      goog.crypt.base64.init_();

      for (var o = 0;;) {
        var n = r(-1),
            s = r(0),
            i = r(64),
            a = r(64);
        if (64 === a && -1 === n) break;
        t(n << 2 | s >> 4), 64 != i && (t(s << 4 & 240 | i >> 2), 64 != a && t(i << 6 & 192 | a));
      }
    }, goog.crypt.base64.init_ = function () {
      if (!goog.crypt.base64.byteToCharMap_) {
        goog.crypt.base64.byteToCharMap_ = {}, goog.crypt.base64.charToByteMap_ = {}, goog.crypt.base64.byteToCharMapWebSafe_ = {};

        for (var e = 0; e < goog.crypt.base64.ENCODED_VALS.length; e++) goog.crypt.base64.byteToCharMap_[e] = goog.crypt.base64.ENCODED_VALS.charAt(e), goog.crypt.base64.charToByteMap_[goog.crypt.base64.byteToCharMap_[e]] = e, goog.crypt.base64.byteToCharMapWebSafe_[e] = goog.crypt.base64.ENCODED_VALS_WEBSAFE.charAt(e), e >= goog.crypt.base64.ENCODED_VALS_BASE.length && (goog.crypt.base64.charToByteMap_[goog.crypt.base64.ENCODED_VALS_WEBSAFE.charAt(e)] = e);
      }
    }, jspb.utils = {}, jspb.utils.split64Low = 0, jspb.utils.split64High = 0, jspb.utils.splitUint64 = function (e) {
      var t = e >>> 0;
      e = Math.floor((e - t) / jspb.BinaryConstants.TWO_TO_32) >>> 0, jspb.utils.split64Low = t, jspb.utils.split64High = e;
    }, jspb.utils.splitInt64 = function (e) {
      var t = 0 > e,
          r = (e = Math.abs(e)) >>> 0;
      e = Math.floor((e - r) / jspb.BinaryConstants.TWO_TO_32), e >>>= 0, t && (e = ~e >>> 0, 4294967295 < (r = 1 + (~r >>> 0)) && (r = 0, 4294967295 < ++e && (e = 0))), jspb.utils.split64Low = r, jspb.utils.split64High = e;
    }, jspb.utils.splitZigzag64 = function (e) {
      var t = 0 > e;
      e = 2 * Math.abs(e), jspb.utils.splitUint64(e), e = jspb.utils.split64Low;
      var r = jspb.utils.split64High;
      t && (0 == e ? 0 == r ? r = e = 4294967295 : (r--, e = 4294967295) : e--), jspb.utils.split64Low = e, jspb.utils.split64High = r;
    }, jspb.utils.splitFloat32 = function (e) {
      var t,
          r = 0 > e ? 1 : 0;
      0 === (e = r ? -e : e) ? 0 < 1 / e ? (jspb.utils.split64High = 0, jspb.utils.split64Low = 0) : (jspb.utils.split64High = 0, jspb.utils.split64Low = 2147483648) : isNaN(e) ? (jspb.utils.split64High = 0, jspb.utils.split64Low = 2147483647) : e > jspb.BinaryConstants.FLOAT32_MAX ? (jspb.utils.split64High = 0, jspb.utils.split64Low = (r << 31 | 2139095040) >>> 0) : e < jspb.BinaryConstants.FLOAT32_MIN ? (e = Math.round(e / Math.pow(2, -149)), jspb.utils.split64High = 0, jspb.utils.split64Low = (r << 31 | e) >>> 0) : (t = Math.floor(Math.log(e) / Math.LN2), e *= Math.pow(2, -t), e = 8388607 & Math.round(e * jspb.BinaryConstants.TWO_TO_23), jspb.utils.split64High = 0, jspb.utils.split64Low = (r << 31 | t + 127 << 23 | e) >>> 0);
    }, jspb.utils.splitFloat64 = function (e) {
      var t = 0 > e ? 1 : 0;
      if (0 === (e = t ? -e : e)) jspb.utils.split64High = 0 < 1 / e ? 0 : 2147483648, jspb.utils.split64Low = 0;else if (isNaN(e)) jspb.utils.split64High = 2147483647, jspb.utils.split64Low = 4294967295;else if (e > jspb.BinaryConstants.FLOAT64_MAX) jspb.utils.split64High = (t << 31 | 2146435072) >>> 0, jspb.utils.split64Low = 0;else if (e < jspb.BinaryConstants.FLOAT64_MIN) {
        var r = e / Math.pow(2, -1074);
        e = r / jspb.BinaryConstants.TWO_TO_32, jspb.utils.split64High = (t << 31 | e) >>> 0, jspb.utils.split64Low = r >>> 0;
      } else {
        var o = Math.floor(Math.log(e) / Math.LN2);
        1024 == o && (o = 1023), e = (r = e * Math.pow(2, -o)) * jspb.BinaryConstants.TWO_TO_20 & 1048575, r = r * jspb.BinaryConstants.TWO_TO_52 >>> 0, jspb.utils.split64High = (t << 31 | o + 1023 << 20 | e) >>> 0, jspb.utils.split64Low = r;
      }
    }, jspb.utils.splitHash64 = function (e) {
      var t = e.charCodeAt(0),
          r = e.charCodeAt(1),
          o = e.charCodeAt(2),
          n = e.charCodeAt(3),
          s = e.charCodeAt(4),
          i = e.charCodeAt(5),
          a = e.charCodeAt(6);
      e = e.charCodeAt(7), jspb.utils.split64Low = t + (r << 8) + (o << 16) + (n << 24) >>> 0, jspb.utils.split64High = s + (i << 8) + (a << 16) + (e << 24) >>> 0;
    }, jspb.utils.joinUint64 = function (e, t) {
      return t * jspb.BinaryConstants.TWO_TO_32 + e;
    }, jspb.utils.joinInt64 = function (e, t) {
      var r = 2147483648 & t;
      r && (t = ~t >>> 0, 0 == (e = 1 + ~e >>> 0) && (t = t + 1 >>> 0));
      var o = jspb.utils.joinUint64(e, t);
      return r ? -o : o;
    }, jspb.utils.joinZigzag64 = function (e, t) {
      var r = 1 & e;
      e = (e >>> 1 | t << 31) >>> 0, t >>>= 1, r && 0 == (e = e + 1 >>> 0) && (t = t + 1 >>> 0);
      var o = jspb.utils.joinUint64(e, t);
      return r ? -o : o;
    }, jspb.utils.joinFloat32 = function (e, t) {
      var r = 2 * (e >> 31) + 1,
          o = e >>> 23 & 255,
          n = 8388607 & e;
      return 255 == o ? n ? NaN : 1 / 0 * r : 0 == o ? r * Math.pow(2, -149) * n : r * Math.pow(2, o - 150) * (n + Math.pow(2, 23));
    }, jspb.utils.joinFloat64 = function (e, t) {
      var r = 2 * (t >> 31) + 1,
          o = t >>> 20 & 2047,
          n = jspb.BinaryConstants.TWO_TO_32 * (1048575 & t) + e;
      return 2047 == o ? n ? NaN : 1 / 0 * r : 0 == o ? r * Math.pow(2, -1074) * n : r * Math.pow(2, o - 1075) * (n + jspb.BinaryConstants.TWO_TO_52);
    }, jspb.utils.joinHash64 = function (e, t) {
      return String.fromCharCode(e >>> 0 & 255, e >>> 8 & 255, e >>> 16 & 255, e >>> 24 & 255, t >>> 0 & 255, t >>> 8 & 255, t >>> 16 & 255, t >>> 24 & 255);
    }, jspb.utils.DIGITS = "0123456789abcdef".split(""), jspb.utils.joinUnsignedDecimalString = function (e, t) {
      function r(e) {
        for (var t = 1e7, r = 0; 7 > r; r++) {
          var o = e / (t = t / 10) % 10 >>> 0;
          (0 != o || a) && (a = !0, g += i[o]);
        }
      }

      if (2097151 >= t) return "" + (jspb.BinaryConstants.TWO_TO_32 * t + e);
      var o = (16777215 & e) + 6777216 * (n = (e >>> 24 | t << 8) >>> 0 & 16777215) + 6710656 * (s = t >> 16 & 65535),
          n = n + 8147497 * s,
          s = 2 * s;
      1e7 <= o && (n += Math.floor(o / 1e7), o %= 1e7), 1e7 <= n && (s += Math.floor(n / 1e7), n %= 1e7);
      var i = jspb.utils.DIGITS,
          a = !1,
          g = "";
      return (s || a) && r(s), (n || a) && r(n), (o || a) && r(o), g;
    }, jspb.utils.joinSignedDecimalString = function (e, t) {
      var r = 2147483648 & t;
      r && (t = ~t + (0 == (e = 1 + ~e >>> 0) ? 1 : 0) >>> 0);
      var o = jspb.utils.joinUnsignedDecimalString(e, t);
      return r ? "-" + o : o;
    }, jspb.utils.hash64ToDecimalString = function (e, t) {
      jspb.utils.splitHash64(e);
      var r = jspb.utils.split64Low,
          o = jspb.utils.split64High;
      return t ? jspb.utils.joinSignedDecimalString(r, o) : jspb.utils.joinUnsignedDecimalString(r, o);
    }, jspb.utils.hash64ArrayToDecimalStrings = function (e, t) {
      for (var r = Array(e.length), o = 0; o < e.length; o++) r[o] = jspb.utils.hash64ToDecimalString(e[o], t);

      return r;
    }, jspb.utils.decimalStringToHash64 = function (e) {
      function t(e, t) {
        for (var r = 0; 8 > r && (1 !== e || 0 < t); r++) {
          var n = e * o[r] + t;
          o[r] = 255 & n, t = n >>> 8;
        }
      }

      goog.asserts.assert(0 < e.length);
      var r = !1;
      "-" === e[0] && (r = !0, e = e.slice(1));

      for (var o = [0, 0, 0, 0, 0, 0, 0, 0], n = 0; n < e.length; n++) t(10, jspb.utils.DIGITS.indexOf(e[n]));

      return r && (function () {
        for (var e = 0; 8 > e; e++) o[e] = 255 & ~o[e];
      }(), t(1, 1)), goog.crypt.byteArrayToString(o);
    }, jspb.utils.splitDecimalString = function (e) {
      jspb.utils.splitHash64(jspb.utils.decimalStringToHash64(e));
    }, jspb.utils.hash64ToHexString = function (e) {
      var t = Array(18);
      t[0] = "0", t[1] = "x";

      for (var r = 0; 8 > r; r++) {
        var o = e.charCodeAt(7 - r);
        t[2 * r + 2] = jspb.utils.DIGITS[o >> 4], t[2 * r + 3] = jspb.utils.DIGITS[15 & o];
      }

      return t.join("");
    }, jspb.utils.hexStringToHash64 = function (e) {
      e = e.toLowerCase(), goog.asserts.assert(18 == e.length), goog.asserts.assert("0" == e[0]), goog.asserts.assert("x" == e[1]);

      for (var t = "", r = 0; 8 > r; r++) {
        var o = jspb.utils.DIGITS.indexOf(e[2 * r + 2]),
            n = jspb.utils.DIGITS.indexOf(e[2 * r + 3]);
        t = String.fromCharCode(16 * o + n) + t;
      }

      return t;
    }, jspb.utils.hash64ToNumber = function (e, t) {
      jspb.utils.splitHash64(e);
      var r = jspb.utils.split64Low,
          o = jspb.utils.split64High;
      return t ? jspb.utils.joinInt64(r, o) : jspb.utils.joinUint64(r, o);
    }, jspb.utils.numberToHash64 = function (e) {
      return jspb.utils.splitInt64(e), jspb.utils.joinHash64(jspb.utils.split64Low, jspb.utils.split64High);
    }, jspb.utils.countVarints = function (e, t, r) {
      for (var o = 0, n = t; n < r; n++) o += e[n] >> 7;

      return r - t - o;
    }, jspb.utils.countVarintFields = function (e, t, r, o) {
      var n = 0;
      if (128 > (o = 8 * o + jspb.BinaryConstants.WireType.VARINT)) for (; t < r && e[t++] == o;) for (n++;;) {
        var s = e[t++];
        if (0 == (128 & s)) break;
      } else for (; t < r;) {
        for (s = o; 128 < s;) {
          if (e[t] != (127 & s | 128)) return n;
          t++, s >>= 7;
        }

        if (e[t++] != s) break;

        for (n++; 0 != (128 & (s = e[t++])););
      }
      return n;
    }, jspb.utils.countFixedFields_ = function (e, t, r, o, n) {
      var s = 0;
      if (128 > o) for (; t < r && e[t++] == o;) s++, t += n;else for (; t < r;) {
        for (var i = o; 128 < i;) {
          if (e[t++] != (127 & i | 128)) return s;
          i >>= 7;
        }

        if (e[t++] != i) break;
        s++, t += n;
      }
      return s;
    }, jspb.utils.countFixed32Fields = function (e, t, r, o) {
      return jspb.utils.countFixedFields_(e, t, r, 8 * o + jspb.BinaryConstants.WireType.FIXED32, 4);
    }, jspb.utils.countFixed64Fields = function (e, t, r, o) {
      return jspb.utils.countFixedFields_(e, t, r, 8 * o + jspb.BinaryConstants.WireType.FIXED64, 8);
    }, jspb.utils.countDelimitedFields = function (e, t, r, o) {
      var n = 0;

      for (o = 8 * o + jspb.BinaryConstants.WireType.DELIMITED; t < r;) {
        for (var s = o; 128 < s;) {
          if (e[t++] != (127 & s | 128)) return n;
          s >>= 7;
        }

        if (e[t++] != s) break;
        n++;

        for (var i = 0, a = 1; i += (127 & (s = e[t++])) * a, a *= 128, 0 != (128 & s););

        t += i;
      }

      return n;
    }, jspb.utils.debugBytesToTextFormat = function (e) {
      var t = '"';

      if (e) {
        e = jspb.utils.byteSourceToUint8Array(e);

        for (var r = 0; r < e.length; r++) t += "\\x", 16 > e[r] && (t += "0"), t += e[r].toString(16);
      }

      return t + '"';
    }, jspb.utils.debugScalarToTextFormat = function (e) {
      return goog.isString(e) ? goog.string.quote(e) : e.toString();
    }, jspb.utils.stringToByteArray = function (e) {
      for (var t = new Uint8Array(e.length), r = 0; r < e.length; r++) {
        var o = e.charCodeAt(r);
        if (255 < o) throw Error("Conversion error: string contains codepoint outside of byte range");
        t[r] = o;
      }

      return t;
    }, jspb.utils.byteSourceToUint8Array = function (e) {
      return e.constructor === Uint8Array ? e : e.constructor === ArrayBuffer || void 0 !== Buffer && e.constructor === Buffer || e.constructor === Array ? new Uint8Array(e) : e.constructor === String ? goog.crypt.base64.decodeStringToUint8Array(e) : (goog.asserts.fail("Type not convertible to Uint8Array."), new Uint8Array(0));
    }, jspb.BinaryIterator = function (e, t, r) {
      this.elements_ = this.nextMethod_ = this.decoder_ = null, this.cursor_ = 0, this.nextValue_ = null, this.atEnd_ = !0, this.init_(e, t, r);
    }, jspb.BinaryIterator.prototype.init_ = function (e, t, r) {
      e && t && (this.decoder_ = e, this.nextMethod_ = t), this.elements_ = r || null, this.cursor_ = 0, this.nextValue_ = null, this.atEnd_ = !this.decoder_ && !this.elements_, this.next();
    }, jspb.BinaryIterator.instanceCache_ = [], jspb.BinaryIterator.alloc = function (e, t, r) {
      if (jspb.BinaryIterator.instanceCache_.length) {
        var o = jspb.BinaryIterator.instanceCache_.pop();
        return o.init_(e, t, r), o;
      }

      return new jspb.BinaryIterator(e, t, r);
    }, jspb.BinaryIterator.prototype.free = function () {
      this.clear(), 100 > jspb.BinaryIterator.instanceCache_.length && jspb.BinaryIterator.instanceCache_.push(this);
    }, jspb.BinaryIterator.prototype.clear = function () {
      this.decoder_ && this.decoder_.free(), this.elements_ = this.nextMethod_ = this.decoder_ = null, this.cursor_ = 0, this.nextValue_ = null, this.atEnd_ = !0;
    }, jspb.BinaryIterator.prototype.get = function () {
      return this.nextValue_;
    }, jspb.BinaryIterator.prototype.atEnd = function () {
      return this.atEnd_;
    }, jspb.BinaryIterator.prototype.next = function () {
      var e = this.nextValue_;
      return this.decoder_ ? this.decoder_.atEnd() ? (this.nextValue_ = null, this.atEnd_ = !0) : this.nextValue_ = this.nextMethod_.call(this.decoder_) : this.elements_ && (this.cursor_ == this.elements_.length ? (this.nextValue_ = null, this.atEnd_ = !0) : this.nextValue_ = this.elements_[this.cursor_++]), e;
    }, jspb.BinaryDecoder = function (e, t, r) {
      this.bytes_ = null, this.tempHigh_ = this.tempLow_ = this.cursor_ = this.end_ = this.start_ = 0, this.error_ = !1, e && this.setBlock(e, t, r);
    }, jspb.BinaryDecoder.instanceCache_ = [], jspb.BinaryDecoder.alloc = function (e, t, r) {
      if (jspb.BinaryDecoder.instanceCache_.length) {
        var o = jspb.BinaryDecoder.instanceCache_.pop();
        return e && o.setBlock(e, t, r), o;
      }

      return new jspb.BinaryDecoder(e, t, r);
    }, jspb.BinaryDecoder.prototype.free = function () {
      this.clear(), 100 > jspb.BinaryDecoder.instanceCache_.length && jspb.BinaryDecoder.instanceCache_.push(this);
    }, jspb.BinaryDecoder.prototype.clone = function () {
      return jspb.BinaryDecoder.alloc(this.bytes_, this.start_, this.end_ - this.start_);
    }, jspb.BinaryDecoder.prototype.clear = function () {
      this.bytes_ = null, this.cursor_ = this.end_ = this.start_ = 0, this.error_ = !1;
    }, jspb.BinaryDecoder.prototype.getBuffer = function () {
      return this.bytes_;
    }, jspb.BinaryDecoder.prototype.setBlock = function (e, t, r) {
      this.bytes_ = jspb.utils.byteSourceToUint8Array(e), this.start_ = goog.isDef(t) ? t : 0, this.end_ = goog.isDef(r) ? this.start_ + r : this.bytes_.length, this.cursor_ = this.start_;
    }, jspb.BinaryDecoder.prototype.getEnd = function () {
      return this.end_;
    }, jspb.BinaryDecoder.prototype.setEnd = function (e) {
      this.end_ = e;
    }, jspb.BinaryDecoder.prototype.reset = function () {
      this.cursor_ = this.start_;
    }, jspb.BinaryDecoder.prototype.getCursor = function () {
      return this.cursor_;
    }, jspb.BinaryDecoder.prototype.setCursor = function (e) {
      this.cursor_ = e;
    }, jspb.BinaryDecoder.prototype.advance = function (e) {
      this.cursor_ += e, goog.asserts.assert(this.cursor_ <= this.end_);
    }, jspb.BinaryDecoder.prototype.atEnd = function () {
      return this.cursor_ == this.end_;
    }, jspb.BinaryDecoder.prototype.pastEnd = function () {
      return this.cursor_ > this.end_;
    }, jspb.BinaryDecoder.prototype.getError = function () {
      return this.error_ || 0 > this.cursor_ || this.cursor_ > this.end_;
    }, jspb.BinaryDecoder.prototype.readSplitVarint64_ = function () {
      for (var e, t, r = 0, o = 0; 4 > o; o++) if (r |= (127 & (e = this.bytes_[this.cursor_++])) << 7 * o, 128 > e) return this.tempLow_ = r >>> 0, void (this.tempHigh_ = 0);

      if (r |= (127 & (e = this.bytes_[this.cursor_++])) << 28, t = 0 | (127 & e) >> 4, 128 > e) this.tempLow_ = r >>> 0, this.tempHigh_ = t >>> 0;else {
        for (o = 0; 5 > o; o++) if (t |= (127 & (e = this.bytes_[this.cursor_++])) << 7 * o + 3, 128 > e) return this.tempLow_ = r >>> 0, void (this.tempHigh_ = t >>> 0);

        goog.asserts.fail("Failed to read varint, encoding is invalid."), this.error_ = !0;
      }
    }, jspb.BinaryDecoder.prototype.skipVarint = function () {
      for (; 128 & this.bytes_[this.cursor_];) this.cursor_++;

      this.cursor_++;
    }, jspb.BinaryDecoder.prototype.unskipVarint = function (e) {
      for (; 128 < e;) this.cursor_--, e >>>= 7;

      this.cursor_--;
    }, jspb.BinaryDecoder.prototype.readUnsignedVarint32 = function () {
      var e,
          t = this.bytes_,
          r = 127 & (e = t[this.cursor_ + 0]);
      return 128 > e ? (this.cursor_ += 1, goog.asserts.assert(this.cursor_ <= this.end_), r) : (r |= (127 & (e = t[this.cursor_ + 1])) << 7, 128 > e ? (this.cursor_ += 2, goog.asserts.assert(this.cursor_ <= this.end_), r) : (r |= (127 & (e = t[this.cursor_ + 2])) << 14, 128 > e ? (this.cursor_ += 3, goog.asserts.assert(this.cursor_ <= this.end_), r) : (r |= (127 & (e = t[this.cursor_ + 3])) << 21, 128 > e ? (this.cursor_ += 4, goog.asserts.assert(this.cursor_ <= this.end_), r) : (r |= (15 & (e = t[this.cursor_ + 4])) << 28, 128 > e ? (this.cursor_ += 5, goog.asserts.assert(this.cursor_ <= this.end_), r >>> 0) : (this.cursor_ += 5, 128 <= t[this.cursor_++] && 128 <= t[this.cursor_++] && 128 <= t[this.cursor_++] && 128 <= t[this.cursor_++] && 128 <= t[this.cursor_++] && goog.asserts.assert(!1), goog.asserts.assert(this.cursor_ <= this.end_), r)))));
    }, jspb.BinaryDecoder.prototype.readSignedVarint32 = jspb.BinaryDecoder.prototype.readUnsignedVarint32, jspb.BinaryDecoder.prototype.readUnsignedVarint32String = function () {
      return this.readUnsignedVarint32().toString();
    }, jspb.BinaryDecoder.prototype.readSignedVarint32String = function () {
      return this.readSignedVarint32().toString();
    }, jspb.BinaryDecoder.prototype.readZigzagVarint32 = function () {
      var e = this.readUnsignedVarint32();
      return e >>> 1 ^ -(1 & e);
    }, jspb.BinaryDecoder.prototype.readUnsignedVarint64 = function () {
      return this.readSplitVarint64_(), jspb.utils.joinUint64(this.tempLow_, this.tempHigh_);
    }, jspb.BinaryDecoder.prototype.readUnsignedVarint64String = function () {
      return this.readSplitVarint64_(), jspb.utils.joinUnsignedDecimalString(this.tempLow_, this.tempHigh_);
    }, jspb.BinaryDecoder.prototype.readSignedVarint64 = function () {
      return this.readSplitVarint64_(), jspb.utils.joinInt64(this.tempLow_, this.tempHigh_);
    }, jspb.BinaryDecoder.prototype.readSignedVarint64String = function () {
      return this.readSplitVarint64_(), jspb.utils.joinSignedDecimalString(this.tempLow_, this.tempHigh_);
    }, jspb.BinaryDecoder.prototype.readZigzagVarint64 = function () {
      return this.readSplitVarint64_(), jspb.utils.joinZigzag64(this.tempLow_, this.tempHigh_);
    }, jspb.BinaryDecoder.prototype.readZigzagVarint64String = function () {
      return this.readZigzagVarint64().toString();
    }, jspb.BinaryDecoder.prototype.readUint8 = function () {
      var e = this.bytes_[this.cursor_ + 0];
      return this.cursor_ += 1, goog.asserts.assert(this.cursor_ <= this.end_), e;
    }, jspb.BinaryDecoder.prototype.readUint16 = function () {
      var e = this.bytes_[this.cursor_ + 0],
          t = this.bytes_[this.cursor_ + 1];
      return this.cursor_ += 2, goog.asserts.assert(this.cursor_ <= this.end_), e << 0 | t << 8;
    }, jspb.BinaryDecoder.prototype.readUint32 = function () {
      var e = this.bytes_[this.cursor_ + 0],
          t = this.bytes_[this.cursor_ + 1],
          r = this.bytes_[this.cursor_ + 2],
          o = this.bytes_[this.cursor_ + 3];
      return this.cursor_ += 4, goog.asserts.assert(this.cursor_ <= this.end_), (e << 0 | t << 8 | r << 16 | o << 24) >>> 0;
    }, jspb.BinaryDecoder.prototype.readUint64 = function () {
      var e = this.readUint32(),
          t = this.readUint32();
      return jspb.utils.joinUint64(e, t);
    }, jspb.BinaryDecoder.prototype.readUint64String = function () {
      var e = this.readUint32(),
          t = this.readUint32();
      return jspb.utils.joinUnsignedDecimalString(e, t);
    }, jspb.BinaryDecoder.prototype.readInt8 = function () {
      var e = this.bytes_[this.cursor_ + 0];
      return this.cursor_ += 1, goog.asserts.assert(this.cursor_ <= this.end_), e << 24 >> 24;
    }, jspb.BinaryDecoder.prototype.readInt16 = function () {
      var e = this.bytes_[this.cursor_ + 0],
          t = this.bytes_[this.cursor_ + 1];
      return this.cursor_ += 2, goog.asserts.assert(this.cursor_ <= this.end_), (e << 0 | t << 8) << 16 >> 16;
    }, jspb.BinaryDecoder.prototype.readInt32 = function () {
      var e = this.bytes_[this.cursor_ + 0],
          t = this.bytes_[this.cursor_ + 1],
          r = this.bytes_[this.cursor_ + 2],
          o = this.bytes_[this.cursor_ + 3];
      return this.cursor_ += 4, goog.asserts.assert(this.cursor_ <= this.end_), e << 0 | t << 8 | r << 16 | o << 24;
    }, jspb.BinaryDecoder.prototype.readInt64 = function () {
      var e = this.readUint32(),
          t = this.readUint32();
      return jspb.utils.joinInt64(e, t);
    }, jspb.BinaryDecoder.prototype.readInt64String = function () {
      var e = this.readUint32(),
          t = this.readUint32();
      return jspb.utils.joinSignedDecimalString(e, t);
    }, jspb.BinaryDecoder.prototype.readFloat = function () {
      var e = this.readUint32();
      return jspb.utils.joinFloat32(e, 0);
    }, jspb.BinaryDecoder.prototype.readDouble = function () {
      var e = this.readUint32(),
          t = this.readUint32();
      return jspb.utils.joinFloat64(e, t);
    }, jspb.BinaryDecoder.prototype.readBool = function () {
      return !!this.bytes_[this.cursor_++];
    }, jspb.BinaryDecoder.prototype.readEnum = function () {
      return this.readSignedVarint32();
    }, jspb.BinaryDecoder.prototype.readString = function (e) {
      var t = this.bytes_,
          r = this.cursor_;
      e = r + e;

      for (var o = [], n = ""; r < e;) {
        if (128 > (a = t[r++])) o.push(a);else {
          if (192 > a) continue;

          if (224 > a) {
            var s = t[r++];
            o.push((31 & a) << 6 | 63 & s);
          } else if (240 > a) {
            s = t[r++];
            var i = t[r++];
            o.push((15 & a) << 12 | (63 & s) << 6 | 63 & i);
          } else if (248 > a) {
            var a = (a = (7 & a) << 18 | (63 & (s = t[r++])) << 12 | (63 & (i = t[r++])) << 6 | 63 & t[r++]) - 65536;
            o.push(55296 + (a >> 10 & 1023), 56320 + (1023 & a));
          }
        }
        8192 <= o.length && (n += String.fromCharCode.apply(null, o), o.length = 0);
      }

      return n += goog.crypt.byteArrayToString(o), this.cursor_ = r, n;
    }, jspb.BinaryDecoder.prototype.readStringWithLength = function () {
      var e = this.readUnsignedVarint32();
      return this.readString(e);
    }, jspb.BinaryDecoder.prototype.readBytes = function (e) {
      if (0 > e || this.cursor_ + e > this.bytes_.length) return this.error_ = !0, goog.asserts.fail("Invalid byte length!"), new Uint8Array(0);
      var t = this.bytes_.subarray(this.cursor_, this.cursor_ + e);
      return this.cursor_ += e, goog.asserts.assert(this.cursor_ <= this.end_), t;
    }, jspb.BinaryDecoder.prototype.readVarintHash64 = function () {
      return this.readSplitVarint64_(), jspb.utils.joinHash64(this.tempLow_, this.tempHigh_);
    }, jspb.BinaryDecoder.prototype.readFixedHash64 = function () {
      var e = this.bytes_,
          t = this.cursor_,
          r = e[t + 0],
          o = e[t + 1],
          n = e[t + 2],
          s = e[t + 3],
          i = e[t + 4],
          a = e[t + 5],
          g = e[t + 6];
      e = e[t + 7];
      return this.cursor_ += 8, String.fromCharCode(r, o, n, s, i, a, g, e);
    }, jspb.BinaryReader = function (e, t, r) {
      this.decoder_ = jspb.BinaryDecoder.alloc(e, t, r), this.fieldCursor_ = this.decoder_.getCursor(), this.nextField_ = jspb.BinaryConstants.INVALID_FIELD_NUMBER, this.nextWireType_ = jspb.BinaryConstants.WireType.INVALID, this.error_ = !1, this.readCallbacks_ = null;
    }, jspb.BinaryReader.instanceCache_ = [], jspb.BinaryReader.alloc = function (e, t, r) {
      if (jspb.BinaryReader.instanceCache_.length) {
        var o = jspb.BinaryReader.instanceCache_.pop();
        return e && o.decoder_.setBlock(e, t, r), o;
      }

      return new jspb.BinaryReader(e, t, r);
    }, jspb.BinaryReader.prototype.alloc = jspb.BinaryReader.alloc, jspb.BinaryReader.prototype.free = function () {
      this.decoder_.clear(), this.nextField_ = jspb.BinaryConstants.INVALID_FIELD_NUMBER, this.nextWireType_ = jspb.BinaryConstants.WireType.INVALID, this.error_ = !1, this.readCallbacks_ = null, 100 > jspb.BinaryReader.instanceCache_.length && jspb.BinaryReader.instanceCache_.push(this);
    }, jspb.BinaryReader.prototype.getFieldCursor = function () {
      return this.fieldCursor_;
    }, jspb.BinaryReader.prototype.getCursor = function () {
      return this.decoder_.getCursor();
    }, jspb.BinaryReader.prototype.getBuffer = function () {
      return this.decoder_.getBuffer();
    }, jspb.BinaryReader.prototype.getFieldNumber = function () {
      return this.nextField_;
    }, jspb.BinaryReader.prototype.getWireType = function () {
      return this.nextWireType_;
    }, jspb.BinaryReader.prototype.isEndGroup = function () {
      return this.nextWireType_ == jspb.BinaryConstants.WireType.END_GROUP;
    }, jspb.BinaryReader.prototype.getError = function () {
      return this.error_ || this.decoder_.getError();
    }, jspb.BinaryReader.prototype.setBlock = function (e, t, r) {
      this.decoder_.setBlock(e, t, r), this.nextField_ = jspb.BinaryConstants.INVALID_FIELD_NUMBER, this.nextWireType_ = jspb.BinaryConstants.WireType.INVALID;
    }, jspb.BinaryReader.prototype.reset = function () {
      this.decoder_.reset(), this.nextField_ = jspb.BinaryConstants.INVALID_FIELD_NUMBER, this.nextWireType_ = jspb.BinaryConstants.WireType.INVALID;
    }, jspb.BinaryReader.prototype.advance = function (e) {
      this.decoder_.advance(e);
    }, jspb.BinaryReader.prototype.nextField = function () {
      if (this.decoder_.atEnd()) return !1;
      if (this.getError()) return goog.asserts.fail("Decoder hit an error"), !1;
      this.fieldCursor_ = this.decoder_.getCursor();
      var e,
          t = (e = this.decoder_.readUnsignedVarint32()) >>> 3;
      return (e = 7 & e) != jspb.BinaryConstants.WireType.VARINT && e != jspb.BinaryConstants.WireType.FIXED32 && e != jspb.BinaryConstants.WireType.FIXED64 && e != jspb.BinaryConstants.WireType.DELIMITED && e != jspb.BinaryConstants.WireType.START_GROUP && e != jspb.BinaryConstants.WireType.END_GROUP ? (goog.asserts.fail("Invalid wire type: %s (at position %s)", e, this.fieldCursor_), this.error_ = !0, !1) : (this.nextField_ = t, this.nextWireType_ = e, !0);
    }, jspb.BinaryReader.prototype.unskipHeader = function () {
      this.decoder_.unskipVarint(this.nextField_ << 3 | this.nextWireType_);
    }, jspb.BinaryReader.prototype.skipMatchingFields = function () {
      var e = this.nextField_;

      for (this.unskipHeader(); this.nextField() && this.getFieldNumber() == e;) this.skipField();

      this.decoder_.atEnd() || this.unskipHeader();
    }, jspb.BinaryReader.prototype.skipVarintField = function () {
      this.nextWireType_ != jspb.BinaryConstants.WireType.VARINT ? (goog.asserts.fail("Invalid wire type for skipVarintField"), this.skipField()) : this.decoder_.skipVarint();
    }, jspb.BinaryReader.prototype.skipDelimitedField = function () {
      if (this.nextWireType_ != jspb.BinaryConstants.WireType.DELIMITED) goog.asserts.fail("Invalid wire type for skipDelimitedField"), this.skipField();else {
        var e = this.decoder_.readUnsignedVarint32();
        this.decoder_.advance(e);
      }
    }, jspb.BinaryReader.prototype.skipFixed32Field = function () {
      this.nextWireType_ != jspb.BinaryConstants.WireType.FIXED32 ? (goog.asserts.fail("Invalid wire type for skipFixed32Field"), this.skipField()) : this.decoder_.advance(4);
    }, jspb.BinaryReader.prototype.skipFixed64Field = function () {
      this.nextWireType_ != jspb.BinaryConstants.WireType.FIXED64 ? (goog.asserts.fail("Invalid wire type for skipFixed64Field"), this.skipField()) : this.decoder_.advance(8);
    }, jspb.BinaryReader.prototype.skipGroup = function () {
      for (var e = this.nextField_;;) {
        if (!this.nextField()) {
          goog.asserts.fail("Unmatched start-group tag: stream EOF"), this.error_ = !0;
          break;
        }

        if (this.nextWireType_ == jspb.BinaryConstants.WireType.END_GROUP) {
          this.nextField_ != e && (goog.asserts.fail("Unmatched end-group tag"), this.error_ = !0);
          break;
        }

        this.skipField();
      }
    }, jspb.BinaryReader.prototype.skipField = function () {
      switch (this.nextWireType_) {
        case jspb.BinaryConstants.WireType.VARINT:
          this.skipVarintField();
          break;

        case jspb.BinaryConstants.WireType.FIXED64:
          this.skipFixed64Field();
          break;

        case jspb.BinaryConstants.WireType.DELIMITED:
          this.skipDelimitedField();
          break;

        case jspb.BinaryConstants.WireType.FIXED32:
          this.skipFixed32Field();
          break;

        case jspb.BinaryConstants.WireType.START_GROUP:
          this.skipGroup();
          break;

        default:
          goog.asserts.fail("Invalid wire encoding for field.");
      }
    }, jspb.BinaryReader.prototype.registerReadCallback = function (e, t) {
      goog.isNull(this.readCallbacks_) && (this.readCallbacks_ = {}), goog.asserts.assert(!this.readCallbacks_[e]), this.readCallbacks_[e] = t;
    }, jspb.BinaryReader.prototype.runReadCallback = function (e) {
      return goog.asserts.assert(!goog.isNull(this.readCallbacks_)), e = this.readCallbacks_[e], goog.asserts.assert(e), e(this);
    }, jspb.BinaryReader.prototype.readAny = function (e) {
      this.nextWireType_ = jspb.BinaryConstants.FieldTypeToWireType(e);
      var t = jspb.BinaryConstants.FieldType;

      switch (e) {
        case t.DOUBLE:
          return this.readDouble();

        case t.FLOAT:
          return this.readFloat();

        case t.INT64:
          return this.readInt64();

        case t.UINT64:
          return this.readUint64();

        case t.INT32:
          return this.readInt32();

        case t.FIXED64:
          return this.readFixed64();

        case t.FIXED32:
          return this.readFixed32();

        case t.BOOL:
          return this.readBool();

        case t.STRING:
          return this.readString();

        case t.GROUP:
          goog.asserts.fail("Group field type not supported in readAny()");

        case t.MESSAGE:
          goog.asserts.fail("Message field type not supported in readAny()");

        case t.BYTES:
          return this.readBytes();

        case t.UINT32:
          return this.readUint32();

        case t.ENUM:
          return this.readEnum();

        case t.SFIXED32:
          return this.readSfixed32();

        case t.SFIXED64:
          return this.readSfixed64();

        case t.SINT32:
          return this.readSint32();

        case t.SINT64:
          return this.readSint64();

        case t.FHASH64:
          return this.readFixedHash64();

        case t.VHASH64:
          return this.readVarintHash64();

        default:
          goog.asserts.fail("Invalid field type in readAny()");
      }

      return 0;
    }, jspb.BinaryReader.prototype.readMessage = function (e, t) {
      goog.asserts.assert(this.nextWireType_ == jspb.BinaryConstants.WireType.DELIMITED);
      var r = this.decoder_.getEnd(),
          o = this.decoder_.readUnsignedVarint32();
      o = this.decoder_.getCursor() + o;
      this.decoder_.setEnd(o), t(e, this), this.decoder_.setCursor(o), this.decoder_.setEnd(r);
    }, jspb.BinaryReader.prototype.readGroup = function (e, t, r) {
      goog.asserts.assert(this.nextWireType_ == jspb.BinaryConstants.WireType.START_GROUP), goog.asserts.assert(this.nextField_ == e), r(t, this), this.error_ || this.nextWireType_ == jspb.BinaryConstants.WireType.END_GROUP || (goog.asserts.fail("Group submessage did not end with an END_GROUP tag"), this.error_ = !0);
    }, jspb.BinaryReader.prototype.getFieldDecoder = function () {
      goog.asserts.assert(this.nextWireType_ == jspb.BinaryConstants.WireType.DELIMITED);
      var e = this.decoder_.readUnsignedVarint32(),
          t = this.decoder_.getCursor(),
          r = t + e;
      e = jspb.BinaryDecoder.alloc(this.decoder_.getBuffer(), t, e);
      return this.decoder_.setCursor(r), e;
    }, jspb.BinaryReader.prototype.readInt32 = function () {
      return goog.asserts.assert(this.nextWireType_ == jspb.BinaryConstants.WireType.VARINT), this.decoder_.readSignedVarint32();
    }, jspb.BinaryReader.prototype.readInt32String = function () {
      return goog.asserts.assert(this.nextWireType_ == jspb.BinaryConstants.WireType.VARINT), this.decoder_.readSignedVarint32String();
    }, jspb.BinaryReader.prototype.readInt64 = function () {
      return goog.asserts.assert(this.nextWireType_ == jspb.BinaryConstants.WireType.VARINT), this.decoder_.readSignedVarint64();
    }, jspb.BinaryReader.prototype.readInt64String = function () {
      return goog.asserts.assert(this.nextWireType_ == jspb.BinaryConstants.WireType.VARINT), this.decoder_.readSignedVarint64String();
    }, jspb.BinaryReader.prototype.readUint32 = function () {
      return goog.asserts.assert(this.nextWireType_ == jspb.BinaryConstants.WireType.VARINT), this.decoder_.readUnsignedVarint32();
    }, jspb.BinaryReader.prototype.readUint32String = function () {
      return goog.asserts.assert(this.nextWireType_ == jspb.BinaryConstants.WireType.VARINT), this.decoder_.readUnsignedVarint32String();
    }, jspb.BinaryReader.prototype.readUint64 = function () {
      return goog.asserts.assert(this.nextWireType_ == jspb.BinaryConstants.WireType.VARINT), this.decoder_.readUnsignedVarint64();
    }, jspb.BinaryReader.prototype.readUint64String = function () {
      return goog.asserts.assert(this.nextWireType_ == jspb.BinaryConstants.WireType.VARINT), this.decoder_.readUnsignedVarint64String();
    }, jspb.BinaryReader.prototype.readSint32 = function () {
      return goog.asserts.assert(this.nextWireType_ == jspb.BinaryConstants.WireType.VARINT), this.decoder_.readZigzagVarint32();
    }, jspb.BinaryReader.prototype.readSint64 = function () {
      return goog.asserts.assert(this.nextWireType_ == jspb.BinaryConstants.WireType.VARINT), this.decoder_.readZigzagVarint64();
    }, jspb.BinaryReader.prototype.readSint64String = function () {
      return goog.asserts.assert(this.nextWireType_ == jspb.BinaryConstants.WireType.VARINT), this.decoder_.readZigzagVarint64String();
    }, jspb.BinaryReader.prototype.readFixed32 = function () {
      return goog.asserts.assert(this.nextWireType_ == jspb.BinaryConstants.WireType.FIXED32), this.decoder_.readUint32();
    }, jspb.BinaryReader.prototype.readFixed64 = function () {
      return goog.asserts.assert(this.nextWireType_ == jspb.BinaryConstants.WireType.FIXED64), this.decoder_.readUint64();
    }, jspb.BinaryReader.prototype.readFixed64String = function () {
      return goog.asserts.assert(this.nextWireType_ == jspb.BinaryConstants.WireType.FIXED64), this.decoder_.readUint64String();
    }, jspb.BinaryReader.prototype.readSfixed32 = function () {
      return goog.asserts.assert(this.nextWireType_ == jspb.BinaryConstants.WireType.FIXED32), this.decoder_.readInt32();
    }, jspb.BinaryReader.prototype.readSfixed32String = function () {
      return goog.asserts.assert(this.nextWireType_ == jspb.BinaryConstants.WireType.FIXED32), this.decoder_.readInt32().toString();
    }, jspb.BinaryReader.prototype.readSfixed64 = function () {
      return goog.asserts.assert(this.nextWireType_ == jspb.BinaryConstants.WireType.FIXED64), this.decoder_.readInt64();
    }, jspb.BinaryReader.prototype.readSfixed64String = function () {
      return goog.asserts.assert(this.nextWireType_ == jspb.BinaryConstants.WireType.FIXED64), this.decoder_.readInt64String();
    }, jspb.BinaryReader.prototype.readFloat = function () {
      return goog.asserts.assert(this.nextWireType_ == jspb.BinaryConstants.WireType.FIXED32), this.decoder_.readFloat();
    }, jspb.BinaryReader.prototype.readDouble = function () {
      return goog.asserts.assert(this.nextWireType_ == jspb.BinaryConstants.WireType.FIXED64), this.decoder_.readDouble();
    }, jspb.BinaryReader.prototype.readBool = function () {
      return goog.asserts.assert(this.nextWireType_ == jspb.BinaryConstants.WireType.VARINT), !!this.decoder_.readUnsignedVarint32();
    }, jspb.BinaryReader.prototype.readEnum = function () {
      return goog.asserts.assert(this.nextWireType_ == jspb.BinaryConstants.WireType.VARINT), this.decoder_.readSignedVarint64();
    }, jspb.BinaryReader.prototype.readString = function () {
      goog.asserts.assert(this.nextWireType_ == jspb.BinaryConstants.WireType.DELIMITED);
      var e = this.decoder_.readUnsignedVarint32();
      return this.decoder_.readString(e);
    }, jspb.BinaryReader.prototype.readBytes = function () {
      goog.asserts.assert(this.nextWireType_ == jspb.BinaryConstants.WireType.DELIMITED);
      var e = this.decoder_.readUnsignedVarint32();
      return this.decoder_.readBytes(e);
    }, jspb.BinaryReader.prototype.readVarintHash64 = function () {
      return goog.asserts.assert(this.nextWireType_ == jspb.BinaryConstants.WireType.VARINT), this.decoder_.readVarintHash64();
    }, jspb.BinaryReader.prototype.readFixedHash64 = function () {
      return goog.asserts.assert(this.nextWireType_ == jspb.BinaryConstants.WireType.FIXED64), this.decoder_.readFixedHash64();
    }, jspb.BinaryReader.prototype.readPackedField_ = function (e) {
      goog.asserts.assert(this.nextWireType_ == jspb.BinaryConstants.WireType.DELIMITED);

      for (var t = this.decoder_.readUnsignedVarint32(), r = (t = this.decoder_.getCursor() + t, []); this.decoder_.getCursor() < t;) r.push(e.call(this.decoder_));

      return r;
    }, jspb.BinaryReader.prototype.readPackedInt32 = function () {
      return this.readPackedField_(this.decoder_.readSignedVarint32);
    }, jspb.BinaryReader.prototype.readPackedInt32String = function () {
      return this.readPackedField_(this.decoder_.readSignedVarint32String);
    }, jspb.BinaryReader.prototype.readPackedInt64 = function () {
      return this.readPackedField_(this.decoder_.readSignedVarint64);
    }, jspb.BinaryReader.prototype.readPackedInt64String = function () {
      return this.readPackedField_(this.decoder_.readSignedVarint64String);
    }, jspb.BinaryReader.prototype.readPackedUint32 = function () {
      return this.readPackedField_(this.decoder_.readUnsignedVarint32);
    }, jspb.BinaryReader.prototype.readPackedUint32String = function () {
      return this.readPackedField_(this.decoder_.readUnsignedVarint32String);
    }, jspb.BinaryReader.prototype.readPackedUint64 = function () {
      return this.readPackedField_(this.decoder_.readUnsignedVarint64);
    }, jspb.BinaryReader.prototype.readPackedUint64String = function () {
      return this.readPackedField_(this.decoder_.readUnsignedVarint64String);
    }, jspb.BinaryReader.prototype.readPackedSint32 = function () {
      return this.readPackedField_(this.decoder_.readZigzagVarint32);
    }, jspb.BinaryReader.prototype.readPackedSint64 = function () {
      return this.readPackedField_(this.decoder_.readZigzagVarint64);
    }, jspb.BinaryReader.prototype.readPackedSint64String = function () {
      return this.readPackedField_(this.decoder_.readZigzagVarint64String);
    }, jspb.BinaryReader.prototype.readPackedFixed32 = function () {
      return this.readPackedField_(this.decoder_.readUint32);
    }, jspb.BinaryReader.prototype.readPackedFixed64 = function () {
      return this.readPackedField_(this.decoder_.readUint64);
    }, jspb.BinaryReader.prototype.readPackedFixed64String = function () {
      return this.readPackedField_(this.decoder_.readUint64String);
    }, jspb.BinaryReader.prototype.readPackedSfixed32 = function () {
      return this.readPackedField_(this.decoder_.readInt32);
    }, jspb.BinaryReader.prototype.readPackedSfixed64 = function () {
      return this.readPackedField_(this.decoder_.readInt64);
    }, jspb.BinaryReader.prototype.readPackedSfixed64String = function () {
      return this.readPackedField_(this.decoder_.readInt64String);
    }, jspb.BinaryReader.prototype.readPackedFloat = function () {
      return this.readPackedField_(this.decoder_.readFloat);
    }, jspb.BinaryReader.prototype.readPackedDouble = function () {
      return this.readPackedField_(this.decoder_.readDouble);
    }, jspb.BinaryReader.prototype.readPackedBool = function () {
      return this.readPackedField_(this.decoder_.readBool);
    }, jspb.BinaryReader.prototype.readPackedEnum = function () {
      return this.readPackedField_(this.decoder_.readEnum);
    }, jspb.BinaryReader.prototype.readPackedVarintHash64 = function () {
      return this.readPackedField_(this.decoder_.readVarintHash64);
    }, jspb.BinaryReader.prototype.readPackedFixedHash64 = function () {
      return this.readPackedField_(this.decoder_.readFixedHash64);
    }, jspb.ExtensionFieldInfo = function (e, t, r, o, n) {
      this.fieldIndex = e, this.fieldName = t, this.ctor = r, this.toObjectFn = o, this.isRepeated = n;
    }, jspb.ExtensionFieldBinaryInfo = function (e, t, r, o, n, s) {
      this.fieldInfo = e, this.binaryReaderFn = t, this.binaryWriterFn = r, this.binaryMessageSerializeFn = o, this.binaryMessageDeserializeFn = n, this.isPacked = s;
    }, jspb.ExtensionFieldInfo.prototype.isMessageType = function () {
      return !!this.ctor;
    }, jspb.Message = function () {}, jspb.Message.GENERATE_TO_OBJECT = !0, jspb.Message.GENERATE_FROM_OBJECT = !goog.DISALLOW_TEST_ONLY_CODE, jspb.Message.GENERATE_TO_STRING = !0, jspb.Message.ASSUME_LOCAL_ARRAYS = !1, jspb.Message.SERIALIZE_EMPTY_TRAILING_FIELDS = !0, jspb.Message.SUPPORTS_UINT8ARRAY_ = "function" == typeof Uint8Array, jspb.Message.prototype.getJsPbMessageId = function () {
      return this.messageId_;
    }, jspb.Message.getIndex_ = function (e, t) {
      return t + e.arrayIndexOffset_;
    }, jspb.Message.getFieldNumber_ = function (e, t) {
      return t - e.arrayIndexOffset_;
    }, jspb.Message.initialize = function (e, t, r, o, n, s) {
      if (e.wrappers_ = null, t || (t = r ? [r] : []), e.messageId_ = r ? String(r) : void 0, e.arrayIndexOffset_ = 0 === r ? -1 : 0, e.array = t, jspb.Message.initPivotAndExtensionObject_(e, o), e.convertedFloatingPointFields_ = {}, jspb.Message.SERIALIZE_EMPTY_TRAILING_FIELDS || (e.repeatedFields = n), n) for (t = 0; t < n.length; t++) (r = n[t]) < e.pivot_ ? (r = jspb.Message.getIndex_(e, r), e.array[r] = e.array[r] || jspb.Message.EMPTY_LIST_SENTINEL_) : (jspb.Message.maybeInitEmptyExtensionObject_(e), e.extensionObject_[r] = e.extensionObject_[r] || jspb.Message.EMPTY_LIST_SENTINEL_);
      if (s && s.length) for (t = 0; t < s.length; t++) jspb.Message.computeOneofCase(e, s[t]);
    }, jspb.Message.EMPTY_LIST_SENTINEL_ = goog.DEBUG && Object.freeze ? Object.freeze([]) : [], jspb.Message.isArray_ = function (e) {
      return jspb.Message.ASSUME_LOCAL_ARRAYS ? e instanceof Array : goog.isArray(e);
    }, jspb.Message.isExtensionObject_ = function (e) {
      return !(null === e || "object" != typeof e || jspb.Message.isArray_(e) || jspb.Message.SUPPORTS_UINT8ARRAY_ && e instanceof Uint8Array);
    }, jspb.Message.initPivotAndExtensionObject_ = function (e, t) {
      var r = e.array.length,
          o = -1;
      if (r && (o = r - 1, r = e.array[o], jspb.Message.isExtensionObject_(r))) return e.pivot_ = jspb.Message.getFieldNumber_(e, o), void (e.extensionObject_ = r);
      -1 < t ? (e.pivot_ = Math.max(t, jspb.Message.getFieldNumber_(e, o + 1)), e.extensionObject_ = null) : e.pivot_ = Number.MAX_VALUE;
    }, jspb.Message.maybeInitEmptyExtensionObject_ = function (e) {
      var t = jspb.Message.getIndex_(e, e.pivot_);
      e.array[t] || (e.extensionObject_ = e.array[t] = {});
    }, jspb.Message.toObjectList = function (e, t, r) {
      for (var o = [], n = 0; n < e.length; n++) o[n] = t.call(e[n], r, e[n]);

      return o;
    }, jspb.Message.toObjectExtension = function (e, t, r, o, n) {
      for (var s in r) {
        var i = r[s],
            a = o.call(e, i);

        if (null != a) {
          for (var g in i.fieldName) if (i.fieldName.hasOwnProperty(g)) break;

          t[g] = i.toObjectFn ? i.isRepeated ? jspb.Message.toObjectList(a, i.toObjectFn, n) : i.toObjectFn(n, a) : a;
        }
      }
    }, jspb.Message.serializeBinaryExtensions = function (e, t, r, o) {
      for (var n in r) {
        var s = r[n],
            i = s.fieldInfo;
        if (!s.binaryWriterFn) throw Error("Message extension present that was generated without binary serialization support");
        var a = o.call(e, i);
        if (null != a) if (i.isMessageType()) {
          if (!s.binaryMessageSerializeFn) throw Error("Message extension present holding submessage without binary support enabled, and message is being serialized to binary format");
          s.binaryWriterFn.call(t, i.fieldIndex, a, s.binaryMessageSerializeFn);
        } else s.binaryWriterFn.call(t, i.fieldIndex, a);
      }
    }, jspb.Message.readBinaryExtension = function (e, t, r, o, n) {
      var s = r[t.getFieldNumber()];

      if (s) {
        if (r = s.fieldInfo, !s.binaryReaderFn) throw Error("Deserializing extension whose generated code does not support binary format");
        var i;
        r.isMessageType() ? (i = new r.ctor(), s.binaryReaderFn.call(t, i, s.binaryMessageDeserializeFn)) : i = s.binaryReaderFn.call(t), r.isRepeated && !s.isPacked ? (t = o.call(e, r)) ? t.push(i) : n.call(e, r, [i]) : n.call(e, r, i);
      } else t.skipField();
    }, jspb.Message.getField = function (e, t) {
      if (t < e.pivot_) {
        var r = jspb.Message.getIndex_(e, t),
            o = e.array[r];
        return o === jspb.Message.EMPTY_LIST_SENTINEL_ ? e.array[r] = [] : o;
      }

      if (e.extensionObject_) return (o = e.extensionObject_[t]) === jspb.Message.EMPTY_LIST_SENTINEL_ ? e.extensionObject_[t] = [] : o;
    }, jspb.Message.getRepeatedField = function (e, t) {
      if (t < e.pivot_) {
        var r = jspb.Message.getIndex_(e, t),
            o = e.array[r];
        return o === jspb.Message.EMPTY_LIST_SENTINEL_ ? e.array[r] = [] : o;
      }

      return (o = e.extensionObject_[t]) === jspb.Message.EMPTY_LIST_SENTINEL_ ? e.extensionObject_[t] = [] : o;
    }, jspb.Message.getOptionalFloatingPointField = function (e, t) {
      var r = jspb.Message.getField(e, t);
      return null == r ? r : +r;
    }, jspb.Message.getRepeatedFloatingPointField = function (e, t) {
      var r = jspb.Message.getRepeatedField(e, t);

      if (e.convertedFloatingPointFields_ || (e.convertedFloatingPointFields_ = {}), !e.convertedFloatingPointFields_[t]) {
        for (var o = 0; o < r.length; o++) r[o] = +r[o];

        e.convertedFloatingPointFields_[t] = !0;
      }

      return r;
    }, jspb.Message.bytesAsB64 = function (e) {
      return null == e || goog.isString(e) ? e : jspb.Message.SUPPORTS_UINT8ARRAY_ && e instanceof Uint8Array ? goog.crypt.base64.encodeByteArray(e) : (goog.asserts.fail("Cannot coerce to b64 string: " + goog.typeOf(e)), null);
    }, jspb.Message.bytesAsU8 = function (e) {
      return null == e || e instanceof Uint8Array ? e : goog.isString(e) ? goog.crypt.base64.decodeStringToUint8Array(e) : (goog.asserts.fail("Cannot coerce to Uint8Array: " + goog.typeOf(e)), null);
    }, jspb.Message.bytesListAsB64 = function (e) {
      return jspb.Message.assertConsistentTypes_(e), !e.length || goog.isString(e[0]) ? e : goog.array.map(e, jspb.Message.bytesAsB64);
    }, jspb.Message.bytesListAsU8 = function (e) {
      return jspb.Message.assertConsistentTypes_(e), !e.length || e[0] instanceof Uint8Array ? e : goog.array.map(e, jspb.Message.bytesAsU8);
    }, jspb.Message.assertConsistentTypes_ = function (e) {
      if (goog.DEBUG && e && 1 < e.length) {
        var t = goog.typeOf(e[0]);
        goog.array.forEach(e, function (e) {
          goog.typeOf(e) != t && goog.asserts.fail("Inconsistent type in JSPB repeated field array. Got " + goog.typeOf(e) + " expected " + t);
        });
      }
    }, jspb.Message.getFieldWithDefault = function (e, t, r) {
      return null == (e = jspb.Message.getField(e, t)) ? r : e;
    }, jspb.Message.getFieldProto3 = jspb.Message.getFieldWithDefault, jspb.Message.getMapField = function (e, t, r, o) {
      return e.wrappers_ || (e.wrappers_ = {}), t in e.wrappers_ ? e.wrappers_[t] : r ? void 0 : ((r = jspb.Message.getField(e, t)) || (r = [], jspb.Message.setField(e, t, r)), e.wrappers_[t] = new jspb.Map(r, o));
    }, jspb.Message.setField = function (e, t, r) {
      t < e.pivot_ ? e.array[jspb.Message.getIndex_(e, t)] = r : (jspb.Message.maybeInitEmptyExtensionObject_(e), e.extensionObject_[t] = r);
    }, jspb.Message.setProto3IntField = function (e, t, r) {
      jspb.Message.setFieldIgnoringDefault_(e, t, r, 0);
    }, jspb.Message.setProto3FloatField = function (e, t, r) {
      jspb.Message.setFieldIgnoringDefault_(e, t, r, 0);
    }, jspb.Message.setProto3BooleanField = function (e, t, r) {
      jspb.Message.setFieldIgnoringDefault_(e, t, r, !1);
    }, jspb.Message.setProto3StringField = function (e, t, r) {
      jspb.Message.setFieldIgnoringDefault_(e, t, r, "");
    }, jspb.Message.setProto3BytesField = function (e, t, r) {
      jspb.Message.setFieldIgnoringDefault_(e, t, r, "");
    }, jspb.Message.setProto3EnumField = function (e, t, r) {
      jspb.Message.setFieldIgnoringDefault_(e, t, r, 0);
    }, jspb.Message.setProto3StringIntField = function (e, t, r) {
      jspb.Message.setFieldIgnoringDefault_(e, t, r, "0");
    }, jspb.Message.setFieldIgnoringDefault_ = function (e, t, r, o) {
      r !== o ? jspb.Message.setField(e, t, r) : e.array[jspb.Message.getIndex_(e, t)] = null;
    }, jspb.Message.addToRepeatedField = function (e, t, r, o) {
      e = jspb.Message.getRepeatedField(e, t), null != o ? e.splice(o, 0, r) : e.push(r);
    }, jspb.Message.setOneofField = function (e, t, r, o) {
      (r = jspb.Message.computeOneofCase(e, r)) && r !== t && void 0 !== o && (e.wrappers_ && r in e.wrappers_ && (e.wrappers_[r] = void 0), jspb.Message.setField(e, r, void 0)), jspb.Message.setField(e, t, o);
    }, jspb.Message.computeOneofCase = function (e, t) {
      for (var r, o, n = 0; n < t.length; n++) {
        var s = t[n],
            i = jspb.Message.getField(e, s);
        null != i && (r = s, o = i, jspb.Message.setField(e, s, void 0));
      }

      return r ? (jspb.Message.setField(e, r, o), r) : 0;
    }, jspb.Message.getWrapperField = function (e, t, r, o) {
      if (e.wrappers_ || (e.wrappers_ = {}), !e.wrappers_[r]) {
        var n = jspb.Message.getField(e, r);
        (o || n) && (e.wrappers_[r] = new t(n));
      }

      return e.wrappers_[r];
    }, jspb.Message.getRepeatedWrapperField = function (e, t, r) {
      return jspb.Message.wrapRepeatedField_(e, t, r), (t = e.wrappers_[r]) == jspb.Message.EMPTY_LIST_SENTINEL_ && (t = e.wrappers_[r] = []), t;
    }, jspb.Message.wrapRepeatedField_ = function (e, t, r) {
      if (e.wrappers_ || (e.wrappers_ = {}), !e.wrappers_[r]) {
        for (var o = jspb.Message.getRepeatedField(e, r), n = [], s = 0; s < o.length; s++) n[s] = new t(o[s]);

        e.wrappers_[r] = n;
      }
    }, jspb.Message.setWrapperField = function (e, t, r) {
      e.wrappers_ || (e.wrappers_ = {});
      var o = r ? r.toArray() : r;
      e.wrappers_[t] = r, jspb.Message.setField(e, t, o);
    }, jspb.Message.setOneofWrapperField = function (e, t, r, o) {
      e.wrappers_ || (e.wrappers_ = {});
      var n = o ? o.toArray() : o;
      e.wrappers_[t] = o, jspb.Message.setOneofField(e, t, r, n);
    }, jspb.Message.setRepeatedWrapperField = function (e, t, r) {
      e.wrappers_ || (e.wrappers_ = {}), r = r || [];

      for (var o = [], n = 0; n < r.length; n++) o[n] = r[n].toArray();

      e.wrappers_[t] = r, jspb.Message.setField(e, t, o);
    }, jspb.Message.addToRepeatedWrapperField = function (e, t, r, o, n) {
      jspb.Message.wrapRepeatedField_(e, o, t);
      var s = e.wrappers_[t];
      return s || (s = e.wrappers_[t] = []), r = r || new o(), e = jspb.Message.getRepeatedField(e, t), null != n ? (s.splice(n, 0, r), e.splice(n, 0, r.toArray())) : (s.push(r), e.push(r.toArray())), r;
    }, jspb.Message.toMap = function (e, t, r, o) {
      for (var n = {}, s = 0; s < e.length; s++) n[t.call(e[s])] = r ? r.call(e[s], o, e[s]) : e[s];

      return n;
    }, jspb.Message.prototype.syncMapFields_ = function () {
      if (this.wrappers_) for (var e in this.wrappers_) {
        var t = this.wrappers_[e];
        if (goog.isArray(t)) for (var r = 0; r < t.length; r++) t[r] && t[r].toArray();else t && t.toArray();
      }
    }, jspb.Message.prototype.toArray = function () {
      return this.syncMapFields_(), this.array;
    }, jspb.Message.GENERATE_TO_STRING && (jspb.Message.prototype.toString = function () {
      return this.syncMapFields_(), this.array.toString();
    }), jspb.Message.prototype.getExtension = function (e) {
      if (this.extensionObject_) {
        this.wrappers_ || (this.wrappers_ = {});
        var t = e.fieldIndex;

        if (e.isRepeated) {
          if (e.isMessageType()) return this.wrappers_[t] || (this.wrappers_[t] = goog.array.map(this.extensionObject_[t] || [], function (t) {
            return new e.ctor(t);
          })), this.wrappers_[t];
        } else if (e.isMessageType()) return !this.wrappers_[t] && this.extensionObject_[t] && (this.wrappers_[t] = new e.ctor(this.extensionObject_[t])), this.wrappers_[t];

        return this.extensionObject_[t];
      }
    }, jspb.Message.prototype.setExtension = function (e, t) {
      this.wrappers_ || (this.wrappers_ = {}), jspb.Message.maybeInitEmptyExtensionObject_(this);
      var r = e.fieldIndex;
      return e.isRepeated ? (t = t || [], e.isMessageType() ? (this.wrappers_[r] = t, this.extensionObject_[r] = goog.array.map(t, function (e) {
        return e.toArray();
      })) : this.extensionObject_[r] = t) : e.isMessageType() ? (this.wrappers_[r] = t, this.extensionObject_[r] = t ? t.toArray() : t) : this.extensionObject_[r] = t, this;
    }, jspb.Message.difference = function (e, t) {
      if (!(e instanceof t.constructor)) throw Error("Messages have different types.");
      var r = e.toArray(),
          o = t.toArray(),
          n = [],
          s = 0,
          i = r.length > o.length ? r.length : o.length;

      for (e.getJsPbMessageId() && (n[0] = e.getJsPbMessageId(), s = 1); s < i; s++) jspb.Message.compareFields(r[s], o[s]) || (n[s] = o[s]);

      return new e.constructor(n);
    }, jspb.Message.equals = function (e, t) {
      return e == t || !(!e || !t) && e instanceof t.constructor && jspb.Message.compareFields(e.toArray(), t.toArray());
    }, jspb.Message.compareExtensions = function (e, t) {
      e = e || {}, t = t || {};
      var r,
          o = {};

      for (r in e) o[r] = 0;

      for (r in t) o[r] = 0;

      for (r in o) if (!jspb.Message.compareFields(e[r], t[r])) return !1;

      return !0;
    }, jspb.Message.compareFields = function (e, t) {
      if (e == t) return !0;
      if (!goog.isObject(e) || !goog.isObject(t)) return !!(goog.isNumber(e) && isNaN(e) || goog.isNumber(t) && isNaN(t)) && String(e) == String(t);
      if (e.constructor != t.constructor) return !1;

      if (jspb.Message.SUPPORTS_UINT8ARRAY_ && e.constructor === Uint8Array) {
        if (e.length != t.length) return !1;

        for (var r = 0; r < e.length; r++) if (e[r] != t[r]) return !1;

        return !0;
      }

      if (e.constructor === Array) {
        var o = void 0,
            n = void 0,
            s = Math.max(e.length, t.length);

        for (r = 0; r < s; r++) {
          var i = e[r],
              a = t[r];
          if (i && i.constructor == Object && (goog.asserts.assert(void 0 === o), goog.asserts.assert(r === e.length - 1), o = i, i = void 0), a && a.constructor == Object && (goog.asserts.assert(void 0 === n), goog.asserts.assert(r === t.length - 1), n = a, a = void 0), !jspb.Message.compareFields(i, a)) return !1;
        }

        return !o && !n || (o = o || {}, n = n || {}, jspb.Message.compareExtensions(o, n));
      }

      if (e.constructor === Object) return jspb.Message.compareExtensions(e, t);
      throw Error("Invalid type in JSPB array");
    }, jspb.Message.prototype.cloneMessage = function () {
      return jspb.Message.cloneMessage(this);
    }, jspb.Message.prototype.clone = function () {
      return jspb.Message.cloneMessage(this);
    }, jspb.Message.clone = function (e) {
      return jspb.Message.cloneMessage(e);
    }, jspb.Message.cloneMessage = function (e) {
      return new e.constructor(jspb.Message.clone_(e.toArray()));
    }, jspb.Message.copyInto = function (e, t) {
      goog.asserts.assertInstanceof(e, jspb.Message), goog.asserts.assertInstanceof(t, jspb.Message), goog.asserts.assert(e.constructor == t.constructor, "Copy source and target message should have the same type.");

      for (var r = jspb.Message.clone(e), o = t.toArray(), n = r.toArray(), s = o.length = 0; s < n.length; s++) o[s] = n[s];

      t.wrappers_ = r.wrappers_, t.extensionObject_ = r.extensionObject_;
    }, jspb.Message.clone_ = function (e) {
      var t;

      if (goog.isArray(e)) {
        for (var r = Array(e.length), o = 0; o < e.length; o++) null != (t = e[o]) && (r[o] = "object" == typeof t ? jspb.Message.clone_(goog.asserts.assert(t)) : t);

        return r;
      }

      if (jspb.Message.SUPPORTS_UINT8ARRAY_ && e instanceof Uint8Array) return new Uint8Array(e);

      for (o in r = {}, e) null != (t = e[o]) && (r[o] = "object" == typeof t ? jspb.Message.clone_(goog.asserts.assert(t)) : t);

      return r;
    }, jspb.Message.registerMessageType = function (e, t) {
      jspb.Message.registry_[e] = t, t.messageId = e;
    }, jspb.Message.registry_ = {}, jspb.Message.messageSetExtensions = {}, jspb.Message.messageSetExtensionsBinary = {}, jspb.arith = {}, jspb.arith.UInt64 = function (e, t) {
      this.lo = e, this.hi = t;
    }, jspb.arith.UInt64.prototype.cmp = function (e) {
      return this.hi < e.hi || this.hi == e.hi && this.lo < e.lo ? -1 : this.hi == e.hi && this.lo == e.lo ? 0 : 1;
    }, jspb.arith.UInt64.prototype.rightShift = function () {
      return new jspb.arith.UInt64((this.lo >>> 1 | (1 & this.hi) << 31) >>> 0, this.hi >>> 1 >>> 0);
    }, jspb.arith.UInt64.prototype.leftShift = function () {
      return new jspb.arith.UInt64(this.lo << 1 >>> 0, (this.hi << 1 | this.lo >>> 31) >>> 0);
    }, jspb.arith.UInt64.prototype.msb = function () {
      return !!(2147483648 & this.hi);
    }, jspb.arith.UInt64.prototype.lsb = function () {
      return !!(1 & this.lo);
    }, jspb.arith.UInt64.prototype.zero = function () {
      return 0 == this.lo && 0 == this.hi;
    }, jspb.arith.UInt64.prototype.add = function (e) {
      return new jspb.arith.UInt64((this.lo + e.lo & 4294967295) >>> 0 >>> 0, ((this.hi + e.hi & 4294967295) >>> 0) + (4294967296 <= this.lo + e.lo ? 1 : 0) >>> 0);
    }, jspb.arith.UInt64.prototype.sub = function (e) {
      return new jspb.arith.UInt64((this.lo - e.lo & 4294967295) >>> 0 >>> 0, ((this.hi - e.hi & 4294967295) >>> 0) - (0 > this.lo - e.lo ? 1 : 0) >>> 0);
    }, jspb.arith.UInt64.mul32x32 = function (e, t) {
      for (var r = e >>> 16, o = 65535 & t, n = t >>> 16, s = (i = 65535 & e) * o + 65536 * (i * n & 65535) + 65536 * (r * o & 65535), i = r * n + (i * n >>> 16) + (r * o >>> 16); 4294967296 <= s;) s -= 4294967296, i += 1;

      return new jspb.arith.UInt64(s >>> 0, i >>> 0);
    }, jspb.arith.UInt64.prototype.mul = function (e) {
      var t = jspb.arith.UInt64.mul32x32(this.lo, e);
      return (e = jspb.arith.UInt64.mul32x32(this.hi, e)).hi = e.lo, e.lo = 0, t.add(e);
    }, jspb.arith.UInt64.prototype.div = function (e) {
      if (0 == e) return [];
      var t = new jspb.arith.UInt64(0, 0),
          r = new jspb.arith.UInt64(this.lo, this.hi);
      e = new jspb.arith.UInt64(e, 0);

      for (var o = new jspb.arith.UInt64(1, 0); !e.msb();) e = e.leftShift(), o = o.leftShift();

      for (; !o.zero();) 0 >= e.cmp(r) && (t = t.add(o), r = r.sub(e)), e = e.rightShift(), o = o.rightShift();

      return [t, r];
    }, jspb.arith.UInt64.prototype.toString = function () {
      for (var e = "", t = this; !t.zero();) {
        var r = (t = t.div(10))[0];
        e = t[1].lo + e, t = r;
      }

      return "" == e && (e = "0"), e;
    }, jspb.arith.UInt64.fromString = function (e) {
      for (var t = new jspb.arith.UInt64(0, 0), r = new jspb.arith.UInt64(0, 0), o = 0; o < e.length; o++) {
        if ("0" > e[o] || "9" < e[o]) return null;
        var n = parseInt(e[o], 10);
        r.lo = n, t = t.mul(10).add(r);
      }

      return t;
    }, jspb.arith.UInt64.prototype.clone = function () {
      return new jspb.arith.UInt64(this.lo, this.hi);
    }, jspb.arith.Int64 = function (e, t) {
      this.lo = e, this.hi = t;
    }, jspb.arith.Int64.prototype.add = function (e) {
      return new jspb.arith.Int64((this.lo + e.lo & 4294967295) >>> 0 >>> 0, ((this.hi + e.hi & 4294967295) >>> 0) + (4294967296 <= this.lo + e.lo ? 1 : 0) >>> 0);
    }, jspb.arith.Int64.prototype.sub = function (e) {
      return new jspb.arith.Int64((this.lo - e.lo & 4294967295) >>> 0 >>> 0, ((this.hi - e.hi & 4294967295) >>> 0) - (0 > this.lo - e.lo ? 1 : 0) >>> 0);
    }, jspb.arith.Int64.prototype.clone = function () {
      return new jspb.arith.Int64(this.lo, this.hi);
    }, jspb.arith.Int64.prototype.toString = function () {
      var e = 0 != (2147483648 & this.hi),
          t = new jspb.arith.UInt64(this.lo, this.hi);
      return e && (t = new jspb.arith.UInt64(0, 0).sub(t)), (e ? "-" : "") + t.toString();
    }, jspb.arith.Int64.fromString = function (e) {
      var t = 0 < e.length && "-" == e[0];
      return t && (e = e.substring(1)), null === (e = jspb.arith.UInt64.fromString(e)) ? null : (t && (e = new jspb.arith.UInt64(0, 0).sub(e)), new jspb.arith.Int64(e.lo, e.hi));
    }, jspb.BinaryEncoder = function () {
      this.buffer_ = [];
    }, jspb.BinaryEncoder.prototype.length = function () {
      return this.buffer_.length;
    }, jspb.BinaryEncoder.prototype.end = function () {
      var e = this.buffer_;
      return this.buffer_ = [], e;
    }, jspb.BinaryEncoder.prototype.writeSplitVarint64 = function (e, t) {
      for (goog.asserts.assert(e == Math.floor(e)), goog.asserts.assert(t == Math.floor(t)), goog.asserts.assert(0 <= e && e < jspb.BinaryConstants.TWO_TO_32), goog.asserts.assert(0 <= t && t < jspb.BinaryConstants.TWO_TO_32); 0 < t || 127 < e;) this.buffer_.push(127 & e | 128), e = (e >>> 7 | t << 25) >>> 0, t >>>= 7;

      this.buffer_.push(e);
    }, jspb.BinaryEncoder.prototype.writeSplitFixed64 = function (e, t) {
      goog.asserts.assert(e == Math.floor(e)), goog.asserts.assert(t == Math.floor(t)), goog.asserts.assert(0 <= e && e < jspb.BinaryConstants.TWO_TO_32), goog.asserts.assert(0 <= t && t < jspb.BinaryConstants.TWO_TO_32), this.writeUint32(e), this.writeUint32(t);
    }, jspb.BinaryEncoder.prototype.writeUnsignedVarint32 = function (e) {
      for (goog.asserts.assert(e == Math.floor(e)), goog.asserts.assert(0 <= e && e < jspb.BinaryConstants.TWO_TO_32); 127 < e;) this.buffer_.push(127 & e | 128), e >>>= 7;

      this.buffer_.push(e);
    }, jspb.BinaryEncoder.prototype.writeSignedVarint32 = function (e) {
      if (goog.asserts.assert(e == Math.floor(e)), goog.asserts.assert(e >= -jspb.BinaryConstants.TWO_TO_31 && e < jspb.BinaryConstants.TWO_TO_31), 0 <= e) this.writeUnsignedVarint32(e);else {
        for (var t = 0; 9 > t; t++) this.buffer_.push(127 & e | 128), e >>= 7;

        this.buffer_.push(1);
      }
    }, jspb.BinaryEncoder.prototype.writeUnsignedVarint64 = function (e) {
      goog.asserts.assert(e == Math.floor(e)), goog.asserts.assert(0 <= e && e < jspb.BinaryConstants.TWO_TO_64), jspb.utils.splitInt64(e), this.writeSplitVarint64(jspb.utils.split64Low, jspb.utils.split64High);
    }, jspb.BinaryEncoder.prototype.writeSignedVarint64 = function (e) {
      goog.asserts.assert(e == Math.floor(e)), goog.asserts.assert(e >= -jspb.BinaryConstants.TWO_TO_63 && e < jspb.BinaryConstants.TWO_TO_63), jspb.utils.splitInt64(e), this.writeSplitVarint64(jspb.utils.split64Low, jspb.utils.split64High);
    }, jspb.BinaryEncoder.prototype.writeZigzagVarint32 = function (e) {
      goog.asserts.assert(e == Math.floor(e)), goog.asserts.assert(e >= -jspb.BinaryConstants.TWO_TO_31 && e < jspb.BinaryConstants.TWO_TO_31), this.writeUnsignedVarint32((e << 1 ^ e >> 31) >>> 0);
    }, jspb.BinaryEncoder.prototype.writeZigzagVarint64 = function (e) {
      goog.asserts.assert(e == Math.floor(e)), goog.asserts.assert(e >= -jspb.BinaryConstants.TWO_TO_63 && e < jspb.BinaryConstants.TWO_TO_63), jspb.utils.splitZigzag64(e), this.writeSplitVarint64(jspb.utils.split64Low, jspb.utils.split64High);
    }, jspb.BinaryEncoder.prototype.writeZigzagVarint64String = function (e) {
      this.writeZigzagVarint64(parseInt(e, 10));
    }, jspb.BinaryEncoder.prototype.writeUint8 = function (e) {
      goog.asserts.assert(e == Math.floor(e)), goog.asserts.assert(0 <= e && 256 > e), this.buffer_.push(e >>> 0 & 255);
    }, jspb.BinaryEncoder.prototype.writeUint16 = function (e) {
      goog.asserts.assert(e == Math.floor(e)), goog.asserts.assert(0 <= e && 65536 > e), this.buffer_.push(e >>> 0 & 255), this.buffer_.push(e >>> 8 & 255);
    }, jspb.BinaryEncoder.prototype.writeUint32 = function (e) {
      goog.asserts.assert(e == Math.floor(e)), goog.asserts.assert(0 <= e && e < jspb.BinaryConstants.TWO_TO_32), this.buffer_.push(e >>> 0 & 255), this.buffer_.push(e >>> 8 & 255), this.buffer_.push(e >>> 16 & 255), this.buffer_.push(e >>> 24 & 255);
    }, jspb.BinaryEncoder.prototype.writeUint64 = function (e) {
      goog.asserts.assert(e == Math.floor(e)), goog.asserts.assert(0 <= e && e < jspb.BinaryConstants.TWO_TO_64), jspb.utils.splitUint64(e), this.writeUint32(jspb.utils.split64Low), this.writeUint32(jspb.utils.split64High);
    }, jspb.BinaryEncoder.prototype.writeInt8 = function (e) {
      goog.asserts.assert(e == Math.floor(e)), goog.asserts.assert(-128 <= e && 128 > e), this.buffer_.push(e >>> 0 & 255);
    }, jspb.BinaryEncoder.prototype.writeInt16 = function (e) {
      goog.asserts.assert(e == Math.floor(e)), goog.asserts.assert(-32768 <= e && 32768 > e), this.buffer_.push(e >>> 0 & 255), this.buffer_.push(e >>> 8 & 255);
    }, jspb.BinaryEncoder.prototype.writeInt32 = function (e) {
      goog.asserts.assert(e == Math.floor(e)), goog.asserts.assert(e >= -jspb.BinaryConstants.TWO_TO_31 && e < jspb.BinaryConstants.TWO_TO_31), this.buffer_.push(e >>> 0 & 255), this.buffer_.push(e >>> 8 & 255), this.buffer_.push(e >>> 16 & 255), this.buffer_.push(e >>> 24 & 255);
    }, jspb.BinaryEncoder.prototype.writeInt64 = function (e) {
      goog.asserts.assert(e == Math.floor(e)), goog.asserts.assert(e >= -jspb.BinaryConstants.TWO_TO_63 && e < jspb.BinaryConstants.TWO_TO_63), jspb.utils.splitInt64(e), this.writeSplitFixed64(jspb.utils.split64Low, jspb.utils.split64High);
    }, jspb.BinaryEncoder.prototype.writeInt64String = function (e) {
      goog.asserts.assert(e == Math.floor(e)), goog.asserts.assert(+e >= -jspb.BinaryConstants.TWO_TO_63 && +e < jspb.BinaryConstants.TWO_TO_63), jspb.utils.splitHash64(jspb.utils.decimalStringToHash64(e)), this.writeSplitFixed64(jspb.utils.split64Low, jspb.utils.split64High);
    }, jspb.BinaryEncoder.prototype.writeFloat = function (e) {
      goog.asserts.assert(e >= -jspb.BinaryConstants.FLOAT32_MAX && e <= jspb.BinaryConstants.FLOAT32_MAX), jspb.utils.splitFloat32(e), this.writeUint32(jspb.utils.split64Low);
    }, jspb.BinaryEncoder.prototype.writeDouble = function (e) {
      goog.asserts.assert(e >= -jspb.BinaryConstants.FLOAT64_MAX && e <= jspb.BinaryConstants.FLOAT64_MAX), jspb.utils.splitFloat64(e), this.writeUint32(jspb.utils.split64Low), this.writeUint32(jspb.utils.split64High);
    }, jspb.BinaryEncoder.prototype.writeBool = function (e) {
      goog.asserts.assert(goog.isBoolean(e) || goog.isNumber(e)), this.buffer_.push(e ? 1 : 0);
    }, jspb.BinaryEncoder.prototype.writeEnum = function (e) {
      goog.asserts.assert(e == Math.floor(e)), goog.asserts.assert(e >= -jspb.BinaryConstants.TWO_TO_31 && e < jspb.BinaryConstants.TWO_TO_31), this.writeSignedVarint32(e);
    }, jspb.BinaryEncoder.prototype.writeBytes = function (e) {
      this.buffer_.push.apply(this.buffer_, e);
    }, jspb.BinaryEncoder.prototype.writeVarintHash64 = function (e) {
      jspb.utils.splitHash64(e), this.writeSplitVarint64(jspb.utils.split64Low, jspb.utils.split64High);
    }, jspb.BinaryEncoder.prototype.writeFixedHash64 = function (e) {
      jspb.utils.splitHash64(e), this.writeUint32(jspb.utils.split64Low), this.writeUint32(jspb.utils.split64High);
    }, jspb.BinaryEncoder.prototype.writeString = function (e) {
      for (var t = this.buffer_.length, r = 0; r < e.length; r++) {
        var o = e.charCodeAt(r);
        if (128 > o) this.buffer_.push(o);else if (2048 > o) this.buffer_.push(o >> 6 | 192), this.buffer_.push(63 & o | 128);else if (65536 > o) if (55296 <= o && 56319 >= o && r + 1 < e.length) {
          var n = e.charCodeAt(r + 1);
          56320 <= n && 57343 >= n && (o = 1024 * (o - 55296) + n - 56320 + 65536, this.buffer_.push(o >> 18 | 240), this.buffer_.push(o >> 12 & 63 | 128), this.buffer_.push(o >> 6 & 63 | 128), this.buffer_.push(63 & o | 128), r++);
        } else this.buffer_.push(o >> 12 | 224), this.buffer_.push(o >> 6 & 63 | 128), this.buffer_.push(63 & o | 128);
      }

      return this.buffer_.length - t;
    }, jspb.BinaryWriter = function () {
      this.blocks_ = [], this.totalLength_ = 0, this.encoder_ = new jspb.BinaryEncoder(), this.bookmarks_ = [];
    }, jspb.BinaryWriter.prototype.appendUint8Array_ = function (e) {
      var t = this.encoder_.end();
      this.blocks_.push(t), this.blocks_.push(e), this.totalLength_ += t.length + e.length;
    }, jspb.BinaryWriter.prototype.beginDelimited_ = function (e) {
      return this.writeFieldHeader_(e, jspb.BinaryConstants.WireType.DELIMITED), e = this.encoder_.end(), this.blocks_.push(e), this.totalLength_ += e.length, e.push(this.totalLength_), e;
    }, jspb.BinaryWriter.prototype.endDelimited_ = function (e) {
      var t = e.pop();
      t = this.totalLength_ + this.encoder_.length() - t;

      for (goog.asserts.assert(0 <= t); 127 < t;) e.push(127 & t | 128), t >>>= 7, this.totalLength_++;

      e.push(t), this.totalLength_++;
    }, jspb.BinaryWriter.prototype.writeSerializedMessage = function (e, t, r) {
      this.appendUint8Array_(e.subarray(t, r));
    }, jspb.BinaryWriter.prototype.maybeWriteSerializedMessage = function (e, t, r) {
      null != e && null != t && null != r && this.writeSerializedMessage(e, t, r);
    }, jspb.BinaryWriter.prototype.reset = function () {
      this.blocks_ = [], this.encoder_.end(), this.totalLength_ = 0, this.bookmarks_ = [];
    }, jspb.BinaryWriter.prototype.getResultBuffer = function () {
      goog.asserts.assert(0 == this.bookmarks_.length);

      for (var e = new Uint8Array(this.totalLength_ + this.encoder_.length()), t = this.blocks_, r = t.length, o = 0, n = 0; n < r; n++) {
        var s = t[n];
        e.set(s, o), o += s.length;
      }

      return t = this.encoder_.end(), e.set(t, o), o += t.length, goog.asserts.assert(o == e.length), this.blocks_ = [e], e;
    }, jspb.BinaryWriter.prototype.getResultBase64String = function (e) {
      return goog.crypt.base64.encodeByteArray(this.getResultBuffer(), e);
    }, jspb.BinaryWriter.prototype.beginSubMessage = function (e) {
      this.bookmarks_.push(this.beginDelimited_(e));
    }, jspb.BinaryWriter.prototype.endSubMessage = function () {
      goog.asserts.assert(0 <= this.bookmarks_.length), this.endDelimited_(this.bookmarks_.pop());
    }, jspb.BinaryWriter.prototype.writeFieldHeader_ = function (e, t) {
      goog.asserts.assert(1 <= e && e == Math.floor(e)), this.encoder_.writeUnsignedVarint32(8 * e + t);
    }, jspb.BinaryWriter.prototype.writeAny = function (e, t, r) {
      var o = jspb.BinaryConstants.FieldType;

      switch (e) {
        case o.DOUBLE:
          this.writeDouble(t, r);
          break;

        case o.FLOAT:
          this.writeFloat(t, r);
          break;

        case o.INT64:
          this.writeInt64(t, r);
          break;

        case o.UINT64:
          this.writeUint64(t, r);
          break;

        case o.INT32:
          this.writeInt32(t, r);
          break;

        case o.FIXED64:
          this.writeFixed64(t, r);
          break;

        case o.FIXED32:
          this.writeFixed32(t, r);
          break;

        case o.BOOL:
          this.writeBool(t, r);
          break;

        case o.STRING:
          this.writeString(t, r);
          break;

        case o.GROUP:
          goog.asserts.fail("Group field type not supported in writeAny()");
          break;

        case o.MESSAGE:
          goog.asserts.fail("Message field type not supported in writeAny()");
          break;

        case o.BYTES:
          this.writeBytes(t, r);
          break;

        case o.UINT32:
          this.writeUint32(t, r);
          break;

        case o.ENUM:
          this.writeEnum(t, r);
          break;

        case o.SFIXED32:
          this.writeSfixed32(t, r);
          break;

        case o.SFIXED64:
          this.writeSfixed64(t, r);
          break;

        case o.SINT32:
          this.writeSint32(t, r);
          break;

        case o.SINT64:
          this.writeSint64(t, r);
          break;

        case o.FHASH64:
          this.writeFixedHash64(t, r);
          break;

        case o.VHASH64:
          this.writeVarintHash64(t, r);
          break;

        default:
          goog.asserts.fail("Invalid field type in writeAny()");
      }
    }, jspb.BinaryWriter.prototype.writeUnsignedVarint32_ = function (e, t) {
      null != t && (this.writeFieldHeader_(e, jspb.BinaryConstants.WireType.VARINT), this.encoder_.writeUnsignedVarint32(t));
    }, jspb.BinaryWriter.prototype.writeSignedVarint32_ = function (e, t) {
      null != t && (this.writeFieldHeader_(e, jspb.BinaryConstants.WireType.VARINT), this.encoder_.writeSignedVarint32(t));
    }, jspb.BinaryWriter.prototype.writeUnsignedVarint64_ = function (e, t) {
      null != t && (this.writeFieldHeader_(e, jspb.BinaryConstants.WireType.VARINT), this.encoder_.writeUnsignedVarint64(t));
    }, jspb.BinaryWriter.prototype.writeSignedVarint64_ = function (e, t) {
      null != t && (this.writeFieldHeader_(e, jspb.BinaryConstants.WireType.VARINT), this.encoder_.writeSignedVarint64(t));
    }, jspb.BinaryWriter.prototype.writeZigzagVarint32_ = function (e, t) {
      null != t && (this.writeFieldHeader_(e, jspb.BinaryConstants.WireType.VARINT), this.encoder_.writeZigzagVarint32(t));
    }, jspb.BinaryWriter.prototype.writeZigzagVarint64_ = function (e, t) {
      null != t && (this.writeFieldHeader_(e, jspb.BinaryConstants.WireType.VARINT), this.encoder_.writeZigzagVarint64(t));
    }, jspb.BinaryWriter.prototype.writeZigzagVarint64String_ = function (e, t) {
      null != t && (this.writeFieldHeader_(e, jspb.BinaryConstants.WireType.VARINT), this.encoder_.writeZigzagVarint64String(t));
    }, jspb.BinaryWriter.prototype.writeInt32 = function (e, t) {
      null != t && (goog.asserts.assert(t >= -jspb.BinaryConstants.TWO_TO_31 && t < jspb.BinaryConstants.TWO_TO_31), this.writeSignedVarint32_(e, t));
    }, jspb.BinaryWriter.prototype.writeInt32String = function (e, t) {
      if (null != t) {
        var r = parseInt(t, 10);
        goog.asserts.assert(r >= -jspb.BinaryConstants.TWO_TO_31 && r < jspb.BinaryConstants.TWO_TO_31), this.writeSignedVarint32_(e, r);
      }
    }, jspb.BinaryWriter.prototype.writeInt64 = function (e, t) {
      null != t && (goog.asserts.assert(t >= -jspb.BinaryConstants.TWO_TO_63 && t < jspb.BinaryConstants.TWO_TO_63), this.writeSignedVarint64_(e, t));
    }, jspb.BinaryWriter.prototype.writeInt64String = function (e, t) {
      if (null != t) {
        var r = jspb.arith.Int64.fromString(t);
        this.writeFieldHeader_(e, jspb.BinaryConstants.WireType.VARINT), this.encoder_.writeSplitVarint64(r.lo, r.hi);
      }
    }, jspb.BinaryWriter.prototype.writeUint32 = function (e, t) {
      null != t && (goog.asserts.assert(0 <= t && t < jspb.BinaryConstants.TWO_TO_32), this.writeUnsignedVarint32_(e, t));
    }, jspb.BinaryWriter.prototype.writeUint32String = function (e, t) {
      if (null != t) {
        var r = parseInt(t, 10);
        goog.asserts.assert(0 <= r && r < jspb.BinaryConstants.TWO_TO_32), this.writeUnsignedVarint32_(e, r);
      }
    }, jspb.BinaryWriter.prototype.writeUint64 = function (e, t) {
      null != t && (goog.asserts.assert(0 <= t && t < jspb.BinaryConstants.TWO_TO_64), this.writeUnsignedVarint64_(e, t));
    }, jspb.BinaryWriter.prototype.writeUint64String = function (e, t) {
      if (null != t) {
        var r = jspb.arith.UInt64.fromString(t);
        this.writeFieldHeader_(e, jspb.BinaryConstants.WireType.VARINT), this.encoder_.writeSplitVarint64(r.lo, r.hi);
      }
    }, jspb.BinaryWriter.prototype.writeSint32 = function (e, t) {
      null != t && (goog.asserts.assert(t >= -jspb.BinaryConstants.TWO_TO_31 && t < jspb.BinaryConstants.TWO_TO_31), this.writeZigzagVarint32_(e, t));
    }, jspb.BinaryWriter.prototype.writeSint64 = function (e, t) {
      null != t && (goog.asserts.assert(t >= -jspb.BinaryConstants.TWO_TO_63 && t < jspb.BinaryConstants.TWO_TO_63), this.writeZigzagVarint64_(e, t));
    }, jspb.BinaryWriter.prototype.writeSint64String = function (e, t) {
      null != t && (goog.asserts.assert(+t >= -jspb.BinaryConstants.TWO_TO_63 && +t < jspb.BinaryConstants.TWO_TO_63), this.writeZigzagVarint64String_(e, t));
    }, jspb.BinaryWriter.prototype.writeFixed32 = function (e, t) {
      null != t && (goog.asserts.assert(0 <= t && t < jspb.BinaryConstants.TWO_TO_32), this.writeFieldHeader_(e, jspb.BinaryConstants.WireType.FIXED32), this.encoder_.writeUint32(t));
    }, jspb.BinaryWriter.prototype.writeFixed64 = function (e, t) {
      null != t && (goog.asserts.assert(0 <= t && t < jspb.BinaryConstants.TWO_TO_64), this.writeFieldHeader_(e, jspb.BinaryConstants.WireType.FIXED64), this.encoder_.writeUint64(t));
    }, jspb.BinaryWriter.prototype.writeFixed64String = function (e, t) {
      if (null != t) {
        var r = jspb.arith.UInt64.fromString(t);
        this.writeFieldHeader_(e, jspb.BinaryConstants.WireType.FIXED64), this.encoder_.writeSplitFixed64(r.lo, r.hi);
      }
    }, jspb.BinaryWriter.prototype.writeSfixed32 = function (e, t) {
      null != t && (goog.asserts.assert(t >= -jspb.BinaryConstants.TWO_TO_31 && t < jspb.BinaryConstants.TWO_TO_31), this.writeFieldHeader_(e, jspb.BinaryConstants.WireType.FIXED32), this.encoder_.writeInt32(t));
    }, jspb.BinaryWriter.prototype.writeSfixed64 = function (e, t) {
      null != t && (goog.asserts.assert(t >= -jspb.BinaryConstants.TWO_TO_63 && t < jspb.BinaryConstants.TWO_TO_63), this.writeFieldHeader_(e, jspb.BinaryConstants.WireType.FIXED64), this.encoder_.writeInt64(t));
    }, jspb.BinaryWriter.prototype.writeSfixed64String = function (e, t) {
      if (null != t) {
        var r = jspb.arith.Int64.fromString(t);
        this.writeFieldHeader_(e, jspb.BinaryConstants.WireType.FIXED64), this.encoder_.writeSplitFixed64(r.lo, r.hi);
      }
    }, jspb.BinaryWriter.prototype.writeFloat = function (e, t) {
      null != t && (this.writeFieldHeader_(e, jspb.BinaryConstants.WireType.FIXED32), this.encoder_.writeFloat(t));
    }, jspb.BinaryWriter.prototype.writeDouble = function (e, t) {
      null != t && (this.writeFieldHeader_(e, jspb.BinaryConstants.WireType.FIXED64), this.encoder_.writeDouble(t));
    }, jspb.BinaryWriter.prototype.writeBool = function (e, t) {
      null != t && (goog.asserts.assert(goog.isBoolean(t) || goog.isNumber(t)), this.writeFieldHeader_(e, jspb.BinaryConstants.WireType.VARINT), this.encoder_.writeBool(t));
    }, jspb.BinaryWriter.prototype.writeEnum = function (e, t) {
      null != t && (goog.asserts.assert(t >= -jspb.BinaryConstants.TWO_TO_31 && t < jspb.BinaryConstants.TWO_TO_31), this.writeFieldHeader_(e, jspb.BinaryConstants.WireType.VARINT), this.encoder_.writeSignedVarint32(t));
    }, jspb.BinaryWriter.prototype.writeString = function (e, t) {
      if (null != t) {
        var r = this.beginDelimited_(e);
        this.encoder_.writeString(t), this.endDelimited_(r);
      }
    }, jspb.BinaryWriter.prototype.writeBytes = function (e, t) {
      if (null != t) {
        var r = jspb.utils.byteSourceToUint8Array(t);
        this.writeFieldHeader_(e, jspb.BinaryConstants.WireType.DELIMITED), this.encoder_.writeUnsignedVarint32(r.length), this.appendUint8Array_(r);
      }
    }, jspb.BinaryWriter.prototype.writeMessage = function (e, t, r) {
      null != t && (e = this.beginDelimited_(e), r(t, this), this.endDelimited_(e));
    }, jspb.BinaryWriter.prototype.writeGroup = function (e, t, r) {
      null != t && (this.writeFieldHeader_(e, jspb.BinaryConstants.WireType.START_GROUP), r(t, this), this.writeFieldHeader_(e, jspb.BinaryConstants.WireType.END_GROUP));
    }, jspb.BinaryWriter.prototype.writeFixedHash64 = function (e, t) {
      null != t && (goog.asserts.assert(8 == t.length), this.writeFieldHeader_(e, jspb.BinaryConstants.WireType.FIXED64), this.encoder_.writeFixedHash64(t));
    }, jspb.BinaryWriter.prototype.writeVarintHash64 = function (e, t) {
      null != t && (goog.asserts.assert(8 == t.length), this.writeFieldHeader_(e, jspb.BinaryConstants.WireType.VARINT), this.encoder_.writeVarintHash64(t));
    }, jspb.BinaryWriter.prototype.writeRepeatedInt32 = function (e, t) {
      if (null != t) for (var r = 0; r < t.length; r++) this.writeSignedVarint32_(e, t[r]);
    }, jspb.BinaryWriter.prototype.writeRepeatedInt32String = function (e, t) {
      if (null != t) for (var r = 0; r < t.length; r++) this.writeInt32String(e, t[r]);
    }, jspb.BinaryWriter.prototype.writeRepeatedInt64 = function (e, t) {
      if (null != t) for (var r = 0; r < t.length; r++) this.writeSignedVarint64_(e, t[r]);
    }, jspb.BinaryWriter.prototype.writeRepeatedInt64String = function (e, t) {
      if (null != t) for (var r = 0; r < t.length; r++) this.writeInt64String(e, t[r]);
    }, jspb.BinaryWriter.prototype.writeRepeatedUint32 = function (e, t) {
      if (null != t) for (var r = 0; r < t.length; r++) this.writeUnsignedVarint32_(e, t[r]);
    }, jspb.BinaryWriter.prototype.writeRepeatedUint32String = function (e, t) {
      if (null != t) for (var r = 0; r < t.length; r++) this.writeUint32String(e, t[r]);
    }, jspb.BinaryWriter.prototype.writeRepeatedUint64 = function (e, t) {
      if (null != t) for (var r = 0; r < t.length; r++) this.writeUnsignedVarint64_(e, t[r]);
    }, jspb.BinaryWriter.prototype.writeRepeatedUint64String = function (e, t) {
      if (null != t) for (var r = 0; r < t.length; r++) this.writeUint64String(e, t[r]);
    }, jspb.BinaryWriter.prototype.writeRepeatedSint32 = function (e, t) {
      if (null != t) for (var r = 0; r < t.length; r++) this.writeZigzagVarint32_(e, t[r]);
    }, jspb.BinaryWriter.prototype.writeRepeatedSint64 = function (e, t) {
      if (null != t) for (var r = 0; r < t.length; r++) this.writeZigzagVarint64_(e, t[r]);
    }, jspb.BinaryWriter.prototype.writeRepeatedSint64String = function (e, t) {
      if (null != t) for (var r = 0; r < t.length; r++) this.writeZigzagVarint64String_(e, t[r]);
    }, jspb.BinaryWriter.prototype.writeRepeatedFixed32 = function (e, t) {
      if (null != t) for (var r = 0; r < t.length; r++) this.writeFixed32(e, t[r]);
    }, jspb.BinaryWriter.prototype.writeRepeatedFixed64 = function (e, t) {
      if (null != t) for (var r = 0; r < t.length; r++) this.writeFixed64(e, t[r]);
    }, jspb.BinaryWriter.prototype.writeRepeatedFixed64String = function (e, t) {
      if (null != t) for (var r = 0; r < t.length; r++) this.writeFixed64String(e, t[r]);
    }, jspb.BinaryWriter.prototype.writeRepeatedSfixed32 = function (e, t) {
      if (null != t) for (var r = 0; r < t.length; r++) this.writeSfixed32(e, t[r]);
    }, jspb.BinaryWriter.prototype.writeRepeatedSfixed64 = function (e, t) {
      if (null != t) for (var r = 0; r < t.length; r++) this.writeSfixed64(e, t[r]);
    }, jspb.BinaryWriter.prototype.writeRepeatedSfixed64String = function (e, t) {
      if (null != t) for (var r = 0; r < t.length; r++) this.writeSfixed64String(e, t[r]);
    }, jspb.BinaryWriter.prototype.writeRepeatedFloat = function (e, t) {
      if (null != t) for (var r = 0; r < t.length; r++) this.writeFloat(e, t[r]);
    }, jspb.BinaryWriter.prototype.writeRepeatedDouble = function (e, t) {
      if (null != t) for (var r = 0; r < t.length; r++) this.writeDouble(e, t[r]);
    }, jspb.BinaryWriter.prototype.writeRepeatedBool = function (e, t) {
      if (null != t) for (var r = 0; r < t.length; r++) this.writeBool(e, t[r]);
    }, jspb.BinaryWriter.prototype.writeRepeatedEnum = function (e, t) {
      if (null != t) for (var r = 0; r < t.length; r++) this.writeEnum(e, t[r]);
    }, jspb.BinaryWriter.prototype.writeRepeatedString = function (e, t) {
      if (null != t) for (var r = 0; r < t.length; r++) this.writeString(e, t[r]);
    }, jspb.BinaryWriter.prototype.writeRepeatedBytes = function (e, t) {
      if (null != t) for (var r = 0; r < t.length; r++) this.writeBytes(e, t[r]);
    }, jspb.BinaryWriter.prototype.writeRepeatedMessage = function (e, t, r) {
      if (null != t) for (var o = 0; o < t.length; o++) {
        var n = this.beginDelimited_(e);
        r(t[o], this), this.endDelimited_(n);
      }
    }, jspb.BinaryWriter.prototype.writeRepeatedGroup = function (e, t, r) {
      if (null != t) for (var o = 0; o < t.length; o++) this.writeFieldHeader_(e, jspb.BinaryConstants.WireType.START_GROUP), r(t[o], this), this.writeFieldHeader_(e, jspb.BinaryConstants.WireType.END_GROUP);
    }, jspb.BinaryWriter.prototype.writeRepeatedFixedHash64 = function (e, t) {
      if (null != t) for (var r = 0; r < t.length; r++) this.writeFixedHash64(e, t[r]);
    }, jspb.BinaryWriter.prototype.writeRepeatedVarintHash64 = function (e, t) {
      if (null != t) for (var r = 0; r < t.length; r++) this.writeVarintHash64(e, t[r]);
    }, jspb.BinaryWriter.prototype.writePackedInt32 = function (e, t) {
      if (null != t && t.length) {
        for (var r = this.beginDelimited_(e), o = 0; o < t.length; o++) this.encoder_.writeSignedVarint32(t[o]);

        this.endDelimited_(r);
      }
    }, jspb.BinaryWriter.prototype.writePackedInt32String = function (e, t) {
      if (null != t && t.length) {
        for (var r = this.beginDelimited_(e), o = 0; o < t.length; o++) this.encoder_.writeSignedVarint32(parseInt(t[o], 10));

        this.endDelimited_(r);
      }
    }, jspb.BinaryWriter.prototype.writePackedInt64 = function (e, t) {
      if (null != t && t.length) {
        for (var r = this.beginDelimited_(e), o = 0; o < t.length; o++) this.encoder_.writeSignedVarint64(t[o]);

        this.endDelimited_(r);
      }
    }, jspb.BinaryWriter.prototype.writePackedInt64String = function (e, t) {
      if (null != t && t.length) {
        for (var r = this.beginDelimited_(e), o = 0; o < t.length; o++) {
          var n = jspb.arith.Int64.fromString(t[o]);
          this.encoder_.writeSplitVarint64(n.lo, n.hi);
        }

        this.endDelimited_(r);
      }
    }, jspb.BinaryWriter.prototype.writePackedUint32 = function (e, t) {
      if (null != t && t.length) {
        for (var r = this.beginDelimited_(e), o = 0; o < t.length; o++) this.encoder_.writeUnsignedVarint32(t[o]);

        this.endDelimited_(r);
      }
    }, jspb.BinaryWriter.prototype.writePackedUint32String = function (e, t) {
      if (null != t && t.length) {
        for (var r = this.beginDelimited_(e), o = 0; o < t.length; o++) this.encoder_.writeUnsignedVarint32(parseInt(t[o], 10));

        this.endDelimited_(r);
      }
    }, jspb.BinaryWriter.prototype.writePackedUint64 = function (e, t) {
      if (null != t && t.length) {
        for (var r = this.beginDelimited_(e), o = 0; o < t.length; o++) this.encoder_.writeUnsignedVarint64(t[o]);

        this.endDelimited_(r);
      }
    }, jspb.BinaryWriter.prototype.writePackedUint64String = function (e, t) {
      if (null != t && t.length) {
        for (var r = this.beginDelimited_(e), o = 0; o < t.length; o++) {
          var n = jspb.arith.UInt64.fromString(t[o]);
          this.encoder_.writeSplitVarint64(n.lo, n.hi);
        }

        this.endDelimited_(r);
      }
    }, jspb.BinaryWriter.prototype.writePackedSint32 = function (e, t) {
      if (null != t && t.length) {
        for (var r = this.beginDelimited_(e), o = 0; o < t.length; o++) this.encoder_.writeZigzagVarint32(t[o]);

        this.endDelimited_(r);
      }
    }, jspb.BinaryWriter.prototype.writePackedSint64 = function (e, t) {
      if (null != t && t.length) {
        for (var r = this.beginDelimited_(e), o = 0; o < t.length; o++) this.encoder_.writeZigzagVarint64(t[o]);

        this.endDelimited_(r);
      }
    }, jspb.BinaryWriter.prototype.writePackedSint64String = function (e, t) {
      if (null != t && t.length) {
        for (var r = this.beginDelimited_(e), o = 0; o < t.length; o++) this.encoder_.writeZigzagVarint64(parseInt(t[o], 10));

        this.endDelimited_(r);
      }
    }, jspb.BinaryWriter.prototype.writePackedFixed32 = function (e, t) {
      if (null != t && t.length) {
        this.writeFieldHeader_(e, jspb.BinaryConstants.WireType.DELIMITED), this.encoder_.writeUnsignedVarint32(4 * t.length);

        for (var r = 0; r < t.length; r++) this.encoder_.writeUint32(t[r]);
      }
    }, jspb.BinaryWriter.prototype.writePackedFixed64 = function (e, t) {
      if (null != t && t.length) {
        this.writeFieldHeader_(e, jspb.BinaryConstants.WireType.DELIMITED), this.encoder_.writeUnsignedVarint32(8 * t.length);

        for (var r = 0; r < t.length; r++) this.encoder_.writeUint64(t[r]);
      }
    }, jspb.BinaryWriter.prototype.writePackedFixed64String = function (e, t) {
      if (null != t && t.length) {
        this.writeFieldHeader_(e, jspb.BinaryConstants.WireType.DELIMITED), this.encoder_.writeUnsignedVarint32(8 * t.length);

        for (var r = 0; r < t.length; r++) {
          var o = jspb.arith.UInt64.fromString(t[r]);
          this.encoder_.writeSplitFixed64(o.lo, o.hi);
        }
      }
    }, jspb.BinaryWriter.prototype.writePackedSfixed32 = function (e, t) {
      if (null != t && t.length) {
        this.writeFieldHeader_(e, jspb.BinaryConstants.WireType.DELIMITED), this.encoder_.writeUnsignedVarint32(4 * t.length);

        for (var r = 0; r < t.length; r++) this.encoder_.writeInt32(t[r]);
      }
    }, jspb.BinaryWriter.prototype.writePackedSfixed64 = function (e, t) {
      if (null != t && t.length) {
        this.writeFieldHeader_(e, jspb.BinaryConstants.WireType.DELIMITED), this.encoder_.writeUnsignedVarint32(8 * t.length);

        for (var r = 0; r < t.length; r++) this.encoder_.writeInt64(t[r]);
      }
    }, jspb.BinaryWriter.prototype.writePackedSfixed64String = function (e, t) {
      if (null != t && t.length) {
        this.writeFieldHeader_(e, jspb.BinaryConstants.WireType.DELIMITED), this.encoder_.writeUnsignedVarint32(8 * t.length);

        for (var r = 0; r < t.length; r++) this.encoder_.writeInt64String(t[r]);
      }
    }, jspb.BinaryWriter.prototype.writePackedFloat = function (e, t) {
      if (null != t && t.length) {
        this.writeFieldHeader_(e, jspb.BinaryConstants.WireType.DELIMITED), this.encoder_.writeUnsignedVarint32(4 * t.length);

        for (var r = 0; r < t.length; r++) this.encoder_.writeFloat(t[r]);
      }
    }, jspb.BinaryWriter.prototype.writePackedDouble = function (e, t) {
      if (null != t && t.length) {
        this.writeFieldHeader_(e, jspb.BinaryConstants.WireType.DELIMITED), this.encoder_.writeUnsignedVarint32(8 * t.length);

        for (var r = 0; r < t.length; r++) this.encoder_.writeDouble(t[r]);
      }
    }, jspb.BinaryWriter.prototype.writePackedBool = function (e, t) {
      if (null != t && t.length) {
        this.writeFieldHeader_(e, jspb.BinaryConstants.WireType.DELIMITED), this.encoder_.writeUnsignedVarint32(t.length);

        for (var r = 0; r < t.length; r++) this.encoder_.writeBool(t[r]);
      }
    }, jspb.BinaryWriter.prototype.writePackedEnum = function (e, t) {
      if (null != t && t.length) {
        for (var r = this.beginDelimited_(e), o = 0; o < t.length; o++) this.encoder_.writeEnum(t[o]);

        this.endDelimited_(r);
      }
    }, jspb.BinaryWriter.prototype.writePackedFixedHash64 = function (e, t) {
      if (null != t && t.length) {
        this.writeFieldHeader_(e, jspb.BinaryConstants.WireType.DELIMITED), this.encoder_.writeUnsignedVarint32(8 * t.length);

        for (var r = 0; r < t.length; r++) this.encoder_.writeFixedHash64(t[r]);
      }
    }, jspb.BinaryWriter.prototype.writePackedVarintHash64 = function (e, t) {
      if (null != t && t.length) {
        for (var r = this.beginDelimited_(e), o = 0; o < t.length; o++) this.encoder_.writeVarintHash64(t[o]);

        this.endDelimited_(r);
      }
    }, jspb.Export = {}, exports.Map = jspb.Map, exports.Message = jspb.Message, exports.BinaryReader = jspb.BinaryReader, exports.BinaryWriter = jspb.BinaryWriter, exports.ExtensionFieldInfo = jspb.ExtensionFieldInfo, exports.ExtensionFieldBinaryInfo = jspb.ExtensionFieldBinaryInfo, exports.exportSymbol = goog.exportSymbol, exports.inherits = goog.inherits, exports.object = {
      extend: goog.object.extend
    }, exports.typeOf = goog.typeOf;
  }, {
    "buffer": "dskh"
  }],
  "G7CV": [function (require, module, exports) {
    var o = require("google-protobuf"),
        t = o,
        r = Function("return this")();

    t.exportSymbol("proto.google.protobuf.Empty", null, r), proto.google.protobuf.Empty = function (t) {
      o.Message.initialize(this, t, 0, -1, null, null);
    }, t.inherits(proto.google.protobuf.Empty, o.Message), t.DEBUG && !COMPILED && (proto.google.protobuf.Empty.displayName = "proto.google.protobuf.Empty"), o.Message.GENERATE_TO_OBJECT && (proto.google.protobuf.Empty.prototype.toObject = function (o) {
      return proto.google.protobuf.Empty.toObject(o, this);
    }, proto.google.protobuf.Empty.toObject = function (o, t) {
      var r = {};
      return o && (r.$jspbMessageInstance = t), r;
    }), proto.google.protobuf.Empty.deserializeBinary = function (t) {
      var r = new o.BinaryReader(t),
          e = new proto.google.protobuf.Empty();
      return proto.google.protobuf.Empty.deserializeBinaryFromReader(e, r);
    }, proto.google.protobuf.Empty.deserializeBinaryFromReader = function (o, t) {
      for (; t.nextField() && !t.isEndGroup();) {
        t.getFieldNumber();
        t.skipField();
      }

      return o;
    }, proto.google.protobuf.Empty.prototype.serializeBinary = function () {
      var t = new o.BinaryWriter();
      return proto.google.protobuf.Empty.serializeBinaryToWriter(this, t), t.getResultBuffer();
    }, proto.google.protobuf.Empty.serializeBinaryToWriter = function (o, t) {}, t.object.extend(exports, proto.google.protobuf);
  }, {
    "google-protobuf": "S7GR"
  }],
  "zrcS": [function (require, module, exports) {
    var e = require("google-protobuf"),
        t = e,
        r = Function("return this")(),
        o = require("google-protobuf/google/protobuf/empty_pb.js");

    t.exportSymbol("proto.webrpc.AckStateRequest", null, r), t.exportSymbol("proto.webrpc.Condition", null, r), t.exportSymbol("proto.webrpc.CreateAppSessionRequest", null, r), t.exportSymbol("proto.webrpc.CreateAppSessionResponse", null, r), t.exportSymbol("proto.webrpc.DepositRequest", null, r), t.exportSymbol("proto.webrpc.DepositResponse", null, r), t.exportSymbol("proto.webrpc.EndAppSessionRequest", null, r), t.exportSymbol("proto.webrpc.GetBalanceRequest", null, r), t.exportSymbol("proto.webrpc.GetBalanceResponse", null, r), t.exportSymbol("proto.webrpc.OpenChannelRequest", null, r), t.exportSymbol("proto.webrpc.OpenChannelResponse", null, r), t.exportSymbol("proto.webrpc.ReceiveStatesRequest", null, r), t.exportSymbol("proto.webrpc.RegisterOracleRequest", null, r), t.exportSymbol("proto.webrpc.ResolveOracleRequest", null, r), t.exportSymbol("proto.webrpc.SendConditionalPaymentRequest", null, r), t.exportSymbol("proto.webrpc.SendConditionalPaymentResponse", null, r), t.exportSymbol("proto.webrpc.SendStateRequest", null, r), t.exportSymbol("proto.webrpc.SettleAppSessionRequest", null, r), t.exportSymbol("proto.webrpc.SettleAppSessionResponse", null, r), t.exportSymbol("proto.webrpc.StateMessage", null, r), t.exportSymbol("proto.webrpc.WithdrawRequest", null, r), t.exportSymbol("proto.webrpc.WithdrawResponse", null, r), proto.webrpc.OpenChannelRequest = function (t) {
      e.Message.initialize(this, t, 0, -1, null, null);
    }, t.inherits(proto.webrpc.OpenChannelRequest, e.Message), t.DEBUG && !COMPILED && (proto.webrpc.OpenChannelRequest.displayName = "proto.webrpc.OpenChannelRequest"), e.Message.GENERATE_TO_OBJECT && (proto.webrpc.OpenChannelRequest.prototype.toObject = function (e) {
      return proto.webrpc.OpenChannelRequest.toObject(e, this);
    }, proto.webrpc.OpenChannelRequest.toObject = function (t, r) {
      var o = {
        tokenType: e.Message.getFieldWithDefault(r, 1, ""),
        tokenAddress: e.Message.getFieldWithDefault(r, 2, ""),
        amountWei: e.Message.getFieldWithDefault(r, 3, ""),
        peerAmountWei: e.Message.getFieldWithDefault(r, 4, "")
      };
      return t && (o.$jspbMessageInstance = r), o;
    }), proto.webrpc.OpenChannelRequest.deserializeBinary = function (t) {
      var r = new e.BinaryReader(t),
          o = new proto.webrpc.OpenChannelRequest();
      return proto.webrpc.OpenChannelRequest.deserializeBinaryFromReader(o, r);
    }, proto.webrpc.OpenChannelRequest.deserializeBinaryFromReader = function (e, t) {
      for (; t.nextField() && !t.isEndGroup();) {
        switch (t.getFieldNumber()) {
          case 1:
            var r = t.readString();
            e.setTokenType(r);
            break;

          case 2:
            r = t.readString();
            e.setTokenAddress(r);
            break;

          case 3:
            r = t.readString();
            e.setAmountWei(r);
            break;

          case 4:
            r = t.readString();
            e.setPeerAmountWei(r);
            break;

          default:
            t.skipField();
        }
      }

      return e;
    }, proto.webrpc.OpenChannelRequest.prototype.serializeBinary = function () {
      var t = new e.BinaryWriter();
      return proto.webrpc.OpenChannelRequest.serializeBinaryToWriter(this, t), t.getResultBuffer();
    }, proto.webrpc.OpenChannelRequest.serializeBinaryToWriter = function (e, t) {
      var r = void 0;
      (r = e.getTokenType()).length > 0 && t.writeString(1, r), (r = e.getTokenAddress()).length > 0 && t.writeString(2, r), (r = e.getAmountWei()).length > 0 && t.writeString(3, r), (r = e.getPeerAmountWei()).length > 0 && t.writeString(4, r);
    }, proto.webrpc.OpenChannelRequest.prototype.getTokenType = function () {
      return e.Message.getFieldWithDefault(this, 1, "");
    }, proto.webrpc.OpenChannelRequest.prototype.setTokenType = function (t) {
      e.Message.setProto3StringField(this, 1, t);
    }, proto.webrpc.OpenChannelRequest.prototype.getTokenAddress = function () {
      return e.Message.getFieldWithDefault(this, 2, "");
    }, proto.webrpc.OpenChannelRequest.prototype.setTokenAddress = function (t) {
      e.Message.setProto3StringField(this, 2, t);
    }, proto.webrpc.OpenChannelRequest.prototype.getAmountWei = function () {
      return e.Message.getFieldWithDefault(this, 3, "");
    }, proto.webrpc.OpenChannelRequest.prototype.setAmountWei = function (t) {
      e.Message.setProto3StringField(this, 3, t);
    }, proto.webrpc.OpenChannelRequest.prototype.getPeerAmountWei = function () {
      return e.Message.getFieldWithDefault(this, 4, "");
    }, proto.webrpc.OpenChannelRequest.prototype.setPeerAmountWei = function (t) {
      e.Message.setProto3StringField(this, 4, t);
    }, proto.webrpc.OpenChannelResponse = function (t) {
      e.Message.initialize(this, t, 0, -1, null, null);
    }, t.inherits(proto.webrpc.OpenChannelResponse, e.Message), t.DEBUG && !COMPILED && (proto.webrpc.OpenChannelResponse.displayName = "proto.webrpc.OpenChannelResponse"), e.Message.GENERATE_TO_OBJECT && (proto.webrpc.OpenChannelResponse.prototype.toObject = function (e) {
      return proto.webrpc.OpenChannelResponse.toObject(e, this);
    }, proto.webrpc.OpenChannelResponse.toObject = function (t, r) {
      var o = {
        channelId: e.Message.getFieldWithDefault(r, 1, "")
      };
      return t && (o.$jspbMessageInstance = r), o;
    }), proto.webrpc.OpenChannelResponse.deserializeBinary = function (t) {
      var r = new e.BinaryReader(t),
          o = new proto.webrpc.OpenChannelResponse();
      return proto.webrpc.OpenChannelResponse.deserializeBinaryFromReader(o, r);
    }, proto.webrpc.OpenChannelResponse.deserializeBinaryFromReader = function (e, t) {
      for (; t.nextField() && !t.isEndGroup();) {
        switch (t.getFieldNumber()) {
          case 1:
            var r = t.readString();
            e.setChannelId(r);
            break;

          default:
            t.skipField();
        }
      }

      return e;
    }, proto.webrpc.OpenChannelResponse.prototype.serializeBinary = function () {
      var t = new e.BinaryWriter();
      return proto.webrpc.OpenChannelResponse.serializeBinaryToWriter(this, t), t.getResultBuffer();
    }, proto.webrpc.OpenChannelResponse.serializeBinaryToWriter = function (e, t) {
      var r;
      (r = e.getChannelId()).length > 0 && t.writeString(1, r);
    }, proto.webrpc.OpenChannelResponse.prototype.getChannelId = function () {
      return e.Message.getFieldWithDefault(this, 1, "");
    }, proto.webrpc.OpenChannelResponse.prototype.setChannelId = function (t) {
      e.Message.setProto3StringField(this, 1, t);
    }, proto.webrpc.DepositRequest = function (t) {
      e.Message.initialize(this, t, 0, -1, null, null);
    }, t.inherits(proto.webrpc.DepositRequest, e.Message), t.DEBUG && !COMPILED && (proto.webrpc.DepositRequest.displayName = "proto.webrpc.DepositRequest"), e.Message.GENERATE_TO_OBJECT && (proto.webrpc.DepositRequest.prototype.toObject = function (e) {
      return proto.webrpc.DepositRequest.toObject(e, this);
    }, proto.webrpc.DepositRequest.toObject = function (t, r) {
      var o = {
        tokenType: e.Message.getFieldWithDefault(r, 1, ""),
        tokenAddress: e.Message.getFieldWithDefault(r, 2, ""),
        amountWei: e.Message.getFieldWithDefault(r, 3, "")
      };
      return t && (o.$jspbMessageInstance = r), o;
    }), proto.webrpc.DepositRequest.deserializeBinary = function (t) {
      var r = new e.BinaryReader(t),
          o = new proto.webrpc.DepositRequest();
      return proto.webrpc.DepositRequest.deserializeBinaryFromReader(o, r);
    }, proto.webrpc.DepositRequest.deserializeBinaryFromReader = function (e, t) {
      for (; t.nextField() && !t.isEndGroup();) {
        switch (t.getFieldNumber()) {
          case 1:
            var r = t.readString();
            e.setTokenType(r);
            break;

          case 2:
            r = t.readString();
            e.setTokenAddress(r);
            break;

          case 3:
            r = t.readString();
            e.setAmountWei(r);
            break;

          default:
            t.skipField();
        }
      }

      return e;
    }, proto.webrpc.DepositRequest.prototype.serializeBinary = function () {
      var t = new e.BinaryWriter();
      return proto.webrpc.DepositRequest.serializeBinaryToWriter(this, t), t.getResultBuffer();
    }, proto.webrpc.DepositRequest.serializeBinaryToWriter = function (e, t) {
      var r = void 0;
      (r = e.getTokenType()).length > 0 && t.writeString(1, r), (r = e.getTokenAddress()).length > 0 && t.writeString(2, r), (r = e.getAmountWei()).length > 0 && t.writeString(3, r);
    }, proto.webrpc.DepositRequest.prototype.getTokenType = function () {
      return e.Message.getFieldWithDefault(this, 1, "");
    }, proto.webrpc.DepositRequest.prototype.setTokenType = function (t) {
      e.Message.setProto3StringField(this, 1, t);
    }, proto.webrpc.DepositRequest.prototype.getTokenAddress = function () {
      return e.Message.getFieldWithDefault(this, 2, "");
    }, proto.webrpc.DepositRequest.prototype.setTokenAddress = function (t) {
      e.Message.setProto3StringField(this, 2, t);
    }, proto.webrpc.DepositRequest.prototype.getAmountWei = function () {
      return e.Message.getFieldWithDefault(this, 3, "");
    }, proto.webrpc.DepositRequest.prototype.setAmountWei = function (t) {
      e.Message.setProto3StringField(this, 3, t);
    }, proto.webrpc.DepositResponse = function (t) {
      e.Message.initialize(this, t, 0, -1, null, null);
    }, t.inherits(proto.webrpc.DepositResponse, e.Message), t.DEBUG && !COMPILED && (proto.webrpc.DepositResponse.displayName = "proto.webrpc.DepositResponse"), e.Message.GENERATE_TO_OBJECT && (proto.webrpc.DepositResponse.prototype.toObject = function (e) {
      return proto.webrpc.DepositResponse.toObject(e, this);
    }, proto.webrpc.DepositResponse.toObject = function (t, r) {
      var o = {
        txHash: e.Message.getFieldWithDefault(r, 1, "")
      };
      return t && (o.$jspbMessageInstance = r), o;
    }), proto.webrpc.DepositResponse.deserializeBinary = function (t) {
      var r = new e.BinaryReader(t),
          o = new proto.webrpc.DepositResponse();
      return proto.webrpc.DepositResponse.deserializeBinaryFromReader(o, r);
    }, proto.webrpc.DepositResponse.deserializeBinaryFromReader = function (e, t) {
      for (; t.nextField() && !t.isEndGroup();) {
        switch (t.getFieldNumber()) {
          case 1:
            var r = t.readString();
            e.setTxHash(r);
            break;

          default:
            t.skipField();
        }
      }

      return e;
    }, proto.webrpc.DepositResponse.prototype.serializeBinary = function () {
      var t = new e.BinaryWriter();
      return proto.webrpc.DepositResponse.serializeBinaryToWriter(this, t), t.getResultBuffer();
    }, proto.webrpc.DepositResponse.serializeBinaryToWriter = function (e, t) {
      var r;
      (r = e.getTxHash()).length > 0 && t.writeString(1, r);
    }, proto.webrpc.DepositResponse.prototype.getTxHash = function () {
      return e.Message.getFieldWithDefault(this, 1, "");
    }, proto.webrpc.DepositResponse.prototype.setTxHash = function (t) {
      e.Message.setProto3StringField(this, 1, t);
    }, proto.webrpc.WithdrawRequest = function (t) {
      e.Message.initialize(this, t, 0, -1, null, null);
    }, t.inherits(proto.webrpc.WithdrawRequest, e.Message), t.DEBUG && !COMPILED && (proto.webrpc.WithdrawRequest.displayName = "proto.webrpc.WithdrawRequest"), e.Message.GENERATE_TO_OBJECT && (proto.webrpc.WithdrawRequest.prototype.toObject = function (e) {
      return proto.webrpc.WithdrawRequest.toObject(e, this);
    }, proto.webrpc.WithdrawRequest.toObject = function (t, r) {
      var o = {
        tokenType: e.Message.getFieldWithDefault(r, 1, ""),
        tokenAddress: e.Message.getFieldWithDefault(r, 2, ""),
        amountWei: e.Message.getFieldWithDefault(r, 3, "")
      };
      return t && (o.$jspbMessageInstance = r), o;
    }), proto.webrpc.WithdrawRequest.deserializeBinary = function (t) {
      var r = new e.BinaryReader(t),
          o = new proto.webrpc.WithdrawRequest();
      return proto.webrpc.WithdrawRequest.deserializeBinaryFromReader(o, r);
    }, proto.webrpc.WithdrawRequest.deserializeBinaryFromReader = function (e, t) {
      for (; t.nextField() && !t.isEndGroup();) {
        switch (t.getFieldNumber()) {
          case 1:
            var r = t.readString();
            e.setTokenType(r);
            break;

          case 2:
            r = t.readString();
            e.setTokenAddress(r);
            break;

          case 3:
            r = t.readString();
            e.setAmountWei(r);
            break;

          default:
            t.skipField();
        }
      }

      return e;
    }, proto.webrpc.WithdrawRequest.prototype.serializeBinary = function () {
      var t = new e.BinaryWriter();
      return proto.webrpc.WithdrawRequest.serializeBinaryToWriter(this, t), t.getResultBuffer();
    }, proto.webrpc.WithdrawRequest.serializeBinaryToWriter = function (e, t) {
      var r = void 0;
      (r = e.getTokenType()).length > 0 && t.writeString(1, r), (r = e.getTokenAddress()).length > 0 && t.writeString(2, r), (r = e.getAmountWei()).length > 0 && t.writeString(3, r);
    }, proto.webrpc.WithdrawRequest.prototype.getTokenType = function () {
      return e.Message.getFieldWithDefault(this, 1, "");
    }, proto.webrpc.WithdrawRequest.prototype.setTokenType = function (t) {
      e.Message.setProto3StringField(this, 1, t);
    }, proto.webrpc.WithdrawRequest.prototype.getTokenAddress = function () {
      return e.Message.getFieldWithDefault(this, 2, "");
    }, proto.webrpc.WithdrawRequest.prototype.setTokenAddress = function (t) {
      e.Message.setProto3StringField(this, 2, t);
    }, proto.webrpc.WithdrawRequest.prototype.getAmountWei = function () {
      return e.Message.getFieldWithDefault(this, 3, "");
    }, proto.webrpc.WithdrawRequest.prototype.setAmountWei = function (t) {
      e.Message.setProto3StringField(this, 3, t);
    }, proto.webrpc.WithdrawResponse = function (t) {
      e.Message.initialize(this, t, 0, -1, null, null);
    }, t.inherits(proto.webrpc.WithdrawResponse, e.Message), t.DEBUG && !COMPILED && (proto.webrpc.WithdrawResponse.displayName = "proto.webrpc.WithdrawResponse"), e.Message.GENERATE_TO_OBJECT && (proto.webrpc.WithdrawResponse.prototype.toObject = function (e) {
      return proto.webrpc.WithdrawResponse.toObject(e, this);
    }, proto.webrpc.WithdrawResponse.toObject = function (t, r) {
      var o = {
        txHash: e.Message.getFieldWithDefault(r, 1, "")
      };
      return t && (o.$jspbMessageInstance = r), o;
    }), proto.webrpc.WithdrawResponse.deserializeBinary = function (t) {
      var r = new e.BinaryReader(t),
          o = new proto.webrpc.WithdrawResponse();
      return proto.webrpc.WithdrawResponse.deserializeBinaryFromReader(o, r);
    }, proto.webrpc.WithdrawResponse.deserializeBinaryFromReader = function (e, t) {
      for (; t.nextField() && !t.isEndGroup();) {
        switch (t.getFieldNumber()) {
          case 1:
            var r = t.readString();
            e.setTxHash(r);
            break;

          default:
            t.skipField();
        }
      }

      return e;
    }, proto.webrpc.WithdrawResponse.prototype.serializeBinary = function () {
      var t = new e.BinaryWriter();
      return proto.webrpc.WithdrawResponse.serializeBinaryToWriter(this, t), t.getResultBuffer();
    }, proto.webrpc.WithdrawResponse.serializeBinaryToWriter = function (e, t) {
      var r;
      (r = e.getTxHash()).length > 0 && t.writeString(1, r);
    }, proto.webrpc.WithdrawResponse.prototype.getTxHash = function () {
      return e.Message.getFieldWithDefault(this, 1, "");
    }, proto.webrpc.WithdrawResponse.prototype.setTxHash = function (t) {
      e.Message.setProto3StringField(this, 1, t);
    }, proto.webrpc.GetBalanceRequest = function (t) {
      e.Message.initialize(this, t, 0, -1, null, null);
    }, t.inherits(proto.webrpc.GetBalanceRequest, e.Message), t.DEBUG && !COMPILED && (proto.webrpc.GetBalanceRequest.displayName = "proto.webrpc.GetBalanceRequest"), e.Message.GENERATE_TO_OBJECT && (proto.webrpc.GetBalanceRequest.prototype.toObject = function (e) {
      return proto.webrpc.GetBalanceRequest.toObject(e, this);
    }, proto.webrpc.GetBalanceRequest.toObject = function (t, r) {
      var o = {
        tokenType: e.Message.getFieldWithDefault(r, 1, ""),
        tokenAddress: e.Message.getFieldWithDefault(r, 2, "")
      };
      return t && (o.$jspbMessageInstance = r), o;
    }), proto.webrpc.GetBalanceRequest.deserializeBinary = function (t) {
      var r = new e.BinaryReader(t),
          o = new proto.webrpc.GetBalanceRequest();
      return proto.webrpc.GetBalanceRequest.deserializeBinaryFromReader(o, r);
    }, proto.webrpc.GetBalanceRequest.deserializeBinaryFromReader = function (e, t) {
      for (; t.nextField() && !t.isEndGroup();) {
        switch (t.getFieldNumber()) {
          case 1:
            var r = t.readString();
            e.setTokenType(r);
            break;

          case 2:
            r = t.readString();
            e.setTokenAddress(r);
            break;

          default:
            t.skipField();
        }
      }

      return e;
    }, proto.webrpc.GetBalanceRequest.prototype.serializeBinary = function () {
      var t = new e.BinaryWriter();
      return proto.webrpc.GetBalanceRequest.serializeBinaryToWriter(this, t), t.getResultBuffer();
    }, proto.webrpc.GetBalanceRequest.serializeBinaryToWriter = function (e, t) {
      var r = void 0;
      (r = e.getTokenType()).length > 0 && t.writeString(1, r), (r = e.getTokenAddress()).length > 0 && t.writeString(2, r);
    }, proto.webrpc.GetBalanceRequest.prototype.getTokenType = function () {
      return e.Message.getFieldWithDefault(this, 1, "");
    }, proto.webrpc.GetBalanceRequest.prototype.setTokenType = function (t) {
      e.Message.setProto3StringField(this, 1, t);
    }, proto.webrpc.GetBalanceRequest.prototype.getTokenAddress = function () {
      return e.Message.getFieldWithDefault(this, 2, "");
    }, proto.webrpc.GetBalanceRequest.prototype.setTokenAddress = function (t) {
      e.Message.setProto3StringField(this, 2, t);
    }, proto.webrpc.GetBalanceResponse = function (t) {
      e.Message.initialize(this, t, 0, -1, null, null);
    }, t.inherits(proto.webrpc.GetBalanceResponse, e.Message), t.DEBUG && !COMPILED && (proto.webrpc.GetBalanceResponse.displayName = "proto.webrpc.GetBalanceResponse"), e.Message.GENERATE_TO_OBJECT && (proto.webrpc.GetBalanceResponse.prototype.toObject = function (e) {
      return proto.webrpc.GetBalanceResponse.toObject(e, this);
    }, proto.webrpc.GetBalanceResponse.toObject = function (t, r) {
      var o = {
        freeBalance: e.Message.getFieldWithDefault(r, 1, ""),
        lockedBalance: e.Message.getFieldWithDefault(r, 2, ""),
        receivingCapacity: e.Message.getFieldWithDefault(r, 3, "")
      };
      return t && (o.$jspbMessageInstance = r), o;
    }), proto.webrpc.GetBalanceResponse.deserializeBinary = function (t) {
      var r = new e.BinaryReader(t),
          o = new proto.webrpc.GetBalanceResponse();
      return proto.webrpc.GetBalanceResponse.deserializeBinaryFromReader(o, r);
    }, proto.webrpc.GetBalanceResponse.deserializeBinaryFromReader = function (e, t) {
      for (; t.nextField() && !t.isEndGroup();) {
        switch (t.getFieldNumber()) {
          case 1:
            var r = t.readString();
            e.setFreeBalance(r);
            break;

          case 2:
            r = t.readString();
            e.setLockedBalance(r);
            break;

          case 3:
            r = t.readString();
            e.setReceivingCapacity(r);
            break;

          default:
            t.skipField();
        }
      }

      return e;
    }, proto.webrpc.GetBalanceResponse.prototype.serializeBinary = function () {
      var t = new e.BinaryWriter();
      return proto.webrpc.GetBalanceResponse.serializeBinaryToWriter(this, t), t.getResultBuffer();
    }, proto.webrpc.GetBalanceResponse.serializeBinaryToWriter = function (e, t) {
      var r = void 0;
      (r = e.getFreeBalance()).length > 0 && t.writeString(1, r), (r = e.getLockedBalance()).length > 0 && t.writeString(2, r), (r = e.getReceivingCapacity()).length > 0 && t.writeString(3, r);
    }, proto.webrpc.GetBalanceResponse.prototype.getFreeBalance = function () {
      return e.Message.getFieldWithDefault(this, 1, "");
    }, proto.webrpc.GetBalanceResponse.prototype.setFreeBalance = function (t) {
      e.Message.setProto3StringField(this, 1, t);
    }, proto.webrpc.GetBalanceResponse.prototype.getLockedBalance = function () {
      return e.Message.getFieldWithDefault(this, 2, "");
    }, proto.webrpc.GetBalanceResponse.prototype.setLockedBalance = function (t) {
      e.Message.setProto3StringField(this, 2, t);
    }, proto.webrpc.GetBalanceResponse.prototype.getReceivingCapacity = function () {
      return e.Message.getFieldWithDefault(this, 3, "");
    }, proto.webrpc.GetBalanceResponse.prototype.setReceivingCapacity = function (t) {
      e.Message.setProto3StringField(this, 3, t);
    }, proto.webrpc.Condition = function (t) {
      e.Message.initialize(this, t, 0, -1, null, null);
    }, t.inherits(proto.webrpc.Condition, e.Message), t.DEBUG && !COMPILED && (proto.webrpc.Condition.displayName = "proto.webrpc.Condition"), e.Message.GENERATE_TO_OBJECT && (proto.webrpc.Condition.prototype.toObject = function (e) {
      return proto.webrpc.Condition.toObject(e, this);
    }, proto.webrpc.Condition.toObject = function (t, r) {
      var o = {
        deadline: e.Message.getFieldWithDefault(r, 1, ""),
        sessionId: e.Message.getFieldWithDefault(r, 2, ""),
        argsForIsFinalized: r.getArgsForIsFinalized_asB64(),
        argsForQueryResult: r.getArgsForQueryResult_asB64(),
        onChainDeployed: e.Message.getFieldWithDefault(r, 5, !1)
      };
      return t && (o.$jspbMessageInstance = r), o;
    }), proto.webrpc.Condition.deserializeBinary = function (t) {
      var r = new e.BinaryReader(t),
          o = new proto.webrpc.Condition();
      return proto.webrpc.Condition.deserializeBinaryFromReader(o, r);
    }, proto.webrpc.Condition.deserializeBinaryFromReader = function (e, t) {
      for (; t.nextField() && !t.isEndGroup();) {
        switch (t.getFieldNumber()) {
          case 1:
            var r = t.readString();
            e.setDeadline(r);
            break;

          case 2:
            r = t.readString();
            e.setSessionId(r);
            break;

          case 3:
            r = t.readBytes();
            e.setArgsForIsFinalized(r);
            break;

          case 4:
            r = t.readBytes();
            e.setArgsForQueryResult(r);
            break;

          case 5:
            r = t.readBool();
            e.setOnChainDeployed(r);
            break;

          default:
            t.skipField();
        }
      }

      return e;
    }, proto.webrpc.Condition.prototype.serializeBinary = function () {
      var t = new e.BinaryWriter();
      return proto.webrpc.Condition.serializeBinaryToWriter(this, t), t.getResultBuffer();
    }, proto.webrpc.Condition.serializeBinaryToWriter = function (e, t) {
      var r = void 0;
      (r = e.getDeadline()).length > 0 && t.writeString(1, r), (r = e.getSessionId()).length > 0 && t.writeString(2, r), (r = e.getArgsForIsFinalized_asU8()).length > 0 && t.writeBytes(3, r), (r = e.getArgsForQueryResult_asU8()).length > 0 && t.writeBytes(4, r), (r = e.getOnChainDeployed()) && t.writeBool(5, r);
    }, proto.webrpc.Condition.prototype.getDeadline = function () {
      return e.Message.getFieldWithDefault(this, 1, "");
    }, proto.webrpc.Condition.prototype.setDeadline = function (t) {
      e.Message.setProto3StringField(this, 1, t);
    }, proto.webrpc.Condition.prototype.getSessionId = function () {
      return e.Message.getFieldWithDefault(this, 2, "");
    }, proto.webrpc.Condition.prototype.setSessionId = function (t) {
      e.Message.setProto3StringField(this, 2, t);
    }, proto.webrpc.Condition.prototype.getArgsForIsFinalized = function () {
      return e.Message.getFieldWithDefault(this, 3, "");
    }, proto.webrpc.Condition.prototype.getArgsForIsFinalized_asB64 = function () {
      return e.Message.bytesAsB64(this.getArgsForIsFinalized());
    }, proto.webrpc.Condition.prototype.getArgsForIsFinalized_asU8 = function () {
      return e.Message.bytesAsU8(this.getArgsForIsFinalized());
    }, proto.webrpc.Condition.prototype.setArgsForIsFinalized = function (t) {
      e.Message.setProto3BytesField(this, 3, t);
    }, proto.webrpc.Condition.prototype.getArgsForQueryResult = function () {
      return e.Message.getFieldWithDefault(this, 4, "");
    }, proto.webrpc.Condition.prototype.getArgsForQueryResult_asB64 = function () {
      return e.Message.bytesAsB64(this.getArgsForQueryResult());
    }, proto.webrpc.Condition.prototype.getArgsForQueryResult_asU8 = function () {
      return e.Message.bytesAsU8(this.getArgsForQueryResult());
    }, proto.webrpc.Condition.prototype.setArgsForQueryResult = function (t) {
      e.Message.setProto3BytesField(this, 4, t);
    }, proto.webrpc.Condition.prototype.getOnChainDeployed = function () {
      return e.Message.getFieldWithDefault(this, 5, !1);
    }, proto.webrpc.Condition.prototype.setOnChainDeployed = function (t) {
      e.Message.setProto3BooleanField(this, 5, t);
    }, proto.webrpc.SendConditionalPaymentRequest = function (t) {
      e.Message.initialize(this, t, 0, -1, null, null);
    }, t.inherits(proto.webrpc.SendConditionalPaymentRequest, e.Message), t.DEBUG && !COMPILED && (proto.webrpc.SendConditionalPaymentRequest.displayName = "proto.webrpc.SendConditionalPaymentRequest"), e.Message.GENERATE_TO_OBJECT && (proto.webrpc.SendConditionalPaymentRequest.prototype.toObject = function (e) {
      return proto.webrpc.SendConditionalPaymentRequest.toObject(e, this);
    }, proto.webrpc.SendConditionalPaymentRequest.toObject = function (t, r) {
      var o,
          s = {
        tokenType: e.Message.getFieldWithDefault(r, 1, ""),
        tokenAddress: e.Message.getFieldWithDefault(r, 2, ""),
        amountWei: e.Message.getFieldWithDefault(r, 3, ""),
        destination: e.Message.getFieldWithDefault(r, 4, ""),
        condition: (o = r.getCondition()) && proto.webrpc.Condition.toObject(t, o)
      };
      return t && (s.$jspbMessageInstance = r), s;
    }), proto.webrpc.SendConditionalPaymentRequest.deserializeBinary = function (t) {
      var r = new e.BinaryReader(t),
          o = new proto.webrpc.SendConditionalPaymentRequest();
      return proto.webrpc.SendConditionalPaymentRequest.deserializeBinaryFromReader(o, r);
    }, proto.webrpc.SendConditionalPaymentRequest.deserializeBinaryFromReader = function (e, t) {
      for (; t.nextField() && !t.isEndGroup();) {
        switch (t.getFieldNumber()) {
          case 1:
            var r = t.readString();
            e.setTokenType(r);
            break;

          case 2:
            r = t.readString();
            e.setTokenAddress(r);
            break;

          case 3:
            r = t.readString();
            e.setAmountWei(r);
            break;

          case 4:
            r = t.readString();
            e.setDestination(r);
            break;

          case 5:
            r = new proto.webrpc.Condition();
            t.readMessage(r, proto.webrpc.Condition.deserializeBinaryFromReader), e.setCondition(r);
            break;

          default:
            t.skipField();
        }
      }

      return e;
    }, proto.webrpc.SendConditionalPaymentRequest.prototype.serializeBinary = function () {
      var t = new e.BinaryWriter();
      return proto.webrpc.SendConditionalPaymentRequest.serializeBinaryToWriter(this, t), t.getResultBuffer();
    }, proto.webrpc.SendConditionalPaymentRequest.serializeBinaryToWriter = function (e, t) {
      var r = void 0;
      (r = e.getTokenType()).length > 0 && t.writeString(1, r), (r = e.getTokenAddress()).length > 0 && t.writeString(2, r), (r = e.getAmountWei()).length > 0 && t.writeString(3, r), (r = e.getDestination()).length > 0 && t.writeString(4, r), null != (r = e.getCondition()) && t.writeMessage(5, r, proto.webrpc.Condition.serializeBinaryToWriter);
    }, proto.webrpc.SendConditionalPaymentRequest.prototype.getTokenType = function () {
      return e.Message.getFieldWithDefault(this, 1, "");
    }, proto.webrpc.SendConditionalPaymentRequest.prototype.setTokenType = function (t) {
      e.Message.setProto3StringField(this, 1, t);
    }, proto.webrpc.SendConditionalPaymentRequest.prototype.getTokenAddress = function () {
      return e.Message.getFieldWithDefault(this, 2, "");
    }, proto.webrpc.SendConditionalPaymentRequest.prototype.setTokenAddress = function (t) {
      e.Message.setProto3StringField(this, 2, t);
    }, proto.webrpc.SendConditionalPaymentRequest.prototype.getAmountWei = function () {
      return e.Message.getFieldWithDefault(this, 3, "");
    }, proto.webrpc.SendConditionalPaymentRequest.prototype.setAmountWei = function (t) {
      e.Message.setProto3StringField(this, 3, t);
    }, proto.webrpc.SendConditionalPaymentRequest.prototype.getDestination = function () {
      return e.Message.getFieldWithDefault(this, 4, "");
    }, proto.webrpc.SendConditionalPaymentRequest.prototype.setDestination = function (t) {
      e.Message.setProto3StringField(this, 4, t);
    }, proto.webrpc.SendConditionalPaymentRequest.prototype.getCondition = function () {
      return e.Message.getWrapperField(this, proto.webrpc.Condition, 5);
    }, proto.webrpc.SendConditionalPaymentRequest.prototype.setCondition = function (t) {
      e.Message.setWrapperField(this, 5, t);
    }, proto.webrpc.SendConditionalPaymentRequest.prototype.clearCondition = function () {
      this.setCondition(void 0);
    }, proto.webrpc.SendConditionalPaymentRequest.prototype.hasCondition = function () {
      return null != e.Message.getField(this, 5);
    }, proto.webrpc.SendConditionalPaymentResponse = function (t) {
      e.Message.initialize(this, t, 0, -1, null, null);
    }, t.inherits(proto.webrpc.SendConditionalPaymentResponse, e.Message), t.DEBUG && !COMPILED && (proto.webrpc.SendConditionalPaymentResponse.displayName = "proto.webrpc.SendConditionalPaymentResponse"), e.Message.GENERATE_TO_OBJECT && (proto.webrpc.SendConditionalPaymentResponse.prototype.toObject = function (e) {
      return proto.webrpc.SendConditionalPaymentResponse.toObject(e, this);
    }, proto.webrpc.SendConditionalPaymentResponse.toObject = function (t, r) {
      var o = {
        paymentId: e.Message.getFieldWithDefault(r, 1, "")
      };
      return t && (o.$jspbMessageInstance = r), o;
    }), proto.webrpc.SendConditionalPaymentResponse.deserializeBinary = function (t) {
      var r = new e.BinaryReader(t),
          o = new proto.webrpc.SendConditionalPaymentResponse();
      return proto.webrpc.SendConditionalPaymentResponse.deserializeBinaryFromReader(o, r);
    }, proto.webrpc.SendConditionalPaymentResponse.deserializeBinaryFromReader = function (e, t) {
      for (; t.nextField() && !t.isEndGroup();) {
        switch (t.getFieldNumber()) {
          case 1:
            var r = t.readString();
            e.setPaymentId(r);
            break;

          default:
            t.skipField();
        }
      }

      return e;
    }, proto.webrpc.SendConditionalPaymentResponse.prototype.serializeBinary = function () {
      var t = new e.BinaryWriter();
      return proto.webrpc.SendConditionalPaymentResponse.serializeBinaryToWriter(this, t), t.getResultBuffer();
    }, proto.webrpc.SendConditionalPaymentResponse.serializeBinaryToWriter = function (e, t) {
      var r;
      (r = e.getPaymentId()).length > 0 && t.writeString(1, r);
    }, proto.webrpc.SendConditionalPaymentResponse.prototype.getPaymentId = function () {
      return e.Message.getFieldWithDefault(this, 1, "");
    }, proto.webrpc.SendConditionalPaymentResponse.prototype.setPaymentId = function (t) {
      e.Message.setProto3StringField(this, 1, t);
    }, proto.webrpc.CreateAppSessionRequest = function (t) {
      e.Message.initialize(this, t, 0, -1, null, null);
    }, t.inherits(proto.webrpc.CreateAppSessionRequest, e.Message), t.DEBUG && !COMPILED && (proto.webrpc.CreateAppSessionRequest.displayName = "proto.webrpc.CreateAppSessionRequest"), e.Message.GENERATE_TO_OBJECT && (proto.webrpc.CreateAppSessionRequest.prototype.toObject = function (e) {
      return proto.webrpc.CreateAppSessionRequest.toObject(e, this);
    }, proto.webrpc.CreateAppSessionRequest.toObject = function (t, r) {
      var o = {
        bin: e.Message.getFieldWithDefault(r, 1, ""),
        abi: e.Message.getFieldWithDefault(r, 2, ""),
        constructor: e.Message.getFieldWithDefault(r, 3, ""),
        nonce: e.Message.getFieldWithDefault(r, 4, "")
      };
      return t && (o.$jspbMessageInstance = r), o;
    }), proto.webrpc.CreateAppSessionRequest.deserializeBinary = function (t) {
      var r = new e.BinaryReader(t),
          o = new proto.webrpc.CreateAppSessionRequest();
      return proto.webrpc.CreateAppSessionRequest.deserializeBinaryFromReader(o, r);
    }, proto.webrpc.CreateAppSessionRequest.deserializeBinaryFromReader = function (e, t) {
      for (; t.nextField() && !t.isEndGroup();) {
        switch (t.getFieldNumber()) {
          case 1:
            var r = t.readString();
            e.setBin(r);
            break;

          case 2:
            r = t.readString();
            e.setAbi(r);
            break;

          case 3:
            r = t.readString();
            e.setConstructor(r);
            break;

          case 4:
            r = t.readString();
            e.setNonce(r);
            break;

          default:
            t.skipField();
        }
      }

      return e;
    }, proto.webrpc.CreateAppSessionRequest.prototype.serializeBinary = function () {
      var t = new e.BinaryWriter();
      return proto.webrpc.CreateAppSessionRequest.serializeBinaryToWriter(this, t), t.getResultBuffer();
    }, proto.webrpc.CreateAppSessionRequest.serializeBinaryToWriter = function (e, t) {
      var r = void 0;
      (r = e.getBin()).length > 0 && t.writeString(1, r), (r = e.getAbi()).length > 0 && t.writeString(2, r), (r = e.getConstructor()).length > 0 && t.writeString(3, r), (r = e.getNonce()).length > 0 && t.writeString(4, r);
    }, proto.webrpc.CreateAppSessionRequest.prototype.getBin = function () {
      return e.Message.getFieldWithDefault(this, 1, "");
    }, proto.webrpc.CreateAppSessionRequest.prototype.setBin = function (t) {
      e.Message.setProto3StringField(this, 1, t);
    }, proto.webrpc.CreateAppSessionRequest.prototype.getAbi = function () {
      return e.Message.getFieldWithDefault(this, 2, "");
    }, proto.webrpc.CreateAppSessionRequest.prototype.setAbi = function (t) {
      e.Message.setProto3StringField(this, 2, t);
    }, proto.webrpc.CreateAppSessionRequest.prototype.getConstructor = function () {
      return e.Message.getFieldWithDefault(this, 3, "");
    }, proto.webrpc.CreateAppSessionRequest.prototype.setConstructor = function (t) {
      e.Message.setProto3StringField(this, 3, t);
    }, proto.webrpc.CreateAppSessionRequest.prototype.getNonce = function () {
      return e.Message.getFieldWithDefault(this, 4, "");
    }, proto.webrpc.CreateAppSessionRequest.prototype.setNonce = function (t) {
      e.Message.setProto3StringField(this, 4, t);
    }, proto.webrpc.CreateAppSessionResponse = function (t) {
      e.Message.initialize(this, t, 0, -1, null, null);
    }, t.inherits(proto.webrpc.CreateAppSessionResponse, e.Message), t.DEBUG && !COMPILED && (proto.webrpc.CreateAppSessionResponse.displayName = "proto.webrpc.CreateAppSessionResponse"), e.Message.GENERATE_TO_OBJECT && (proto.webrpc.CreateAppSessionResponse.prototype.toObject = function (e) {
      return proto.webrpc.CreateAppSessionResponse.toObject(e, this);
    }, proto.webrpc.CreateAppSessionResponse.toObject = function (t, r) {
      var o = {
        sessionId: e.Message.getFieldWithDefault(r, 1, "")
      };
      return t && (o.$jspbMessageInstance = r), o;
    }), proto.webrpc.CreateAppSessionResponse.deserializeBinary = function (t) {
      var r = new e.BinaryReader(t),
          o = new proto.webrpc.CreateAppSessionResponse();
      return proto.webrpc.CreateAppSessionResponse.deserializeBinaryFromReader(o, r);
    }, proto.webrpc.CreateAppSessionResponse.deserializeBinaryFromReader = function (e, t) {
      for (; t.nextField() && !t.isEndGroup();) {
        switch (t.getFieldNumber()) {
          case 1:
            var r = t.readString();
            e.setSessionId(r);
            break;

          default:
            t.skipField();
        }
      }

      return e;
    }, proto.webrpc.CreateAppSessionResponse.prototype.serializeBinary = function () {
      var t = new e.BinaryWriter();
      return proto.webrpc.CreateAppSessionResponse.serializeBinaryToWriter(this, t), t.getResultBuffer();
    }, proto.webrpc.CreateAppSessionResponse.serializeBinaryToWriter = function (e, t) {
      var r;
      (r = e.getSessionId()).length > 0 && t.writeString(1, r);
    }, proto.webrpc.CreateAppSessionResponse.prototype.getSessionId = function () {
      return e.Message.getFieldWithDefault(this, 1, "");
    }, proto.webrpc.CreateAppSessionResponse.prototype.setSessionId = function (t) {
      e.Message.setProto3StringField(this, 1, t);
    }, proto.webrpc.StateMessage = function (t) {
      e.Message.initialize(this, t, 0, -1, null, null);
    }, t.inherits(proto.webrpc.StateMessage, e.Message), t.DEBUG && !COMPILED && (proto.webrpc.StateMessage.displayName = "proto.webrpc.StateMessage"), e.Message.GENERATE_TO_OBJECT && (proto.webrpc.StateMessage.prototype.toObject = function (e) {
      return proto.webrpc.StateMessage.toObject(e, this);
    }, proto.webrpc.StateMessage.toObject = function (t, r) {
      var o = {
        sessionId: e.Message.getFieldWithDefault(r, 1, ""),
        seq: e.Message.getFieldWithDefault(r, 2, ""),
        state: r.getState_asB64()
      };
      return t && (o.$jspbMessageInstance = r), o;
    }), proto.webrpc.StateMessage.deserializeBinary = function (t) {
      var r = new e.BinaryReader(t),
          o = new proto.webrpc.StateMessage();
      return proto.webrpc.StateMessage.deserializeBinaryFromReader(o, r);
    }, proto.webrpc.StateMessage.deserializeBinaryFromReader = function (e, t) {
      for (; t.nextField() && !t.isEndGroup();) {
        switch (t.getFieldNumber()) {
          case 1:
            var r = t.readString();
            e.setSessionId(r);
            break;

          case 2:
            r = t.readString();
            e.setSeq(r);
            break;

          case 3:
            r = t.readBytes();
            e.setState(r);
            break;

          default:
            t.skipField();
        }
      }

      return e;
    }, proto.webrpc.StateMessage.prototype.serializeBinary = function () {
      var t = new e.BinaryWriter();
      return proto.webrpc.StateMessage.serializeBinaryToWriter(this, t), t.getResultBuffer();
    }, proto.webrpc.StateMessage.serializeBinaryToWriter = function (e, t) {
      var r = void 0;
      (r = e.getSessionId()).length > 0 && t.writeString(1, r), (r = e.getSeq()).length > 0 && t.writeString(2, r), (r = e.getState_asU8()).length > 0 && t.writeBytes(3, r);
    }, proto.webrpc.StateMessage.prototype.getSessionId = function () {
      return e.Message.getFieldWithDefault(this, 1, "");
    }, proto.webrpc.StateMessage.prototype.setSessionId = function (t) {
      e.Message.setProto3StringField(this, 1, t);
    }, proto.webrpc.StateMessage.prototype.getSeq = function () {
      return e.Message.getFieldWithDefault(this, 2, "");
    }, proto.webrpc.StateMessage.prototype.setSeq = function (t) {
      e.Message.setProto3StringField(this, 2, t);
    }, proto.webrpc.StateMessage.prototype.getState = function () {
      return e.Message.getFieldWithDefault(this, 3, "");
    }, proto.webrpc.StateMessage.prototype.getState_asB64 = function () {
      return e.Message.bytesAsB64(this.getState());
    }, proto.webrpc.StateMessage.prototype.getState_asU8 = function () {
      return e.Message.bytesAsU8(this.getState());
    }, proto.webrpc.StateMessage.prototype.setState = function (t) {
      e.Message.setProto3BytesField(this, 3, t);
    }, proto.webrpc.SendStateRequest = function (t) {
      e.Message.initialize(this, t, 0, -1, null, null);
    }, t.inherits(proto.webrpc.SendStateRequest, e.Message), t.DEBUG && !COMPILED && (proto.webrpc.SendStateRequest.displayName = "proto.webrpc.SendStateRequest"), e.Message.GENERATE_TO_OBJECT && (proto.webrpc.SendStateRequest.prototype.toObject = function (e) {
      return proto.webrpc.SendStateRequest.toObject(e, this);
    }, proto.webrpc.SendStateRequest.toObject = function (t, r) {
      var o = {
        sessionId: e.Message.getFieldWithDefault(r, 1, ""),
        destination: e.Message.getFieldWithDefault(r, 2, ""),
        state: r.getState_asB64()
      };
      return t && (o.$jspbMessageInstance = r), o;
    }), proto.webrpc.SendStateRequest.deserializeBinary = function (t) {
      var r = new e.BinaryReader(t),
          o = new proto.webrpc.SendStateRequest();
      return proto.webrpc.SendStateRequest.deserializeBinaryFromReader(o, r);
    }, proto.webrpc.SendStateRequest.deserializeBinaryFromReader = function (e, t) {
      for (; t.nextField() && !t.isEndGroup();) {
        switch (t.getFieldNumber()) {
          case 1:
            var r = t.readString();
            e.setSessionId(r);
            break;

          case 2:
            r = t.readString();
            e.setDestination(r);
            break;

          case 3:
            r = t.readBytes();
            e.setState(r);
            break;

          default:
            t.skipField();
        }
      }

      return e;
    }, proto.webrpc.SendStateRequest.prototype.serializeBinary = function () {
      var t = new e.BinaryWriter();
      return proto.webrpc.SendStateRequest.serializeBinaryToWriter(this, t), t.getResultBuffer();
    }, proto.webrpc.SendStateRequest.serializeBinaryToWriter = function (e, t) {
      var r = void 0;
      (r = e.getSessionId()).length > 0 && t.writeString(1, r), (r = e.getDestination()).length > 0 && t.writeString(2, r), (r = e.getState_asU8()).length > 0 && t.writeBytes(3, r);
    }, proto.webrpc.SendStateRequest.prototype.getSessionId = function () {
      return e.Message.getFieldWithDefault(this, 1, "");
    }, proto.webrpc.SendStateRequest.prototype.setSessionId = function (t) {
      e.Message.setProto3StringField(this, 1, t);
    }, proto.webrpc.SendStateRequest.prototype.getDestination = function () {
      return e.Message.getFieldWithDefault(this, 2, "");
    }, proto.webrpc.SendStateRequest.prototype.setDestination = function (t) {
      e.Message.setProto3StringField(this, 2, t);
    }, proto.webrpc.SendStateRequest.prototype.getState = function () {
      return e.Message.getFieldWithDefault(this, 3, "");
    }, proto.webrpc.SendStateRequest.prototype.getState_asB64 = function () {
      return e.Message.bytesAsB64(this.getState());
    }, proto.webrpc.SendStateRequest.prototype.getState_asU8 = function () {
      return e.Message.bytesAsU8(this.getState());
    }, proto.webrpc.SendStateRequest.prototype.setState = function (t) {
      e.Message.setProto3BytesField(this, 3, t);
    }, proto.webrpc.AckStateRequest = function (t) {
      e.Message.initialize(this, t, 0, -1, null, null);
    }, t.inherits(proto.webrpc.AckStateRequest, e.Message), t.DEBUG && !COMPILED && (proto.webrpc.AckStateRequest.displayName = "proto.webrpc.AckStateRequest"), e.Message.GENERATE_TO_OBJECT && (proto.webrpc.AckStateRequest.prototype.toObject = function (e) {
      return proto.webrpc.AckStateRequest.toObject(e, this);
    }, proto.webrpc.AckStateRequest.toObject = function (t, r) {
      var o = {
        sessionId: e.Message.getFieldWithDefault(r, 1, ""),
        seq: e.Message.getFieldWithDefault(r, 2, "")
      };
      return t && (o.$jspbMessageInstance = r), o;
    }), proto.webrpc.AckStateRequest.deserializeBinary = function (t) {
      var r = new e.BinaryReader(t),
          o = new proto.webrpc.AckStateRequest();
      return proto.webrpc.AckStateRequest.deserializeBinaryFromReader(o, r);
    }, proto.webrpc.AckStateRequest.deserializeBinaryFromReader = function (e, t) {
      for (; t.nextField() && !t.isEndGroup();) {
        switch (t.getFieldNumber()) {
          case 1:
            var r = t.readString();
            e.setSessionId(r);
            break;

          case 2:
            r = t.readString();
            e.setSeq(r);
            break;

          default:
            t.skipField();
        }
      }

      return e;
    }, proto.webrpc.AckStateRequest.prototype.serializeBinary = function () {
      var t = new e.BinaryWriter();
      return proto.webrpc.AckStateRequest.serializeBinaryToWriter(this, t), t.getResultBuffer();
    }, proto.webrpc.AckStateRequest.serializeBinaryToWriter = function (e, t) {
      var r = void 0;
      (r = e.getSessionId()).length > 0 && t.writeString(1, r), (r = e.getSeq()).length > 0 && t.writeString(2, r);
    }, proto.webrpc.AckStateRequest.prototype.getSessionId = function () {
      return e.Message.getFieldWithDefault(this, 1, "");
    }, proto.webrpc.AckStateRequest.prototype.setSessionId = function (t) {
      e.Message.setProto3StringField(this, 1, t);
    }, proto.webrpc.AckStateRequest.prototype.getSeq = function () {
      return e.Message.getFieldWithDefault(this, 2, "");
    }, proto.webrpc.AckStateRequest.prototype.setSeq = function (t) {
      e.Message.setProto3StringField(this, 2, t);
    }, proto.webrpc.ReceiveStatesRequest = function (t) {
      e.Message.initialize(this, t, 0, -1, null, null);
    }, t.inherits(proto.webrpc.ReceiveStatesRequest, e.Message), t.DEBUG && !COMPILED && (proto.webrpc.ReceiveStatesRequest.displayName = "proto.webrpc.ReceiveStatesRequest"), e.Message.GENERATE_TO_OBJECT && (proto.webrpc.ReceiveStatesRequest.prototype.toObject = function (e) {
      return proto.webrpc.ReceiveStatesRequest.toObject(e, this);
    }, proto.webrpc.ReceiveStatesRequest.toObject = function (t, r) {
      var o = {
        sessionId: e.Message.getFieldWithDefault(r, 1, "")
      };
      return t && (o.$jspbMessageInstance = r), o;
    }), proto.webrpc.ReceiveStatesRequest.deserializeBinary = function (t) {
      var r = new e.BinaryReader(t),
          o = new proto.webrpc.ReceiveStatesRequest();
      return proto.webrpc.ReceiveStatesRequest.deserializeBinaryFromReader(o, r);
    }, proto.webrpc.ReceiveStatesRequest.deserializeBinaryFromReader = function (e, t) {
      for (; t.nextField() && !t.isEndGroup();) {
        switch (t.getFieldNumber()) {
          case 1:
            var r = t.readString();
            e.setSessionId(r);
            break;

          default:
            t.skipField();
        }
      }

      return e;
    }, proto.webrpc.ReceiveStatesRequest.prototype.serializeBinary = function () {
      var t = new e.BinaryWriter();
      return proto.webrpc.ReceiveStatesRequest.serializeBinaryToWriter(this, t), t.getResultBuffer();
    }, proto.webrpc.ReceiveStatesRequest.serializeBinaryToWriter = function (e, t) {
      var r;
      (r = e.getSessionId()).length > 0 && t.writeString(1, r);
    }, proto.webrpc.ReceiveStatesRequest.prototype.getSessionId = function () {
      return e.Message.getFieldWithDefault(this, 1, "");
    }, proto.webrpc.ReceiveStatesRequest.prototype.setSessionId = function (t) {
      e.Message.setProto3StringField(this, 1, t);
    }, proto.webrpc.SettleAppSessionRequest = function (t) {
      e.Message.initialize(this, t, 0, -1, null, null);
    }, t.inherits(proto.webrpc.SettleAppSessionRequest, e.Message), t.DEBUG && !COMPILED && (proto.webrpc.SettleAppSessionRequest.displayName = "proto.webrpc.SettleAppSessionRequest"), e.Message.GENERATE_TO_OBJECT && (proto.webrpc.SettleAppSessionRequest.prototype.toObject = function (e) {
      return proto.webrpc.SettleAppSessionRequest.toObject(e, this);
    }, proto.webrpc.SettleAppSessionRequest.toObject = function (t, r) {
      var o = {
        sessionId: e.Message.getFieldWithDefault(r, 1, "")
      };
      return t && (o.$jspbMessageInstance = r), o;
    }), proto.webrpc.SettleAppSessionRequest.deserializeBinary = function (t) {
      var r = new e.BinaryReader(t),
          o = new proto.webrpc.SettleAppSessionRequest();
      return proto.webrpc.SettleAppSessionRequest.deserializeBinaryFromReader(o, r);
    }, proto.webrpc.SettleAppSessionRequest.deserializeBinaryFromReader = function (e, t) {
      for (; t.nextField() && !t.isEndGroup();) {
        switch (t.getFieldNumber()) {
          case 1:
            var r = t.readString();
            e.setSessionId(r);
            break;

          default:
            t.skipField();
        }
      }

      return e;
    }, proto.webrpc.SettleAppSessionRequest.prototype.serializeBinary = function () {
      var t = new e.BinaryWriter();
      return proto.webrpc.SettleAppSessionRequest.serializeBinaryToWriter(this, t), t.getResultBuffer();
    }, proto.webrpc.SettleAppSessionRequest.serializeBinaryToWriter = function (e, t) {
      var r;
      (r = e.getSessionId()).length > 0 && t.writeString(1, r);
    }, proto.webrpc.SettleAppSessionRequest.prototype.getSessionId = function () {
      return e.Message.getFieldWithDefault(this, 1, "");
    }, proto.webrpc.SettleAppSessionRequest.prototype.setSessionId = function (t) {
      e.Message.setProto3StringField(this, 1, t);
    }, proto.webrpc.SettleAppSessionResponse = function (t) {
      e.Message.initialize(this, t, 0, -1, null, null);
    }, t.inherits(proto.webrpc.SettleAppSessionResponse, e.Message), t.DEBUG && !COMPILED && (proto.webrpc.SettleAppSessionResponse.displayName = "proto.webrpc.SettleAppSessionResponse"), e.Message.GENERATE_TO_OBJECT && (proto.webrpc.SettleAppSessionResponse.prototype.toObject = function (e) {
      return proto.webrpc.SettleAppSessionResponse.toObject(e, this);
    }, proto.webrpc.SettleAppSessionResponse.toObject = function (t, r) {
      var o = {
        contractAddress: e.Message.getFieldWithDefault(r, 1, "")
      };
      return t && (o.$jspbMessageInstance = r), o;
    }), proto.webrpc.SettleAppSessionResponse.deserializeBinary = function (t) {
      var r = new e.BinaryReader(t),
          o = new proto.webrpc.SettleAppSessionResponse();
      return proto.webrpc.SettleAppSessionResponse.deserializeBinaryFromReader(o, r);
    }, proto.webrpc.SettleAppSessionResponse.deserializeBinaryFromReader = function (e, t) {
      for (; t.nextField() && !t.isEndGroup();) {
        switch (t.getFieldNumber()) {
          case 1:
            var r = t.readString();
            e.setContractAddress(r);
            break;

          default:
            t.skipField();
        }
      }

      return e;
    }, proto.webrpc.SettleAppSessionResponse.prototype.serializeBinary = function () {
      var t = new e.BinaryWriter();
      return proto.webrpc.SettleAppSessionResponse.serializeBinaryToWriter(this, t), t.getResultBuffer();
    }, proto.webrpc.SettleAppSessionResponse.serializeBinaryToWriter = function (e, t) {
      var r;
      (r = e.getContractAddress()).length > 0 && t.writeString(1, r);
    }, proto.webrpc.SettleAppSessionResponse.prototype.getContractAddress = function () {
      return e.Message.getFieldWithDefault(this, 1, "");
    }, proto.webrpc.SettleAppSessionResponse.prototype.setContractAddress = function (t) {
      e.Message.setProto3StringField(this, 1, t);
    }, proto.webrpc.EndAppSessionRequest = function (t) {
      e.Message.initialize(this, t, 0, -1, null, null);
    }, t.inherits(proto.webrpc.EndAppSessionRequest, e.Message), t.DEBUG && !COMPILED && (proto.webrpc.EndAppSessionRequest.displayName = "proto.webrpc.EndAppSessionRequest"), e.Message.GENERATE_TO_OBJECT && (proto.webrpc.EndAppSessionRequest.prototype.toObject = function (e) {
      return proto.webrpc.EndAppSessionRequest.toObject(e, this);
    }, proto.webrpc.EndAppSessionRequest.toObject = function (t, r) {
      var o = {
        sessionId: e.Message.getFieldWithDefault(r, 1, ""),
        tokenType: e.Message.getFieldWithDefault(r, 2, ""),
        tokenAddress: e.Message.getFieldWithDefault(r, 3, ""),
        winnerIndex: e.Message.getFieldWithDefault(r, 4, "")
      };
      return t && (o.$jspbMessageInstance = r), o;
    }), proto.webrpc.EndAppSessionRequest.deserializeBinary = function (t) {
      var r = new e.BinaryReader(t),
          o = new proto.webrpc.EndAppSessionRequest();
      return proto.webrpc.EndAppSessionRequest.deserializeBinaryFromReader(o, r);
    }, proto.webrpc.EndAppSessionRequest.deserializeBinaryFromReader = function (e, t) {
      for (; t.nextField() && !t.isEndGroup();) {
        switch (t.getFieldNumber()) {
          case 1:
            var r = t.readString();
            e.setSessionId(r);
            break;

          case 2:
            r = t.readString();
            e.setTokenType(r);
            break;

          case 3:
            r = t.readString();
            e.setTokenAddress(r);
            break;

          case 4:
            r = t.readString();
            e.setWinnerIndex(r);
            break;

          default:
            t.skipField();
        }
      }

      return e;
    }, proto.webrpc.EndAppSessionRequest.prototype.serializeBinary = function () {
      var t = new e.BinaryWriter();
      return proto.webrpc.EndAppSessionRequest.serializeBinaryToWriter(this, t), t.getResultBuffer();
    }, proto.webrpc.EndAppSessionRequest.serializeBinaryToWriter = function (e, t) {
      var r = void 0;
      (r = e.getSessionId()).length > 0 && t.writeString(1, r), (r = e.getTokenType()).length > 0 && t.writeString(2, r), (r = e.getTokenAddress()).length > 0 && t.writeString(3, r), (r = e.getWinnerIndex()).length > 0 && t.writeString(4, r);
    }, proto.webrpc.EndAppSessionRequest.prototype.getSessionId = function () {
      return e.Message.getFieldWithDefault(this, 1, "");
    }, proto.webrpc.EndAppSessionRequest.prototype.setSessionId = function (t) {
      e.Message.setProto3StringField(this, 1, t);
    }, proto.webrpc.EndAppSessionRequest.prototype.getTokenType = function () {
      return e.Message.getFieldWithDefault(this, 2, "");
    }, proto.webrpc.EndAppSessionRequest.prototype.setTokenType = function (t) {
      e.Message.setProto3StringField(this, 2, t);
    }, proto.webrpc.EndAppSessionRequest.prototype.getTokenAddress = function () {
      return e.Message.getFieldWithDefault(this, 3, "");
    }, proto.webrpc.EndAppSessionRequest.prototype.setTokenAddress = function (t) {
      e.Message.setProto3StringField(this, 3, t);
    }, proto.webrpc.EndAppSessionRequest.prototype.getWinnerIndex = function () {
      return e.Message.getFieldWithDefault(this, 4, "");
    }, proto.webrpc.EndAppSessionRequest.prototype.setWinnerIndex = function (t) {
      e.Message.setProto3StringField(this, 4, t);
    }, proto.webrpc.RegisterOracleRequest = function (t) {
      e.Message.initialize(this, t, 0, -1, null, null);
    }, t.inherits(proto.webrpc.RegisterOracleRequest, e.Message), t.DEBUG && !COMPILED && (proto.webrpc.RegisterOracleRequest.displayName = "proto.webrpc.RegisterOracleRequest"), e.Message.GENERATE_TO_OBJECT && (proto.webrpc.RegisterOracleRequest.prototype.toObject = function (e) {
      return proto.webrpc.RegisterOracleRequest.toObject(e, this);
    }, proto.webrpc.RegisterOracleRequest.toObject = function (t, r) {
      var o = {
        oracleAddress: e.Message.getFieldWithDefault(r, 1, ""),
        abi: e.Message.getFieldWithDefault(r, 2, "")
      };
      return t && (o.$jspbMessageInstance = r), o;
    }), proto.webrpc.RegisterOracleRequest.deserializeBinary = function (t) {
      var r = new e.BinaryReader(t),
          o = new proto.webrpc.RegisterOracleRequest();
      return proto.webrpc.RegisterOracleRequest.deserializeBinaryFromReader(o, r);
    }, proto.webrpc.RegisterOracleRequest.deserializeBinaryFromReader = function (e, t) {
      for (; t.nextField() && !t.isEndGroup();) {
        switch (t.getFieldNumber()) {
          case 1:
            var r = t.readString();
            e.setOracleAddress(r);
            break;

          case 2:
            r = t.readString();
            e.setAbi(r);
            break;

          default:
            t.skipField();
        }
      }

      return e;
    }, proto.webrpc.RegisterOracleRequest.prototype.serializeBinary = function () {
      var t = new e.BinaryWriter();
      return proto.webrpc.RegisterOracleRequest.serializeBinaryToWriter(this, t), t.getResultBuffer();
    }, proto.webrpc.RegisterOracleRequest.serializeBinaryToWriter = function (e, t) {
      var r = void 0;
      (r = e.getOracleAddress()).length > 0 && t.writeString(1, r), (r = e.getAbi()).length > 0 && t.writeString(2, r);
    }, proto.webrpc.RegisterOracleRequest.prototype.getOracleAddress = function () {
      return e.Message.getFieldWithDefault(this, 1, "");
    }, proto.webrpc.RegisterOracleRequest.prototype.setOracleAddress = function (t) {
      e.Message.setProto3StringField(this, 1, t);
    }, proto.webrpc.RegisterOracleRequest.prototype.getAbi = function () {
      return e.Message.getFieldWithDefault(this, 2, "");
    }, proto.webrpc.RegisterOracleRequest.prototype.setAbi = function (t) {
      e.Message.setProto3StringField(this, 2, t);
    }, proto.webrpc.ResolveOracleRequest = function (t) {
      e.Message.initialize(this, t, 0, -1, null, null);
    }, t.inherits(proto.webrpc.ResolveOracleRequest, e.Message), t.DEBUG && !COMPILED && (proto.webrpc.ResolveOracleRequest.displayName = "proto.webrpc.ResolveOracleRequest"), e.Message.GENERATE_TO_OBJECT && (proto.webrpc.ResolveOracleRequest.prototype.toObject = function (e) {
      return proto.webrpc.ResolveOracleRequest.toObject(e, this);
    }, proto.webrpc.ResolveOracleRequest.toObject = function (t, r) {
      var o = {
        oracleAddress: e.Message.getFieldWithDefault(r, 1, ""),
        tokenType: e.Message.getFieldWithDefault(r, 2, ""),
        tokenAddress: e.Message.getFieldWithDefault(r, 3, "")
      };
      return t && (o.$jspbMessageInstance = r), o;
    }), proto.webrpc.ResolveOracleRequest.deserializeBinary = function (t) {
      var r = new e.BinaryReader(t),
          o = new proto.webrpc.ResolveOracleRequest();
      return proto.webrpc.ResolveOracleRequest.deserializeBinaryFromReader(o, r);
    }, proto.webrpc.ResolveOracleRequest.deserializeBinaryFromReader = function (e, t) {
      for (; t.nextField() && !t.isEndGroup();) {
        switch (t.getFieldNumber()) {
          case 1:
            var r = t.readString();
            e.setOracleAddress(r);
            break;

          case 2:
            r = t.readString();
            e.setTokenType(r);
            break;

          case 3:
            r = t.readString();
            e.setTokenAddress(r);
            break;

          default:
            t.skipField();
        }
      }

      return e;
    }, proto.webrpc.ResolveOracleRequest.prototype.serializeBinary = function () {
      var t = new e.BinaryWriter();
      return proto.webrpc.ResolveOracleRequest.serializeBinaryToWriter(this, t), t.getResultBuffer();
    }, proto.webrpc.ResolveOracleRequest.serializeBinaryToWriter = function (e, t) {
      var r = void 0;
      (r = e.getOracleAddress()).length > 0 && t.writeString(1, r), (r = e.getTokenType()).length > 0 && t.writeString(2, r), (r = e.getTokenAddress()).length > 0 && t.writeString(3, r);
    }, proto.webrpc.ResolveOracleRequest.prototype.getOracleAddress = function () {
      return e.Message.getFieldWithDefault(this, 1, "");
    }, proto.webrpc.ResolveOracleRequest.prototype.setOracleAddress = function (t) {
      e.Message.setProto3StringField(this, 1, t);
    }, proto.webrpc.ResolveOracleRequest.prototype.getTokenType = function () {
      return e.Message.getFieldWithDefault(this, 2, "");
    }, proto.webrpc.ResolveOracleRequest.prototype.setTokenType = function (t) {
      e.Message.setProto3StringField(this, 2, t);
    }, proto.webrpc.ResolveOracleRequest.prototype.getTokenAddress = function () {
      return e.Message.getFieldWithDefault(this, 3, "");
    }, proto.webrpc.ResolveOracleRequest.prototype.setTokenAddress = function (t) {
      e.Message.setProto3StringField(this, 3, t);
    }, t.object.extend(exports, proto.webrpc);
  }, {
    "google-protobuf": "S7GR",
    "google-protobuf/google/protobuf/empty_pb.js": "G7CV"
  }],
  "Z8XB": [function (require, module, exports) {
    var e = require("./web_api_pb"),
        t = require("google-protobuf/google/protobuf/empty_pb"),
        s = require("@improbable-eng/grpc-web").grpc,
        n = function () {
      function e() {}

      return e.serviceName = "webrpc.WebApi", e;
    }();

    function r(e, t) {
      this.serviceHost = e, this.options = t || {};
    }

    n.OpenChannel = {
      methodName: "OpenChannel",
      service: n,
      requestStream: !1,
      responseStream: !1,
      requestType: e.OpenChannelRequest,
      responseType: e.OpenChannelResponse
    }, n.Deposit = {
      methodName: "Deposit",
      service: n,
      requestStream: !1,
      responseStream: !1,
      requestType: e.DepositRequest,
      responseType: e.DepositResponse
    }, n.Withdraw = {
      methodName: "Withdraw",
      service: n,
      requestStream: !1,
      responseStream: !1,
      requestType: e.WithdrawRequest,
      responseType: e.WithdrawResponse
    }, n.GetBalance = {
      methodName: "GetBalance",
      service: n,
      requestStream: !1,
      responseStream: !1,
      requestType: e.GetBalanceRequest,
      responseType: e.GetBalanceResponse
    }, n.SendConditionalPayment = {
      methodName: "SendConditionalPayment",
      service: n,
      requestStream: !1,
      responseStream: !1,
      requestType: e.SendConditionalPaymentRequest,
      responseType: e.SendConditionalPaymentResponse
    }, n.CreateAppSession = {
      methodName: "CreateAppSession",
      service: n,
      requestStream: !1,
      responseStream: !1,
      requestType: e.CreateAppSessionRequest,
      responseType: e.CreateAppSessionResponse
    }, n.ReceiveStates = {
      methodName: "ReceiveStates",
      service: n,
      requestStream: !1,
      responseStream: !0,
      requestType: e.ReceiveStatesRequest,
      responseType: e.StateMessage
    }, n.SendState = {
      methodName: "SendState",
      service: n,
      requestStream: !1,
      responseStream: !1,
      requestType: e.SendStateRequest,
      responseType: t.Empty
    }, n.AckState = {
      methodName: "AckState",
      service: n,
      requestStream: !1,
      responseStream: !1,
      requestType: e.AckStateRequest,
      responseType: t.Empty
    }, n.SettleAppSession = {
      methodName: "SettleAppSession",
      service: n,
      requestStream: !1,
      responseStream: !1,
      requestType: e.SettleAppSessionRequest,
      responseType: e.SettleAppSessionResponse
    }, n.EndAppSession = {
      methodName: "EndAppSession",
      service: n,
      requestStream: !1,
      responseStream: !1,
      requestType: e.EndAppSessionRequest,
      responseType: t.Empty
    }, n.RegisterOracle = {
      methodName: "RegisterOracle",
      service: n,
      requestStream: !1,
      responseStream: !1,
      requestType: e.RegisterOracleRequest,
      responseType: t.Empty
    }, n.ResolveOracle = {
      methodName: "ResolveOracle",
      service: n,
      requestStream: !1,
      responseStream: !1,
      requestType: e.ResolveOracleRequest,
      responseType: t.Empty
    }, exports.WebApi = n, r.prototype.openChannel = function (e, t, r) {
      2 === arguments.length && (r = arguments[1]);
      var a = s.unary(n.OpenChannel, {
        request: e,
        host: this.serviceHost,
        metadata: t,
        transport: this.options.transport,
        debug: this.options.debug,
        onEnd: function onEnd(e) {
          if (r) if (e.status !== s.Code.OK) {
            var t = new Error(e.statusMessage);
            t.code = e.status, t.metadata = e.trailers, r(t, null);
          } else r(null, e.message);
        }
      });
      return {
        cancel: function cancel() {
          r = null, a.close();
        }
      };
    }, r.prototype.deposit = function (e, t, r) {
      2 === arguments.length && (r = arguments[1]);
      var a = s.unary(n.Deposit, {
        request: e,
        host: this.serviceHost,
        metadata: t,
        transport: this.options.transport,
        debug: this.options.debug,
        onEnd: function onEnd(e) {
          if (r) if (e.status !== s.Code.OK) {
            var t = new Error(e.statusMessage);
            t.code = e.status, t.metadata = e.trailers, r(t, null);
          } else r(null, e.message);
        }
      });
      return {
        cancel: function cancel() {
          r = null, a.close();
        }
      };
    }, r.prototype.withdraw = function (e, t, r) {
      2 === arguments.length && (r = arguments[1]);
      var a = s.unary(n.Withdraw, {
        request: e,
        host: this.serviceHost,
        metadata: t,
        transport: this.options.transport,
        debug: this.options.debug,
        onEnd: function onEnd(e) {
          if (r) if (e.status !== s.Code.OK) {
            var t = new Error(e.statusMessage);
            t.code = e.status, t.metadata = e.trailers, r(t, null);
          } else r(null, e.message);
        }
      });
      return {
        cancel: function cancel() {
          r = null, a.close();
        }
      };
    }, r.prototype.getBalance = function (e, t, r) {
      2 === arguments.length && (r = arguments[1]);
      var a = s.unary(n.GetBalance, {
        request: e,
        host: this.serviceHost,
        metadata: t,
        transport: this.options.transport,
        debug: this.options.debug,
        onEnd: function onEnd(e) {
          if (r) if (e.status !== s.Code.OK) {
            var t = new Error(e.statusMessage);
            t.code = e.status, t.metadata = e.trailers, r(t, null);
          } else r(null, e.message);
        }
      });
      return {
        cancel: function cancel() {
          r = null, a.close();
        }
      };
    }, r.prototype.sendConditionalPayment = function (e, t, r) {
      2 === arguments.length && (r = arguments[1]);
      var a = s.unary(n.SendConditionalPayment, {
        request: e,
        host: this.serviceHost,
        metadata: t,
        transport: this.options.transport,
        debug: this.options.debug,
        onEnd: function onEnd(e) {
          if (r) if (e.status !== s.Code.OK) {
            var t = new Error(e.statusMessage);
            t.code = e.status, t.metadata = e.trailers, r(t, null);
          } else r(null, e.message);
        }
      });
      return {
        cancel: function cancel() {
          r = null, a.close();
        }
      };
    }, r.prototype.createAppSession = function (e, t, r) {
      2 === arguments.length && (r = arguments[1]);
      var a = s.unary(n.CreateAppSession, {
        request: e,
        host: this.serviceHost,
        metadata: t,
        transport: this.options.transport,
        debug: this.options.debug,
        onEnd: function onEnd(e) {
          if (r) if (e.status !== s.Code.OK) {
            var t = new Error(e.statusMessage);
            t.code = e.status, t.metadata = e.trailers, r(t, null);
          } else r(null, e.message);
        }
      });
      return {
        cancel: function cancel() {
          r = null, a.close();
        }
      };
    }, r.prototype.receiveStates = function (e, t) {
      var r = {
        data: [],
        end: [],
        status: []
      },
          a = s.invoke(n.ReceiveStates, {
        request: e,
        host: this.serviceHost,
        metadata: t,
        transport: this.options.transport,
        debug: this.options.debug,
        onMessage: function onMessage(e) {
          r.data.forEach(function (t) {
            t(e);
          });
        },
        onEnd: function onEnd(e, t, s) {
          r.end.forEach(function (e) {
            e();
          }), r.status.forEach(function (n) {
            n({
              code: e,
              details: t,
              metadata: s
            });
          }), r = null;
        }
      });
      return {
        on: function on(e, t) {
          return r[e].push(t), this;
        },
        cancel: function cancel() {
          r = null, a.close();
        }
      };
    }, r.prototype.sendState = function (e, t, r) {
      2 === arguments.length && (r = arguments[1]);
      var a = s.unary(n.SendState, {
        request: e,
        host: this.serviceHost,
        metadata: t,
        transport: this.options.transport,
        debug: this.options.debug,
        onEnd: function onEnd(e) {
          if (r) if (e.status !== s.Code.OK) {
            var t = new Error(e.statusMessage);
            t.code = e.status, t.metadata = e.trailers, r(t, null);
          } else r(null, e.message);
        }
      });
      return {
        cancel: function cancel() {
          r = null, a.close();
        }
      };
    }, r.prototype.ackState = function (e, t, r) {
      2 === arguments.length && (r = arguments[1]);
      var a = s.unary(n.AckState, {
        request: e,
        host: this.serviceHost,
        metadata: t,
        transport: this.options.transport,
        debug: this.options.debug,
        onEnd: function onEnd(e) {
          if (r) if (e.status !== s.Code.OK) {
            var t = new Error(e.statusMessage);
            t.code = e.status, t.metadata = e.trailers, r(t, null);
          } else r(null, e.message);
        }
      });
      return {
        cancel: function cancel() {
          r = null, a.close();
        }
      };
    }, r.prototype.settleAppSession = function (e, t, r) {
      2 === arguments.length && (r = arguments[1]);
      var a = s.unary(n.SettleAppSession, {
        request: e,
        host: this.serviceHost,
        metadata: t,
        transport: this.options.transport,
        debug: this.options.debug,
        onEnd: function onEnd(e) {
          if (r) if (e.status !== s.Code.OK) {
            var t = new Error(e.statusMessage);
            t.code = e.status, t.metadata = e.trailers, r(t, null);
          } else r(null, e.message);
        }
      });
      return {
        cancel: function cancel() {
          r = null, a.close();
        }
      };
    }, r.prototype.endAppSession = function (e, t, r) {
      2 === arguments.length && (r = arguments[1]);
      var a = s.unary(n.EndAppSession, {
        request: e,
        host: this.serviceHost,
        metadata: t,
        transport: this.options.transport,
        debug: this.options.debug,
        onEnd: function onEnd(e) {
          if (r) if (e.status !== s.Code.OK) {
            var t = new Error(e.statusMessage);
            t.code = e.status, t.metadata = e.trailers, r(t, null);
          } else r(null, e.message);
        }
      });
      return {
        cancel: function cancel() {
          r = null, a.close();
        }
      };
    }, r.prototype.registerOracle = function (e, t, r) {
      2 === arguments.length && (r = arguments[1]);
      var a = s.unary(n.RegisterOracle, {
        request: e,
        host: this.serviceHost,
        metadata: t,
        transport: this.options.transport,
        debug: this.options.debug,
        onEnd: function onEnd(e) {
          if (r) if (e.status !== s.Code.OK) {
            var t = new Error(e.statusMessage);
            t.code = e.status, t.metadata = e.trailers, r(t, null);
          } else r(null, e.message);
        }
      });
      return {
        cancel: function cancel() {
          r = null, a.close();
        }
      };
    }, r.prototype.resolveOracle = function (e, t, r) {
      2 === arguments.length && (r = arguments[1]);
      var a = s.unary(n.ResolveOracle, {
        request: e,
        host: this.serviceHost,
        metadata: t,
        transport: this.options.transport,
        debug: this.options.debug,
        onEnd: function onEnd(e) {
          if (r) if (e.status !== s.Code.OK) {
            var t = new Error(e.statusMessage);
            t.code = e.status, t.metadata = e.trailers, r(t, null);
          } else r(null, e.message);
        }
      });
      return {
        cancel: function cancel() {
          r = null, a.close();
        }
      };
    }, exports.WebApiClient = r;
  }, {
    "./web_api_pb": "zrcS",
    "google-protobuf/google/protobuf/empty_pb": "G7CV",
    "@improbable-eng/grpc-web": "SvC3"
  }],
  "D53L": [function (require, module, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: !0
    }), exports.Client = void 0;

    var e = require("@improbable-eng/grpc-web"),
        t = require("@improbable-eng/grpc-web-node-http-transport"),
        n = r(require("detect-node")),
        o = require("./webapi/web_api_pb"),
        s = require("./webapi/web_api_pb_service");

    function r(e) {
      return e && e.__esModule ? e : {
        default: e
      };
    }

    var i = function () {
      function r(o) {
        this.host = o, n.default && e.grpc.setDefaultTransport((0, t.NodeHttpTransport)());
      }

      return r.prototype.openEthChannel = function (e, t) {
        return this.openChannel("0", "0", e, t);
      }, r.prototype.openErc20Channel = function (e, t, n) {
        return this.openChannel("1", e, t, n);
      }, r.prototype.depositEth = function (e) {
        return this.deposit("0", "0", e);
      }, r.prototype.depositErc20 = function (e, t) {
        return this.deposit("1", e, t);
      }, r.prototype.withdrawEth = function (e) {
        return this.withdraw("0", "0", e);
      }, r.prototype.withdrawErc20 = function (e, t) {
        return this.withdraw("1", e, t);
      }, r.prototype.getEthBalance = function () {
        return this.getBalance("0", "0");
      }, r.prototype.getErc20Balance = function (e) {
        return this.getBalance("1", e);
      }, r.prototype.sendEth = function (e, t) {
        return this.sendConditionalPayment("0", "0", e, t);
      }, r.prototype.sendErc20 = function (e, t, n) {
        return this.sendConditionalPayment("1", e, t, n);
      }, r.prototype.sendEthWithCondition = function (e, t, n) {
        return this.sendConditionalPayment("0", "0", e, t, n);
      }, r.prototype.sendErc20WithCondition = function (e, t, n, o) {
        return this.sendConditionalPayment("1", e, t, n, o);
      }, r.prototype.createAppSession = function (t, n) {
        var r = this;
        return new Promise(function (i, a) {
          var p = new o.CreateAppSessionRequest();
          p.setBin(t.bin), p.setAbi(t.abi), p.setConstructor(t.constructor), p.setNonce(t.nonce);

          try {
            e.grpc.invoke(s.WebApi.CreateAppSession, {
              request: p,
              host: r.host,
              onEnd: r.onEnd(a),
              onMessage: function onMessage(t) {
                var a = t.getSessionId(),
                    p = new o.ReceiveStatesRequest();
                p.setSessionId(a);
                var c = e.grpc.invoke(s.WebApi.ReceiveStates, {
                  request: p,
                  host: r.host,
                  onEnd: function onEnd(e) {},
                  onMessage: function onMessage(t) {
                    var i = t.getSeq();

                    if (n(t.getState_asU8())) {
                      var p = new o.AckStateRequest();
                      p.setSessionId(a), p.setSeq(i), e.grpc.invoke(s.WebApi.AckState, {
                        request: p,
                        host: r.host,
                        onEnd: function onEnd(t, n, o) {
                          t !== e.grpc.Code.OK && c.close();
                        },
                        onMessage: function onMessage(e) {}
                      });
                    }
                  }
                });
                i(a);
              }
            });
          } catch (c) {
            a(c);
          }
        });
      }, r.prototype.sendState = function (t, n, r) {
        var i = this;
        return new Promise(function (a, p) {
          var c = new o.SendStateRequest();
          c.setSessionId(t), c.setDestination(n), c.setState(r);

          try {
            e.grpc.invoke(s.WebApi.SendState, {
              request: c,
              host: i.host,
              onEnd: i.onEnd(p),
              onMessage: function onMessage(e) {
                a();
              }
            });
          } catch (u) {
            p(u);
          }
        });
      }, r.prototype.settleAppSession = function (t) {
        var n = this;
        return new Promise(function (r, i) {
          var a = new o.SettleAppSessionRequest();
          a.setSessionId(t);

          try {
            e.grpc.invoke(s.WebApi.SettleAppSession, {
              request: a,
              host: n.host,
              onEnd: n.onEnd(i),
              onMessage: function onMessage(e) {
                r(e.getContractAddress());
              }
            });
          } catch (p) {
            i(p);
          }
        });
      }, r.prototype.endAppSessionForEth = function (e, t) {
        return this.endAppSession(e, "0", "0", t);
      }, r.prototype.endAppSessionForErc20 = function (e, t, n) {
        return this.endAppSession(e, "1", t, n);
      }, r.prototype.registerOracle = function (t, n) {
        var r = this;
        return new Promise(function (i, a) {
          var p = new o.RegisterOracleRequest();
          p.setOracleAddress(t), p.setAbi(n);

          try {
            e.grpc.invoke(s.WebApi.RegisterOracle, {
              request: p,
              host: r.host,
              onEnd: r.onEnd(a),
              onMessage: function onMessage(e) {
                i();
              }
            });
          } catch (c) {
            a(c);
          }
        });
      }, r.prototype.resolveOracleForEth = function (e) {
        return this.resolveOracle(e, "0", "0");
      }, r.prototype.resolveOracleForErc20 = function (e, t) {
        return this.resolveOracle(e, "1", t);
      }, r.prototype.openChannel = function (t, n, r, i) {
        var a = this;
        return new Promise(function (p, c) {
          var u = new o.OpenChannelRequest();
          u.setTokenType(t), u.setTokenAddress(n), u.setAmountWei(r), u.setPeerAmountWei(i);

          try {
            e.grpc.invoke(s.WebApi.OpenChannel, {
              request: u,
              host: a.host,
              onEnd: a.onEnd(c),
              onMessage: function onMessage(e) {
                p(e.getChannelId());
              }
            });
          } catch (d) {
            c(d);
          }
        });
      }, r.prototype.deposit = function (t, n, r) {
        var i = this;
        return new Promise(function (a, p) {
          var c = new o.DepositRequest();
          c.setTokenType(t), c.setTokenAddress(n), c.setAmountWei(r);

          try {
            e.grpc.invoke(s.WebApi.Deposit, {
              request: c,
              host: i.host,
              onEnd: i.onEnd(p),
              onMessage: function onMessage(e) {
                a(e.getTxHash());
              }
            });
          } catch (u) {
            p(u);
          }
        });
      }, r.prototype.withdraw = function (t, n, r) {
        var i = this;
        return new Promise(function (a, p) {
          var c = new o.WithdrawRequest();
          c.setTokenType(t), c.setTokenAddress(n), c.setAmountWei(r);

          try {
            e.grpc.invoke(s.WebApi.Withdraw, {
              request: c,
              host: i.host,
              onEnd: i.onEnd(p),
              onMessage: function onMessage(e) {
                a(e.getTxHash());
              }
            });
          } catch (u) {
            p(u);
          }
        });
      }, r.prototype.getBalance = function (t, n) {
        var r = this;
        return new Promise(function (i, a) {
          var p = new o.GetBalanceRequest();
          p.setTokenType(t), p.setTokenAddress(n);

          try {
            e.grpc.invoke(s.WebApi.GetBalance, {
              request: p,
              host: r.host,
              onEnd: r.onEnd(a),
              onMessage: function onMessage(e) {
                i({
                  freeBalance: e.getFreeBalance(),
                  lockedBalance: e.getLockedBalance(),
                  receivingCapacity: e.getReceivingCapacity()
                });
              }
            });
          } catch (c) {
            a(c);
          }
        });
      }, r.prototype.sendConditionalPayment = function (t, n, r, i, a) {
        var p = this;
        return new Promise(function (c, u) {
          var d = new o.SendConditionalPaymentRequest();

          if (d.setTokenType(t), d.setTokenAddress(n), d.setAmountWei(r), d.setDestination(i), a) {
            var h = new o.Condition();
            h.setDeadline(a.deadline), h.setSessionId(a.sessionID), h.setArgsForIsFinalized(a.argsForIsFinalized), h.setArgsForQueryResult(a.argsForQueryResult), h.setOnChainDeployed(a.onChainDeployed), d.setCondition(h);
          }

          try {
            e.grpc.invoke(s.WebApi.SendConditionalPayment, {
              request: d,
              host: p.host,
              onEnd: p.onEnd(u),
              onMessage: function onMessage(e) {
                c(e.getPaymentId());
              }
            });
          } catch (l) {
            u(l);
          }
        });
      }, r.prototype.endAppSession = function (t, n, r, i) {
        var a = this;
        return new Promise(function (p, c) {
          var u = new o.EndAppSessionRequest();
          u.setSessionId(t), u.setTokenType(n), u.setTokenAddress(r), u.setWinnerIndex(i);

          try {
            e.grpc.invoke(s.WebApi.EndAppSession, {
              request: u,
              host: a.host,
              onEnd: a.onEnd(c),
              onMessage: function onMessage(e) {
                p();
              }
            });
          } catch (d) {
            c(d);
          }
        });
      }, r.prototype.resolveOracle = function (t, n, r) {
        var i = this;
        return new Promise(function (a, p) {
          var c = new o.ResolveOracleRequest();
          c.setOracleAddress(t), c.setTokenType(n), c.setTokenAddress(r);

          try {
            e.grpc.invoke(s.WebApi.ResolveOracle, {
              request: c,
              host: i.host,
              onEnd: i.onEnd(p),
              onMessage: function onMessage(e) {
                a();
              }
            });
          } catch (u) {
            p(u);
          }
        });
      }, r.prototype.onEnd = function (t) {
        return function (n, o, s) {
          n !== e.grpc.Code.OK && (console.log("gRPC error:", n, o, s), t({
            code: n,
            msg: o,
            trailers: s
          }));
        };
      }, r;
    }();

    exports.Client = i;
  }, {
    "@improbable-eng/grpc-web": "SvC3",
    "@improbable-eng/grpc-web-node-http-transport": "d10I",
    "detect-node": "V57G",
    "./webapi/web_api_pb": "zrcS",
    "./webapi/web_api_pb_service": "Z8XB"
  }],
  "7QCb": [function (require, module, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: !0
    }), Object.defineProperty(exports, "Client", {
      enumerable: !0,
      get: function get() {
        return e.Client;
      }
    });

    var e = require("./client");
  }, {
    "./client": "D53L"
  }]
}, {}, ["7QCb"], "celer");
},{"buffer":"../node_modules/buffer/index.js"}],"client1.js":[function(require,module,exports) {
const celer = require('../browser/browser'); // '../dist/index' for NodeJS


const client = new celer.Client('http://localhost:29979');
const UNSET = 0;
const BEAR = 1;
const BULL = 2;
const BUFF = 3;
const PLAYER_WIN = 3;
const OPPONENT_WIN = 4;
const DRAW = 5;
const playerAddress = '0xeE87af530753DE52088b5D60325e0ef24C3357C9';
const opponentAddress = '0x05E4664a7459972EeD278cee62d8439Ba9EEDAbA';
let playerMove;
let opponentMove;
let sessionID;
let movesElement;
let playerBalanceElement;
let earningsElement;
let startingBalance;
let statusElement; //client 1 address: 0xeE87af530753DE52088b5D60325e0ef24C3357C9
//client 2 address: 0x05E4664a7459972EeD278cee62d8439Ba9EEDAbA

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function serializeState(state) {
  return new TextEncoder().encode(JSON.stringify(state));
}

function deserializeState(state) {
  return JSON.parse(new TextDecoder("utf-8").decode(state));
}

async function determineWinner() {
  let result;

  if (playerMove === opponentMove) {
    result = DRAW;
  } else if (playerMove === BEAR) {
    if (opponentMove === BULL) {
      result = PLAYER_WIN;
    } else {
      result = OPPONENT_WIN;
    }
  } else if (playerMove === BULL) {
    if (opponentMove === BUFF) {
      result = PLAYER_WIN;
    } else {
      result = OPPONENT_WIN;
    }
  } else if (playerMove === BUFF) {
    if (opponentMove === BULL) {
      result = OPPONENT_WIN;
    } else {
      result = PLAYER_WIN;
    }
  }

  if (result === PLAYER_WIN) {
    await timeout(3000);
    statusElement.innerHTML = 'YOU WIN!';
    await balanceCheck();
  } else if (result === OPPONENT_WIN) {
    //sendEth(amountWei: string, destination: string): Promise<string>
    let balance = await client.getEthBalance();

    if (balance.freeBalance === "0") {
      await client.depositEth('100');
    }

    await client.sendEth('1', opponentAddress);
    await balanceCheck();
    statusElement.innerHTML = 'YOU LOSE!';
  } else if (result === DRAW) {
    statusElement.innerHTML = 'GAME WAS A DRAW!';
  } else {
    //error
    statusElement.innerHTML = 'ERROR: could not identify winner';
  }
}

async function balanceCheck() {
  let balance = await client.getEthBalance();
  playerBalanceElement.innerHTML = balance.freeBalance;
  earningsElement.innerHTML = balance.freeBalance - startingBalance;
}

async function choiceMade(move) {
  playerMove = move;

  if (opponentMove === UNSET) {
    statusElement.innerHTML = 'move sent! waiting for opponent\'s move';
  } else {
    statusElement.innerHTML = 'determining winner...';
  } //send move to opponent


  let state = serializeState({
    move: playerMove
  });
  await client.sendState(sessionID, opponentAddress, state); //then hide buttons

  movesElement.style.display = "none";

  if (playerMove !== UNSET && opponentMove !== UNSET) {
    await determineWinner();
  }
}

(async function () {
  playerMove = UNSET;
  opponentMove = UNSET;
  const playerAddressElement = document.getElementById("playerAddress");
  const opponentAddressElement = document.getElementById("opponentAddress");
  playerBalanceElement = document.getElementById("playerBalance");
  earningsElement = document.getElementById("earnings");
  statusElement = document.getElementById("status");
  const bearElement = document.getElementById("bear");
  const bullElement = document.getElementById("bull");
  const bufficornElement = document.getElementById("bufficorn"); // const movePromptElement = document.getElementById("movePrompt");

  movesElement = document.getElementById("moves");
  movesElement.style.display = "none";
  bearElement.addEventListener('click', async function () {
    await choiceMade(BEAR);
  }, false);
  bullElement.addEventListener('click', async function () {
    await choiceMade(BULL);
  }, false);
  bufficornElement.addEventListener('click', async function () {
    await choiceMade(BUFF);
  }, false);
  playerAddressElement.innerHTML = playerAddress;
  opponentAddressElement.innerHTML = opponentAddress;
  earningsElement.innerHTML = "0"; //openEthChannel(amountWei: string, peerAmountWei: string): Promise<string>

  await client.openEthChannel('100', '100'); //user and server deposit amount

  statusElement.innerHTML = 'channel has been opened'; //initialize starting balance

  let balance = await client.getEthBalance();
  startingBalance = balance.freeBalance;
  statusElement.innerHTML = 'balance checking';
  await balanceCheck();
  const randomString = "abcd"; //appInfo: AppInfo, stateValidator: function

  const appInfo = {
    abi: randomString,
    bin: randomString,
    constructor: randomString,
    nonce: "1"
  }; //callback function called upon state change that returns true if state is valid

  const stateValidator = async function stateValidator(state) {
    state = deserializeState(state);
    opponentMove = parseInt(state.move);

    if (playerMove !== UNSET && opponentMove !== UNSET) {
      statusElement.innerHTML = 'determining winner...';
      await determineWinner();
    } else {
      statusElement.innerHTML = 'received response from opponent';
    }

    await timeout(1000);
    await balanceCheck();
    return true;
  };

  statusElement.innerHTML = 'creating app session';
  sessionID = await client.createAppSession(appInfo, stateValidator); //hide buttons for 4 seconds (while connecting to other player)

  statusElement.innerHTML = 'waiting for opponent to connect...';
  await timeout(4000);
  movesElement.style.display = "block";
  statusElement.innerHTML = 'connected to opponent';
})().catch(console.log);
},{"../browser/browser":"../browser/browser.js"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "53629" + '/');

  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","client1.js"], null)
//# sourceMappingURL=/client1.7bda60d6.map