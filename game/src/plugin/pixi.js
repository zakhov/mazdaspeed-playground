game.module(
    'plugin.pixi'
)
.require(
    'engine.scene',
    'engine.loader',
    'engine.renderer.core',
    'engine.debug',
    'engine.particle'
)
.body(function() {

this.version = '1.2.5';

if (game.isStarted) return; // Prevent running code without restart

/*!
 * pixi.js - v4.1.1
 * Compiled Wed, 18 Jul 2018 06:07:41 UTC
 *
 * pixi.js is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.PIXI = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Bit twiddling hacks for JavaScript.
 *
 * Author: Mikola Lysenko
 *
 * Ported from Stanford bit twiddling hack library:
 *    http://graphics.stanford.edu/~seander/bithacks.html
 */

"use strict"; "use restrict";

//Number of bits in an integer
var INT_BITS = 32;

//Constants
exports.INT_BITS  = INT_BITS;
exports.INT_MAX   =  0x7fffffff;
exports.INT_MIN   = -1<<(INT_BITS-1);

//Returns -1, 0, +1 depending on sign of x
exports.sign = function(v) {
  return (v > 0) - (v < 0);
}

//Computes absolute value of integer
exports.abs = function(v) {
  var mask = v >> (INT_BITS-1);
  return (v ^ mask) - mask;
}

//Computes minimum of integers x and y
exports.min = function(x, y) {
  return y ^ ((x ^ y) & -(x < y));
}

//Computes maximum of integers x and y
exports.max = function(x, y) {
  return x ^ ((x ^ y) & -(x < y));
}

//Checks if a number is a power of two
exports.isPow2 = function(v) {
  return !(v & (v-1)) && (!!v);
}

//Computes log base 2 of v
exports.log2 = function(v) {
  var r, shift;
  r =     (v > 0xFFFF) << 4; v >>>= r;
  shift = (v > 0xFF  ) << 3; v >>>= shift; r |= shift;
  shift = (v > 0xF   ) << 2; v >>>= shift; r |= shift;
  shift = (v > 0x3   ) << 1; v >>>= shift; r |= shift;
  return r | (v >> 1);
}

//Computes log base 10 of v
exports.log10 = function(v) {
  return  (v >= 1000000000) ? 9 : (v >= 100000000) ? 8 : (v >= 10000000) ? 7 :
          (v >= 1000000) ? 6 : (v >= 100000) ? 5 : (v >= 10000) ? 4 :
          (v >= 1000) ? 3 : (v >= 100) ? 2 : (v >= 10) ? 1 : 0;
}

//Counts number of bits
exports.popCount = function(v) {
  v = v - ((v >>> 1) & 0x55555555);
  v = (v & 0x33333333) + ((v >>> 2) & 0x33333333);
  return ((v + (v >>> 4) & 0xF0F0F0F) * 0x1010101) >>> 24;
}

//Counts number of trailing zeros
function countTrailingZeros(v) {
  var c = 32;
  v &= -v;
  if (v) c--;
  if (v & 0x0000FFFF) c -= 16;
  if (v & 0x00FF00FF) c -= 8;
  if (v & 0x0F0F0F0F) c -= 4;
  if (v & 0x33333333) c -= 2;
  if (v & 0x55555555) c -= 1;
  return c;
}
exports.countTrailingZeros = countTrailingZeros;

//Rounds to next power of 2
exports.nextPow2 = function(v) {
  v += v === 0;
  --v;
  v |= v >>> 1;
  v |= v >>> 2;
  v |= v >>> 4;
  v |= v >>> 8;
  v |= v >>> 16;
  return v + 1;
}

//Rounds down to previous power of 2
exports.prevPow2 = function(v) {
  v |= v >>> 1;
  v |= v >>> 2;
  v |= v >>> 4;
  v |= v >>> 8;
  v |= v >>> 16;
  return v - (v>>>1);
}

//Computes parity of word
exports.parity = function(v) {
  v ^= v >>> 16;
  v ^= v >>> 8;
  v ^= v >>> 4;
  v &= 0xf;
  return (0x6996 >>> v) & 1;
}

var REVERSE_TABLE = new Array(256);

(function(tab) {
  for(var i=0; i<256; ++i) {
    var v = i, r = i, s = 7;
    for (v >>>= 1; v; v >>>= 1) {
      r <<= 1;
      r |= v & 1;
      --s;
    }
    tab[i] = (r << s) & 0xff;
  }
})(REVERSE_TABLE);

//Reverse bits in a 32 bit word
exports.reverse = function(v) {
  return  (REVERSE_TABLE[ v         & 0xff] << 24) |
          (REVERSE_TABLE[(v >>> 8)  & 0xff] << 16) |
          (REVERSE_TABLE[(v >>> 16) & 0xff] << 8)  |
           REVERSE_TABLE[(v >>> 24) & 0xff];
}

//Interleave bits of 2 coordinates with 16 bits.  Useful for fast quadtree codes
exports.interleave2 = function(x, y) {
  x &= 0xFFFF;
  x = (x | (x << 8)) & 0x00FF00FF;
  x = (x | (x << 4)) & 0x0F0F0F0F;
  x = (x | (x << 2)) & 0x33333333;
  x = (x | (x << 1)) & 0x55555555;

  y &= 0xFFFF;
  y = (y | (y << 8)) & 0x00FF00FF;
  y = (y | (y << 4)) & 0x0F0F0F0F;
  y = (y | (y << 2)) & 0x33333333;
  y = (y | (y << 1)) & 0x55555555;

  return x | (y << 1);
}

//Extracts the nth interleaved component
exports.deinterleave2 = function(v, n) {
  v = (v >>> n) & 0x55555555;
  v = (v | (v >>> 1))  & 0x33333333;
  v = (v | (v >>> 2))  & 0x0F0F0F0F;
  v = (v | (v >>> 4))  & 0x00FF00FF;
  v = (v | (v >>> 16)) & 0x000FFFF;
  return (v << 16) >> 16;
}


//Interleave bits of 3 coordinates, each with 10 bits.  Useful for fast octree codes
exports.interleave3 = function(x, y, z) {
  x &= 0x3FF;
  x  = (x | (x<<16)) & 4278190335;
  x  = (x | (x<<8))  & 251719695;
  x  = (x | (x<<4))  & 3272356035;
  x  = (x | (x<<2))  & 1227133513;

  y &= 0x3FF;
  y  = (y | (y<<16)) & 4278190335;
  y  = (y | (y<<8))  & 251719695;
  y  = (y | (y<<4))  & 3272356035;
  y  = (y | (y<<2))  & 1227133513;
  x |= (y << 1);
  
  z &= 0x3FF;
  z  = (z | (z<<16)) & 4278190335;
  z  = (z | (z<<8))  & 251719695;
  z  = (z | (z<<4))  & 3272356035;
  z  = (z | (z<<2))  & 1227133513;
  
  return x | (z << 2);
}

//Extracts nth interleaved component of a 3-tuple
exports.deinterleave3 = function(v, n) {
  v = (v >>> n)       & 1227133513;
  v = (v | (v>>>2))   & 3272356035;
  v = (v | (v>>>4))   & 251719695;
  v = (v | (v>>>8))   & 4278190335;
  v = (v | (v>>>16))  & 0x3FF;
  return (v<<22)>>22;
}

//Computes next combination in colexicographic order (this is mistakenly called nextPermutation on the bit twiddling hacks page)
exports.nextCombination = function(v) {
  var t = v | (v - 1);
  return (t + 1) | (((~t & -~t) - 1) >>> (countTrailingZeros(v) + 1));
}


},{}],2:[function(require,module,exports){

},{}],3:[function(require,module,exports){
'use strict';

module.exports = earcut;
module.exports.default = earcut;

function earcut(data, holeIndices, dim) {

    dim = dim || 2;

    var hasHoles = holeIndices && holeIndices.length,
        outerLen = hasHoles ? holeIndices[0] * dim : data.length,
        outerNode = linkedList(data, 0, outerLen, dim, true),
        triangles = [];

    if (!outerNode) return triangles;

    var minX, minY, maxX, maxY, x, y, invSize;

    if (hasHoles) outerNode = eliminateHoles(data, holeIndices, outerNode, dim);

    // if the shape is not too simple, we'll use z-order curve hash later; calculate polygon bbox
    if (data.length > 80 * dim) {
        minX = maxX = data[0];
        minY = maxY = data[1];

        for (var i = dim; i < outerLen; i += dim) {
            x = data[i];
            y = data[i + 1];
            if (x < minX) minX = x;
            if (y < minY) minY = y;
            if (x > maxX) maxX = x;
            if (y > maxY) maxY = y;
        }

        // minX, minY and invSize are later used to transform coords into integers for z-order calculation
        invSize = Math.max(maxX - minX, maxY - minY);
        invSize = invSize !== 0 ? 1 / invSize : 0;
    }

    earcutLinked(outerNode, triangles, dim, minX, minY, invSize);

    return triangles;
}

// create a circular doubly linked list from polygon points in the specified winding order
function linkedList(data, start, end, dim, clockwise) {
    var i, last;

    if (clockwise === (signedArea(data, start, end, dim) > 0)) {
        for (i = start; i < end; i += dim) last = insertNode(i, data[i], data[i + 1], last);
    } else {
        for (i = end - dim; i >= start; i -= dim) last = insertNode(i, data[i], data[i + 1], last);
    }

    if (last && equals(last, last.next)) {
        removeNode(last);
        last = last.next;
    }

    return last;
}

// eliminate colinear or duplicate points
function filterPoints(start, end) {
    if (!start) return start;
    if (!end) end = start;

    var p = start,
        again;
    do {
        again = false;

        if (!p.steiner && (equals(p, p.next) || area(p.prev, p, p.next) === 0)) {
            removeNode(p);
            p = end = p.prev;
            if (p === p.next) break;
            again = true;

        } else {
            p = p.next;
        }
    } while (again || p !== end);

    return end;
}

// main ear slicing loop which triangulates a polygon (given as a linked list)
function earcutLinked(ear, triangles, dim, minX, minY, invSize, pass) {
    if (!ear) return;

    // interlink polygon nodes in z-order
    if (!pass && invSize) indexCurve(ear, minX, minY, invSize);

    var stop = ear,
        prev, next;

    // iterate through ears, slicing them one by one
    while (ear.prev !== ear.next) {
        prev = ear.prev;
        next = ear.next;

        if (invSize ? isEarHashed(ear, minX, minY, invSize) : isEar(ear)) {
            // cut off the triangle
            triangles.push(prev.i / dim);
            triangles.push(ear.i / dim);
            triangles.push(next.i / dim);

            removeNode(ear);

            // skipping the next vertice leads to less sliver triangles
            ear = next.next;
            stop = next.next;

            continue;
        }

        ear = next;

        // if we looped through the whole remaining polygon and can't find any more ears
        if (ear === stop) {
            // try filtering points and slicing again
            if (!pass) {
                earcutLinked(filterPoints(ear), triangles, dim, minX, minY, invSize, 1);

            // if this didn't work, try curing all small self-intersections locally
            } else if (pass === 1) {
                ear = cureLocalIntersections(ear, triangles, dim);
                earcutLinked(ear, triangles, dim, minX, minY, invSize, 2);

            // as a last resort, try splitting the remaining polygon into two
            } else if (pass === 2) {
                splitEarcut(ear, triangles, dim, minX, minY, invSize);
            }

            break;
        }
    }
}

// check whether a polygon node forms a valid ear with adjacent nodes
function isEar(ear) {
    var a = ear.prev,
        b = ear,
        c = ear.next;

    if (area(a, b, c) >= 0) return false; // reflex, can't be an ear

    // now make sure we don't have other points inside the potential ear
    var p = ear.next.next;

    while (p !== ear.prev) {
        if (pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) &&
            area(p.prev, p, p.next) >= 0) return false;
        p = p.next;
    }

    return true;
}

function isEarHashed(ear, minX, minY, invSize) {
    var a = ear.prev,
        b = ear,
        c = ear.next;

    if (area(a, b, c) >= 0) return false; // reflex, can't be an ear

    // triangle bbox; min & max are calculated like this for speed
    var minTX = a.x < b.x ? (a.x < c.x ? a.x : c.x) : (b.x < c.x ? b.x : c.x),
        minTY = a.y < b.y ? (a.y < c.y ? a.y : c.y) : (b.y < c.y ? b.y : c.y),
        maxTX = a.x > b.x ? (a.x > c.x ? a.x : c.x) : (b.x > c.x ? b.x : c.x),
        maxTY = a.y > b.y ? (a.y > c.y ? a.y : c.y) : (b.y > c.y ? b.y : c.y);

    // z-order range for the current triangle bbox;
    var minZ = zOrder(minTX, minTY, minX, minY, invSize),
        maxZ = zOrder(maxTX, maxTY, minX, minY, invSize);

    var p = ear.prevZ,
        n = ear.nextZ;

    // look for points inside the triangle in both directions
    while (p && p.z >= minZ && n && n.z <= maxZ) {
        if (p !== ear.prev && p !== ear.next &&
            pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) &&
            area(p.prev, p, p.next) >= 0) return false;
        p = p.prevZ;

        if (n !== ear.prev && n !== ear.next &&
            pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, n.x, n.y) &&
            area(n.prev, n, n.next) >= 0) return false;
        n = n.nextZ;
    }

    // look for remaining points in decreasing z-order
    while (p && p.z >= minZ) {
        if (p !== ear.prev && p !== ear.next &&
            pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) &&
            area(p.prev, p, p.next) >= 0) return false;
        p = p.prevZ;
    }

    // look for remaining points in increasing z-order
    while (n && n.z <= maxZ) {
        if (n !== ear.prev && n !== ear.next &&
            pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, n.x, n.y) &&
            area(n.prev, n, n.next) >= 0) return false;
        n = n.nextZ;
    }

    return true;
}

// go through all polygon nodes and cure small local self-intersections
function cureLocalIntersections(start, triangles, dim) {
    var p = start;
    do {
        var a = p.prev,
            b = p.next.next;

        if (!equals(a, b) && intersects(a, p, p.next, b) && locallyInside(a, b) && locallyInside(b, a)) {

            triangles.push(a.i / dim);
            triangles.push(p.i / dim);
            triangles.push(b.i / dim);

            // remove two nodes involved
            removeNode(p);
            removeNode(p.next);

            p = start = b;
        }
        p = p.next;
    } while (p !== start);

    return p;
}

// try splitting polygon into two and triangulate them independently
function splitEarcut(start, triangles, dim, minX, minY, invSize) {
    // look for a valid diagonal that divides the polygon into two
    var a = start;
    do {
        var b = a.next.next;
        while (b !== a.prev) {
            if (a.i !== b.i && isValidDiagonal(a, b)) {
                // split the polygon in two by the diagonal
                var c = splitPolygon(a, b);

                // filter colinear points around the cuts
                a = filterPoints(a, a.next);
                c = filterPoints(c, c.next);

                // run earcut on each half
                earcutLinked(a, triangles, dim, minX, minY, invSize);
                earcutLinked(c, triangles, dim, minX, minY, invSize);
                return;
            }
            b = b.next;
        }
        a = a.next;
    } while (a !== start);
}

// link every hole into the outer loop, producing a single-ring polygon without holes
function eliminateHoles(data, holeIndices, outerNode, dim) {
    var queue = [],
        i, len, start, end, list;

    for (i = 0, len = holeIndices.length; i < len; i++) {
        start = holeIndices[i] * dim;
        end = i < len - 1 ? holeIndices[i + 1] * dim : data.length;
        list = linkedList(data, start, end, dim, false);
        if (list === list.next) list.steiner = true;
        queue.push(getLeftmost(list));
    }

    queue.sort(compareX);

    // process holes from left to right
    for (i = 0; i < queue.length; i++) {
        eliminateHole(queue[i], outerNode);
        outerNode = filterPoints(outerNode, outerNode.next);
    }

    return outerNode;
}

function compareX(a, b) {
    return a.x - b.x;
}

// find a bridge between vertices that connects hole with an outer ring and and link it
function eliminateHole(hole, outerNode) {
    outerNode = findHoleBridge(hole, outerNode);
    if (outerNode) {
        var b = splitPolygon(outerNode, hole);
        filterPoints(b, b.next);
    }
}

// David Eberly's algorithm for finding a bridge between hole and outer polygon
function findHoleBridge(hole, outerNode) {
    var p = outerNode,
        hx = hole.x,
        hy = hole.y,
        qx = -Infinity,
        m;

    // find a segment intersected by a ray from the hole's leftmost point to the left;
    // segment's endpoint with lesser x will be potential connection point
    do {
        if (hy <= p.y && hy >= p.next.y && p.next.y !== p.y) {
            var x = p.x + (hy - p.y) * (p.next.x - p.x) / (p.next.y - p.y);
            if (x <= hx && x > qx) {
                qx = x;
                if (x === hx) {
                    if (hy === p.y) return p;
                    if (hy === p.next.y) return p.next;
                }
                m = p.x < p.next.x ? p : p.next;
            }
        }
        p = p.next;
    } while (p !== outerNode);

    if (!m) return null;

    if (hx === qx) return m.prev; // hole touches outer segment; pick lower endpoint

    // look for points inside the triangle of hole point, segment intersection and endpoint;
    // if there are no points found, we have a valid connection;
    // otherwise choose the point of the minimum angle with the ray as connection point

    var stop = m,
        mx = m.x,
        my = m.y,
        tanMin = Infinity,
        tan;

    p = m.next;

    while (p !== stop) {
        if (hx >= p.x && p.x >= mx && hx !== p.x &&
                pointInTriangle(hy < my ? hx : qx, hy, mx, my, hy < my ? qx : hx, hy, p.x, p.y)) {

            tan = Math.abs(hy - p.y) / (hx - p.x); // tangential

            if ((tan < tanMin || (tan === tanMin && p.x > m.x)) && locallyInside(p, hole)) {
                m = p;
                tanMin = tan;
            }
        }

        p = p.next;
    }

    return m;
}

// interlink polygon nodes in z-order
function indexCurve(start, minX, minY, invSize) {
    var p = start;
    do {
        if (p.z === null) p.z = zOrder(p.x, p.y, minX, minY, invSize);
        p.prevZ = p.prev;
        p.nextZ = p.next;
        p = p.next;
    } while (p !== start);

    p.prevZ.nextZ = null;
    p.prevZ = null;

    sortLinked(p);
}

// Simon Tatham's linked list merge sort algorithm
// http://www.chiark.greenend.org.uk/~sgtatham/algorithms/listsort.html
function sortLinked(list) {
    var i, p, q, e, tail, numMerges, pSize, qSize,
        inSize = 1;

    do {
        p = list;
        list = null;
        tail = null;
        numMerges = 0;

        while (p) {
            numMerges++;
            q = p;
            pSize = 0;
            for (i = 0; i < inSize; i++) {
                pSize++;
                q = q.nextZ;
                if (!q) break;
            }
            qSize = inSize;

            while (pSize > 0 || (qSize > 0 && q)) {

                if (pSize !== 0 && (qSize === 0 || !q || p.z <= q.z)) {
                    e = p;
                    p = p.nextZ;
                    pSize--;
                } else {
                    e = q;
                    q = q.nextZ;
                    qSize--;
                }

                if (tail) tail.nextZ = e;
                else list = e;

                e.prevZ = tail;
                tail = e;
            }

            p = q;
        }

        tail.nextZ = null;
        inSize *= 2;

    } while (numMerges > 1);

    return list;
}

// z-order of a point given coords and inverse of the longer side of data bbox
function zOrder(x, y, minX, minY, invSize) {
    // coords are transformed into non-negative 15-bit integer range
    x = 32767 * (x - minX) * invSize;
    y = 32767 * (y - minY) * invSize;

    x = (x | (x << 8)) & 0x00FF00FF;
    x = (x | (x << 4)) & 0x0F0F0F0F;
    x = (x | (x << 2)) & 0x33333333;
    x = (x | (x << 1)) & 0x55555555;

    y = (y | (y << 8)) & 0x00FF00FF;
    y = (y | (y << 4)) & 0x0F0F0F0F;
    y = (y | (y << 2)) & 0x33333333;
    y = (y | (y << 1)) & 0x55555555;

    return x | (y << 1);
}

// find the leftmost node of a polygon ring
function getLeftmost(start) {
    var p = start,
        leftmost = start;
    do {
        if (p.x < leftmost.x) leftmost = p;
        p = p.next;
    } while (p !== start);

    return leftmost;
}

// check if a point lies within a convex triangle
function pointInTriangle(ax, ay, bx, by, cx, cy, px, py) {
    return (cx - px) * (ay - py) - (ax - px) * (cy - py) >= 0 &&
           (ax - px) * (by - py) - (bx - px) * (ay - py) >= 0 &&
           (bx - px) * (cy - py) - (cx - px) * (by - py) >= 0;
}

// check if a diagonal between two polygon nodes is valid (lies in polygon interior)
function isValidDiagonal(a, b) {
    return a.next.i !== b.i && a.prev.i !== b.i && !intersectsPolygon(a, b) &&
           locallyInside(a, b) && locallyInside(b, a) && middleInside(a, b);
}

// signed area of a triangle
function area(p, q, r) {
    return (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
}

// check if two points are equal
function equals(p1, p2) {
    return p1.x === p2.x && p1.y === p2.y;
}

// check if two segments intersect
function intersects(p1, q1, p2, q2) {
    if ((equals(p1, q1) && equals(p2, q2)) ||
        (equals(p1, q2) && equals(p2, q1))) return true;
    return area(p1, q1, p2) > 0 !== area(p1, q1, q2) > 0 &&
           area(p2, q2, p1) > 0 !== area(p2, q2, q1) > 0;
}

// check if a polygon diagonal intersects any polygon segments
function intersectsPolygon(a, b) {
    var p = a;
    do {
        if (p.i !== a.i && p.next.i !== a.i && p.i !== b.i && p.next.i !== b.i &&
                intersects(p, p.next, a, b)) return true;
        p = p.next;
    } while (p !== a);

    return false;
}

// check if a polygon diagonal is locally inside the polygon
function locallyInside(a, b) {
    return area(a.prev, a, a.next) < 0 ?
        area(a, b, a.next) >= 0 && area(a, a.prev, b) >= 0 :
        area(a, b, a.prev) < 0 || area(a, a.next, b) < 0;
}

// check if the middle point of a polygon diagonal is inside the polygon
function middleInside(a, b) {
    var p = a,
        inside = false,
        px = (a.x + b.x) / 2,
        py = (a.y + b.y) / 2;
    do {
        if (((p.y > py) !== (p.next.y > py)) && p.next.y !== p.y &&
                (px < (p.next.x - p.x) * (py - p.y) / (p.next.y - p.y) + p.x))
            inside = !inside;
        p = p.next;
    } while (p !== a);

    return inside;
}

// link two polygon vertices with a bridge; if the vertices belong to the same ring, it splits polygon into two;
// if one belongs to the outer ring and another to a hole, it merges it into a single ring
function splitPolygon(a, b) {
    var a2 = new Node(a.i, a.x, a.y),
        b2 = new Node(b.i, b.x, b.y),
        an = a.next,
        bp = b.prev;

    a.next = b;
    b.prev = a;

    a2.next = an;
    an.prev = a2;

    b2.next = a2;
    a2.prev = b2;

    bp.next = b2;
    b2.prev = bp;

    return b2;
}

// create a node and optionally link it with previous one (in a circular doubly linked list)
function insertNode(i, x, y, last) {
    var p = new Node(i, x, y);

    if (!last) {
        p.prev = p;
        p.next = p;

    } else {
        p.next = last.next;
        p.prev = last;
        last.next.prev = p;
        last.next = p;
    }
    return p;
}

function removeNode(p) {
    p.next.prev = p.prev;
    p.prev.next = p.next;

    if (p.prevZ) p.prevZ.nextZ = p.nextZ;
    if (p.nextZ) p.nextZ.prevZ = p.prevZ;
}

function Node(i, x, y) {
    // vertice index in coordinates array
    this.i = i;

    // vertex coordinates
    this.x = x;
    this.y = y;

    // previous and next vertice nodes in a polygon ring
    this.prev = null;
    this.next = null;

    // z-order curve value
    this.z = null;

    // previous and next nodes in z-order
    this.prevZ = null;
    this.nextZ = null;

    // indicates whether this is a steiner point
    this.steiner = false;
}

// return a percentage difference between the polygon area and its triangulation area;
// used to verify correctness of triangulation
earcut.deviation = function (data, holeIndices, dim, triangles) {
    var hasHoles = holeIndices && holeIndices.length;
    var outerLen = hasHoles ? holeIndices[0] * dim : data.length;

    var polygonArea = Math.abs(signedArea(data, 0, outerLen, dim));
    if (hasHoles) {
        for (var i = 0, len = holeIndices.length; i < len; i++) {
            var start = holeIndices[i] * dim;
            var end = i < len - 1 ? holeIndices[i + 1] * dim : data.length;
            polygonArea -= Math.abs(signedArea(data, start, end, dim));
        }
    }

    var trianglesArea = 0;
    for (i = 0; i < triangles.length; i += 3) {
        var a = triangles[i] * dim;
        var b = triangles[i + 1] * dim;
        var c = triangles[i + 2] * dim;
        trianglesArea += Math.abs(
            (data[a] - data[c]) * (data[b + 1] - data[a + 1]) -
            (data[a] - data[b]) * (data[c + 1] - data[a + 1]));
    }

    return polygonArea === 0 && trianglesArea === 0 ? 0 :
        Math.abs((trianglesArea - polygonArea) / polygonArea);
};

function signedArea(data, start, end, dim) {
    var sum = 0;
    for (var i = start, j = end - dim; i < end; i += dim) {
        sum += (data[j] - data[i]) * (data[i + 1] + data[j + 1]);
        j = i;
    }
    return sum;
}

// turn a polygon in a multi-dimensional array form (e.g. as in GeoJSON) into a form Earcut accepts
earcut.flatten = function (data) {
    var dim = data[0][0].length,
        result = {vertices: [], holes: [], dimensions: dim},
        holeIndex = 0;

    for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < data[i].length; j++) {
            for (var d = 0; d < dim; d++) result.vertices.push(data[i][j][d]);
        }
        if (i > 0) {
            holeIndex += data[i - 1].length;
            result.holes.push(holeIndex);
        }
    }
    return result;
};

},{}],4:[function(require,module,exports){
'use strict';

var has = Object.prototype.hasOwnProperty
  , prefix = '~';

/**
 * Constructor to create a storage for our `EE` objects.
 * An `Events` instance is a plain object whose properties are event names.
 *
 * @constructor
 * @api private
 */
function Events() {}

//
// We try to not inherit from `Object.prototype`. In some engines creating an
// instance in this way is faster than calling `Object.create(null)` directly.
// If `Object.create(null)` is not supported we prefix the event names with a
// character to make sure that the built-in object properties are not
// overridden or used as an attack vector.
//
if (Object.create) {
  Events.prototype = Object.create(null);

  //
  // This hack is needed because the `__proto__` property is still inherited in
  // some old browsers like Android 4, iPhone 5.1, Opera 11 and Safari 5.
  //
  if (!new Events().__proto__) prefix = false;
}

/**
 * Representation of a single event listener.
 *
 * @param {Function} fn The listener function.
 * @param {Mixed} context The context to invoke the listener with.
 * @param {Boolean} [once=false] Specify if the listener is a one-time listener.
 * @constructor
 * @api private
 */
function EE(fn, context, once) {
  this.fn = fn;
  this.context = context;
  this.once = once || false;
}

/**
 * Minimal `EventEmitter` interface that is molded against the Node.js
 * `EventEmitter` interface.
 *
 * @constructor
 * @api public
 */
function EventEmitter() {
  this._events = new Events();
  this._eventsCount = 0;
}

/**
 * Return an array listing the events for which the emitter has registered
 * listeners.
 *
 * @returns {Array}
 * @api public
 */
EventEmitter.prototype.eventNames = function eventNames() {
  var names = []
    , events
    , name;

  if (this._eventsCount === 0) return names;

  for (name in (events = this._events)) {
    if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
  }

  if (Object.getOwnPropertySymbols) {
    return names.concat(Object.getOwnPropertySymbols(events));
  }

  return names;
};

/**
 * Return the listeners registered for a given event.
 *
 * @param {String|Symbol} event The event name.
 * @param {Boolean} exists Only check if there are listeners.
 * @returns {Array|Boolean}
 * @api public
 */
EventEmitter.prototype.listeners = function listeners(event, exists) {
  var evt = prefix ? prefix + event : event
    , available = this._events[evt];

  if (exists) return !!available;
  if (!available) return [];
  if (available.fn) return [available.fn];

  for (var i = 0, l = available.length, ee = new Array(l); i < l; i++) {
    ee[i] = available[i].fn;
  }

  return ee;
};

/**
 * Calls each of the listeners registered for a given event.
 *
 * @param {String|Symbol} event The event name.
 * @returns {Boolean} `true` if the event had listeners, else `false`.
 * @api public
 */
EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
  var evt = prefix ? prefix + event : event;

  if (!this._events[evt]) return false;

  var listeners = this._events[evt]
    , len = arguments.length
    , args
    , i;

  if (listeners.fn) {
    if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);

    switch (len) {
      case 1: return listeners.fn.call(listeners.context), true;
      case 2: return listeners.fn.call(listeners.context, a1), true;
      case 3: return listeners.fn.call(listeners.context, a1, a2), true;
      case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
      case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
      case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
    }

    for (i = 1, args = new Array(len -1); i < len; i++) {
      args[i - 1] = arguments[i];
    }

    listeners.fn.apply(listeners.context, args);
  } else {
    var length = listeners.length
      , j;

    for (i = 0; i < length; i++) {
      if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);

      switch (len) {
        case 1: listeners[i].fn.call(listeners[i].context); break;
        case 2: listeners[i].fn.call(listeners[i].context, a1); break;
        case 3: listeners[i].fn.call(listeners[i].context, a1, a2); break;
        case 4: listeners[i].fn.call(listeners[i].context, a1, a2, a3); break;
        default:
          if (!args) for (j = 1, args = new Array(len -1); j < len; j++) {
            args[j - 1] = arguments[j];
          }

          listeners[i].fn.apply(listeners[i].context, args);
      }
    }
  }

  return true;
};

/**
 * Add a listener for a given event.
 *
 * @param {String|Symbol} event The event name.
 * @param {Function} fn The listener function.
 * @param {Mixed} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @api public
 */
EventEmitter.prototype.on = function on(event, fn, context) {
  var listener = new EE(fn, context || this)
    , evt = prefix ? prefix + event : event;

  if (!this._events[evt]) this._events[evt] = listener, this._eventsCount++;
  else if (!this._events[evt].fn) this._events[evt].push(listener);
  else this._events[evt] = [this._events[evt], listener];

  return this;
};

/**
 * Add a one-time listener for a given event.
 *
 * @param {String|Symbol} event The event name.
 * @param {Function} fn The listener function.
 * @param {Mixed} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @api public
 */
EventEmitter.prototype.once = function once(event, fn, context) {
  var listener = new EE(fn, context || this, true)
    , evt = prefix ? prefix + event : event;

  if (!this._events[evt]) this._events[evt] = listener, this._eventsCount++;
  else if (!this._events[evt].fn) this._events[evt].push(listener);
  else this._events[evt] = [this._events[evt], listener];

  return this;
};

/**
 * Remove the listeners of a given event.
 *
 * @param {String|Symbol} event The event name.
 * @param {Function} fn Only remove the listeners that match this function.
 * @param {Mixed} context Only remove the listeners that have this context.
 * @param {Boolean} once Only remove one-time listeners.
 * @returns {EventEmitter} `this`.
 * @api public
 */
EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
  var evt = prefix ? prefix + event : event;

  if (!this._events[evt]) return this;
  if (!fn) {
    if (--this._eventsCount === 0) this._events = new Events();
    else delete this._events[evt];
    return this;
  }

  var listeners = this._events[evt];

  if (listeners.fn) {
    if (
         listeners.fn === fn
      && (!once || listeners.once)
      && (!context || listeners.context === context)
    ) {
      if (--this._eventsCount === 0) this._events = new Events();
      else delete this._events[evt];
    }
  } else {
    for (var i = 0, events = [], length = listeners.length; i < length; i++) {
      if (
           listeners[i].fn !== fn
        || (once && !listeners[i].once)
        || (context && listeners[i].context !== context)
      ) {
        events.push(listeners[i]);
      }
    }

    //
    // Reset the array, or remove it completely if we have no more listeners.
    //
    if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
    else if (--this._eventsCount === 0) this._events = new Events();
    else delete this._events[evt];
  }

  return this;
};

/**
 * Remove all listeners, or those of the specified event.
 *
 * @param {String|Symbol} [event] The event name.
 * @returns {EventEmitter} `this`.
 * @api public
 */
EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
  var evt;

  if (event) {
    evt = prefix ? prefix + event : event;
    if (this._events[evt]) {
      if (--this._eventsCount === 0) this._events = new Events();
      else delete this._events[evt];
    }
  } else {
    this._events = new Events();
    this._eventsCount = 0;
  }

  return this;
};

//
// Alias methods names because people roll like that.
//
EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
EventEmitter.prototype.addListener = EventEmitter.prototype.on;

//
// This function doesn't apply anymore.
//
EventEmitter.prototype.setMaxListeners = function setMaxListeners() {
  return this;
};

//
// Expose the prefix.
//
EventEmitter.prefixed = prefix;

//
// Allow `EventEmitter` to be imported as module namespace.
//
EventEmitter.EventEmitter = EventEmitter;

//
// Expose the module.
//
if ('undefined' !== typeof module) {
  module.exports = EventEmitter;
}

},{}],5:[function(require,module,exports){
/**
 * isMobile.js v0.4.1
 *
 * A simple library to detect Apple phones and tablets,
 * Android phones and tablets, other mobile devices (like blackberry, mini-opera and windows phone),
 * and any kind of seven inch device, via user agent sniffing.
 *
 * @author: Kai Mallea (kmallea@gmail.com)
 *
 * @license: http://creativecommons.org/publicdomain/zero/1.0/
 */
(function (global) {

    var apple_phone         = /iPhone/i,
        apple_ipod          = /iPod/i,
        apple_tablet        = /iPad/i,
        android_phone       = /(?=.*\bAndroid\b)(?=.*\bMobile\b)/i, // Match 'Android' AND 'Mobile'
        android_tablet      = /Android/i,
        amazon_phone        = /(?=.*\bAndroid\b)(?=.*\bSD4930UR\b)/i,
        amazon_tablet       = /(?=.*\bAndroid\b)(?=.*\b(?:KFOT|KFTT|KFJWI|KFJWA|KFSOWI|KFTHWI|KFTHWA|KFAPWI|KFAPWA|KFARWI|KFASWI|KFSAWI|KFSAWA)\b)/i,
        windows_phone       = /Windows Phone/i,
        windows_tablet      = /(?=.*\bWindows\b)(?=.*\bARM\b)/i, // Match 'Windows' AND 'ARM'
        other_blackberry    = /BlackBerry/i,
        other_blackberry_10 = /BB10/i,
        other_opera         = /Opera Mini/i,
        other_chrome        = /(CriOS|Chrome)(?=.*\bMobile\b)/i,
        other_firefox       = /(?=.*\bFirefox\b)(?=.*\bMobile\b)/i, // Match 'Firefox' AND 'Mobile'
        seven_inch = new RegExp(
            '(?:' +         // Non-capturing group

            'Nexus 7' +     // Nexus 7

            '|' +           // OR

            'BNTV250' +     // B&N Nook Tablet 7 inch

            '|' +           // OR

            'Kindle Fire' + // Kindle Fire

            '|' +           // OR

            'Silk' +        // Kindle Fire, Silk Accelerated

            '|' +           // OR

            'GT-P1000' +    // Galaxy Tab 7 inch

            ')',            // End non-capturing group

            'i');           // Case-insensitive matching

    var match = function(regex, userAgent) {
        return regex.test(userAgent);
    };

    var IsMobileClass = function(userAgent) {
        var ua = userAgent || navigator.userAgent;

        // Facebook mobile app's integrated browser adds a bunch of strings that
        // match everything. Strip it out if it exists.
        var tmp = ua.split('[FBAN');
        if (typeof tmp[1] !== 'undefined') {
            ua = tmp[0];
        }

        // Twitter mobile app's integrated browser on iPad adds a "Twitter for
        // iPhone" string. Same probable happens on other tablet platforms.
        // This will confuse detection so strip it out if it exists.
        tmp = ua.split('Twitter');
        if (typeof tmp[1] !== 'undefined') {
            ua = tmp[0];
        }

        this.apple = {
            phone:  match(apple_phone, ua),
            ipod:   match(apple_ipod, ua),
            tablet: !match(apple_phone, ua) && match(apple_tablet, ua),
            device: match(apple_phone, ua) || match(apple_ipod, ua) || match(apple_tablet, ua)
        };
        this.amazon = {
            phone:  match(amazon_phone, ua),
            tablet: !match(amazon_phone, ua) && match(amazon_tablet, ua),
            device: match(amazon_phone, ua) || match(amazon_tablet, ua)
        };
        this.android = {
            phone:  match(amazon_phone, ua) || match(android_phone, ua),
            tablet: !match(amazon_phone, ua) && !match(android_phone, ua) && (match(amazon_tablet, ua) || match(android_tablet, ua)),
            device: match(amazon_phone, ua) || match(amazon_tablet, ua) || match(android_phone, ua) || match(android_tablet, ua)
        };
        this.windows = {
            phone:  match(windows_phone, ua),
            tablet: match(windows_tablet, ua),
            device: match(windows_phone, ua) || match(windows_tablet, ua)
        };
        this.other = {
            blackberry:   match(other_blackberry, ua),
            blackberry10: match(other_blackberry_10, ua),
            opera:        match(other_opera, ua),
            firefox:      match(other_firefox, ua),
            chrome:       match(other_chrome, ua),
            device:       match(other_blackberry, ua) || match(other_blackberry_10, ua) || match(other_opera, ua) || match(other_firefox, ua) || match(other_chrome, ua)
        };
        this.seven_inch = match(seven_inch, ua);
        this.any = this.apple.device || this.android.device || this.windows.device || this.other.device || this.seven_inch;

        // excludes 'other' devices and ipods, targeting touchscreen phones
        this.phone = this.apple.phone || this.android.phone || this.windows.phone;

        // excludes 7 inch devices, classifying as phone or tablet is left to the user
        this.tablet = this.apple.tablet || this.android.tablet || this.windows.tablet;

        if (typeof window === 'undefined') {
            return this;
        }
    };

    var instantiate = function() {
        var IM = new IsMobileClass();
        IM.Class = IsMobileClass;
        return IM;
    };

    if (typeof module !== 'undefined' && module.exports && typeof window === 'undefined') {
        //node
        module.exports = IsMobileClass;
    } else if (typeof module !== 'undefined' && module.exports && typeof window !== 'undefined') {
        //browserify
        module.exports = instantiate();
    } else if (typeof define === 'function' && define.amd) {
        //AMD
        define('isMobile', [], global.isMobile = instantiate());
    } else {
        global.isMobile = instantiate();
    }

})(this);

},{}],6:[function(require,module,exports){
var EMPTY_ARRAY_BUFFER = new ArrayBuffer(0);

/**
 * Helper class to create a webGL buffer
 *
 * @class
 * @memberof PIXI.glCore
 * @param gl {WebGLRenderingContext} The current WebGL rendering context
 * @param type {gl.ARRAY_BUFFER | gl.ELEMENT_ARRAY_BUFFER} @mat
 * @param data {ArrayBuffer| SharedArrayBuffer|ArrayBufferView} an array of data
 * @param drawType {gl.STATIC_DRAW|gl.DYNAMIC_DRAW|gl.STREAM_DRAW}
 */
var Buffer = function(gl, type, data, drawType)
{

	/**
     * The current WebGL rendering context
     *
     * @member {WebGLRenderingContext}
     */
	this.gl = gl;

	/**
     * The WebGL buffer, created upon instantiation
     *
     * @member {WebGLBuffer}
     */
	this.buffer = gl.createBuffer();

	/**
     * The type of the buffer
     *
     * @member {gl.ARRAY_BUFFER|gl.ELEMENT_ARRAY_BUFFER}
     */
	this.type = type || gl.ARRAY_BUFFER;

	/**
     * The draw type of the buffer
     *
     * @member {gl.STATIC_DRAW|gl.DYNAMIC_DRAW|gl.STREAM_DRAW}
     */
	this.drawType = drawType || gl.STATIC_DRAW;

	/**
     * The data in the buffer, as a typed array
     *
     * @member {ArrayBuffer| SharedArrayBuffer|ArrayBufferView}
     */
	this.data = EMPTY_ARRAY_BUFFER;

	if(data)
	{
		this.upload(data);
	}

	this._updateID = 0;
};

/**
 * Uploads the buffer to the GPU
 * @param data {ArrayBuffer| SharedArrayBuffer|ArrayBufferView} an array of data to upload
 * @param offset {Number} if only a subset of the data should be uploaded, this is the amount of data to subtract
 * @param dontBind {Boolean} whether to bind the buffer before uploading it
 */
Buffer.prototype.upload = function(data, offset, dontBind)
{
	// todo - needed?
	if(!dontBind) this.bind();

	var gl = this.gl;

	data = data || this.data;
	offset = offset || 0;

	if(this.data.byteLength >= data.byteLength)
	{
		gl.bufferSubData(this.type, offset, data);
	}
	else
	{
		gl.bufferData(this.type, data, this.drawType);
	}

	this.data = data;
};
/**
 * Binds the buffer
 *
 */
Buffer.prototype.bind = function()
{
	var gl = this.gl;
	gl.bindBuffer(this.type, this.buffer);
};

Buffer.createVertexBuffer = function(gl, data, drawType)
{
	return new Buffer(gl, gl.ARRAY_BUFFER, data, drawType);
};

Buffer.createIndexBuffer = function(gl, data, drawType)
{
	return new Buffer(gl, gl.ELEMENT_ARRAY_BUFFER, data, drawType);
};

Buffer.create = function(gl, type, data, drawType)
{
	return new Buffer(gl, type, data, drawType);
};

/**
 * Destroys the buffer
 *
 */
Buffer.prototype.destroy = function(){
	this.gl.deleteBuffer(this.buffer);
};

module.exports = Buffer;

},{}],7:[function(require,module,exports){

var Texture = require('./GLTexture');

/**
 * Helper class to create a webGL Framebuffer
 *
 * @class
 * @memberof PIXI.glCore
 * @param gl {WebGLRenderingContext} The current WebGL rendering context
 * @param width {Number} the width of the drawing area of the frame buffer
 * @param height {Number} the height of the drawing area of the frame buffer
 */
var Framebuffer = function(gl, width, height)
{
    /**
     * The current WebGL rendering context
     *
     * @member {WebGLRenderingContext}
     */
    this.gl = gl;

    /**
     * The frame buffer
     *
     * @member {WebGLFramebuffer}
     */
    this.framebuffer = gl.createFramebuffer();

    /**
     * The stencil buffer
     *
     * @member {WebGLRenderbuffer}
     */
    this.stencil = null;

    /**
     * The stencil buffer
     *
     * @member {PIXI.glCore.GLTexture}
     */
    this.texture = null;

    /**
     * The width of the drawing area of the buffer
     *
     * @member {Number}
     */
    this.width = width || 100;
    /**
     * The height of the drawing area of the buffer
     *
     * @member {Number}
     */
    this.height = height || 100;
};

/**
 * Adds a texture to the frame buffer
 * @param texture {PIXI.glCore.GLTexture}
 */
Framebuffer.prototype.enableTexture = function(texture)
{
    var gl = this.gl;

    this.texture = texture || new Texture(gl);

    this.texture.bind();

    //gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA,  this.width, this.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

    this.bind();

    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture.texture, 0);
};

/**
 * Initialises the stencil buffer
 */
Framebuffer.prototype.enableStencil = function()
{
    if(this.stencil)return;

    var gl = this.gl;

    this.stencil = gl.createRenderbuffer();

    gl.bindRenderbuffer(gl.RENDERBUFFER, this.stencil);

    // TODO.. this is depth AND stencil?
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.RENDERBUFFER, this.stencil);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_STENCIL,  this.width  , this.height );


};

/**
 * Erases the drawing area and fills it with a colour
 * @param  r {Number} the red value of the clearing colour
 * @param  g {Number} the green value of the clearing colour
 * @param  b {Number} the blue value of the clearing colour
 * @param  a {Number} the alpha value of the clearing colour
 */
Framebuffer.prototype.clear = function( r, g, b, a )
{
    this.bind();

    var gl = this.gl;

    gl.clearColor(r, g, b, a);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
};

/**
 * Binds the frame buffer to the WebGL context
 */
Framebuffer.prototype.bind = function()
{
    var gl = this.gl;
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer );
};

/**
 * Unbinds the frame buffer to the WebGL context
 */
Framebuffer.prototype.unbind = function()
{
    var gl = this.gl;
    gl.bindFramebuffer(gl.FRAMEBUFFER, null );
};
/**
 * Resizes the drawing area of the buffer to the given width and height
 * @param  width  {Number} the new width
 * @param  height {Number} the new height
 */
Framebuffer.prototype.resize = function(width, height)
{
    var gl = this.gl;

    this.width = width;
    this.height = height;

    if ( this.texture )
    {
        this.texture.uploadData(null, width, height);
    }

    if ( this.stencil )
    {
        // update the stencil buffer width and height
        gl.bindRenderbuffer(gl.RENDERBUFFER, this.stencil);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_STENCIL, width, height);
    }
};

/**
 * Destroys this buffer
 */
Framebuffer.prototype.destroy = function()
{
    var gl = this.gl;

    //TODO
    if(this.texture)
    {
        this.texture.destroy();
    }

    gl.deleteFramebuffer(this.framebuffer);

    this.gl = null;

    this.stencil = null;
    this.texture = null;
};

/**
 * Creates a frame buffer with a texture containing the given data
 * @static
 * @param gl {WebGLRenderingContext} The current WebGL rendering context
 * @param width {Number} the width of the drawing area of the frame buffer
 * @param height {Number} the height of the drawing area of the frame buffer
 * @param data {ArrayBuffer| SharedArrayBuffer|ArrayBufferView} an array of data
 */
Framebuffer.createRGBA = function(gl, width, height, data)
{
    var texture = Texture.fromData(gl, null, width, height);
    texture.enableNearestScaling();
    texture.enableWrapClamp();

    //now create the framebuffer object and attach the texture to it.
    var fbo = new Framebuffer(gl, width, height);
    fbo.enableTexture(texture);
    //fbo.enableStencil(); // get this back on soon!

    //fbo.enableStencil(); // get this back on soon!

    fbo.unbind();

    return fbo;
};

/**
 * Creates a frame buffer with a texture containing the given data
 * @static
 * @param gl {WebGLRenderingContext} The current WebGL rendering context
 * @param width {Number} the width of the drawing area of the frame buffer
 * @param height {Number} the height of the drawing area of the frame buffer
 * @param data {ArrayBuffer| SharedArrayBuffer|ArrayBufferView} an array of data
 */
Framebuffer.createFloat32 = function(gl, width, height, data)
{
    // create a new texture..
    var texture = new Texture.fromData(gl, data, width, height);
    texture.enableNearestScaling();
    texture.enableWrapClamp();

    //now create the framebuffer object and attach the texture to it.
    var fbo = new Framebuffer(gl, width, height);
    fbo.enableTexture(texture);

    fbo.unbind();

    return fbo;
};

module.exports = Framebuffer;

},{"./GLTexture":9}],8:[function(require,module,exports){

var compileProgram = require('./shader/compileProgram'),
	extractAttributes = require('./shader/extractAttributes'),
	extractUniforms = require('./shader/extractUniforms'),
	setPrecision = require('./shader/setPrecision'),
	generateUniformAccessObject = require('./shader/generateUniformAccessObject');

/**
 * Helper class to create a webGL Shader
 *
 * @class
 * @memberof PIXI.glCore
 * @param gl {WebGLRenderingContext}
 * @param vertexSrc {string|string[]} The vertex shader source as an array of strings.
 * @param fragmentSrc {string|string[]} The fragment shader source as an array of strings.
 * @param precision {string} The float precision of the shader. Options are 'lowp', 'mediump' or 'highp'.
 * @param attributeLocations {object} A key value pair showing which location eact attribute should sit eg {position:0, uvs:1}
 */
var Shader = function(gl, vertexSrc, fragmentSrc, precision, attributeLocations)
{
	/**
	 * The current WebGL rendering context
	 *
	 * @member {WebGLRenderingContext}
	 */
	this.gl = gl;

	if(precision)
	{
		vertexSrc = setPrecision(vertexSrc, precision);
		fragmentSrc = setPrecision(fragmentSrc, precision);
	}

	/**
	 * The shader program
	 *
	 * @member {WebGLProgram}
	 */
	// First compile the program..
	this.program = compileProgram(gl, vertexSrc, fragmentSrc, attributeLocations);

	/**
	 * The attributes of the shader as an object containing the following properties
	 * {
	 * 	type,
	 * 	size,
	 * 	location,
	 * 	pointer
	 * }
	 * @member {Object}
	 */
	// next extract the attributes
	this.attributes = extractAttributes(gl, this.program);

    this.uniformData = extractUniforms(gl, this.program);

	/**
	 * The uniforms of the shader as an object containing the following properties
	 * {
	 * 	gl,
	 * 	data
	 * }
	 * @member {Object}
	 */
	this.uniforms = generateUniformAccessObject( gl, this.uniformData );

};
/**
 * Uses this shader
 * 
 * @return {PIXI.glCore.GLShader} Returns itself.
 */
Shader.prototype.bind = function()
{
	this.gl.useProgram(this.program);
	return this;
};

/**
 * Destroys this shader
 * TODO
 */
Shader.prototype.destroy = function()
{
	this.attributes = null;
	this.uniformData = null;
	this.uniforms = null;

	var gl = this.gl;
	gl.deleteProgram(this.program);
};


module.exports = Shader;

},{"./shader/compileProgram":14,"./shader/extractAttributes":16,"./shader/extractUniforms":17,"./shader/generateUniformAccessObject":18,"./shader/setPrecision":22}],9:[function(require,module,exports){

/**
 * Helper class to create a WebGL Texture
 *
 * @class
 * @memberof PIXI.glCore
 * @param gl {WebGLRenderingContext} The current WebGL context
 * @param width {number} the width of the texture
 * @param height {number} the height of the texture
 * @param format {number} the pixel format of the texture. defaults to gl.RGBA
 * @param type {number} the gl type of the texture. defaults to gl.UNSIGNED_BYTE
 */
var Texture = function(gl, width, height, format, type)
{
	/**
	 * The current WebGL rendering context
	 *
	 * @member {WebGLRenderingContext}
	 */
	this.gl = gl;


	/**
	 * The WebGL texture
	 *
	 * @member {WebGLTexture}
	 */
	this.texture = gl.createTexture();

	/**
	 * If mipmapping was used for this texture, enable and disable with enableMipmap()
	 *
	 * @member {Boolean}
	 */
	// some settings..
	this.mipmap = false;


	/**
	 * Set to true to enable pre-multiplied alpha
	 *
	 * @member {Boolean}
	 */
	this.premultiplyAlpha = false;

	/**
	 * The width of texture
	 *
	 * @member {Number}
	 */
	this.width = width || -1;
	/**
	 * The height of texture
	 *
	 * @member {Number}
	 */
	this.height = height || -1;

	/**
	 * The pixel format of the texture. defaults to gl.RGBA
	 *
	 * @member {Number}
	 */
	this.format = format || gl.RGBA;

	/**
	 * The gl type of the texture. defaults to gl.UNSIGNED_BYTE
	 *
	 * @member {Number}
	 */
	this.type = type || gl.UNSIGNED_BYTE;


};

/**
 * Uploads this texture to the GPU
 * @param source {HTMLImageElement|ImageData|HTMLVideoElement} the source image of the texture
 */
Texture.prototype.upload = function(source)
{
	this.bind();

	var gl = this.gl;


	gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, this.premultiplyAlpha);

	var newWidth = source.videoWidth || source.width;
	var newHeight = source.videoHeight || source.height;

	if(newHeight !== this.height || newWidth !== this.width)
	{
		gl.texImage2D(gl.TEXTURE_2D, 0, this.format, this.format, this.type, source);
	}
	else
	{
    	gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, this.format, this.type, source);
	}

	// if the source is a video, we need to use the videoWidth / videoHeight properties as width / height will be incorrect.
	this.width = newWidth;
	this.height = newHeight;

};

var FLOATING_POINT_AVAILABLE = false;

/**
 * Use a data source and uploads this texture to the GPU
 * @param data {TypedArray} the data to upload to the texture
 * @param width {number} the new width of the texture
 * @param height {number} the new height of the texture
 */
Texture.prototype.uploadData = function(data, width, height)
{
	this.bind();

	var gl = this.gl;


	if(data instanceof Float32Array)
	{
		if(!FLOATING_POINT_AVAILABLE)
		{
			var ext = gl.getExtension("OES_texture_float");

			if(ext)
			{
				FLOATING_POINT_AVAILABLE = true;
			}
			else
			{
				throw new Error('floating point textures not available');
			}
		}

		this.type = gl.FLOAT;
	}
	else
	{
		// TODO support for other types
		this.type = this.type || gl.UNSIGNED_BYTE;
	}

	// what type of data?
	gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, this.premultiplyAlpha);


	if(width !== this.width || height !== this.height)
	{
		gl.texImage2D(gl.TEXTURE_2D, 0, this.format,  width, height, 0, this.format, this.type, data || null);
	}
	else
	{
		gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, width, height, this.format, this.type, data || null);
	}

	this.width = width;
	this.height = height;


//	texSubImage2D
};

/**
 * Binds the texture
 * @param  location
 */
Texture.prototype.bind = function(location)
{
	var gl = this.gl;

	if(location !== undefined)
	{
		gl.activeTexture(gl.TEXTURE0 + location);
	}

	gl.bindTexture(gl.TEXTURE_2D, this.texture);
};

/**
 * Unbinds the texture
 */
Texture.prototype.unbind = function()
{
	var gl = this.gl;
	gl.bindTexture(gl.TEXTURE_2D, null);
};

/**
 * @param linear {Boolean} if we want to use linear filtering or nearest neighbour interpolation
 */
Texture.prototype.minFilter = function( linear )
{
	var gl = this.gl;

	this.bind();

	if(this.mipmap)
	{
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, linear ? gl.LINEAR_MIPMAP_LINEAR : gl.NEAREST_MIPMAP_NEAREST);
	}
	else
	{
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, linear ? gl.LINEAR : gl.NEAREST);
	}
};

/**
 * @param linear {Boolean} if we want to use linear filtering or nearest neighbour interpolation
 */
Texture.prototype.magFilter = function( linear )
{
	var gl = this.gl;

	this.bind();

	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, linear ? gl.LINEAR : gl.NEAREST);
};

/**
 * Enables mipmapping
 */
Texture.prototype.enableMipmap = function()
{
	var gl = this.gl;

	this.bind();

	this.mipmap = true;

	gl.generateMipmap(gl.TEXTURE_2D);
};

/**
 * Enables linear filtering
 */
Texture.prototype.enableLinearScaling = function()
{
	this.minFilter(true);
	this.magFilter(true);
};

/**
 * Enables nearest neighbour interpolation
 */
Texture.prototype.enableNearestScaling = function()
{
	this.minFilter(false);
	this.magFilter(false);
};

/**
 * Enables clamping on the texture so WebGL will not repeat it
 */
Texture.prototype.enableWrapClamp = function()
{
	var gl = this.gl;

	this.bind();

	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
};

/**
 * Enable tiling on the texture
 */
Texture.prototype.enableWrapRepeat = function()
{
	var gl = this.gl;

	this.bind();

	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
};

Texture.prototype.enableWrapMirrorRepeat = function()
{
	var gl = this.gl;

	this.bind();

	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
};


/**
 * Destroys this texture
 */
Texture.prototype.destroy = function()
{
	var gl = this.gl;
	//TODO
	gl.deleteTexture(this.texture);
};

/**
 * @static
 * @param gl {WebGLRenderingContext} The current WebGL context
 * @param source {HTMLImageElement|ImageData} the source image of the texture
 * @param premultiplyAlpha {Boolean} If we want to use pre-multiplied alpha
 */
Texture.fromSource = function(gl, source, premultiplyAlpha)
{
	var texture = new Texture(gl);
	texture.premultiplyAlpha = premultiplyAlpha || false;
	texture.upload(source);

	return texture;
};

/**
 * @static
 * @param gl {WebGLRenderingContext} The current WebGL context
 * @param data {TypedArray} the data to upload to the texture
 * @param width {number} the new width of the texture
 * @param height {number} the new height of the texture
 */
Texture.fromData = function(gl, data, width, height)
{
	//console.log(data, width, height);
	var texture = new Texture(gl);
	texture.uploadData(data, width, height);

	return texture;
};


module.exports = Texture;

},{}],10:[function(require,module,exports){

// state object//
var setVertexAttribArrays = require( './setVertexAttribArrays' );

/**
 * Helper class to work with WebGL VertexArrayObjects (vaos)
 * Only works if WebGL extensions are enabled (they usually are)
 *
 * @class
 * @memberof PIXI.glCore
 * @param gl {WebGLRenderingContext} The current WebGL rendering context
 */
function VertexArrayObject(gl, state)
{
    this.nativeVaoExtension = null;

    if(!VertexArrayObject.FORCE_NATIVE)
    {
        this.nativeVaoExtension = gl.getExtension('OES_vertex_array_object') ||
                                  gl.getExtension('MOZ_OES_vertex_array_object') ||
                                  gl.getExtension('WEBKIT_OES_vertex_array_object');
    }

    this.nativeState = state;

    if(this.nativeVaoExtension)
    {
        this.nativeVao = this.nativeVaoExtension.createVertexArrayOES();

        var maxAttribs = gl.getParameter(gl.MAX_VERTEX_ATTRIBS);

        // VAO - overwrite the state..
        this.nativeState = {
            tempAttribState: new Array(maxAttribs),
            attribState: new Array(maxAttribs)
        };
    }

    /**
     * The current WebGL rendering context
     *
     * @member {WebGLRenderingContext}
     */
    this.gl = gl;

    /**
     * An array of attributes
     *
     * @member {Array}
     */
    this.attributes = [];

    /**
     * @member {PIXI.glCore.GLBuffer}
     */
    this.indexBuffer = null;

    /**
     * A boolean flag
     *
     * @member {Boolean}
     */
    this.dirty = false;
}

VertexArrayObject.prototype.constructor = VertexArrayObject;
module.exports = VertexArrayObject;

/**
* Some devices behave a bit funny when using the newer extensions (im looking at you ipad 2!)
* If you find on older devices that things have gone a bit weird then set this to true.
*/
/**
 * Lets the VAO know if you should use the WebGL extension or the native methods.
 * Some devices behave a bit funny when using the newer extensions (im looking at you ipad 2!)
 * If you find on older devices that things have gone a bit weird then set this to true.
 * @static
 * @property {Boolean} FORCE_NATIVE
 */
VertexArrayObject.FORCE_NATIVE = false;

/**
 * Binds the buffer
 */
VertexArrayObject.prototype.bind = function()
{
    if(this.nativeVao)
    {
        this.nativeVaoExtension.bindVertexArrayOES(this.nativeVao);

        if(this.dirty)
        {
            this.dirty = false;
            this.activate();
            return this;
        }
        if (this.indexBuffer)
        {
            this.indexBuffer.bind();
        }
    }
    else
    {
        this.activate();
    }

    return this;
};

/**
 * Unbinds the buffer
 */
VertexArrayObject.prototype.unbind = function()
{
    if(this.nativeVao)
    {
        this.nativeVaoExtension.bindVertexArrayOES(null);
    }

    return this;
};

/**
 * Uses this vao
 */
VertexArrayObject.prototype.activate = function()
{

    var gl = this.gl;
    var lastBuffer = null;

    for (var i = 0; i < this.attributes.length; i++)
    {
        var attrib = this.attributes[i];

        if(lastBuffer !== attrib.buffer)
        {
            attrib.buffer.bind();
            lastBuffer = attrib.buffer;
        }

        gl.vertexAttribPointer(attrib.attribute.location,
                               attrib.attribute.size,
                               attrib.type || gl.FLOAT,
                               attrib.normalized || false,
                               attrib.stride || 0,
                               attrib.start || 0);
    }

    setVertexAttribArrays(gl, this.attributes, this.nativeState);

    if(this.indexBuffer)
    {
        this.indexBuffer.bind();
    }

    return this;
};

/**
 *
 * @param buffer     {PIXI.gl.GLBuffer}
 * @param attribute  {*}
 * @param type       {String}
 * @param normalized {Boolean}
 * @param stride     {Number}
 * @param start      {Number}
 */
VertexArrayObject.prototype.addAttribute = function(buffer, attribute, type, normalized, stride, start)
{
    this.attributes.push({
        buffer:     buffer,
        attribute:  attribute,

        location:   attribute.location,
        type:       type || this.gl.FLOAT,
        normalized: normalized || false,
        stride:     stride || 0,
        start:      start || 0
    });

    this.dirty = true;

    return this;
};

/**
 *
 * @param buffer   {PIXI.gl.GLBuffer}
 */
VertexArrayObject.prototype.addIndex = function(buffer/*, options*/)
{
    this.indexBuffer = buffer;

    this.dirty = true;

    return this;
};

/**
 * Unbinds this vao and disables it
 */
VertexArrayObject.prototype.clear = function()
{
    // var gl = this.gl;

    // TODO - should this function unbind after clear?
    // for now, no but lets see what happens in the real world!
    if(this.nativeVao)
    {
        this.nativeVaoExtension.bindVertexArrayOES(this.nativeVao);
    }

    this.attributes.length = 0;
    this.indexBuffer = null;

    return this;
};

/**
 * @param type  {Number}
 * @param size  {Number}
 * @param start {Number}
 */
VertexArrayObject.prototype.draw = function(type, size, start)
{
    var gl = this.gl;

    if(this.indexBuffer)
    {
        gl.drawElements(type, size || this.indexBuffer.data.length, gl.UNSIGNED_SHORT, (start || 0) * 2 );
    }
    else
    {
        // TODO need a better way to calculate size..
        gl.drawArrays(type, start, size || this.getSize());
    }

    return this;
};

/**
 * Destroy this vao
 */
VertexArrayObject.prototype.destroy = function()
{
    // lose references
    this.gl = null;
    this.indexBuffer = null;
    this.attributes = null;
    this.nativeState = null;

    if(this.nativeVao)
    {
        this.nativeVaoExtension.deleteVertexArrayOES(this.nativeVao);
    }

    this.nativeVaoExtension = null;
    this.nativeVao = null;
};

VertexArrayObject.prototype.getSize = function()
{
    var attrib = this.attributes[0];
    return attrib.buffer.data.length / (( attrib.stride/4 ) || attrib.attribute.size);
};

},{"./setVertexAttribArrays":13}],11:[function(require,module,exports){

/**
 * Helper class to create a webGL Context
 *
 * @class
 * @memberof PIXI.glCore
 * @param canvas {HTMLCanvasElement} the canvas element that we will get the context from
 * @param options {Object} An options object that gets passed in to the canvas element containing the context attributes,
 *                         see https://developer.mozilla.org/en/docs/Web/API/HTMLCanvasElement/getContext for the options available
 * @return {WebGLRenderingContext} the WebGL context
 */
var createContext = function(canvas, options)
{
    var gl = canvas.getContext('webgl', options) || 
         canvas.getContext('experimental-webgl', options);

    if (!gl)
    {
        // fail, not able to get a context
        throw new Error('This browser does not support webGL. Try using the canvas renderer');
    }

    return gl;
};

module.exports = createContext;

},{}],12:[function(require,module,exports){
var gl = {
    createContext:          require('./createContext'),
    setVertexAttribArrays:  require('./setVertexAttribArrays'),
    GLBuffer:               require('./GLBuffer'),
    GLFramebuffer:          require('./GLFramebuffer'),
    GLShader:               require('./GLShader'),
    GLTexture:              require('./GLTexture'),
    VertexArrayObject:      require('./VertexArrayObject'),
    shader:                 require('./shader')
};

// Export for Node-compatible environments
if (typeof module !== 'undefined' && module.exports)
{
    // Export the module
    module.exports = gl;
}

// Add to the browser window pixi.gl
if (typeof window !== 'undefined')
{
    // add the window object
    window.PIXI = window.PIXI || {};
    window.PIXI.glCore = gl;
}

},{"./GLBuffer":6,"./GLFramebuffer":7,"./GLShader":8,"./GLTexture":9,"./VertexArrayObject":10,"./createContext":11,"./setVertexAttribArrays":13,"./shader":19}],13:[function(require,module,exports){
// var GL_MAP = {};

/**
 * @param gl {WebGLRenderingContext} The current WebGL context
 * @param attribs {*}
 * @param state {*}
 */
var setVertexAttribArrays = function (gl, attribs, state)
{
    var i;
    if(state)
    {
        var tempAttribState = state.tempAttribState,
            attribState = state.attribState;

        for (i = 0; i < tempAttribState.length; i++)
        {
            tempAttribState[i] = false;
        }

        // set the new attribs
        for (i = 0; i < attribs.length; i++)
        {
            tempAttribState[attribs[i].attribute.location] = true;
        }

        for (i = 0; i < attribState.length; i++)
        {
            if (attribState[i] !== tempAttribState[i])
            {
                attribState[i] = tempAttribState[i];

                if (state.attribState[i])
                {
                    gl.enableVertexAttribArray(i);
                }
                else
                {
                    gl.disableVertexAttribArray(i);
                }
            }
        }

    }
    else
    {
        for (i = 0; i < attribs.length; i++)
        {
            var attrib = attribs[i];
            gl.enableVertexAttribArray(attrib.attribute.location);
        }
    }
};

module.exports = setVertexAttribArrays;

},{}],14:[function(require,module,exports){

/**
 * @class
 * @memberof PIXI.glCore.shader
 * @param gl {WebGLRenderingContext} The current WebGL context {WebGLProgram}
 * @param vertexSrc {string|string[]} The vertex shader source as an array of strings.
 * @param fragmentSrc {string|string[]} The fragment shader source as an array of strings.
 * @param attributeLocations {Object} An attribute location map that lets you manually set the attribute locations
 * @return {WebGLProgram} the shader program
 */
var compileProgram = function(gl, vertexSrc, fragmentSrc, attributeLocations)
{
    var glVertShader = compileShader(gl, gl.VERTEX_SHADER, vertexSrc);
    var glFragShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSrc);

    var program = gl.createProgram();

    gl.attachShader(program, glVertShader);
    gl.attachShader(program, glFragShader);

    // optionally, set the attributes manually for the program rather than letting WebGL decide..
    if(attributeLocations)
    {
        for(var i in attributeLocations)
        {
            gl.bindAttribLocation(program, attributeLocations[i], i);
        }
    }


    gl.linkProgram(program);

    // if linking fails, then log and cleanup
    if (!gl.getProgramParameter(program, gl.LINK_STATUS))
    {
        console.error('Pixi.js Error: Could not initialize shader.');
        console.error('gl.VALIDATE_STATUS', gl.getProgramParameter(program, gl.VALIDATE_STATUS));
        console.error('gl.getError()', gl.getError());

        // if there is a program info log, log it
        if (gl.getProgramInfoLog(program) !== '')
        {
            console.warn('Pixi.js Warning: gl.getProgramInfoLog()', gl.getProgramInfoLog(program));
        }

        gl.deleteProgram(program);
        program = null;
    }

    // clean up some shaders
    gl.deleteShader(glVertShader);
    gl.deleteShader(glFragShader);

    return program;
};

/**
 * @private
 * @param gl {WebGLRenderingContext} The current WebGL context {WebGLProgram}
 * @param type {Number} the type, can be either VERTEX_SHADER or FRAGMENT_SHADER
 * @param vertexSrc {string|string[]} The vertex shader source as an array of strings.
 * @return {WebGLShader} the shader
 */
var compileShader = function (gl, type, src)
{
    var shader = gl.createShader(type);

    gl.shaderSource(shader, src);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
    {
        console.log(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
};

module.exports = compileProgram;

},{}],15:[function(require,module,exports){
/**
 * @class
 * @memberof PIXI.glCore.shader
 * @param type {String} Type of value
 * @param size {Number}
 */
var defaultValue = function(type, size) 
{
    switch (type)
    {
        case 'float':
            return 0;

        case 'vec2': 
            return new Float32Array(2 * size);

        case 'vec3':
            return new Float32Array(3 * size);

        case 'vec4':     
            return new Float32Array(4 * size);
            
        case 'int':
        case 'sampler2D':
            return 0;

        case 'ivec2':   
            return new Int32Array(2 * size);

        case 'ivec3':
            return new Int32Array(3 * size);

        case 'ivec4': 
            return new Int32Array(4 * size);

        case 'bool':     
            return false;

        case 'bvec2':

            return booleanArray( 2 * size);

        case 'bvec3':
            return booleanArray(3 * size);

        case 'bvec4':
            return booleanArray(4 * size);

        case 'mat2':
            return new Float32Array([1, 0,
                                     0, 1]);

        case 'mat3': 
            return new Float32Array([1, 0, 0,
                                     0, 1, 0,
                                     0, 0, 1]);

        case 'mat4':
            return new Float32Array([1, 0, 0, 0,
                                     0, 1, 0, 0,
                                     0, 0, 1, 0,
                                     0, 0, 0, 1]);
    }
};

var booleanArray = function(size)
{
    var array = new Array(size);

    for (var i = 0; i < array.length; i++) 
    {
        array[i] = false;
    }

    return array;
};

module.exports = defaultValue;

},{}],16:[function(require,module,exports){

var mapType = require('./mapType');
var mapSize = require('./mapSize');

/**
 * Extracts the attributes
 * @class
 * @memberof PIXI.glCore.shader
 * @param gl {WebGLRenderingContext} The current WebGL rendering context
 * @param program {WebGLProgram} The shader program to get the attributes from
 * @return attributes {Object}
 */
var extractAttributes = function(gl, program)
{
    var attributes = {};

    var totalAttributes = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);

    for (var i = 0; i < totalAttributes; i++)
    {
        var attribData = gl.getActiveAttrib(program, i);
        var type = mapType(gl, attribData.type);

        attributes[attribData.name] = {
            type:type,
            size:mapSize(type),
            location:gl.getAttribLocation(program, attribData.name),
            //TODO - make an attribute object
            pointer: pointer
        };
    }

    return attributes;
};

var pointer = function(type, normalized, stride, start){
    // console.log(this.location)
    gl.vertexAttribPointer(this.location,this.size, type || gl.FLOAT, normalized || false, stride || 0, start || 0);
};

module.exports = extractAttributes;

},{"./mapSize":20,"./mapType":21}],17:[function(require,module,exports){
var mapType = require('./mapType');
var defaultValue = require('./defaultValue');

/**
 * Extracts the uniforms
 * @class
 * @memberof PIXI.glCore.shader
 * @param gl {WebGLRenderingContext} The current WebGL rendering context
 * @param program {WebGLProgram} The shader program to get the uniforms from
 * @return uniforms {Object}
 */
var extractUniforms = function(gl, program)
{
	var uniforms = {};

    var totalUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);

    for (var i = 0; i < totalUniforms; i++)
    {
    	var uniformData = gl.getActiveUniform(program, i);
    	var name = uniformData.name.replace(/\[.*?\]/, "");
        var type = mapType(gl, uniformData.type );

    	uniforms[name] = {
    		type:type,
    		size:uniformData.size,
    		location:gl.getUniformLocation(program, name),
    		value:defaultValue(type, uniformData.size)
    	};
    }

	return uniforms;
};

module.exports = extractUniforms;

},{"./defaultValue":15,"./mapType":21}],18:[function(require,module,exports){
/**
 * Extracts the attributes
 * @class
 * @memberof PIXI.glCore.shader
 * @param gl {WebGLRenderingContext} The current WebGL rendering context
 * @param uniforms {Array} @mat ?
 * @return attributes {Object}
 */
var generateUniformAccessObject = function(gl, uniformData)
{
    // this is the object we will be sending back.
    // an object hierachy will be created for structs
    var uniforms = {data:{}};

    uniforms.gl = gl;

    var uniformKeys= Object.keys(uniformData);

    for (var i = 0; i < uniformKeys.length; i++)
    {
        var fullName = uniformKeys[i];

        var nameTokens = fullName.split('.');
        var name = nameTokens[nameTokens.length - 1];


        var uniformGroup = getUniformGroup(nameTokens, uniforms);

        var uniform =  uniformData[fullName];
        uniformGroup.data[name] = uniform;

        uniformGroup.gl = gl;

        Object.defineProperty(uniformGroup, name, {
            get: generateGetter(name),
            set: generateSetter(name, uniform)
        });
    }

    return uniforms;
};

var generateGetter = function(name)
{
    return function() {
        return this.data[name].value;
    };
};

var GLSL_SINGLE_SETTERS = {
    float: function setSingleFloat(gl, location, value) { gl.uniform1f(location, value); },
    vec2: function setSingleVec2(gl, location, value) { gl.uniform2f(location, value[0], value[1]); },
    vec3: function setSingleVec3(gl, location, value) { gl.uniform3f(location, value[0], value[1], value[2]); },
    vec4: function setSingleVec4(gl, location, value) { gl.uniform4f(location, value[0], value[1], value[2], value[3]); },

    int: function setSingleInt(gl, location, value) { gl.uniform1i(location, value); },
    ivec2: function setSingleIvec2(gl, location, value) { gl.uniform2i(location, value[0], value[1]); },
    ivec3: function setSingleIvec3(gl, location, value) { gl.uniform3i(location, value[0], value[1], value[2]); },
    ivec4: function setSingleIvec4(gl, location, value) { gl.uniform4i(location, value[0], value[1], value[2], value[3]); },

    bool: function setSingleBool(gl, location, value) { gl.uniform1i(location, value); },
    bvec2: function setSingleBvec2(gl, location, value) { gl.uniform2i(location, value[0], value[1]); },
    bvec3: function setSingleBvec3(gl, location, value) { gl.uniform3i(location, value[0], value[1], value[2]); },
    bvec4: function setSingleBvec4(gl, location, value) { gl.uniform4i(location, value[0], value[1], value[2], value[3]); },

    mat2: function setSingleMat2(gl, location, value) { gl.uniformMatrix2fv(location, false, value); },
    mat3: function setSingleMat3(gl, location, value) { gl.uniformMatrix3fv(location, false, value); },
    mat4: function setSingleMat4(gl, location, value) { gl.uniformMatrix4fv(location, false, value); },

    sampler2D: function setSingleSampler2D(gl, location, value) { gl.uniform1i(location, value); },
};

var GLSL_ARRAY_SETTERS = {
    float: function setFloatArray(gl, location, value) { gl.uniform1fv(location, value); },
    vec2: function setVec2Array(gl, location, value) { gl.uniform2fv(location, value); },
    vec3: function setVec3Array(gl, location, value) { gl.uniform3fv(location, value); },
    vec4: function setVec4Array(gl, location, value) { gl.uniform4fv(location, value); },
    int: function setIntArray(gl, location, value) { gl.uniform1iv(location, value); },
    ivec2: function setIvec2Array(gl, location, value) { gl.uniform2iv(location, value); },
    ivec3: function setIvec3Array(gl, location, value) { gl.uniform3iv(location, value); },
    ivec4: function setIvec4Array(gl, location, value) { gl.uniform4iv(location, value); },
    bool: function setBoolArray(gl, location, value) { gl.uniform1iv(location, value); },
    bvec2: function setBvec2Array(gl, location, value) { gl.uniform2iv(location, value); },
    bvec3: function setBvec3Array(gl, location, value) { gl.uniform3iv(location, value); },
    bvec4: function setBvec4Array(gl, location, value) { gl.uniform4iv(location, value); },
    sampler2D: function setSampler2DArray(gl, location, value) { gl.uniform1iv(location, value); },
};

function generateSetter(name, uniform)
{
    return function(value) {
        this.data[name].value = value;
        var location = this.data[name].location;
        if (uniform.size === 1)
        {
            GLSL_SINGLE_SETTERS[uniform.type](this.gl, location, value);
        }
        else
        {
            // glslSetArray(gl, location, type, value) {
            GLSL_ARRAY_SETTERS[uniform.type](this.gl, location, value);
        }
    };
}

function getUniformGroup(nameTokens, uniform)
{
    var cur = uniform;

    for (var i = 0; i < nameTokens.length - 1; i++)
    {
        var o = cur[nameTokens[i]] || {data:{}};
        cur[nameTokens[i]] = o;
        cur = o;
    }

    return cur;
}


module.exports = generateUniformAccessObject;

},{}],19:[function(require,module,exports){
module.exports = {
    compileProgram: require('./compileProgram'),
    defaultValue: require('./defaultValue'),
    extractAttributes: require('./extractAttributes'),
    extractUniforms: require('./extractUniforms'),
    generateUniformAccessObject: require('./generateUniformAccessObject'),
    setPrecision: require('./setPrecision'),
    mapSize: require('./mapSize'),
    mapType: require('./mapType')
};
},{"./compileProgram":14,"./defaultValue":15,"./extractAttributes":16,"./extractUniforms":17,"./generateUniformAccessObject":18,"./mapSize":20,"./mapType":21,"./setPrecision":22}],20:[function(require,module,exports){
/**
 * @class
 * @memberof PIXI.glCore.shader
 * @param type {String}
 * @return {Number}
 */
var mapSize = function(type) 
{ 
    return GLSL_TO_SIZE[type];
};


var GLSL_TO_SIZE = {
    'float':    1,
    'vec2':     2,
    'vec3':     3,
    'vec4':     4,

    'int':      1,
    'ivec2':    2,
    'ivec3':    3,
    'ivec4':    4,

    'bool':     1,
    'bvec2':    2,
    'bvec3':    3,
    'bvec4':    4,

    'mat2':     4,
    'mat3':     9,
    'mat4':     16,

    'sampler2D':  1
};

module.exports = mapSize;

},{}],21:[function(require,module,exports){


var mapType = function(gl, type) 
{
    if(!GL_TABLE) 
    {
        var typeNames = Object.keys(GL_TO_GLSL_TYPES);

        GL_TABLE = {};

        for(var i = 0; i < typeNames.length; ++i) 
        {
            var tn = typeNames[i];
            GL_TABLE[ gl[tn] ] = GL_TO_GLSL_TYPES[tn];
        }
    }

  return GL_TABLE[type];
};

var GL_TABLE = null;

var GL_TO_GLSL_TYPES = {
  'FLOAT':       'float',
  'FLOAT_VEC2':  'vec2',
  'FLOAT_VEC3':  'vec3',
  'FLOAT_VEC4':  'vec4',

  'INT':         'int',
  'INT_VEC2':    'ivec2',
  'INT_VEC3':    'ivec3',
  'INT_VEC4':    'ivec4',
  
  'BOOL':        'bool',
  'BOOL_VEC2':   'bvec2',
  'BOOL_VEC3':   'bvec3',
  'BOOL_VEC4':   'bvec4',
  
  'FLOAT_MAT2':  'mat2',
  'FLOAT_MAT3':  'mat3',
  'FLOAT_MAT4':  'mat4',
  
  'SAMPLER_2D':  'sampler2D'  
};

module.exports = mapType;

},{}],22:[function(require,module,exports){
/**
 * Sets the float precision on the shader. If the precision is already present this function will do nothing
 * @param {string} src       the shader source
 * @param {string} precision The float precision of the shader. Options are 'lowp', 'mediump' or 'highp'.
 *
 * @return {string} modified shader source
 */
var setPrecision = function(src, precision)
{
    if(src.substring(0, 9) !== 'precision')
    {
        return 'precision ' + precision + ' float;\n' + src;
    }

    return src;
};

module.exports = setPrecision;

},{}],23:[function(require,module,exports){
(function (global){
/*! https://mths.be/punycode v1.4.1 by @mathias */
;(function(root) {

	/** Detect free variables */
	var freeExports = typeof exports == 'object' && exports &&
		!exports.nodeType && exports;
	var freeModule = typeof module == 'object' && module &&
		!module.nodeType && module;
	var freeGlobal = typeof global == 'object' && global;
	if (
		freeGlobal.global === freeGlobal ||
		freeGlobal.window === freeGlobal ||
		freeGlobal.self === freeGlobal
	) {
		root = freeGlobal;
	}

	/**
	 * The `punycode` object.
	 * @name punycode
	 * @type Object
	 */
	var punycode,

	/** Highest positive signed 32-bit float value */
	maxInt = 2147483647, // aka. 0x7FFFFFFF or 2^31-1

	/** Bootstring parameters */
	base = 36,
	tMin = 1,
	tMax = 26,
	skew = 38,
	damp = 700,
	initialBias = 72,
	initialN = 128, // 0x80
	delimiter = '-', // '\x2D'

	/** Regular expressions */
	regexPunycode = /^xn--/,
	regexNonASCII = /[^\x20-\x7E]/, // unprintable ASCII chars + non-ASCII chars
	regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g, // RFC 3490 separators

	/** Error messages */
	errors = {
		'overflow': 'Overflow: input needs wider integers to process',
		'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
		'invalid-input': 'Invalid input'
	},

	/** Convenience shortcuts */
	baseMinusTMin = base - tMin,
	floor = Math.floor,
	stringFromCharCode = String.fromCharCode,

	/** Temporary variable */
	key;

	/*--------------------------------------------------------------------------*/

	/**
	 * A generic error utility function.
	 * @private
	 * @param {String} type The error type.
	 * @returns {Error} Throws a `RangeError` with the applicable error message.
	 */
	function error(type) {
		throw new RangeError(errors[type]);
	}

	/**
	 * A generic `Array#map` utility function.
	 * @private
	 * @param {Array} array The array to iterate over.
	 * @param {Function} callback The function that gets called for every array
	 * item.
	 * @returns {Array} A new array of values returned by the callback function.
	 */
	function map(array, fn) {
		var length = array.length;
		var result = [];
		while (length--) {
			result[length] = fn(array[length]);
		}
		return result;
	}

	/**
	 * A simple `Array#map`-like wrapper to work with domain name strings or email
	 * addresses.
	 * @private
	 * @param {String} domain The domain name or email address.
	 * @param {Function} callback The function that gets called for every
	 * character.
	 * @returns {Array} A new string of characters returned by the callback
	 * function.
	 */
	function mapDomain(string, fn) {
		var parts = string.split('@');
		var result = '';
		if (parts.length > 1) {
			// In email addresses, only the domain name should be punycoded. Leave
			// the local part (i.e. everything up to `@`) intact.
			result = parts[0] + '@';
			string = parts[1];
		}
		// Avoid `split(regex)` for IE8 compatibility. See #17.
		string = string.replace(regexSeparators, '\x2E');
		var labels = string.split('.');
		var encoded = map(labels, fn).join('.');
		return result + encoded;
	}

	/**
	 * Creates an array containing the numeric code points of each Unicode
	 * character in the string. While JavaScript uses UCS-2 internally,
	 * this function will convert a pair of surrogate halves (each of which
	 * UCS-2 exposes as separate characters) into a single code point,
	 * matching UTF-16.
	 * @see `punycode.ucs2.encode`
	 * @see <https://mathiasbynens.be/notes/javascript-encoding>
	 * @memberOf punycode.ucs2
	 * @name decode
	 * @param {String} string The Unicode input string (UCS-2).
	 * @returns {Array} The new array of code points.
	 */
	function ucs2decode(string) {
		var output = [],
		    counter = 0,
		    length = string.length,
		    value,
		    extra;
		while (counter < length) {
			value = string.charCodeAt(counter++);
			if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
				// high surrogate, and there is a next character
				extra = string.charCodeAt(counter++);
				if ((extra & 0xFC00) == 0xDC00) { // low surrogate
					output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
				} else {
					// unmatched surrogate; only append this code unit, in case the next
					// code unit is the high surrogate of a surrogate pair
					output.push(value);
					counter--;
				}
			} else {
				output.push(value);
			}
		}
		return output;
	}

	/**
	 * Creates a string based on an array of numeric code points.
	 * @see `punycode.ucs2.decode`
	 * @memberOf punycode.ucs2
	 * @name encode
	 * @param {Array} codePoints The array of numeric code points.
	 * @returns {String} The new Unicode string (UCS-2).
	 */
	function ucs2encode(array) {
		return map(array, function(value) {
			var output = '';
			if (value > 0xFFFF) {
				value -= 0x10000;
				output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
				value = 0xDC00 | value & 0x3FF;
			}
			output += stringFromCharCode(value);
			return output;
		}).join('');
	}

	/**
	 * Converts a basic code point into a digit/integer.
	 * @see `digitToBasic()`
	 * @private
	 * @param {Number} codePoint The basic numeric code point value.
	 * @returns {Number} The numeric value of a basic code point (for use in
	 * representing integers) in the range `0` to `base - 1`, or `base` if
	 * the code point does not represent a value.
	 */
	function basicToDigit(codePoint) {
		if (codePoint - 48 < 10) {
			return codePoint - 22;
		}
		if (codePoint - 65 < 26) {
			return codePoint - 65;
		}
		if (codePoint - 97 < 26) {
			return codePoint - 97;
		}
		return base;
	}

	/**
	 * Converts a digit/integer into a basic code point.
	 * @see `basicToDigit()`
	 * @private
	 * @param {Number} digit The numeric value of a basic code point.
	 * @returns {Number} The basic code point whose value (when used for
	 * representing integers) is `digit`, which needs to be in the range
	 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
	 * used; else, the lowercase form is used. The behavior is undefined
	 * if `flag` is non-zero and `digit` has no uppercase form.
	 */
	function digitToBasic(digit, flag) {
		//  0..25 map to ASCII a..z or A..Z
		// 26..35 map to ASCII 0..9
		return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
	}

	/**
	 * Bias adaptation function as per section 3.4 of RFC 3492.
	 * https://tools.ietf.org/html/rfc3492#section-3.4
	 * @private
	 */
	function adapt(delta, numPoints, firstTime) {
		var k = 0;
		delta = firstTime ? floor(delta / damp) : delta >> 1;
		delta += floor(delta / numPoints);
		for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
			delta = floor(delta / baseMinusTMin);
		}
		return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
	}

	/**
	 * Converts a Punycode string of ASCII-only symbols to a string of Unicode
	 * symbols.
	 * @memberOf punycode
	 * @param {String} input The Punycode string of ASCII-only symbols.
	 * @returns {String} The resulting string of Unicode symbols.
	 */
	function decode(input) {
		// Don't use UCS-2
		var output = [],
		    inputLength = input.length,
		    out,
		    i = 0,
		    n = initialN,
		    bias = initialBias,
		    basic,
		    j,
		    index,
		    oldi,
		    w,
		    k,
		    digit,
		    t,
		    /** Cached calculation results */
		    baseMinusT;

		// Handle the basic code points: let `basic` be the number of input code
		// points before the last delimiter, or `0` if there is none, then copy
		// the first basic code points to the output.

		basic = input.lastIndexOf(delimiter);
		if (basic < 0) {
			basic = 0;
		}

		for (j = 0; j < basic; ++j) {
			// if it's not a basic code point
			if (input.charCodeAt(j) >= 0x80) {
				error('not-basic');
			}
			output.push(input.charCodeAt(j));
		}

		// Main decoding loop: start just after the last delimiter if any basic code
		// points were copied; start at the beginning otherwise.

		for (index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {

			// `index` is the index of the next character to be consumed.
			// Decode a generalized variable-length integer into `delta`,
			// which gets added to `i`. The overflow checking is easier
			// if we increase `i` as we go, then subtract off its starting
			// value at the end to obtain `delta`.
			for (oldi = i, w = 1, k = base; /* no condition */; k += base) {

				if (index >= inputLength) {
					error('invalid-input');
				}

				digit = basicToDigit(input.charCodeAt(index++));

				if (digit >= base || digit > floor((maxInt - i) / w)) {
					error('overflow');
				}

				i += digit * w;
				t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);

				if (digit < t) {
					break;
				}

				baseMinusT = base - t;
				if (w > floor(maxInt / baseMinusT)) {
					error('overflow');
				}

				w *= baseMinusT;

			}

			out = output.length + 1;
			bias = adapt(i - oldi, out, oldi == 0);

			// `i` was supposed to wrap around from `out` to `0`,
			// incrementing `n` each time, so we'll fix that now:
			if (floor(i / out) > maxInt - n) {
				error('overflow');
			}

			n += floor(i / out);
			i %= out;

			// Insert `n` at position `i` of the output
			output.splice(i++, 0, n);

		}

		return ucs2encode(output);
	}

	/**
	 * Converts a string of Unicode symbols (e.g. a domain name label) to a
	 * Punycode string of ASCII-only symbols.
	 * @memberOf punycode
	 * @param {String} input The string of Unicode symbols.
	 * @returns {String} The resulting Punycode string of ASCII-only symbols.
	 */
	function encode(input) {
		var n,
		    delta,
		    handledCPCount,
		    basicLength,
		    bias,
		    j,
		    m,
		    q,
		    k,
		    t,
		    currentValue,
		    output = [],
		    /** `inputLength` will hold the number of code points in `input`. */
		    inputLength,
		    /** Cached calculation results */
		    handledCPCountPlusOne,
		    baseMinusT,
		    qMinusT;

		// Convert the input in UCS-2 to Unicode
		input = ucs2decode(input);

		// Cache the length
		inputLength = input.length;

		// Initialize the state
		n = initialN;
		delta = 0;
		bias = initialBias;

		// Handle the basic code points
		for (j = 0; j < inputLength; ++j) {
			currentValue = input[j];
			if (currentValue < 0x80) {
				output.push(stringFromCharCode(currentValue));
			}
		}

		handledCPCount = basicLength = output.length;

		// `handledCPCount` is the number of code points that have been handled;
		// `basicLength` is the number of basic code points.

		// Finish the basic string - if it is not empty - with a delimiter
		if (basicLength) {
			output.push(delimiter);
		}

		// Main encoding loop:
		while (handledCPCount < inputLength) {

			// All non-basic code points < n have been handled already. Find the next
			// larger one:
			for (m = maxInt, j = 0; j < inputLength; ++j) {
				currentValue = input[j];
				if (currentValue >= n && currentValue < m) {
					m = currentValue;
				}
			}

			// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
			// but guard against overflow
			handledCPCountPlusOne = handledCPCount + 1;
			if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
				error('overflow');
			}

			delta += (m - n) * handledCPCountPlusOne;
			n = m;

			for (j = 0; j < inputLength; ++j) {
				currentValue = input[j];

				if (currentValue < n && ++delta > maxInt) {
					error('overflow');
				}

				if (currentValue == n) {
					// Represent delta as a generalized variable-length integer
					for (q = delta, k = base; /* no condition */; k += base) {
						t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
						if (q < t) {
							break;
						}
						qMinusT = q - t;
						baseMinusT = base - t;
						output.push(
							stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
						);
						q = floor(qMinusT / baseMinusT);
					}

					output.push(stringFromCharCode(digitToBasic(q, 0)));
					bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
					delta = 0;
					++handledCPCount;
				}
			}

			++delta;
			++n;

		}
		return output.join('');
	}

	/**
	 * Converts a Punycode string representing a domain name or an email address
	 * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
	 * it doesn't matter if you call it on a string that has already been
	 * converted to Unicode.
	 * @memberOf punycode
	 * @param {String} input The Punycoded domain name or email address to
	 * convert to Unicode.
	 * @returns {String} The Unicode representation of the given Punycode
	 * string.
	 */
	function toUnicode(input) {
		return mapDomain(input, function(string) {
			return regexPunycode.test(string)
				? decode(string.slice(4).toLowerCase())
				: string;
		});
	}

	/**
	 * Converts a Unicode string representing a domain name or an email address to
	 * Punycode. Only the non-ASCII parts of the domain name will be converted,
	 * i.e. it doesn't matter if you call it with a domain that's already in
	 * ASCII.
	 * @memberOf punycode
	 * @param {String} input The domain name or email address to convert, as a
	 * Unicode string.
	 * @returns {String} The Punycode representation of the given domain name or
	 * email address.
	 */
	function toASCII(input) {
		return mapDomain(input, function(string) {
			return regexNonASCII.test(string)
				? 'xn--' + encode(string)
				: string;
		});
	}

	/*--------------------------------------------------------------------------*/

	/** Define the public API */
	punycode = {
		/**
		 * A string representing the current Punycode.js version number.
		 * @memberOf punycode
		 * @type String
		 */
		'version': '1.4.1',
		/**
		 * An object of methods to convert from JavaScript's internal character
		 * representation (UCS-2) to Unicode code points, and back.
		 * @see <https://mathiasbynens.be/notes/javascript-encoding>
		 * @memberOf punycode
		 * @type Object
		 */
		'ucs2': {
			'decode': ucs2decode,
			'encode': ucs2encode
		},
		'decode': decode,
		'encode': encode,
		'toASCII': toASCII,
		'toUnicode': toUnicode
	};

	/** Expose `punycode` */
	// Some AMD build optimizers, like r.js, check for specific condition patterns
	// like the following:
	if (
		typeof define == 'function' &&
		typeof define.amd == 'object' &&
		define.amd
	) {
		define('punycode', function() {
			return punycode;
		});
	} else if (freeExports && freeModule) {
		if (module.exports == freeExports) {
			// in Node.js, io.js, or RingoJS v0.8.0+
			freeModule.exports = punycode;
		} else {
			// in Narwhal or RingoJS v0.7.0-
			for (key in punycode) {
				punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
			}
		}
	} else {
		// in Rhino or a web browser
		root.punycode = punycode;
	}

}(this));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],24:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

},{}],25:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};

},{}],26:[function(require,module,exports){
'use strict';

exports.decode = exports.parse = require('./decode');
exports.encode = exports.stringify = require('./encode');

},{"./decode":24,"./encode":25}],27:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

var punycode = require('punycode');
var util = require('./util');

exports.parse = urlParse;
exports.resolve = urlResolve;
exports.resolveObject = urlResolveObject;
exports.format = urlFormat;

exports.Url = Url;

function Url() {
  this.protocol = null;
  this.slashes = null;
  this.auth = null;
  this.host = null;
  this.port = null;
  this.hostname = null;
  this.hash = null;
  this.search = null;
  this.query = null;
  this.pathname = null;
  this.path = null;
  this.href = null;
}

// Reference: RFC 3986, RFC 1808, RFC 2396

// define these here so at least they only have to be
// compiled once on the first module load.
var protocolPattern = /^([a-z0-9.+-]+:)/i,
    portPattern = /:[0-9]*$/,

    // Special case for a simple path URL
    simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,

    // RFC 2396: characters reserved for delimiting URLs.
    // We actually just auto-escape these.
    delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],

    // RFC 2396: characters not allowed for various reasons.
    unwise = ['{', '}', '|', '\\', '^', '`'].concat(delims),

    // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
    autoEscape = ['\''].concat(unwise),
    // Characters that are never ever allowed in a hostname.
    // Note that any invalid chars are also handled, but these
    // are the ones that are *expected* to be seen, so we fast-path
    // them.
    nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape),
    hostEndingChars = ['/', '?', '#'],
    hostnameMaxLen = 255,
    hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/,
    hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,
    // protocols that can allow "unsafe" and "unwise" chars.
    unsafeProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that never have a hostname.
    hostlessProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that always contain a // bit.
    slashedProtocol = {
      'http': true,
      'https': true,
      'ftp': true,
      'gopher': true,
      'file': true,
      'http:': true,
      'https:': true,
      'ftp:': true,
      'gopher:': true,
      'file:': true
    },
    querystring = require('querystring');

function urlParse(url, parseQueryString, slashesDenoteHost) {
  if (url && util.isObject(url) && url instanceof Url) return url;

  var u = new Url;
  u.parse(url, parseQueryString, slashesDenoteHost);
  return u;
}

Url.prototype.parse = function(url, parseQueryString, slashesDenoteHost) {
  if (!util.isString(url)) {
    throw new TypeError("Parameter 'url' must be a string, not " + typeof url);
  }

  // Copy chrome, IE, opera backslash-handling behavior.
  // Back slashes before the query string get converted to forward slashes
  // See: https://code.google.com/p/chromium/issues/detail?id=25916
  var queryIndex = url.indexOf('?'),
      splitter =
          (queryIndex !== -1 && queryIndex < url.indexOf('#')) ? '?' : '#',
      uSplit = url.split(splitter),
      slashRegex = /\\/g;
  uSplit[0] = uSplit[0].replace(slashRegex, '/');
  url = uSplit.join(splitter);

  var rest = url;

  // trim before proceeding.
  // This is to support parse stuff like "  http://foo.com  \n"
  rest = rest.trim();

  if (!slashesDenoteHost && url.split('#').length === 1) {
    // Try fast path regexp
    var simplePath = simplePathPattern.exec(rest);
    if (simplePath) {
      this.path = rest;
      this.href = rest;
      this.pathname = simplePath[1];
      if (simplePath[2]) {
        this.search = simplePath[2];
        if (parseQueryString) {
          this.query = querystring.parse(this.search.substr(1));
        } else {
          this.query = this.search.substr(1);
        }
      } else if (parseQueryString) {
        this.search = '';
        this.query = {};
      }
      return this;
    }
  }

  var proto = protocolPattern.exec(rest);
  if (proto) {
    proto = proto[0];
    var lowerProto = proto.toLowerCase();
    this.protocol = lowerProto;
    rest = rest.substr(proto.length);
  }

  // figure out if it's got a host
  // user@server is *always* interpreted as a hostname, and url
  // resolution will treat //foo/bar as host=foo,path=bar because that's
  // how the browser resolves relative URLs.
  if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
    var slashes = rest.substr(0, 2) === '//';
    if (slashes && !(proto && hostlessProtocol[proto])) {
      rest = rest.substr(2);
      this.slashes = true;
    }
  }

  if (!hostlessProtocol[proto] &&
      (slashes || (proto && !slashedProtocol[proto]))) {

    // there's a hostname.
    // the first instance of /, ?, ;, or # ends the host.
    //
    // If there is an @ in the hostname, then non-host chars *are* allowed
    // to the left of the last @ sign, unless some host-ending character
    // comes *before* the @-sign.
    // URLs are obnoxious.
    //
    // ex:
    // http://a@b@c/ => user:a@b host:c
    // http://a@b?@c => user:a host:c path:/?@c

    // v0.12 TODO(isaacs): This is not quite how Chrome does things.
    // Review our test case against browsers more comprehensively.

    // find the first instance of any hostEndingChars
    var hostEnd = -1;
    for (var i = 0; i < hostEndingChars.length; i++) {
      var hec = rest.indexOf(hostEndingChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }

    // at this point, either we have an explicit point where the
    // auth portion cannot go past, or the last @ char is the decider.
    var auth, atSign;
    if (hostEnd === -1) {
      // atSign can be anywhere.
      atSign = rest.lastIndexOf('@');
    } else {
      // atSign must be in auth portion.
      // http://a@b/c@d => host:b auth:a path:/c@d
      atSign = rest.lastIndexOf('@', hostEnd);
    }

    // Now we have a portion which is definitely the auth.
    // Pull that off.
    if (atSign !== -1) {
      auth = rest.slice(0, atSign);
      rest = rest.slice(atSign + 1);
      this.auth = decodeURIComponent(auth);
    }

    // the host is the remaining to the left of the first non-host char
    hostEnd = -1;
    for (var i = 0; i < nonHostChars.length; i++) {
      var hec = rest.indexOf(nonHostChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }
    // if we still have not hit it, then the entire thing is a host.
    if (hostEnd === -1)
      hostEnd = rest.length;

    this.host = rest.slice(0, hostEnd);
    rest = rest.slice(hostEnd);

    // pull out port.
    this.parseHost();

    // we've indicated that there is a hostname,
    // so even if it's empty, it has to be present.
    this.hostname = this.hostname || '';

    // if hostname begins with [ and ends with ]
    // assume that it's an IPv6 address.
    var ipv6Hostname = this.hostname[0] === '[' &&
        this.hostname[this.hostname.length - 1] === ']';

    // validate a little.
    if (!ipv6Hostname) {
      var hostparts = this.hostname.split(/\./);
      for (var i = 0, l = hostparts.length; i < l; i++) {
        var part = hostparts[i];
        if (!part) continue;
        if (!part.match(hostnamePartPattern)) {
          var newpart = '';
          for (var j = 0, k = part.length; j < k; j++) {
            if (part.charCodeAt(j) > 127) {
              // we replace non-ASCII char with a temporary placeholder
              // we need this to make sure size of hostname is not
              // broken by replacing non-ASCII by nothing
              newpart += 'x';
            } else {
              newpart += part[j];
            }
          }
          // we test again with ASCII char only
          if (!newpart.match(hostnamePartPattern)) {
            var validParts = hostparts.slice(0, i);
            var notHost = hostparts.slice(i + 1);
            var bit = part.match(hostnamePartStart);
            if (bit) {
              validParts.push(bit[1]);
              notHost.unshift(bit[2]);
            }
            if (notHost.length) {
              rest = '/' + notHost.join('.') + rest;
            }
            this.hostname = validParts.join('.');
            break;
          }
        }
      }
    }

    if (this.hostname.length > hostnameMaxLen) {
      this.hostname = '';
    } else {
      // hostnames are always lower case.
      this.hostname = this.hostname.toLowerCase();
    }

    if (!ipv6Hostname) {
      // IDNA Support: Returns a punycoded representation of "domain".
      // It only converts parts of the domain name that
      // have non-ASCII characters, i.e. it doesn't matter if
      // you call it with a domain that already is ASCII-only.
      this.hostname = punycode.toASCII(this.hostname);
    }

    var p = this.port ? ':' + this.port : '';
    var h = this.hostname || '';
    this.host = h + p;
    this.href += this.host;

    // strip [ and ] from the hostname
    // the host field still retains them, though
    if (ipv6Hostname) {
      this.hostname = this.hostname.substr(1, this.hostname.length - 2);
      if (rest[0] !== '/') {
        rest = '/' + rest;
      }
    }
  }

  // now rest is set to the post-host stuff.
  // chop off any delim chars.
  if (!unsafeProtocol[lowerProto]) {

    // First, make 100% sure that any "autoEscape" chars get
    // escaped, even if encodeURIComponent doesn't think they
    // need to be.
    for (var i = 0, l = autoEscape.length; i < l; i++) {
      var ae = autoEscape[i];
      if (rest.indexOf(ae) === -1)
        continue;
      var esc = encodeURIComponent(ae);
      if (esc === ae) {
        esc = escape(ae);
      }
      rest = rest.split(ae).join(esc);
    }
  }


  // chop off from the tail first.
  var hash = rest.indexOf('#');
  if (hash !== -1) {
    // got a fragment string.
    this.hash = rest.substr(hash);
    rest = rest.slice(0, hash);
  }
  var qm = rest.indexOf('?');
  if (qm !== -1) {
    this.search = rest.substr(qm);
    this.query = rest.substr(qm + 1);
    if (parseQueryString) {
      this.query = querystring.parse(this.query);
    }
    rest = rest.slice(0, qm);
  } else if (parseQueryString) {
    // no query string, but parseQueryString still requested
    this.search = '';
    this.query = {};
  }
  if (rest) this.pathname = rest;
  if (slashedProtocol[lowerProto] &&
      this.hostname && !this.pathname) {
    this.pathname = '/';
  }

  //to support http.request
  if (this.pathname || this.search) {
    var p = this.pathname || '';
    var s = this.search || '';
    this.path = p + s;
  }

  // finally, reconstruct the href based on what has been validated.
  this.href = this.format();
  return this;
};

// format a parsed object into a url string
function urlFormat(obj) {
  // ensure it's an object, and not a string url.
  // If it's an obj, this is a no-op.
  // this way, you can call url_format() on strings
  // to clean up potentially wonky urls.
  if (util.isString(obj)) obj = urlParse(obj);
  if (!(obj instanceof Url)) return Url.prototype.format.call(obj);
  return obj.format();
}

Url.prototype.format = function() {
  var auth = this.auth || '';
  if (auth) {
    auth = encodeURIComponent(auth);
    auth = auth.replace(/%3A/i, ':');
    auth += '@';
  }

  var protocol = this.protocol || '',
      pathname = this.pathname || '',
      hash = this.hash || '',
      host = false,
      query = '';

  if (this.host) {
    host = auth + this.host;
  } else if (this.hostname) {
    host = auth + (this.hostname.indexOf(':') === -1 ?
        this.hostname :
        '[' + this.hostname + ']');
    if (this.port) {
      host += ':' + this.port;
    }
  }

  if (this.query &&
      util.isObject(this.query) &&
      Object.keys(this.query).length) {
    query = querystring.stringify(this.query);
  }

  var search = this.search || (query && ('?' + query)) || '';

  if (protocol && protocol.substr(-1) !== ':') protocol += ':';

  // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
  // unless they had them to begin with.
  if (this.slashes ||
      (!protocol || slashedProtocol[protocol]) && host !== false) {
    host = '//' + (host || '');
    if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname;
  } else if (!host) {
    host = '';
  }

  if (hash && hash.charAt(0) !== '#') hash = '#' + hash;
  if (search && search.charAt(0) !== '?') search = '?' + search;

  pathname = pathname.replace(/[?#]/g, function(match) {
    return encodeURIComponent(match);
  });
  search = search.replace('#', '%23');

  return protocol + host + pathname + search + hash;
};

function urlResolve(source, relative) {
  return urlParse(source, false, true).resolve(relative);
}

Url.prototype.resolve = function(relative) {
  return this.resolveObject(urlParse(relative, false, true)).format();
};

function urlResolveObject(source, relative) {
  if (!source) return relative;
  return urlParse(source, false, true).resolveObject(relative);
}

Url.prototype.resolveObject = function(relative) {
  if (util.isString(relative)) {
    var rel = new Url();
    rel.parse(relative, false, true);
    relative = rel;
  }

  var result = new Url();
  var tkeys = Object.keys(this);
  for (var tk = 0; tk < tkeys.length; tk++) {
    var tkey = tkeys[tk];
    result[tkey] = this[tkey];
  }

  // hash is always overridden, no matter what.
  // even href="" will remove it.
  result.hash = relative.hash;

  // if the relative url is empty, then there's nothing left to do here.
  if (relative.href === '') {
    result.href = result.format();
    return result;
  }

  // hrefs like //foo/bar always cut to the protocol.
  if (relative.slashes && !relative.protocol) {
    // take everything except the protocol from relative
    var rkeys = Object.keys(relative);
    for (var rk = 0; rk < rkeys.length; rk++) {
      var rkey = rkeys[rk];
      if (rkey !== 'protocol')
        result[rkey] = relative[rkey];
    }

    //urlParse appends trailing / to urls like http://www.example.com
    if (slashedProtocol[result.protocol] &&
        result.hostname && !result.pathname) {
      result.path = result.pathname = '/';
    }

    result.href = result.format();
    return result;
  }

  if (relative.protocol && relative.protocol !== result.protocol) {
    // if it's a known url protocol, then changing
    // the protocol does weird things
    // first, if it's not file:, then we MUST have a host,
    // and if there was a path
    // to begin with, then we MUST have a path.
    // if it is file:, then the host is dropped,
    // because that's known to be hostless.
    // anything else is assumed to be absolute.
    if (!slashedProtocol[relative.protocol]) {
      var keys = Object.keys(relative);
      for (var v = 0; v < keys.length; v++) {
        var k = keys[v];
        result[k] = relative[k];
      }
      result.href = result.format();
      return result;
    }

    result.protocol = relative.protocol;
    if (!relative.host && !hostlessProtocol[relative.protocol]) {
      var relPath = (relative.pathname || '').split('/');
      while (relPath.length && !(relative.host = relPath.shift()));
      if (!relative.host) relative.host = '';
      if (!relative.hostname) relative.hostname = '';
      if (relPath[0] !== '') relPath.unshift('');
      if (relPath.length < 2) relPath.unshift('');
      result.pathname = relPath.join('/');
    } else {
      result.pathname = relative.pathname;
    }
    result.search = relative.search;
    result.query = relative.query;
    result.host = relative.host || '';
    result.auth = relative.auth;
    result.hostname = relative.hostname || relative.host;
    result.port = relative.port;
    // to support http.request
    if (result.pathname || result.search) {
      var p = result.pathname || '';
      var s = result.search || '';
      result.path = p + s;
    }
    result.slashes = result.slashes || relative.slashes;
    result.href = result.format();
    return result;
  }

  var isSourceAbs = (result.pathname && result.pathname.charAt(0) === '/'),
      isRelAbs = (
          relative.host ||
          relative.pathname && relative.pathname.charAt(0) === '/'
      ),
      mustEndAbs = (isRelAbs || isSourceAbs ||
                    (result.host && relative.pathname)),
      removeAllDots = mustEndAbs,
      srcPath = result.pathname && result.pathname.split('/') || [],
      relPath = relative.pathname && relative.pathname.split('/') || [],
      psychotic = result.protocol && !slashedProtocol[result.protocol];

  // if the url is a non-slashed url, then relative
  // links like ../.. should be able
  // to crawl up to the hostname, as well.  This is strange.
  // result.protocol has already been set by now.
  // Later on, put the first path part into the host field.
  if (psychotic) {
    result.hostname = '';
    result.port = null;
    if (result.host) {
      if (srcPath[0] === '') srcPath[0] = result.host;
      else srcPath.unshift(result.host);
    }
    result.host = '';
    if (relative.protocol) {
      relative.hostname = null;
      relative.port = null;
      if (relative.host) {
        if (relPath[0] === '') relPath[0] = relative.host;
        else relPath.unshift(relative.host);
      }
      relative.host = null;
    }
    mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
  }

  if (isRelAbs) {
    // it's absolute.
    result.host = (relative.host || relative.host === '') ?
                  relative.host : result.host;
    result.hostname = (relative.hostname || relative.hostname === '') ?
                      relative.hostname : result.hostname;
    result.search = relative.search;
    result.query = relative.query;
    srcPath = relPath;
    // fall through to the dot-handling below.
  } else if (relPath.length) {
    // it's relative
    // throw away the existing file, and take the new path instead.
    if (!srcPath) srcPath = [];
    srcPath.pop();
    srcPath = srcPath.concat(relPath);
    result.search = relative.search;
    result.query = relative.query;
  } else if (!util.isNullOrUndefined(relative.search)) {
    // just pull out the search.
    // like href='?foo'.
    // Put this after the other two cases because it simplifies the booleans
    if (psychotic) {
      result.hostname = result.host = srcPath.shift();
      //occationaly the auth can get stuck only in host
      //this especially happens in cases like
      //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
      var authInHost = result.host && result.host.indexOf('@') > 0 ?
                       result.host.split('@') : false;
      if (authInHost) {
        result.auth = authInHost.shift();
        result.host = result.hostname = authInHost.shift();
      }
    }
    result.search = relative.search;
    result.query = relative.query;
    //to support http.request
    if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
      result.path = (result.pathname ? result.pathname : '') +
                    (result.search ? result.search : '');
    }
    result.href = result.format();
    return result;
  }

  if (!srcPath.length) {
    // no path at all.  easy.
    // we've already handled the other stuff above.
    result.pathname = null;
    //to support http.request
    if (result.search) {
      result.path = '/' + result.search;
    } else {
      result.path = null;
    }
    result.href = result.format();
    return result;
  }

  // if a url ENDs in . or .., then it must get a trailing slash.
  // however, if it ends in anything else non-slashy,
  // then it must NOT get a trailing slash.
  var last = srcPath.slice(-1)[0];
  var hasTrailingSlash = (
      (result.host || relative.host || srcPath.length > 1) &&
      (last === '.' || last === '..') || last === '');

  // strip single dots, resolve double dots to parent dir
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = srcPath.length; i >= 0; i--) {
    last = srcPath[i];
    if (last === '.') {
      srcPath.splice(i, 1);
    } else if (last === '..') {
      srcPath.splice(i, 1);
      up++;
    } else if (up) {
      srcPath.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (!mustEndAbs && !removeAllDots) {
    for (; up--; up) {
      srcPath.unshift('..');
    }
  }

  if (mustEndAbs && srcPath[0] !== '' &&
      (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
    srcPath.unshift('');
  }

  if (hasTrailingSlash && (srcPath.join('/').substr(-1) !== '/')) {
    srcPath.push('');
  }

  var isAbsolute = srcPath[0] === '' ||
      (srcPath[0] && srcPath[0].charAt(0) === '/');

  // put the host back
  if (psychotic) {
    result.hostname = result.host = isAbsolute ? '' :
                                    srcPath.length ? srcPath.shift() : '';
    //occationaly the auth can get stuck only in host
    //this especially happens in cases like
    //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
    var authInHost = result.host && result.host.indexOf('@') > 0 ?
                     result.host.split('@') : false;
    if (authInHost) {
      result.auth = authInHost.shift();
      result.host = result.hostname = authInHost.shift();
    }
  }

  mustEndAbs = mustEndAbs || (result.host && srcPath.length);

  if (mustEndAbs && !isAbsolute) {
    srcPath.unshift('');
  }

  if (!srcPath.length) {
    result.pathname = null;
    result.path = null;
  } else {
    result.pathname = srcPath.join('/');
  }

  //to support request.http
  if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
    result.path = (result.pathname ? result.pathname : '') +
                  (result.search ? result.search : '');
  }
  result.auth = relative.auth || result.auth;
  result.slashes = result.slashes || relative.slashes;
  result.href = result.format();
  return result;
};

Url.prototype.parseHost = function() {
  var host = this.host;
  var port = portPattern.exec(host);
  if (port) {
    port = port[0];
    if (port !== ':') {
      this.port = port.substr(1);
    }
    host = host.substr(0, host.length - port.length);
  }
  if (host) this.hostname = host;
};

},{"./util":28,"punycode":23,"querystring":26}],28:[function(require,module,exports){
'use strict';

module.exports = {
  isString: function(arg) {
    return typeof(arg) === 'string';
  },
  isObject: function(arg) {
    return typeof(arg) === 'object' && arg !== null;
  },
  isNull: function(arg) {
    return arg === null;
  },
  isNullOrUndefined: function(arg) {
    return arg == null;
  }
};

},{}],29:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _pixiGlCore = require('pixi-gl-core');

var _const = require('./const');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function checkPrecision(src) {
    if (src instanceof Array) {
        if (src[0].substring(0, 9) !== 'precision') {
            var copy = src.slice(0);

            copy.unshift('precision ' + _const.PRECISION.DEFAULT + ' float;');

            return copy;
        }
    } else if (src.substring(0, 9) !== 'precision') {
        return 'precision ' + _const.PRECISION.DEFAULT + ' float;\n' + src;
    }

    return src;
}

/**
 * Wrapper class, webGL Shader for Pixi.
 * Adds precision string if vertexSrc or fragmentSrc have no mention of it.
 *
 * @class
 * @extends GLShader
 * @memberof PIXI
 */

var Shader = function (_GLShader) {
    _inherits(Shader, _GLShader);

    /**
     *
     * @param {WebGLRenderingContext} gl - The current WebGL rendering context
     * @param {string|string[]} vertexSrc - The vertex shader source as an array of strings.
     * @param {string|string[]} fragmentSrc - The fragment shader source as an array of strings.
     */
    function Shader(gl, vertexSrc, fragmentSrc) {
        _classCallCheck(this, Shader);

        return _possibleConstructorReturn(this, _GLShader.call(this, gl, checkPrecision(vertexSrc), checkPrecision(fragmentSrc)));
    }

    return Shader;
}(_pixiGlCore.GLShader);

exports.default = Shader;

},{"./const":30,"pixi-gl-core":12}],30:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.SPRITE_MAX_TEXTURES = exports.SPRITE_BATCH_SIZE = exports.TEXT_GRADIENT = exports.TRANSFORM_MODE = exports.PRECISION = exports.SHAPES = exports.SVG_SIZE = exports.DATA_URI = exports.URL_FILE_EXTENSION = exports.DEFAULT_RENDER_OPTIONS = exports.FILTER_RESOLUTION = exports.RESOLUTION = exports.RETINA_PREFIX = exports.MIPMAP_TEXTURES = exports.GC_MODES = exports.WRAP_MODES = exports.SCALE_MODES = exports.DRAW_MODES = exports.BLEND_MODES = exports.RENDERER_TYPE = exports.TARGET_FPMS = exports.DEG_TO_RAD = exports.RAD_TO_DEG = exports.PI_2 = exports.VERSION = undefined;

var _maxRecommendedTextures = require('./utils/maxRecommendedTextures');

var _maxRecommendedTextures2 = _interopRequireDefault(_maxRecommendedTextures);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * String of the current PIXI version.
 *
 * @static
 * @constant
 * @memberof PIXI
 * @type {string}
 */
var VERSION = exports.VERSION = '4.1.1';

/**
 * Two Pi.
 *
 * @static
 * @constant
 * @memberof PIXI
 * @type {number}
 */
var PI_2 = exports.PI_2 = Math.PI * 2;

/**
 * Conversion factor for converting radians to degrees.
 *
 * @static
 * @constant
 * @memberof PIXI
 * @type {number}
 */
var RAD_TO_DEG = exports.RAD_TO_DEG = 180 / Math.PI;

/**
 * Conversion factor for converting degrees to radians.
 *
 * @static
 * @constant
 * @memberof PIXI
 * @type {number}
 */
var DEG_TO_RAD = exports.DEG_TO_RAD = Math.PI / 180;

/**
 * Target frames per millisecond.
 *
 * @static
 * @constant
 * @memberof PIXI
 * @type {number}
 * @default 0.06
 */
var TARGET_FPMS = exports.TARGET_FPMS = 0.06;

/**
 * Constant to identify the Renderer Type.
 *
 * @static
 * @constant
 * @memberof PIXI
 * @type {object}
 * @property {number} UNKNOWN - Unknown render type.
 * @property {number} WEBGL - WebGL render type.
 * @property {number} CANVAS - Canvas render type.
 */
var RENDERER_TYPE = exports.RENDERER_TYPE = {
  UNKNOWN: 0,
  WEBGL: 1,
  CANVAS: 2
};

/**
 * Various blend modes supported by PIXI.
 *
 * IMPORTANT - The WebGL renderer only supports the NORMAL, ADD, MULTIPLY and SCREEN blend modes.
 * Anything else will silently act like NORMAL.
 *
 * @static
 * @constant
 * @memberof PIXI
 * @type {object}
 * @property {number} NORMAL
 * @property {number} ADD
 * @property {number} MULTIPLY
 * @property {number} SCREEN
 * @property {number} OVERLAY
 * @property {number} DARKEN
 * @property {number} LIGHTEN
 * @property {number} COLOR_DODGE
 * @property {number} COLOR_BURN
 * @property {number} HARD_LIGHT
 * @property {number} SOFT_LIGHT
 * @property {number} DIFFERENCE
 * @property {number} EXCLUSION
 * @property {number} HUE
 * @property {number} SATURATION
 * @property {number} COLOR
 * @property {number} LUMINOSITY
 */
var BLEND_MODES = exports.BLEND_MODES = {
  NORMAL: 0,
  ADD: 1,
  MULTIPLY: 2,
  SCREEN: 3,
  OVERLAY: 4,
  DARKEN: 5,
  LIGHTEN: 6,
  COLOR_DODGE: 7,
  COLOR_BURN: 8,
  HARD_LIGHT: 9,
  SOFT_LIGHT: 10,
  DIFFERENCE: 11,
  EXCLUSION: 12,
  HUE: 13,
  SATURATION: 14,
  COLOR: 15,
  LUMINOSITY: 16
};

/**
 * Various webgl draw modes. These can be used to specify which GL drawMode to use
 * under certain situations and renderers.
 *
 * @static
 * @constant
 * @memberof PIXI
 * @type {object}
 * @property {number} POINTS
 * @property {number} LINES
 * @property {number} LINE_LOOP
 * @property {number} LINE_STRIP
 * @property {number} TRIANGLES
 * @property {number} TRIANGLE_STRIP
 * @property {number} TRIANGLE_FAN
 */
var DRAW_MODES = exports.DRAW_MODES = {
  POINTS: 0,
  LINES: 1,
  LINE_LOOP: 2,
  LINE_STRIP: 3,
  TRIANGLES: 4,
  TRIANGLE_STRIP: 5,
  TRIANGLE_FAN: 6
};

/**
 * The scale modes that are supported by pixi.
 *
 * The DEFAULT scale mode affects the default scaling mode of future operations.
 * It can be re-assigned to either LINEAR or NEAREST, depending upon suitability.
 *
 * @static
 * @constant
 * @memberof PIXI
 * @type {object}
 * @property {number} DEFAULT=LINEAR
 * @property {number} LINEAR Smooth scaling
 * @property {number} NEAREST Pixelating scaling
 */
var SCALE_MODES = exports.SCALE_MODES = {
  DEFAULT: 0,
  LINEAR: 0,
  NEAREST: 1
};

/**
 * The wrap modes that are supported by pixi.
 *
 * The DEFAULT wrap mode affects the default wraping mode of future operations.
 * It can be re-assigned to either CLAMP or REPEAT, depending upon suitability.
 * If the texture is non power of two then clamp will be used regardless as webGL can
 * only use REPEAT if the texture is po2.
 *
 * This property only affects WebGL.
 *
 * @static
 * @constant
 * @memberof PIXI
 * @type {object}
 * @property {number} DEFAULT=CLAMP
 * @property {number} CLAMP - The textures uvs are clamped
 * @property {number} REPEAT - The texture uvs tile and repeat
 * @property {number} MIRRORED_REPEAT - The texture uvs tile and repeat with mirroring
 */
var WRAP_MODES = exports.WRAP_MODES = {
  DEFAULT: 0,
  CLAMP: 0,
  REPEAT: 1,
  MIRRORED_REPEAT: 2
};

/**
 * The gc modes that are supported by pixi.
 *
 * The DEFAULT Garbage Collection mode for pixi textures is MANUAL
 * If set to DEFAULT, the renderer will occasianally check textures usage. If they are not
 * used for a specified period of time they will be removed from the GPU. They will of course
 * be uploaded again when they are required. This is a silent behind the scenes process that
 * should ensure that the GPU does not  get filled up.
 *
 * Handy for mobile devices!
 * This property only affects WebGL.
 *
 * @static
 * @constant
 * @memberof PIXI
 * @type {object}
 * @property {number} DEFAULT=MANUAL
 * @property {number} AUTO - Garbage collection will happen periodically automatically
 * @property {number} MANUAL - Garbage collection will need to be called manually
 */
var GC_MODES = exports.GC_MODES = {
  DEFAULT: 0,
  AUTO: 0,
  MANUAL: 1
};

/**
 * If set to true WebGL will attempt make textures mimpaped by default.
 * Mipmapping will only succeed if the base texture uploaded has power of two dimensions.
 *
 * @static
 * @constant
 * @memberof PIXI
 * @type {boolean}
 */
var MIPMAP_TEXTURES = exports.MIPMAP_TEXTURES = true;

/**
 * The prefix that denotes a URL is for a retina asset.
 *
 * @static
 * @constant
 * @memberof PIXI
 * @type {RegExp|string}
 * @example `@2x`
 */
var RETINA_PREFIX = exports.RETINA_PREFIX = /@(.+)x/;

/**
 * Default resolution / device pixel ratio of the renderer.
 *
 * @static
 * @constant
 * @memberof PIXI
 * @type {number}
 */
var RESOLUTION = exports.RESOLUTION = 1;

/**
 * Default filter resolution.
 *
 * @static
 * @constant
 * @type {number}
 */
var FILTER_RESOLUTION = exports.FILTER_RESOLUTION = 1;

/**
 * The default render options if none are supplied to {@link PIXI.WebGLRenderer}
 * or {@link PIXI.CanvasRenderer}.
 *
 * @static
 * @constant
 * @memberof PIXI
 * @type {object}
 * @property {HTMLCanvasElement} view=null
 * @property {number} resolution=1
 * @property {boolean} antialias=false
 * @property {boolean} forceFXAA=false
 * @property {boolean} autoResize=false
 * @property {boolean} transparent=false
 * @property {number} backgroundColor=0x000000
 * @property {boolean} clearBeforeRender=true
 * @property {boolean} preserveDrawingBuffer=false
 * @property {boolean} roundPixels=false
 */
var DEFAULT_RENDER_OPTIONS = exports.DEFAULT_RENDER_OPTIONS = {
  view: null,
  antialias: false,
  forceFXAA: false,
  autoResize: false,
  transparent: false,
  backgroundColor: 0x000000,
  clearBeforeRender: true,
  preserveDrawingBuffer: false,
  roundPixels: false
};

/**
 * Regexp for image type by extension.
 *
 * @static
 * @constant
 * @memberof PIXI
 * @type {RegExp|string}
 * @example `image.png`
 */
var URL_FILE_EXTENSION = exports.URL_FILE_EXTENSION = /\.(\w{3,4})(?:$|\?|#)/i;

/**
 * Regexp for data URI.
 * Based on: https://github.com/ragingwind/data-uri-regex
 *
 * @static
 * @constant
 * @memberof PIXI
 * @type {RegExp|string}
 * @example `data:image/png;base64`
 */
var DATA_URI = exports.DATA_URI = /^\s*data:(?:([\w-]+)\/([\w+.-]+))?(?:;(charset=[\w-]+|base64))?,(.*)/i;

/**
 * Regexp for SVG size.
 *
 * @static
 * @constant
 * @memberof PIXI
 * @type {RegExp|string}
 * @example `<svg width="100" height="100"></svg>`
 */
var SVG_SIZE = exports.SVG_SIZE = /<svg[^>]*(?:\s(width|height)="(\d*(?:\.\d+)?)(?:px)?")[^>]*(?:\s(width|height)="(\d*(?:\.\d+)?)(?:px)?")[^>]*>/i; // eslint-disable-line max-len

/**
 * Constants that identify shapes, mainly to prevent `instanceof` calls.
 *
 * @static
 * @constant
 * @memberof PIXI
 * @type {object}
 * @property {number} POLY
 * @property {number} RECT
 * @property {number} CIRC
 * @property {number} ELIP
 * @property {number} RREC
 */
var SHAPES = exports.SHAPES = {
  POLY: 0,
  RECT: 1,
  CIRC: 2,
  ELIP: 3,
  RREC: 4
};

/**
 * Constants that specify float precision in shaders.
 *
 * @static
 * @constant
 * @memberof PIXI
 * @type {object}
 * @property {number} DEFAULT='mediump'
 * @property {number} LOW='lowp'
 * @property {number} MEDIUM='mediump'
 * @property {number} HIGH='highp'
 */
var PRECISION = exports.PRECISION = {
  DEFAULT: 'mediump',
  LOW: 'lowp',
  MEDIUM: 'mediump',
  HIGH: 'highp'
};

/**
 * Constants that specify the transform type.
 *
 * @static
 * @constant
 * @memberof PIXI
 * @type {object}
 * @property {number} DEFAULT=STATIC
 * @property {number} STATIC
 * @property {number} DYNAMIC
 */
var TRANSFORM_MODE = exports.TRANSFORM_MODE = {
  DEFAULT: 0,
  STATIC: 0,
  DYNAMIC: 1
};

/**
 * Constants that define the type of gradient on text.
 *
 * @static
 * @constant
 * @memberof PIXI
 * @type {object}
 * @property {number} LINEAR_VERTICAL
 * @property {number} LINEAR_HORIZONTAL
 */
var TEXT_GRADIENT = exports.TEXT_GRADIENT = {
  LINEAR_VERTICAL: 0,
  LINEAR_HORIZONTAL: 1
};

// TODO: maybe change to SPRITE.BATCH_SIZE: 2000
// TODO: maybe add PARTICLE.BATCH_SIZE: 15000

/**
 * The default sprite batch size.
 *
 * The default aims to balance desktop and mobile devices.
 *
 * @static
 * @constant
 * @memberof PIXI
 * @type {number}
 * @default 4096
 */
var SPRITE_BATCH_SIZE = exports.SPRITE_BATCH_SIZE = 4096;

/**
 * The maximum textures that this device supports.
 *
 * @static
 * @constant
 * @memberof PIXI
 * @type {number}
 */
var SPRITE_MAX_TEXTURES = exports.SPRITE_MAX_TEXTURES = (0, _maxRecommendedTextures2.default)(32);

},{"./utils/maxRecommendedTextures":102}],31:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _math = require('../math');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * 'Builder' pattern for bounds rectangles
 * Axis-Aligned Bounding Box
 * It is not a shape! Its mutable thing, no 'EMPTY' or that kind of problems
 *
 * @class
 * @memberof PIXI
 */
var Bounds = function () {
    /**
     *
     */
    function Bounds() {
        _classCallCheck(this, Bounds);

        /**
         * @member {number}
         * @default 0
         */
        this.minX = Infinity;

        /**
         * @member {number}
         * @default 0
         */
        this.minY = Infinity;

        /**
         * @member {number}
         * @default 0
         */
        this.maxX = -Infinity;

        /**
         * @member {number}
         * @default 0
         */
        this.maxY = -Infinity;

        this.rect = null;
    }

    /**
     * Checks if bounds are empty.
     *
     * @return {boolean} True if empty.
     */


    Bounds.prototype.isEmpty = function isEmpty() {
        return this.minX > this.maxX || this.minY > this.maxY;
    };

    /**
     * Clears the bounds and resets.
     *
     */


    Bounds.prototype.clear = function clear() {
        this.updateID++;

        this.minX = Infinity;
        this.minY = Infinity;
        this.maxX = -Infinity;
        this.maxY = -Infinity;
    };

    /**
     * Can return Rectangle.EMPTY constant, either construct new rectangle, either use your rectangle
     * It is not guaranteed that it will return tempRect
     *
     * @param {PIXI.Rectangle} rect - temporary object will be used if AABB is not empty
     * @returns {PIXI.Rectangle} A rectangle of the bounds
     */


    Bounds.prototype.getRectangle = function getRectangle(rect) {
        if (this.minX > this.maxX || this.minY > this.maxY) {
            return _math.Rectangle.EMPTY;
        }

        rect = rect || new _math.Rectangle(0, 0, 1, 1);

        rect.x = this.minX;
        rect.y = this.minY;
        rect.width = this.maxX - this.minX;
        rect.height = this.maxY - this.minY;

        return rect;
    };

    /**
     * This function should be inlined when its possible.
     *
     * @param {PIXI.Point} point - The point to add.
     */


    Bounds.prototype.addPoint = function addPoint(point) {
        this.minX = Math.min(this.minX, point.x);
        this.maxX = Math.max(this.maxX, point.x);
        this.minY = Math.min(this.minY, point.y);
        this.maxY = Math.max(this.maxY, point.y);
    };

    /**
     * Adds a quad, not transformed
     *
     * @param {Float32Array} vertices - The verts to add.
     */


    Bounds.prototype.addQuad = function addQuad(vertices) {
        var minX = this.minX;
        var minY = this.minY;
        var maxX = this.maxX;
        var maxY = this.maxY;

        var x = vertices[0];
        var y = vertices[1];

        minX = x < minX ? x : minX;
        minY = y < minY ? y : minY;
        maxX = x > maxX ? x : maxX;
        maxY = y > maxY ? y : maxY;

        x = vertices[2];
        y = vertices[3];
        minX = x < minX ? x : minX;
        minY = y < minY ? y : minY;
        maxX = x > maxX ? x : maxX;
        maxY = y > maxY ? y : maxY;

        x = vertices[4];
        y = vertices[5];
        minX = x < minX ? x : minX;
        minY = y < minY ? y : minY;
        maxX = x > maxX ? x : maxX;
        maxY = y > maxY ? y : maxY;

        x = vertices[6];
        y = vertices[7];
        minX = x < minX ? x : minX;
        minY = y < minY ? y : minY;
        maxX = x > maxX ? x : maxX;
        maxY = y > maxY ? y : maxY;

        this.minX = minX;
        this.minY = minY;
        this.maxX = maxX;
        this.maxY = maxY;
    };

    /**
     * Adds sprite frame, transformed.
     *
     * @param {PIXI.TransformBase} transform - TODO
     * @param {number} x0 - TODO
     * @param {number} y0 - TODO
     * @param {number} x1 - TODO
     * @param {number} y1 - TODO
     */


    Bounds.prototype.addFrame = function addFrame(transform, x0, y0, x1, y1) {
        var matrix = transform.worldTransform;
        var a = matrix.a;
        var b = matrix.b;
        var c = matrix.c;
        var d = matrix.d;
        var tx = matrix.tx;
        var ty = matrix.ty;

        var minX = this.minX;
        var minY = this.minY;
        var maxX = this.maxX;
        var maxY = this.maxY;

        var x = a * x0 + c * y0 + tx;
        var y = b * x0 + d * y0 + ty;

        minX = x < minX ? x : minX;
        minY = y < minY ? y : minY;
        maxX = x > maxX ? x : maxX;
        maxY = y > maxY ? y : maxY;

        x = a * x1 + c * y0 + tx;
        y = b * x1 + d * y0 + ty;
        minX = x < minX ? x : minX;
        minY = y < minY ? y : minY;
        maxX = x > maxX ? x : maxX;
        maxY = y > maxY ? y : maxY;

        x = a * x0 + c * y1 + tx;
        y = b * x0 + d * y1 + ty;
        minX = x < minX ? x : minX;
        minY = y < minY ? y : minY;
        maxX = x > maxX ? x : maxX;
        maxY = y > maxY ? y : maxY;

        x = a * x1 + c * y1 + tx;
        y = b * x1 + d * y1 + ty;
        minX = x < minX ? x : minX;
        minY = y < minY ? y : minY;
        maxX = x > maxX ? x : maxX;
        maxY = y > maxY ? y : maxY;

        this.minX = minX;
        this.minY = minY;
        this.maxX = maxX;
        this.maxY = maxY;
    };

    /**
     * Add an array of vertices
     *
     * @param {PIXI.TransformBase} transform - TODO
     * @param {Float32Array} vertices - TODO
     * @param {number} beginOffset - TODO
     * @param {number} endOffset - TODO
     */


    Bounds.prototype.addVertices = function addVertices(transform, vertices, beginOffset, endOffset) {
        var matrix = transform.worldTransform;
        var a = matrix.a;
        var b = matrix.b;
        var c = matrix.c;
        var d = matrix.d;
        var tx = matrix.tx;
        var ty = matrix.ty;

        var minX = this.minX;
        var minY = this.minY;
        var maxX = this.maxX;
        var maxY = this.maxY;

        for (var i = beginOffset; i < endOffset; i += 2) {
            var rawX = vertices[i];
            var rawY = vertices[i + 1];
            var x = a * rawX + c * rawY + tx;
            var y = d * rawY + b * rawX + ty;

            minX = x < minX ? x : minX;
            minY = y < minY ? y : minY;
            maxX = x > maxX ? x : maxX;
            maxY = y > maxY ? y : maxY;
        }

        this.minX = minX;
        this.minY = minY;
        this.maxX = maxX;
        this.maxY = maxY;
    };

    /**
     * Adds other Bounds
     *
     * @param {PIXI.Bounds} bounds - TODO
     */


    Bounds.prototype.addBounds = function addBounds(bounds) {
        var minX = this.minX;
        var minY = this.minY;
        var maxX = this.maxX;
        var maxY = this.maxY;

        this.minX = bounds.minX < minX ? bounds.minX : minX;
        this.minY = bounds.minY < minY ? bounds.minY : minY;
        this.maxX = bounds.maxX > maxX ? bounds.maxX : maxX;
        this.maxY = bounds.maxY > maxY ? bounds.maxY : maxY;
    };

    /**
     * Adds other Bounds, masked with Bounds
     *
     * @param {PIXI.Bounds} bounds - TODO
     * @param {PIXI.Bounds} mask - TODO
     */


    Bounds.prototype.addBoundsMask = function addBoundsMask(bounds, mask) {
        var _minX = bounds.minX > mask.minX ? bounds.minX : mask.minX;
        var _minY = bounds.minY > mask.minY ? bounds.minY : mask.minY;
        var _maxX = bounds.maxX < mask.maxX ? bounds.maxX : mask.maxX;
        var _maxY = bounds.maxY < mask.maxY ? bounds.maxY : mask.maxY;

        if (_minX <= _maxX && _minY <= _maxY) {
            var minX = this.minX;
            var minY = this.minY;
            var maxX = this.maxX;
            var maxY = this.maxY;

            this.minX = _minX < minX ? _minX : minX;
            this.minY = _minY < minY ? _minY : minY;
            this.maxX = _maxX > maxX ? _maxX : maxX;
            this.maxY = _maxY > maxY ? _maxY : maxY;
        }
    };

    /**
     * Adds other Bounds, masked with Rectangle
     *
     * @param {PIXI.Bounds} bounds - TODO
     * @param {PIXI.Rectangle} area - TODO
     */


    Bounds.prototype.addBoundsArea = function addBoundsArea(bounds, area) {
        var _minX = bounds.minX > area.x ? bounds.minX : area.x;
        var _minY = bounds.minY > area.y ? bounds.minY : area.y;
        var _maxX = bounds.maxX < area.x + area.width ? bounds.maxX : area.x + area.width;
        var _maxY = bounds.maxY < area.y + area.height ? bounds.maxY : area.y + area.height;

        if (_minX <= _maxX && _minY <= _maxY) {
            var minX = this.minX;
            var minY = this.minY;
            var maxX = this.maxX;
            var maxY = this.maxY;

            this.minX = _minX < minX ? _minX : minX;
            this.minY = _minY < minY ? _minY : minY;
            this.maxX = _maxX > maxX ? _maxX : maxX;
            this.maxY = _maxY > maxY ? _maxY : maxY;
        }
    };

    return Bounds;
}();

exports.default = Bounds;

},{"../math":53}],32:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require('../utils');

var _DisplayObject2 = require('./DisplayObject');

var _DisplayObject3 = _interopRequireDefault(_DisplayObject2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * A Container represents a collection of display objects.
 * It is the base class of all display objects that act as a container for other objects.
 *
 *```js
 * let container = new PIXI.Container();
 * container.addChild(sprite);
 * ```
 *
 * @class
 * @extends PIXI.DisplayObject
 * @memberof PIXI
 */
var Container = function (_DisplayObject) {
    _inherits(Container, _DisplayObject);

    /**
     *
     */
    function Container() {
        _classCallCheck(this, Container);

        /**
         * The array of children of this container.
         *
         * @member {PIXI.DisplayObject[]}
         * @readonly
         */
        var _this = _possibleConstructorReturn(this, _DisplayObject.call(this));

        _this.children = [];
        return _this;
    }

    /**
     * Overridable method that can be used by Container subclasses whenever the children array is modified
     *
     * @private
     */


    Container.prototype.onChildrenChange = function onChildrenChange() {}
    /* empty */


    /**
     * Adds a child or multiple children to the container.
     *
     * Multple items can be added like so: `myContainer.addChild(thinkOne, thingTwo, thingThree)`
     *
     * @param {...PIXI.DisplayObject} child - The DisplayObject(s) to add to the container
     * @return {PIXI.DisplayObject} The first child that was added.
     */
    ;

    Container.prototype.addChild = function addChild() {
        for (var _len = arguments.length, childs = Array(_len), _key = 0; _key < _len; _key++) {
            childs[_key] = arguments[_key];
        }

        for (var i = 0; i < childs.length; ++i) {
            var child = childs[i];

            // if the child has a parent then lets remove it as Pixi objects can only exist in one place
            if (child.parent) {
                child.parent.removeChild(child);
            }

            child.parent = this;

            // ensure a transform will be recalculated..
            this._worldTransform._parentID = -1;
            this._boundsID++;

            this.children.push(child);

            // TODO - lets either do all callbacks or all events.. not both!
            this.onChildrenChange(this.children.length - 1);
            child.emit('added', this);
        }

        return childs[0];
    };

    /**
     * Adds a child to the container at a specified index. If the index is out of bounds an error will be thrown
     *
     * @param {PIXI.DisplayObject} child - The child to add
     * @param {number} index - The index to place the child in
     * @return {PIXI.DisplayObject} The child that was added.
     */


    Container.prototype.addChildAt = function addChildAt(child, index) {
        if (index < 0 || index > this.children.length) {
            throw new Error(child + 'addChildAt: The index ' + index + ' supplied is out of bounds ' + this.children.length);
        }

        if (child.parent) {
            child.parent.removeChild(child);
        }

        child.parent = this;

        this.children.splice(index, 0, child);

        // TODO - lets either do all callbacks or all events.. not both!
        this.onChildrenChange(index);
        child.emit('added', this);

        return child;
    };

    /**
     * Swaps the position of 2 Display Objects within this container.
     *
     * @param {PIXI.DisplayObject} child - First display object to swap
     * @param {PIXI.DisplayObject} child2 - Second display object to swap
     */


    Container.prototype.swapChildren = function swapChildren(child, child2) {
        if (child === child2) {
            return;
        }

        var index1 = this.getChildIndex(child);
        var index2 = this.getChildIndex(child2);

        this.children[index1] = child2;
        this.children[index2] = child;
        this.onChildrenChange(index1 < index2 ? index1 : index2);
    };

    /**
     * Returns the index position of a child DisplayObject instance
     *
     * @param {PIXI.DisplayObject} child - The DisplayObject instance to identify
     * @return {number} The index position of the child display object to identify
     */


    Container.prototype.getChildIndex = function getChildIndex(child) {
        var index = this.children.indexOf(child);

        if (index === -1) {
            throw new Error('The supplied DisplayObject must be a child of the caller');
        }

        return index;
    };

    /**
     * Changes the position of an existing child in the display object container
     *
     * @param {PIXI.DisplayObject} child - The child DisplayObject instance for which you want to change the index number
     * @param {number} index - The resulting index number for the child display object
     */


    Container.prototype.setChildIndex = function setChildIndex(child, index) {
        if (index < 0 || index >= this.children.length) {
            throw new Error('The supplied index is out of bounds');
        }

        var currentIndex = this.getChildIndex(child);

        (0, _utils.removeItems)(this.children, currentIndex, 1); // remove from old position
        this.children.splice(index, 0, child); // add at new position
        this.onChildrenChange(index);
    };

    /**
     * Returns the child at the specified index
     *
     * @param {number} index - The index to get the child at
     * @return {PIXI.DisplayObject} The child at the given index, if any.
     */


    Container.prototype.getChildAt = function getChildAt(index) {
        if (index < 0 || index >= this.children.length) {
            throw new Error('getChildAt: Index (' + index + ') does not exist.');
        }

        return this.children[index];
    };

    /**
     * Removes a child from the container.
     *
     * @param {...PIXI.DisplayObject} childs - The DisplayObject(s) to remove
     * @return {PIXI.DisplayObject} The first child that was removed.
     */


    Container.prototype.removeChild = function removeChild() {
        for (var _len2 = arguments.length, childs = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            childs[_key2] = arguments[_key2];
        }

        for (var i = 0; i < childs.length; ++i) {
            var child = childs[i];
            var index = this.children.indexOf(child);

            if (index === -1) continue;

            child.parent = null;
            (0, _utils.removeItems)(this.children, index, 1);

            // TODO - lets either do all callbacks or all events.. not both!
            this.onChildrenChange(index);
            child.emit('removed', this);
        }

        return childs[0];
    };

    /**
     * Removes a child from the specified index position.
     *
     * @param {number} index - The index to get the child from
     * @return {PIXI.DisplayObject} The child that was removed.
     */


    Container.prototype.removeChildAt = function removeChildAt(index) {
        var child = this.getChildAt(index);

        child.parent = null;
        (0, _utils.removeItems)(this.children, index, 1);

        // TODO - lets either do all callbacks or all events.. not both!
        this.onChildrenChange(index);
        child.emit('removed', this);

        return child;
    };

    /**
     * Removes all children from this container that are within the begin and end indexes.
     *
     * @param {number} [beginIndex=0] - The beginning position.
     * @param {number} [endIndex=this.children.length] - The ending position. Default value is size of the container.
     * @returns {DisplayObject[]} List of removed children
     */


    Container.prototype.removeChildren = function removeChildren() {
        var beginIndex = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        var endIndex = arguments[1];

        var begin = beginIndex;
        var end = typeof endIndex === 'number' ? endIndex : this.children.length;
        var range = end - begin;
        var removed = void 0;

        if (range > 0 && range <= end) {
            removed = this.children.splice(begin, range);

            for (var i = 0; i < removed.length; ++i) {
                removed[i].parent = null;
            }

            this.onChildrenChange(beginIndex);

            for (var _i = 0; _i < removed.length; ++_i) {
                removed[_i].emit('removed', this);
            }

            return removed;
        } else if (range === 0 && this.children.length === 0) {
            return [];
        }

        throw new RangeError('removeChildren: numeric values are outside the acceptable range.');
    };

    /**
     * Updates the transform on all children of this container for rendering
     *
     * @private
     */


    Container.prototype.updateTransform = function updateTransform() {
        this._boundsID++;

        this.transform.updateTransform(this.parent.transform);

        // TODO: check render flags, how to process stuff here
        this.worldAlpha = this.alpha * this.parent.worldAlpha;

        for (var i = 0, j = this.children.length; i < j; ++i) {
            var child = this.children[i];

            if (child.visible) {
                child.updateTransform();
            }
        }
    };

    /**
     * Recalculates the bounds of the container.
     *
     */


    Container.prototype.calculateBounds = function calculateBounds() {
        this._bounds.clear();

        this._calculateBounds();

        for (var i = 0; i < this.children.length; i++) {
            var child = this.children[i];

            if (!child.visible || !child.renderable) {
                continue;
            }

            child.calculateBounds();

            // TODO: filter+mask, need to mask both somehow
            if (child._mask) {
                child._mask.calculateBounds();
                this._bounds.addBoundsMask(child._bounds, child._mask._bounds);
            } else if (child.filterArea) {
                this._bounds.addBoundsArea(child._bounds, child.filterArea);
            } else {
                this._bounds.addBounds(child._bounds);
            }
        }

        this._lastBoundsID = this._boundsID;
    };

    /**
     * Recalculates the bounds of the object. Override this to
     * calculate the bounds of the specific object (not including children).
     *
     */


    Container.prototype._calculateBounds = function _calculateBounds() {}
    // FILL IN//


    /**
     * Renders the object using the WebGL renderer
     *
     * @param {PIXI.WebGLRenderer} renderer - The renderer
     */
    ;

    Container.prototype.renderWebGL = function renderWebGL(renderer) {
        // if the object is not visible or the alpha is 0 then no need to render this element
        if (!this.visible || this.worldAlpha <= 0 || !this.renderable) {
            return;
        }

        // do a quick check to see if this element has a mask or a filter.
        if (this._mask || this._filters) {
            this.renderAdvancedWebGL(renderer);
        } else {
            this._renderWebGL(renderer);

            // simple render children!
            for (var i = 0, j = this.children.length; i < j; ++i) {
                this.children[i].renderWebGL(renderer);
            }
        }
    };

    /**
     * Render the object using the WebGL renderer and advanced features.
     *
     * @private
     * @param {PIXI.WebGLRenderer} renderer - The renderer
     */


    Container.prototype.renderAdvancedWebGL = function renderAdvancedWebGL(renderer) {
        renderer.currentRenderer.flush();

        var filters = this._filters;
        var mask = this.mask;

        // push filter first as we need to ensure the stencil buffer is correct for any masking
        if (filters) {
            if (!this._enabledFilters) {
                this._enabledFilters = [];
            }

            this._enabledFilters.length = 0;

            for (var i = 0; i < filters.length; i++) {
                if (filters[i].enabled) {
                    this._enabledFilters.push(filters[i]);
                }
            }

            if (this._enabledFilters.length) {
                renderer.filterManager.pushFilter(this, this._enabledFilters);
            }
        }

        if (mask) {
            renderer.maskManager.pushMask(this, this.mask);
        }

        renderer.currentRenderer.start();

        // add this object to the batch, only rendered if it has a texture.
        this._renderWebGL(renderer);

        // now loop through the children and make sure they get rendered
        for (var _i2 = 0, j = this.children.length; _i2 < j; _i2++) {
            this.children[_i2].renderWebGL(renderer);
        }

        renderer.currentRenderer.flush();

        if (mask) {
            renderer.maskManager.popMask(this, this.mask);
        }

        if (filters && this._enabledFilters && this._enabledFilters.length) {
            renderer.filterManager.popFilter();
        }

        renderer.currentRenderer.start();
    };

    /**
     * To be overridden by the subclasses.
     *
     * @private
     * @param {PIXI.WebGLRenderer} renderer - The renderer
     */


    Container.prototype._renderWebGL = function _renderWebGL(renderer) // eslint-disable-line no-unused-vars
    {}
    // this is where content itself gets rendered...


    /**
     * To be overridden by the subclass
     *
     * @private
     * @param {PIXI.CanvasRenderer} renderer - The renderer
     */
    ;

    Container.prototype._renderCanvas = function _renderCanvas(renderer) // eslint-disable-line no-unused-vars
    {}
    // this is where content itself gets rendered...


    /**
     * Renders the object using the Canvas renderer
     *
     * @param {PIXI.CanvasRenderer} renderer - The renderer
     */
    ;

    Container.prototype.renderCanvas = function renderCanvas(renderer) {
        // if not visible or the alpha is 0 then no need to render this
        if (!this.visible || this.worldAlpha <= 0 || !this.renderable) {
            return;
        }

        if (this._mask) {
            renderer.maskManager.pushMask(this._mask);
        }

        this._renderCanvas(renderer);
        for (var i = 0, j = this.children.length; i < j; ++i) {
            this.children[i].renderCanvas(renderer);
        }

        if (this._mask) {
            renderer.maskManager.popMask(renderer);
        }
    };

    /**
     * Removes all internal references and listeners as well as removes children from the display list.
     * Do not use a Container after calling `destroy`.
     *
     * @param {object|boolean} [options] - Options parameter. A boolean will act as if all options
     *  have been set to that value
     * @param {boolean} [options.children=false] - if set to true, all the children will have their destroy
     *  method called as well. 'options' will be passed on to those calls.
     */


    Container.prototype.destroy = function destroy(options) {
        _DisplayObject.prototype.destroy.call(this);

        var destroyChildren = typeof options === 'boolean' ? options : options && options.children;

        var oldChildren = this.removeChildren(0, this.children.length);

        if (destroyChildren) {
            for (var i = 0; i < oldChildren.length; ++i) {
                oldChildren[i].destroy(options);
            }
        }
    };

    /**
     * The width of the Container, setting this will actually modify the scale to achieve the value set
     *
     * @member {number}
     * @memberof PIXI.Container#
     */


    _createClass(Container, [{
        key: 'width',
        get: function get() {
            return this.scale.x * this.getLocalBounds().width;
        }

        /**
         * Sets the width of the container by modifying the scale.
         *
         * @param {number} value - The value to set to.
         */
        ,
        set: function set(value) {
            var width = this.getLocalBounds().width;

            if (width !== 0) {
                this.scale.x = value / width;
            } else {
                this.scale.x = 1;
            }

            this._width = value;
        }

        /**
         * The height of the Container, setting this will actually modify the scale to achieve the value set
         *
         * @member {number}
         * @memberof PIXI.Container#
         */

    }, {
        key: 'height',
        get: function get() {
            return this.scale.y * this.getLocalBounds().height;
        }

        /**
         * Sets the height of the container by modifying the scale.
         *
         * @param {number} value - The value to set to.
         */
        ,
        set: function set(value) {
            var height = this.getLocalBounds().height;

            if (height !== 0) {
                this.scale.y = value / height;
            } else {
                this.scale.y = 1;
            }

            this._height = value;
        }
    }]);

    return Container;
}(_DisplayObject3.default);

// performance increase to avoid using call.. (10x faster)


exports.default = Container;
Container.prototype.containerUpdateTransform = Container.prototype.updateTransform;

game.Container.inject({
    renderWebGL: function renderWebGL(renderer) {
        if (!this.visible || this._worldAlpha <= 0 || !this.renderable) return;

        if (this.mask || this.filters) {
            this.renderAdvancedWebGL(renderer);
        } else {
            this._renderWebGL(renderer);

            for (var i = 0; i < this.children.length; i++) {
                var child = this.children[i];
                if (!child.visible || child.alpha <= 0 || !child.renderable) continue;
                child.renderWebGL(renderer);
            }
        }
    },

    renderAdvancedWebGL: function renderAdvancedWebGL(renderer) {
        renderer.currentRenderer.flush();

        var filters = this.filters;
        var mask = this.mask;

        // push filter first as we need to ensure the stencil buffer is correct for any masking
        if (filters) {
            if (!this._enabledFilters) {
                this._enabledFilters = [];
            }

            this._enabledFilters.length = 0;

            for (var i = 0; i < filters.length; i++) {
                if (filters[i].enabled) {
                    this._enabledFilters.push(filters[i]);
                }
            }

            if (this._enabledFilters.length) {
                renderer.filterManager.pushFilter(this, this._enabledFilters);
            }
        }

        if (mask) {
            renderer.maskManager.pushMask(this, this.mask);
        }

        renderer.currentRenderer.start();

        // add this object to the batch, only rendered if it has a texture.
        this._renderWebGL(renderer);

        // now loop through the children and make sure they get rendered
        for (var _i3 = 0, j = this.children.length; _i3 < j; _i3++) {
            this.children[_i3].renderWebGL(renderer);
        }

        renderer.currentRenderer.flush();

        if (mask) {
            renderer.maskManager.popMask(this, this.mask);
        }

        if (filters && this._enabledFilters && this._enabledFilters.length) {
            renderer.filterManager.popFilter();
        }

        renderer.currentRenderer.start();
    },

    _renderWebGL: function _renderWebGL(renderer) {}
});

game.FastContainer.inject({
    _renderBatch: function _renderBatch(child, context) {
        if (game.webgl) child._render(context);else this.super(child, context);
    },

    _updateChildTransform: function _updateChildTransform() {
        if (game.webgl) game.Container.prototype._updateChildTransform.call(this);else this.super();
    }
});

},{"../utils":101,"./DisplayObject":33}],33:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _eventemitter = require('eventemitter3');

var _eventemitter2 = _interopRequireDefault(_eventemitter);

var _const = require('../const');

var _TransformStatic = require('./TransformStatic');

var _TransformStatic2 = _interopRequireDefault(_TransformStatic);

var _Transform = require('./Transform');

var _Transform2 = _interopRequireDefault(_Transform);

var _Bounds = require('./Bounds');

var _Bounds2 = _interopRequireDefault(_Bounds);

var _math = require('../math');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// _tempDisplayObjectParent = new DisplayObject();

/**
 * The base class for all objects that are rendered on the screen.
 * This is an abstract class and should not be used on its own rather it should be extended.
 *
 * @class
 * @extends EventEmitter
 * @mixes PIXI.interaction.interactiveTarget
 * @memberof PIXI
 */
var DisplayObject = function (_EventEmitter) {
    _inherits(DisplayObject, _EventEmitter);

    /**
     *
     */
    function DisplayObject() {
        _classCallCheck(this, DisplayObject);

        var _this = _possibleConstructorReturn(this, _EventEmitter.call(this));

        var TransformClass = _const.TRANSFORM_MODE.DEFAULT === _const.TRANSFORM_MODE.STATIC ? _TransformStatic2.default : _Transform2.default;

        _this.tempDisplayObjectParent = null;

        // TODO: need to create Transform from factory
        /**
         * World transform and local transform of this object.
         * This will become read-only later, please do not assign anything there unless you know what are you doing
         *
         * @member {PIXI.TransformBase}
         */
        _this.transform = new TransformClass();

        /**
         * The opacity of the object.
         *
         * @member {number}
         */
        _this.alpha = 1;

        /**
         * The visibility of the object. If false the object will not be drawn, and
         * the updateTransform function will not be called.
         *
         * Only affects recursive calls from parent. You can ask for bounds or call updateTransform manually
         *
         * @member {boolean}
         */
        _this.visible = true;

        /**
         * Can this object be rendered, if false the object will not be drawn but the updateTransform
         * methods will still be called.
         *
         * Only affects recursive calls from parent. You can ask for bounds manually
         *
         * @member {boolean}
         */
        _this.renderable = true;

        /**
         * The display object container that contains this display object.
         *
         * @member {PIXI.Container}
         * @readonly
         */
        _this.parent = null;

        /**
         * The multiplied alpha of the displayObject
         *
         * @member {number}
         * @readonly
         */
        _this.worldAlpha = 1;

        /**
         * The area the filter is applied to. This is used as more of an optimisation
         * rather than figuring out the dimensions of the displayObject each frame you can set this rectangle
         *
         * Also works as an interaction mask
         *
         * @member {PIXI.Rectangle}
         */
        _this.filterArea = null;

        _this._filters = null;
        _this._enabledFilters = null;

        /**
         * The bounds object, this is used to calculate and store the bounds of the displayObject
         *
         * @member {PIXI.Rectangle}
         * @private
         */
        _this._bounds = new _Bounds2.default();
        _this._boundsID = 0;
        _this._lastBoundsID = -1;
        _this._boundsRect = null;
        _this._localBoundsRect = null;

        /**
         * The original, cached mask of the object
         *
         * @member {PIXI.Rectangle}
         * @private
         */
        _this._mask = null;
        return _this;
    }

    /**
     * @private
     * @member {PIXI.DisplayObject}
     */


    /**
     * Updates the object transform for rendering
     *
     * TODO - Optimization pass!
     */
    DisplayObject.prototype.updateTransform = function updateTransform() {
        this.transform.updateTransform(this.parent.transform);
        // multiply the alphas..
        this.worldAlpha = this.alpha * this.parent.worldAlpha;

        this._bounds.updateID++;
    };

    /**
     * recursively updates transform of all objects from the root to this one
     * internal function for toLocal()
     */


    DisplayObject.prototype._recursivePostUpdateTransform = function _recursivePostUpdateTransform() {
        if (this.parent) {
            this.parent._recursivePostUpdateTransform();
            this.transform.updateTransform(this.parent.transform);
        } else {
            this.transform.updateTransform(this._tempDisplayObjectParent.transform);
        }
    };

    /**
     * Retrieves the bounds of the displayObject as a rectangle object.
     *
     * @param {boolean} skipUpdate - setting to true will stop the transforms of the scene graph from
     *  being updated. This means the calculation returned MAY be out of date BUT will give you a
     *  nice performance boost
     * @param {PIXI.Rectangle} rect - Optional rectangle to store the result of the bounds calculation
     * @return {PIXI.Rectangle} the rectangular bounding area
     */


    DisplayObject.prototype.getBounds = function getBounds(skipUpdate, rect) {
        if (!skipUpdate) {
            if (!this.parent) {
                this.parent = this._tempDisplayObjectParent;
                this.updateTransform();
                this.parent = null;
            } else {
                this._recursivePostUpdateTransform();
                this.updateTransform();
            }
        }

        if (this._boundsID !== this._lastBoundsID) {
            this.calculateBounds();
        }

        if (!rect) {
            if (!this._boundsRect) {
                this._boundsRect = new _math.Rectangle();
            }

            rect = this._boundsRect;
        }

        return this._bounds.getRectangle(rect);
    };

    /**
     * Retrieves the local bounds of the displayObject as a rectangle object
     *
     * @param {PIXI.Rectangle} [rect] - Optional rectangle to store the result of the bounds calculation
     * @return {PIXI.Rectangle} the rectangular bounding area
     */


    DisplayObject.prototype.getLocalBounds = function getLocalBounds(rect) {
        var transformRef = this.transform;
        var parentRef = this.parent;

        this.parent = null;
        this.transform = this._tempDisplayObjectParent.transform;

        if (!rect) {
            if (!this._localBoundsRect) {
                this._localBoundsRect = new _math.Rectangle();
            }

            rect = this._localBoundsRect;
        }

        var bounds = this.getBounds(false, rect);

        this.parent = parentRef;
        this.transform = transformRef;

        return bounds;
    };

    /**
     * Calculates the global position of the display object
     *
     * @param {PIXI.Point} position - The world origin to calculate from
     * @param {PIXI.Point} [point] - A Point object in which to store the value, optional
     *  (otherwise will create a new Point)
     * @param {boolean} [skipUpdate=false] - Should we skip the update transform.
     * @return {PIXI.Point} A point object representing the position of this object
     */


    DisplayObject.prototype.toGlobal = function toGlobal(position, point) {
        var skipUpdate = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

        if (!skipUpdate) {
            this._recursivePostUpdateTransform();

            // this parent check is for just in case the item is a root object.
            // If it is we need to give it a temporary parent so that displayObjectUpdateTransform works correctly
            // this is mainly to avoid a parent check in the main loop. Every little helps for performance :)
            if (!this.parent) {
                this.parent = this._tempDisplayObjectParent;
                this.displayObjectUpdateTransform();
                this.parent = null;
            } else {
                this.displayObjectUpdateTransform();
            }
        }

        // don't need to update the lot
        return this.worldTransform.apply(position, point);
    };

    /**
     * Calculates the local position of the display object relative to another point
     *
     * @param {PIXI.Point} position - The world origin to calculate from
     * @param {PIXI.DisplayObject} [from] - The DisplayObject to calculate the global position from
     * @param {PIXI.Point} [point] - A Point object in which to store the value, optional
     *  (otherwise will create a new Point)
     * @param {boolean} [skipUpdate=false] - Should we skip the update transform
     * @return {PIXI.Point} A point object representing the position of this object
     */


    DisplayObject.prototype.toLocal = function toLocal(position, from, point, skipUpdate) {
        if (from) {
            position = from.toGlobal(position, point, skipUpdate);
        }

        if (!skipUpdate) {
            this._recursivePostUpdateTransform();

            // this parent check is for just in case the item is a root object.
            // If it is we need to give it a temporary parent so that displayObjectUpdateTransform works correctly
            // this is mainly to avoid a parent check in the main loop. Every little helps for performance :)
            if (!this.parent) {
                this.parent = this._tempDisplayObjectParent;
                this.displayObjectUpdateTransform();
                this.parent = null;
            } else {
                this.displayObjectUpdateTransform();
            }
        }

        // simply apply the matrix..
        return this.worldTransform.applyInverse(position, point);
    };

    /**
     * Renders the object using the WebGL renderer
     *
     * @param {PIXI.WebGLRenderer} renderer - The renderer
     */


    DisplayObject.prototype.renderWebGL = function renderWebGL(renderer) // eslint-disable-line no-unused-vars
    {}
    // OVERWRITE;


    /**
     * Renders the object using the Canvas renderer
     *
     * @param {PIXI.CanvasRenderer} renderer - The renderer
     */
    ;

    DisplayObject.prototype.renderCanvas = function renderCanvas(renderer) // eslint-disable-line no-unused-vars
    {}
    // OVERWRITE;


    /**
     * Set the parent Container of this DisplayObject
     *
     * @param {PIXI.Container} container - The Container to add this DisplayObject to
     * @return {PIXI.Container} The Container that this DisplayObject was added to
     */
    ;

    DisplayObject.prototype.setParent = function setParent(container) {
        if (!container || !container.addChild) {
            throw new Error('setParent: Argument must be a Container');
        }

        container.addChild(this);

        return container;
    };

    /**
     * Convenience function to set the postion, scale, skew and pivot at once.
     *
     * @param {number} [x=0] - The X position
     * @param {number} [y=0] - The Y position
     * @param {number} [scaleX=1] - The X scale value
     * @param {number} [scaleY=1] - The Y scale value
     * @param {number} [rotation=0] - The rotation
     * @param {number} [skewX=0] - The X skew value
     * @param {number} [skewY=0] - The Y skew value
     * @param {number} [pivotX=0] - The X pivot value
     * @param {number} [pivotY=0] - The Y pivot value
     * @return {PIXI.DisplayObject} The DisplayObject instance
     */


    DisplayObject.prototype.setTransform = function setTransform() {
        var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var scaleX = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
        var scaleY = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
        var rotation = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
        var skewX = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
        var skewY = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 0;
        var pivotX = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 0;
        var pivotY = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : 0;

        this.position.x = x;
        this.position.y = y;
        this.scale.x = !scaleX ? 1 : scaleX;
        this.scale.y = !scaleY ? 1 : scaleY;
        this.rotation = rotation;
        this.skew.x = skewX;
        this.skew.y = skewY;
        this.pivot.x = pivotX;
        this.pivot.y = pivotY;

        return this;
    };

    /**
     * Base destroy method for generic display objects. This will automatically
     * remove the display object from its parent Container as well as remove
     * all current event listeners and internal references. Do not use a DisplayObject
     * after calling `destroy`.
     *
     */


    DisplayObject.prototype.destroy = function destroy() {
        this.removeAllListeners();
        if (this.parent) {
            this.parent.removeChild(this);
        }
        this.transform = null;

        this.parent = null;

        this._bounds = null;
        this._currentBounds = null;
        this._mask = null;

        this.filterArea = null;

        this.interactive = false;
        this.interactiveChildren = false;
    };

    /**
     * The position of the displayObject on the x axis relative to the local coordinates of the parent.
     * An alias to position.x
     *
     * @member {number}
     * @memberof PIXI.DisplayObject#
     */


    _createClass(DisplayObject, [{
        key: '_tempDisplayObjectParent',
        get: function get() {
            if (this.tempDisplayObjectParent === null) {
                this.tempDisplayObjectParent = new DisplayObject();
            }

            return this.tempDisplayObjectParent;
        }
    }, {
        key: 'x',
        get: function get() {
            return this.position.x;
        }

        /**
         * Sets the X position of the object.
         *
         * @param {number} value - The value to set to.
         */
        ,
        set: function set(value) {
            this.transform.position.x = value;
        }

        /**
         * The position of the displayObject on the y axis relative to the local coordinates of the parent.
         * An alias to position.y
         *
         * @member {number}
         * @memberof PIXI.DisplayObject#
         */

    }, {
        key: 'y',
        get: function get() {
            return this.position.y;
        }

        /**
         * Sets the Y position of the object.
         *
         * @param {number} value - The value to set to.
         */
        ,
        set: function set(value) {
            this.transform.position.y = value;
        }

        /**
         * Current transform of the object based on world (parent) factors
         *
         * @member {PIXI.Matrix}
         * @memberof PIXI.DisplayObject#
         * @readonly
         */

    }, {
        key: 'worldTransform',
        get: function get() {
            return this.transform.worldTransform;
        }

        /**
         * Current transform of the object based on local factors: position, scale, other stuff
         *
         * @member {PIXI.Matrix}
         * @memberof PIXI.DisplayObject#
         * @readonly
         */

    }, {
        key: 'localTransform',
        get: function get() {
            return this.transform.localTransform;
        }

        /**
         * The coordinate of the object relative to the local coordinates of the parent.
         * Assignment by value since pixi-v4.
         *
         * @member {PIXI.Point|PIXI.ObservablePoint}
         * @memberof PIXI.DisplayObject#
         */

    }, {
        key: 'position',
        get: function get() {
            return this.transform.position;
        }

        /**
         * Copies the point to the position of the object.
         *
         * @param {PIXI.Point} value - The value to set to.
         */
        ,
        set: function set(value) {
            this.transform.position.copy(value);
        }

        /**
         * The scale factor of the object.
         * Assignment by value since pixi-v4.
         *
         * @member {PIXI.Point|PIXI.ObservablePoint}
         * @memberof PIXI.DisplayObject#
         */

    }, {
        key: 'scale',
        get: function get() {
            return this.transform.scale;
        }

        /**
         * Copies the point to the scale of the object.
         *
         * @param {PIXI.Point} value - The value to set to.
         */
        ,
        set: function set(value) {
            this.transform.scale.copy(value);
        }

        /**
         * The pivot point of the displayObject that it rotates around
         * Assignment by value since pixi-v4.
         *
         * @member {PIXI.Point|PIXI.ObservablePoint}
         * @memberof PIXI.DisplayObject#
         */

    }, {
        key: 'pivot',
        get: function get() {
            return this.transform.pivot;
        }

        /**
         * Copies the point to the pivot of the object.
         *
         * @param {PIXI.Point} value - The value to set to.
         */
        ,
        set: function set(value) {
            this.transform.pivot.copy(value);
        }

        /**
         * The skew factor for the object in radians.
         * Assignment by value since pixi-v4.
         *
         * @member {PIXI.ObservablePoint}
         * @memberof PIXI.DisplayObject#
         */

    }, {
        key: 'skew',
        get: function get() {
            return this.transform.skew;
        }

        /**
         * Copies the point to the skew of the object.
         *
         * @param {PIXI.Point} value - The value to set to.
         */
        ,
        set: function set(value) {
            this.transform.skew.copy(value);
        }

        /**
         * The rotation of the object in radians.
         *
         * @member {number}
         * @memberof PIXI.DisplayObject#
         */

    }, {
        key: 'rotation',
        get: function get() {
            return this.transform.rotation;
        }

        /**
         * Sets the rotation of the object.
         *
         * @param {number} value - The value to set to.
         */
        ,
        set: function set(value) {
            this.transform.rotation = value;
        }

        /**
         * Indicates if the object is globally visible.
         *
         * @member {boolean}
         * @memberof PIXI.DisplayObject#
         * @readonly
         */

    }, {
        key: 'worldVisible',
        get: function get() {
            var item = this;

            do {
                if (!item.visible) {
                    return false;
                }

                item = item.parent;
            } while (item);

            return true;
        }

        /**
         * Sets a mask for the displayObject. A mask is an object that limits the visibility of an
         * object to the shape of the mask applied to it. In PIXI a regular mask must be a
         * PIXI.Graphics or a PIXI.Sprite object. This allows for much faster masking in canvas as it
         * utilises shape clipping. To remove a mask, set this property to null.
         *
         * @todo For the moment, PIXI.CanvasRenderer doesn't support PIXI.Sprite as mask.
         *
         * @member {PIXI.Graphics|PIXI.Sprite}
         * @memberof PIXI.DisplayObject#
         */

    }, {
        key: 'mask',
        get: function get() {
            return this._mask;
        }

        /**
         * Sets the mask.
         *
         * @param {PIXI.Graphics|PIXI.Sprite} value - The value to set to.
         */
        ,
        set: function set(value) {
            if (this._mask) {
                this._mask.renderable = true;
            }

            this._mask = value;

            if (this._mask) {
                this._mask.renderable = false;
            }
        }

        /**
         * Sets the filters for the displayObject.
         * * IMPORTANT: This is a webGL only feature and will be ignored by the canvas renderer.
         * To remove filters simply set this property to 'null'
         *
         * @member {PIXI.AbstractFilter[]}
         * @memberof PIXI.DisplayObject#
         */

    }, {
        key: 'filters',
        get: function get() {
            return this._filters && this._filters.slice();
        }

        /**
         * Shallow copies the array to the filters of the object.
         *
         * @param {PIXI.Filter[]} value - The filters to set.
         */
        ,
        set: function set(value) {
            this._filters = value && value.slice();
        }
    }]);

    return DisplayObject;
}(_eventemitter2.default);

// performance increase to avoid using call.. (10x faster)


exports.default = DisplayObject;
DisplayObject.prototype.displayObjectUpdateTransform = DisplayObject.prototype.updateTransform;

},{"../const":30,"../math":53,"./Bounds":31,"./Transform":34,"./TransformStatic":36,"eventemitter3":4}],34:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _math = require('../math');

var _TransformBase2 = require('./TransformBase');

var _TransformBase3 = _interopRequireDefault(_TransformBase2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Generic class to deal with traditional 2D matrix transforms
 * local transformation is calculated from position,scale,skew and rotation
 *
 * @class
 * @extends PIXI.TransformBase
 * @memberof PIXI
 */
var Transform = function (_TransformBase) {
  _inherits(Transform, _TransformBase);

  /**
   *
   */
  function Transform() {
    _classCallCheck(this, Transform);

    /**
    * The coordinate of the object relative to the local coordinates of the parent.
    *
    * @member {PIXI.Point}
    */
    var _this = _possibleConstructorReturn(this, _TransformBase.call(this));

    _this.position = new _math.Point(0, 0);

    /**
     * The scale factor of the object.
     *
     * @member {PIXI.Point}
     */
    _this.scale = new _math.Point(1, 1);

    /**
     * The skew amount, on the x and y axis.
     *
     * @member {PIXI.ObservablePoint}
     */
    _this.skew = new _math.ObservablePoint(_this.updateSkew, _this, 0, 0);

    /**
     * The pivot point of the displayObject that it rotates around
     *
     * @member {PIXI.Point}
     */
    _this.pivot = new _math.Point(0, 0);

    /**
     * The rotation value of the object, in radians
     *
     * @member {Number}
     * @private
     */
    _this._rotation = 0;

    _this._sr = Math.sin(0);
    _this._cr = Math.cos(0);
    _this._cy = Math.cos(0); // skewY);
    _this._sy = Math.sin(0); // skewY);
    _this._nsx = Math.sin(0); // skewX);
    _this._cx = Math.cos(0); // skewX);
    return _this;
  }

  /**
   * Updates the skew values when the skew changes.
   *
   * @private
   */


  Transform.prototype.updateSkew = function updateSkew() {
    this._cy = Math.cos(this.skew.y);
    this._sy = Math.sin(this.skew.y);
    this._nsx = Math.sin(this.skew.x);
    this._cx = Math.cos(this.skew.x);
  };

  /**
   * Updates only local matrix
   */


  Transform.prototype.updateLocalTransform = function updateLocalTransform() {
    var lt = this.localTransform;
    var a = this._cr * this.scale.x;
    var b = this._sr * this.scale.x;
    var c = -this._sr * this.scale.y;
    var d = this._cr * this.scale.y;

    lt.a = this._cy * a + this._sy * c;
    lt.b = this._cy * b + this._sy * d;
    lt.c = this._nsx * a + this._cx * c;
    lt.d = this._nsx * b + this._cx * d;
  };

  /**
   * Updates the values of the object and applies the parent's transform.
   *
   * @param {PIXI.Transform} parentTransform - The transform of the parent of this object
   */


  Transform.prototype.updateTransform = function updateTransform(parentTransform) {
    var pt = parentTransform.worldTransform;
    var wt = this.worldTransform;
    var lt = this.localTransform;

    var a = this._cr * this.scale.x;
    var b = this._sr * this.scale.x;
    var c = -this._sr * this.scale.y;
    var d = this._cr * this.scale.y;

    lt.a = this._cy * a + this._sy * c;
    lt.b = this._cy * b + this._sy * d;
    lt.c = this._nsx * a + this._cx * c;
    lt.d = this._nsx * b + this._cx * d;

    lt.tx = this.position.x - (this.pivot.x * lt.a + this.pivot.y * lt.c);
    lt.ty = this.position.y - (this.pivot.x * lt.b + this.pivot.y * lt.d);

    // concat the parent matrix with the objects transform.
    wt.a = lt.a * pt.a + lt.b * pt.c;
    wt.b = lt.a * pt.b + lt.b * pt.d;
    wt.c = lt.c * pt.a + lt.d * pt.c;
    wt.d = lt.c * pt.b + lt.d * pt.d;
    wt.tx = lt.tx * pt.a + lt.ty * pt.c + pt.tx;
    wt.ty = lt.tx * pt.b + lt.ty * pt.d + pt.ty;

    this._worldID++;
  };

  /**
   * Decomposes a matrix and sets the transforms properties based on it.
   *
   * @param {PIXI.Matrix} matrix - The matrix to decompose
   */


  Transform.prototype.setFromMatrix = function setFromMatrix(matrix) {
    matrix.decompose(this);
  };

  /**
   * The rotation of the object in radians.
   *
   * @member {number}
   * @memberof PIXI.Transform#
   */


  _createClass(Transform, [{
    key: 'rotation',
    get: function get() {
      return this._rotation;
    }

    /**
     * Set the rotation of the transform.
     *
     * @param {number} value - The value to set to.
     */
    ,
    set: function set(value) {
      this._rotation = value;
      this._sr = Math.sin(value);
      this._cr = Math.cos(value);
    }
  }]);

  return Transform;
}(_TransformBase3.default);

exports.default = Transform;

},{"../math":53,"./TransformBase":35}],35:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _math = require('../math');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Generic class to deal with traditional 2D matrix transforms
 *
 * @class
 * @memberof PIXI
 */
var TransformBase = function () {
  /**
   *
   */
  function TransformBase() {
    _classCallCheck(this, TransformBase);

    /**
     * The global matrix transform. It can be swapped temporarily by some functions like getLocalBounds()
     *
     * @member {PIXI.Matrix}
     */
    this.worldTransform = new _math.Matrix();

    /**
     * The local matrix transform
     *
     * @member {PIXI.Matrix}
     */
    this.localTransform = new _math.Matrix();

    this._worldID = 0;
    this._parentID = 0;
  }

  /**
   * TransformBase does not have decomposition, so this function wont do anything
   */


  TransformBase.prototype.updateLocalTransform = function updateLocalTransform() {}
  // empty


  /**
   * Updates the values of the object and applies the parent's transform.
   *
   * @param {PIXI.TransformBase} parentTransform - The transform of the parent of this object
   */
  ;

  TransformBase.prototype.updateTransform = function updateTransform(parentTransform) {
    var pt = parentTransform.worldTransform;
    var wt = this.worldTransform;
    var lt = this.localTransform;

    // concat the parent matrix with the objects transform.
    wt.a = lt.a * pt.a + lt.b * pt.c;
    wt.b = lt.a * pt.b + lt.b * pt.d;
    wt.c = lt.c * pt.a + lt.d * pt.c;
    wt.d = lt.c * pt.b + lt.d * pt.d;
    wt.tx = lt.tx * pt.a + lt.ty * pt.c + pt.tx;
    wt.ty = lt.tx * pt.b + lt.ty * pt.d + pt.ty;

    this._worldID++;
  };

  return TransformBase;
}();

/**
 * Updates the values of the object and applies the parent's transform.
 * @param  parentTransform {PIXI.Transform} The transform of the parent of this object
 *
 */


exports.default = TransformBase;
TransformBase.prototype.updateWorldTransform = TransformBase.prototype.updateTransform;

TransformBase.IDENTITY = new TransformBase();

},{"../math":53}],36:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _math = require('../math');

var _TransformBase2 = require('./TransformBase');

var _TransformBase3 = _interopRequireDefault(_TransformBase2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Transform that takes care about its versions
 *
 * @class
 * @extends PIXI.TransformBase
 * @memberof PIXI
 */
var TransformStatic = function (_TransformBase) {
  _inherits(TransformStatic, _TransformBase);

  /**
   *
   */
  function TransformStatic() {
    _classCallCheck(this, TransformStatic);

    /**
    * The coordinate of the object relative to the local coordinates of the parent.
    *
    * @member {PIXI.ObservablePoint}
    */
    var _this = _possibleConstructorReturn(this, _TransformBase.call(this));

    _this.position = new _math.ObservablePoint(_this.onChange, _this, 0, 0);

    /**
     * The scale factor of the object.
     *
     * @member {PIXI.ObservablePoint}
     */
    _this.scale = new _math.ObservablePoint(_this.onChange, _this, 1, 1);

    /**
     * The pivot point of the displayObject that it rotates around
     *
     * @member {PIXI.ObservablePoint}
     */
    _this.pivot = new _math.ObservablePoint(_this.onChange, _this, 0, 0);

    /**
     * The skew amount, on the x and y axis.
     *
     * @member {PIXI.ObservablePoint}
     */
    _this.skew = new _math.ObservablePoint(_this.updateSkew, _this, 0, 0);

    _this._rotation = 0;

    _this._sr = Math.sin(0);
    _this._cr = Math.cos(0);
    _this._cy = Math.cos(0); // skewY);
    _this._sy = Math.sin(0); // skewY);
    _this._nsx = Math.sin(0); // skewX);
    _this._cx = Math.cos(0); // skewX);

    _this._localID = 0;
    _this._currentLocalID = 0;
    return _this;
  }

  /**
   * Called when a value changes.
   *
   * @private
   */


  TransformStatic.prototype.onChange = function onChange() {
    this._localID++;
  };

  /**
   * Called when skew changes
   *
   * @private
   */


  TransformStatic.prototype.updateSkew = function updateSkew() {
    this._cy = Math.cos(this.skew._y);
    this._sy = Math.sin(this.skew._y);
    this._nsx = Math.sin(this.skew._x);
    this._cx = Math.cos(this.skew._x);

    this._localID++;
  };

  /**
   * Updates only local matrix
   */


  TransformStatic.prototype.updateLocalTransform = function updateLocalTransform() {
    var lt = this.localTransform;

    if (this._localID !== this._currentLocalID) {
      // get the matrix values of the displayobject based on its transform properties..
      var a = this._cr * this.scale._x;
      var b = this._sr * this.scale._x;
      var c = -this._sr * this.scale._y;
      var d = this._cr * this.scale._y;

      lt.a = this._cy * a + this._sy * c;
      lt.b = this._cy * b + this._sy * d;
      lt.c = this._nsx * a + this._cx * c;
      lt.d = this._nsx * b + this._cx * d;

      lt.tx = this.position._x - (this.pivot._x * lt.a + this.pivot._y * lt.c);
      lt.ty = this.position._y - (this.pivot._x * lt.b + this.pivot._y * lt.d);
      this._currentLocalID = this._localID;

      // force an update..
      this._parentID = -1;
    }
  };

  /**
   * Updates the values of the object and applies the parent's transform.
   *
   * @param {PIXI.Transform} parentTransform - The transform of the parent of this object
   */


  TransformStatic.prototype.updateTransform = function updateTransform(parentTransform) {
    var pt = parentTransform.worldTransform;
    var wt = this.worldTransform;
    var lt = this.localTransform;

    if (this._localID !== this._currentLocalID) {
      // get the matrix values of the displayobject based on its transform properties..
      var a = this._cr * this.scale._x;
      var b = this._sr * this.scale._x;
      var c = -this._sr * this.scale._y;
      var d = this._cr * this.scale._y;

      lt.a = this._cy * a + this._sy * c;
      lt.b = this._cy * b + this._sy * d;
      lt.c = this._nsx * a + this._cx * c;
      lt.d = this._nsx * b + this._cx * d;

      lt.tx = this.position._x - (this.pivot._x * lt.a + this.pivot._y * lt.c);
      lt.ty = this.position._y - (this.pivot._x * lt.b + this.pivot._y * lt.d);
      this._currentLocalID = this._localID;

      // force an update..
      this._parentID = -1;
    }

    if (this._parentID !== parentTransform._worldID) {
      // concat the parent matrix with the objects transform.
      wt.a = lt.a * pt.a + lt.b * pt.c;
      wt.b = lt.a * pt.b + lt.b * pt.d;
      wt.c = lt.c * pt.a + lt.d * pt.c;
      wt.d = lt.c * pt.b + lt.d * pt.d;
      wt.tx = lt.tx * pt.a + lt.ty * pt.c + pt.tx;
      wt.ty = lt.tx * pt.b + lt.ty * pt.d + pt.ty;

      this._parentID = parentTransform._worldID;

      // update the id of the transform..
      this._worldID++;
    }
  };

  /**
   * Decomposes a matrix and sets the transforms properties based on it.
   *
   * @param {PIXI.Matrix} matrix - The matrix to decompose
   */


  TransformStatic.prototype.setFromMatrix = function setFromMatrix(matrix) {
    matrix.decompose(this);
    this._localID++;
  };

  /**
   * The rotation of the object in radians.
   *
   * @member {number}
   * @memberof PIXI.TransformStatic#
   */


  _createClass(TransformStatic, [{
    key: 'rotation',
    get: function get() {
      return this._rotation;
    }

    /**
     * Sets the rotation of the transform.
     *
     * @param {number} value - The value to set to.
     */
    ,
    set: function set(value) {
      this._rotation = value;
      this._sr = Math.sin(value);
      this._cr = Math.cos(value);
      this._localID++;
    }
  }]);

  return TransformStatic;
}(_TransformBase3.default);

exports.default = TransformStatic;

},{"../math":53,"./TransformBase":35}],37:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _Container2 = require('../display/Container');

var _Container3 = _interopRequireDefault(_Container2);

var _RenderTexture = require('../textures/RenderTexture');

var _RenderTexture2 = _interopRequireDefault(_RenderTexture);

var _Texture = require('../textures/Texture');

var _Texture2 = _interopRequireDefault(_Texture);

var _GraphicsData = require('./GraphicsData');

var _GraphicsData2 = _interopRequireDefault(_GraphicsData);

var _Sprite = require('../sprites/Sprite');

var _Sprite2 = _interopRequireDefault(_Sprite);

var _math = require('../math');

var _utils = require('../utils');

var _const = require('../const');

var _Bounds = require('../display/Bounds');

var _Bounds2 = _interopRequireDefault(_Bounds);

var _bezierCurveTo2 = require('./utils/bezierCurveTo');

var _bezierCurveTo3 = _interopRequireDefault(_bezierCurveTo2);

var _CanvasRenderer = require('../renderers/canvas/CanvasRenderer');

var _CanvasRenderer2 = _interopRequireDefault(_CanvasRenderer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var canvasRenderer = void 0;
var tempMatrix = new _math.Matrix();
var tempPoint = new _math.Point();
var tempColor1 = new Float32Array(4);
var tempColor2 = new Float32Array(4);

/**
 * The Graphics class contains methods used to draw primitive shapes such as lines, circles and
 * rectangles to the display, and to color and fill them.
 *
 * @class
 * @extends PIXI.Container
 * @memberof PIXI
 */

var Graphics = function (_Container) {
    _inherits(Graphics, _Container);

    /**
     *
     */
    function Graphics() {
        _classCallCheck(this, Graphics);

        /**
         * The alpha value used when filling the Graphics object.
         *
         * @member {number}
         * @default 1
         */
        var _this = _possibleConstructorReturn(this, _Container.call(this));

        _this.fillAlpha = 1;

        /**
         * The width (thickness) of any lines drawn.
         *
         * @member {number}
         * @default 0
         */
        _this.lineWidth = 0;

        /**
         * The color of any lines drawn.
         *
         * @member {string}
         * @default 0
         */
        _this.lineColor = 0;

        /**
         * Graphics data
         *
         * @member {PIXI.GraphicsData[]}
         * @private
         */
        _this.graphicsData = [];

        /**
         * The tint applied to the graphic shape. This is a hex value. Apply a value of 0xFFFFFF to
         * reset the tint.
         *
         * @member {number}
         * @default 0xFFFFFF
         */
        _this.tint = 0xFFFFFF;

        /**
         * The previous tint applied to the graphic shape. Used to compare to the current tint and
         * check if theres change.
         *
         * @member {number}
         * @private
         * @default 0xFFFFFF
         */
        _this._prevTint = 0xFFFFFF;

        /**
         * The blend mode to be applied to the graphic shape. Apply a value of
         * `PIXI.BLEND_MODES.NORMAL` to reset the blend mode.
         *
         * @member {number}
         * @default PIXI.BLEND_MODES.NORMAL;
         * @see PIXI.BLEND_MODES
         */
        _this.blendMode = _const.BLEND_MODES.NORMAL;

        /**
         * Current path
         *
         * @member {PIXI.GraphicsData}
         * @private
         */
        _this.currentPath = null;

        /**
         * Array containing some WebGL-related properties used by the WebGL renderer.
         *
         * @member {object<number, object>}
         * @private
         */
        // TODO - _webgl should use a prototype object, not a random undocumented object...
        _this._webGL = {};

        /**
         * Whether this shape is being used as a mask.
         *
         * @member {boolean}
         */
        _this.isMask = false;

        /**
         * The bounds' padding used for bounds calculation.
         *
         * @member {number}
         */
        _this.boundsPadding = 0;

        /**
         * A cache of the local bounds to prevent recalculation.
         *
         * @member {PIXI.Rectangle}
         * @private
         */
        _this._localBounds = new _Bounds2.default();

        /**
         * Used to detect if the graphics object has changed. If this is set to true then the graphics
         * object will be recalculated.
         *
         * @member {boolean}
         * @private
         */
        _this.dirty = 0;

        /**
         * Used to detect if we need to do a fast rect check using the id compare method
         * @type {Number}
         */
        _this.fastRectDirty = -1;

        /**
         * Used to detect if we clear the graphics webGL data
         * @type {Number}
         */
        _this.clearDirty = 0;

        /**
         * Used to detect if we we need to recalculate local bounds
         * @type {Number}
         */
        _this.boundsDirty = -1;

        /**
         * Used to detect if the cached sprite object needs to be updated.
         *
         * @member {boolean}
         * @private
         */
        _this.cachedSpriteDirty = false;

        _this._spriteRect = null;
        _this._fastRect = false;

        /**
         * When cacheAsBitmap is set to true the graphics object will be rendered as if it was a sprite.
         * This is useful if your graphics element does not change often, as it will speed up the rendering
         * of the object in exchange for taking up texture memory. It is also useful if you need the graphics
         * object to be anti-aliased, because it will be rendered using canvas. This is not recommended if
         * you are constantly redrawing the graphics element.
         *
         * @name cacheAsBitmap
         * @member {boolean}
         * @memberof PIXI.Graphics#
         * @default false
         */
        return _this;
    }

    /**
     * Creates a new Graphics object with the same values as this one.
     * Note that the only the properties of the object are cloned, not its transform (position,scale,etc)
     *
     * @return {PIXI.Graphics} A clone of the graphics object
     */


    Graphics.prototype.clone = function clone() {
        var clone = new Graphics();

        clone.renderable = this.renderable;
        clone.fillAlpha = this.fillAlpha;
        clone.lineWidth = this.lineWidth;
        clone.lineColor = this.lineColor;
        clone.tint = this.tint;
        clone.blendMode = this.blendMode;
        clone.isMask = this.isMask;
        clone.boundsPadding = this.boundsPadding;
        clone.dirty = 0;
        clone.cachedSpriteDirty = this.cachedSpriteDirty;

        // copy graphics data
        for (var i = 0; i < this.graphicsData.length; ++i) {
            clone.graphicsData.push(this.graphicsData[i].clone());
        }

        clone.currentPath = clone.graphicsData[clone.graphicsData.length - 1];

        clone.updateLocalBounds();

        return clone;
    };

    /**
     * Specifies the line style used for subsequent calls to Graphics methods such as the lineTo()
     * method or the drawCircle() method.
     *
     * @param {number} [lineWidth=0] - width of the line to draw, will update the objects stored style
     * @param {number} [color=0] - color of the line to draw, will update the objects stored style
     * @param {number} [alpha=1] - alpha of the line to draw, will update the objects stored style
     * @return {PIXI.Graphics} This Graphics object. Good for chaining method calls
     */


    Graphics.prototype.lineStyle = function lineStyle() {
        var lineWidth = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        var color = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var alpha = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

        this.lineWidth = lineWidth;
        this.lineColor = color;
        this.lineAlpha = alpha;

        if (this.currentPath) {
            if (this.currentPath.shape.points.length) {
                // halfway through a line? start a new one!
                var shape = new _math.Polygon(this.currentPath.shape.points.slice(-2));

                shape.closed = false;

                this.drawShape(shape);
            } else {
                // otherwise its empty so lets just set the line properties
                this.currentPath.lineWidth = this.lineWidth;
                this.currentPath.lineColor = this.lineColor;
                this.currentPath.lineAlpha = this.lineAlpha;
            }
        }

        return this;
    };

    /**
     * Moves the current drawing position to x, y.
     *
     * @param {number} x - the X coordinate to move to
     * @param {number} y - the Y coordinate to move to
     * @return {PIXI.Graphics} This Graphics object. Good for chaining method calls
     */


    Graphics.prototype.moveTo = function moveTo(x, y) {
        var shape = new _math.Polygon([x, y]);

        shape.closed = false;
        this.drawShape(shape);

        return this;
    };

    /**
     * Draws a line using the current line style from the current drawing position to (x, y);
     * The current drawing position is then set to (x, y).
     *
     * @param {number} x - the X coordinate to draw to
     * @param {number} y - the Y coordinate to draw to
     * @return {PIXI.Graphics} This Graphics object. Good for chaining method calls
     */


    Graphics.prototype.lineTo = function lineTo(x, y) {
        this.currentPath.shape.points.push(x, y);
        this.dirty++;

        return this;
    };

    /**
     * Calculate the points for a quadratic bezier curve and then draws it.
     * Based on: https://stackoverflow.com/questions/785097/how-do-i-implement-a-bezier-curve-in-c
     *
     * @param {number} cpX - Control point x
     * @param {number} cpY - Control point y
     * @param {number} toX - Destination point x
     * @param {number} toY - Destination point y
     * @return {PIXI.Graphics} This Graphics object. Good for chaining method calls
     */


    Graphics.prototype.quadraticCurveTo = function quadraticCurveTo(cpX, cpY, toX, toY) {
        if (this.currentPath) {
            if (this.currentPath.shape.points.length === 0) {
                this.currentPath.shape.points = [0, 0];
            }
        } else {
            this.moveTo(0, 0);
        }

        var n = 20;
        var points = this.currentPath.shape.points;
        var xa = 0;
        var ya = 0;

        if (points.length === 0) {
            this.moveTo(0, 0);
        }

        var fromX = points[points.length - 2];
        var fromY = points[points.length - 1];

        for (var i = 1; i <= n; ++i) {
            var j = i / n;

            xa = fromX + (cpX - fromX) * j;
            ya = fromY + (cpY - fromY) * j;

            points.push(xa + (cpX + (toX - cpX) * j - xa) * j, ya + (cpY + (toY - cpY) * j - ya) * j);
        }

        this.dirty++;

        return this;
    };

    /**
     * Calculate the points for a bezier curve and then draws it.
     *
     * @param {number} cpX - Control point x
     * @param {number} cpY - Control point y
     * @param {number} cpX2 - Second Control point x
     * @param {number} cpY2 - Second Control point y
     * @param {number} toX - Destination point x
     * @param {number} toY - Destination point y
     * @return {PIXI.Graphics} This Graphics object. Good for chaining method calls
     */


    Graphics.prototype.bezierCurveTo = function bezierCurveTo(cpX, cpY, cpX2, cpY2, toX, toY) {
        if (this.currentPath) {
            if (this.currentPath.shape.points.length === 0) {
                this.currentPath.shape.points = [0, 0];
            }
        } else {
            this.moveTo(0, 0);
        }

        var points = this.currentPath.shape.points;

        var fromX = points[points.length - 2];
        var fromY = points[points.length - 1];

        points.length -= 2;

        (0, _bezierCurveTo3.default)(fromX, fromY, cpX, cpY, cpX2, cpY2, toX, toY, points);

        this.dirty++;

        return this;
    };

    /**
     * The arcTo() method creates an arc/curve between two tangents on the canvas.
     *
     * "borrowed" from https://code.google.com/p/fxcanvas/ - thanks google!
     *
     * @param {number} x1 - The x-coordinate of the beginning of the arc
     * @param {number} y1 - The y-coordinate of the beginning of the arc
     * @param {number} x2 - The x-coordinate of the end of the arc
     * @param {number} y2 - The y-coordinate of the end of the arc
     * @param {number} radius - The radius of the arc
     * @return {PIXI.Graphics} This Graphics object. Good for chaining method calls
     */


    Graphics.prototype.arcTo = function arcTo(x1, y1, x2, y2, radius) {
        if (this.currentPath) {
            if (this.currentPath.shape.points.length === 0) {
                this.currentPath.shape.points.push(x1, y1);
            }
        } else {
            this.moveTo(x1, y1);
        }

        var points = this.currentPath.shape.points;
        var fromX = points[points.length - 2];
        var fromY = points[points.length - 1];
        var a1 = fromY - y1;
        var b1 = fromX - x1;
        var a2 = y2 - y1;
        var b2 = x2 - x1;
        var mm = Math.abs(a1 * b2 - b1 * a2);

        if (mm < 1.0e-8 || radius === 0) {
            if (points[points.length - 2] !== x1 || points[points.length - 1] !== y1) {
                points.push(x1, y1);
            }
        } else {
            var dd = a1 * a1 + b1 * b1;
            var cc = a2 * a2 + b2 * b2;
            var tt = a1 * a2 + b1 * b2;
            var k1 = radius * Math.sqrt(dd) / mm;
            var k2 = radius * Math.sqrt(cc) / mm;
            var j1 = k1 * tt / dd;
            var j2 = k2 * tt / cc;
            var cx = k1 * b2 + k2 * b1;
            var cy = k1 * a2 + k2 * a1;
            var px = b1 * (k2 + j1);
            var py = a1 * (k2 + j1);
            var qx = b2 * (k1 + j2);
            var qy = a2 * (k1 + j2);
            var startAngle = Math.atan2(py - cy, px - cx);
            var endAngle = Math.atan2(qy - cy, qx - cx);

            this.arc(cx + x1, cy + y1, radius, startAngle, endAngle, b1 * a2 > b2 * a1);
        }

        this.dirty++;

        return this;
    };

    /**
     * The arc method creates an arc/curve (used to create circles, or parts of circles).
     *
     * @param {number} cx - The x-coordinate of the center of the circle
     * @param {number} cy - The y-coordinate of the center of the circle
     * @param {number} radius - The radius of the circle
     * @param {number} startAngle - The starting angle, in radians (0 is at the 3 o'clock position
     *  of the arc's circle)
     * @param {number} endAngle - The ending angle, in radians
     * @param {boolean} [anticlockwise=false] - Specifies whether the drawing should be
     *  counter-clockwise or clockwise. False is default, and indicates clockwise, while true
     *  indicates counter-clockwise.
     * @return {PIXI.Graphics} This Graphics object. Good for chaining method calls
     */


    Graphics.prototype.arc = function arc(cx, cy, radius, startAngle, endAngle) {
        var anticlockwise = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;

        if (startAngle === endAngle) {
            return this;
        }

        if (!anticlockwise && endAngle <= startAngle) {
            endAngle += Math.PI * 2;
        } else if (anticlockwise && startAngle <= endAngle) {
            startAngle += Math.PI * 2;
        }

        var sweep = anticlockwise ? startAngle - endAngle : endAngle - startAngle;
        var segs = Math.ceil(Math.abs(sweep) / (Math.PI * 2)) * 40;

        if (sweep === 0) {
            return this;
        }

        var startX = cx + Math.cos(startAngle) * radius;
        var startY = cy + Math.sin(startAngle) * radius;

        var points = this.currentPath.shape.points;

        if (this.currentPath) {
            if (points[points.length - 2] !== startX || points[points.length - 1] !== startY) {
                points.push(startX, startY);
            }
        } else {
            this.moveTo(startX, startY);
        }

        var theta = sweep / (segs * 2);
        var theta2 = theta * 2;

        var cTheta = Math.cos(theta);
        var sTheta = Math.sin(theta);

        var segMinus = segs - 1;

        var remainder = segMinus % 1 / segMinus;

        for (var i = 0; i <= segMinus; ++i) {
            var real = i + remainder * i;

            var angle = theta + startAngle + theta2 * real;

            var c = Math.cos(angle);
            var s = -Math.sin(angle);

            points.push((cTheta * c + sTheta * s) * radius + cx, (cTheta * -s + sTheta * c) * radius + cy);
        }

        this.dirty++;

        return this;
    };

    /**
     * Specifies a simple one-color fill that subsequent calls to other Graphics methods
     * (such as lineTo() or drawCircle()) use when drawing.
     *
     * @param {number} [color=0] - the color of the fill
     * @param {number} [alpha=1] - the alpha of the fill
     * @return {PIXI.Graphics} This Graphics object. Good for chaining method calls
     */


    Graphics.prototype.beginFill = function beginFill() {
        var color = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        var alpha = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

        this.filling = true;
        this.fillColor = color;
        this.fillAlpha = alpha;

        if (this.currentPath) {
            if (this.currentPath.shape.points.length <= 2) {
                this.currentPath.fill = this.filling;
                this.currentPath.fillColor = this.fillColor;
                this.currentPath.fillAlpha = this.fillAlpha;
            }
        }

        return this;
    };

    /**
     * Applies a fill to the lines and shapes that were added since the last call to the beginFill() method.
     *
     * @return {PIXI.Graphics} This Graphics object. Good for chaining method calls
     */


    Graphics.prototype.endFill = function endFill() {
        this.filling = false;
        this.fillColor = null;
        this.fillAlpha = 1;

        return this;
    };

    /**
     *
     * @param {number} x - The X coord of the top-left of the rectangle
     * @param {number} y - The Y coord of the top-left of the rectangle
     * @param {number} width - The width of the rectangle
     * @param {number} height - The height of the rectangle
     * @return {PIXI.Graphics} This Graphics object. Good for chaining method calls
     */


    Graphics.prototype.drawRect = function drawRect(x, y, width, height) {
        this.drawShape(new _math.Rectangle(x, y, width, height));

        return this;
    };

    /**
     *
     * @param {number} x - The X coord of the top-left of the rectangle
     * @param {number} y - The Y coord of the top-left of the rectangle
     * @param {number} width - The width of the rectangle
     * @param {number} height - The height of the rectangle
     * @param {number} radius - Radius of the rectangle corners
     * @return {PIXI.Graphics} This Graphics object. Good for chaining method calls
     */


    Graphics.prototype.drawRoundedRect = function drawRoundedRect(x, y, width, height, radius) {
        this.drawShape(new _math.RoundedRectangle(x, y, width, height, radius));

        return this;
    };

    /**
     * Draws a circle.
     *
     * @param {number} x - The X coordinate of the center of the circle
     * @param {number} y - The Y coordinate of the center of the circle
     * @param {number} radius - The radius of the circle
     * @return {PIXI.Graphics} This Graphics object. Good for chaining method calls
     */


    Graphics.prototype.drawCircle = function drawCircle(x, y, radius) {
        this.drawShape(new _math.Circle(x, y, radius));

        return this;
    };

    /**
     * Draws an ellipse.
     *
     * @param {number} x - The X coordinate of the center of the ellipse
     * @param {number} y - The Y coordinate of the center of the ellipse
     * @param {number} width - The half width of the ellipse
     * @param {number} height - The half height of the ellipse
     * @return {PIXI.Graphics} This Graphics object. Good for chaining method calls
     */


    Graphics.prototype.drawEllipse = function drawEllipse(x, y, width, height) {
        this.drawShape(new _math.Ellipse(x, y, width, height));

        return this;
    };

    /**
     * Draws a polygon using the given path.
     *
     * @param {number[]|PIXI.Point[]} path - The path data used to construct the polygon.
     * @return {PIXI.Graphics} This Graphics object. Good for chaining method calls
     */


    Graphics.prototype.drawPolygon = function drawPolygon(path) {
        // prevents an argument assignment deopt
        // see section 3.1: https://github.com/petkaantonov/bluebird/wiki/Optimization-killers#3-managing-arguments
        var points = path;

        var closed = true;

        if (points instanceof _math.Polygon) {
            closed = points.closed;
            points = points.points;
        }

        if (!Array.isArray(points)) {
            // prevents an argument leak deopt
            // see section 3.2: https://github.com/petkaantonov/bluebird/wiki/Optimization-killers#3-managing-arguments
            points = new Array(arguments.length);

            for (var i = 0; i < points.length; ++i) {
                points[i] = arguments[i]; // eslint-disable-line prefer-rest-params
            }
        }

        var shape = new _math.Polygon(points);

        shape.closed = closed;

        this.drawShape(shape);

        return this;
    };

    /**
     * Clears the graphics that were drawn to this Graphics object, and resets fill and line style settings.
     *
     * @return {PIXI.Graphics} This Graphics object. Good for chaining method calls
     */


    Graphics.prototype.clear = function clear() {
        if (this.lineWidth || this.filling || this.graphicsData.length > 0) {
            this.lineWidth = 0;
            this.filling = false;

            this.dirty++;
            this.clearDirty++;
            this.graphicsData.length = 0;
        }

        return this;
    };

    /**
     * True if graphics consists of one rectangle, and thus, can be drawn like a Sprite and
     * masked with gl.scissor.
     *
     * @returns {boolean} True if only 1 rect.
     */


    Graphics.prototype.isFastRect = function isFastRect() {
        return this.graphicsData.length === 1 && this.graphicsData[0].shape.type === _const.SHAPES.RECT && !this.graphicsData[0].lineWidth;
    };

    /**
     * Renders the object using the WebGL renderer
     *
     * @private
     * @param {PIXI.WebGLRenderer} renderer - The renderer
     */


    Graphics.prototype._renderWebGL = function _renderWebGL(renderer) {
        // if the sprite is not visible or the alpha is 0 then no need to render this element
        if (this.dirty !== this.fastRectDirty) {
            this.fastRectDirty = this.dirty;
            this._fastRect = this.isFastRect();
        }

        // TODO this check can be moved to dirty?
        if (this._fastRect) {
            this._renderSpriteRect(renderer);
        } else {
            renderer.setObjectRenderer(renderer.plugins.graphics);
            renderer.plugins.graphics.render(this);
        }
    };

    /**
     * Renders a sprite rectangle.
     *
     * @private
     * @param {PIXI.WebGLRenderer} renderer - The renderer
     */


    Graphics.prototype._renderSpriteRect = function _renderSpriteRect(renderer) {
        var rect = this.graphicsData[0].shape;

        if (!this._spriteRect) {
            if (!Graphics._SPRITE_TEXTURE) {
                Graphics._SPRITE_TEXTURE = _RenderTexture2.default.create(10, 10);

                var canvas = document.createElement('canvas');

                canvas.width = 10;
                canvas.height = 10;

                var context = canvas.getContext('2d');

                context.fillStyle = 'white';
                context.fillRect(0, 0, 10, 10);

                Graphics._SPRITE_TEXTURE = _Texture2.default.fromCanvas(canvas);
            }

            this._spriteRect = new _Sprite2.default(Graphics._SPRITE_TEXTURE);
        }
        if (this.tint === 0xffffff) {
            this._spriteRect.tint = this.graphicsData[0].fillColor;
        } else {
            var t1 = tempColor1;
            var t2 = tempColor2;

            (0, _utils.hex2rgb)(this.graphicsData[0].fillColor, t1);
            (0, _utils.hex2rgb)(this.tint, t2);

            t1[0] *= t2[0];
            t1[1] *= t2[1];
            t1[2] *= t2[2];

            this._spriteRect.tint = (0, _utils.rgb2hex)(t1);
        }
        this._spriteRect.alpha = this.graphicsData[0].fillAlpha;
        this._spriteRect.worldAlpha = this.worldAlpha * this._spriteRect.alpha;

        Graphics._SPRITE_TEXTURE._frame.width = rect.width;
        Graphics._SPRITE_TEXTURE._frame.height = rect.height;

        this._spriteRect.transform.worldTransform = this.transform.worldTransform;

        this._spriteRect.anchor.set(-rect.x / rect.width, -rect.y / rect.height);
        this._spriteRect._onAnchorUpdate();

        this._spriteRect._renderWebGL(renderer);
    };

    /**
     * Renders the object using the Canvas renderer
     *
     * @private
     * @param {PIXI.CanvasRenderer} renderer - The renderer
     */


    Graphics.prototype._renderCanvas = function _renderCanvas(renderer) {
        if (this.isMask === true) {
            return;
        }

        renderer.plugins.graphics.render(this);
    };

    /**
     * Retrieves the bounds of the graphic shape as a rectangle object
     *
     * @private
     */


    Graphics.prototype._calculateBounds = function _calculateBounds() {
        if (this.boundsDirty !== this.dirty) {
            this.boundsDirty = this.dirty;
            this.updateLocalBounds();

            this.dirty++;
            this.cachedSpriteDirty = true;
        }

        var lb = this._localBounds;

        this._bounds.addFrame(this.transform, lb.minX, lb.minY, lb.maxX, lb.maxY);
    };

    /**
     * Tests if a point is inside this graphics object
     *
     * @param {PIXI.Point} point - the point to test
     * @return {boolean} the result of the test
     */


    Graphics.prototype.containsPoint = function containsPoint(point) {
        this.worldTransform.applyInverse(point, tempPoint);

        var graphicsData = this.graphicsData;

        for (var i = 0; i < graphicsData.length; ++i) {
            var data = graphicsData[i];

            if (!data.fill) {
                continue;
            }

            // only deal with fills..
            if (data.shape) {
                if (data.shape.contains(tempPoint.x, tempPoint.y)) {
                    return true;
                }
            }
        }

        return false;
    };

    /**
     * Update the bounds of the object
     *
     */


    Graphics.prototype.updateLocalBounds = function updateLocalBounds() {
        var minX = Infinity;
        var maxX = -Infinity;

        var minY = Infinity;
        var maxY = -Infinity;

        if (this.graphicsData.length) {
            var shape = 0;
            var x = 0;
            var y = 0;
            var w = 0;
            var h = 0;

            for (var i = 0; i < this.graphicsData.length; i++) {
                var data = this.graphicsData[i];
                var type = data.type;
                var lineWidth = data.lineWidth;

                shape = data.shape;

                if (type === _const.SHAPES.RECT || type === _const.SHAPES.RREC) {
                    x = shape.x - lineWidth / 2;
                    y = shape.y - lineWidth / 2;
                    w = shape.width + lineWidth;
                    h = shape.height + lineWidth;

                    minX = x < minX ? x : minX;
                    maxX = x + w > maxX ? x + w : maxX;

                    minY = y < minY ? y : minY;
                    maxY = y + h > maxY ? y + h : maxY;
                } else if (type === _const.SHAPES.CIRC) {
                    x = shape.x;
                    y = shape.y;
                    w = shape.radius + lineWidth / 2;
                    h = shape.radius + lineWidth / 2;

                    minX = x - w < minX ? x - w : minX;
                    maxX = x + w > maxX ? x + w : maxX;

                    minY = y - h < minY ? y - h : minY;
                    maxY = y + h > maxY ? y + h : maxY;
                } else if (type === _const.SHAPES.ELIP) {
                    x = shape.x;
                    y = shape.y;
                    w = shape.width + lineWidth / 2;
                    h = shape.height + lineWidth / 2;

                    minX = x - w < minX ? x - w : minX;
                    maxX = x + w > maxX ? x + w : maxX;

                    minY = y - h < minY ? y - h : minY;
                    maxY = y + h > maxY ? y + h : maxY;
                } else {
                    // POLY
                    var points = shape.points;

                    for (var j = 0; j < points.length; j += 2) {
                        x = points[j];
                        y = points[j + 1];

                        minX = x - lineWidth < minX ? x - lineWidth : minX;
                        maxX = x + lineWidth > maxX ? x + lineWidth : maxX;

                        minY = y - lineWidth < minY ? y - lineWidth : minY;
                        maxY = y + lineWidth > maxY ? y + lineWidth : maxY;
                    }
                }
            }
        } else {
            minX = 0;
            maxX = 0;
            minY = 0;
            maxY = 0;
        }

        var padding = this.boundsPadding;

        this._localBounds.minX = minX - padding;
        this._localBounds.maxX = maxX + padding * 2;

        this._localBounds.minY = minY - padding;
        this._localBounds.maxY = maxY + padding * 2;
    };

    /**
     * Draws the given shape to this Graphics object. Can be any of Circle, Rectangle, Ellipse, Line or Polygon.
     *
     * @param {PIXI.Circle|PIXI.Ellipse|PIXI.Polygon|PIXI.Rectangle|PIXI.RoundedRectangle} shape - The shape object to draw.
     * @return {PIXI.GraphicsData} The generated GraphicsData object.
     */


    Graphics.prototype.drawShape = function drawShape(shape) {
        if (this.currentPath) {
            // check current path!
            if (this.currentPath.shape.points.length <= 2) {
                this.graphicsData.pop();
            }
        }

        this.currentPath = null;

        var data = new _GraphicsData2.default(this.lineWidth, this.lineColor, this.lineAlpha, this.fillColor, this.fillAlpha, this.filling, shape);

        this.graphicsData.push(data);

        if (data.type === _const.SHAPES.POLY) {
            data.shape.closed = data.shape.closed || this.filling;
            this.currentPath = data;
        }

        this.dirty++;

        return data;
    };

    /**
     * Generates a canvas texture.
     *
     * @param {number} scaleMode - The scale mode of the texture.
     * @param {number} resolution - The resolution of the texture.
     * @return {PIXI.Texture} The new texture.
     */


    Graphics.prototype.generateCanvasTexture = function generateCanvasTexture(scaleMode) {
        var resolution = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

        var bounds = this.getLocalBounds();

        var canvasBuffer = _RenderTexture2.default.create(bounds.width, bounds.height, scaleMode, resolution);

        if (!canvasRenderer) {
            canvasRenderer = new _CanvasRenderer2.default();
        }

        tempMatrix.tx = -bounds.x;
        tempMatrix.ty = -bounds.y;

        canvasRenderer.render(this, canvasBuffer, false, tempMatrix);

        var texture = _Texture2.default.fromCanvas(canvasBuffer.baseTexture._canvasRenderTarget.canvas, scaleMode);

        texture.baseTexture.resolution = resolution;
        texture.baseTexture.update();

        return texture;
    };

    /**
     * Closes the current path.
     *
     * @return {PIXI.Graphics} Returns itself.
     */


    Graphics.prototype.closePath = function closePath() {
        // ok so close path assumes next one is a hole!
        var currentPath = this.currentPath;

        if (currentPath && currentPath.shape) {
            currentPath.shape.close();
        }

        return this;
    };

    /**
     * Adds a hole in the current path.
     *
     * @return {PIXI.Graphics} Returns itself.
     */


    Graphics.prototype.addHole = function addHole() {
        // this is a hole!
        var hole = this.graphicsData.pop();

        this.currentPath = this.graphicsData[this.graphicsData.length - 1];

        this.currentPath.addHole(hole.shape);
        this.currentPath = null;

        return this;
    };

    /**
     * Destroys the Graphics object.
     *
     * @param {object|boolean} [options] - Options parameter. A boolean will act as if all
     *  options have been set to that value
     * @param {boolean} [options.children=false] - if set to true, all the children will have
     *  their destroy method called as well. 'options' will be passed on to those calls.
     */


    Graphics.prototype.destroy = function destroy(options) {
        _Container.prototype.destroy.call(this, options);

        // destroy each of the GraphicsData objects
        for (var i = 0; i < this.graphicsData.length; ++i) {
            this.graphicsData[i].destroy();
        }

        // for each webgl data entry, destroy the WebGLGraphicsData
        for (var id in this._webgl) {
            for (var j = 0; j < this._webgl[id].data.length; ++j) {
                this._webgl[id].data[j].destroy();
            }
        }

        if (this._spriteRect) {
            this._spriteRect.destroy();
        }

        this.graphicsData = null;

        this.currentPath = null;
        this._webgl = null;
        this._localBounds = null;
    };

    return Graphics;
}(_Container3.default);

exports.default = Graphics;


Graphics._SPRITE_TEXTURE = null;

game.Graphics.inject({
    staticInit: function staticInit(props) {
        this.super(props);
        this.blendMode = PIXI.BLEND_MODES.NORMAL;
        this._webGL = {};
        this.dirty = 0;
        this.fastRectDirty = -1;
        this.clearDirty = 0;
        this.boundsDirty = -1;
        this.tint = 0xFFFFFF;
    },

    clear: function clear() {
        this.dirty++;
        this.clearDirty++;
        return this.super();
    },

    _renderWebGL: function _renderWebGL(renderer) {
        renderer.setObjectRenderer(renderer.plugins.graphics);
        renderer.plugins.graphics.render(this);
    }
});

game.GraphicsShape.inject({
    holes: []
});

},{"../const":30,"../display/Bounds":31,"../display/Container":32,"../math":53,"../renderers/canvas/CanvasRenderer":60,"../sprites/Sprite":84,"../textures/RenderTexture":93,"../textures/Texture":94,"../utils":101,"./GraphicsData":38,"./utils/bezierCurveTo":39}],38:[function(require,module,exports){
"use strict";

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * A GraphicsData object.
 *
 * @class
 * @memberof PIXI
 */
var GraphicsData = function () {
  /**
   *
   * @param {number} lineWidth - the width of the line to draw
   * @param {number} lineColor - the color of the line to draw
   * @param {number} lineAlpha - the alpha of the line to draw
   * @param {number} fillColor - the color of the fill
   * @param {number} fillAlpha - the alpha of the fill
   * @param {boolean} fill - whether or not the shape is filled with a colour
   * @param {PIXI.Circle|PIXI.Rectangle|PIXI.Ellipse|PIXI.Polygon} shape - The shape object to draw.
   */
  function GraphicsData(lineWidth, lineColor, lineAlpha, fillColor, fillAlpha, fill, shape) {
    _classCallCheck(this, GraphicsData);

    /**
     * @member {number} the width of the line to draw
     */
    this.lineWidth = lineWidth;

    /**
     * @member {number} the color of the line to draw
     */
    this.lineColor = lineColor;

    /**
     * @member {number} the alpha of the line to draw
     */
    this.lineAlpha = lineAlpha;

    /**
     * @member {number} cached tint of the line to draw
     */
    this._lineTint = lineColor;

    /**
     * @member {number} the color of the fill
     */
    this.fillColor = fillColor;

    /**
     * @member {number} the alpha of the fill
     */
    this.fillAlpha = fillAlpha;

    /**
     * @member {number} cached tint of the fill
     */
    this._fillTint = fillColor;

    /**
     * @member {boolean} whether or not the shape is filled with a colour
     */
    this.fill = fill;

    this.holes = [];

    /**
     * @member {PIXI.Circle|PIXI.Ellipse|PIXI.Polygon|PIXI.Rectangle|PIXI.RoundedRectangle} The shape object to draw.
     */
    this.shape = shape;

    /**
     * @member {number} The type of the shape, see the Const.Shapes file for all the existing types,
     */
    this.type = shape.type;
  }

  /**
   * Creates a new GraphicsData object with the same values as this one.
   *
   * @return {PIXI.GraphicsData} Cloned GraphicsData object
   */


  GraphicsData.prototype.clone = function clone() {
    return new GraphicsData(this.lineWidth, this.lineColor, this.lineAlpha, this.fillColor, this.fillAlpha, this.fill, this.shape);
  };

  /**
   * Adds a hole to the shape.
   *
   * @param {PIXI.Rectangle|PIXI.Circle} shape - The shape of the hole.
   */


  GraphicsData.prototype.addHole = function addHole(shape) {
    this.holes.push(shape);
  };

  /**
   * Destroys the Graphics data.
   */


  GraphicsData.prototype.destroy = function destroy() {
    this.shape = null;
    this.holes = null;
  };

  return GraphicsData;
}();

exports.default = GraphicsData;

},{}],39:[function(require,module,exports){
"use strict";

exports.__esModule = true;
exports.default = bezierCurveTo;
/**
 * Calculate the points for a bezier curve and then draws it.
 *
 * Ignored from docs since it is not directly exposed.
 *
 * @ignore
 * @param {number} fromX - Starting point x
 * @param {number} fromY - Starting point y
 * @param {number} cpX - Control point x
 * @param {number} cpY - Control point y
 * @param {number} cpX2 - Second Control point x
 * @param {number} cpY2 - Second Control point y
 * @param {number} toX - Destination point x
 * @param {number} toY - Destination point y
 * @param {number[]} [path=[]] - Path array to push points into
 * @return {number[]} Array of points of the curve
 */
function bezierCurveTo(fromX, fromY, cpX, cpY, cpX2, cpY2, toX, toY) {
    var path = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : [];

    var n = 20;
    var dt = 0;
    var dt2 = 0;
    var dt3 = 0;
    var t2 = 0;
    var t3 = 0;

    path.push(fromX, fromY);

    for (var i = 1, j = 0; i <= n; ++i) {
        j = i / n;

        dt = 1 - j;
        dt2 = dt * dt;
        dt3 = dt2 * dt;

        t2 = j * j;
        t3 = t2 * j;

        path.push(dt3 * fromX + 3 * dt2 * j * cpX + 3 * dt * t2 * cpX2 + t3 * toX, dt3 * fromY + 3 * dt2 * j * cpY + 3 * dt * t2 * cpY2 + t3 * toY);
    }

    return path;
}

},{}],40:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _utils = require('../../utils');

var _const = require('../../const');

var _ObjectRenderer2 = require('../../renderers/webgl/utils/ObjectRenderer');

var _ObjectRenderer3 = _interopRequireDefault(_ObjectRenderer2);

var _WebGLRenderer = require('../../renderers/webgl/WebGLRenderer');

var _WebGLRenderer2 = _interopRequireDefault(_WebGLRenderer);

var _WebGLGraphicsData = require('./WebGLGraphicsData');

var _WebGLGraphicsData2 = _interopRequireDefault(_WebGLGraphicsData);

var _PrimitiveShader = require('./shaders/PrimitiveShader');

var _PrimitiveShader2 = _interopRequireDefault(_PrimitiveShader);

var _buildPoly = require('./utils/buildPoly');

var _buildPoly2 = _interopRequireDefault(_buildPoly);

var _buildRectangle = require('./utils/buildRectangle');

var _buildRectangle2 = _interopRequireDefault(_buildRectangle);

var _buildRoundedRectangle = require('./utils/buildRoundedRectangle');

var _buildRoundedRectangle2 = _interopRequireDefault(_buildRoundedRectangle);

var _buildCircle = require('./utils/buildCircle');

var _buildCircle2 = _interopRequireDefault(_buildCircle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Renders the graphics object.
 *
 * @class
 * @memberof PIXI
 * @extends PIXI.ObjectRenderer
 */
var GraphicsRenderer = function (_ObjectRenderer) {
    _inherits(GraphicsRenderer, _ObjectRenderer);

    /**
     * @param {PIXI.WebGLRenderer} renderer - The renderer this object renderer works for.
     */
    function GraphicsRenderer(renderer) {
        _classCallCheck(this, GraphicsRenderer);

        var _this = _possibleConstructorReturn(this, _ObjectRenderer.call(this, renderer));

        _this.graphicsDataPool = [];

        _this.primitiveShader = null;

        _this.gl = renderer.gl;

        // easy access!
        _this.CONTEXT_UID = 0;
        return _this;
    }

    /**
     * Called when there is a WebGL context change
     *
     * @private
     *
     */


    GraphicsRenderer.prototype.onContextChange = function onContextChange() {
        this.gl = this.renderer.gl;
        this.CONTEXT_UID = this.renderer.CONTEXT_UID;
        this.primitiveShader = new _PrimitiveShader2.default(this.gl);
    };

    /**
     * Destroys this renderer.
     *
     */


    GraphicsRenderer.prototype.destroy = function destroy() {
        _ObjectRenderer3.default.prototype.destroy.call(this);

        for (var i = 0; i < this.graphicsDataPool.length; ++i) {
            this.graphicsDataPool[i].destroy();
        }

        this.graphicsDataPool = null;
    };

    /**
     * Renders a graphics object.
     *
     * @param {PIXI.Graphics} graphics - The graphics object to render.
     */


    GraphicsRenderer.prototype.render = function render(graphics) {
        var renderer = this.renderer;
        var gl = renderer.gl;

        var webGLData = void 0;
        var webGL = graphics._webGL[this.CONTEXT_UID];

        if (!webGL || graphics.dirty !== webGL.dirty) {
            this.updateGraphics(graphics);

            webGL = graphics._webGL[this.CONTEXT_UID];
        }

        // This  could be speeded up for sure!
        var shader = this.primitiveShader;

        renderer.bindShader(shader);
        renderer.state.setBlendMode(graphics.blendMode);

        for (var i = 0, n = webGL.data.length; i < n; i++) {
            webGLData = webGL.data[i];
            var shaderTemp = webGLData.shader;

            renderer.bindShader(shaderTemp);
            shaderTemp.uniforms.translationMatrix = graphics._worldTransform.toArray(true);
            shaderTemp.uniforms.tint = (0, _utils.hex2rgb)(graphics.tint);
            shaderTemp.uniforms.alpha = graphics._worldAlpha;

            webGLData.vao.bind().draw(gl.TRIANGLE_STRIP, webGLData.indices.length).unbind();
        }
    };

    /**
     * Updates the graphics object
     *
     * @private
     * @param {PIXI.Graphics} graphics - The graphics object to update
     */


    GraphicsRenderer.prototype.updateGraphics = function updateGraphics(graphics) {
        var gl = this.renderer.gl;

        // get the contexts graphics object
        var webGL = graphics._webGL[this.CONTEXT_UID];

        // if the graphics object does not exist in the webGL context time to create it!
        if (!webGL) {
            webGL = graphics._webGL[this.CONTEXT_UID] = { lastIndex: 0, data: [], gl: gl, clearDirty: -1, dirty: -1 };
        }

        // flag the graphics as not dirty as we are about to update it...
        webGL.dirty = graphics.dirty;

        // if the user cleared the graphics object we will need to clear every object
        if (graphics.clearDirty !== webGL.clearDirty) {
            webGL.clearDirty = graphics.clearDirty;

            // loop through and return all the webGLDatas to the object pool so than can be reused later on
            for (var i = 0; i < webGL.data.length; i++) {
                this.graphicsDataPool.push(webGL.data[i]);
            }

            // clear the array and reset the index..
            webGL.data.length = 0;
            webGL.lastIndex = 0;
        }

        var webGLData = void 0;

        // loop through the graphics datas and construct each one..
        // if the object is a complex fill then the new stencil buffer technique will be used
        // other wise graphics objects will be pushed into a batch..
        for (var _i = webGL.lastIndex; _i < graphics.shapes.length; _i++) {
            var data = graphics.shapes[_i];

            // TODO - this can be simplified
            webGLData = this.getWebGLData(webGL, 0);

            if (data.shape.width) {
                (0, _buildRectangle2.default)(data, webGLData);
            } else if (data.shape.radius) {
                (0, _buildCircle2.default)(data, webGLData);
            } else if (data.shape.points) {
                (0, _buildPoly2.default)(data, webGLData);
            }

            webGL.lastIndex++;
        }

        // upload all the dirty data...
        for (var _i2 = 0; _i2 < webGL.data.length; _i2++) {
            webGLData = webGL.data[_i2];

            if (webGLData.dirty) {
                webGLData.upload();
            }
        }
    };

    /**
     *
     * @private
     * @param {WebGLRenderingContext} gl - the current WebGL drawing context
     * @param {number} type - TODO @Alvin
     * @return {*} TODO
     */


    GraphicsRenderer.prototype.getWebGLData = function getWebGLData(gl, type) {
        var webGLData = gl.data[gl.data.length - 1];

        if (!webGLData || webGLData.points.length > 320000) {
            webGLData = this.graphicsDataPool.pop() || new _WebGLGraphicsData2.default(this.renderer.gl, this.primitiveShader, this.renderer.state.attribsState);

            webGLData.reset(type);
            gl.data.push(webGLData);
        }

        webGLData.dirty = true;

        return webGLData;
    };

    return GraphicsRenderer;
}(_ObjectRenderer3.default);

exports.default = GraphicsRenderer;


_WebGLRenderer2.default.registerPlugin('graphics', GraphicsRenderer);

},{"../../const":30,"../../renderers/webgl/WebGLRenderer":67,"../../renderers/webgl/utils/ObjectRenderer":77,"../../utils":101,"./WebGLGraphicsData":41,"./shaders/PrimitiveShader":42,"./utils/buildCircle":43,"./utils/buildPoly":45,"./utils/buildRectangle":46,"./utils/buildRoundedRectangle":47}],41:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _pixiGlCore = require('pixi-gl-core');

var _pixiGlCore2 = _interopRequireDefault(_pixiGlCore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * An object containing WebGL specific properties to be used by the WebGL renderer
 *
 * @class
 * @private
 * @memberof PIXI
 */
var WebGLGraphicsData = function () {
  /**
   * @param {WebGLRenderingContext} gl - The current WebGL drawing context
   * @param {PIXI.Shader} shader - The shader
   * @param {object} attribsState - The state for the VAO
   */
  function WebGLGraphicsData(gl, shader, attribsState) {
    _classCallCheck(this, WebGLGraphicsData);

    /**
     * The current WebGL drawing context
     *
     * @member {WebGLRenderingContext}
     */
    this.gl = gl;

    // TODO does this need to be split before uploding??
    /**
     * An array of color components (r,g,b)
     * @member {number[]}
     */
    this.color = [0, 0, 0]; // color split!

    /**
     * An array of points to draw
     * @member {PIXI.Point[]}
     */
    this.points = [];

    /**
     * The indices of the vertices
     * @member {number[]}
     */
    this.indices = [];
    /**
     * The main buffer
     * @member {WebGLBuffer}
     */
    this.buffer = _pixiGlCore2.default.GLBuffer.createVertexBuffer(gl);

    /**
     * The index buffer
     * @member {WebGLBuffer}
     */
    this.indexBuffer = _pixiGlCore2.default.GLBuffer.createIndexBuffer(gl);

    /**
     * Whether this graphics is dirty or not
     * @member {boolean}
     */
    this.dirty = true;

    this.glPoints = null;
    this.glIndices = null;

    /**
     *
     * @member {PIXI.Shader}
     */
    this.shader = shader;

    this.vao = new _pixiGlCore2.default.VertexArrayObject(gl, attribsState).addIndex(this.indexBuffer).addAttribute(this.buffer, shader.attributes.aVertexPosition, gl.FLOAT, false, 4 * 6, 0).addAttribute(this.buffer, shader.attributes.aColor, gl.FLOAT, false, 4 * 6, 2 * 4);
  }

  /**
   * Resets the vertices and the indices
   */


  WebGLGraphicsData.prototype.reset = function reset() {
    this.points.length = 0;
    this.indices.length = 0;
  };

  /**
   * Binds the buffers and uploads the data
   */


  WebGLGraphicsData.prototype.upload = function upload() {
    this.glPoints = new Float32Array(this.points);
    this.buffer.upload(this.glPoints);

    this.glIndices = new Uint16Array(this.indices);
    this.indexBuffer.upload(this.glIndices);

    this.dirty = false;
  };

  /**
   * Empties all the data
   */


  WebGLGraphicsData.prototype.destroy = function destroy() {
    this.color = null;
    this.points = null;
    this.indices = null;

    this.vao.destroy();
    this.buffer.destroy();
    this.indexBuffer.destroy();

    this.gl = null;

    this.buffer = null;
    this.indexBuffer = null;

    this.glPoints = null;
    this.glIndices = null;
  };

  return WebGLGraphicsData;
}();

exports.default = WebGLGraphicsData;

},{"pixi-gl-core":12}],42:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _Shader2 = require('../../../Shader');

var _Shader3 = _interopRequireDefault(_Shader2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * This shader is used to draw simple primitive shapes for {@link PIXI.Graphics}.
 *
 * @class
 * @memberof PIXI
 * @extends PIXI.Shader
 */
var PrimitiveShader = function (_Shader) {
    _inherits(PrimitiveShader, _Shader);

    /**
     * @param {WebGLRenderingContext} gl - The webgl shader manager this shader works for.
     */
    function PrimitiveShader(gl) {
        _classCallCheck(this, PrimitiveShader);

        return _possibleConstructorReturn(this, _Shader.call(this, gl,
        // vertex shader
        ['attribute vec2 aVertexPosition;', 'attribute vec4 aColor;', 'uniform mat3 translationMatrix;', 'uniform mat3 projectionMatrix;', 'uniform float alpha;', 'uniform vec3 tint;', 'varying vec4 vColor;', 'void main(void){', '   gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);', '   vColor = aColor * vec4(tint * alpha, alpha);', '}'].join('\n'),
        // fragment shader
        ['varying vec4 vColor;', 'void main(void){', '   gl_FragColor = vColor;', '}'].join('\n')));
    }

    return PrimitiveShader;
}(_Shader3.default);

exports.default = PrimitiveShader;

},{"../../../Shader":29}],43:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.default = buildCircle;

var _buildLine = require('./buildLine');

var _buildLine2 = _interopRequireDefault(_buildLine);

var _const = require('../../../const');

var _utils = require('../../../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Builds a circle to draw
 *
 * Ignored from docs since it is not directly exposed.
 *
 * @ignore
 * @private
 * @param {PIXI.WebGLGraphicsData} graphicsData - The graphics object to draw
 * @param {object} webGLData - an object containing all the webGL-specific information to create this shape
 */
function buildCircle(graphicsData, webGLData) {

    // need to convert points to a nice regular data
    var circleData = graphicsData.shape;
    var x = circleData.x;
    var y = circleData.y;
    var width = void 0;
    var height = void 0;

    width = circleData.radius;
    height = circleData.radius;

    var totalSegs = Math.floor(30 * Math.sqrt(circleData.radius)) || Math.floor(15 * Math.sqrt(circleData.width + circleData.height));

    var seg = Math.PI * 2 / totalSegs;

    if (graphicsData.fillColor) {
        var color = (0, _utils.hex2rgb)(graphicsData.fillColor.replace('#', '0x'));
        var alpha = graphicsData.fillAlpha;

        var r = color[0] * alpha;
        var g = color[1] * alpha;
        var b = color[2] * alpha;

        var verts = webGLData.points;
        var indices = webGLData.indices;

        var vecPos = verts.length / 6;

        indices.push(vecPos);

        for (var i = 0; i < totalSegs + 1; i++) {
            verts.push(x, y, r, g, b, alpha);

            verts.push(x + Math.sin(seg * i) * width, y + Math.cos(seg * i) * height, r, g, b, alpha);

            indices.push(vecPos++, vecPos++);
        }

        indices.push(vecPos - 1);
    }

    if (graphicsData.lineWidth) {
        var tempPoints = graphicsData.points;

        graphicsData.points = [];

        for (var _i = 0; _i < totalSegs + 1; _i++) {
            graphicsData.points.push(x + Math.sin(seg * _i) * width, y + Math.cos(seg * _i) * height);
        }

        (0, _buildLine2.default)(graphicsData, webGLData);

        graphicsData.points = tempPoints;
    }
}

},{"../../../const":30,"../../../utils":101,"./buildLine":44}],44:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.default = buildLine;

var _math = require('../../../math');

var _utils = require('../../../utils');

/**
 * Builds a line to draw
 *
 * Ignored from docs since it is not directly exposed.
 *
 * @ignore
 * @private
 * @param {PIXI.WebGLGraphicsData} graphicsData - The graphics object containing all the necessary properties
 * @param {object} webGLData - an object containing all the webGL-specific information to create this shape
 */
function buildLine(graphicsData, webGLData) {
    // TODO OPTIMISE!
    var points = graphicsData.points;

    if (points.length === 0) {
        return;
    }
    // if the line width is an odd number add 0.5 to align to a whole pixel
    // commenting this out fixes #711 and #1620
    // if (graphicsData.lineWidth%2)
    // {
    //     for (i = 0; i < points.length; i++)
    //     {
    //         points[i] += 0.5;
    //     }
    // }

    // get first and last point.. figure out the middle!
    var firstPoint = new _math.Point(points[0], points[1]);
    var lastPoint = new _math.Point(points[points.length - 2], points[points.length - 1]);

    // if the first point is the last point - gonna have issues :)
    if (firstPoint.x === lastPoint.x && firstPoint.y === lastPoint.y) {
        // need to clone as we are going to slightly modify the shape..
        points = points.slice();

        points.pop();
        points.pop();

        lastPoint = new _math.Point(points[points.length - 2], points[points.length - 1]);

        var midPointX = lastPoint.x + (firstPoint.x - lastPoint.x) * 0.5;
        var midPointY = lastPoint.y + (firstPoint.y - lastPoint.y) * 0.5;

        points.unshift(midPointX, midPointY);
        points.push(midPointX, midPointY);
    }

    var verts = webGLData.points;
    var indices = webGLData.indices;
    var length = points.length / 2;
    var indexCount = points.length;
    var indexStart = verts.length / 6;

    // DRAW the Line
    var width = graphicsData.lineWidth / 2;

    // sort color
    var color = (0, _utils.hex2rgb)(graphicsData.lineColor.replace('#', '0x'));
    var alpha = graphicsData.lineAlpha;
    var r = color[0] * alpha;
    var g = color[1] * alpha;
    var b = color[2] * alpha;

    var p1x = points[0];
    var p1y = points[1];
    var p2x = points[2];
    var p2y = points[3];
    var p3x = 0;
    var p3y = 0;

    var perpx = -(p1y - p2y);
    var perpy = p1x - p2x;
    var perp2x = 0;
    var perp2y = 0;
    var perp3x = 0;
    var perp3y = 0;

    var dist = Math.sqrt(perpx * perpx + perpy * perpy);

    perpx /= dist;
    perpy /= dist;
    perpx *= width;
    perpy *= width;

    // start
    verts.push(p1x - perpx, p1y - perpy, r, g, b, alpha);

    verts.push(p1x + perpx, p1y + perpy, r, g, b, alpha);

    for (var i = 1; i < length - 1; ++i) {
        p1x = points[(i - 1) * 2];
        p1y = points[(i - 1) * 2 + 1];

        p2x = points[i * 2];
        p2y = points[i * 2 + 1];

        p3x = points[(i + 1) * 2];
        p3y = points[(i + 1) * 2 + 1];

        perpx = -(p1y - p2y);
        perpy = p1x - p2x;

        dist = Math.sqrt(perpx * perpx + perpy * perpy);
        perpx /= dist;
        perpy /= dist;
        perpx *= width;
        perpy *= width;

        perp2x = -(p2y - p3y);
        perp2y = p2x - p3x;

        dist = Math.sqrt(perp2x * perp2x + perp2y * perp2y);
        perp2x /= dist;
        perp2y /= dist;
        perp2x *= width;
        perp2y *= width;

        var a1 = -perpy + p1y - (-perpy + p2y);
        var b1 = -perpx + p2x - (-perpx + p1x);
        var c1 = (-perpx + p1x) * (-perpy + p2y) - (-perpx + p2x) * (-perpy + p1y);
        var a2 = -perp2y + p3y - (-perp2y + p2y);
        var b2 = -perp2x + p2x - (-perp2x + p3x);
        var c2 = (-perp2x + p3x) * (-perp2y + p2y) - (-perp2x + p2x) * (-perp2y + p3y);

        var denom = a1 * b2 - a2 * b1;

        if (Math.abs(denom) < 0.1) {
            denom += 10.1;
            verts.push(p2x - perpx, p2y - perpy, r, g, b, alpha);

            verts.push(p2x + perpx, p2y + perpy, r, g, b, alpha);

            continue;
        }

        var px = (b1 * c2 - b2 * c1) / denom;
        var py = (a2 * c1 - a1 * c2) / denom;
        var pdist = (px - p2x) * (px - p2x) + (py - p2y) * (py - p2y);

        if (pdist > 196 * width * width) {
            perp3x = perpx - perp2x;
            perp3y = perpy - perp2y;

            dist = Math.sqrt(perp3x * perp3x + perp3y * perp3y);
            perp3x /= dist;
            perp3y /= dist;
            perp3x *= width;
            perp3y *= width;

            verts.push(p2x - perp3x, p2y - perp3y);
            verts.push(r, g, b, alpha);

            verts.push(p2x + perp3x, p2y + perp3y);
            verts.push(r, g, b, alpha);

            verts.push(p2x - perp3x, p2y - perp3y);
            verts.push(r, g, b, alpha);

            indexCount++;
        } else {
            verts.push(px, py);
            verts.push(r, g, b, alpha);

            verts.push(p2x - (px - p2x), p2y - (py - p2y));
            verts.push(r, g, b, alpha);
        }
    }

    p1x = points[(length - 2) * 2];
    p1y = points[(length - 2) * 2 + 1];

    p2x = points[(length - 1) * 2];
    p2y = points[(length - 1) * 2 + 1];

    perpx = -(p1y - p2y);
    perpy = p1x - p2x;

    dist = Math.sqrt(perpx * perpx + perpy * perpy);
    perpx /= dist;
    perpy /= dist;
    perpx *= width;
    perpy *= width;

    verts.push(p2x - perpx, p2y - perpy);
    verts.push(r, g, b, alpha);

    verts.push(p2x + perpx, p2y + perpy);
    verts.push(r, g, b, alpha);

    indices.push(indexStart);

    for (var _i = 0; _i < indexCount; ++_i) {
        indices.push(indexStart++);
    }

    indices.push(indexStart - 1);
}

},{"../../../math":53,"../../../utils":101}],45:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.default = buildPoly;

var _buildLine = require('./buildLine');

var _buildLine2 = _interopRequireDefault(_buildLine);

var _utils = require('../../../utils');

var _earcut = require('earcut');

var _earcut2 = _interopRequireDefault(_earcut);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Builds a polygon to draw
 *
 * Ignored from docs since it is not directly exposed.
 *
 * @ignore
 * @private
 * @param {PIXI.WebGLGraphicsData} graphicsData - The graphics object containing all the necessary properties
 * @param {object} webGLData - an object containing all the webGL-specific information to create this shape
 */
function buildPoly(graphicsData, webGLData) {
    graphicsData.points = graphicsData.shape.points.slice();

    var points = graphicsData.points;

    if (graphicsData.fillColor && points.length >= 6) {
        var holeArray = [];
        // Process holes..
        var holes = graphicsData.holes;

        for (var i = 0; i < holes.length; i++) {
            var hole = holes[i];

            holeArray.push(points.length / 2);

            points = points.concat(hole.points);
        }

        // get first and last point.. figure out the middle!
        var verts = webGLData.points;
        var indices = webGLData.indices;

        var length = points.length / 2;

        // sort color
        var color = (0, _utils.hex2rgb)(graphicsData.fillColor);
        var alpha = graphicsData.fillAlpha;
        var r = color[0] * alpha;
        var g = color[1] * alpha;
        var b = color[2] * alpha;

        var triangles = (0, _earcut2.default)(points, holeArray, 2);

        if (!triangles) {
            return;
        }

        var vertPos = verts.length / 6;

        for (var _i = 0; _i < triangles.length; _i += 3) {
            indices.push(triangles[_i] + vertPos);
            indices.push(triangles[_i] + vertPos);
            indices.push(triangles[_i + 1] + vertPos);
            indices.push(triangles[_i + 2] + vertPos);
            indices.push(triangles[_i + 2] + vertPos);
        }

        for (var _i2 = 0; _i2 < length; _i2++) {
            verts.push(points[_i2 * 2], points[_i2 * 2 + 1], r, g, b, alpha);
        }
    }

    if (graphicsData.lineWidth > 0) {
        (0, _buildLine2.default)(graphicsData, webGLData);
    }
}

},{"../../../utils":101,"./buildLine":44,"earcut":3}],46:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.default = buildRectangle;

var _buildLine = require('./buildLine');

var _buildLine2 = _interopRequireDefault(_buildLine);

var _utils = require('../../../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Builds a rectangle to draw
 *
 * Ignored from docs since it is not directly exposed.
 *
 * @ignore
 * @private
 * @param {PIXI.WebGLGraphicsData} graphicsData - The graphics object containing all the necessary properties
 * @param {object} webGLData - an object containing all the webGL-specific information to create this shape
 */
function buildRectangle(graphicsData, webGLData) {
    // --- //
    // need to convert points to a nice regular data
    //
    var rectData = graphicsData.shape;
    var x = rectData.x;
    var y = rectData.y;
    var width = rectData.width;
    var height = rectData.height;

    if (graphicsData.fillColor) {
        var color = (0, _utils.hex2rgb)(graphicsData.fillColor.replace('#', '0x'));
        var alpha = graphicsData.fillAlpha;

        var r = color[0] * alpha;
        var g = color[1] * alpha;
        var b = color[2] * alpha;

        var verts = webGLData.points;
        var indices = webGLData.indices;

        var vertPos = verts.length / 6;

        // start
        verts.push(x, y);
        verts.push(r, g, b, alpha);

        verts.push(x + width, y);
        verts.push(r, g, b, alpha);

        verts.push(x, y + height);
        verts.push(r, g, b, alpha);

        verts.push(x + width, y + height);
        verts.push(r, g, b, alpha);

        // insert 2 dead triangles..
        indices.push(vertPos, vertPos, vertPos + 1, vertPos + 2, vertPos + 3, vertPos + 3);
    }

    if (graphicsData.lineWidth) {
        var tempPoints = graphicsData.points;

        graphicsData.points = [x, y, x + width, y, x + width, y + height, x, y + height, x, y];

        (0, _buildLine2.default)(graphicsData, webGLData);

        graphicsData.points = tempPoints;
    }
}

},{"../../../utils":101,"./buildLine":44}],47:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.default = buildRoundedRectangle;

var _earcut = require('earcut');

var _earcut2 = _interopRequireDefault(_earcut);

var _buildLine = require('./buildLine');

var _buildLine2 = _interopRequireDefault(_buildLine);

var _utils = require('../../../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Builds a rounded rectangle to draw
 *
 * Ignored from docs since it is not directly exposed.
 *
 * @ignore
 * @private
 * @param {PIXI.WebGLGraphicsData} graphicsData - The graphics object containing all the necessary properties
 * @param {object} webGLData - an object containing all the webGL-specific information to create this shape
 */
function buildRoundedRectangle(graphicsData, webGLData) {
    var rrectData = graphicsData.shape;
    var x = rrectData.x;
    var y = rrectData.y;
    var width = rrectData.width;
    var height = rrectData.height;

    var radius = rrectData.radius;

    var recPoints = [];

    recPoints.push(x, y + radius);
    quadraticBezierCurve(x, y + height - radius, x, y + height, x + radius, y + height, recPoints);
    quadraticBezierCurve(x + width - radius, y + height, x + width, y + height, x + width, y + height - radius, recPoints);
    quadraticBezierCurve(x + width, y + radius, x + width, y, x + width - radius, y, recPoints);
    quadraticBezierCurve(x + radius, y, x, y, x, y + radius + 0.0000000001, recPoints);

    // this tiny number deals with the issue that occurs when points overlap and earcut fails to triangulate the item.
    // TODO - fix this properly, this is not very elegant.. but it works for now.

    if (graphicsData.fill) {
        var color = (0, _utils.hex2rgb)(graphicsData.fillColor);
        var alpha = graphicsData.fillAlpha;

        var r = color[0] * alpha;
        var g = color[1] * alpha;
        var b = color[2] * alpha;

        var verts = webGLData.points;
        var indices = webGLData.indices;

        var vecPos = verts.length / 6;

        var triangles = (0, _earcut2.default)(recPoints, null, 2);

        for (var i = 0, j = triangles.length; i < j; i += 3) {
            indices.push(triangles[i] + vecPos);
            indices.push(triangles[i] + vecPos);
            indices.push(triangles[i + 1] + vecPos);
            indices.push(triangles[i + 2] + vecPos);
            indices.push(triangles[i + 2] + vecPos);
        }

        for (var _i = 0, _j = recPoints.length; _i < _j; _i++) {
            verts.push(recPoints[_i], recPoints[++_i], r, g, b, alpha);
        }
    }

    if (graphicsData.lineWidth) {
        var tempPoints = graphicsData.points;

        graphicsData.points = recPoints;

        (0, _buildLine2.default)(graphicsData, webGLData);

        graphicsData.points = tempPoints;
    }
}

/**
 * Calculate the points for a quadratic bezier curve. (helper function..)
 * Based on: https://stackoverflow.com/questions/785097/how-do-i-implement-a-bezier-curve-in-c
 *
 * Ignored from docs since it is not directly exposed.
 *
 * @ignore
 * @private
 * @param {number} fromX - Origin point x
 * @param {number} fromY - Origin point x
 * @param {number} cpX - Control point x
 * @param {number} cpY - Control point y
 * @param {number} toX - Destination point x
 * @param {number} toY - Destination point y
 * @param {number[]} [out=[]] - The output array to add points into. If not passed, a new array is created.
 * @return {number[]} an array of points
 */
function quadraticBezierCurve(fromX, fromY, cpX, cpY, toX, toY) {
    var out = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : [];

    var n = 20;
    var points = out;

    var xa = 0;
    var ya = 0;
    var xb = 0;
    var yb = 0;
    var x = 0;
    var y = 0;

    function getPt(n1, n2, perc) {
        var diff = n2 - n1;

        return n1 + diff * perc;
    }

    for (var i = 0, j = 0; i <= n; ++i) {
        j = i / n;

        // The Green Line
        xa = getPt(fromX, cpX, j);
        ya = getPt(fromY, cpY, j);
        xb = getPt(cpX, toX, j);
        yb = getPt(cpY, toY, j);

        // The Black Dot
        x = getPt(xa, xb, j);
        y = getPt(ya, yb, j);

        points.push(x, y);
    }

    return points;
}

},{"../../../utils":101,"./buildLine":44,"earcut":3}],48:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.Filter = exports.SpriteMaskFilter = exports.Quad = exports.RenderTarget = exports.ObjectRenderer = exports.WebGLManager = exports.Shader = exports.TextureUvs = exports.BaseTexture = exports.Texture = exports.GraphicsRenderer = exports.GraphicsData = exports.Graphics = exports.TextStyle = exports.Text = exports.SpriteRenderer = exports.Sprite = exports.TransformBase = exports.TransformStatic = exports.Transform = exports.Container = exports.DisplayObject = exports.glCore = exports.WebGLRenderer = exports.ticker = exports.utils = undefined;

var _const = require('./const');

Object.keys(_const).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _const[key];
    }
  });
});

var _math = require('./math');

Object.keys(_math).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _math[key];
    }
  });
});

var _pixiGlCore = require('pixi-gl-core');

Object.defineProperty(exports, 'glCore', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_pixiGlCore).default;
  }
});

var _DisplayObject = require('./display/DisplayObject');

Object.defineProperty(exports, 'DisplayObject', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_DisplayObject).default;
  }
});

var _Container = require('./display/Container');

Object.defineProperty(exports, 'Container', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Container).default;
  }
});

var _Transform = require('./display/Transform');

Object.defineProperty(exports, 'Transform', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Transform).default;
  }
});

var _TransformStatic = require('./display/TransformStatic');

Object.defineProperty(exports, 'TransformStatic', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_TransformStatic).default;
  }
});

var _TransformBase = require('./display/TransformBase');

Object.defineProperty(exports, 'TransformBase', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_TransformBase).default;
  }
});

var _Sprite = require('./sprites/Sprite');

Object.defineProperty(exports, 'Sprite', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Sprite).default;
  }
});

var _SpriteRenderer = require('./sprites/webgl/SpriteRenderer');

Object.defineProperty(exports, 'SpriteRenderer', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_SpriteRenderer).default;
  }
});

var _Text = require('./text/Text');

Object.defineProperty(exports, 'Text', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Text).default;
  }
});

var _TextStyle = require('./text/TextStyle');

Object.defineProperty(exports, 'TextStyle', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_TextStyle).default;
  }
});

var _Graphics = require('./graphics/Graphics');

Object.defineProperty(exports, 'Graphics', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Graphics).default;
  }
});

var _GraphicsData = require('./graphics/GraphicsData');

Object.defineProperty(exports, 'GraphicsData', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_GraphicsData).default;
  }
});

var _GraphicsRenderer = require('./graphics/webgl/GraphicsRenderer');

Object.defineProperty(exports, 'GraphicsRenderer', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_GraphicsRenderer).default;
  }
});

var _Texture = require('./textures/Texture');

Object.defineProperty(exports, 'Texture', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Texture).default;
  }
});

var _BaseTexture = require('./textures/BaseTexture');

Object.defineProperty(exports, 'BaseTexture', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_BaseTexture).default;
  }
});

var _TextureUvs = require('./textures/TextureUvs');

Object.defineProperty(exports, 'TextureUvs', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_TextureUvs).default;
  }
});

var _Shader = require('./Shader');

Object.defineProperty(exports, 'Shader', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Shader).default;
  }
});

var _WebGLManager = require('./renderers/webgl/managers/WebGLManager');

Object.defineProperty(exports, 'WebGLManager', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_WebGLManager).default;
  }
});

var _ObjectRenderer = require('./renderers/webgl/utils/ObjectRenderer');

Object.defineProperty(exports, 'ObjectRenderer', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_ObjectRenderer).default;
  }
});

var _RenderTarget = require('./renderers/webgl/utils/RenderTarget');

Object.defineProperty(exports, 'RenderTarget', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_RenderTarget).default;
  }
});

var _Quad = require('./renderers/webgl/utils/Quad');

Object.defineProperty(exports, 'Quad', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Quad).default;
  }
});

var _SpriteMaskFilter = require('./renderers/webgl/filters/spriteMask/SpriteMaskFilter');

Object.defineProperty(exports, 'SpriteMaskFilter', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_SpriteMaskFilter).default;
  }
});

var _Filter = require('./renderers/webgl/filters/Filter');

Object.defineProperty(exports, 'Filter', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Filter).default;
  }
});
exports.autoDetectRenderer = autoDetectRenderer;

var _utils = require('./utils');

var utils = _interopRequireWildcard(_utils);

var _ticker = require('./ticker');

var ticker = _interopRequireWildcard(_ticker);

var _WebGLRenderer = require('./renderers/webgl/WebGLRenderer');

var _WebGLRenderer2 = _interopRequireDefault(_WebGLRenderer);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.utils = utils;
exports.ticker = ticker;
exports.WebGLRenderer = _WebGLRenderer2.default;
// import CanvasRenderer from './renderers/canvas/CanvasRenderer';
/**
 * @namespace PIXI
 */

/**
 * This helper function will automatically detect which renderer you should be using.
 * WebGL is the preferred renderer as it is a lot faster. If webGL is not supported by
 * the browser then this function will return a canvas renderer
 *
 * @memberof PIXI
 * @param {number} [width=800] - the width of the renderers view
 * @param {number} [height=600] - the height of the renderers view
 * @param {object} [options] - The optional renderer parameters
 * @param {HTMLCanvasElement} [options.view] - the canvas to use as a view, optional
 * @param {boolean} [options.transparent=false] - If the render view is transparent, default false
 * @param {boolean} [options.antialias=false] - sets antialias (only applicable in chrome at the moment)
 * @param {boolean} [options.preserveDrawingBuffer=false] - enables drawing buffer preservation, enable this if you
 *      need to call toDataUrl on the webgl context
 * @param {number} [options.resolution=1] - The resolution / device pixel ratio of the renderer, retina would be 2
 * @param {boolean} [noWebGL=false] - prevents selection of WebGL renderer, even if such is present
 * @return {PIXI.WebGLRenderer|PIXI.CanvasRenderer} Returns WebGL renderer if available, otherwise CanvasRenderer
 */
function autoDetectRenderer() {
  var width = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 800;
  var height = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 600;
  var options = arguments[2];
  var noWebGL = arguments[3];

  if (!noWebGL && utils.isWebGLSupported()) {
    return new _WebGLRenderer2.default(width, height, options);
  }

  return new CanvasRenderer(width, height, options);
}

},{"./Shader":29,"./const":30,"./display/Container":32,"./display/DisplayObject":33,"./display/Transform":34,"./display/TransformBase":35,"./display/TransformStatic":36,"./graphics/Graphics":37,"./graphics/GraphicsData":38,"./graphics/webgl/GraphicsRenderer":40,"./math":53,"./renderers/webgl/WebGLRenderer":67,"./renderers/webgl/filters/Filter":69,"./renderers/webgl/filters/spriteMask/SpriteMaskFilter":72,"./renderers/webgl/managers/WebGLManager":76,"./renderers/webgl/utils/ObjectRenderer":77,"./renderers/webgl/utils/Quad":78,"./renderers/webgl/utils/RenderTarget":79,"./sprites/Sprite":84,"./sprites/webgl/SpriteRenderer":87,"./text/Text":89,"./text/TextStyle":90,"./textures/BaseTexture":92,"./textures/Texture":94,"./textures/TextureUvs":95,"./ticker":98,"./utils":101,"pixi-gl-core":12}],49:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _Matrix = require('./Matrix');

var _Matrix2 = _interopRequireDefault(_Matrix);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ux = [1, 1, 0, -1, -1, -1, 0, 1, 1, 1, 0, -1, -1, -1, 0, 1]; // Your friendly neighbour https://en.wikipedia.org/wiki/Dihedral_group of order 16

var uy = [0, 1, 1, 1, 0, -1, -1, -1, 0, 1, 1, 1, 0, -1, -1, -1];
var vx = [0, -1, -1, -1, 0, 1, 1, 1, 0, 1, 1, 1, 0, -1, -1, -1];
var vy = [1, 1, 0, -1, -1, -1, 0, 1, -1, -1, 0, 1, 1, 1, 0, -1];
var tempMatrices = [];

var mul = [];

function signum(x) {
    if (x < 0) {
        return -1;
    }
    if (x > 0) {
        return 1;
    }

    return 0;
}

function init() {
    for (var i = 0; i < 16; i++) {
        var row = [];

        mul.push(row);

        for (var j = 0; j < 16; j++) {
            var _ux = signum(ux[i] * ux[j] + vx[i] * uy[j]);
            var _uy = signum(uy[i] * ux[j] + vy[i] * uy[j]);
            var _vx = signum(ux[i] * vx[j] + vx[i] * vy[j]);
            var _vy = signum(uy[i] * vx[j] + vy[i] * vy[j]);

            for (var k = 0; k < 16; k++) {
                if (ux[k] === _ux && uy[k] === _uy && vx[k] === _vx && vy[k] === _vy) {
                    row.push(k);
                    break;
                }
            }
        }
    }

    for (var _i = 0; _i < 16; _i++) {
        var mat = new _Matrix2.default();

        mat.set(ux[_i], uy[_i], vx[_i], vy[_i], 0, 0);
        tempMatrices.push(mat);
    }
}

init();

/**
 * Implements Dihedral Group D_8, see [group D4]{@link http://mathworld.wolfram.com/DihedralGroupD4.html},
 * D8 is the same but with diagonals. Used for texture rotations.
 *
 * Vector xX(i), xY(i) is U-axis of sprite with rotation i
 * Vector yY(i), yY(i) is V-axis of sprite with rotation i
 * Rotations: 0 grad (0), 90 grad (2), 180 grad (4), 270 grad (6)
 * Mirrors: vertical (8), main diagonal (10), horizontal (12), reverse diagonal (14)
 * This is the small part of gameofbombs.com portal system. It works.
 *
 * @author Ivan @ivanpopelyshev
 *
 * @namespace PIXI.GroupD8
 */
var GroupD8 = {
    E: 0,
    SE: 1,
    S: 2,
    SW: 3,
    W: 4,
    NW: 5,
    N: 6,
    NE: 7,
    MIRROR_VERTICAL: 8,
    MIRROR_HORIZONTAL: 12,
    uX: function uX(ind) {
        return ux[ind];
    },
    uY: function uY(ind) {
        return uy[ind];
    },
    vX: function vX(ind) {
        return vx[ind];
    },
    vY: function vY(ind) {
        return vy[ind];
    },
    inv: function inv(rotation) {
        if (rotation & 8) {
            return rotation & 15;
        }

        return -rotation & 7;
    },
    add: function add(rotationSecond, rotationFirst) {
        return mul[rotationSecond][rotationFirst];
    },
    sub: function sub(rotationSecond, rotationFirst) {
        return mul[rotationSecond][GroupD8.inv(rotationFirst)];
    },

    /**
     * Adds 180 degrees to rotation. Commutative operation.
     *
     * @method
     * @param {number} rotation - The number to rotate.
     * @returns {number} rotated number
     */
    rotate180: function rotate180(rotation) {
        return rotation ^ 4;
    },

    /**
     * I dont know why sometimes width and heights needs to be swapped. We'll fix it later.
     *
     * @param {number} rotation - The number to check.
     * @returns {boolean} Whether or not the width/height should be swapped.
     */
    isSwapWidthHeight: function isSwapWidthHeight(rotation) {
        return (rotation & 3) === 2;
    },

    /**
     * @param {number} dx - TODO
     * @param {number} dy - TODO
     *
     * @return {number} TODO
     */
    byDirection: function byDirection(dx, dy) {
        if (Math.abs(dx) * 2 <= Math.abs(dy)) {
            if (dy >= 0) {
                return GroupD8.S;
            }

            return GroupD8.N;
        } else if (Math.abs(dy) * 2 <= Math.abs(dx)) {
            if (dx > 0) {
                return GroupD8.E;
            }

            return GroupD8.W;
        } else if (dy > 0) {
            if (dx > 0) {
                return GroupD8.SE;
            }

            return GroupD8.SW;
        } else if (dx > 0) {
            return GroupD8.NE;
        }

        return GroupD8.NW;
    },

    /**
     * Helps sprite to compensate texture packer rotation.
     *
     * @param {PIXI.Matrix} matrix - sprite world matrix
     * @param {number} rotation - The rotation factor to use.
     * @param {number} tx - sprite anchoring
     * @param {number} ty - sprite anchoring
     */
    matrixAppendRotationInv: function matrixAppendRotationInv(matrix, rotation) {
        var tx = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        var ty = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

        // Packer used "rotation", we use "inv(rotation)"
        var mat = tempMatrices[GroupD8.inv(rotation)];

        mat.tx = tx;
        mat.ty = ty;
        matrix.append(mat);
    }
};

exports.default = GroupD8;

},{"./Matrix":50}],50:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Point = require('./Point');

var _Point2 = _interopRequireDefault(_Point);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * The pixi Matrix class as an object, which makes it a lot faster,
 * here is a representation of it :
 * | a | b | tx|
 * | c | d | ty|
 * | 0 | 0 | 1 |
 *
 * @class
 * @memberof PIXI
 */
var Matrix = function () {
    /**
     *
     */
    function Matrix() {
        _classCallCheck(this, Matrix);

        /**
         * @member {number}
         * @default 1
         */
        this.a = 1;

        /**
         * @member {number}
         * @default 0
         */
        this.b = 0;

        /**
         * @member {number}
         * @default 0
         */
        this.c = 0;

        /**
         * @member {number}
         * @default 1
         */
        this.d = 1;

        /**
         * @member {number}
         * @default 0
         */
        this.tx = 0;

        /**
         * @member {number}
         * @default 0
         */
        this.ty = 0;

        this.array = null;
    }

    /**
     * Creates a Matrix object based on the given array. The Element to Matrix mapping order is as follows:
     *
     * a = array[0]
     * b = array[1]
     * c = array[3]
     * d = array[4]
     * tx = array[2]
     * ty = array[5]
     *
     * @param {number[]} array - The array that the matrix will be populated from.
     */


    Matrix.prototype.fromArray = function fromArray(array) {
        this.a = array[0];
        this.b = array[1];
        this.c = array[3];
        this.d = array[4];
        this.tx = array[2];
        this.ty = array[5];
    };

    /**
     * sets the matrix properties
     *
     * @param {number} a - Matrix component
     * @param {number} b - Matrix component
     * @param {number} c - Matrix component
     * @param {number} d - Matrix component
     * @param {number} tx - Matrix component
     * @param {number} ty - Matrix component
     *
     * @return {PIXI.Matrix} This matrix. Good for chaining method calls.
     */


    Matrix.prototype.set = function set(a, b, c, d, tx, ty) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.tx = tx;
        this.ty = ty;

        return this;
    };

    /**
     * Creates an array from the current Matrix object.
     *
     * @param {boolean} transpose - Whether we need to transpose the matrix or not
     * @param {Float32Array} [out=new Float32Array(9)] - If provided the array will be assigned to out
     * @return {number[]} the newly created array which contains the matrix
     */


    Matrix.prototype.toArray = function toArray(transpose, out) {
        if (!this.array) {
            this.array = new Float32Array(9);
        }

        var array = out || this.array;

        if (transpose) {
            array[0] = this.a;
            array[1] = this.b;
            array[2] = 0;
            array[3] = this.c;
            array[4] = this.d;
            array[5] = 0;
            array[6] = this.tx;
            array[7] = this.ty;
            array[8] = 1;
        } else {
            array[0] = this.a;
            array[1] = this.c;
            array[2] = this.tx;
            array[3] = this.b;
            array[4] = this.d;
            array[5] = this.ty;
            array[6] = 0;
            array[7] = 0;
            array[8] = 1;
        }

        return array;
    };

    /**
     * Get a new position with the current transformation applied.
     * Can be used to go from a child's coordinate space to the world coordinate space. (e.g. rendering)
     *
     * @param {PIXI.Point} pos - The origin
     * @param {PIXI.Point} [newPos] - The point that the new position is assigned to (allowed to be same as input)
     * @return {PIXI.Point} The new point, transformed through this matrix
     */


    Matrix.prototype.apply = function apply(pos, newPos) {
        newPos = newPos || new _Point2.default();

        var x = pos.x;
        var y = pos.y;

        newPos.x = this.a * x + this.c * y + this.tx;
        newPos.y = this.b * x + this.d * y + this.ty;

        return newPos;
    };

    /**
     * Get a new position with the inverse of the current transformation applied.
     * Can be used to go from the world coordinate space to a child's coordinate space. (e.g. input)
     *
     * @param {PIXI.Point} pos - The origin
     * @param {PIXI.Point} [newPos] - The point that the new position is assigned to (allowed to be same as input)
     * @return {PIXI.Point} The new point, inverse-transformed through this matrix
     */


    Matrix.prototype.applyInverse = function applyInverse(pos, newPos) {
        newPos = newPos || new _Point2.default();

        var id = 1 / (this.a * this.d + this.c * -this.b);

        var x = pos.x;
        var y = pos.y;

        newPos.x = this.d * id * x + -this.c * id * y + (this.ty * this.c - this.tx * this.d) * id;
        newPos.y = this.a * id * y + -this.b * id * x + (-this.ty * this.a + this.tx * this.b) * id;

        return newPos;
    };

    /**
     * Translates the matrix on the x and y.
     *
     * @param {number} x How much to translate x by
     * @param {number} y How much to translate y by
     * @return {PIXI.Matrix} This matrix. Good for chaining method calls.
     */


    Matrix.prototype.translate = function translate(x, y) {
        this.tx += x;
        this.ty += y;

        return this;
    };

    /**
     * Applies a scale transformation to the matrix.
     *
     * @param {number} x The amount to scale horizontally
     * @param {number} y The amount to scale vertically
     * @return {PIXI.Matrix} This matrix. Good for chaining method calls.
     */


    Matrix.prototype.scale = function scale(x, y) {
        this.a *= x;
        this.d *= y;
        this.c *= x;
        this.b *= y;
        this.tx *= x;
        this.ty *= y;

        return this;
    };

    /**
     * Applies a rotation transformation to the matrix.
     *
     * @param {number} angle - The angle in radians.
     * @return {PIXI.Matrix} This matrix. Good for chaining method calls.
     */


    Matrix.prototype.rotate = function rotate(angle) {
        var cos = Math.cos(angle);
        var sin = Math.sin(angle);

        var a1 = this.a;
        var c1 = this.c;
        var tx1 = this.tx;

        this.a = a1 * cos - this.b * sin;
        this.b = a1 * sin + this.b * cos;
        this.c = c1 * cos - this.d * sin;
        this.d = c1 * sin + this.d * cos;
        this.tx = tx1 * cos - this.ty * sin;
        this.ty = tx1 * sin + this.ty * cos;

        return this;
    };

    /**
     * Appends the given Matrix to this Matrix.
     *
     * @param {PIXI.Matrix} matrix - The matrix to append.
     * @return {PIXI.Matrix} This matrix. Good for chaining method calls.
     */


    Matrix.prototype.append = function append(matrix) {
        var a1 = this.a;
        var b1 = this.b;
        var c1 = this.c;
        var d1 = this.d;

        this.a = matrix.a * a1 + matrix.b * c1;
        this.b = matrix.a * b1 + matrix.b * d1;
        this.c = matrix.c * a1 + matrix.d * c1;
        this.d = matrix.c * b1 + matrix.d * d1;

        this.tx = matrix.tx * a1 + matrix.ty * c1 + this.tx;
        this.ty = matrix.tx * b1 + matrix.ty * d1 + this.ty;

        return this;
    };

    /**
     * Sets the matrix based on all the available properties
     *
     * @param {number} x - Position on the x axis
     * @param {number} y - Position on the y axis
     * @param {number} pivotX - Pivot on the x axis
     * @param {number} pivotY - Pivot on the y axis
     * @param {number} scaleX - Scale on the x axis
     * @param {number} scaleY - Scale on the y axis
     * @param {number} rotation - Rotation in radians
     * @param {number} skewX - Skew on the x axis
     * @param {number} skewY - Skew on the y axis
     * @return {PIXI.Matrix} This matrix. Good for chaining method calls.
     */


    Matrix.prototype.setTransform = function setTransform(x, y, pivotX, pivotY, scaleX, scaleY, rotation, skewX, skewY) {
        var sr = Math.sin(rotation);
        var cr = Math.cos(rotation);
        var cy = Math.cos(skewY);
        var sy = Math.sin(skewY);
        var nsx = -Math.sin(skewX);
        var cx = Math.cos(skewX);

        var a = cr * scaleX;
        var b = sr * scaleX;
        var c = -sr * scaleY;
        var d = cr * scaleY;

        this.a = cy * a + sy * c;
        this.b = cy * b + sy * d;
        this.c = nsx * a + cx * c;
        this.d = nsx * b + cx * d;

        this.tx = x + (pivotX * a + pivotY * c);
        this.ty = y + (pivotX * b + pivotY * d);

        return this;
    };

    /**
     * Prepends the given Matrix to this Matrix.
     *
     * @param {PIXI.Matrix} matrix - The matrix to prepend
     * @return {PIXI.Matrix} This matrix. Good for chaining method calls.
     */


    Matrix.prototype.prepend = function prepend(matrix) {
        var tx1 = this.tx;

        if (matrix.a !== 1 || matrix.b !== 0 || matrix.c !== 0 || matrix.d !== 1) {
            var a1 = this.a;
            var c1 = this.c;

            this.a = a1 * matrix.a + this.b * matrix.c;
            this.b = a1 * matrix.b + this.b * matrix.d;
            this.c = c1 * matrix.a + this.d * matrix.c;
            this.d = c1 * matrix.b + this.d * matrix.d;
        }

        this.tx = tx1 * matrix.a + this.ty * matrix.c + matrix.tx;
        this.ty = tx1 * matrix.b + this.ty * matrix.d + matrix.ty;

        return this;
    };

    /**
     * Decomposes the matrix (x, y, scaleX, scaleY, and rotation) and sets the properties on to a transform.
     *
     * @param {PIXI.Transform|PIXI.TransformStatic} transform - The transform to apply the properties to.
     * @return {PIXI.Transform|PIXI.TransformStatic} The transform with the newly applied properies
     */


    Matrix.prototype.decompose = function decompose(transform) {
        // sort out rotation / skew..
        var a = this.a;
        var b = this.b;
        var c = this.c;
        var d = this.d;

        var skewX = Math.atan2(-c, d);
        var skewY = Math.atan2(b, a);

        var delta = Math.abs(1 - skewX / skewY);

        if (delta < 0.00001) {
            transform.rotation = skewY;

            if (a < 0 && d >= 0) {
                transform.rotation += transform.rotation <= 0 ? Math.PI : -Math.PI;
            }

            transform.skew.x = transform.skew.y = 0;
        } else {
            transform.skew.x = skewX;
            transform.skew.y = skewY;
        }

        // next set scale
        transform.scale.x = Math.sqrt(a * a + b * b);
        transform.scale.y = Math.sqrt(c * c + d * d);

        // next set position
        transform.position.x = this.tx;
        transform.position.y = this.ty;

        return transform;
    };

    /**
     * Inverts this matrix
     *
     * @return {PIXI.Matrix} This matrix. Good for chaining method calls.
     */


    Matrix.prototype.invert = function invert() {
        var a1 = this.a;
        var b1 = this.b;
        var c1 = this.c;
        var d1 = this.d;
        var tx1 = this.tx;
        var n = a1 * d1 - b1 * c1;

        this.a = d1 / n;
        this.b = -b1 / n;
        this.c = -c1 / n;
        this.d = a1 / n;
        this.tx = (c1 * this.ty - d1 * tx1) / n;
        this.ty = -(a1 * this.ty - b1 * tx1) / n;

        return this;
    };

    /**
     * Resets this Matix to an identity (default) matrix.
     *
     * @return {PIXI.Matrix} This matrix. Good for chaining method calls.
     */


    Matrix.prototype.identity = function identity() {
        this.a = 1;
        this.b = 0;
        this.c = 0;
        this.d = 1;
        this.tx = 0;
        this.ty = 0;

        return this;
    };

    /**
     * Creates a new Matrix object with the same values as this one.
     *
     * @return {PIXI.Matrix} A copy of this matrix. Good for chaining method calls.
     */


    Matrix.prototype.clone = function clone() {
        var matrix = new Matrix();

        matrix.a = this.a;
        matrix.b = this.b;
        matrix.c = this.c;
        matrix.d = this.d;
        matrix.tx = this.tx;
        matrix.ty = this.ty;

        return matrix;
    };

    /**
     * Changes the values of the given matrix to be the same as the ones in this matrix
     *
     * @param {PIXI.Matrix} matrix - The matrix to copy from.
     * @return {PIXI.Matrix} The matrix given in parameter with its values updated.
     */


    Matrix.prototype.copy = function copy(matrix) {
        matrix.a = this.a;
        matrix.b = this.b;
        matrix.c = this.c;
        matrix.d = this.d;
        matrix.tx = this.tx;
        matrix.ty = this.ty;

        return matrix;
    };

    /**
     * A default (identity) matrix
     *
     * @static
     * @const
     */


    _createClass(Matrix, null, [{
        key: 'IDENTITY',
        get: function get() {
            return new Matrix();
        }

        /**
         * A temp matrix
         *
         * @static
         * @const
         */

    }, {
        key: 'TEMP_MATRIX',
        get: function get() {
            return new Matrix();
        }
    }]);

    return Matrix;
}();

exports.default = Matrix;

},{"./Point":52}],51:[function(require,module,exports){
"use strict";

exports.__esModule = true;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * The Point object represents a location in a two-dimensional coordinate system, where x represents
 * the horizontal axis and y represents the vertical axis.
 * An observable point is a point that triggers a callback when the point's position is changed.
 *
 * @class
 * @memberof PIXI
 */
var ObservablePoint = function () {
    /**
     * @param {Function} cb - callback when changed
     * @param {object} scope - owner of callback
     * @param {number} [x=0] - position of the point on the x axis
     * @param {number} [y=0] - position of the point on the y axis
     */
    function ObservablePoint(cb, scope) {
        var x = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        var y = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

        _classCallCheck(this, ObservablePoint);

        this._x = x;
        this._y = y;

        this.cb = cb;
        this.scope = scope;
    }

    /**
     * Sets the point to a new x and y position.
     * If y is omitted, both x and y will be set to x.
     *
     * @param {number} [x=0] - position of the point on the x axis
     * @param {number} [y=0] - position of the point on the y axis
     */


    ObservablePoint.prototype.set = function set(x, y) {
        var _x = x || 0;
        var _y = y || (y !== 0 ? _x : 0);

        if (this._x !== _x || this._y !== _y) {
            this._x = _x;
            this._y = _y;
            this.cb.call(this.scope);
        }
    };

    /**
     * Copies the data from another point
     *
     * @param {PIXI.Point|PIXI.ObservablePoint} point - point to copy from
     */


    ObservablePoint.prototype.copy = function copy(point) {
        if (this._x !== point.x || this._y !== point.y) {
            this._x = point.x;
            this._y = point.y;
            this.cb.call(this.scope);
        }
    };

    /**
     * The position of the displayObject on the x axis relative to the local coordinates of the parent.
     *
     * @member {number}
     * @memberof PIXI.ObservablePoint#
     */


    _createClass(ObservablePoint, [{
        key: "x",
        get: function get() {
            return this._x;
        }

        /**
         * Sets the X component.
         *
         * @param {number} value - The value to set to.
         */
        ,
        set: function set(value) {
            if (this._x !== value) {
                this._x = value;
                this.cb.call(this.scope);
            }
        }

        /**
         * The position of the displayObject on the x axis relative to the local coordinates of the parent.
         *
         * @member {number}
         * @memberof PIXI.ObservablePoint#
         */

    }, {
        key: "y",
        get: function get() {
            return this._y;
        }

        /**
         * Sets the Y component.
         *
         * @param {number} value - The value to set to.
         */
        ,
        set: function set(value) {
            if (this._y !== value) {
                this._y = value;
                this.cb.call(this.scope);
            }
        }
    }]);

    return ObservablePoint;
}();

exports.default = ObservablePoint;

},{}],52:[function(require,module,exports){
"use strict";

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * The Point object represents a location in a two-dimensional coordinate system, where x represents
 * the horizontal axis and y represents the vertical axis.
 *
 * @class
 * @memberof PIXI
 */
var Point = function () {
  /**
   * @param {number} [x=0] - position of the point on the x axis
   * @param {number} [y=0] - position of the point on the y axis
   */
  function Point() {
    var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    _classCallCheck(this, Point);

    /**
     * @member {number}
     * @default 0
     */
    this.x = x;

    /**
     * @member {number}
     * @default 0
     */
    this.y = y;
  }

  /**
   * Creates a clone of this point
   *
   * @return {PIXI.Point} a copy of the point
   */


  Point.prototype.clone = function clone() {
    return new Point(this.x, this.y);
  };

  /**
   * Copies x and y from the given point
   *
   * @param {PIXI.Point} p - The point to copy.
   */


  Point.prototype.copy = function copy(p) {
    this.set(p.x, p.y);
  };

  /**
   * Returns true if the given point is equal to this point
   *
   * @param {PIXI.Point} p - The point to check
   * @returns {boolean} Whether the given point equal to this point
   */


  Point.prototype.equals = function equals(p) {
    return p.x === this.x && p.y === this.y;
  };

  /**
   * Sets the point to a new x and y position.
   * If y is omitted, both x and y will be set to x.
   *
   * @param {number} [x=0] - position of the point on the x axis
   * @param {number} [y=0] - position of the point on the y axis
   */


  Point.prototype.set = function set(x, y) {
    this.x = x || 0;
    this.y = y || (y !== 0 ? this.x : 0);
  };

  return Point;
}();

exports.default = Point;

},{}],53:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _Point = require('./Point');

Object.defineProperty(exports, 'Point', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Point).default;
  }
});

var _ObservablePoint = require('./ObservablePoint');

Object.defineProperty(exports, 'ObservablePoint', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_ObservablePoint).default;
  }
});

var _Matrix = require('./Matrix');

Object.defineProperty(exports, 'Matrix', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Matrix).default;
  }
});

var _GroupD = require('./GroupD8');

Object.defineProperty(exports, 'GroupD8', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_GroupD).default;
  }
});

var _Circle = require('./shapes/Circle');

Object.defineProperty(exports, 'Circle', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Circle).default;
  }
});

var _Ellipse = require('./shapes/Ellipse');

Object.defineProperty(exports, 'Ellipse', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Ellipse).default;
  }
});

var _Polygon = require('./shapes/Polygon');

Object.defineProperty(exports, 'Polygon', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Polygon).default;
  }
});

var _Rectangle = require('./shapes/Rectangle');

Object.defineProperty(exports, 'Rectangle', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Rectangle).default;
  }
});

var _RoundedRectangle = require('./shapes/RoundedRectangle');

Object.defineProperty(exports, 'RoundedRectangle', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_RoundedRectangle).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./GroupD8":49,"./Matrix":50,"./ObservablePoint":51,"./Point":52,"./shapes/Circle":54,"./shapes/Ellipse":55,"./shapes/Polygon":56,"./shapes/Rectangle":57,"./shapes/RoundedRectangle":58}],54:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _Rectangle = require('./Rectangle');

var _Rectangle2 = _interopRequireDefault(_Rectangle);

var _const = require('../../const');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * The Circle object can be used to specify a hit area for displayObjects
 *
 * @class
 * @memberof PIXI
 */
var Circle = function () {
  /**
   * @param {number} [x=0] - The X coordinate of the center of this circle
   * @param {number} [y=0] - The Y coordinate of the center of this circle
   * @param {number} [radius=0] - The radius of the circle
   */
  function Circle() {
    var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var radius = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

    _classCallCheck(this, Circle);

    /**
     * @member {number}
     * @default 0
     */
    this.x = x;

    /**
     * @member {number}
     * @default 0
     */
    this.y = y;

    /**
     * @member {number}
     * @default 0
     */
    this.radius = radius;

    /**
     * The type of the object, mainly used to avoid `instanceof` checks
     *
     * @member {number}
     * @readOnly
     * @default PIXI.SHAPES.CIRC
     * @see PIXI.SHAPES
     */
    this.type = _const.SHAPES.CIRC;
  }

  /**
   * Creates a clone of this Circle instance
   *
   * @return {PIXI.Circle} a copy of the Circle
   */


  Circle.prototype.clone = function clone() {
    return new Circle(this.x, this.y, this.radius);
  };

  /**
   * Checks whether the x and y coordinates given are contained within this circle
   *
   * @param {number} x - The X coordinate of the point to test
   * @param {number} y - The Y coordinate of the point to test
   * @return {boolean} Whether the x/y coordinates are within this Circle
   */


  Circle.prototype.contains = function contains(x, y) {
    if (this.radius <= 0) {
      return false;
    }

    var r2 = this.radius * this.radius;
    var dx = this.x - x;
    var dy = this.y - y;

    dx *= dx;
    dy *= dy;

    return dx + dy <= r2;
  };

  /**
  * Returns the framing rectangle of the circle as a Rectangle object
  *
  * @return {PIXI.Rectangle} the framing rectangle
  */


  Circle.prototype.getBounds = function getBounds() {
    return new _Rectangle2.default(this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
  };

  return Circle;
}();

exports.default = Circle;

},{"../../const":30,"./Rectangle":57}],55:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _Rectangle = require('./Rectangle');

var _Rectangle2 = _interopRequireDefault(_Rectangle);

var _const = require('../../const');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * The Ellipse object can be used to specify a hit area for displayObjects
 *
 * @class
 * @memberof PIXI
 */
var Ellipse = function () {
  /**
   * @param {number} [x=0] - The X coordinate of the center of this circle
   * @param {number} [y=0] - The Y coordinate of the center of this circle
   * @param {number} [width=0] - The half width of this ellipse
   * @param {number} [height=0] - The half height of this ellipse
   */
  function Ellipse() {
    var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var width = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var height = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

    _classCallCheck(this, Ellipse);

    /**
     * @member {number}
     * @default 0
     */
    this.x = x;

    /**
     * @member {number}
     * @default 0
     */
    this.y = y;

    /**
     * @member {number}
     * @default 0
     */
    this.width = width;

    /**
     * @member {number}
     * @default 0
     */
    this.height = height;

    /**
     * The type of the object, mainly used to avoid `instanceof` checks
     *
     * @member {number}
     * @readOnly
     * @default PIXI.SHAPES.ELIP
     * @see PIXI.SHAPES
     */
    this.type = _const.SHAPES.ELIP;
  }

  /**
   * Creates a clone of this Ellipse instance
   *
   * @return {PIXI.Ellipse} a copy of the ellipse
   */


  Ellipse.prototype.clone = function clone() {
    return new Ellipse(this.x, this.y, this.width, this.height);
  };

  /**
   * Checks whether the x and y coordinates given are contained within this ellipse
   *
   * @param {number} x - The X coordinate of the point to test
   * @param {number} y - The Y coordinate of the point to test
   * @return {boolean} Whether the x/y coords are within this ellipse
   */


  Ellipse.prototype.contains = function contains(x, y) {
    if (this.width <= 0 || this.height <= 0) {
      return false;
    }

    // normalize the coords to an ellipse with center 0,0
    var normx = (x - this.x) / this.width;
    var normy = (y - this.y) / this.height;

    normx *= normx;
    normy *= normy;

    return normx + normy <= 1;
  };

  /**
   * Returns the framing rectangle of the ellipse as a Rectangle object
   *
   * @return {PIXI.Rectangle} the framing rectangle
   */


  Ellipse.prototype.getBounds = function getBounds() {
    return new _Rectangle2.default(this.x - this.width, this.y - this.height, this.width, this.height);
  };

  return Ellipse;
}();

exports.default = Ellipse;

},{"../../const":30,"./Rectangle":57}],56:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _Point = require('../Point');

var _Point2 = _interopRequireDefault(_Point);

var _const = require('../../const');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @class
 * @memberof PIXI
 */
var Polygon = function () {
    /**
     * @param {PIXI.Point[]|number[]} points - This can be an array of Points
     *  that form the polygon, a flat array of numbers that will be interpreted as [x,y, x,y, ...], or
     *  the arguments passed can be all the points of the polygon e.g.
     *  `new PIXI.Polygon(new PIXI.Point(), new PIXI.Point(), ...)`, or the arguments passed can be flat
     *  x,y values e.g. `new Polygon(x,y, x,y, x,y, ...)` where `x` and `y` are Numbers.
     */
    function Polygon() {
        for (var _len = arguments.length, points = Array(_len), _key = 0; _key < _len; _key++) {
            points[_key] = arguments[_key];
        }

        _classCallCheck(this, Polygon);

        if (Array.isArray(points[0])) {
            points = points[0];
        }

        // if this is an array of points, convert it to a flat array of numbers
        if (points[0] instanceof _Point2.default) {
            var p = [];

            for (var i = 0, il = points.length; i < il; i++) {
                p.push(points[i].x, points[i].y);
            }

            points = p;
        }

        this.closed = true;

        /**
         * An array of the points of this polygon
         *
         * @member {number[]}
         */
        this.points = points;

        /**
         * The type of the object, mainly used to avoid `instanceof` checks
         *
         * @member {number}
         * @readOnly
         * @default PIXI.SHAPES.POLY
         * @see PIXI.SHAPES
         */
        this.type = _const.SHAPES.POLY;
    }

    /**
     * Creates a clone of this polygon
     *
     * @return {PIXI.Polygon} a copy of the polygon
     */


    Polygon.prototype.clone = function clone() {
        return new Polygon(this.points.slice());
    };

    /**
     * Closes the polygon, adding points if necessary.
     *
     */


    Polygon.prototype.close = function close() {
        var points = this.points;

        // close the poly if the value is true!
        if (points[0] !== points[points.length - 2] || points[1] !== points[points.length - 1]) {
            points.push(points[0], points[1]);
        }
    };

    /**
     * Checks whether the x and y coordinates passed to this function are contained within this polygon
     *
     * @param {number} x - The X coordinate of the point to test
     * @param {number} y - The Y coordinate of the point to test
     * @return {boolean} Whether the x/y coordinates are within this polygon
     */


    Polygon.prototype.contains = function contains(x, y) {
        var inside = false;

        // use some raycasting to test hits
        // https://github.com/substack/point-in-polygon/blob/master/index.js
        var length = this.points.length / 2;

        for (var i = 0, j = length - 1; i < length; j = ++i) {
            var xi = this.points[i * 2];
            var yi = this.points[i * 2 + 1];
            var xj = this.points[j * 2];
            var yj = this.points[j * 2 + 1];
            var intersect = yi > y !== yj > y && x < (xj - xi) * ((y - yi) / (yj - yi)) + xi;

            if (intersect) {
                inside = !inside;
            }
        }

        return inside;
    };

    return Polygon;
}();

exports.default = Polygon;

},{"../../const":30,"../Point":52}],57:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _const = require('../../const');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Rectangle object is an area defined by its position, as indicated by its top-left corner
 * point (x, y) and by its width and its height.
 *
 * @class
 * @memberof PIXI
 */
var Rectangle = function () {
    /**
     * @param {number} [x=0] - The X coordinate of the upper-left corner of the rectangle
     * @param {number} [y=0] - The Y coordinate of the upper-left corner of the rectangle
     * @param {number} [width=0] - The overall width of this rectangle
     * @param {number} [height=0] - The overall height of this rectangle
     */
    function Rectangle() {
        var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var width = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        var height = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

        _classCallCheck(this, Rectangle);

        /**
         * @member {number}
         * @default 0
         */
        this.x = x;

        /**
         * @member {number}
         * @default 0
         */
        this.y = y;

        /**
         * @member {number}
         * @default 0
         */
        this.width = width;

        /**
         * @member {number}
         * @default 0
         */
        this.height = height;

        /**
         * The type of the object, mainly used to avoid `instanceof` checks
         *
         * @member {number}
         * @readOnly
         * @default PIXI.SHAPES.RECT
         * @see PIXI.SHAPES
         */
        this.type = _const.SHAPES.RECT;
    }

    /**
     * returns the left edge of the rectangle
     *
     * @member {number}
     * @memberof PIXI.Rectangle#
     */


    /**
     * Creates a clone of this Rectangle
     *
     * @return {PIXI.Rectangle} a copy of the rectangle
     */
    Rectangle.prototype.clone = function clone() {
        return new Rectangle(this.x, this.y, this.width, this.height);
    };

    /**
     * Copies another rectangle to this one.
     *
     * @param {PIXI.Rectangle} rectangle - The rectangle to copy.
     * @return {PIXI.Rectanle} Returns itself.
     */


    Rectangle.prototype.copy = function copy(rectangle) {
        this.x = rectangle.x;
        this.y = rectangle.y;
        this.width = rectangle.width;
        this.height = rectangle.height;

        return this;
    };

    /**
     * Checks whether the x and y coordinates given are contained within this Rectangle
     *
     * @param {number} x - The X coordinate of the point to test
     * @param {number} y - The Y coordinate of the point to test
     * @return {boolean} Whether the x/y coordinates are within this Rectangle
     */


    Rectangle.prototype.contains = function contains(x, y) {
        if (this.width <= 0 || this.height <= 0) {
            return false;
        }

        if (x >= this.x && x < this.x + this.width) {
            if (y >= this.y && y < this.y + this.height) {
                return true;
            }
        }

        return false;
    };

    /**
     * Pads the rectangle making it grow in all directions.
     *
     * @param {number} paddingX - The horizontal padding amount.
     * @param {number} paddingY - The vertical padding amount.
     */


    Rectangle.prototype.pad = function pad(paddingX, paddingY) {
        paddingX = paddingX || 0;
        paddingY = paddingY || (paddingY !== 0 ? paddingX : 0);

        this.x -= paddingX;
        this.y -= paddingY;

        this.width += paddingX * 2;
        this.height += paddingY * 2;
    };

    /**
     * Fits this rectangle around the passed one.
     *
     * @param {PIXI.Rectangle} rectangle - The rectangle to fit.
     */


    Rectangle.prototype.fit = function fit(rectangle) {
        if (this.x < rectangle.x) {
            this.width += this.x;
            if (this.width < 0) {
                this.width = 0;
            }

            this.x = rectangle.x;
        }

        if (this.y < rectangle.y) {
            this.height += this.y;
            if (this.height < 0) {
                this.height = 0;
            }
            this.y = rectangle.y;
        }

        if (this.x + this.width > rectangle.x + rectangle.width) {
            this.width = rectangle.width - this.x;
            if (this.width < 0) {
                this.width = 0;
            }
        }

        if (this.y + this.height > rectangle.y + rectangle.height) {
            this.height = rectangle.height - this.y;
            if (this.height < 0) {
                this.height = 0;
            }
        }
    };

    /**
     * Enlarges this rectangle to include the passed rectangle.
     *
     * @param {PIXI.Rectangle} rect - The rectangle to include.
     */


    Rectangle.prototype.enlarge = function enlarge(rect) {
        if (rect === Rectangle.EMPTY) {
            return;
        }

        var x1 = Math.min(this.x, rect.x);
        var x2 = Math.max(this.x + this.width, rect.x + rect.width);
        var y1 = Math.min(this.y, rect.y);
        var y2 = Math.max(this.y + this.height, rect.y + rect.height);

        this.x = x1;
        this.width = x2 - x1;
        this.y = y1;
        this.height = y2 - y1;
    };

    _createClass(Rectangle, [{
        key: 'left',
        get: function get() {
            return this.x;
        }

        /**
         * returns the right edge of the rectangle
         *
         * @member {number}
         * @memberof PIXI.Rectangle
         */

    }, {
        key: 'right',
        get: function get() {
            return this.x + this.width;
        }

        /**
         * returns the top edge of the rectangle
         *
         * @member {number}
         * @memberof PIXI.Rectangle
         */

    }, {
        key: 'top',
        get: function get() {
            return this.y;
        }

        /**
         * returns the bottom edge of the rectangle
         *
         * @member {number}
         * @memberof PIXI.Rectangle
         */

    }, {
        key: 'bottom',
        get: function get() {
            return this.y + this.height;
        }

        /**
         * A constant empty rectangle.
         *
         * @static
         * @constant
         */

    }], [{
        key: 'EMPTY',
        get: function get() {
            return new Rectangle(0, 0, 0, 0);
        }
    }]);

    return Rectangle;
}();

exports.default = Rectangle;

},{"../../const":30}],58:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _const = require('../../const');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * The Rounded Rectangle object is an area that has nice rounded corners, as indicated by its
 * top-left corner point (x, y) and by its width and its height and its radius.
 *
 * @class
 * @memberof PIXI
 */
var RoundedRectangle = function () {
  /**
   * @param {number} [x=0] - The X coordinate of the upper-left corner of the rounded rectangle
   * @param {number} [y=0] - The Y coordinate of the upper-left corner of the rounded rectangle
   * @param {number} [width=0] - The overall width of this rounded rectangle
   * @param {number} [height=0] - The overall height of this rounded rectangle
   * @param {number} [radius=20] - Controls the radius of the rounded corners
   */
  function RoundedRectangle() {
    var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var width = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var height = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
    var radius = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 20;

    _classCallCheck(this, RoundedRectangle);

    /**
     * @member {number}
     * @default 0
     */
    this.x = x;

    /**
     * @member {number}
     * @default 0
     */
    this.y = y;

    /**
     * @member {number}
     * @default 0
     */
    this.width = width;

    /**
     * @member {number}
     * @default 0
     */
    this.height = height;

    /**
     * @member {number}
     * @default 20
     */
    this.radius = radius;

    /**
     * The type of the object, mainly used to avoid `instanceof` checks
     *
     * @member {number}
     * @readonly
     * @default PIXI.SHAPES.RREC
     * @see PIXI.SHAPES
     */
    this.type = _const.SHAPES.RREC;
  }

  /**
   * Creates a clone of this Rounded Rectangle
   *
   * @return {PIXI.RoundedRectangle} a copy of the rounded rectangle
   */


  RoundedRectangle.prototype.clone = function clone() {
    return new RoundedRectangle(this.x, this.y, this.width, this.height, this.radius);
  };

  /**
   * Checks whether the x and y coordinates given are contained within this Rounded Rectangle
   *
   * @param {number} x - The X coordinate of the point to test
   * @param {number} y - The Y coordinate of the point to test
   * @return {boolean} Whether the x/y coordinates are within this Rounded Rectangle
   */


  RoundedRectangle.prototype.contains = function contains(x, y) {
    if (this.width <= 0 || this.height <= 0) {
      return false;
    }

    if (x >= this.x && x <= this.x + this.width) {
      if (y >= this.y && y <= this.y + this.height) {
        return true;
      }
    }

    return false;
  };

  return RoundedRectangle;
}();

exports.default = RoundedRectangle;

},{"../../const":30}],59:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require('../utils');

var _math = require('../math');

var _const = require('../const');

var _Container = require('../display/Container');

var _Container2 = _interopRequireDefault(_Container);

var _RenderTexture = require('../textures/RenderTexture');

var _RenderTexture2 = _interopRequireDefault(_RenderTexture);

var _eventemitter = require('eventemitter3');

var _eventemitter2 = _interopRequireDefault(_eventemitter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var tempMatrix = new _math.Matrix();

/**
 * The SystemRenderer is the base for a Pixi Renderer. It is extended by the {@link PIXI.CanvasRenderer}
 * and {@link PIXI.WebGLRenderer} which can be used for rendering a Pixi scene.
 *
 * @abstract
 * @class
 * @extends EventEmitter
 * @memberof PIXI
 */

var SystemRenderer = function (_EventEmitter) {
  _inherits(SystemRenderer, _EventEmitter);

  /**
   * @param {string} system - The name of the system this renderer is for.
   * @param {number} [width=800] - the width of the canvas view
   * @param {number} [height=600] - the height of the canvas view
   * @param {object} [options] - The optional renderer parameters
   * @param {HTMLCanvasElement} [options.view] - the canvas to use as a view, optional
   * @param {boolean} [options.transparent=false] - If the render view is transparent, default false
   * @param {boolean} [options.autoResize=false] - If the render view is automatically resized, default false
   * @param {boolean} [options.antialias=false] - sets antialias (only applicable in chrome at the moment)
   * @param {number} [options.resolution=1] - The resolution / device pixel ratio of the renderer. The
   *  resolution of the renderer retina would be 2.
   * @param {boolean} [options.clearBeforeRender=true] - This sets if the CanvasRenderer will clear the canvas or
   *      not before the new render pass.
   * @param {number} [options.backgroundColor=0x000000] - The background color of the rendered area
   *  (shown if not transparent).
   * @param {boolean} [options.roundPixels=false] - If true Pixi will Math.floor() x/y values when rendering,
   *  stopping pixel interpolation.
   */
  function SystemRenderer(system, width, height, options) {
    _classCallCheck(this, SystemRenderer);

    var _this = _possibleConstructorReturn(this, _EventEmitter.call(this));

    (0, _utils.sayHello)(system);

    // prepare options
    if (options) {
      for (var i in _const.DEFAULT_RENDER_OPTIONS) {
        if (typeof options[i] === 'undefined') {
          options[i] = _const.DEFAULT_RENDER_OPTIONS[i];
        }
      }
    } else {
      options = _const.DEFAULT_RENDER_OPTIONS;
    }

    /**
     * The type of the renderer.
     *
     * @member {number}
     * @default PIXI.RENDERER_TYPE.UNKNOWN
     * @see PIXI.RENDERER_TYPE
     */
    _this.type = _const.RENDERER_TYPE.UNKNOWN;

    /**
     * The width of the canvas view
     *
     * @member {number}
     * @default 800
     */
    _this.width = width || 800;

    /**
     * The height of the canvas view
     *
     * @member {number}
     * @default 600
     */
    _this.height = height || 600;

    /**
     * The canvas element that everything is drawn to
     *
     * @member {HTMLCanvasElement}
     */
    _this.view = options.view || document.createElement('canvas');

    /**
     * The resolution / device pixel ratio of the renderer
     *
     * @member {number}
     * @default 1
     */
    _this.resolution = options.resolution || _const.RESOLUTION;

    /**
     * Whether the render view is transparent
     *
     * @member {boolean}
     */
    _this.transparent = options.transparent;

    /**
     * Whether the render view should be resized automatically
     *
     * @member {boolean}
     */
    _this.autoResize = options.autoResize || false;

    /**
     * Tracks the blend modes useful for this renderer.
     *
     * @member {object<string, mixed>}
     */
    _this.blendModes = null;

    /**
     * The value of the preserveDrawingBuffer flag affects whether or not the contents of
     * the stencil buffer is retained after rendering.
     *
     * @member {boolean}
     */
    _this.preserveDrawingBuffer = options.preserveDrawingBuffer;

    /**
     * This sets if the CanvasRenderer will clear the canvas or not before the new render pass.
     * If the scene is NOT transparent Pixi will use a canvas sized fillRect operation every
     * frame to set the canvas background color. If the scene is transparent Pixi will use clearRect
     * to clear the canvas every frame. Disable this by setting this to false. For example if
     * your game has a canvas filling background image you often don't need this set.
     *
     * @member {boolean}
     * @default
     */
    _this.clearBeforeRender = options.clearBeforeRender;

    /**
     * If true Pixi will Math.floor() x/y values when rendering, stopping pixel interpolation.
     * Handy for crisp pixel art and speed on legacy devices.
     *
     * @member {boolean}
     */
    _this.roundPixels = options.roundPixels;

    /**
     * The background color as a number.
     *
     * @member {number}
     * @private
     */
    _this._backgroundColor = 0x000000;

    /**
     * The background color as an [R, G, B] array.
     *
     * @member {number[]}
     * @private
     */
    _this._backgroundColorRgba = [0, 0, 0, 0];

    /**
     * The background color as a string.
     *
     * @member {string}
     * @private
     */
    _this._backgroundColorString = '#000000';

    _this.backgroundColor = options.backgroundColor || _this._backgroundColor; // run bg color setter

    /**
     * This temporary display object used as the parent of the currently being rendered item
     *
     * @member {PIXI.DisplayObject}
     * @private
     */
    _this._tempDisplayObjectParent = new game.Container();

    /**
     * The last root object that the renderer tried to render.
     *
     * @member {PIXI.DisplayObject}
     * @private
     */
    _this._lastObjectRendered = _this._tempDisplayObjectParent;
    return _this;
  }

  /**
   * Resizes the canvas view to the specified width and height
   *
   * @param {number} width - the new width of the canvas view
   * @param {number} height - the new height of the canvas view
   */


  SystemRenderer.prototype.resize = function resize(width, height) {
    this.width = width * this.resolution;
    this.height = height * this.resolution;

    this.view.width = this.width;
    this.view.height = this.height;

    if (this.autoResize) {
      this.view.style.width = this.width / this.resolution + 'px';
      this.view.style.height = this.height / this.resolution + 'px';
    }
  };

  /**
   * Useful function that returns a texture of the display object that can then be used to create sprites
   * This can be quite useful if your displayObject is complicated and needs to be reused multiple times.
   *
   * @param {PIXI.DisplayObject} displayObject - The displayObject the object will be generated from
   * @param {number} scaleMode - Should be one of the scaleMode consts
   * @param {number} resolution - The resolution / device pixel ratio of the texture being generated
   * @return {PIXI.Texture} a texture of the graphics object
   */


  SystemRenderer.prototype.generateTexture = function generateTexture(displayObject, scaleMode, resolution) {
    var bounds = displayObject.getLocalBounds();

    var renderTexture = _RenderTexture2.default.create(bounds.width | 0, bounds.height | 0, scaleMode, resolution);

    tempMatrix.tx = -bounds.x;
    tempMatrix.ty = -bounds.y;

    this.render(displayObject, renderTexture, false, tempMatrix, true);

    return renderTexture;
  };

  /**
   * Removes everything from the renderer and optionally removes the Canvas DOM element.
   *
   * @param {boolean} [removeView=false] - Removes the Canvas element from the DOM.
   */


  SystemRenderer.prototype.destroy = function destroy(removeView) {
    if (removeView && this.view.parentNode) {
      this.view.parentNode.removeChild(this.view);
    }

    this.type = _const.RENDERER_TYPE.UNKNOWN;

    this.width = 0;
    this.height = 0;

    this.view = null;

    this.resolution = 0;

    this.transparent = false;

    this.autoResize = false;

    this.blendModes = null;

    this.preserveDrawingBuffer = false;
    this.clearBeforeRender = false;

    this.roundPixels = false;

    this._backgroundColor = 0;
    this._backgroundColorRgba = null;
    this._backgroundColorString = null;

    this.backgroundColor = 0;
    this._tempDisplayObjectParent = null;
    this._lastObjectRendered = null;
  };

  /**
   * The background color to fill if not transparent
   *
   * @member {number}
   * @memberof PIXI.SystemRenderer#
   */


  _createClass(SystemRenderer, [{
    key: 'backgroundColor',
    get: function get() {
      return this._backgroundColor;
    }

    /**
     * Sets the background color.
     *
     * @param {number} value - The value to set to.
     */
    ,
    set: function set(value) {
      this._backgroundColor = value;
      this._backgroundColorString = (0, _utils.hex2string)(value);
      (0, _utils.hex2rgb)(value, this._backgroundColorRgba);
    }
  }]);

  return SystemRenderer;
}(_eventemitter2.default);

exports.default = SystemRenderer;

},{"../const":30,"../display/Container":32,"../math":53,"../textures/RenderTexture":93,"../utils":101,"eventemitter3":4}],60:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _SystemRenderer2 = require('../SystemRenderer');

var _SystemRenderer3 = _interopRequireDefault(_SystemRenderer2);

var _CanvasMaskManager = require('./utils/CanvasMaskManager');

var _CanvasMaskManager2 = _interopRequireDefault(_CanvasMaskManager);

var _CanvasRenderTarget = require('./utils/CanvasRenderTarget');

var _CanvasRenderTarget2 = _interopRequireDefault(_CanvasRenderTarget);

var _mapCanvasBlendModesToPixi = require('./utils/mapCanvasBlendModesToPixi');

var _mapCanvasBlendModesToPixi2 = _interopRequireDefault(_mapCanvasBlendModesToPixi);

var _utils = require('../../utils');

var _const = require('../../const');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * The CanvasRenderer draws the scene and all its content onto a 2d canvas. This renderer should
 * be used for browsers that do not support WebGL. Don't forget to add the CanvasRenderer.view to
 * your DOM or you will not see anything :)
 *
 * @class
 * @memberof PIXI
 * @extends PIXI.SystemRenderer
 */
var CanvasRenderer = function (_SystemRenderer) {
    _inherits(CanvasRenderer, _SystemRenderer);

    /**
     * @param {number} [width=800] - the width of the canvas view
     * @param {number} [height=600] - the height of the canvas view
     * @param {object} [options] - The optional renderer parameters
     * @param {HTMLCanvasElement} [options.view] - the canvas to use as a view, optional
     * @param {boolean} [options.transparent=false] - If the render view is transparent, default false
     * @param {boolean} [options.autoResize=false] - If the render view is automatically resized, default false
     * @param {boolean} [options.antialias=false] - sets antialias (only applicable in chrome at the moment)
     * @param {number} [options.resolution=1] - The resolution / device pixel ratio of the renderer. The
     *  resolution of the renderer retina would be 2.
     * @param {boolean} [options.clearBeforeRender=true] - This sets if the CanvasRenderer will clear the canvas or
     *      not before the new render pass.
     * @param {number} [options.backgroundColor=0x000000] - The background color of the rendered area
     *  (shown if not transparent).
     * @param {boolean} [options.roundPixels=false] - If true Pixi will Math.floor() x/y values when rendering,
     *  stopping pixel interpolation.
     */
    function CanvasRenderer(width, height) {
        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

        _classCallCheck(this, CanvasRenderer);

        var _this = _possibleConstructorReturn(this, _SystemRenderer.call(this, 'Canvas', width, height, options));

        _this.type = _const.RENDERER_TYPE.CANVAS;

        /**
         * The canvas 2d context that everything is drawn with.
         *
         * @member {CanvasRenderingContext2D}
         */
        _this.rootContext = _this.view.getContext('2d', { alpha: _this.transparent });

        /**
         * Boolean flag controlling canvas refresh.
         *
         * @member {boolean}
         */
        _this.refresh = true;

        /**
         * Instance of a CanvasMaskManager, handles masking when using the canvas renderer.
         *
         * @member {PIXI.CanvasMaskManager}
         */
        _this.maskManager = new _CanvasMaskManager2.default(_this);

        /**
         * The canvas property used to set the canvas smoothing property.
         *
         * @member {string}
         */
        _this.smoothProperty = 'imageSmoothingEnabled';

        if (!_this.rootContext.imageSmoothingEnabled) {
            if (_this.rootContext.webkitImageSmoothingEnabled) {
                _this.smoothProperty = 'webkitImageSmoothingEnabled';
            } else if (_this.rootContext.mozImageSmoothingEnabled) {
                _this.smoothProperty = 'mozImageSmoothingEnabled';
            } else if (_this.rootContext.oImageSmoothingEnabled) {
                _this.smoothProperty = 'oImageSmoothingEnabled';
            } else if (_this.rootContext.msImageSmoothingEnabled) {
                _this.smoothProperty = 'msImageSmoothingEnabled';
            }
        }

        _this.initPlugins();

        _this.blendModes = (0, _mapCanvasBlendModesToPixi2.default)();
        _this._activeBlendMode = null;

        _this.context = null;
        _this.renderingToScreen = false;

        _this.resize(width, height);
        return _this;
    }

    /**
     * Renders the object to this canvas view
     *
     * @param {PIXI.DisplayObject} displayObject - The object to be rendered
     * @param {PIXI.RenderTexture} [renderTexture] - A render texture to be rendered to.
     *  If unset, it will render to the root context.
     * @param {boolean} [clear=false] - Whether to clear the canvas before drawing
     * @param {PIXI.Transform} [transform] - A transformation to be applied
     * @param {boolean} [skipUpdateTransform=false] - Whether to skip the update transform
     */


    CanvasRenderer.prototype.render = function render(displayObject, renderTexture, clear, transform, skipUpdateTransform) {
        if (!this.view) {
            return;
        }

        // can be handy to know!
        this.renderingToScreen = !renderTexture;

        this.emit('prerender');

        if (renderTexture) {
            renderTexture = renderTexture.baseTexture || renderTexture;

            if (!renderTexture._canvasRenderTarget) {
                renderTexture._canvasRenderTarget = new _CanvasRenderTarget2.default(renderTexture.width, renderTexture.height, renderTexture.resolution);
                renderTexture.source = renderTexture._canvasRenderTarget.canvas;
                renderTexture.valid = true;
            }

            this.context = renderTexture._canvasRenderTarget.context;
            this.resolution = renderTexture._canvasRenderTarget.resolution;
        } else {
            this.context = this.rootContext;
        }

        var context = this.context;

        if (!renderTexture) {
            this._lastObjectRendered = displayObject;
        }

        if (!skipUpdateTransform) {
            // update the scene graph
            var cacheParent = displayObject.parent;
            var tempWt = this._tempDisplayObjectParent.transform.worldTransform;

            if (transform) {
                transform.copy(tempWt);
            } else {
                tempWt.identity();
            }

            displayObject.parent = this._tempDisplayObjectParent;
            displayObject.updateTransform();
            displayObject.parent = cacheParent;
            // displayObject.hitArea = //TODO add a temp hit area
        }

        context.setTransform(1, 0, 0, 1, 0, 0);
        context.globalAlpha = 1;
        context.globalCompositeOperation = this.blendModes[_const.BLEND_MODES.NORMAL];

        if (navigator.isCocoonJS && this.view.screencanvas) {
            context.fillStyle = 'black';
            context.clear();
        }

        if (clear !== undefined ? clear : this.clearBeforeRender) {
            if (this.renderingToScreen) {
                if (this.transparent) {
                    context.clearRect(0, 0, this.width, this.height);
                } else {
                    context.fillStyle = this._backgroundColorString;
                    context.fillRect(0, 0, this.width, this.height);
                }
            } // else {
            // TODO: implement background for CanvasRenderTarget or RenderTexture?
            // }
        }

        // TODO RENDER TARGET STUFF HERE..
        var tempContext = this.context;

        this.context = context;
        displayObject.renderCanvas(this);
        this.context = tempContext;

        this.emit('postrender');
    };

    /**
     * Sets the blend mode of the renderer.
     *
     * @param {number} blendMode - See {@link PIXI.BLEND_MODES} for valid values.
     */


    CanvasRenderer.prototype.setBlendMode = function setBlendMode(blendMode) {
        if (this._activeBlendMode === blendMode) {
            return;
        }

        this.context.globalCompositeOperation = this.blendModes[blendMode];
    };

    /**
     * Removes everything from the renderer and optionally removes the Canvas DOM element.
     *
     * @param {boolean} [removeView=false] - Removes the Canvas element from the DOM.
     */


    CanvasRenderer.prototype.destroy = function destroy(removeView) {
        this.destroyPlugins();

        // call the base destroy
        _SystemRenderer.prototype.destroy.call(this, removeView);

        this.context = null;

        this.refresh = true;

        this.maskManager.destroy();
        this.maskManager = null;

        this.smoothProperty = null;
    };

    /**
     * Resizes the canvas view to the specified width and height.
     *
     * @extends PIXI.SystemRenderer#resize
     *
     * @param {number} width - The new width of the canvas view
     * @param {number} height - The new height of the canvas view
     */


    CanvasRenderer.prototype.resize = function resize(width, height) {
        _SystemRenderer.prototype.resize.call(this, width, height);

        // reset the scale mode.. oddly this seems to be reset when the canvas is resized.
        // surely a browser bug?? Let pixi fix that for you..
        if (this.smoothProperty) {
            this.rootContext[this.smoothProperty] = _const.SCALE_MODES.DEFAULT === _const.SCALE_MODES.LINEAR;
        }
    };

    return CanvasRenderer;
}(_SystemRenderer3.default);

exports.default = CanvasRenderer;


_utils.pluginTarget.mixin(CanvasRenderer);

},{"../../const":30,"../../utils":101,"../SystemRenderer":59,"./utils/CanvasMaskManager":61,"./utils/CanvasRenderTarget":62,"./utils/mapCanvasBlendModesToPixi":64}],61:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _const = require('../../../const');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * A set of functions used to handle masking.
 *
 * @class
 * @memberof PIXI
 */
var CanvasMaskManager = function () {
    /**
     * @param {PIXI.CanvasRenderer} renderer - The canvas renderer.
     */
    function CanvasMaskManager(renderer) {
        _classCallCheck(this, CanvasMaskManager);

        this.renderer = renderer;
    }

    /**
     * This method adds it to the current stack of masks.
     *
     * @param {object} maskData - the maskData that will be pushed
     */


    CanvasMaskManager.prototype.pushMask = function pushMask(maskData) {
        var renderer = this.renderer;

        renderer.context.save();

        var cacheAlpha = maskData.alpha;
        var transform = maskData.transform.worldTransform;
        var resolution = renderer.resolution;

        renderer.context.setTransform(transform.a * resolution, transform.b * resolution, transform.c * resolution, transform.d * resolution, transform.tx * resolution, transform.ty * resolution);

        // TODO suport sprite alpha masks??
        // lots of effort required. If demand is great enough..
        if (!maskData._texture) {
            this.renderGraphicsShape(maskData);
            renderer.context.clip();
        }

        maskData.worldAlpha = cacheAlpha;
    };

    /**
     * Renders a PIXI.Graphics shape.
     *
     * @param {PIXI.Graphics} graphics - The object to render.
     */


    CanvasMaskManager.prototype.renderGraphicsShape = function renderGraphicsShape(graphics) {
        var context = this.renderer.context;
        var len = graphics.graphicsData.length;

        if (len === 0) {
            return;
        }

        context.beginPath();

        for (var i = 0; i < len; i++) {
            var data = graphics.graphicsData[i];
            var shape = data.shape;

            if (data.type === _const.SHAPES.POLY) {
                var points = shape.points;

                context.moveTo(points[0], points[1]);

                for (var j = 1; j < points.length / 2; j++) {
                    context.lineTo(points[j * 2], points[j * 2 + 1]);
                }

                // if the first and last point are the same close the path - much neater :)
                if (points[0] === points[points.length - 2] && points[1] === points[points.length - 1]) {
                    context.closePath();
                }
            } else if (data.type === _const.SHAPES.RECT) {
                context.rect(shape.x, shape.y, shape.width, shape.height);
                context.closePath();
            } else if (data.type === _const.SHAPES.CIRC) {
                // TODO - need to be Undefined!
                context.arc(shape.x, shape.y, shape.radius, 0, 2 * Math.PI);
                context.closePath();
            } else if (data.type === _const.SHAPES.ELIP) {
                // ellipse code taken from: http://stackoverflow.com/questions/2172798/how-to-draw-an-oval-in-html5-canvas

                var w = shape.width * 2;
                var h = shape.height * 2;

                var x = shape.x - w / 2;
                var y = shape.y - h / 2;

                var kappa = 0.5522848;
                var ox = w / 2 * kappa; // control point offset horizontal
                var oy = h / 2 * kappa; // control point offset vertical
                var xe = x + w; // x-end
                var ye = y + h; // y-end
                var xm = x + w / 2; // x-middle
                var ym = y + h / 2; // y-middle

                context.moveTo(x, ym);
                context.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
                context.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
                context.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
                context.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
                context.closePath();
            } else if (data.type === _const.SHAPES.RREC) {
                var rx = shape.x;
                var ry = shape.y;
                var width = shape.width;
                var height = shape.height;
                var radius = shape.radius;

                var maxRadius = Math.min(width, height) / 2 | 0;

                radius = radius > maxRadius ? maxRadius : radius;

                context.moveTo(rx, ry + radius);
                context.lineTo(rx, ry + height - radius);
                context.quadraticCurveTo(rx, ry + height, rx + radius, ry + height);
                context.lineTo(rx + width - radius, ry + height);
                context.quadraticCurveTo(rx + width, ry + height, rx + width, ry + height - radius);
                context.lineTo(rx + width, ry + radius);
                context.quadraticCurveTo(rx + width, ry, rx + width - radius, ry);
                context.lineTo(rx + radius, ry);
                context.quadraticCurveTo(rx, ry, rx, ry + radius);
                context.closePath();
            }
        }
    };

    /**
     * Restores the current drawing context to the state it was before the mask was applied.
     *
     * @param {PIXI.CanvasRenderer} renderer - The renderer context to use.
     */


    CanvasMaskManager.prototype.popMask = function popMask(renderer) {
        renderer.context.restore();
    };

    /**
     * Destroys this canvas mask manager.
     *
     */


    CanvasMaskManager.prototype.destroy = function destroy() {
        /* empty */
    };

    return CanvasMaskManager;
}();

exports.default = CanvasMaskManager;

},{"../../../const":30}],62:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _const = require('../../../const');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Creates a Canvas element of the given size.
 *
 * @class
 * @memberof PIXI
 */
var CanvasRenderTarget = function () {
  /**
   * @param {number} width - the width for the newly created canvas
   * @param {number} height - the height for the newly created canvas
   * @param {number} [resolution=1] - The resolution / device pixel ratio of the canvas
   */
  function CanvasRenderTarget(width, height, resolution) {
    _classCallCheck(this, CanvasRenderTarget);

    /**
     * The Canvas object that belongs to this CanvasRenderTarget.
     *
     * @member {HTMLCanvasElement}
     */
    this.canvas = document.createElement('canvas');

    /**
     * A CanvasRenderingContext2D object representing a two-dimensional rendering context.
     *
     * @member {CanvasRenderingContext2D}
     */
    this.context = this.canvas.getContext('2d');

    this.resolution = resolution || _const.RESOLUTION;

    this.resize(width, height);
  }

  /**
   * Clears the canvas that was created by the CanvasRenderTarget class.
   *
   * @private
   */


  CanvasRenderTarget.prototype.clear = function clear() {
    this.context.setTransform(1, 0, 0, 1, 0, 0);
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  };

  /**
   * Resizes the canvas to the specified width and height.
   *
   * @param {number} width - the new width of the canvas
   * @param {number} height - the new height of the canvas
   */


  CanvasRenderTarget.prototype.resize = function resize(width, height) {
    this.canvas.width = width * this.resolution;
    this.canvas.height = height * this.resolution;
  };

  /**
   * Destroys this canvas.
   *
   */


  CanvasRenderTarget.prototype.destroy = function destroy() {
    this.context = null;
    this.canvas = null;
  };

  /**
   * The width of the canvas buffer in pixels.
   *
   * @member {number}
   * @memberof PIXI.CanvasRenderTarget#
   */


  _createClass(CanvasRenderTarget, [{
    key: 'width',
    get: function get() {
      return this.canvas.width;
    }

    /**
     * Sets the width.
     *
     * @param {number} val - The value to set.
     */
    ,
    set: function set(val) {
      this.canvas.width = val;
    }

    /**
     * The height of the canvas buffer in pixels.
     *
     * @member {number}
     * @memberof PIXI.CanvasRenderTarget#
     */

  }, {
    key: 'height',
    get: function get() {
      return this.canvas.height;
    }

    /**
     * Sets the height.
     *
     * @param {number} val - The value to set.
     */
    ,
    set: function set(val) {
      this.canvas.height = val;
    }
  }]);

  return CanvasRenderTarget;
}();

exports.default = CanvasRenderTarget;

},{"../../../const":30}],63:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.default = canUseNewCanvasBlendModes;
/**
 * Creates a little colored canvas
 *
 * @ignore
 * @param {number} color - The color to make the canvas
 * @return {canvas} a small canvas element
 */
function createColoredCanvas(color) {
    var canvas = document.createElement('canvas');

    canvas.width = 6;
    canvas.height = 1;

    var context = canvas.getContext('2d');

    context.fillStyle = color;
    context.fillRect(0, 0, 6, 1);

    return canvas;
}

/**
 * Checks whether the Canvas BlendModes are supported by the current browser
 *
 * @return {boolean} whether they are supported
 */
function canUseNewCanvasBlendModes() {
    if (typeof document === 'undefined') {
        return false;
    }

    var magenta = createColoredCanvas('#ff00ff');
    var yellow = createColoredCanvas('#ffff00');

    var canvas = document.createElement('canvas');

    canvas.width = 6;
    canvas.height = 1;

    var context = canvas.getContext('2d');

    context.globalCompositeOperation = 'multiply';
    context.drawImage(magenta, 0, 0);
    context.drawImage(yellow, 2, 0);

    var imageData = context.getImageData(2, 0, 1, 1);

    if (!imageData) {
        return false;
    }

    var data = imageData.data;

    return data[0] === 255 && data[1] === 0 && data[2] === 0;
}

},{}],64:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.default = mapCanvasBlendModesToPixi;

var _const = require('../../../const');

var _canUseNewCanvasBlendModes = require('./canUseNewCanvasBlendModes');

var _canUseNewCanvasBlendModes2 = _interopRequireDefault(_canUseNewCanvasBlendModes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Maps blend combinations to Canvas.
 *
 * @memberof PIXI
 * @param {string[]} [array=[]] - The array to output into.
 * @return {string[]} Mapped modes.
 */
function mapCanvasBlendModesToPixi() {
    var array = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    if ((0, _canUseNewCanvasBlendModes2.default)()) {
        array[_const.BLEND_MODES.NORMAL] = 'source-over';
        array[_const.BLEND_MODES.ADD] = 'lighter'; // IS THIS OK???
        array[_const.BLEND_MODES.MULTIPLY] = 'multiply';
        array[_const.BLEND_MODES.SCREEN] = 'screen';
        array[_const.BLEND_MODES.OVERLAY] = 'overlay';
        array[_const.BLEND_MODES.DARKEN] = 'darken';
        array[_const.BLEND_MODES.LIGHTEN] = 'lighten';
        array[_const.BLEND_MODES.COLOR_DODGE] = 'color-dodge';
        array[_const.BLEND_MODES.COLOR_BURN] = 'color-burn';
        array[_const.BLEND_MODES.HARD_LIGHT] = 'hard-light';
        array[_const.BLEND_MODES.SOFT_LIGHT] = 'soft-light';
        array[_const.BLEND_MODES.DIFFERENCE] = 'difference';
        array[_const.BLEND_MODES.EXCLUSION] = 'exclusion';
        array[_const.BLEND_MODES.HUE] = 'hue';
        array[_const.BLEND_MODES.SATURATION] = 'saturate';
        array[_const.BLEND_MODES.COLOR] = 'color';
        array[_const.BLEND_MODES.LUMINOSITY] = 'luminosity';
    } else {
        // this means that the browser does not support the cool new blend modes in canvas 'cough' ie 'cough'
        array[_const.BLEND_MODES.NORMAL] = 'source-over';
        array[_const.BLEND_MODES.ADD] = 'lighter'; // IS THIS OK???
        array[_const.BLEND_MODES.MULTIPLY] = 'source-over';
        array[_const.BLEND_MODES.SCREEN] = 'source-over';
        array[_const.BLEND_MODES.OVERLAY] = 'source-over';
        array[_const.BLEND_MODES.DARKEN] = 'source-over';
        array[_const.BLEND_MODES.LIGHTEN] = 'source-over';
        array[_const.BLEND_MODES.COLOR_DODGE] = 'source-over';
        array[_const.BLEND_MODES.COLOR_BURN] = 'source-over';
        array[_const.BLEND_MODES.HARD_LIGHT] = 'source-over';
        array[_const.BLEND_MODES.SOFT_LIGHT] = 'source-over';
        array[_const.BLEND_MODES.DIFFERENCE] = 'source-over';
        array[_const.BLEND_MODES.EXCLUSION] = 'source-over';
        array[_const.BLEND_MODES.HUE] = 'source-over';
        array[_const.BLEND_MODES.SATURATION] = 'source-over';
        array[_const.BLEND_MODES.COLOR] = 'source-over';
        array[_const.BLEND_MODES.LUMINOSITY] = 'source-over';
    }

    return array;
}

},{"../../../const":30,"./canUseNewCanvasBlendModes":63}],65:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _const = require('../../const');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * TextureGarbageCollector. This class manages the GPU and ensures that it does not get clogged
 * up with textures that are no longer being used.
 *
 * @class
 * @memberof PIXI
 */
var TextureGarbageCollector = function () {
    /**
     * @param {PIXI.WebGLRenderer} renderer - The renderer this manager works for.
     */
    function TextureGarbageCollector(renderer) {
        _classCallCheck(this, TextureGarbageCollector);

        this.renderer = renderer;

        this.count = 0;
        this.checkCount = 0;
        this.maxIdle = 60 * 60;
        this.checkCountMax = 60 * 10;

        this.mode = _const.GC_MODES.DEFAULT;
    }

    /**
     * Checks to see when the last time a texture was used
     * if the texture has not been used for a specified amount of time it will be removed from the GPU
     */


    TextureGarbageCollector.prototype.update = function update() {
        this.count++;

        if (this.mode === _const.GC_MODES.MANUAL) {
            return;
        }

        this.checkCount++;

        if (this.checkCount > this.checkCountMax) {
            this.checkCount = 0;

            this.run();
        }
    };

    /**
     * Checks to see when the last time a texture was used
     * if the texture has not been used for a specified amount of time it will be removed from the GPU
     */


    TextureGarbageCollector.prototype.run = function run() {
        var tm = this.renderer.textureManager;
        var managedTextures = tm._managedTextures;
        var wasRemoved = false;

        for (var i = 0; i < managedTextures.length; i++) {
            var texture = managedTextures[i];

            // only supports non generated textures at the moment!
            if (!texture._glRenderTargets && this.count - texture.touched > this.maxIdle) {
                tm.destroyTexture(texture, true);
                managedTextures[i] = null;
                wasRemoved = true;
            }
        }

        if (wasRemoved) {
            var j = 0;

            for (var _i = 0; _i < managedTextures.length; _i++) {
                if (managedTextures[_i] !== null) {
                    managedTextures[j++] = managedTextures[_i];
                }
            }

            managedTextures.length = j;
        }
    };

    /**
     * Removes all the textures within the specified displayObject and its children from the GPU
     *
     * @param {PIXI.DisplayObject} displayObject - the displayObject to remove the textures from.
     */


    TextureGarbageCollector.prototype.unload = function unload(displayObject) {
        var tm = this.renderer.textureManager;

        if (displayObject._texture) {
            tm.destroyTexture(displayObject._texture, true);
        }

        for (var i = displayObject.children.length - 1; i >= 0; i--) {
            this.unload(displayObject.children[i]);
        }
    };

    return TextureGarbageCollector;
}();

exports.default = TextureGarbageCollector;

},{"../../const":30}],66:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _pixiGlCore = require('pixi-gl-core');

var _const = require('../../const');

var _RenderTarget = require('./utils/RenderTarget');

var _RenderTarget2 = _interopRequireDefault(_RenderTarget);

var _utils = require('../../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Helper class to create a webGL Texture
 *
 * @class
 * @memberof PIXI
 */
var TextureManager = function () {
    /**
     * @param {PIXI.WebGLRenderer} renderer - A reference to the current renderer
     */
    function TextureManager(renderer) {
        _classCallCheck(this, TextureManager);

        /**
         * A reference to the current renderer
         *
         * @member {PIXI.WebGLRenderer}
         */
        this.renderer = renderer;

        /**
         * The current WebGL rendering context
         *
         * @member {WebGLRenderingContext}
         */
        this.gl = renderer.gl;

        /**
         * Track textures in the renderer so we can no longer listen to them on destruction.
         *
         * @member {Array<*>}
         * @private
         */
        this._managedTextures = [];
    }

    /**
     * Binds a texture.
     *
     */


    TextureManager.prototype.bindTexture = function bindTexture() {}
    // empty


    /**
     * Gets a texture.
     *
     */
    ;

    TextureManager.prototype.getTexture = function getTexture() {}
    // empty


    /**
     * Updates and/or Creates a WebGL texture for the renderer's context.
     *
     * @param {PIXI.BaseTexture|PIXI.Texture} texture - the texture to update
     * @return {GLTexture} The gl texture.
     */
    ;

    TextureManager.prototype.updateTexture = function updateTexture(texture) {
        texture = texture.baseTexture || texture;

        var isRenderTexture = !!texture._glRenderTargets;

        if (!texture._hasLoaded) {
            return null;
        }

        var glTexture = texture._glTextures[this.renderer.CONTEXT_UID];

        if (!glTexture) {
            // console.log('Creating gl texture for ' + texture.source.src);
            if (isRenderTexture) {
                var renderTarget = new _RenderTarget2.default(this.gl, texture.width, texture.height, texture.scaleMode, texture.resolution);

                renderTarget.resize(texture.width, texture.height);
                texture._glRenderTargets[this.renderer.CONTEXT_UID] = renderTarget;
                glTexture = renderTarget.texture;
            } else {
                glTexture = new _pixiGlCore.GLTexture(this.gl);
                glTexture.premultiplyAlpha = true;
                glTexture.upload(texture.source);
            }

            texture._glTextures[this.renderer.CONTEXT_UID] = glTexture;

            texture._on('update', this.updateTexture, this);
            texture._on('dispose', this.destroyTexture, this);

            this._managedTextures.push(texture);

            if (texture.isPowerOfTwo) {
                if (texture._mipmap) {
                    glTexture.enableMipmap();
                }

                if (texture._wrapMode === _const.WRAP_MODES.CLAMP) {
                    glTexture.enableWrapClamp();
                } else if (texture._wrapMode === _const.WRAP_MODES.REPEAT) {
                    glTexture.enableWrapRepeat();
                } else {
                    glTexture.enableWrapMirrorRepeat();
                }
            } else {
                glTexture.enableWrapClamp();
            }

            if (texture._scaleMode === _const.SCALE_MODES.NEAREST) {
                glTexture.enableNearestScaling();
            } else {
                glTexture.enableLinearScaling();
            }
        }
        // the textur ealrady exists so we only need to update it..
        else if (isRenderTexture) {
                texture._glRenderTargets[this.renderer.CONTEXT_UID].resize(texture.width, texture.height);
            } else {
                glTexture.upload(texture.source);
            }

        return glTexture;
    };

    /**
     * Deletes the texture from WebGL
     *
     * @param {PIXI.BaseTexture|PIXI.Texture} texture - the texture to destroy
     * @param {boolean} [skipRemove=false] - Whether to skip removing the texture from the TextureManager.
     */


    TextureManager.prototype.destroyTexture = function destroyTexture(texture, skipRemove) {
        texture = texture.baseTexture || texture;

        if (!texture.hasLoaded) {
            return;
        }

        if (texture._glTextures[this.renderer.CONTEXT_UID]) {
            texture._glTextures[this.renderer.CONTEXT_UID].destroy();
            texture.off('update', this.updateTexture, this);
            texture.off('dispose', this.destroyTexture, this);

            delete texture._glTextures[this.renderer.CONTEXT_UID];

            if (!skipRemove) {
                var i = this._managedTextures.indexOf(texture);

                if (i !== -1) {
                    (0, _utils.removeItems)(this._managedTextures, i, 1);
                }
            }
        }
    };

    /**
     * Deletes all the textures from WebGL
     */


    TextureManager.prototype.removeAll = function removeAll() {
        // empty all the old gl textures as they are useless now
        for (var i = 0; i < this._managedTextures.length; ++i) {
            var texture = this._managedTextures[i];

            if (texture._glTextures[this.renderer.CONTEXT_UID]) {
                delete texture._glTextures[this.renderer.CONTEXT_UID];
            }
        }
    };

    /**
     * Destroys this manager and removes all its textures
     */


    TextureManager.prototype.destroy = function destroy() {
        // destroy managed textures
        for (var i = 0; i < this._managedTextures.length; ++i) {
            var texture = this._managedTextures[i];

            this.destroyTexture(texture, true);

            texture.off('update', this.updateTexture, this);
            texture.off('dispose', this.destroyTexture, this);
        }

        this._managedTextures = null;
    };

    return TextureManager;
}();

exports.default = TextureManager;

},{"../../const":30,"../../utils":101,"./utils/RenderTarget":79,"pixi-gl-core":12}],67:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _SystemRenderer2 = require('../SystemRenderer');

var _SystemRenderer3 = _interopRequireDefault(_SystemRenderer2);

var _MaskManager = require('./managers/MaskManager');

var _MaskManager2 = _interopRequireDefault(_MaskManager);

var _StencilManager = require('./managers/StencilManager');

var _StencilManager2 = _interopRequireDefault(_StencilManager);

var _FilterManager = require('./managers/FilterManager');

var _FilterManager2 = _interopRequireDefault(_FilterManager);

var _RenderTarget = require('./utils/RenderTarget');

var _RenderTarget2 = _interopRequireDefault(_RenderTarget);

var _ObjectRenderer = require('./utils/ObjectRenderer');

var _ObjectRenderer2 = _interopRequireDefault(_ObjectRenderer);

var _TextureManager = require('./TextureManager');

var _TextureManager2 = _interopRequireDefault(_TextureManager);

var _TextureGarbageCollector = require('./TextureGarbageCollector');

var _TextureGarbageCollector2 = _interopRequireDefault(_TextureGarbageCollector);

var _WebGLState = require('./WebGLState');

var _WebGLState2 = _interopRequireDefault(_WebGLState);

var _mapWebGLDrawModesToPixi = require('./utils/mapWebGLDrawModesToPixi');

var _mapWebGLDrawModesToPixi2 = _interopRequireDefault(_mapWebGLDrawModesToPixi);

var _validateContext = require('./utils/validateContext');

var _validateContext2 = _interopRequireDefault(_validateContext);

var _utils = require('../../utils');

var _pixiGlCore = require('pixi-gl-core');

var _pixiGlCore2 = _interopRequireDefault(_pixiGlCore);

var _const = require('../../const');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CONTEXT_UID = 0;

/**
 * The WebGLRenderer draws the scene and all its content onto a webGL enabled canvas. This renderer
 * should be used for browsers that support webGL. This Render works by automatically managing webGLBatchs.
 * So no need for Sprite Batches or Sprite Clouds.
 * Don't forget to add the view to your DOM or you will not see anything :)
 *
 * @class
 * @memberof PIXI
 * @extends PIXI.SystemRenderer
 */

var WebGLRenderer = function (_SystemRenderer) {
    _inherits(WebGLRenderer, _SystemRenderer);

    /**
     *
     * @param {number} [width=0] - the width of the canvas view
     * @param {number} [height=0] - the height of the canvas view
     * @param {object} [options] - The optional renderer parameters
     * @param {HTMLCanvasElement} [options.view] - the canvas to use as a view, optional
     * @param {boolean} [options.transparent=false] - If the render view is transparent, default false
     * @param {boolean} [options.autoResize=false] - If the render view is automatically resized, default false
     * @param {boolean} [options.antialias=false] - sets antialias. If not available natively then FXAA
     *  antialiasing is used
     * @param {boolean} [options.forceFXAA=false] - forces FXAA antialiasing to be used over native.
     *  FXAA is faster, but may not always look as great
     * @param {number} [options.resolution=1] - The resolution / device pixel ratio of the renderer.
     *  The resolution of the renderer retina would be 2.
     * @param {boolean} [options.clearBeforeRender=true] - This sets if the CanvasRenderer will clear
     *  the canvas or not before the new render pass. If you wish to set this to false, you *must* set
     *  preserveDrawingBuffer to `true`.
     * @param {boolean} [options.preserveDrawingBuffer=false] - enables drawing buffer preservation,
     *  enable this if you need to call toDataUrl on the webgl context.
     * @param {boolean} [options.roundPixels=false] - If true Pixi will Math.floor() x/y values when
     *  rendering, stopping pixel interpolation.
     */
    function WebGLRenderer(width, height) {
        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

        _classCallCheck(this, WebGLRenderer);

        /**
         * The type of this renderer as a standardised const
         *
         * @member {number}
         * @see PIXI.RENDERER_TYPE
         */
        var _this = _possibleConstructorReturn(this, _SystemRenderer.call(this, 'WebGL', width, height, options));

        _this.type = _const.RENDERER_TYPE.WEBGL;

        _this.handleContextLost = _this.handleContextLost.bind(_this);
        _this.handleContextRestored = _this.handleContextRestored.bind(_this);

        _this.view.addEventListener('webglcontextlost', _this.handleContextLost, false);
        _this.view.addEventListener('webglcontextrestored', _this.handleContextRestored, false);

        /**
         * The options passed in to create a new webgl context.
         *
         * @member {object}
         * @private
         */
        _this._contextOptions = {
            alpha: _this.transparent,
            antialias: options.antialias,
            premultipliedAlpha: _this.transparent && _this.transparent !== 'notMultiplied',
            stencil: true,
            preserveDrawingBuffer: options.preserveDrawingBuffer
        };

        _this._backgroundColorRgba[3] = _this.transparent ? 0 : 1;

        /**
         * Manages the masks using the stencil buffer.
         *
         * @member {PIXI.MaskManager}
         */
        _this.maskManager = new _MaskManager2.default(_this);

        /**
         * Manages the stencil buffer.
         *
         * @member {PIXI.StencilManager}
         */
        _this.stencilManager = new _StencilManager2.default(_this);

        /**
         * An empty renderer.
         *
         * @member {PIXI.ObjectRenderer}
         */
        _this.emptyRenderer = new _ObjectRenderer2.default(_this);

        /**
         * The currently active ObjectRenderer.
         *
         * @member {PIXI.ObjectRenderer}
         */
        _this.currentRenderer = _this.emptyRenderer;

        _this.initPlugins();

        /**
         * The current WebGL rendering context, it is created here
         *
         * @member {WebGLRenderingContext}
         */
        // initialize the context so it is ready for the managers.
        if (options.context) {
            // checks to see if a context is valid..
            (0, _validateContext2.default)(options.context);
        }

        _this.gl = options.context || _pixiGlCore2.default.createContext(_this.view, _this._contextOptions);

        _this.CONTEXT_UID = CONTEXT_UID++;

        /**
         * The currently active ObjectRenderer.
         *
         * @member {PIXI.WebGLState}
         */
        _this.state = new _WebGLState2.default(_this.gl);

        _this.renderingToScreen = true;

        _this._initContext();

        /**
         * Manages the filters.
         *
         * @member {PIXI.FilterManager}
         */
        _this.filterManager = new _FilterManager2.default(_this);
        // map some webGL blend and drawmodes..
        _this.drawModes = (0, _mapWebGLDrawModesToPixi2.default)(_this.gl);

        /**
         * Holds the current shader
         *
         * @member {PIXI.Shader}
         */
        _this._activeShader = null;

        /**
         * Holds the current render target
         *
         * @member {PIXI.RenderTarget}
         */
        _this._activeRenderTarget = null;
        _this._activeTextureLocation = 999;
        _this._activeTexture = null;

        _this.setBlendMode(0);
        return _this;
    }

    /**
     * Creates the WebGL context
     *
     * @private
     */


    WebGLRenderer.prototype._initContext = function _initContext() {
        var gl = this.gl;

        // restore a context if it was previously lost
        if (gl.isContextLost() && gl.getExtension('WEBGL_lose_context')) {
            gl.getExtension('WEBGL_lose_context').restoreContext();
        }

        // create a texture manager...
        this.textureManager = new _TextureManager2.default(this);
        this.textureGC = new _TextureGarbageCollector2.default(this);

        this.state.resetToDefault();

        this.rootRenderTarget = new _RenderTarget2.default(gl, this.width, this.height, null, this.resolution, true);
        this.rootRenderTarget.clearColor = this._backgroundColorRgba;

        this.bindRenderTarget(this.rootRenderTarget);

        this.emit('context', gl);

        // setup the width/height properties and gl viewport
        this.resize(this.width, this.height);
    };

    /**
     * Renders the object to its webGL view
     *
     * @param {PIXI.DisplayObject} displayObject - the object to be rendered
     * @param {PIXI.RenderTexture} renderTexture - The render texture to render to.
     * @param {boolean} [clear] - Should the canvas be cleared before the new render
     * @param {PIXI.Transform} [transform] - A transform to apply to the render texture before rendering.
     * @param {boolean} [skipUpdateTransform] - Should we skip the update transform pass?
     */


    WebGLRenderer.prototype.render = function render(displayObject, renderTexture, clear, transform, skipUpdateTransform) {
        // can be handy to know!
        this.renderingToScreen = !renderTexture;

        this.emit('prerender');

        // no point rendering if our context has been blown up!
        if (!this.gl || this.gl.isContextLost()) {
            return;
        }

        if (!renderTexture) {
            this._lastObjectRendered = displayObject;
        }

        if (!skipUpdateTransform) {
            // update the scene graph
            // const cacheParent = displayObject.parent;

            // displayObject.parent = this._tempDisplayObjectParent;
            displayObject._updateChildTransform();
            // displayObject._parent = cacheParent;
            // displayObject.hitArea = //TODO add a temp hit area
        }

        this.bindRenderTexture(renderTexture, transform);

        this.currentRenderer.start();

        if (clear !== undefined ? clear : this.clearBeforeRender) {
            this._activeRenderTarget.clear();
        }

        displayObject.renderWebGL(this);

        // apply transform..
        this.currentRenderer.flush();

        // this.setObjectRenderer(this.emptyRenderer);

        this.textureGC.update();

        this.emit('postrender');
    };

    /**
     * Changes the current renderer to the one given in parameter
     *
     * @param {PIXI.ObjectRenderer} objectRenderer - The object renderer to use.
     */


    WebGLRenderer.prototype.setObjectRenderer = function setObjectRenderer(objectRenderer) {
        if (this.currentRenderer === objectRenderer) {
            return;
        }

        this.currentRenderer.stop();
        this.currentRenderer = objectRenderer;
        this.currentRenderer.start();
    };

    /**
     * This shoudl be called if you wish to do some custom rendering
     * It will basically render anything that may be batched up such as sprites
     *
     */


    WebGLRenderer.prototype.flush = function flush() {
        this.setObjectRenderer(this.emptyRenderer);
    };

    /**
     * Resizes the webGL view to the specified width and height.
     *
     * @param {number} width - the new width of the webGL view
     * @param {number} height - the new height of the webGL view
     */


    WebGLRenderer.prototype.resize = function resize(width, height) {
        //  if(width * this.resolution === this.width && height * this.resolution === this.height)return;

        _SystemRenderer3.default.prototype.resize.call(this, width, height);

        this.rootRenderTarget.resize(width, height);

        if (this._activeRenderTarget === this.rootRenderTarget) {
            this.rootRenderTarget.activate();

            if (this._activeShader) {
                this._activeShader.uniforms.projectionMatrix = this.rootRenderTarget.projectionMatrix.toArray(true);
            }
        }
    };

    /**
     * Resizes the webGL view to the specified width and height.
     *
     * @param {number} blendMode - the desired blend mode
     */


    WebGLRenderer.prototype.setBlendMode = function setBlendMode(blendMode) {
        this.state.setBlendMode(blendMode);
    };

    /**
     * Erases the active render target and fills the drawing area with a colour
     *
     * @param {number} [clearColor] - The colour
     */


    WebGLRenderer.prototype.clear = function clear(clearColor) {
        this._activeRenderTarget.clear(clearColor);
    };

    /**
     * Sets the transform of the active render target to the given matrix
     *
     * @param {PIXI.Matrix} matrix - The transformation matrix
     */


    WebGLRenderer.prototype.setTransform = function setTransform(matrix) {
        this._activeRenderTarget.transform = matrix;
    };

    /**
     * Binds a render texture for rendering
     *
     * @param {PIXI.RenderTexture} renderTexture - The render texture to render
     * @param {PIXI.Transform} transform - The transform to be applied to the render texture
     * @return {PIXI.WebGLRenderer} Returns itself.
     */


    WebGLRenderer.prototype.bindRenderTexture = function bindRenderTexture(renderTexture, transform) {
        var renderTarget = void 0;

        if (renderTexture) {
            var baseTexture = renderTexture.baseTexture;
            var gl = this.gl;

            if (!baseTexture._glRenderTargets[this.CONTEXT_UID]) {
                this.textureManager.updateTexture(baseTexture);
                gl.bindTexture(gl.TEXTURE_2D, null);
            } else {
                // the texture needs to be unbound if its being rendererd too..
                this._activeTextureLocation = baseTexture._id;
                gl.activeTexture(gl.TEXTURE0 + baseTexture._id);
                gl.bindTexture(gl.TEXTURE_2D, null);
            }

            renderTarget = baseTexture._glRenderTargets[this.CONTEXT_UID];
            renderTarget.setFrame(renderTexture.frame);
        } else {
            renderTarget = this.rootRenderTarget;
        }

        renderTarget.transform = transform;
        this.bindRenderTarget(renderTarget);

        return this;
    };

    /**
     * Changes the current render target to the one given in parameter
     *
     * @param {PIXI.RenderTarget} renderTarget - the new render target
     * @return {PIXI.WebGLRenderer} Returns itself.
     */


    WebGLRenderer.prototype.bindRenderTarget = function bindRenderTarget(renderTarget) {
        if (renderTarget !== this._activeRenderTarget) {
            this._activeRenderTarget = renderTarget;
            renderTarget.activate();

            if (this._activeShader) {
                this._activeShader.uniforms.projectionMatrix = renderTarget.projectionMatrix.toArray(true);
            }

            this.stencilManager.setMaskStack(renderTarget.stencilMaskStack);
        }

        return this;
    };

    /**
     * Changes the current shader to the one given in parameter
     *
     * @param {PIXI.Shader} shader - the new shader
     * @return {PIXI.WebGLRenderer} Returns itself.
     */


    WebGLRenderer.prototype.bindShader = function bindShader(shader) {
        // TODO cache
        if (this._activeShader !== shader) {
            this._activeShader = shader;
            shader.bind();

            // automatically set the projection matrix
            shader.uniforms.projectionMatrix = this._activeRenderTarget.projectionMatrix.toArray(true);
        }

        return this;
    };

    /**
     * Binds the texture ... @mat
     *
     * @param {PIXI.Texture} texture - the new texture
     * @param {number} location - the texture location
     * @return {PIXI.WebGLRenderer} Returns itself.
     */


    WebGLRenderer.prototype.bindTexture = function bindTexture(texture) {
        var location = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

        texture = texture.baseTexture || texture;

        var gl = this.gl;

        // TODO test perf of cache?

        if (this._activeTextureLocation !== location) //
            {
                this._activeTextureLocation = location;
                gl.activeTexture(gl.TEXTURE0 + location);
            }

        // TODO - can we cache this texture too?
        this._activeTexture = texture;

        if (!texture._glTextures[this.CONTEXT_UID]) {
            // this will also bind the texture..
            this.textureManager.updateTexture(texture);
        } else {
            texture.touched = this.textureGC.count;
            // bind the current texture
            texture._glTextures[this.CONTEXT_UID].bind();
        }

        return this;
    };

    /**
     * Creates a new VAO from this renderer's context and state.
     *
     * @return {VertexArrayObject} The new VAO.
     */


    WebGLRenderer.prototype.createVao = function createVao() {
        return new _pixiGlCore2.default.VertexArrayObject(this.gl, this.state.attribState);
    };

    /**
     * Resets the WebGL state so you can render things however you fancy!
     *
     * @return {PIXI.WebGLRenderer} Returns itself.
     */


    WebGLRenderer.prototype.reset = function reset() {
        this.setObjectRenderer(this.emptyRenderer);

        this._activeShader = null;
        this._activeRenderTarget = this.rootRenderTarget;
        this._activeTextureLocation = 999;
        this._activeTexture = null;

        // bind the main frame buffer (the screen);
        this.rootRenderTarget.activate();

        this.state.resetToDefault();

        return this;
    };

    /**
     * Handles a lost webgl context
     *
     * @private
     * @param {WebGLContextEvent} event - The context lost event.
     */


    WebGLRenderer.prototype.handleContextLost = function handleContextLost(event) {
        event.preventDefault();
    };

    /**
     * Handles a restored webgl context
     *
     * @private
     */


    WebGLRenderer.prototype.handleContextRestored = function handleContextRestored() {
        this._initContext();
        this.textureManager.removeAll();
    };

    /**
     * Removes everything from the renderer (event listeners, spritebatch, etc...)
     *
     * @param {boolean} [removeView=false] - Removes the Canvas element from the DOM.
     *  See: https://github.com/pixijs/pixi.js/issues/2233
     */


    WebGLRenderer.prototype.destroy = function destroy(removeView) {
        this.destroyPlugins();

        // remove listeners
        this.view.removeEventListener('webglcontextlost', this.handleContextLost);
        this.view.removeEventListener('webglcontextrestored', this.handleContextRestored);

        this.textureManager.destroy();

        // call base destroy
        _SystemRenderer.prototype.destroy.call(this, removeView);

        this.uid = 0;

        // destroy the managers
        this.maskManager.destroy();
        this.stencilManager.destroy();
        this.filterManager.destroy();

        this.maskManager = null;
        this.filterManager = null;
        this.textureManager = null;
        this.currentRenderer = null;

        this.handleContextLost = null;
        this.handleContextRestored = null;

        this._contextOptions = null;
        this.gl.useProgram(null);

        if (this.gl.getExtension('WEBGL_lose_context')) {
            this.gl.getExtension('WEBGL_lose_context').loseContext();
        }

        this.gl = null;

        // this = null;
    };

    return WebGLRenderer;
}(_SystemRenderer3.default);

exports.default = WebGLRenderer;


_utils.pluginTarget.mixin(WebGLRenderer);

},{"../../const":30,"../../utils":101,"../SystemRenderer":59,"./TextureGarbageCollector":65,"./TextureManager":66,"./WebGLState":68,"./managers/FilterManager":73,"./managers/MaskManager":74,"./managers/StencilManager":75,"./utils/ObjectRenderer":77,"./utils/RenderTarget":79,"./utils/mapWebGLDrawModesToPixi":82,"./utils/validateContext":83,"pixi-gl-core":12}],68:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _mapWebGLBlendModesToPixi = require('./utils/mapWebGLBlendModesToPixi');

var _mapWebGLBlendModesToPixi2 = _interopRequireDefault(_mapWebGLBlendModesToPixi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BLEND = 0;
var DEPTH_TEST = 1;
var FRONT_FACE = 2;
var CULL_FACE = 3;
var BLEND_FUNC = 4;

/**
 * A WebGL state machines
 *
 * @memberof PIXI
 * @class
 */

var WebGLState = function () {
    /**
     * @param {WebGLRenderingContext} gl - The current WebGL rendering context
     */
    function WebGLState(gl) {
        _classCallCheck(this, WebGLState);

        /**
         * The current active state
         *
         * @member {Uint8Array}
         */
        this.activeState = new Uint8Array(16);

        /**
         * The default state
         *
         * @member {Uint8Array}
         */
        this.defaultState = new Uint8Array(16);

        // default blend mode..
        this.defaultState[0] = 1;

        /**
         * The current state index in the stack
         *
         * @member {number}
         * @private
         */
        this.stackIndex = 0;

        /**
         * The stack holding all the different states
         *
         * @member {Array<*>}
         * @private
         */
        this.stack = [];

        /**
         * The current WebGL rendering context
         *
         * @member {WebGLRenderingContext}
         */
        this.gl = gl;

        this.maxAttribs = gl.getParameter(gl.MAX_VERTEX_ATTRIBS);

        this.attribState = {
            tempAttribState: new Array(this.maxAttribs),
            attribState: new Array(this.maxAttribs)
        };

        this.blendModes = (0, _mapWebGLBlendModesToPixi2.default)(gl);

        // check we have vao..
        this.nativeVaoExtension = gl.getExtension('OES_vertex_array_object') || gl.getExtension('MOZ_OES_vertex_array_object') || gl.getExtension('WEBKIT_OES_vertex_array_object');
    }

    /**
     * Pushes a new active state
     */


    WebGLState.prototype.push = function push() {
        // next state..
        var state = this.stack[++this.stackIndex];

        if (!state) {
            state = this.stack[this.stackIndex] = new Uint8Array(16);
        }

        // copy state..
        // set active state so we can force overrides of gl state
        for (var i = 0; i < this.activeState.length; i++) {
            this.activeState[i] = state[i];
        }
    };

    /**
     * Pops a state out
     */


    WebGLState.prototype.pop = function pop() {
        var state = this.stack[--this.stackIndex];

        this.setState(state);
    };

    /**
     * Sets the current state
     *
     * @param {*} state - The state to set.
     */


    WebGLState.prototype.setState = function setState(state) {
        this.setBlend(state[BLEND]);
        this.setDepthTest(state[DEPTH_TEST]);
        this.setFrontFace(state[FRONT_FACE]);
        this.setCullFace(state[CULL_FACE]);
        this.setBlendMode(state[BLEND_FUNC]);
    };

    /**
     * Enables or disabled blending.
     *
     * @param {boolean} value - Turn on or off webgl blending.
     */


    WebGLState.prototype.setBlend = function setBlend(value) {
        value = value ? 1 : 0;

        if (this.activeState[BLEND] === value) {
            return;
        }

        this.activeState[BLEND] = value;
        this.gl[value ? 'enable' : 'disable'](this.gl.BLEND);
    };

    /**
     * Sets the blend mode.
     *
     * @param {number} value - The blend mode to set to.
     */


    WebGLState.prototype.setBlendMode = function setBlendMode(value) {
        if (value === this.activeState[BLEND_FUNC]) {
            return;
        }

        this.activeState[BLEND_FUNC] = value;

        this.gl.blendFunc(this.blendModes[value][0], this.blendModes[value][1]);
    };

    /**
     * Sets whether to enable or disable depth test.
     *
     * @param {boolean} value - Turn on or off webgl depth testing.
     */


    WebGLState.prototype.setDepthTest = function setDepthTest(value) {
        value = value ? 1 : 0;

        if (this.activeState[DEPTH_TEST] === value) {
            return;
        }

        this.activeState[DEPTH_TEST] = value;
        this.gl[value ? 'enable' : 'disable'](this.gl.DEPTH_TEST);
    };

    /**
     * Sets whether to enable or disable cull face.
     *
     * @param {boolean} value - Turn on or off webgl cull face.
     */


    WebGLState.prototype.setCullFace = function setCullFace(value) {
        value = value ? 1 : 0;

        if (this.activeState[CULL_FACE] === value) {
            return;
        }

        this.activeState[CULL_FACE] = value;
        this.gl[value ? 'enable' : 'disable'](this.gl.CULL_FACE);
    };

    /**
     * Sets the gl front face.
     *
     * @param {boolean} value - true is clockwise and false is counter-clockwise
     */


    WebGLState.prototype.setFrontFace = function setFrontFace(value) {
        value = value ? 1 : 0;

        if (this.activeState[FRONT_FACE] === value) {
            return;
        }

        this.activeState[FRONT_FACE] = value;
        this.gl.frontFace(this.gl[value ? 'CW' : 'CCW']);
    };

    /**
     * Disables all the vaos in use
     *
     */


    WebGLState.prototype.resetAttributes = function resetAttributes() {
        for (var i = 0; i < this.attribState.tempAttribState.length; i++) {
            this.attribState.tempAttribState[i] = 0;
        }

        for (var _i = 0; _i < this.attribState.attribState.length; _i++) {
            this.attribState.attribState[_i] = 0;
        }

        // im going to assume one is always active for performance reasons.
        for (var _i2 = 1; _i2 < this.maxAttribs; _i2++) {
            this.gl.disableVertexAttribArray(_i2);
        }
    };

    // used
    /**
     * Resets all the logic and disables the vaos
     */


    WebGLState.prototype.resetToDefault = function resetToDefault() {
        // unbind any VAO if they exist..
        if (this.nativeVaoExtension) {
            this.nativeVaoExtension.bindVertexArrayOES(null);
        }

        // reset all attributs..
        this.resetAttributes();

        // set active state so we can force overrides of gl state
        for (var i = 0; i < this.activeState.length; ++i) {
            this.activeState[i] = 32;
        }

        this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, false);

        this.setState(this.defaultState);
    };

    return WebGLState;
}();

exports.default = WebGLState;

},{"./utils/mapWebGLBlendModesToPixi":81}],69:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extractUniformsFromSrc = require('./extractUniformsFromSrc');

var _extractUniformsFromSrc2 = _interopRequireDefault(_extractUniformsFromSrc);

var _utils = require('../../../utils');

var _const = require('../../../const');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SOURCE_KEY_MAP = {};

// let math = require('../../../math');
/**
 * @class
 * @memberof PIXI
 * @extends PIXI.Shader
 */

var Filter = function () {
  /**
   * @param {string} [vertexSrc] - The source of the vertex shader.
   * @param {string} [fragmentSrc] - The source of the fragment shader.
   * @param {object} [uniforms] - Custom uniforms to use to augment the built-in ones.
   */
  function Filter(vertexSrc, fragmentSrc, uniforms) {
    _classCallCheck(this, Filter);

    /**
     * The vertex shader.
     *
     * @member {string}
     */
    this.vertexSrc = vertexSrc || Filter.defaultVertexSrc;

    /**
     * The fragment shader.
     *
     * @member {string}
     */
    this.fragmentSrc = fragmentSrc || Filter.defaultFragmentSrc;

    this.blendMode = _const.BLEND_MODES.NORMAL;

    // pull out the vertex and shader uniforms if they are not specified..
    // currently this does not extract structs only default types
    this.uniformData = uniforms || (0, _extractUniformsFromSrc2.default)(this.vertexSrc, this.fragmentSrc, 'projectionMatrix|uSampler');

    this.uniforms = {};

    for (var i in this.uniformData) {
      this.uniforms[i] = this.uniformData[i].value;
    }

    // this is where we store shader references..
    // TODO we could cache this!
    this.glShaders = {};

    // used for cacheing.. sure there is a better way!
    if (!SOURCE_KEY_MAP[this.vertexSrc + this.fragmentSrc]) {
      SOURCE_KEY_MAP[this.vertexSrc + this.fragmentSrc] = (0, _utils.uid)();
    }

    this.glShaderKey = SOURCE_KEY_MAP[this.vertexSrc + this.fragmentSrc];

    /**
     * The padding of the filter. Some filters require extra space to breath such as a blur.
     * Increasing this will add extra width and height to the bounds of the object that the
     * filter is applied to.
     *
     * @member {number}
     */
    this.padding = 4;

    /**
     * The resolution of the filter. Setting this to be lower will lower the quality but
     * increase the performance of the filter.
     *
     * @member {number}
     */
    this.resolution = 1;

    /**
     * If enabled is true the filter is applied, if false it will not.
     *
     * @member {boolean}
     */
    this.enabled = true;
  }

  /**
   * Applies the filter
   *
   * @param {PIXI.FilterManager} filterManager - The renderer to retrieve the filter from
   * @param {PIXI.RenderTarget} input - The input render target.
   * @param {PIXI.RenderTarget} output - The target to output to.
   * @param {boolean} clear - Should the output be cleared before rendering to it
   */


  Filter.prototype.apply = function apply(filterManager, input, output, clear) {
    // --- //
    //  this.uniforms.filterMatrix = filterManager.calculateSpriteMatrix(tempMatrix, window.panda );

    // do as you please!

    filterManager.applyFilter(this, input, output, clear);

    // or just do a regular render..
  };

  /**
   * The default vertex shader source
   *
   * @static
   * @constant
   */


  _createClass(Filter, null, [{
    key: 'defaultVertexSrc',
    get: function get() {
      return ['attribute vec2 aVertexPosition;', 'attribute vec2 aTextureCoord;', 'uniform mat3 projectionMatrix;', 'uniform mat3 filterMatrix;', 'varying vec2 vTextureCoord;', 'varying vec2 vFilterCoord;', 'void main(void){', '   gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);', '   vFilterCoord = ( filterMatrix * vec3( aTextureCoord, 1.0)  ).xy;', '   vTextureCoord = aTextureCoord ;', '}'].join('\n');
    }

    /**
     * The default fragment shader source
     *
     * @static
     * @constant
     */

  }, {
    key: 'defaultFragmentSrc',
    get: function get() {
      return ['varying vec2 vTextureCoord;', 'varying vec2 vFilterCoord;', 'uniform sampler2D uSampler;', 'uniform sampler2D filterSampler;', 'void main(void){', '   vec4 masky = texture2D(filterSampler, vFilterCoord);', '   vec4 sample = texture2D(uSampler, vTextureCoord);', '   vec4 color;', '   if(mod(vFilterCoord.x, 1.0) > 0.5)', '   {', '     color = vec4(1.0, 0.0, 0.0, 1.0);', '   }', '   else', '   {', '     color = vec4(0.0, 1.0, 0.0, 1.0);', '   }',
      // '   gl_FragColor = vec4(mod(vFilterCoord.x, 1.5), vFilterCoord.y,0.0,1.0);',
      '   gl_FragColor = mix(sample, masky, 0.5);', '   gl_FragColor *= sample.a;', '}'].join('\n');
    }
  }]);

  return Filter;
}();

exports.default = Filter;

},{"../../../const":30,"../../../utils":101,"./extractUniformsFromSrc":70}],70:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.default = extractUniformsFromSrc;

var _pixiGlCore = require('pixi-gl-core');

var _pixiGlCore2 = _interopRequireDefault(_pixiGlCore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultValue = _pixiGlCore2.default.shader.defaultValue;

function extractUniformsFromSrc(vertexSrc, fragmentSrc, mask) {
    var vertUniforms = extractUniformsFromString(vertexSrc, mask);
    var fragUniforms = extractUniformsFromString(fragmentSrc, mask);

    return Object.assign(vertUniforms, fragUniforms);
}

function extractUniformsFromString(string) {
    var maskRegex = new RegExp('^(projectionMatrix|uSampler|filterArea)$');

    var uniforms = {};
    var nameSplit = void 0;

    // clean the lines a little - remove extra spaces / teabs etc
    // then split along ';'
    var lines = string.replace(/\s+/g, ' ').split(/\s*;\s*/);

    // loop through..
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i].trim();

        if (line.indexOf('uniform') > -1) {
            var splitLine = line.split(' ');
            var type = splitLine[1];

            var name = splitLine[2];
            var size = 1;

            if (name.indexOf('[') > -1) {
                // array!
                nameSplit = name.split(/\[|]/);
                name = nameSplit[0];
                size *= Number(nameSplit[1]);
            }

            if (!name.match(maskRegex)) {
                uniforms[name] = {
                    value: defaultValue(type, size),
                    name: name,
                    type: type
                };
            }
        }
    }

    return uniforms;
}

},{"pixi-gl-core":12}],71:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.calculateScreenSpaceMatrix = calculateScreenSpaceMatrix;
exports.calculateNormalizedScreenSpaceMatrix = calculateNormalizedScreenSpaceMatrix;
exports.calculateSpriteMatrix = calculateSpriteMatrix;

var _math = require('../../../math');

/*
 * Calculates the mapped matrix
 * @param filterArea {Rectangle} The filter area
 * @param sprite {Sprite} the target sprite
 * @param outputMatrix {Matrix} @alvin
 */
// TODO playing around here.. this is temporary - (will end up in the shader)
// thia returns a matrix that will normalise map filter cords in the filter to screen space
function calculateScreenSpaceMatrix(outputMatrix, filterArea, textureSize) {
    // let worldTransform = sprite.worldTransform.copy(Matrix.TEMP_MATRIX),
    // let texture = {width:1136, height:700};//sprite._texture.baseTexture;

    // TODO unwrap?
    var mappedMatrix = outputMatrix.identity();

    mappedMatrix.translate(filterArea.x / textureSize.width, filterArea.y / textureSize.height);

    mappedMatrix.scale(textureSize.width, textureSize.height);

    return mappedMatrix;
}

function calculateNormalizedScreenSpaceMatrix(outputMatrix, filterArea, textureSize) {
    var mappedMatrix = outputMatrix.identity();

    mappedMatrix.translate(filterArea.x / textureSize.width, filterArea.y / textureSize.height);

    var translateScaleX = textureSize.width / filterArea.width;
    var translateScaleY = textureSize.height / filterArea.height;

    mappedMatrix.scale(translateScaleX, translateScaleY);

    return mappedMatrix;
}

// this will map the filter coord so that a texture can be used based on the transform of a sprite
function calculateSpriteMatrix(outputMatrix, filterArea, textureSize, sprite) {
    var worldTransform = sprite._worldTransform.copy(_math.Matrix.TEMP_MATRIX);
    var texture = sprite.texture.baseTexture;

    // TODO unwrap?
    var mappedMatrix = outputMatrix.identity();

    // scale..
    var ratio = textureSize.height / textureSize.width;

    mappedMatrix.translate(filterArea.x / textureSize.width, filterArea.y / textureSize.height);

    mappedMatrix.scale(1, ratio);

    var translateScaleX = textureSize.width / texture.width;
    var translateScaleY = textureSize.height / texture.height;

    worldTransform.tx /= texture.width * translateScaleX;

    // this...?  free beer for anyone who can explain why this makes sense!
    worldTransform.ty /= texture.width * translateScaleX;
    // worldTransform.ty /= texture.height * translateScaleY;

    worldTransform.invert();
    mappedMatrix.prepend(worldTransform);

    // apply inverse scale..
    mappedMatrix.scale(1, 1 / ratio);

    mappedMatrix.scale(translateScaleX, translateScaleY);

    mappedMatrix.translate(sprite.anchor.x, sprite.anchor.y);

    return mappedMatrix;
}

},{"../../../math":53}],72:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _Filter2 = require('../Filter');

var _Filter3 = _interopRequireDefault(_Filter2);

var _math = require('../../../../math');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// @see https://github.com/substack/brfs/issues/25
 // eslint-disable-line no-undef

/**
 * The SpriteMaskFilter class
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI
 */

var SpriteMaskFilter = function (_Filter) {
    _inherits(SpriteMaskFilter, _Filter);

    /**
     * @param {PIXI.Sprite} sprite - the target sprite
     */
    function SpriteMaskFilter(sprite) {
        _classCallCheck(this, SpriteMaskFilter);

        var maskMatrix = new _math.Matrix();

        var _this = _possibleConstructorReturn(this, _Filter.call(this, "#define GLSLIFY 1\nattribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\nuniform mat3 otherMatrix;\n\nvarying vec2 vMaskCoord;\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n\n    vTextureCoord = aTextureCoord;\n    vMaskCoord = ( otherMatrix * vec3( aTextureCoord, 1.0)  ).xy;\n}\n", "#define GLSLIFY 1\nvarying vec2 vMaskCoord;\nvarying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform float alpha;\nuniform sampler2D mask;\n\nvoid main(void)\n{\n    // check clip! this will stop the mask bleeding out from the edges\n    vec2 text = abs( vMaskCoord - 0.5 );\n    text = step(0.5, text);\n\n    float clip = 1.0 - max(text.y, text.x);\n    vec4 original = texture2D(uSampler, vTextureCoord);\n    vec4 masky = texture2D(mask, vMaskCoord);\n\n    original *= (masky.r * masky.a * alpha * clip);\n\n    gl_FragColor = original;\n}\n"));

        sprite.renderable = false;

        _this.maskSprite = sprite;
        _this.maskMatrix = maskMatrix;
        return _this;
    }

    /**
     * Applies the filter
     *
     * @param {PIXI.FilterManager} filterManager - The renderer to retrieve the filter from
     * @param {PIXI.RenderTarget} input - The input render target.
     * @param {PIXI.RenderTarget} output - The target to output to.
     */


    SpriteMaskFilter.prototype.apply = function apply(filterManager, input, output) {
        var maskSprite = this.maskSprite;

        this.uniforms.mask = maskSprite._texture;
        this.uniforms.otherMatrix = filterManager.calculateSpriteMatrix(this.maskMatrix, maskSprite);
        this.uniforms.alpha = maskSprite.worldAlpha;

        filterManager.applyFilter(this, input, output);
    };

    return SpriteMaskFilter;
}(_Filter3.default);

exports.default = SpriteMaskFilter;

},{"../../../../math":53,"../Filter":69}],73:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _WebGLManager2 = require('./WebGLManager');

var _WebGLManager3 = _interopRequireDefault(_WebGLManager2);

var _RenderTarget = require('../utils/RenderTarget');

var _RenderTarget2 = _interopRequireDefault(_RenderTarget);

var _Quad = require('../utils/Quad');

var _Quad2 = _interopRequireDefault(_Quad);

var _math = require('../../../math');

var _Shader = require('../../../Shader');

var _Shader2 = _interopRequireDefault(_Shader);

var _filterTransforms = require('../filters/filterTransforms');

var filterTransforms = _interopRequireWildcard(_filterTransforms);

var _bitTwiddle = require('bit-twiddle');

var _bitTwiddle2 = _interopRequireDefault(_bitTwiddle);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @ignore
 * @class
 */
var FilterState =
/**
 *
 */
function FilterState() {
    _classCallCheck(this, FilterState);

    this.renderTarget = null;
    this.sourceFrame = new _math.Rectangle();
    this.destinationFrame = new _math.Rectangle();
    this.filters = [];
    this.target = null;
    this.resolution = 1;
};

/**
 * @class
 * @memberof PIXI
 * @extends PIXI.WebGLManager
 */


var FilterManager = function (_WebGLManager) {
    _inherits(FilterManager, _WebGLManager);

    /**
     * @param {PIXI.WebGLRenderer} renderer - The renderer this manager works for.
     */
    function FilterManager(renderer) {
        _classCallCheck(this, FilterManager);

        var _this = _possibleConstructorReturn(this, _WebGLManager.call(this, renderer));

        _this.gl = _this.renderer.gl;
        // know about sprites!
        _this.quad = new _Quad2.default(_this.gl, renderer.state.attribState);

        _this.shaderCache = {};
        // todo add default!
        _this.pool = {};

        _this.filterData = null;
        return _this;
    }

    /**
     * Adds a new filter to the manager.
     *
     * @param {PIXI.DisplayObject} target - The target of the filter to render.
     * @param {PIXI.Filter[]} filters - The filters to apply.
     */


    FilterManager.prototype.pushFilter = function pushFilter(target, filters) {
        var renderer = this.renderer;

        var filterData = this.filterData;

        if (!filterData) {
            filterData = this.renderer._activeRenderTarget.filterStack;

            // add new stack
            var filterState = new FilterState();

            filterState.sourceFrame = filterState.destinationFrame = this.renderer._activeRenderTarget.size;
            filterState.renderTarget = renderer._activeRenderTarget;

            this.renderer._activeRenderTarget.filterData = filterData = {
                index: 0,
                stack: [filterState]
            };

            this.filterData = filterData;
        }

        // get the current filter state..
        var currentState = filterData.stack[++filterData.index];

        if (!currentState) {
            currentState = filterData.stack[filterData.index] = new FilterState();
        }

        // for now we go off the filter of the first resolution..
        var resolution = filters[0].resolution;
        var padding = filters[0].padding | 0;
        var targetBounds = target.filterArea || target._getBounds();
        var sourceFrame = currentState.sourceFrame;
        var destinationFrame = currentState.destinationFrame;

        sourceFrame.x = (targetBounds.x * resolution | 0) / resolution;
        sourceFrame.y = (targetBounds.y * resolution | 0) / resolution;
        sourceFrame.width = (targetBounds.width * resolution | 0) / resolution;
        sourceFrame.height = (targetBounds.height * resolution | 0) / resolution;

        // Panda 2 hires mode fix
        sourceFrame.x *= game.scale;
        sourceFrame.y *= game.scale;
        sourceFrame.width *= game.scale;
        sourceFrame.height *= game.scale;

        if (filterData.stack[0].renderTarget.transform) {//

            // TODO we should fit the rect around the transform..
        } else {
            sourceFrame.fit(filterData.stack[0].destinationFrame);
        }

        // lets pplay the padding After we fit the element to the screen.
        // this should stop the strange side effects that can occour when cropping to the edges
        sourceFrame.pad(padding);

        destinationFrame.width = sourceFrame.width;
        destinationFrame.height = sourceFrame.height;

        // lets play the padding after we fit the element to the screen.
        // this should stop the strange side effects that can occour when cropping to the edges

        var renderTarget = this.getPotRenderTarget(renderer.gl, sourceFrame.width, sourceFrame.height, resolution);

        currentState.target = target;
        currentState.filters = filters;
        currentState.resolution = resolution;
        currentState.renderTarget = renderTarget;

        // bind the render taget to draw the shape in the top corner..

        renderTarget.setFrame(destinationFrame, sourceFrame);
        // bind the render target
        renderer.bindRenderTarget(renderTarget);

        // clear the renderTarget
        renderer.clear(); // [0.5,0.5,0.5, 1.0]);
    };

    /**
     * Pops off the filter and applies it.
     *
     */


    FilterManager.prototype.popFilter = function popFilter() {
        var filterData = this.filterData;

        var lastState = filterData.stack[filterData.index - 1];
        var currentState = filterData.stack[filterData.index];

        this.quad.map(currentState.renderTarget.size, currentState.sourceFrame).upload();

        var filters = currentState.filters;

        if (filters.length === 1) {
            filters[0].apply(this, currentState.renderTarget, lastState.renderTarget, false);
            this.freePotRenderTarget(currentState.renderTarget);
        } else {
            var flip = currentState.renderTarget;
            var flop = this.getPotRenderTarget(this.renderer.gl, currentState.sourceFrame.width, currentState.sourceFrame.height, currentState.resolution);

            flop.setFrame(currentState.destinationFrame, currentState.sourceFrame);

            var i = 0;

            for (i = 0; i < filters.length - 1; ++i) {
                filters[i].apply(this, flip, flop, true);

                var t = flip;

                flip = flop;
                flop = t;
            }

            filters[i].apply(this, flip, lastState.renderTarget, false);

            this.freePotRenderTarget(flip);
            this.freePotRenderTarget(flop);
        }

        filterData.index--;

        if (filterData.index === 0) {
            this.filterData = null;
        }
    };

    /**
     * Draws a filter.
     *
     * @param {PIXI.Filter} filter - The filter to draw.
     * @param {PIXI.RenderTarget} input - The input render target.
     * @param {PIXI.RenderTarget} output - The target to output to.
     * @param {boolean} clear - Should the output be cleared before rendering to it
     */


    FilterManager.prototype.applyFilter = function applyFilter(filter, input, output, clear) {
        var renderer = this.renderer;
        var shader = filter.glShaders[renderer.CONTEXT_UID];

        // cacheing..
        if (!shader) {
            if (filter.glShaderKey) {
                shader = this.shaderCache[filter.glShaderKey];

                if (!shader) {
                    shader = new _Shader2.default(this.gl, filter.vertexSrc, filter.fragmentSrc);

                    filter.glShaders[renderer.CONTEXT_UID] = this.shaderCache[filter.glShaderKey] = shader;
                }
            } else {
                shader = filter.glShaders[renderer.CONTEXT_UID] = new _Shader2.default(this.gl, filter.vertexSrc, filter.fragmentSrc);
            }

            // TODO - this only needs to be done once?
            this.quad.initVao(shader);
        }

        renderer.bindRenderTarget(output);

        if (clear) {
            var gl = renderer.gl;

            gl.disable(gl.SCISSOR_TEST);
            renderer.clear(); // [1, 1, 1, 1]);
            gl.enable(gl.SCISSOR_TEST);
        }

        // in case the render target is being masked using a scissor rect
        if (output === renderer.maskManager.scissorRenderTarget) {
            renderer.maskManager.pushScissorMask(null, renderer.maskManager.scissorData);
        }

        renderer.bindShader(shader);

        // this syncs the pixi filters  uniforms with glsl uniforms
        this.syncUniforms(shader, filter);

        // bind the input texture..
        input.texture.bind(0);
        // when you manually bind a texture, please switch active texture location to it
        renderer._activeTextureLocation = 0;

        renderer.state.setBlendMode(filter.blendMode);

        this.quad.draw();
    };

    /**
     * Uploads the uniforms of the filter.
     *
     * @param {GLShader} shader - The underlying gl shader.
     * @param {PIXI.Filter} filter - The filter we are synchronizing.
     */


    FilterManager.prototype.syncUniforms = function syncUniforms(shader, filter) {
        var uniformData = filter.uniformData;
        var uniforms = filter.uniforms;

        // 0 is reserverd for the pixi texture so we start at 1!
        var textureCount = 1;
        var currentState = void 0;

        if (shader.uniforms.data.filterArea) {
            currentState = this.filterData.stack[this.filterData.index];
            var filterArea = shader.uniforms.filterArea;

            filterArea[0] = currentState.renderTarget.size.width;
            filterArea[1] = currentState.renderTarget.size.height;
            filterArea[2] = currentState.sourceFrame.x;
            filterArea[3] = currentState.sourceFrame.y;

            shader.uniforms.filterArea = filterArea;
        }

        // use this to clamp displaced texture coords so they belong to filterArea
        // see displacementFilter fragment shader for an example
        if (shader.uniforms.data.filterClamp) {
            currentState = this.filterData.stack[this.filterData.index];

            var filterClamp = shader.uniforms.filterClamp;

            filterClamp[0] = 0;
            filterClamp[1] = 0;
            filterClamp[2] = (currentState.sourceFrame.width - 1) / currentState.renderTarget.size.width;
            filterClamp[3] = (currentState.sourceFrame.height - 1) / currentState.renderTarget.size.height;

            shader.uniforms.filterClamp = filterClamp;
        }

        // TODO Cacheing layer..
        for (var i in uniformData) {
            if (uniformData[i].type === 'sampler2D') {
                shader.uniforms[i] = textureCount;

                if (uniforms[i].baseTexture) {
                    this.renderer.bindTexture(uniforms[i].baseTexture, textureCount);
                } else {
                    // this is helpful as renderTargets can also be set.
                    // Although thinking about it, we could probably
                    // make the filter texture cache return a RenderTexture
                    // rather than a renderTarget
                    var gl = this.renderer.gl;

                    this.renderer._activeTextureLocation = gl.TEXTURE0 + textureCount;

                    gl.activeTexture(gl.TEXTURE0 + textureCount);
                    uniforms[i].texture.bind();
                }

                textureCount++;
            } else if (uniformData[i].type === 'mat3') {
                // check if its pixi matrix..
                if (uniforms[i].a !== undefined) {
                    shader.uniforms[i] = uniforms[i].toArray(true);
                } else {
                    shader.uniforms[i] = uniforms[i];
                }
            } else if (uniformData[i].type === 'vec2') {
                // check if its a point..
                if (uniforms[i].x !== undefined) {
                    var val = shader.uniforms[i] || new Float32Array(2);

                    val[0] = uniforms[i].x;
                    val[1] = uniforms[i].y;
                    shader.uniforms[i] = val;
                } else {
                    shader.uniforms[i] = uniforms[i];
                }
            } else if (uniformData[i].type === 'float') {
                if (shader.uniforms.data[i].value !== uniformData[i]) {
                    shader.uniforms[i] = uniforms[i];
                }
            } else {
                shader.uniforms[i] = uniforms[i];
            }
        }
    };

    /**
     * Gets a render target from the pool, or creates a new one.
     *
     * @param {boolean} clear - Should we clear the render texture when we get it?
     * @param {number} resolution - The resolution of the target.
     * @return {PIXI.RenderTarget} The new render target
     */


    FilterManager.prototype.getRenderTarget = function getRenderTarget(clear, resolution) {
        var currentState = this.filterData.stack[this.filterData.index];
        var renderTarget = this.getPotRenderTarget(this.renderer.gl, currentState.sourceFrame.width, currentState.sourceFrame.height, resolution || currentState.resolution);

        renderTarget.setFrame(currentState.destinationFrame, currentState.sourceFrame);

        return renderTarget;
    };

    /**
     * Returns a render target to the pool.
     *
     * @param {PIXI.RenderTarget} renderTarget - The render target to return.
     */


    FilterManager.prototype.returnRenderTarget = function returnRenderTarget(renderTarget) {
        this.freePotRenderTarget(renderTarget);
    };

    /**
     * Calculates the mapped matrix.
     *
     * TODO playing around here.. this is temporary - (will end up in the shader)
     * this returns a matrix that will normalise map filter cords in the filter to screen space
     *
     * @param {PIXI.Matrix} outputMatrix - the matrix to output to.
     * @return {PIXI.Matrix} The mapped matrix.
     */


    FilterManager.prototype.calculateScreenSpaceMatrix = function calculateScreenSpaceMatrix(outputMatrix) {
        var currentState = this.filterData.stack[this.filterData.index];

        return filterTransforms.calculateScreenSpaceMatrix(outputMatrix, currentState.sourceFrame, currentState.renderTarget.size);
    };

    /**
     * Multiply vTextureCoord to this matrix to achieve (0,0,1,1) for filterArea
     *
     * @param {PIXI.Matrix} outputMatrix - The matrix to output to.
     * @return {PIXI.Matrix} The mapped matrix.
     */


    FilterManager.prototype.calculateNormalizedScreenSpaceMatrix = function calculateNormalizedScreenSpaceMatrix(outputMatrix) {
        var currentState = this.filterData.stack[this.filterData.index];

        return filterTransforms.calculateNormalizedScreenSpaceMatrix(outputMatrix, currentState.sourceFrame, currentState.renderTarget.size, currentState.destinationFrame);
    };

    /**
     * This will map the filter coord so that a texture can be used based on the transform of a sprite
     *
     * @param {PIXI.Matrix} outputMatrix - The matrix to output to.
     * @param {PIXI.Sprite} sprite - The sprite to map to.
     * @return {PIXI.Matrix} The mapped matrix.
     */


    FilterManager.prototype.calculateSpriteMatrix = function calculateSpriteMatrix(outputMatrix, sprite) {
        var currentState = this.filterData.stack[this.filterData.index];

        return filterTransforms.calculateSpriteMatrix(outputMatrix, currentState.sourceFrame, currentState.renderTarget.size, sprite);
    };

    /**
     * Destroys this Filter Manager.
     *
     */


    FilterManager.prototype.destroy = function destroy() {
        this.shaderCache = [];
        this.emptyPool();
    };

    /**
     * Gets a Power-of-Two render texture.
     *
     * TODO move to a seperate class could be on renderer?
     * also - could cause issue with multiple contexts?
     *
     * @private
     * @param {WebGLRenderingContext} gl - The webgl rendering context
     * @param {number} minWidth - The minimum width of the render target.
     * @param {number} minHeight - The minimum height of the render target.
     * @param {number} resolution - The resolution of the render target.
     * @return {PIXI.RenderTarget} The new render target.
     */


    FilterManager.prototype.getPotRenderTarget = function getPotRenderTarget(gl, minWidth, minHeight, resolution) {
        // TODO you coud return a bigger texture if there is not one in the pool?
        minWidth = _bitTwiddle2.default.nextPow2(minWidth * resolution);
        minHeight = _bitTwiddle2.default.nextPow2(minHeight * resolution);

        var key = (minWidth & 0xFFFF) << 16 | minHeight & 0xFFFF;

        if (!this.pool[key]) {
            this.pool[key] = [];
        }

        var renderTarget = this.pool[key].pop() || new _RenderTarget2.default(gl, minWidth, minHeight, null, 1);

        // manually tweak the resolution...
        // this will not modify the size of the frame buffer, just its resolution.
        renderTarget.resolution = resolution;
        renderTarget.defaultFrame.width = renderTarget.size.width = minWidth / resolution;
        renderTarget.defaultFrame.height = renderTarget.size.height = minHeight / resolution;

        return renderTarget;
    };

    /**
     * Empties the texture pool.
     *
     */


    FilterManager.prototype.emptyPool = function emptyPool() {
        for (var i in this.pool) {
            var textures = this.pool[i];

            if (textures) {
                for (var j = 0; j < textures.length; j++) {
                    textures[j].destroy(true);
                }
            }
        }

        this.pool = {};
    };

    /**
     * Frees a render target back into the pool.
     *
     * @param {PIXI.RenderTarget} renderTarget - The renderTarget to free
     */


    FilterManager.prototype.freePotRenderTarget = function freePotRenderTarget(renderTarget) {
        var minWidth = renderTarget.size.width * renderTarget.resolution;
        var minHeight = renderTarget.size.height * renderTarget.resolution;
        var key = (minWidth & 0xFFFF) << 16 | minHeight & 0xFFFF;

        this.pool[key].push(renderTarget);
    };

    return FilterManager;
}(_WebGLManager3.default);

exports.default = FilterManager;

},{"../../../Shader":29,"../../../math":53,"../filters/filterTransforms":71,"../utils/Quad":78,"../utils/RenderTarget":79,"./WebGLManager":76,"bit-twiddle":1}],74:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _WebGLManager2 = require('./WebGLManager');

var _WebGLManager3 = _interopRequireDefault(_WebGLManager2);

var _SpriteMaskFilter = require('../filters/spriteMask/SpriteMaskFilter');

var _SpriteMaskFilter2 = _interopRequireDefault(_SpriteMaskFilter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @class
 * @extends PIXI.WebGLManager
 * @memberof PIXI
 */
var MaskManager = function (_WebGLManager) {
    _inherits(MaskManager, _WebGLManager);

    /**
     * @param {PIXI.WebGLRenderer} renderer - The renderer this manager works for.
     */
    function MaskManager(renderer) {
        _classCallCheck(this, MaskManager);

        // TODO - we don't need both!
        var _this = _possibleConstructorReturn(this, _WebGLManager.call(this, renderer));

        _this.scissor = false;
        _this.scissorData = null;
        _this.scissorRenderTarget = null;

        _this.enableScissor = true;

        _this.alphaMaskPool = [];
        _this.alphaMaskIndex = 0;
        return _this;
    }

    /**
     * Applies the Mask and adds it to the current filter stack.
     *
     * @param {PIXI.DisplayObject} target - Display Object to push the mask to
     * @param {PIXI.Sprite|PIXI.Graphics} maskData - The masking data.
     */


    MaskManager.prototype.pushMask = function pushMask(target, maskData) {
        if (maskData.texture) {
            this.pushSpriteMask(target, maskData);
        } else if (this.enableScissor && !this.scissor && !this.renderer.stencilManager.stencilMaskStack.length && maskData.shapes.length === 1 && maskData.shapes[0].shape instanceof game.Rectangle && !maskData.shapes[0].lineWidth) {
            var matrix = maskData._worldTransform;

            var rot = Math.atan2(matrix.b, matrix.a);

            // use the nearest degree!
            rot = Math.round(rot * (180 / Math.PI));

            if (rot % 90) {
                this.pushStencilMask(maskData);
            } else {
                this.pushScissorMask(target, maskData);
            }
        } else {
            this.pushStencilMask(maskData);
        }
    };

    /**
     * Removes the last mask from the mask stack and doesn't return it.
     *
     * @param {PIXI.DisplayObject} target - Display Object to pop the mask from
     * @param {PIXI.Sprite|PIXI.Graphics} maskData - The masking data.
     */


    MaskManager.prototype.popMask = function popMask(target, maskData) {
        if (maskData.texture) {
            this.popSpriteMask(target, maskData);
        } else if (this.enableScissor && !this.renderer.stencilManager.stencilMaskStack.length) {
            this.popScissorMask(target, maskData);
        } else {
            this.popStencilMask(target, maskData);
        }
    };

    /**
     * Applies the Mask and adds it to the current filter stack.
     *
     * @param {PIXI.RenderTarget} target - Display Object to push the sprite mask to
     * @param {PIXI.Sprite} maskData - Sprite to be used as the mask
     */


    MaskManager.prototype.pushSpriteMask = function pushSpriteMask(target, maskData) {
        var alphaMaskFilter = this.alphaMaskPool[this.alphaMaskIndex];

        if (!alphaMaskFilter) {
            alphaMaskFilter = this.alphaMaskPool[this.alphaMaskIndex] = [new _SpriteMaskFilter2.default(maskData)];
        }

        alphaMaskFilter[0].resolution = this.renderer.resolution;
        alphaMaskFilter[0].maskSprite = maskData;

        // TODO - may cause issues!
        target.filterArea = maskData._getBounds(true);

        this.renderer.filterManager.pushFilter(target, alphaMaskFilter);

        this.alphaMaskIndex++;
    };

    /**
     * Removes the last filter from the filter stack and doesn't return it.
     *
     */


    MaskManager.prototype.popSpriteMask = function popSpriteMask() {
        this.renderer.filterManager.popFilter();
        this.alphaMaskIndex--;
    };

    /**
     * Applies the Mask and adds it to the current filter stack.
     *
     * @param {PIXI.Sprite|PIXI.Graphics} maskData - The masking data.
     */


    MaskManager.prototype.pushStencilMask = function pushStencilMask(maskData) {
        this.renderer.currentRenderer.stop();
        this.renderer.stencilManager.pushStencil(maskData);
    };

    /**
     * Removes the last filter from the filter stack and doesn't return it.
     *
     */


    MaskManager.prototype.popStencilMask = function popStencilMask() {
        this.renderer.currentRenderer.stop();
        this.renderer.stencilManager.popStencil();
    };

    /**
     *
     * @param {PIXI.DisplayObject} target - Display Object to push the mask to
     * @param {PIXI.Graphics} maskData - The masking data.
     */


    MaskManager.prototype.pushScissorMask = function pushScissorMask(target, maskData) {
        maskData.renderable = true;

        var renderTarget = this.renderer._activeRenderTarget;

        var bounds = maskData._getBounds();

        bounds.fit(renderTarget.size);
        maskData.renderable = false;

        this.renderer.gl.enable(this.renderer.gl.SCISSOR_TEST);

        var resolution = this.renderer.resolution;

        this.renderer.gl.scissor(bounds.x * resolution, (renderTarget.root ? renderTarget.size.height - bounds.y - bounds.height : bounds.y) * resolution, bounds.width * resolution, bounds.height * resolution);

        this.scissorRenderTarget = renderTarget;
        this.scissorData = maskData;
        this.scissor = true;
    };

    /**
     *
     *
     */


    MaskManager.prototype.popScissorMask = function popScissorMask() {
        this.scissorRenderTarget = null;
        this.scissorData = null;
        this.scissor = false;

        // must be scissor!
        var gl = this.renderer.gl;

        gl.disable(gl.SCISSOR_TEST);
    };

    return MaskManager;
}(_WebGLManager3.default);

exports.default = MaskManager;

},{"../filters/spriteMask/SpriteMaskFilter":72,"./WebGLManager":76}],75:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _WebGLManager2 = require('./WebGLManager');

var _WebGLManager3 = _interopRequireDefault(_WebGLManager2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @class
 * @extends PIXI.WebGLManager
 * @memberof PIXI
 */
var StencilManager = function (_WebGLManager) {
    _inherits(StencilManager, _WebGLManager);

    /**
     * @param {PIXI.WebGLRenderer} renderer - The renderer this manager works for.
     */
    function StencilManager(renderer) {
        _classCallCheck(this, StencilManager);

        var _this = _possibleConstructorReturn(this, _WebGLManager.call(this, renderer));

        _this.stencilMaskStack = null;
        return _this;
    }

    /**
     * Changes the mask stack that is used by this manager.
     *
     * @param {PIXI.Graphics[]} stencilMaskStack - The mask stack
     */


    StencilManager.prototype.setMaskStack = function setMaskStack(stencilMaskStack) {
        this.stencilMaskStack = stencilMaskStack;

        var gl = this.renderer.gl;

        if (stencilMaskStack.length === 0) {
            gl.disable(gl.STENCIL_TEST);
        } else {
            gl.enable(gl.STENCIL_TEST);
        }
    };

    /**
     * Applies the Mask and adds it to the current filter stack. @alvin
     *
     * @param {PIXI.Graphics} graphics - The mask
     */


    StencilManager.prototype.pushStencil = function pushStencil(graphics) {
        this.renderer.setObjectRenderer(this.renderer.plugins.graphics);

        this.renderer._activeRenderTarget.attachStencilBuffer();

        var gl = this.renderer.gl;
        var sms = this.stencilMaskStack;

        if (sms.length === 0) {
            gl.enable(gl.STENCIL_TEST);
            gl.clear(gl.STENCIL_BUFFER_BIT);
            gl.stencilFunc(gl.ALWAYS, 1, 1);
        }

        sms.push(graphics);

        gl.colorMask(false, false, false, false);
        gl.stencilOp(gl.KEEP, gl.KEEP, gl.INCR);

        this.renderer.plugins.graphics.render(graphics);

        gl.colorMask(true, true, true, true);
        gl.stencilFunc(gl.NOTEQUAL, 0, sms.length);
        gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
    };

    /**
     * TODO @alvin
     */


    StencilManager.prototype.popStencil = function popStencil() {
        this.renderer.setObjectRenderer(this.renderer.plugins.graphics);

        var gl = this.renderer.gl;
        var sms = this.stencilMaskStack;

        var graphics = sms.pop();

        if (sms.length === 0) {
            // the stack is empty!
            gl.disable(gl.STENCIL_TEST);
        } else {
            gl.colorMask(false, false, false, false);
            gl.stencilOp(gl.KEEP, gl.KEEP, gl.DECR);

            this.renderer.plugins.graphics.render(graphics);

            gl.colorMask(true, true, true, true);
            gl.stencilFunc(gl.NOTEQUAL, 0, sms.length);
            gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
        }
    };

    /**
     * Destroys the mask stack.
     *
     */


    StencilManager.prototype.destroy = function destroy() {
        _WebGLManager3.default.prototype.destroy.call(this);

        this.stencilMaskStack.stencilStack = null;
    };

    return StencilManager;
}(_WebGLManager3.default);

exports.default = StencilManager;

},{"./WebGLManager":76}],76:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @class
 * @memberof PIXI
 */
var WebGLManager = function () {
  /**
   * @param {PIXI.WebGLRenderer} renderer - The renderer this manager works for.
   */
  function WebGLManager(renderer) {
    _classCallCheck(this, WebGLManager);

    /**
     * The renderer this manager works for.
     *
     * @member {PIXI.WebGLRenderer}
     */
    this.renderer = renderer;

    this.renderer.on('context', this.onContextChange, this);
  }

  /**
   * Generic method called when there is a WebGL context change.
   *
   */


  WebGLManager.prototype.onContextChange = function onContextChange() {}
  // do some codes init!


  /**
   * Generic destroy methods to be overridden by the subclass
   *
   */
  ;

  WebGLManager.prototype.destroy = function destroy() {
    this.renderer.off('context', this.onContextChange, this);

    this.renderer = null;
  };

  return WebGLManager;
}();

exports.default = WebGLManager;

},{}],77:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _WebGLManager2 = require('../managers/WebGLManager');

var _WebGLManager3 = _interopRequireDefault(_WebGLManager2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Base for a common object renderer that can be used as a system renderer plugin.
 *
 * @class
 * @extends PIXI.WebGLManager
 * @memberof PIXI
 */
var ObjectRenderer = function (_WebGLManager) {
  _inherits(ObjectRenderer, _WebGLManager);

  function ObjectRenderer() {
    _classCallCheck(this, ObjectRenderer);

    return _possibleConstructorReturn(this, _WebGLManager.apply(this, arguments));
  }

  /**
   * Starts the renderer and sets the shader
   *
   */
  ObjectRenderer.prototype.start = function start() {}
  // set the shader..


  /**
   * Stops the renderer
   *
   */
  ;

  ObjectRenderer.prototype.stop = function stop() {
    this.flush();
  };

  /**
   * Stub method for rendering content and emptying the current batch.
   *
   */


  ObjectRenderer.prototype.flush = function flush() {}
  // flush!


  /**
   * Renders an object
   *
   * @param {PIXI.DisplayObject} object - The object to render.
   */
  ;

  ObjectRenderer.prototype.render = function render(object) // eslint-disable-line no-unused-vars
  {
    // render the object
  };

  return ObjectRenderer;
}(_WebGLManager3.default);

exports.default = ObjectRenderer;

},{"../managers/WebGLManager":76}],78:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _pixiGlCore = require('pixi-gl-core');

var _pixiGlCore2 = _interopRequireDefault(_pixiGlCore);

var _createIndicesForQuads = require('../../../utils/createIndicesForQuads');

var _createIndicesForQuads2 = _interopRequireDefault(_createIndicesForQuads);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Helper class to create a quad
 *
 * @class
 * @memberof PIXI
 */
var Quad = function () {
  /**
   * @param {WebGLRenderingContext} gl - The gl context for this quad to use.
   * @param {object} state - TODO: Description
   */
  function Quad(gl, state) {
    _classCallCheck(this, Quad);

    /*
     * the current WebGL drawing context
     *
     * @member {WebGLRenderingContext}
     */
    this.gl = gl;

    /**
     * An array of vertices
     *
     * @member {Float32Array}
     */
    this.vertices = new Float32Array([-1, -1, 1, -1, 1, 1, -1, 1]);

    /**
     * The Uvs of the quad
     *
     * @member {Float32Array}
     */
    this.uvs = new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]);

    this.interleaved = new Float32Array(8 * 2);

    for (var i = 0; i < 4; i++) {
      this.interleaved[i * 4] = this.vertices[i * 2];
      this.interleaved[i * 4 + 1] = this.vertices[i * 2 + 1];
      this.interleaved[i * 4 + 2] = this.uvs[i * 2];
      this.interleaved[i * 4 + 3] = this.uvs[i * 2 + 1];
    }

    /*
     * @member {Uint16Array} An array containing the indices of the vertices
     */
    this.indices = (0, _createIndicesForQuads2.default)(1);

    /*
     * @member {glCore.GLBuffer} The vertex buffer
     */
    this.vertexBuffer = _pixiGlCore2.default.GLBuffer.createVertexBuffer(gl, this.interleaved, gl.STATIC_DRAW);

    /*
     * @member {glCore.GLBuffer} The index buffer
     */
    this.indexBuffer = _pixiGlCore2.default.GLBuffer.createIndexBuffer(gl, this.indices, gl.STATIC_DRAW);

    /*
     * @member {glCore.VertexArrayObject} The index buffer
     */
    this.vao = new _pixiGlCore2.default.VertexArrayObject(gl, state);
  }

  /**
   * Initialises the vaos and uses the shader.
   *
   * @param {PIXI.Shader} shader - the shader to use
   */


  Quad.prototype.initVao = function initVao(shader) {
    this.vao.clear().addIndex(this.indexBuffer).addAttribute(this.vertexBuffer, shader.attributes.aVertexPosition, this.gl.FLOAT, false, 4 * 4, 0).addAttribute(this.vertexBuffer, shader.attributes.aTextureCoord, this.gl.FLOAT, false, 4 * 4, 2 * 4);
  };

  /**
   * Maps two Rectangle to the quad.
   *
   * @param {PIXI.Rectangle} targetTextureFrame - the first rectangle
   * @param {PIXI.Rectangle} destinationFrame - the second rectangle
   * @return {PIXI.Quad} Returns itself.
   */


  Quad.prototype.map = function map(targetTextureFrame, destinationFrame) {
    var x = 0; // destinationFrame.x / targetTextureFrame.width;
    var y = 0; // destinationFrame.y / targetTextureFrame.height;

    this.uvs[0] = x;
    this.uvs[1] = y;

    this.uvs[2] = x + destinationFrame.width / targetTextureFrame.width;
    this.uvs[3] = y;

    this.uvs[4] = x + destinationFrame.width / targetTextureFrame.width;
    this.uvs[5] = y + destinationFrame.height / targetTextureFrame.height;

    this.uvs[6] = x;
    this.uvs[7] = y + destinationFrame.height / targetTextureFrame.height;

    x = destinationFrame.x;
    y = destinationFrame.y;

    this.vertices[0] = x;
    this.vertices[1] = y;

    this.vertices[2] = x + destinationFrame.width;
    this.vertices[3] = y;

    this.vertices[4] = x + destinationFrame.width;
    this.vertices[5] = y + destinationFrame.height;

    this.vertices[6] = x;
    this.vertices[7] = y + destinationFrame.height;

    return this;
  };

  /**
   * Draws the quad
   *
   * @return {PIXI.Quad} Returns itself.
   */


  Quad.prototype.draw = function draw() {
    this.vao.bind().draw(this.gl.TRIANGLES, 6, 0).unbind();

    return this;
  };

  /**
   * Binds the buffer and uploads the data
   *
   * @return {PIXI.Quad} Returns itself.
   */


  Quad.prototype.upload = function upload() {
    for (var i = 0; i < 4; i++) {
      this.interleaved[i * 4] = this.vertices[i * 2];
      this.interleaved[i * 4 + 1] = this.vertices[i * 2 + 1];
      this.interleaved[i * 4 + 2] = this.uvs[i * 2];
      this.interleaved[i * 4 + 3] = this.uvs[i * 2 + 1];
    }

    this.vertexBuffer.upload(this.interleaved);

    return this;
  };

  /**
   * Removes this quad from WebGL
   */


  Quad.prototype.destroy = function destroy() {
    var gl = this.gl;

    gl.deleteBuffer(this.vertexBuffer);
    gl.deleteBuffer(this.indexBuffer);
  };

  return Quad;
}();

exports.default = Quad;

},{"../../../utils/createIndicesForQuads":99,"pixi-gl-core":12}],79:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _math = require('../../../math');

var _const = require('../../../const');

var _pixiGlCore = require('pixi-gl-core');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @class
 * @memberof PIXI
 */
var RenderTarget = function () {
  /**
   * @param {WebGLRenderingContext} gl - The current WebGL drawing context
   * @param {number} [width=0] - the horizontal range of the filter
   * @param {number} [height=0] - the vertical range of the filter
   * @param {number} [scaleMode=PIXI.SCALE_MODES.DEFAULT] - See {@link PIXI.SCALE_MODES} for possible values
   * @param {number} [resolution=1] - The current resolution / device pixel ratio
   * @param {boolean} [root=false] - Whether this object is the root element or not
   */
  function RenderTarget(gl, width, height, scaleMode, resolution, root) {
    _classCallCheck(this, RenderTarget);

    // TODO Resolution could go here ( eg low res blurs )

    /**
     * The current WebGL drawing context.
     *
     * @member {WebGLRenderingContext}
     */
    this.gl = gl;

    // next time to create a frame buffer and texture

    /**
     * A frame buffer
     *
     * @member {PIXI.glCore.GLFramebuffer}
     */
    this.frameBuffer = null;

    /**
     * The texture
     *
     * @member {PIXI.glCore.GLTexture}
     */
    this.texture = null;

    /**
     * The background colour of this render target, as an array of [r,g,b,a] values
     *
     * @member {number[]}
     */
    this.clearColor = [0, 0, 0, 0];

    /**
     * The size of the object as a rectangle
     *
     * @member {PIXI.Rectangle}
     */
    this.size = new _math.Rectangle(0, 0, 1, 1);

    /**
     * The current resolution / device pixel ratio
     *
     * @member {number}
     * @default 1
     */
    this.resolution = resolution || _const.RESOLUTION;

    /**
     * The projection matrix
     *
     * @member {PIXI.Matrix}
     */
    this.projectionMatrix = new _math.Matrix();

    /**
     * The object's transform
     *
     * @member {PIXI.Matrix}
     */
    this.transform = null;

    /**
     * The frame.
     *
     * @member {PIXI.Rectangle}
     */
    this.frame = null;

    /**
     * The stencil buffer stores masking data for the render target
     *
     * @member {glCore.GLBuffer}
     */
    this.defaultFrame = new _math.Rectangle();
    this.destinationFrame = null;
    this.sourceFrame = null;

    /**
     * The stencil buffer stores masking data for the render target
     *
     * @member {glCore.GLBuffer}
     */
    this.stencilBuffer = null;

    /**
     * The data structure for the stencil masks
     *
     * @member {PIXI.Graphics[]}
     */
    this.stencilMaskStack = [];

    /**
     * Stores filter data for the render target
     *
     * @member {object[]}
     */
    this.filterData = null;

    /**
     * The scale mode.
     *
     * @member {number}
     * @default PIXI.SCALE_MODES.DEFAULT
     * @see PIXI.SCALE_MODES
     */
    this.scaleMode = scaleMode || _const.SCALE_MODES.DEFAULT;

    /**
     * Whether this object is the root element or not
     *
     * @member {boolean}
     */
    this.root = root;

    if (!this.root) {
      this.frameBuffer = _pixiGlCore.GLFramebuffer.createRGBA(gl, 100, 100);

      if (this.scaleMode === _const.SCALE_MODES.NEAREST) {
        this.frameBuffer.texture.enableNearestScaling();
      } else {
        this.frameBuffer.texture.enableLinearScaling();
      }
      /*
          A frame buffer needs a target to render to..
          create a texture and bind it attach it to the framebuffer..
       */

      // this is used by the base texture
      this.texture = this.frameBuffer.texture;
    } else {
      // make it a null framebuffer..
      this.frameBuffer = new _pixiGlCore.GLFramebuffer(gl, 100, 100);
      this.frameBuffer.framebuffer = null;
    }

    this.setFrame();

    this.resize(width, height);
  }

  /**
   * Clears the filter texture.
   *
   * @param {number[]} [clearColor=this.clearColor] - Array of [r,g,b,a] to clear the framebuffer
   */


  RenderTarget.prototype.clear = function clear(clearColor) {
    var cc = clearColor || this.clearColor;

    this.frameBuffer.clear(cc[0], cc[1], cc[2], cc[3]); // r,g,b,a);
  };

  /**
   * Binds the stencil buffer.
   *
   */


  RenderTarget.prototype.attachStencilBuffer = function attachStencilBuffer() {
    // TODO check if stencil is done?
    /**
     * The stencil buffer is used for masking in pixi
     * lets create one and then add attach it to the framebuffer..
     */
    if (!this.root) {
      this.frameBuffer.enableStencil();
    }
  };

  /**
   * Sets the frame of the render target.
   *
   * @param {Rectangle} destinationFrame - The destination frame.
   * @param {Rectangle} sourceFrame - The source frame.
   */


  RenderTarget.prototype.setFrame = function setFrame(destinationFrame, sourceFrame) {
    this.destinationFrame = destinationFrame || this.destinationFrame || this.defaultFrame;
    this.sourceFrame = sourceFrame || this.sourceFrame || destinationFrame;
  };

  /**
   * Binds the buffers and initialises the viewport.
   *
   */


  RenderTarget.prototype.activate = function activate() {
    // TOOD refactor usage of frame..
    var gl = this.gl;

    // make surethe texture is unbound!
    this.frameBuffer.bind();

    this.calculateProjection(this.destinationFrame, this.sourceFrame);

    if (this.transform) {
      this.projectionMatrix.append(this.transform);
    }

    // TODO add a check as them may be the same!
    if (this.destinationFrame !== this.sourceFrame) {
      gl.enable(gl.SCISSOR_TEST);
      gl.scissor(this.destinationFrame.x | 0, this.destinationFrame.y | 0, this.destinationFrame.width * this.resolution | 0, this.destinationFrame.height * this.resolution | 0);
    } else {
      gl.disable(gl.SCISSOR_TEST);
    }

    // TODO - does not need to be updated all the time??
    gl.viewport(this.destinationFrame.x | 0, this.destinationFrame.y | 0, this.destinationFrame.width * this.resolution | 0, this.destinationFrame.height * this.resolution | 0);
  };

  /**
   * Updates the projection matrix based on a projection frame (which is a rectangle)
   *
   * @param {Rectangle} destinationFrame - The destination frame.
   * @param {Rectangle} sourceFrame - The source frame.
   */


  RenderTarget.prototype.calculateProjection = function calculateProjection(destinationFrame, sourceFrame) {
    var pm = this.projectionMatrix;

    sourceFrame = sourceFrame || destinationFrame;

    pm.identity();

    // TODO: make dest scale source
    if (!this.root) {
      pm.a = 1 / destinationFrame.width * 2;
      pm.d = 1 / destinationFrame.height * 2;

      pm.tx = -1 - sourceFrame.x * pm.a;
      pm.ty = -1 - sourceFrame.y * pm.d;
    } else {
      pm.a = 1 / destinationFrame.width * 2;
      pm.d = -1 / destinationFrame.height * 2;

      pm.tx = -1 - sourceFrame.x * pm.a;
      pm.ty = 1 - sourceFrame.y * pm.d;
    }
  };

  /**
   * Resizes the texture to the specified width and height
   *
   * @param {number} width - the new width of the texture
   * @param {number} height - the new height of the texture
   */


  RenderTarget.prototype.resize = function resize(width, height) {
    width = width | 0;
    height = height | 0;

    if (this.size.width === width && this.size.height === height) {
      return;
    }

    this.size.width = width;
    this.size.height = height;

    this.defaultFrame.width = width;
    this.defaultFrame.height = height;

    this.frameBuffer.resize(width * this.resolution, height * this.resolution);

    var projectionFrame = this.frame || this.size;

    this.calculateProjection(projectionFrame);
  };

  /**
   * Destroys the render target.
   *
   */


  RenderTarget.prototype.destroy = function destroy() {
    this.frameBuffer.destroy();

    this.frameBuffer = null;
    this.texture = null;
  };

  return RenderTarget;
}();

exports.default = RenderTarget;

},{"../../../const":30,"../../../math":53,"pixi-gl-core":12}],80:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.default = checkMaxIfStatmentsInShader;

var _pixiGlCore = require('pixi-gl-core');

var _pixiGlCore2 = _interopRequireDefault(_pixiGlCore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fragTemplate = ['precision mediump float;', 'void main(void){', 'float test = 0.1;', '%forloop%', 'gl_FragColor = vec4(0.0);', '}'].join('\n');

function checkMaxIfStatmentsInShader(maxIfs, gl) {
    var createTempContext = !gl;

    if (maxIfs === 0) {
        throw new Error('Invalid value of `0` passed to `checkMaxIfStatementsInShader`');
    }

    if (createTempContext) {
        var tinyCanvas = document.createElement('canvas');

        tinyCanvas.width = 1;
        tinyCanvas.height = 1;

        gl = _pixiGlCore2.default.createContext(tinyCanvas);
    }

    var shader = gl.createShader(gl.FRAGMENT_SHADER);

    while (true) // eslint-disable-line no-constant-condition
    {
        var fragmentSrc = fragTemplate.replace(/%forloop%/gi, generateIfTestSrc(maxIfs));

        gl.shaderSource(shader, fragmentSrc);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            maxIfs = maxIfs / 2 | 0;
        } else {
            // valid!
            break;
        }
    }

    if (createTempContext) {
        // get rid of context
        if (gl.getExtension('WEBGL_lose_context')) {
            gl.getExtension('WEBGL_lose_context').loseContext();
        }
    }

    return maxIfs;
}

function generateIfTestSrc(maxIfs) {
    var src = '';

    for (var i = 0; i < maxIfs; ++i) {
        if (i > 0) {
            src += '\nelse ';
        }

        if (i < maxIfs - 1) {
            src += 'if(test == ' + i + '.0){}';
        }
    }

    return src;
}

},{"pixi-gl-core":12}],81:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.default = mapWebGLBlendModesToPixi;

var _const = require('../../../const');

/**
 * Maps gl blend combinations to WebGL.
 *
 * @memberof PIXI
 * @param {WebGLRenderingContext} gl - The rendering context.
 * @param {string[]} [array=[]] - The array to output into.
 * @return {string[]} Mapped modes.
 */
function mapWebGLBlendModesToPixi(gl) {
    var array = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    // TODO - premultiply alpha would be different.
    // add a boolean for that!
    array[_const.BLEND_MODES.NORMAL] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
    array[_const.BLEND_MODES.ADD] = [gl.ONE, gl.DST_ALPHA];
    array[_const.BLEND_MODES.MULTIPLY] = [gl.DST_COLOR, gl.ONE_MINUS_SRC_ALPHA];
    array[_const.BLEND_MODES.SCREEN] = [gl.ONE, gl.ONE_MINUS_SRC_COLOR];
    array[_const.BLEND_MODES.OVERLAY] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
    array[_const.BLEND_MODES.DARKEN] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
    array[_const.BLEND_MODES.LIGHTEN] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
    array[_const.BLEND_MODES.COLOR_DODGE] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
    array[_const.BLEND_MODES.COLOR_BURN] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
    array[_const.BLEND_MODES.HARD_LIGHT] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
    array[_const.BLEND_MODES.SOFT_LIGHT] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
    array[_const.BLEND_MODES.DIFFERENCE] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
    array[_const.BLEND_MODES.EXCLUSION] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
    array[_const.BLEND_MODES.HUE] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
    array[_const.BLEND_MODES.SATURATION] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
    array[_const.BLEND_MODES.COLOR] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
    array[_const.BLEND_MODES.LUMINOSITY] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];

    return array;
}

},{"../../../const":30}],82:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.default = mapWebGLDrawModesToPixi;

var _const = require('../../../const');

/**
 * Generic Mask Stack data structure.
 *
 * @class
 * @memberof PIXI
 * @param {WebGLRenderingContext} gl - The current WebGL drawing context
 * @param {object} [object={}] - The object to map into
 * @return {object} The mapped draw modes.
 */
function mapWebGLDrawModesToPixi(gl) {
  var object = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  object[_const.DRAW_MODES.POINTS] = gl.POINTS;
  object[_const.DRAW_MODES.LINES] = gl.LINES;
  object[_const.DRAW_MODES.LINE_LOOP] = gl.LINE_LOOP;
  object[_const.DRAW_MODES.LINE_STRIP] = gl.LINE_STRIP;
  object[_const.DRAW_MODES.TRIANGLES] = gl.TRIANGLES;
  object[_const.DRAW_MODES.TRIANGLE_STRIP] = gl.TRIANGLE_STRIP;
  object[_const.DRAW_MODES.TRIANGLE_FAN] = gl.TRIANGLE_FAN;

  return object;
}

},{"../../../const":30}],83:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.default = validateContext;
function validateContext(gl) {
    var attributes = gl.getContextAttributes();

    // this is going to be fairly simple for now.. but at least we have rom to grow!
    if (!attributes.stencil) {
        /* eslint-disable no-console */
        console.warn('Provided WebGL context does not have a stencil buffer, masks may not render correctly');
        /* eslint-enable no-console */
    }
}

},{}],84:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _math = require('../math');

var _utils = require('../utils');

var _const = require('../const');

var _Texture = require('../textures/Texture');

var _Texture2 = _interopRequireDefault(_Texture);

var _Container2 = require('../display/Container');

var _Container3 = _interopRequireDefault(_Container2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var tempPoint = new _math.Point();

/**
 * The Sprite object is the base for all textured objects that are rendered to the screen
 *
 * A sprite can be created directly from an image like this:
 *
 * ```js
 * let sprite = new PIXI.Sprite.fromImage('assets/image.png');
 * ```
 *
 * @class
 * @extends PIXI.Container
 * @memberof PIXI
 */

var Sprite = function (_Container) {
    _inherits(Sprite, _Container);

    /**
     * @param {PIXI.Texture} texture - The texture for this sprite
     */
    function Sprite(texture) {
        _classCallCheck(this, Sprite);

        /**
         * The anchor sets the origin point of the texture.
         * The default is 0,0 this means the texture's origin is the top left
         * Setting the anchor to 0.5,0.5 means the texture's origin is centered
         * Setting the anchor to 1,1 would mean the texture's origin point will be the bottom right corner
         *
         * @member {PIXI.ObservablePoint}
         * @private
         */
        var _this = _possibleConstructorReturn(this, _Container.call(this));

        _this._anchor = new _math.ObservablePoint(_this._onAnchorUpdate, _this);

        /**
         * The texture that the sprite is using
         *
         * @private
         * @member {PIXI.Texture}
         */
        _this._texture = null;

        /**
         * The width of the sprite (this is initially set by the texture)
         *
         * @private
         * @member {number}
         */
        _this._width = 0;

        /**
         * The height of the sprite (this is initially set by the texture)
         *
         * @private
         * @member {number}
         */
        _this._height = 0;

        /**
         * The tint applied to the sprite. This is a hex value. A value of 0xFFFFFF will remove any tint effect.
         *
         * @private
         * @member {number}
         * @default 0xFFFFFF
         */
        _this._tint = null;
        _this._tintRGB = null;
        _this.tint = 0xFFFFFF;

        /**
         * The blend mode to be applied to the sprite. Apply a value of `PIXI.BLEND_MODES.NORMAL` to reset the blend mode.
         *
         * @member {number}
         * @default PIXI.BLEND_MODES.NORMAL
         * @see PIXI.BLEND_MODES
         */
        _this.blendMode = _const.BLEND_MODES.NORMAL;

        /**
         * The shader that will be used to render the sprite. Set to null to remove a current shader.
         *
         * @member {PIXI.AbstractFilter|PIXI.Shader}
         */
        _this.shader = null;

        /**
         * An internal cached value of the tint.
         *
         * @private
         * @member {number}
         * @default 0xFFFFFF
         */
        _this.cachedTint = 0xFFFFFF;

        // call texture setter
        _this.texture = texture || _Texture2.default.EMPTY;

        /**
         * this is used to store the vertex data of the sprite (basically a quad)
         *
         * @private
         * @member {Float32Array}
         */
        _this.vertexData = new Float32Array(8);

        /**
         * This is used to calculate the bounds of the object IF it is a trimmed sprite
         *
         * @private
         * @member {Float32Array}
         */
        _this.vertexTrimmedData = null;

        _this._transformID = -1;
        _this._textureID = -1;
        return _this;
    }

    /**
     * When the texture is updated, this event will fire to update the scale and frame
     *
     * @private
     */


    Sprite.prototype._onTextureUpdate = function _onTextureUpdate() {
        this._textureID = -1;

        // so if _width is 0 then width was not set..
        if (this._width) {
            this.scale.x = (0, _utils.sign)(this.scale.x) * this._width / this.texture.orig.width;
        }

        if (this._height) {
            this.scale.y = (0, _utils.sign)(this.scale.y) * this._height / this.texture.orig.height;
        }
    };

    /**
     * Called when the anchor position updates.
     *
     * @private
     */


    Sprite.prototype._onAnchorUpdate = function _onAnchorUpdate() {
        this._transformID = -1;
    };

    /**
     * calculates worldTransform * vertices, store it in vertexData
     */


    Sprite.prototype.calculateVertices = function calculateVertices() {
        if (this._transformID === this.transform._worldID && this._textureID === this._texture._updateID) {
            return;
        }

        this._transformID = this.transform._worldID;
        this._textureID = this._texture._updateID;

        // set the vertex data

        var texture = this._texture;
        var wt = this.transform.worldTransform;
        var a = wt.a;
        var b = wt.b;
        var c = wt.c;
        var d = wt.d;
        var tx = wt.tx;
        var ty = wt.ty;
        var vertexData = this.vertexData;
        var trim = texture.trim;
        var orig = texture.orig;
        var anchor = this._anchor;

        var w0 = 0;
        var w1 = 0;
        var h0 = 0;
        var h1 = 0;

        if (trim) {
            // if the sprite is trimmed and is not a tilingsprite then we need to add the extra
            // space before transforming the sprite coords.
            w1 = trim.x - anchor._x * orig.width;
            w0 = w1 + trim.width;

            h1 = trim.y - anchor._y * orig.height;
            h0 = h1 + trim.height;
        } else {
            w0 = orig.width * (1 - anchor._x);
            w1 = orig.width * -anchor._x;

            h0 = orig.height * (1 - anchor._y);
            h1 = orig.height * -anchor._y;
        }

        // xy
        vertexData[0] = a * w1 + c * h1 + tx;
        vertexData[1] = d * h1 + b * w1 + ty;

        // xy
        vertexData[2] = a * w0 + c * h1 + tx;
        vertexData[3] = d * h1 + b * w0 + ty;

        // xy
        vertexData[4] = a * w0 + c * h0 + tx;
        vertexData[5] = d * h0 + b * w0 + ty;

        // xy
        vertexData[6] = a * w1 + c * h0 + tx;
        vertexData[7] = d * h0 + b * w1 + ty;
    };

    /**
     * calculates worldTransform * vertices for a non texture with a trim. store it in vertexTrimmedData
     * This is used to ensure that the true width and height of a trimmed texture is respected
     */


    Sprite.prototype.calculateTrimmedVertices = function calculateTrimmedVertices() {
        if (!this.vertexTrimmedData) {
            this.vertexTrimmedData = new Float32Array(8);
        }

        // lets do some special trim code!
        var texture = this._texture;
        var vertexData = this.vertexTrimmedData;
        var orig = texture.orig;
        var anchor = this._anchor;

        // lets calculate the new untrimmed bounds..
        var wt = this.transform.worldTransform;
        var a = wt.a;
        var b = wt.b;
        var c = wt.c;
        var d = wt.d;
        var tx = wt.tx;
        var ty = wt.ty;

        var w0 = orig.width * (1 - anchor._x);
        var w1 = orig.width * -anchor._x;

        var h0 = orig.height * (1 - anchor._y);
        var h1 = orig.height * -anchor._y;

        // xy
        vertexData[0] = a * w1 + c * h1 + tx;
        vertexData[1] = d * h1 + b * w1 + ty;

        // xy
        vertexData[2] = a * w0 + c * h1 + tx;
        vertexData[3] = d * h1 + b * w0 + ty;

        // xy
        vertexData[4] = a * w0 + c * h0 + tx;
        vertexData[5] = d * h0 + b * w0 + ty;

        // xy
        vertexData[6] = a * w1 + c * h0 + tx;
        vertexData[7] = d * h0 + b * w1 + ty;
    };

    /**
    *
    * Renders the object using the WebGL renderer
    *
    * @private
    * @param {PIXI.WebGLRenderer} renderer - The webgl renderer to use.
    */


    Sprite.prototype._renderWebGL = function _renderWebGL(renderer) {
        this.calculateVertices();

        renderer.setObjectRenderer(renderer.plugins.sprite);
        renderer.plugins.sprite.render(this);
    };

    /**
    * Renders the object using the Canvas renderer
    *
    * @private
    * @param {PIXI.CanvasRenderer} renderer - The renderer
    */


    Sprite.prototype._renderCanvas = function _renderCanvas(renderer) {
        renderer.plugins.sprite.render(this);
    };

    /**
     * Updates the bounds of the sprite.
     *
     * @private
     */


    Sprite.prototype._calculateBounds = function _calculateBounds() {
        var trim = this._texture.trim;
        var orig = this._texture.orig;

        // First lets check to see if the current texture has a trim..
        if (!trim || trim.width === orig.width && trim.height === orig.height) {
            // no trim! lets use the usual calculations..
            this.calculateVertices();
            this._bounds.addQuad(this.vertexData);
        } else {
            // lets calculate a special trimmed bounds...
            this.calculateTrimmedVertices();
            this._bounds.addQuad(this.vertexTrimmedData);
        }
    };

    /**
     * Gets the local bounds of the sprite object.
     *
     * @param {Rectangle} rect - The output rectangle.
     * @return {Rectangle} The bounds.
     */


    Sprite.prototype.getLocalBounds = function getLocalBounds(rect) {
        // we can do a fast local bounds if the sprite has no children!
        if (this.children.length === 0) {
            this._bounds.minX = this._texture.orig.width * -this._anchor._x;
            this._bounds.minY = this._texture.orig.height * -this._anchor._y;
            this._bounds.maxX = this._texture.orig.width * (1 - this._anchor._x);
            this._bounds.maxY = this._texture.orig.height * (1 - this._anchor._x);

            if (!rect) {
                if (!this._localBoundsRect) {
                    this._localBoundsRect = new _math.Rectangle();
                }

                rect = this._localBoundsRect;
            }

            return this._bounds.getRectangle(rect);
        }

        return _Container.prototype.getLocalBounds.call(this, rect);
    };

    /**
     * Tests if a point is inside this sprite
     *
     * @param {PIXI.Point} point - the point to test
     * @return {boolean} the result of the test
     */


    Sprite.prototype.containsPoint = function containsPoint(point) {
        this.worldTransform.applyInverse(point, tempPoint);

        var width = this._texture.orig.width;
        var height = this._texture.orig.height;
        var x1 = -width * this.anchor.x;
        var y1 = 0;

        if (tempPoint.x > x1 && tempPoint.x < x1 + width) {
            y1 = -height * this.anchor.y;

            if (tempPoint.y > y1 && tempPoint.y < y1 + height) {
                return true;
            }
        }

        return false;
    };

    /**
     * Destroys this sprite and optionally its texture and children
     *
     * @param {object|boolean} [options] - Options parameter. A boolean will act as if all options
     *  have been set to that value
     * @param {boolean} [options.children=false] - if set to true, all the children will have their destroy
     *      method called as well. 'options' will be passed on to those calls.
     * @param {boolean} [options.texture=false] - Should it destroy the current texture of the sprite as well
     * @param {boolean} [options.baseTexture=false] - Should it destroy the base texture of the sprite as well
     */


    Sprite.prototype.destroy = function destroy(options) {
        _Container.prototype.destroy.call(this, options);

        this._anchor = null;

        var destroyTexture = typeof options === 'boolean' ? options : options && options.texture;

        if (destroyTexture) {
            var destroyBaseTexture = typeof options === 'boolean' ? options : options && options.baseTexture;

            this._texture.destroy(!!destroyBaseTexture);
        }

        this._texture = null;
        this.shader = null;
    };

    // some helper functions..

    /**
     * Helper function that creates a new sprite based on the source you provide.
     * The source can be - frame id, image url, video url, canvas element, video element, base texture
     *
     * @static
     * @param {number|string|PIXI.BaseTexture|HTMLCanvasElement|HTMLVideoElement} source Source to create texture from
     * @return {PIXI.Texture} The newly created texture
     */


    Sprite.from = function from(source) {
        return new Sprite(_Texture2.default.from(source));
    };

    /**
     * Helper function that creates a sprite that will contain a texture from the TextureCache based on the frameId
     * The frame ids are created when a Texture packer file has been loaded
     *
     * @static
     * @param {string} frameId - The frame Id of the texture in the cache
     * @return {PIXI.Sprite} A new Sprite using a texture from the texture cache matching the frameId
     */


    Sprite.fromFrame = function fromFrame(frameId) {
        var texture = _utils.TextureCache[frameId];

        if (!texture) {
            throw new Error('The frameId "' + frameId + '" does not exist in the texture cache');
        }

        return new Sprite(texture);
    };

    /**
     * Helper function that creates a sprite that will contain a texture based on an image url
     * If the image is not in the texture cache it will be loaded
     *
     * @static
     * @param {string} imageId - The image url of the texture
     * @param {boolean} [crossorigin=(auto)] - if you want to specify the cross-origin parameter
     * @param {number} [scaleMode=PIXI.SCALE_MODES.DEFAULT] - if you want to specify the scale mode,
     *  see {@link PIXI.SCALE_MODES} for possible values
     * @return {PIXI.Sprite} A new Sprite using a texture from the texture cache matching the image id
     */


    Sprite.fromImage = function fromImage(imageId, crossorigin, scaleMode) {
        return new Sprite(_Texture2.default.fromImage(imageId, crossorigin, scaleMode));
    };

    /**
     * The width of the sprite, setting this will actually modify the scale to achieve the value set
     *
     * @member {number}
     * @memberof PIXI.Sprite#
     */


    _createClass(Sprite, [{
        key: 'width',
        get: function get() {
            return Math.abs(this.scale.x) * this.texture.orig.width;
        }

        /**
         * Sets the width of the sprite by modifying the scale.
         *
         * @param {number} value - The value to set to.
         */
        ,
        set: function set(value) {
            var s = (0, _utils.sign)(this.scale.x) || 1;

            this.scale.x = s * value / this.texture.orig.width;
            this._width = value;
        }

        /**
         * The height of the sprite, setting this will actually modify the scale to achieve the value set
         *
         * @member {number}
         * @memberof PIXI.Sprite#
         */

    }, {
        key: 'height',
        get: function get() {
            return Math.abs(this.scale.y) * this.texture.orig.height;
        }

        /**
         * Sets the height of the sprite by modifying the scale.
         *
         * @param {number} value - The value to set to.
         */
        ,
        set: function set(value) {
            var s = (0, _utils.sign)(this.scale.y) || 1;

            this.scale.y = s * value / this.texture.orig.height;
            this._height = value;
        }

        /**
         * The anchor sets the origin point of the texture.
         * The default is 0,0 this means the texture's origin is the top left
         * Setting the anchor to 0.5,0.5 means the texture's origin is centered
         * Setting the anchor to 1,1 would mean the texture's origin point will be the bottom right corner
         *
         * @member {PIXI.ObservablePoint}
         * @memberof PIXI.Sprite#
         */

    }, {
        key: 'anchor',
        get: function get() {
            return this._anchor;
        }

        /**
         * Copies the anchor to the sprite.
         *
         * @param {number} value - The value to set to.
         */
        ,
        set: function set(value) {
            this._anchor.copy(value);
        }

        /**
         * The tint applied to the sprite. This is a hex value. A value of
         * 0xFFFFFF will remove any tint effect.
         *
         * @member {number}
         * @memberof PIXI.Sprite#
         * @default 0xFFFFFF
         */

    }, {
        key: 'tint',
        get: function get() {
            return this._tint;
        }

        /**
         * Sets the tint of the sprite.
         *
         * @param {number} value - The value to set to.
         */
        ,
        set: function set(value) {
            this._tint = value;
            this._tintRGB = (value >> 16) + (value & 0xff00) + ((value & 0xff) << 16);
        }

        /**
         * The texture that the sprite is using
         *
         * @member {PIXI.Texture}
         * @memberof PIXI.Sprite#
         */

    }, {
        key: 'texture',
        get: function get() {
            return this._texture;
        }

        /**
         * Sets the texture of the sprite.
         *
         * @param {PIXI.Texture} value - The value to set to.
         */
        ,
        set: function set(value) {
            if (this._texture === value) {
                return;
            }

            this._texture = value;
            this.cachedTint = 0xFFFFFF;

            this._textureID = -1;

            if (value) {
                // wait for the texture to load
                if (value.baseTexture.hasLoaded) {
                    this._onTextureUpdate();
                } else {
                    value.once('update', this._onTextureUpdate, this);
                }
            }
        }
    }]);

    return Sprite;
}(_Container3.default);

exports.default = Sprite;


game.Sprite.inject({
    staticInit: function staticInit(texture, props) {
        this.super(texture, props);
        if (!game.webgl) return;
        this._vertexData = new Float32Array(8);
        this._transformID = -1;
        this._textureID = -1;
        this._blendMode = PIXI.BLEND_MODES.NORMAL;
        this._cachedTint = 0xFFFFFF;
        var value = 0xffffff;
        this._tintRGB = (value >> 16) + (value & 0xff00) + ((value & 0xff) << 16);
    },

    calculateVertices: function calculateVertices() {
        if (this._transformID === this._worldTransform._worldID && this._textureID === this.texture._updateID) {
            // return; // What is this optimising?
        }

        this._transformID = this._worldTransform._worldID;
        this._textureID = this.texture._updateID;

        // set the vertex data

        var texture = this.texture;
        var wt = this._worldTransform;
        var a = wt.a;
        var b = wt.b;
        var c = wt.c;
        var d = wt.d;
        var tx = wt.tx * game.scale;
        var ty = wt.ty * game.scale;
        var vertexData = this._vertexData;

        var w0 = texture.width * game.scale;
        var w1 = 0;
        var h0 = texture.height * game.scale;
        var h1 = 0;

        vertexData[0] = a * w1 + c * h1 + tx;
        vertexData[1] = d * h1 + b * w1 + ty;
        vertexData[2] = a * w0 + c * h1 + tx;
        vertexData[3] = d * h1 + b * w0 + ty;
        vertexData[4] = a * w0 + c * h0 + tx;
        vertexData[5] = d * h0 + b * w0 + ty;
        vertexData[6] = a * w1 + c * h0 + tx;
        vertexData[7] = d * h0 + b * w1 + ty;

        if (this.tint) {
            var value = this.tint.replace('#', '0x');
            this._tintRGB = (value >> 16) + (value & 0xff00) + ((value & 0xff) << 16);
        } else {
            var value = 0xffffff;
            this._tintRGB = (value >> 16) + (value & 0xff00) + ((value & 0xff) << 16);
        }
    },

    _renderWebGL: function _renderWebGL(renderer) {
        if (!this.texture) return true;
        if (!this.texture.baseTexture.loaded) return true;

        var textureUpdated = false;
        if (!this.texture.width && this.texture.baseTexture.width) {
            this.texture.width = this.texture.baseTexture.width;
            textureUpdated = true;
        }
        if (!this.texture.height && this.texture.baseTexture.height) {
            this.texture.height = this.texture.baseTexture.height;
            textureUpdated = true;
        }
        if (textureUpdated) this.texture._updateUvs();

        if (!this.texture.width || !this.texture.height) return true;

        this.calculateVertices();

        renderer.setObjectRenderer(renderer.plugins.sprite);
        renderer.plugins.sprite.render(this);
    }
});

},{"../const":30,"../display/Container":32,"../math":53,"../textures/Texture":94,"../utils":101}],85:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _utils = require('../../utils');

var _canUseNewCanvasBlendModes = require('../../renderers/canvas/utils/canUseNewCanvasBlendModes');

var _canUseNewCanvasBlendModes2 = _interopRequireDefault(_canUseNewCanvasBlendModes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Utility methods for Sprite/Texture tinting.
 *
 * @namespace PIXI.CanvasTinter
 */
var CanvasTinter = {
    /**
     * Basically this method just needs a sprite and a color and tints the sprite with the given color.
     *
     * @memberof PIXI.CanvasTinter
     * @param {PIXI.Sprite} sprite - the sprite to tint
     * @param {number} color - the color to use to tint the sprite with
     * @return {HTMLCanvasElement} The tinted canvas
     */
    getTintedTexture: function getTintedTexture(sprite, color) {
        var texture = sprite.texture;

        color = CanvasTinter.roundColor(color);

        var stringColor = '#' + ('00000' + (color | 0).toString(16)).substr(-6);

        texture.tintCache = texture.tintCache || {};

        if (texture.tintCache[stringColor]) {
            return texture.tintCache[stringColor];
        }

        // clone texture..
        var canvas = CanvasTinter.canvas || document.createElement('canvas');

        // CanvasTinter.tintWithPerPixel(texture, stringColor, canvas);
        CanvasTinter.tintMethod(texture, color, canvas);

        if (CanvasTinter.convertTintToImage) {
            // is this better?
            var tintImage = new Image();

            tintImage.src = canvas.toDataURL();

            texture.tintCache[stringColor] = tintImage;
        } else {
            texture.tintCache[stringColor] = canvas;
            // if we are not converting the texture to an image then we need to lose the reference to the canvas
            CanvasTinter.canvas = null;
        }

        return canvas;
    },

    /**
     * Tint a texture using the 'multiply' operation.
     *
     * @memberof PIXI.CanvasTinter
     * @param {PIXI.Texture} texture - the texture to tint
     * @param {number} color - the color to use to tint the sprite with
     * @param {HTMLCanvasElement} canvas - the current canvas
     */
    tintWithMultiply: function tintWithMultiply(texture, color, canvas) {
        var context = canvas.getContext('2d');
        var crop = texture._frame.clone();
        var resolution = texture.baseTexture.resolution;

        crop.x *= resolution;
        crop.y *= resolution;
        crop.width *= resolution;
        crop.height *= resolution;

        canvas.width = crop.width;
        canvas.height = crop.height;

        context.fillStyle = '#' + ('00000' + (color | 0).toString(16)).substr(-6);

        context.fillRect(0, 0, crop.width, crop.height);

        context.globalCompositeOperation = 'multiply';

        context.drawImage(texture.baseTexture.source, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height);

        context.globalCompositeOperation = 'destination-atop';

        context.drawImage(texture.baseTexture.source, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height);
    },

    /**
     * Tint a texture using the 'overlay' operation.
     *
     * @memberof PIXI.CanvasTinter
     * @param {PIXI.Texture} texture - the texture to tint
     * @param {number} color - the color to use to tint the sprite with
     * @param {HTMLCanvasElement} canvas - the current canvas
     */
    tintWithOverlay: function tintWithOverlay(texture, color, canvas) {
        var context = canvas.getContext('2d');
        var crop = texture._frame.clone();
        var resolution = texture.baseTexture.resolution;

        crop.x *= resolution;
        crop.y *= resolution;
        crop.width *= resolution;
        crop.height *= resolution;

        canvas.width = crop.width;
        canvas.height = crop.height;

        context.globalCompositeOperation = 'copy';
        context.fillStyle = '#' + ('00000' + (color | 0).toString(16)).substr(-6);
        context.fillRect(0, 0, crop.width, crop.height);

        context.globalCompositeOperation = 'destination-atop';
        context.drawImage(texture.baseTexture.source, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height);

        // context.globalCompositeOperation = 'copy';
    },


    /**
     * Tint a texture pixel per pixel.
     *
     * @memberof PIXI.CanvasTinter
     * @param {PIXI.Texture} texture - the texture to tint
     * @param {number} color - the color to use to tint the sprite with
     * @param {HTMLCanvasElement} canvas - the current canvas
     */
    tintWithPerPixel: function tintWithPerPixel(texture, color, canvas) {
        var context = canvas.getContext('2d');
        var crop = texture._frame.clone();
        var resolution = texture.baseTexture.resolution;

        crop.x *= resolution;
        crop.y *= resolution;
        crop.width *= resolution;
        crop.height *= resolution;

        canvas.width = crop.width;
        canvas.height = crop.height;

        context.globalCompositeOperation = 'copy';
        context.drawImage(texture.baseTexture.source, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height);

        var rgbValues = (0, _utils.hex2rgb)(color);
        var r = rgbValues[0];
        var g = rgbValues[1];
        var b = rgbValues[2];

        var pixelData = context.getImageData(0, 0, crop.width, crop.height);

        var pixels = pixelData.data;

        for (var i = 0; i < pixels.length; i += 4) {
            pixels[i + 0] *= r;
            pixels[i + 1] *= g;
            pixels[i + 2] *= b;
        }

        context.putImageData(pixelData, 0, 0);
    },

    /**
     * Rounds the specified color according to the CanvasTinter.cacheStepsPerColorChannel.
     *
     * @memberof PIXI.CanvasTinter
     * @param {number} color - the color to round, should be a hex color
     * @return {number} The rounded color.
     */
    roundColor: function roundColor(color) {
        var step = CanvasTinter.cacheStepsPerColorChannel;

        var rgbValues = (0, _utils.hex2rgb)(color);

        rgbValues[0] = Math.min(255, rgbValues[0] / step * step);
        rgbValues[1] = Math.min(255, rgbValues[1] / step * step);
        rgbValues[2] = Math.min(255, rgbValues[2] / step * step);

        return (0, _utils.rgb2hex)(rgbValues);
    },

    /**
     * Number of steps which will be used as a cap when rounding colors.
     *
     * @memberof PIXI.CanvasTinter
     * @type {number}
     */
    cacheStepsPerColorChannel: 8,

    /**
     * Tint cache boolean flag.
     *
     * @memberof PIXI.CanvasTinter
     * @type {boolean}
     */
    convertTintToImage: false,

    /**
     * Whether or not the Canvas BlendModes are supported, consequently the ability to tint using the multiply method.
     *
     * @memberof PIXI.CanvasTinter
     * @type {boolean}
     */
    canUseMultiply: (0, _canUseNewCanvasBlendModes2.default)(),

    /**
     * The tinting method that will be used.
     *
     * @memberof PIXI.CanvasTinter
     * @type {tintMethodFunctionType}
     */
    tintMethod: 0
};

CanvasTinter.tintMethod = CanvasTinter.canUseMultiply ? CanvasTinter.tintWithMultiply : CanvasTinter.tintWithPerPixel;

/**
 * The tintMethod type.
 *
 * @memberof PIXI.CanvasTinter
 * @callback tintMethodFunctionType
 * @param texture {PIXI.Texture} the texture to tint
 * @param color {number} the color to use to tint the sprite with
 * @param canvas {HTMLCanvasElement} the current canvas
 */

exports.default = CanvasTinter;

},{"../../renderers/canvas/utils/canUseNewCanvasBlendModes":63,"../../utils":101}],86:[function(require,module,exports){
"use strict";

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @class
 */
var Buffer = function () {
  /**
   * @param {number} size - The size of the buffer in bytes.
   */
  function Buffer(size) {
    _classCallCheck(this, Buffer);

    this.vertices = new ArrayBuffer(size);

    /**
     * View on the vertices as a Float32Array for positions
     *
     * @member {Float32Array}
     */
    this.float32View = new Float32Array(this.vertices);

    /**
     * View on the vertices as a Uint32Array for uvs
     *
     * @member {Float32Array}
     */
    this.uint32View = new Uint32Array(this.vertices);
  }

  /**
   * Destroys the buffer.
   *
   */


  Buffer.prototype.destroy = function destroy() {
    this.vertices = null;
    this.positions = null;
    this.uvs = null;
    this.colors = null;
  };

  return Buffer;
}();

exports.default = Buffer;

},{}],87:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _ObjectRenderer2 = require('../../renderers/webgl/utils/ObjectRenderer');

var _ObjectRenderer3 = _interopRequireDefault(_ObjectRenderer2);

var _WebGLRenderer = require('../../renderers/webgl/WebGLRenderer');

var _WebGLRenderer2 = _interopRequireDefault(_WebGLRenderer);

var _createIndicesForQuads = require('../../utils/createIndicesForQuads');

var _createIndicesForQuads2 = _interopRequireDefault(_createIndicesForQuads);

var _generateMultiTextureShader = require('./generateMultiTextureShader');

var _generateMultiTextureShader2 = _interopRequireDefault(_generateMultiTextureShader);

var _checkMaxIfStatmentsInShader = require('../../renderers/webgl/utils/checkMaxIfStatmentsInShader');

var _checkMaxIfStatmentsInShader2 = _interopRequireDefault(_checkMaxIfStatmentsInShader);

var _BatchBuffer = require('./BatchBuffer');

var _BatchBuffer2 = _interopRequireDefault(_BatchBuffer);

var _const = require('../../const');

var _pixiGlCore = require('pixi-gl-core');

var _pixiGlCore2 = _interopRequireDefault(_pixiGlCore);

var _bitTwiddle = require('bit-twiddle');

var _bitTwiddle2 = _interopRequireDefault(_bitTwiddle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TICK = 0;

/**
 * Renderer dedicated to drawing and batching sprites.
 *
 * @class
 * @private
 * @memberof PIXI
 * @extends PIXI.ObjectRenderer
 */

var SpriteRenderer = function (_ObjectRenderer) {
    _inherits(SpriteRenderer, _ObjectRenderer);

    /**
     * @param {PIXI.WebGLRenderer} renderer - The renderer this sprite batch works for.
     */
    function SpriteRenderer(renderer) {
        _classCallCheck(this, SpriteRenderer);

        /**
         * Number of values sent in the vertex buffer.
         * positionX, positionY, colorR, colorG, colorB = 5
         *
         * @member {number}
         */
        var _this = _possibleConstructorReturn(this, _ObjectRenderer.call(this, renderer));

        _this.vertSize = 5;

        /**
         * The size of the vertex information in bytes.
         *
         * @member {number}
         */
        _this.vertByteSize = _this.vertSize * 4;

        /**
         * The number of images in the SpriteBatch before it flushes.
         *
         * @member {number}
         */
        _this.size = _const.SPRITE_BATCH_SIZE; // 2000 is a nice balance between mobile / desktop

        // the total number of bytes in our batch
        // let numVerts = this.size * 4 * this.vertByteSize;

        _this.buffers = [];
        for (var i = 1; i <= _bitTwiddle2.default.nextPow2(_this.size); i *= 2) {
            _this.buffers.push(new _BatchBuffer2.default(i * 4 * _this.vertByteSize));
        }

        /**
         * Holds the indices of the geometry (quads) to draw
         *
         * @member {Uint16Array}
         */
        _this.indices = (0, _createIndicesForQuads2.default)(_this.size);

        /**
         * The default shaders that is used if a sprite doesn't have a more specific one.
         * there is a shader for each number of textures that can be rendererd.
         * These shaders will also be generated on the fly as required.
         * @member {PIXI.Shader[]}
         */
        _this.shaders = null;

        _this.currentIndex = 0;
        TICK = 0;
        _this.groups = [];

        for (var k = 0; k < _this.size; k++) {
            _this.groups[k] = { textures: [], textureCount: 0, ids: [], size: 0, start: 0, blend: 0 };
        }

        _this.sprites = [];

        _this.vertexBuffers = [];
        _this.vaos = [];

        _this.vaoMax = 2;
        _this.vertexCount = 0;

        _this.renderer.on('prerender', _this.onPrerender, _this);
        return _this;
    }

    /**
     * Sets up the renderer context and necessary buffers.
     *
     * @private
     */


    SpriteRenderer.prototype.onContextChange = function onContextChange() {
        var gl = this.renderer.gl;

        // step 1: first check max textures the GPU can handle.
        this.MAX_TEXTURES = Math.min(gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS), _const.SPRITE_MAX_TEXTURES);

        // step 2: check the maximum number of if statements the shader can have too..
        this.MAX_TEXTURES = (0, _checkMaxIfStatmentsInShader2.default)(this.MAX_TEXTURES, gl);

        this.shaders = new Array(this.MAX_TEXTURES);
        this.shaders[0] = (0, _generateMultiTextureShader2.default)(gl, 1);
        this.shaders[1] = (0, _generateMultiTextureShader2.default)(gl, 2);

        // create a couple of buffers
        this.indexBuffer = _pixiGlCore2.default.GLBuffer.createIndexBuffer(gl, this.indices, gl.STATIC_DRAW);

        // we use the second shader as the first one depending on your browser may omit aTextureId
        // as it is not used by the shader so is optimized out.
        var shader = this.shaders[1];

        for (var i = 0; i < this.vaoMax; i++) {
            this.vertexBuffers[i] = _pixiGlCore2.default.GLBuffer.createVertexBuffer(gl, null, gl.STREAM_DRAW);

            /* eslint-disable max-len */

            // build the vao object that will render..
            this.vaos[i] = this.renderer.createVao().addIndex(this.indexBuffer).addAttribute(this.vertexBuffers[i], shader.attributes.aVertexPosition, gl.FLOAT, false, this.vertByteSize, 0).addAttribute(this.vertexBuffers[i], shader.attributes.aTextureCoord, gl.UNSIGNED_SHORT, true, this.vertByteSize, 2 * 4).addAttribute(this.vertexBuffers[i], shader.attributes.aColor, gl.UNSIGNED_BYTE, true, this.vertByteSize, 3 * 4).addAttribute(this.vertexBuffers[i], shader.attributes.aTextureId, gl.FLOAT, false, this.vertByteSize, 4 * 4);

            /* eslint-disable max-len */
        }

        this.vao = this.vaos[0];
        this.currentBlendMode = 99999;
    };

    /**
     * Called before the renderer starts rendering.
     *
     */


    SpriteRenderer.prototype.onPrerender = function onPrerender() {
        this.vertexCount = 0;
    };

    /**
     * Renders the sprite object.
     *
     * @param {PIXI.Sprite} sprite - the sprite to render when using this spritebatch
     */


    SpriteRenderer.prototype.render = function render(sprite) {
        // TODO set blend modes..
        // check texture..
        if (this.currentIndex >= this.size) {
            this.flush();
        }

        // get the uvs for the texture

        // if the uvs have not updated then no point rendering just yet!
        if (!sprite.texture._uvs) {
            return;
        }

        // push a texture.
        // increment the batchsize
        this.sprites[this.currentIndex++] = sprite;
    };

    /**
     * Renders the content and empties the current batch.
     *
     */


    SpriteRenderer.prototype.flush = function flush() {
        if (this.currentIndex === 0) {
            return;
        }

        var gl = this.renderer.gl;

        var np2 = _bitTwiddle2.default.nextPow2(this.currentIndex);
        var log2 = _bitTwiddle2.default.log2(np2);
        var buffer = this.buffers[log2];

        var sprites = this.sprites;
        var groups = this.groups;

        var float32View = buffer.float32View;
        var uint32View = buffer.uint32View;

        var index = 0;
        var nextTexture = void 0;
        var currentTexture = void 0;
        var groupCount = 1;
        var textureCount = 0;
        var currentGroup = groups[0];
        var vertexData = void 0;
        var tint = void 0;
        var uvs = void 0;
        var textureId = void 0;
        var blendMode = sprites[0]._blendMode;
        var shader = void 0;

        currentGroup.textureCount = 0;
        currentGroup.start = 0;
        currentGroup.blend = blendMode;

        TICK++;

        var i = void 0;

        for (i = 0; i < this.currentIndex; i++) {
            // upload the sprite elemetns...
            // they have all ready been calculated so we just need to push them into the buffer.
            var sprite = sprites[i];

            nextTexture = sprite.texture.baseTexture;

            if (blendMode !== sprite._blendMode) {
                blendMode = sprite._blendMode;

                // force the batch to break!
                currentTexture = null;
                textureCount = this.MAX_TEXTURES;
                TICK++;
            }

            if (currentTexture !== nextTexture) {
                currentTexture = nextTexture;

                if (nextTexture._enabled !== TICK) {
                    if (textureCount === this.MAX_TEXTURES) {
                        TICK++;

                        textureCount = 0;

                        currentGroup.size = i - currentGroup.start;

                        currentGroup = groups[groupCount++];
                        currentGroup.textureCount = 0;
                        currentGroup.blend = blendMode;
                        currentGroup.start = i;
                    }

                    nextTexture._enabled = TICK;
                    nextTexture._id = textureCount;

                    currentGroup.textures[currentGroup.textureCount++] = nextTexture;
                    textureCount++;
                }
            }

            vertexData = sprite._vertexData;

            // TODO this sum does not need to be set each frame..
            tint = sprite._tintRGB + (sprite._worldAlpha * 255 << 24);
            uvs = sprite.texture._uvs.uvsUint32;
            textureId = nextTexture._id;

            if (this.renderer.roundPixels) {
                var resolution = this.renderer.resolution;

                // xy
                float32View[index] = (vertexData[0] * resolution | 0) / resolution;
                float32View[index + 1] = (vertexData[1] * resolution | 0) / resolution;

                // xy
                float32View[index + 5] = (vertexData[2] * resolution | 0) / resolution;
                float32View[index + 6] = (vertexData[3] * resolution | 0) / resolution;

                // xy
                float32View[index + 10] = (vertexData[4] * resolution | 0) / resolution;
                float32View[index + 11] = (vertexData[5] * resolution | 0) / resolution;

                // xy
                float32View[index + 15] = (vertexData[6] * resolution | 0) / resolution;
                float32View[index + 16] = (vertexData[7] * resolution | 0) / resolution;
            } else {
                // xy
                float32View[index] = vertexData[0];
                float32View[index + 1] = vertexData[1];

                // xy
                float32View[index + 5] = vertexData[2];
                float32View[index + 6] = vertexData[3];

                // xy
                float32View[index + 10] = vertexData[4];
                float32View[index + 11] = vertexData[5];

                // xy
                float32View[index + 15] = vertexData[6];
                float32View[index + 16] = vertexData[7];
            }

            uint32View[index + 2] = uvs[0];
            uint32View[index + 7] = uvs[1];
            uint32View[index + 12] = uvs[2];
            uint32View[index + 17] = uvs[3];

            uint32View[index + 3] = uint32View[index + 8] = uint32View[index + 13] = uint32View[index + 18] = tint;
            float32View[index + 4] = float32View[index + 9] = float32View[index + 14] = float32View[index + 19] = textureId;

            index += 20;
        }

        currentGroup.size = i - currentGroup.start;

        this.vertexCount++;

        if (this.vaoMax <= this.vertexCount) {
            this.vaoMax++;
            shader = this.shaders[1];
            this.vertexBuffers[this.vertexCount] = _pixiGlCore2.default.GLBuffer.createVertexBuffer(gl, null, gl.STREAM_DRAW);
            // build the vao object that will render..
            this.vaos[this.vertexCount] = this.renderer.createVao().addIndex(this.indexBuffer).addAttribute(this.vertexBuffers[this.vertexCount], shader.attributes.aVertexPosition, gl.FLOAT, false, this.vertByteSize, 0).addAttribute(this.vertexBuffers[this.vertexCount], shader.attributes.aTextureCoord, gl.UNSIGNED_SHORT, true, this.vertByteSize, 2 * 4).addAttribute(this.vertexBuffers[this.vertexCount], shader.attributes.aColor, gl.UNSIGNED_BYTE, true, this.vertByteSize, 3 * 4).addAttribute(this.vertexBuffers[this.vertexCount], shader.attributes.aTextureId, gl.FLOAT, false, this.vertByteSize, 4 * 4);
        }

        this.vertexBuffers[this.vertexCount].upload(buffer.vertices, 0);
        this.vao = this.vaos[this.vertexCount].bind();

        // / render the groups..
        for (i = 0; i < groupCount; i++) {
            //console.log('rendering griup ' + i);
            var group = groups[i];
            var groupTextureCount = group.textureCount;

            shader = this.shaders[groupTextureCount - 1];

            if (!shader) {
                shader = this.shaders[groupTextureCount - 1] = (0, _generateMultiTextureShader2.default)(gl, groupTextureCount);
                //console.log("SHADER generated for " + textureCount + " textures")
            }

            this.renderer.bindShader(shader);

            for (var j = 0; j < groupTextureCount; j++) {
                this.renderer.bindTexture(group.textures[j], j);
            }

            // set the blend mode..
            this.renderer.state.setBlendMode(group.blend);

            if (game.debug) game.debug._draws++;
            gl.drawElements(gl.TRIANGLES, group.size * 6, gl.UNSIGNED_SHORT, group.start * 6 * 2);
        }

        // reset elements for the next flush
        this.currentIndex = 0;
    };

    /**
     * Starts a new sprite batch.
     *
     */


    SpriteRenderer.prototype.start = function start() {}
    // this.renderer.bindShader(this.shader);
    // TICK %= 1000;


    /**
     * Stops and flushes the current batch.
     *
     */
    ;

    SpriteRenderer.prototype.stop = function stop() {
        this.flush();
        this.vao.unbind();
    };

    /**
     * Destroys the SpriteBatch.
     *
     */


    SpriteRenderer.prototype.destroy = function destroy() {
        for (var i = 0; i < this.vaoMax; i++) {
            this.vertexBuffers[i].destroy();
            this.vaos[i].destroy();
        }

        this.indexBuffer.destroy();

        this.renderer.off('prerender', this.onPrerender, this);

        _ObjectRenderer.prototype.destroy.call(this);

        for (var _i = 0; _i < this.shaders.length; _i++) {
            if (this.shaders[_i]) {
                this.shaders[_i].destroy();
            }
        }

        this.vertexBuffers = null;
        this.vaos = null;
        this.indexBuffer = null;
        this.indices = null;

        this.sprites = null;

        for (var _i2 = 0; _i2 < this.buffers.length; _i2++) {
            this.buffers[_i2].destroy();
        }
    };

    return SpriteRenderer;
}(_ObjectRenderer3.default);

exports.default = SpriteRenderer;


_WebGLRenderer2.default.registerPlugin('sprite', SpriteRenderer);

},{"../../const":30,"../../renderers/webgl/WebGLRenderer":67,"../../renderers/webgl/utils/ObjectRenderer":77,"../../renderers/webgl/utils/checkMaxIfStatmentsInShader":80,"../../utils/createIndicesForQuads":99,"./BatchBuffer":86,"./generateMultiTextureShader":88,"bit-twiddle":1,"pixi-gl-core":12}],88:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.default = generateMultiTextureShader;

var _Shader = require('../../Shader');

var _Shader2 = _interopRequireDefault(_Shader);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

 // eslint-disable-line no-undef

var fragTemplate = ['varying vec2 vTextureCoord;', 'varying vec4 vColor;', 'varying float vTextureId;', 'uniform sampler2D uSamplers[%count%];', 'void main(void){', 'vec4 color;', 'float textureId = floor(vTextureId+0.5);', '%forloop%', 'gl_FragColor = color * vColor;', '}'].join('\n');

function generateMultiTextureShader(gl, maxTextures) {
    var vertexSrc = "#define GLSLIFY 1\nattribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\nattribute vec4 aColor;\nattribute float aTextureId;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\nvarying vec4 vColor;\nvarying float vTextureId;\n\nvoid main(void){\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n\n    vTextureCoord = aTextureCoord;\n    vTextureId = aTextureId;\n    vColor = vec4(aColor.rgb * aColor.a, aColor.a);\n}\n";
    var fragmentSrc = fragTemplate;

    fragmentSrc = fragmentSrc.replace(/%count%/gi, maxTextures);
    fragmentSrc = fragmentSrc.replace(/%forloop%/gi, generateSampleSrc(maxTextures));

    var shader = new _Shader2.default(gl, vertexSrc, fragmentSrc);

    var sampleValues = [];

    for (var i = 0; i < maxTextures; i++) {
        sampleValues[i] = i;
    }

    shader.bind();
    shader.uniforms.uSamplers = sampleValues;

    return shader;
}

function generateSampleSrc(maxTextures) {
    var src = '';

    src += '\n';
    src += '\n';

    for (var i = 0; i < maxTextures; i++) {
        if (i > 0) {
            src += '\nelse ';
        }

        if (i < maxTextures - 1) {
            src += 'if(textureId == ' + i + '.0)';
        }

        src += '\n{';
        src += '\n\tcolor = texture2D(uSamplers[' + i + '], vTextureCoord);';
        src += '\n}';
    }

    src += '\n';
    src += '\n';

    return src;
}

},{"../../Shader":29}],89:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Sprite2 = require('../sprites/Sprite');

var _Sprite3 = _interopRequireDefault(_Sprite2);

var _Texture = require('../textures/Texture');

var _Texture2 = _interopRequireDefault(_Texture);

var _math = require('../math');

var _utils = require('../utils');

var _const = require('../const');

var _TextStyle = require('./TextStyle');

var _TextStyle2 = _interopRequireDefault(_TextStyle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint max-depth: [2, 8] */


var defaultDestroyOptions = {
    texture: true,
    children: false,
    baseTexture: true
};

/**
 * A Text Object will create a line or multiple lines of text. To split a line you can use '\n' in your text string,
 * or add a wordWrap property set to true and and wordWrapWidth property with a value in the style object.
 *
 * A Text can be created directly from a string and a style object
 *
 * ```js
 * let text = new PIXI.Text('This is a pixi text',{fontFamily : 'Arial', fontSize: 24, fill : 0xff1010, align : 'center'});
 * ```
 *
 * @class
 * @extends PIXI.Sprite
 * @memberof PIXI
 */

var Text = function (_Sprite) {
    _inherits(Text, _Sprite);

    /**
     * @param {string} text - The string that you would like the text to display
     * @param {object|PIXI.TextStyle} [style] - The style parameters
     */
    function Text(text, style) {
        _classCallCheck(this, Text);

        var canvas = document.createElement('canvas');

        canvas.width = 3;
        canvas.height = 3;

        var texture = _Texture2.default.fromCanvas(canvas);

        texture.orig = new _math.Rectangle();
        texture.trim = new _math.Rectangle();

        /**
         * The canvas element that everything is drawn to
         *
         * @member {HTMLCanvasElement}
         */
        var _this = _possibleConstructorReturn(this, _Sprite.call(this, texture));

        _this.canvas = canvas;

        /**
         * The canvas 2d context that everything is drawn with
         * @member {HTMLCanvasElement}
         */
        _this.context = _this.canvas.getContext('2d');

        /**
         * The resolution / device pixel ratio of the canvas. This is set automatically by the renderer.
         * @member {number}
         * @default 1
         */
        _this.resolution = _const.RESOLUTION;

        /**
         * Private tracker for the current text.
         *
         * @member {string}
         * @private
         */
        _this._text = null;

        /**
         * Private tracker for the current style.
         *
         * @member {object}
         * @private
         */
        _this._style = null;
        /**
         * Private listener to track style changes.
         *
         * @member {Function}
         * @private
         */
        _this._styleListener = null;

        /**
         * Private tracker for the current font.
         *
         * @member {string}
         * @private
         */
        _this._font = '';

        _this.text = text;
        _this.style = style;

        _this.localStyleID = -1;
        return _this;
    }

    /**
     * Renders text and updates it when needed.
     *
     * @private
     * @param {boolean} respectDirty - Whether to abort updating the text if the Text isn't dirty and the function is called.
     */


    Text.prototype.updateText = function updateText(respectDirty) {
        var style = this._style;

        // check if style has changed..
        if (this.localStyleID !== style.styleID) {
            this.dirty = true;
            this.localStyleID = style.styleID;
        }

        if (!this.dirty && respectDirty) {
            return;
        }

        // build canvas api font setting from invididual components. Convert a numeric style.fontSize to px
        var fontSizeString = typeof style.fontSize === 'number' ? style.fontSize + 'px' : style.fontSize;

        this._font = style.fontStyle + ' ' + style.fontVariant + ' ' + style.fontWeight + ' ' + fontSizeString + ' ' + style.fontFamily;

        this.context.font = this._font;

        // word wrap
        // preserve original text
        var outputText = style.wordWrap ? this.wordWrap(this._text) : this._text;

        // split text into lines
        var lines = outputText.split(/(?:\r\n|\r|\n)/);

        // calculate text width
        var lineWidths = new Array(lines.length);
        var maxLineWidth = 0;
        var fontProperties = this.determineFontProperties(this._font);

        for (var i = 0; i < lines.length; i++) {
            var lineWidth = this.context.measureText(lines[i]).width + (lines[i].length - 1) * style.letterSpacing;

            lineWidths[i] = lineWidth;
            maxLineWidth = Math.max(maxLineWidth, lineWidth);
        }

        var width = maxLineWidth + style.strokeThickness;

        if (style.dropShadow) {
            width += style.dropShadowDistance;
        }

        width += style.padding * 2;

        this.canvas.width = Math.ceil((width + this.context.lineWidth) * this.resolution);

        // calculate text height
        var lineHeight = this.style.lineHeight || fontProperties.fontSize + style.strokeThickness;

        var height = Math.max(lineHeight, fontProperties.fontSize + style.strokeThickness) + (lines.length - 1) * lineHeight;

        if (style.dropShadow) {
            height += style.dropShadowDistance;
        }

        this.canvas.height = Math.ceil((height + this._style.padding * 2) * this.resolution);

        this.context.scale(this.resolution, this.resolution);

        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.context.font = this._font;
        this.context.strokeStyle = style.stroke;
        this.context.lineWidth = style.strokeThickness;
        this.context.textBaseline = style.textBaseline;
        this.context.lineJoin = style.lineJoin;
        this.context.miterLimit = style.miterLimit;

        var linePositionX = void 0;
        var linePositionY = void 0;

        if (style.dropShadow) {
            if (style.dropShadowBlur > 0) {
                this.context.shadowColor = style.dropShadowColor;
                this.context.shadowBlur = style.dropShadowBlur;
            } else {
                this.context.fillStyle = style.dropShadowColor;
            }

            var xShadowOffset = Math.cos(style.dropShadowAngle) * style.dropShadowDistance;
            var yShadowOffset = Math.sin(style.dropShadowAngle) * style.dropShadowDistance;

            for (var _i = 0; _i < lines.length; _i++) {
                linePositionX = style.strokeThickness / 2;
                linePositionY = style.strokeThickness / 2 + _i * lineHeight + fontProperties.ascent;

                if (style.align === 'right') {
                    linePositionX += maxLineWidth - lineWidths[_i];
                } else if (style.align === 'center') {
                    linePositionX += (maxLineWidth - lineWidths[_i]) / 2;
                }

                if (style.fill) {
                    this.drawLetterSpacing(lines[_i], linePositionX + xShadowOffset + style.padding, linePositionY + yShadowOffset + style.padding);

                    if (style.stroke && style.strokeThickness) {
                        this.context.strokeStyle = style.dropShadowColor;
                        this.drawLetterSpacing(lines[_i], linePositionX + xShadowOffset + style.padding, linePositionY + yShadowOffset + style.padding, true);
                        this.context.strokeStyle = style.stroke;
                    }
                }
            }
        }

        // set canvas text styles
        this.context.fillStyle = this._generateFillStyle(style, lines);

        // draw lines line by line
        for (var _i2 = 0; _i2 < lines.length; _i2++) {
            linePositionX = style.strokeThickness / 2;
            linePositionY = style.strokeThickness / 2 + _i2 * lineHeight + fontProperties.ascent;

            if (style.align === 'right') {
                linePositionX += maxLineWidth - lineWidths[_i2];
            } else if (style.align === 'center') {
                linePositionX += (maxLineWidth - lineWidths[_i2]) / 2;
            }

            if (style.stroke && style.strokeThickness) {
                this.drawLetterSpacing(lines[_i2], linePositionX + style.padding, linePositionY + style.padding, true);
            }

            if (style.fill) {
                this.drawLetterSpacing(lines[_i2], linePositionX + style.padding, linePositionY + style.padding);
            }
        }

        this.updateTexture();
    };

    /**
     * Render the text with letter-spacing.
     * @param {string} text - The text to draw
     * @param {number} x - Horizontal position to draw the text
     * @param {number} y - Vertical position to draw the text
     * @param {boolean} [isStroke=false] - Is this drawing for the outside stroke of the
     *  text? If not, it's for the inside fill
     * @private
     */


    Text.prototype.drawLetterSpacing = function drawLetterSpacing(text, x, y) {
        var isStroke = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

        var style = this._style;

        // letterSpacing of 0 means normal
        var letterSpacing = style.letterSpacing;

        if (letterSpacing === 0) {
            if (isStroke) {
                this.context.strokeText(text, x, y);
            } else {
                this.context.fillText(text, x, y);
            }

            return;
        }

        var characters = String.prototype.split.call(text, '');
        var currentPosition = x;
        var index = 0;
        var current = '';

        while (index < text.length) {
            current = characters[index++];
            if (isStroke) {
                this.context.strokeText(current, currentPosition, y);
            } else {
                this.context.fillText(current, currentPosition, y);
            }
            currentPosition += this.context.measureText(current).width + letterSpacing;
        }
    };

    /**
     * Updates texture size based on canvas size
     *
     * @private
     */


    Text.prototype.updateTexture = function updateTexture() {
        var texture = this._texture;
        var style = this._style;

        texture.baseTexture.hasLoaded = true;
        texture.baseTexture.resolution = this.resolution;

        texture.baseTexture.realWidth = this.canvas.width;
        texture.baseTexture.realHeight = this.canvas.height;
        texture.baseTexture.width = this.canvas.width / this.resolution;
        texture.baseTexture.height = this.canvas.height / this.resolution;
        texture.trim.width = texture._frame.width = this.canvas.width / this.resolution;
        texture.trim.height = texture._frame.height = this.canvas.height / this.resolution;

        texture.trim.x = -style.padding;
        texture.trim.y = -style.padding;

        texture.orig.width = texture._frame.width - style.padding * 2;
        texture.orig.height = texture._frame.height - style.padding * 2;

        // call sprite onTextureUpdate to update scale if _width or _height were set
        this._onTextureUpdate();

        texture.baseTexture.emit('update', texture.baseTexture);

        this.dirty = false;
    };

    /**
     * Renders the object using the WebGL renderer
     *
     * @param {PIXI.WebGLRenderer} renderer - The renderer
     */


    Text.prototype.renderWebGL = function renderWebGL(renderer) {
        if (this.resolution !== renderer.resolution) {
            this.resolution = renderer.resolution;
            this.dirty = true;
        }

        this.updateText(true);

        _Sprite.prototype.renderWebGL.call(this, renderer);
    };

    /**
     * Renders the object using the Canvas renderer
     *
     * @private
     * @param {PIXI.CanvasRenderer} renderer - The renderer
     */


    Text.prototype._renderCanvas = function _renderCanvas(renderer) {
        if (this.resolution !== renderer.resolution) {
            this.resolution = renderer.resolution;
            this.dirty = true;
        }

        this.updateText(true);

        _Sprite.prototype._renderCanvas.call(this, renderer);
    };

    /**
     * Calculates the ascent, descent and fontSize of a given fontStyle
     *
     * @private
     * @param {string} fontStyle - String representing the style of the font
     * @return {Object} Font properties object
     */


    Text.prototype.determineFontProperties = function determineFontProperties(fontStyle) {
        var properties = Text.fontPropertiesCache[fontStyle];

        if (!properties) {
            properties = {};

            var canvas = Text.fontPropertiesCanvas;
            var context = Text.fontPropertiesContext;

            context.font = fontStyle;

            var width = Math.ceil(context.measureText('|MÉq').width);
            var baseline = Math.ceil(context.measureText('M').width);
            var height = 2 * baseline;

            baseline = baseline * 1.4 | 0;

            canvas.width = width;
            canvas.height = height;

            context.fillStyle = '#f00';
            context.fillRect(0, 0, width, height);

            context.font = fontStyle;

            context.textBaseline = 'alphabetic';
            context.fillStyle = '#000';
            context.fillText('|MÉq', 0, baseline);

            var imagedata = context.getImageData(0, 0, width, height).data;
            var pixels = imagedata.length;
            var line = width * 4;

            var i = 0;
            var idx = 0;
            var stop = false;

            // ascent. scan from top to bottom until we find a non red pixel
            for (i = 0; i < baseline; ++i) {
                for (var j = 0; j < line; j += 4) {
                    if (imagedata[idx + j] !== 255) {
                        stop = true;
                        break;
                    }
                }
                if (!stop) {
                    idx += line;
                } else {
                    break;
                }
            }

            properties.ascent = baseline - i;

            idx = pixels - line;
            stop = false;

            // descent. scan from bottom to top until we find a non red pixel
            for (i = height; i > baseline; --i) {
                for (var _j = 0; _j < line; _j += 4) {
                    if (imagedata[idx + _j] !== 255) {
                        stop = true;
                        break;
                    }
                }

                if (!stop) {
                    idx -= line;
                } else {
                    break;
                }
            }

            properties.descent = i - baseline;
            properties.fontSize = properties.ascent + properties.descent;

            Text.fontPropertiesCache[fontStyle] = properties;
        }

        return properties;
    };

    /**
     * Applies newlines to a string to have it optimally fit into the horizontal
     * bounds set by the Text object's wordWrapWidth property.
     *
     * @private
     * @param {string} text - String to apply word wrapping to
     * @return {string} New string with new lines applied where required
     */


    Text.prototype.wordWrap = function wordWrap(text) {
        // Greedy wrapping algorithm that will wrap words as the line grows longer
        // than its horizontal bounds.
        var result = '';
        var lines = text.split('\n');
        var wordWrapWidth = this._style.wordWrapWidth;

        for (var i = 0; i < lines.length; i++) {
            var spaceLeft = wordWrapWidth;
            var words = lines[i].split(' ');

            for (var j = 0; j < words.length; j++) {
                var wordWidth = this.context.measureText(words[j]).width;

                if (this._style.breakWords && wordWidth > wordWrapWidth) {
                    // Word should be split in the middle
                    var characters = words[j].split('');

                    for (var c = 0; c < characters.length; c++) {
                        var characterWidth = this.context.measureText(characters[c]).width;

                        if (characterWidth > spaceLeft) {
                            result += '\n' + characters[c];
                            spaceLeft = wordWrapWidth - characterWidth;
                        } else {
                            if (c === 0) {
                                result += ' ';
                            }

                            result += characters[c];
                            spaceLeft -= characterWidth;
                        }
                    }
                } else {
                    var wordWidthWithSpace = wordWidth + this.context.measureText(' ').width;

                    if (j === 0 || wordWidthWithSpace > spaceLeft) {
                        // Skip printing the newline if it's the first word of the line that is
                        // greater than the word wrap width.
                        if (j > 0) {
                            result += '\n';
                        }
                        result += words[j];
                        spaceLeft = wordWrapWidth - wordWidth;
                    } else {
                        spaceLeft -= wordWidthWithSpace;
                        result += ' ' + words[j];
                    }
                }
            }

            if (i < lines.length - 1) {
                result += '\n';
            }
        }

        return result;
    };

    /**
     * calculates the bounds of the Text as a rectangle. The bounds calculation takes the worldTransform into account.
     */


    Text.prototype._calculateBounds = function _calculateBounds() {
        this.updateText(true);
        this.calculateVertices();
        // if we have already done this on THIS frame.
        this._bounds.addQuad(this.vertexData);
    };

    /**
     * Method to be called upon a TextStyle change.
     * @private
     */


    Text.prototype._onStyleChange = function _onStyleChange() {
        this.dirty = true;
    };

    /**
     * Generates the fill style. Can automatically generate a gradient based on the fill style being an array
     *
     * @private
     * @param {object} style - The style.
     * @param {string} lines - The lines of text.
     * @return {string|number|CanvasGradient} The fill style
     */


    Text.prototype._generateFillStyle = function _generateFillStyle(style, lines) {
        if (!Array.isArray(style.fill)) {
            return style.fill;
        }

        // cocoon on canvas+ cannot generate textures, so use the first colour instead
        if (navigator.isCocoonJS) {
            return style.fill[0];
        }

        // the gradient will be evenly spaced out according to how large the array is.
        // ['#FF0000', '#00FF00', '#0000FF'] would created stops at 0.25, 0.5 and 0.75
        var gradient = void 0;
        var totalIterations = void 0;
        var currentIteration = void 0;
        var stop = void 0;

        var width = this.canvas.width / this.resolution;
        var height = this.canvas.height / this.resolution;

        if (style.fillGradientType === _const.TEXT_GRADIENT.LINEAR_VERTICAL) {
            // start the gradient at the top center of the canvas, and end at the bottom middle of the canvas
            gradient = this.context.createLinearGradient(width / 2, 0, width / 2, height);

            // we need to repeat the gradient so that each invididual line of text has the same vertical gradient effect
            // ['#FF0000', '#00FF00', '#0000FF'] over 2 lines would create stops at 0.125, 0.25, 0.375, 0.625, 0.75, 0.875
            totalIterations = (style.fill.length + 1) * lines.length;
            currentIteration = 0;
            for (var i = 0; i < lines.length; i++) {
                currentIteration += 1;
                for (var j = 0; j < style.fill.length; j++) {
                    stop = currentIteration / totalIterations;
                    gradient.addColorStop(stop, style.fill[j]);
                    currentIteration++;
                }
            }
        } else {
            // start the gradient at the center left of the canvas, and end at the center right of the canvas
            gradient = this.context.createLinearGradient(0, height / 2, width, height / 2);

            // can just evenly space out the gradients in this case, as multiple lines makes no difference
            // to an even left to right gradient
            totalIterations = style.fill.length + 1;
            currentIteration = 1;

            for (var _i3 = 0; _i3 < style.fill.length; _i3++) {
                stop = currentIteration / totalIterations;
                gradient.addColorStop(stop, style.fill[_i3]);
                currentIteration++;
            }
        }

        return gradient;
    };

    /**
     * Destroys this text object.
     * Note* Unlike a Sprite, a Text object will automatically destroy its baseTexture and texture as
     * the majorety of the time the texture will not be shared with any other Sprites.
     *
     * @param {object|boolean} [options] - Options parameter. A boolean will act as if all options
     *  have been set to that value
     * @param {boolean} [options.children=false] - if set to true, all the children will have their
     *  destroy method called as well. 'options' will be passed on to those calls.
     * @param {boolean} [options.texture=true] - Should it destroy the current texture of the sprite as well
     * @param {boolean} [options.baseTexture=true] - Should it destroy the base texture of the sprite as well
     */


    Text.prototype.destroy = function destroy(options) {
        if (typeof options === 'boolean') {
            options = { children: options };
        }

        options = Object.assign({}, defaultDestroyOptions, options);

        _Sprite.prototype.destroy.call(this, options);

        // make sure to reset the the context and canvas.. dont want this hanging around in memory!
        this.context = null;
        this.canvas = null;

        this._style = null;
    };

    /**
     * The width of the Text, setting this will actually modify the scale to achieve the value set
     *
     * @member {number}
     * @memberof PIXI.Text#
     */


    _createClass(Text, [{
        key: 'width',
        get: function get() {
            this.updateText(true);

            return Math.abs(this.scale.x) * this.texture.orig.width;
        }

        /**
         * Sets the width of the text.
         *
         * @param {number} value - The value to set to.
         */
        ,
        set: function set(value) {
            this.updateText(true);

            var s = (0, _utils.sign)(this.scale.x) || 1;

            this.scale.x = s * value / this.texture.orig.width;
            this._width = value;
        }

        /**
         * The height of the Text, setting this will actually modify the scale to achieve the value set
         *
         * @member {number}
         * @memberof PIXI.Text#
         */

    }, {
        key: 'height',
        get: function get() {
            this.updateText(true);

            return Math.abs(this.scale.y) * this._texture.orig.height;
        }

        /**
         * Sets the height of the text.
         *
         * @param {number} value - The value to set to.
         */
        ,
        set: function set(value) {
            this.updateText(true);

            var s = (0, _utils.sign)(this.scale.y) || 1;

            this.scale.y = s * value / this.texture.orig.height;
            this._height = value;
        }

        /**
         * Set the style of the text. Set up an event listener to listen for changes on the style
         * object and mark the text as dirty.
         *
         * @member {object|PIXI.TextStyle}
         * @memberof PIXI.Text#
         */

    }, {
        key: 'style',
        get: function get() {
            return this._style;
        }

        /**
         * Sets the style of the text.
         *
         * @param {object} style - The value to set to.
         */
        ,
        set: function set(style) {
            style = style || {};

            if (style instanceof _TextStyle2.default) {
                this._style = style;
            } else {
                this._style = new _TextStyle2.default(style);
            }

            this.localStyleID = -1;
            this.dirty = true;
        }

        /**
         * Set the copy for the text object. To split a line you can use '\n'.
         *
         * @member {string}
         * @memberof PIXI.Text#
         */

    }, {
        key: 'text',
        get: function get() {
            return this._text;
        }

        /**
         * Sets the text.
         *
         * @param {string} text - The value to set to.
         */
        ,
        set: function set(text) {
            text = text || ' ';
            text = text.toString();

            if (this._text === text) {
                return;
            }
            this._text = text;
            this.dirty = true;
        }
    }]);

    return Text;
}(_Sprite3.default);

exports.default = Text;


Text.fontPropertiesCache = {};
Text.fontPropertiesCanvas = document.createElement('canvas');
Text.fontPropertiesContext = Text.fontPropertiesCanvas.getContext('2d');

game.SystemText.inject({
    staticInit: function staticInit(text, props) {
        this.super(text, props);
        if (!game.webgl) return;
        this._canvas = document.createElement('canvas');
        this._canvas.width = 3;
        this._canvas.height = 3;
        this._context = this._canvas.getContext('2d');
    },

    updateTransform: function updateTransform() {
        if (game.webgl && this.text && this._text !== this.text) {
            // Generate text
            this.removeAll();

            this._text = this.text; // Cache text

            var context = this._context;

            context.font = this.size * game.scale * game.scale + 'px ' + this.font;

            var measure = context.measureText(this.text);
            this._canvas.width = Math.ceil(measure.width + context.lineWidth);
            var height = Math.ceil(context.measureText('M').width) * 2 * game.scale;
            height = height * 1.4 | 0;
            this._canvas.height = height;

            var offset = this.size * (game.scale - 1);

            // Store current values
            var tx = this._worldTransform.tx;
            var ty = this._worldTransform.ty;
            var align = this.align;
            this._worldTransform.tx = 0;
            this._worldTransform.ty = offset;
            this.align = 'left';

            context.clearRect(0, 0, this._canvas.width, this._canvas.height);
            this._renderCanvas(context);

            // Retrieve values
            this.align = align;
            this._worldTransform.tx = tx;
            this._worldTransform.ty = ty;

            var texture = new game.Texture(new game.BaseTexture(this._canvas));
            this._sprite = new game.Sprite(texture);
            if (this.align === 'center') {
                this._sprite.position.x = -this._sprite.width / 2;
            }
            this._sprite.position.y = -offset;
            this.addChild(this._sprite);
        }
        this.super();
    }
});

},{"../const":30,"../math":53,"../sprites/Sprite":84,"../textures/Texture":94,"../utils":101,"./TextStyle":90}],90:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // disabling eslint for now, going to rewrite this in v5
/* eslint-disable */

var _const = require('../const');

var _utils = require('../utils');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var defaultStyle = {
    align: 'left',
    breakWords: false,
    dropShadow: false,
    dropShadowAngle: Math.PI / 6,
    dropShadowBlur: 0,
    dropShadowColor: '#000000',
    dropShadowDistance: 5,
    fill: 'black',
    fillGradientType: _const.TEXT_GRADIENT.LINEAR_VERTICAL,
    fontFamily: 'Arial',
    fontSize: 26,
    fontStyle: 'normal',
    fontVariant: 'normal',
    fontWeight: 'normal',
    letterSpacing: 0,
    lineHeight: 0,
    lineJoin: 'miter',
    miterLimit: 10,
    padding: 0,
    stroke: 'black',
    strokeThickness: 0,
    textBaseline: 'alphabetic',
    wordWrap: false,
    wordWrapWidth: 100
};

/**
 * A TextStyle Object decorates a Text Object. It can be shared between
 * multiple Text objects. Changing the style will update all text objects using it.
 *
 * @class
 * @memberof PIXI
 */

var TextStyle = function () {
    /**
     * @param {object} [style] - The style parameters
     * @param {string} [style.align='left'] - Alignment for multiline text ('left', 'center' or 'right'),
     *  does not affect single line text
     * @param {boolean} [style.breakWords=false] - Indicates if lines can be wrapped within words, it
     *  needs wordWrap to be set to true
     * @param {boolean} [style.dropShadow=false] - Set a drop shadow for the text
     * @param {number} [style.dropShadowAngle=Math.PI/6] - Set a angle of the drop shadow
     * @param {number} [style.dropShadowBlur=0] - Set a shadow blur radius
     * @param {string} [style.dropShadowColor='#000000'] - A fill style to be used on the dropshadow e.g 'red', '#00FF00'
     * @param {number} [style.dropShadowDistance=5] - Set a distance of the drop shadow
     * @param {string|string[]|number|number[]|CanvasGradient|CanvasPattern} [style.fill='black'] - A canvas
     *  fillstyle that will be used on the text e.g 'red', '#00FF00'. Can be an array to create a gradient
     *  eg ['#000000','#FFFFFF']
     * {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillStyle|MDN}
     * @param {number} [style.fillGradientType=PIXI.TEXT_GRADIENT.LINEAR_VERTICAL] - If fills styles are
     *  supplied, this can change the type/direction of the gradient. See {@link PIXI.TEXT_GRADIENT} for possible values
     * @param {string} [style.fontFamily='Arial'] - The font family
     * @param {number|string} [style.fontSize=26] - The font size (as a number it converts to px, but as a string,
     *  equivalents are '26px','20pt','160%' or '1.6em')
     * @param {string} [style.fontStyle='normal'] - The font style ('normal', 'italic' or 'oblique')
     * @param {string} [style.fontVariant='normal'] - The font variant ('normal' or 'small-caps')
     * @param {string} [style.fontWeight='normal'] - The font weight ('normal', 'bold', 'bolder', 'lighter' and '100',
     *  '200', '300', '400', '500', '600', '700', 800' or '900')
     * @param {number} [style.letterSpacing=0] - The amount of spacing between letters, default is 0
     * @param {number} [style.lineHeight] - The line height, a number that represents the vertical space that a letter uses
     * @param {string} [style.lineJoin='miter'] - The lineJoin property sets the type of corner created, it can resolve
     *      spiked text issues. Default is 'miter' (creates a sharp corner).
     * @param {number} [style.miterLimit=10] - The miter limit to use when using the 'miter' lineJoin mode. This can reduce
     *      or increase the spikiness of rendered text.
     * @param {number} [style.padding=0] - Occasionally some fonts are cropped. Adding some padding will prevent this from
     *     happening by adding padding to all sides of the text.
     * @param {string|number} [style.stroke='black'] - A canvas fillstyle that will be used on the text stroke
     *  e.g 'blue', '#FCFF00'
     * @param {number} [style.strokeThickness=0] - A number that represents the thickness of the stroke.
     *  Default is 0 (no stroke)
     * @param {string} [style.textBaseline='alphabetic'] - The baseline of the text that is rendered.
     * @param {boolean} [style.wordWrap=false] - Indicates if word wrap should be used
     * @param {number} [style.wordWrapWidth=100] - The width at which text will wrap, it needs wordWrap to be set to true
     */
    function TextStyle(style) {
        _classCallCheck(this, TextStyle);

        this.styleID = 0;

        Object.assign(this, defaultStyle, style);
    }

    /**
     * Creates a new TextStyle object with the same values as this one.
     * Note that the only the properties of the object are cloned.
     *
     * @return {PIXI.TextStyle} New cloned TextStyle object
     */


    TextStyle.prototype.clone = function clone() {
        var clonedProperties = {};

        for (var key in this._defaults) {
            clonedProperties[key] = this[key];
        }

        return new TextStyle(clonedProperties);
    };

    /**
     * Resets all properties to the defaults specified in TextStyle.prototype._default
     */


    TextStyle.prototype.reset = function reset() {
        Object.assign(this, this._defaults);
    };

    _createClass(TextStyle, [{
        key: 'align',
        get: function get() {
            return this._align;
        },
        set: function set(align) {
            if (this._align !== align) {
                this._align = align;
                this.styleID++;
            }
        }
    }, {
        key: 'breakWords',
        get: function get() {
            return this._breakWords;
        },
        set: function set(breakWords) {
            if (this._breakWords !== breakWords) {
                this._breakWords = breakWords;
                this.styleID++;
            }
        }
    }, {
        key: 'dropShadow',
        get: function get() {
            return this._dropShadow;
        },
        set: function set(dropShadow) {
            if (this._dropShadow !== dropShadow) {
                this._dropShadow = dropShadow;
                this.styleID++;
            }
        }
    }, {
        key: 'dropShadowAngle',
        get: function get() {
            return this._dropShadowAngle;
        },
        set: function set(dropShadowAngle) {
            if (this._dropShadowAngle !== dropShadowAngle) {
                this._dropShadowAngle = dropShadowAngle;
                this.styleID++;
            }
        }
    }, {
        key: 'dropShadowBlur',
        get: function get() {
            return this._dropShadowBlur;
        },
        set: function set(dropShadowBlur) {
            if (this._dropShadowBlur !== dropShadowBlur) {
                this._dropShadowBlur = dropShadowBlur;
                this.styleID++;
            }
        }
    }, {
        key: 'dropShadowColor',
        get: function get() {
            return this._dropShadowColor;
        },
        set: function set(dropShadowColor) {
            var outputColor = getColor(dropShadowColor);
            if (this._dropShadowColor !== outputColor) {
                this._dropShadowColor = outputColor;
                this.styleID++;
            }
        }
    }, {
        key: 'dropShadowDistance',
        get: function get() {
            return this._dropShadowDistance;
        },
        set: function set(dropShadowDistance) {
            if (this._dropShadowDistance !== dropShadowDistance) {
                this._dropShadowDistance = dropShadowDistance;
                this.styleID++;
            }
        }
    }, {
        key: 'fill',
        get: function get() {
            return this._fill;
        },
        set: function set(fill) {
            var outputColor = getColor(fill);
            if (this._fill !== outputColor) {
                this._fill = outputColor;
                this.styleID++;
            }
        }
    }, {
        key: 'fillGradientType',
        get: function get() {
            return this._fillGradientType;
        },
        set: function set(fillGradientType) {
            if (this._fillGradientType !== fillGradientType) {
                this._fillGradientType = fillGradientType;
                this.styleID++;
            }
        }
    }, {
        key: 'fontFamily',
        get: function get() {
            return this._fontFamily;
        },
        set: function set(fontFamily) {
            if (this.fontFamily !== fontFamily) {
                this._fontFamily = fontFamily;
                this.styleID++;
            }
        }
    }, {
        key: 'fontSize',
        get: function get() {
            return this._fontSize;
        },
        set: function set(fontSize) {
            if (this._fontSize !== fontSize) {
                this._fontSize = fontSize;
                this.styleID++;
            }
        }
    }, {
        key: 'fontStyle',
        get: function get() {
            return this._fontStyle;
        },
        set: function set(fontStyle) {
            if (this._fontStyle !== fontStyle) {
                this._fontStyle = fontStyle;
                this.styleID++;
            }
        }
    }, {
        key: 'fontVariant',
        get: function get() {
            return this._fontVariant;
        },
        set: function set(fontVariant) {
            if (this._fontVariant !== fontVariant) {
                this._fontVariant = fontVariant;
                this.styleID++;
            }
        }
    }, {
        key: 'fontWeight',
        get: function get() {
            return this._fontWeight;
        },
        set: function set(fontWeight) {
            if (this._fontWeight !== fontWeight) {
                this._fontWeight = fontWeight;
                this.styleID++;
            }
        }
    }, {
        key: 'letterSpacing',
        get: function get() {
            return this._letterSpacing;
        },
        set: function set(letterSpacing) {
            if (this._letterSpacing !== letterSpacing) {
                this._letterSpacing = letterSpacing;
                this.styleID++;
            }
        }
    }, {
        key: 'lineHeight',
        get: function get() {
            return this._lineHeight;
        },
        set: function set(lineHeight) {
            if (this._lineHeight !== lineHeight) {
                this._lineHeight = lineHeight;
                this.styleID++;
            }
        }
    }, {
        key: 'lineJoin',
        get: function get() {
            return this._lineJoin;
        },
        set: function set(lineJoin) {
            if (this._lineJoin !== lineJoin) {
                this._lineJoin = lineJoin;
                this.styleID++;
            }
        }
    }, {
        key: 'miterLimit',
        get: function get() {
            return this._miterLimit;
        },
        set: function set(miterLimit) {
            if (this._miterLimit !== miterLimit) {
                this._miterLimit = miterLimit;
                this.styleID++;
            }
        }
    }, {
        key: 'padding',
        get: function get() {
            return this._padding;
        },
        set: function set(padding) {
            if (this._padding !== padding) {
                this._padding = padding;
                this.styleID++;
            }
        }
    }, {
        key: 'stroke',
        get: function get() {
            return this._stroke;
        },
        set: function set(stroke) {
            var outputColor = getColor(stroke);
            if (this._stroke !== outputColor) {
                this._stroke = outputColor;
                this.styleID++;
            }
        }
    }, {
        key: 'strokeThickness',
        get: function get() {
            return this._strokeThickness;
        },
        set: function set(strokeThickness) {
            if (this._strokeThickness !== strokeThickness) {
                this._strokeThickness = strokeThickness;
                this.styleID++;
            }
        }
    }, {
        key: 'textBaseline',
        get: function get() {
            return this._textBaseline;
        },
        set: function set(textBaseline) {
            if (this._textBaseline !== textBaseline) {
                this._textBaseline = textBaseline;
                this.styleID++;
            }
        }
    }, {
        key: 'wordWrap',
        get: function get() {
            return this._wordWrap;
        },
        set: function set(wordWrap) {
            if (this._wordWrap !== wordWrap) {
                this._wordWrap = wordWrap;
                this.styleID++;
            }
        }
    }, {
        key: 'wordWrapWidth',
        get: function get() {
            return this._wordWrapWidth;
        },
        set: function set(wordWrapWidth) {
            if (this._wordWrapWidth !== wordWrapWidth) {
                this._wordWrapWidth = wordWrapWidth;
                this.styleID++;
            }
        }
    }]);

    return TextStyle;
}();

/**
 * Utility function to convert hexadecimal colors to strings, and simply return the color if it's a string.
 *
 * @param {number|number[]} color
 * @return {string} The color as a string.
 */


exports.default = TextStyle;
function getColor(color) {
    if (typeof color === 'number') {
        return (0, _utils.hex2string)(color);
    } else if (Array.isArray(color)) {
        for (var i = 0; i < color.length; ++i) {
            if (typeof color[i] === 'number') {
                color[i] = (0, _utils.hex2string)(color[i]);
            }
        }
    }

    return color;
}

},{"../const":30,"../utils":101}],91:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _BaseTexture2 = require('./BaseTexture');

var _BaseTexture3 = _interopRequireDefault(_BaseTexture2);

var _const = require('../const');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * A BaseRenderTexture is a special texture that allows any Pixi display object to be rendered to it.
 *
 * __Hint__: All DisplayObjects (i.e. Sprites) that render to a BaseRenderTexture should be preloaded
 * otherwise black rectangles will be drawn instead.
 *
 * A BaseRenderTexture takes a snapshot of any Display Object given to its render method. The position
 * and rotation of the given Display Objects is ignored. For example:
 *
 * ```js
 * let renderer = PIXI.autoDetectRenderer(1024, 1024, { view: canvas, ratio: 1 });
 * let baseRenderTexture = new PIXI.BaseRenderTexture(renderer, 800, 600);
 * let sprite = PIXI.Sprite.fromImage("spinObj_01.png");
 *
 * sprite.position.x = 800/2;
 * sprite.position.y = 600/2;
 * sprite.anchor.x = 0.5;
 * sprite.anchor.y = 0.5;
 *
 * baseRenderTexture.render(sprite);
 * ```
 *
 * The Sprite in this case will be rendered to a position of 0,0. To render this sprite at its actual
 * position a Container should be used:
 *
 * ```js
 * let doc = new PIXI.Container();
 *
 * doc.addChild(sprite);
 *
 * let baseRenderTexture = new PIXI.BaseRenderTexture(100, 100);
 * let renderTexture = new PIXI.RenderTexture(baseRenderTexture);
 *
 * renderer.render(doc, renderTexture);  // Renders to center of RenderTexture
 * ```
 *
 * @class
 * @extends PIXI.BaseTexture
 * @memberof PIXI
 */
var BaseRenderTexture = function (_BaseTexture) {
  _inherits(BaseRenderTexture, _BaseTexture);

  /**
   * @param {number} [width=100] - The width of the base render texture
   * @param {number} [height=100] - The height of the base render texture
   * @param {number} [scaleMode=PIXI.SCALE_MODES.DEFAULT] - See {@link PIXI.SCALE_MODES} for possible values
   * @param {number} [resolution=1] - The resolution / device pixel ratio of the texture being generated
   */
  function BaseRenderTexture() {
    var width = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 100;
    var height = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 100;
    var scaleMode = arguments[2];
    var resolution = arguments[3];

    _classCallCheck(this, BaseRenderTexture);

    var _this = _possibleConstructorReturn(this, _BaseTexture.call(this, null, scaleMode));

    _this.resolution = resolution || _const.RESOLUTION;

    _this.width = width;
    _this.height = height;

    _this.realWidth = _this.width * _this.resolution;
    _this.realHeight = _this.height * _this.resolution;

    _this.scaleMode = scaleMode || _const.SCALE_MODES.DEFAULT;
    _this.hasLoaded = true;

    /**
     * A map of renderer IDs to webgl renderTargets
     *
     * @private
     * @member {object<number, WebGLTexture>}
     */
    _this._glRenderTargets = {};

    /**
     * A reference to the canvas render target (we only need one as this can be shared accross renderers)
     *
     * @private
     * @member {object<number, WebGLTexture>}
     */
    _this._canvasRenderTarget = null;

    /**
     * This will let the renderer know if the texture is valid. If it's not then it cannot be rendered.
     *
     * @member {boolean}
     */
    _this.valid = false;
    return _this;
  }

  /**
   * Resizes the BaseRenderTexture.
   *
   * @param {number} width - The width to resize to.
   * @param {number} height - The height to resize to.
   */


  BaseRenderTexture.prototype.resize = function resize(width, height) {
    if (width === this.width && height === this.height) {
      return;
    }

    this.valid = width > 0 && height > 0;

    this.width = width;
    this.height = height;

    this.realWidth = this.width * this.resolution;
    this.realHeight = this.height * this.resolution;

    if (!this.valid) {
      return;
    }

    this.emit('update', this);
  };

  /**
   * Destroys this texture
   *
   */


  BaseRenderTexture.prototype.destroy = function destroy() {
    _BaseTexture.prototype.destroy.call(this, true);
    this.renderer = null;
  };

  return BaseRenderTexture;
}(_BaseTexture3.default);

exports.default = BaseRenderTexture;

},{"../const":30,"./BaseTexture":92}],92:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _utils = require('../utils');

var _const = require('../const');

var _eventemitter = require('eventemitter3');

var _eventemitter2 = _interopRequireDefault(_eventemitter);

var _determineCrossOrigin = require('../utils/determineCrossOrigin');

var _determineCrossOrigin2 = _interopRequireDefault(_determineCrossOrigin);

var _bitTwiddle = require('bit-twiddle');

var _bitTwiddle2 = _interopRequireDefault(_bitTwiddle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * A texture stores the information that represents an image. All textures have a base texture.
 *
 * @class
 * @extends EventEmitter
 * @memberof PIXI
 */
var BaseTexture = function (_EventEmitter) {
    _inherits(BaseTexture, _EventEmitter);

    /**
     * @param {HTMLImageElement|HTMLCanvasElement} [source] - the source object of the texture.
     * @param {number} [scaleMode=PIXI.SCALE_MODES.DEFAULT] - See {@link PIXI.SCALE_MODES} for possible values
     * @param {number} [resolution=1] - The resolution / device pixel ratio of the texture
     */
    function BaseTexture(source, scaleMode, resolution) {
        _classCallCheck(this, BaseTexture);

        var _this = _possibleConstructorReturn(this, _EventEmitter.call(this));

        _this.uid = (0, _utils.uid)();

        _this.touched = 0;

        /**
         * The resolution / device pixel ratio of the texture
         *
         * @member {number}
         * @default 1
         */
        _this.resolution = resolution || _const.RESOLUTION;

        /**
         * The width of the base texture set when the image has loaded
         *
         * @readonly
         * @member {number}
         */
        _this.width = 100;

        /**
         * The height of the base texture set when the image has loaded
         *
         * @readonly
         * @member {number}
         */
        _this.height = 100;

        // TODO docs
        // used to store the actual dimensions of the source
        /**
         * Used to store the actual width of the source of this texture
         *
         * @readonly
         * @member {number}
         */
        _this.realWidth = 100;
        /**
         * Used to store the actual height of the source of this texture
         *
         * @readonly
         * @member {number}
         */
        _this.realHeight = 100;

        /**
         * The scale mode to apply when scaling this texture
         *
         * @member {number}
         * @default PIXI.SCALE_MODES.DEFAULT
         * @see PIXI.SCALE_MODES
         */
        _this.scaleMode = scaleMode || _const.SCALE_MODES.DEFAULT;

        /**
         * Set to true once the base texture has successfully loaded.
         *
         * This is never true if the underlying source fails to load or has no texture data.
         *
         * @readonly
         * @member {boolean}
         */
        _this.hasLoaded = false;

        /**
         * Set to true if the source is currently loading.
         *
         * If an Image source is loading the 'loaded' or 'error' event will be
         * dispatched when the operation ends. An underyling source that is
         * immediately-available bypasses loading entirely.
         *
         * @readonly
         * @member {boolean}
         */
        _this.isLoading = false;

        /**
         * The image source that is used to create the texture.
         *
         * TODO: Make this a setter that calls loadSource();
         *
         * @readonly
         * @member {HTMLImageElement|HTMLCanvasElement}
         */
        _this.source = null; // set in loadSource, if at all

        /**
         * The image source that is used to create the texture. This is used to
         * store the original Svg source when it is replaced with a canvas element.
         *
         * TODO: Currently not in use but could be used when re-scaling svg.
         *
         * @readonly
         * @member {Image}
         */
        _this.origSource = null; // set in loadSvg, if at all

        /**
         * Type of image defined in source, eg. `png` or `svg`
         *
         * @readonly
         * @member {string}
         */
        _this.imageType = null; // set in updateImageType

        /**
         * Scale for source image. Used with Svg images to scale them before rasterization.
         *
         * @readonly
         * @member {number}
         */
        _this.sourceScale = 1.0;

        /**
         * Controls if RGB channels should be pre-multiplied by Alpha  (WebGL only)
         * All blend modes, and shaders written for default value. Change it on your own risk.
         *
         * @member {boolean}
         * @default true
         */
        _this.premultipliedAlpha = true;

        /**
         * The image url of the texture
         *
         * @member {string}
         */
        _this.imageUrl = null;

        /**
         * Wether or not the texture is a power of two, try to use power of two textures as much
         * as you can
         *
         * @private
         * @member {boolean}
         */
        _this.isPowerOfTwo = false;

        // used for webGL

        /**
         *
         * Set this to true if a mipmap of this texture needs to be generated. This value needs
         * to be set before the texture is used
         * Also the texture must be a power of two size to work
         *
         * @member {boolean}
         * @see PIXI.MIPMAP_TEXTURES
         */
        _this.mipmap = _const.MIPMAP_TEXTURES;

        /**
         *
         * WebGL Texture wrap mode
         *
         * @member {number}
         * @see PIXI.WRAP_MODES
         */
        _this.wrapMode = _const.WRAP_MODES.DEFAULT;

        /**
         * A map of renderer IDs to webgl textures
         *
         * @private
         * @member {object<number, WebGLTexture>}
         */
        _this._glTextures = {};
        _this._enabled = 0;
        _this._id = 0;

        // if no source passed don't try to load
        if (source) {
            _this.loadSource(source);
        }

        /**
         * Fired when a not-immediately-available source finishes loading.
         *
         * @protected
         * @event loaded
         * @memberof PIXI.BaseTexture#
         */

        /**
         * Fired when a not-immediately-available source fails to load.
         *
         * @protected
         * @event error
         * @memberof PIXI.BaseTexture#
         */
        return _this;
    }

    /**
     * Updates the texture on all the webgl renderers, this also assumes the src has changed.
     *
     * @fires update
     */


    BaseTexture.prototype.update = function update() {
        // Svg size is handled during load
        if (this.imageType !== 'svg') {
            this.realWidth = this.source.naturalWidth || this.source.videoWidth || this.source.width;
            this.realHeight = this.source.naturalHeight || this.source.videoHeight || this.source.height;

            this.width = this.realWidth / this.resolution;
            this.height = this.realHeight / this.resolution;

            this.isPowerOfTwo = _bitTwiddle2.default.isPow2(this.realWidth) && _bitTwiddle2.default.isPow2(this.realHeight);
        }

        this.emit('update', this);
    };

    /**
     * Load a source.
     *
     * If the source is not-immediately-available, such as an image that needs to be
     * downloaded, then the 'loaded' or 'error' event will be dispatched in the future
     * and `hasLoaded` will remain false after this call.
     *
     * The logic state after calling `loadSource` directly or indirectly (eg. `fromImage`, `new BaseTexture`) is:
     *
     *     if (texture.hasLoaded) {
     *        // texture ready for use
     *     } else if (texture.isLoading) {
     *        // listen to 'loaded' and/or 'error' events on texture
     *     } else {
     *        // not loading, not going to load UNLESS the source is reloaded
     *        // (it may still make sense to listen to the events)
     *     }
     *
     * @protected
     * @param {HTMLImageElement|HTMLCanvasElement} source - the source object of the texture.
     */


    BaseTexture.prototype.loadSource = function loadSource(source) {
        var wasLoading = this.isLoading;

        this.hasLoaded = false;
        this.isLoading = false;

        if (wasLoading && this.source) {
            this.source.onload = null;
            this.source.onerror = null;
        }

        var firstSourceLoaded = !this.source;

        this.source = source;

        // Apply source if loaded. Otherwise setup appropriate loading monitors.
        if ((source.src && source.complete || source.getContext) && source.width && source.height) {
            this._updateImageType();

            if (this.imageType === 'svg') {
                this._loadSvgSource();
            } else {
                this._sourceLoaded();
            }

            if (firstSourceLoaded) {
                // send loaded event if previous source was null and we have been passed a pre-loaded IMG element
                this.emit('loaded', this);
            }
        } else if (!source.getContext) {
            // Image fail / not ready
            this.isLoading = true;

            var scope = this;

            source.onload = function () {
                scope._updateImageType();
                source.onload = null;
                source.onerror = null;

                if (!scope.isLoading) {
                    return;
                }

                scope.isLoading = false;
                scope._sourceLoaded();

                if (scope.imageType === 'svg') {
                    scope._loadSvgSource();

                    return;
                }

                scope.emit('loaded', scope);
            };

            source.onerror = function () {
                source.onload = null;
                source.onerror = null;

                if (!scope.isLoading) {
                    return;
                }

                scope.isLoading = false;
                scope.emit('error', scope);
            };

            // Per http://www.w3.org/TR/html5/embedded-content-0.html#the-img-element
            //   "The value of `complete` can thus change while a script is executing."
            // So complete needs to be re-checked after the callbacks have been added..
            // NOTE: complete will be true if the image has no src so best to check if the src is set.
            if (source.complete && source.src) {
                // ..and if we're complete now, no need for callbacks
                source.onload = null;
                source.onerror = null;

                if (scope.imageType === 'svg') {
                    scope._loadSvgSource();

                    return;
                }

                this.isLoading = false;

                if (source.width && source.height) {
                    this._sourceLoaded();

                    // If any previous subscribers possible
                    if (wasLoading) {
                        this.emit('loaded', this);
                    }
                }
                // If any previous subscribers possible
                else if (wasLoading) {
                        this.emit('error', this);
                    }
            }
        }
    };

    /**
     * Updates type of the source image.
     */


    BaseTexture.prototype._updateImageType = function _updateImageType() {
        if (!this.imageUrl) {
            return;
        }

        var dataUri = (0, _utils.decomposeDataUri)(this.imageUrl);
        var imageType = void 0;

        if (dataUri && dataUri.mediaType === 'image') {
            // Check for subType validity
            var firstSubType = dataUri.subType.split('+')[0];

            imageType = (0, _utils.getUrlFileExtension)('.' + firstSubType);

            if (!imageType) {
                throw new Error('Invalid image type in data URI.');
            }
        } else {
            imageType = (0, _utils.getUrlFileExtension)(this.imageUrl);

            if (!imageType) {
                throw new Error('Invalid image type in URL.');
            }
        }

        this.imageType = imageType;
    };

    /**
     * Checks if `source` is an SVG image and whether it's loaded via a URL or a data URI. Then calls
     * `_loadSvgSourceUsingDataUri` or `_loadSvgSourceUsingXhr`.
     */


    BaseTexture.prototype._loadSvgSource = function _loadSvgSource() {
        if (this.imageType !== 'svg') {
            // Do nothing if source is not svg
            return;
        }

        var dataUri = (0, _utils.decomposeDataUri)(this.imageUrl);

        if (dataUri) {
            this._loadSvgSourceUsingDataUri(dataUri);
        } else {
            // We got an URL, so we need to do an XHR to check the svg size
            this._loadSvgSourceUsingXhr();
        }
    };

    /**
     * Reads an SVG string from data URI and then calls `_loadSvgSourceUsingString`.
     *
     * @param {string} dataUri - The data uri to load from.
     */


    BaseTexture.prototype._loadSvgSourceUsingDataUri = function _loadSvgSourceUsingDataUri(dataUri) {
        var svgString = void 0;

        if (dataUri.encoding === 'base64') {
            if (!atob) {
                throw new Error('Your browser doesn\'t support base64 conversions.');
            }
            svgString = atob(dataUri.data);
        } else {
            svgString = dataUri.data;
        }

        this._loadSvgSourceUsingString(svgString);
    };

    /**
     * Loads an SVG string from `imageUrl` using XHR and then calls `_loadSvgSourceUsingString`.
     */


    BaseTexture.prototype._loadSvgSourceUsingXhr = function _loadSvgSourceUsingXhr() {
        var _this2 = this;

        var svgXhr = new XMLHttpRequest();

        // This throws error on IE, so SVG Document can't be used
        // svgXhr.responseType = 'document';

        // This is not needed since we load the svg as string (breaks IE too)
        // but overrideMimeType() can be used to force the response to be parsed as XML
        // svgXhr.overrideMimeType('image/svg+xml');

        svgXhr.onload = function () {
            if (svgXhr.readyState !== svgXhr.DONE || svgXhr.status !== 200) {
                throw new Error('Failed to load SVG using XHR.');
            }

            _this2._loadSvgSourceUsingString(svgXhr.response);
        };

        svgXhr.onerror = function () {
            return _this2.emit('error', _this2);
        };

        svgXhr.open('GET', this.imageUrl, true);
        svgXhr.send();
    };

    /**
     * Loads texture using an SVG string. The original SVG Image is stored as `origSource` and the
     * created canvas is the new `source`. The SVG is scaled using `sourceScale`. Called by
     * `_loadSvgSourceUsingXhr` or `_loadSvgSourceUsingDataUri`.
     *
     * @param  {string} svgString SVG source as string
     *
     * @fires loaded
     */


    BaseTexture.prototype._loadSvgSourceUsingString = function _loadSvgSourceUsingString(svgString) {
        var svgSize = (0, _utils.getSvgSize)(svgString);

        var svgWidth = svgSize.width;
        var svgHeight = svgSize.height;

        if (!svgWidth || !svgHeight) {
            throw new Error('The SVG image must have width and height defined (in pixels), canvas API needs them.');
        }

        // Scale realWidth and realHeight
        this.realWidth = Math.round(svgWidth * this.sourceScale);
        this.realHeight = Math.round(svgHeight * this.sourceScale);

        this.width = this.realWidth / this.resolution;
        this.height = this.realHeight / this.resolution;

        // Check pow2 after scale
        this.isPowerOfTwo = _bitTwiddle2.default.isPow2(this.realWidth) && _bitTwiddle2.default.isPow2(this.realHeight);

        // Create a canvas element
        var canvas = document.createElement('canvas');

        canvas.width = this.realWidth;
        canvas.height = this.realHeight;
        canvas._pixiId = 'canvas_' + (0, _utils.uid)();

        // Draw the Svg to the canvas
        canvas.getContext('2d').drawImage(this.source, 0, 0, svgWidth, svgHeight, 0, 0, this.realWidth, this.realHeight);

        // Replace the original source image with the canvas
        this.origSource = this.source;
        this.source = canvas;

        // Add also the canvas in cache (destroy clears by `imageUrl` and `source._pixiId`)
        _utils.BaseTextureCache[canvas._pixiId] = this;

        this.isLoading = false;
        this._sourceLoaded();
        this.emit('loaded', this);
    };

    /**
     * Used internally to update the width, height, and some other tracking vars once
     * a source has successfully loaded.
     *
     * @private
     */


    BaseTexture.prototype._sourceLoaded = function _sourceLoaded() {
        this.hasLoaded = true;
        this.update();
    };

    /**
     * Destroys this base texture
     *
     */


    BaseTexture.prototype.destroy = function destroy() {
        if (this.imageUrl) {
            delete _utils.BaseTextureCache[this.imageUrl];
            delete _utils.TextureCache[this.imageUrl];

            this.imageUrl = null;

            if (!navigator.isCocoonJS) {
                this.source.src = '';
            }
        }
        // An svg source has both `imageUrl` and `__pixiId`, so no `else if` here
        if (this.source && this.source._pixiId) {
            delete _utils.BaseTextureCache[this.source._pixiId];
        }

        this.source = null;

        this.dispose();
    };

    /**
     * Frees the texture from WebGL memory without destroying this texture object.
     * This means you can still use the texture later which will upload it to GPU
     * memory again.
     *
     */


    BaseTexture.prototype.dispose = function dispose() {
        this.emit('dispose', this);
    };

    /**
     * Changes the source image of the texture.
     * The original source must be an Image element.
     *
     * @param {string} newSrc - the path of the image
     */


    BaseTexture.prototype.updateSourceImage = function updateSourceImage(newSrc) {
        this.source.src = newSrc;

        this.loadSource(this.source);
    };

    /**
     * Helper function that creates a base texture from the given image url.
     * If the image is not in the base texture cache it will be created and loaded.
     *
     * @static
     * @param {string} imageUrl - The image url of the texture
     * @param {boolean} [crossorigin=(auto)] - Should use anonymous CORS? Defaults to true if the URL is not a data-URI.
     * @param {number} [scaleMode=PIXI.SCALE_MODES.DEFAULT] - See {@link PIXI.SCALE_MODES} for possible values
     * @param {number} [sourceScale=(auto)] - Scale for the original image, used with Svg images.
     * @return {PIXI.BaseTexture} The new base texture.
     */


    BaseTexture.fromImage = function fromImage(imageUrl, crossorigin, scaleMode, sourceScale) {
        var baseTexture = _utils.BaseTextureCache[imageUrl];

        if (!baseTexture) {
            // new Image() breaks tex loading in some versions of Chrome.
            // See https://code.google.com/p/chromium/issues/detail?id=238071
            var image = new Image(); // document.createElement('img');

            if (crossorigin === undefined && imageUrl.indexOf('data:') !== 0) {
                image.crossOrigin = (0, _determineCrossOrigin2.default)(imageUrl);
            }

            baseTexture = new BaseTexture(image, scaleMode);
            baseTexture.imageUrl = imageUrl;

            if (sourceScale) {
                baseTexture.sourceScale = sourceScale;
            }

            // if there is an @2x at the end of the url we are going to assume its a highres image
            baseTexture.resolution = (0, _utils.getResolutionOfUrl)(imageUrl);

            image.src = imageUrl; // Setting this triggers load

            _utils.BaseTextureCache[imageUrl] = baseTexture;
        }

        return baseTexture;
    };

    /**
     * Helper function that creates a base texture from the given canvas element.
     *
     * @static
     * @param {HTMLCanvasElement} canvas - The canvas element source of the texture
     * @param {number} scaleMode - See {@link PIXI.SCALE_MODES} for possible values
     * @return {PIXI.BaseTexture} The new base texture.
     */


    BaseTexture.fromCanvas = function fromCanvas(canvas, scaleMode) {
        if (!canvas._pixiId) {
            canvas._pixiId = 'canvas_' + (0, _utils.uid)();
        }

        var baseTexture = _utils.BaseTextureCache[canvas._pixiId];

        if (!baseTexture) {
            baseTexture = new BaseTexture(canvas, scaleMode);
            _utils.BaseTextureCache[canvas._pixiId] = baseTexture;
        }

        return baseTexture;
    };

    return BaseTexture;
}(_eventemitter2.default);

exports.default = BaseTexture;


game.BaseTexture.inject({
    _events: {},

    staticInit: function staticInit(source, loadCallback) {
        if (game.webgl) {
            this._glTextures = {};
            this._enabled = 0;
            this._id = 0;
            this._emitter = new _eventemitter2.default();
            this._premultipliedAlpha = true;
            this._scaleMode = game.Renderer.scaleMode === 'nearest' ? _const.SCALE_MODES.NEAREST : _const.SCALE_MODES.DEFAULT;
            this._mipmap = _const.MIPMAP_TEXTURES;
            this._wrapMode = _const.WRAP_MODES.DEFAULT;
        }
        this.super(source, loadCallback);
    },

    _onload: function _onload() {
        if (game.webgl) {
            this._hasLoaded = true;
            this._isPowerOfTwo = _bitTwiddle2.default.isPow2(this.width) && _bitTwiddle2.default.isPow2(this.height);
        }
        this.super();
        if (game.webgl) this._emit('update');
    },

    _on: function _on(event, callback, caller) {
        this._emitter.on(event, callback, caller);
    },

    _once: function _once(event, callback, caller) {
        this._emitter.once(event, callback, caller);
    },

    _off: function _off(event) {
        this._emitter.off(event);
    },

    _emit: function _emit(event, param) {
        this._emitter.emit(event, param || false);
    },

    _remove: function _remove() {
        this.super();
        if (game.webgl) this._emit('dispose', this);
    }
});

},{"../const":30,"../utils":101,"../utils/determineCrossOrigin":100,"bit-twiddle":1,"eventemitter3":4}],93:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _BaseRenderTexture = require('./BaseRenderTexture');

var _BaseRenderTexture2 = _interopRequireDefault(_BaseRenderTexture);

var _Texture2 = require('./Texture');

var _Texture3 = _interopRequireDefault(_Texture2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * A RenderTexture is a special texture that allows any Pixi display object to be rendered to it.
 *
 * __Hint__: All DisplayObjects (i.e. Sprites) that render to a RenderTexture should be preloaded
 * otherwise black rectangles will be drawn instead.
 *
 * A RenderTexture takes a snapshot of any Display Object given to its render method. The position
 * and rotation of the given Display Objects is ignored. For example:
 *
 * ```js
 * let renderer = PIXI.autoDetectRenderer(1024, 1024, { view: canvas, ratio: 1 });
 * let renderTexture = PIXI.RenderTexture.create(800, 600);
 * let sprite = PIXI.Sprite.fromImage("spinObj_01.png");
 *
 * sprite.position.x = 800/2;
 * sprite.position.y = 600/2;
 * sprite.anchor.x = 0.5;
 * sprite.anchor.y = 0.5;
 *
 * renderer.render(sprite, renderTexture);
 * ```
 *
 * The Sprite in this case will be rendered to a position of 0,0. To render this sprite at its actual
 * position a Container should be used:
 *
 * ```js
 * let doc = new PIXI.Container();
 *
 * doc.addChild(sprite);
 *
 * renderer.render(doc, renderTexture);  // Renders to center of renderTexture
 * ```
 *
 * @class
 * @extends PIXI.Texture
 * @memberof PIXI
 */
var RenderTexture = function (_Texture) {
    _inherits(RenderTexture, _Texture);

    /**
     * @param {PIXI.BaseRenderTexture} baseRenderTexture - The renderer used for this RenderTexture
     * @param {PIXI.Rectangle} [frame] - The rectangle frame of the texture to show
     */
    function RenderTexture(baseRenderTexture, frame) {
        _classCallCheck(this, RenderTexture);

        // suport for legacy..
        var _legacyRenderer = null;

        if (!(baseRenderTexture instanceof _BaseRenderTexture2.default)) {
            /* eslint-disable prefer-rest-params, no-console */
            var width = arguments[1];
            var height = arguments[2];
            var scaleMode = arguments[3] || 0;
            var resolution = arguments[4] || 1;

            // we have an old render texture..
            console.warn('Please use RenderTexture.create(' + width + ', ' + height + ') instead of the ctor directly.');
            _legacyRenderer = arguments[0];
            /* eslint-enable prefer-rest-params, no-console */

            frame = null;
            baseRenderTexture = new _BaseRenderTexture2.default(width, height, scaleMode, resolution);
        }

        /**
         * The base texture object that this texture uses
         *
         * @member {BaseTexture}
         */

        var _this = _possibleConstructorReturn(this, _Texture.call(this, baseRenderTexture, frame));

        _this.legacyRenderer = _legacyRenderer;

        /**
         * This will let the renderer know if the texture is valid. If it's not then it cannot be rendered.
         *
         * @member {boolean}
         */
        _this.valid = true;

        _this._updateUvs();
        return _this;
    }

    /**
     * Resizes the RenderTexture.
     *
     * @param {number} width - The width to resize to.
     * @param {number} height - The height to resize to.
     * @param {boolean} doNotResizeBaseTexture - Should the baseTexture.width and height values be resized as well?
     */


    RenderTexture.prototype.resize = function resize(width, height, doNotResizeBaseTexture) {
        // TODO - could be not required..
        this.valid = width > 0 && height > 0;

        this._frame.width = this.orig.width = width;
        this._frame.height = this.orig.height = height;

        if (!doNotResizeBaseTexture) {
            this.baseTexture.resize(width, height);
        }

        this._updateUvs();
    };

    /**
     * A short hand way of creating a render texture.
     *
     * @param {number} [width=100] - The width of the render texture
     * @param {number} [height=100] - The height of the render texture
     * @param {number} [scaleMode=PIXI.SCALE_MODES.DEFAULT] - See {@link PIXI.SCALE_MODES} for possible values
     * @param {number} [resolution=1] - The resolution / device pixel ratio of the texture being generated
     * @return {PIXI.RenderTexture} The new render texture
     */


    RenderTexture.create = function create(width, height, scaleMode, resolution) {
        return new RenderTexture(new _BaseRenderTexture2.default(width, height, scaleMode, resolution));
    };

    return RenderTexture;
}(_Texture3.default);

exports.default = RenderTexture;

},{"./BaseRenderTexture":91,"./Texture":94}],94:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BaseTexture = require('./BaseTexture');

var _BaseTexture2 = _interopRequireDefault(_BaseTexture);

var _VideoBaseTexture = require('./VideoBaseTexture');

var _VideoBaseTexture2 = _interopRequireDefault(_VideoBaseTexture);

var _TextureUvs = require('./TextureUvs');

var _TextureUvs2 = _interopRequireDefault(_TextureUvs);

var _eventemitter = require('eventemitter3');

var _eventemitter2 = _interopRequireDefault(_eventemitter);

var _math = require('../math');

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * A texture stores the information that represents an image or part of an image. It cannot be added
 * to the display list directly. Instead use it as the texture for a Sprite. If no frame is provided
 * then the whole image is used.
 *
 * You can directly create a texture from an image and then reuse it multiple times like this :
 *
 * ```js
 * let texture = PIXI.Texture.fromImage('assets/image.png');
 * let sprite1 = new PIXI.Sprite(texture);
 * let sprite2 = new PIXI.Sprite(texture);
 * ```
 *
 * Textures made from SVGs, loaded or not, cannot be used before the file finishes processing.
 * You can check for this by checking the sprite's _textureID property.
 * ```js
 * var texture = PIXI.Texture.fromImage('assets/image.svg');
 * var sprite1 = new PIXI.Sprite(texture);
 * //sprite1._textureID should not be undefined if the texture has finished processing the SVG file
 * ```
 * You can use a ticker or rAF to ensure your sprites load the finished textures after processing. See issue #3068.
 *
 * @class
 * @extends EventEmitter
 * @memberof PIXI
 */
var Texture = function (_EventEmitter) {
    _inherits(Texture, _EventEmitter);

    /**
     * @param {PIXI.BaseTexture} baseTexture - The base texture source to create the texture from
     * @param {PIXI.Rectangle} [frame] - The rectangle frame of the texture to show
     * @param {PIXI.Rectangle} [orig] - The area of original texture
     * @param {PIXI.Rectangle} [trim] - Trimmed rectangle of original texture
     * @param {number} [rotate] - indicates how the texture was rotated by texture packer. See {@link PIXI.GroupD8}
     */
    function Texture(baseTexture, frame, orig, trim, rotate) {
        _classCallCheck(this, Texture);

        /**
         * Does this Texture have any frame data assigned to it?
         *
         * @member {boolean}
         */
        var _this = _possibleConstructorReturn(this, _EventEmitter.call(this));

        _this.noFrame = false;

        if (!frame) {
            _this.noFrame = true;
            frame = new _math.Rectangle(0, 0, 1, 1);
        }

        if (baseTexture instanceof Texture) {
            baseTexture = baseTexture.baseTexture;
        }

        /**
         * The base texture that this texture uses.
         *
         * @member {PIXI.BaseTexture}
         */
        _this.baseTexture = baseTexture;

        /**
         * This is the area of the BaseTexture image to actually copy to the Canvas / WebGL when rendering,
         * irrespective of the actual frame size or placement (which can be influenced by trimmed texture atlases)
         *
         * @member {PIXI.Rectangle}
         */
        _this._frame = frame;

        /**
         * This is the trimmed area of original texture, before it was put in atlas
         *
         * @member {PIXI.Rectangle}
         */
        _this.trim = trim;

        /**
         * This will let the renderer know if the texture is valid. If it's not then it cannot be rendered.
         *
         * @member {boolean}
         */
        _this._valid = false;

        /**
         * This will let a renderer know that a texture has been updated (used mainly for webGL uv updates)
         *
         * @member {boolean}
         */
        _this.requiresUpdate = false;

        /**
         * The WebGL UV data cache.
         *
         * @member {PIXI.TextureUvs}
         * @private
         */
        _this._uvs = null;

        /**
         * This is the area of original texture, before it was put in atlas
         *
         * @member {PIXI.Rectangle}
         */
        _this.orig = orig || frame; // new Rectangle(0, 0, 1, 1);

        _this._rotate = Number(rotate || 0);

        if (rotate === true) {
            // this is old texturepacker legacy, some games/libraries are passing "true" for rotated textures
            _this._rotate = 2;
        } else if (_this._rotate % 2 !== 0) {
            throw new Error('attempt to use diamond-shaped UVs. If you are sure, set rotation manually');
        }

        if (baseTexture.hasLoaded) {
            if (_this.noFrame) {
                frame = new _math.Rectangle(0, 0, baseTexture.width, baseTexture.height);

                // if there is no frame we should monitor for any base texture changes..
                baseTexture.on('update', _this.onBaseTextureUpdated, _this);
            }
            _this.frame = frame;
        } else {
            baseTexture.once('loaded', _this.onBaseTextureLoaded, _this);
        }

        /**
         * Fired when the texture is updated. This happens if the frame or the baseTexture is updated.
         *
         * @event update
         * @memberof PIXI.Texture#
         * @protected
         */

        _this._updateID = 0;

        /**
         * Extra field for extra plugins. May contain clamp settings and some matrices
         * @type {Object}
         */
        _this.transform = null;
        return _this;
    }

    /**
     * Updates this texture on the gpu.
     *
     */


    Texture.prototype.update = function update() {
        this.baseTexture.update();
    };

    /**
     * Called when the base texture is loaded
     *
     * @private
     * @param {PIXI.BaseTexture} baseTexture - The base texture.
     */


    Texture.prototype.onBaseTextureLoaded = function onBaseTextureLoaded(baseTexture) {
        this._updateID++;

        // TODO this code looks confusing.. boo to abusing getters and setterss!
        if (this.noFrame) {
            this.frame = new _math.Rectangle(0, 0, baseTexture.width, baseTexture.height);
        } else {
            this.frame = this._frame;
        }

        this.baseTexture.on('update', this.onBaseTextureUpdated, this);
        this.emit('update', this);
    };

    /**
     * Called when the base texture is updated
     *
     * @private
     * @param {PIXI.BaseTexture} baseTexture - The base texture.
     */


    Texture.prototype.onBaseTextureUpdated = function onBaseTextureUpdated(baseTexture) {
        this._updateID++;

        this._frame.width = baseTexture.width;
        this._frame.height = baseTexture.height;

        this.emit('update', this);
    };

    /**
     * Destroys this texture
     *
     * @param {boolean} [destroyBase=false] Whether to destroy the base texture as well
     */


    Texture.prototype.destroy = function destroy(destroyBase) {
        if (this.baseTexture) {
            if (destroyBase) {
                // delete the texture if it exists in the texture cache..
                // this only needs to be removed if the base texture is actually destoryed too..
                if (_utils.TextureCache[this.baseTexture.imageUrl]) {
                    delete _utils.TextureCache[this.baseTexture.imageUrl];
                }

                this.baseTexture.destroy();
            }

            this.baseTexture.off('update', this.onBaseTextureUpdated, this);
            this.baseTexture.off('loaded', this.onBaseTextureLoaded, this);

            this.baseTexture = null;
        }

        this._frame = null;
        this._uvs = null;
        this.trim = null;
        this.orig = null;

        this._valid = false;

        this.off('dispose', this.dispose, this);
        this.off('update', this.update, this);
    };

    /**
     * Creates a new texture object that acts the same as this one.
     *
     * @return {PIXI.Texture} The new texture
     */


    Texture.prototype.clone = function clone() {
        return new Texture(this.baseTexture, this.frame, this.orig, this.trim, this.rotate);
    };

    /**
     * Updates the internal WebGL UV cache.
     *
     * @protected
     */


    Texture.prototype._updateUvs = function _updateUvs() {
        if (!this._uvs) {
            this._uvs = new _TextureUvs2.default();
        }

        this._uvs.set(this._frame, this.baseTexture, this.rotate);

        this._updateID++;
    };

    /**
     * Helper function that creates a Texture object from the given image url.
     * If the image is not in the texture cache it will be  created and loaded.
     *
     * @static
     * @param {string} imageUrl - The image url of the texture
     * @param {boolean} [crossorigin] - Whether requests should be treated as crossorigin
     * @param {number} [scaleMode=PIXI.SCALE_MODES.DEFAULT] - See {@link PIXI.SCALE_MODES} for possible values
     * @param {number} [sourceScale=(auto)] - Scale for the original image, used with SVG images.
     * @return {PIXI.Texture} The newly created texture
     */


    Texture.fromImage = function fromImage(imageUrl, crossorigin, scaleMode, sourceScale) {
        var texture = _utils.TextureCache[imageUrl];

        if (!texture) {
            texture = new Texture(_BaseTexture2.default.fromImage(imageUrl, crossorigin, scaleMode, sourceScale));
            _utils.TextureCache[imageUrl] = texture;
        }

        return texture;
    };

    /**
     * Helper function that creates a sprite that will contain a texture from the TextureCache based on the frameId
     * The frame ids are created when a Texture packer file has been loaded
     *
     * @static
     * @param {string} frameId - The frame Id of the texture in the cache
     * @return {PIXI.Texture} The newly created texture
     */


    Texture.fromFrame = function fromFrame(frameId) {
        var texture = _utils.TextureCache[frameId];

        if (!texture) {
            throw new Error('The frameId "' + frameId + '" does not exist in the texture cache');
        }

        return texture;
    };

    /**
     * Helper function that creates a new Texture based on the given canvas element.
     *
     * @static
     * @param {HTMLCanvasElement} canvas - The canvas element source of the texture
     * @param {number} [scaleMode=PIXI.SCALE_MODES.DEFAULT] - See {@link PIXI.SCALE_MODES} for possible values
     * @return {PIXI.Texture} The newly created texture
     */


    Texture.fromCanvas = function fromCanvas(canvas, scaleMode) {
        return new Texture(_BaseTexture2.default.fromCanvas(canvas, scaleMode));
    };

    /**
     * Helper function that creates a new Texture based on the given video element.
     *
     * @static
     * @param {HTMLVideoElement|string} video - The URL or actual element of the video
     * @param {number} [scaleMode=PIXI.SCALE_MODES.DEFAULT] - See {@link PIXI.SCALE_MODES} for possible values
     * @return {PIXI.Texture} The newly created texture
     */


    Texture.fromVideo = function fromVideo(video, scaleMode) {
        if (typeof video === 'string') {
            return Texture.fromVideoUrl(video, scaleMode);
        }

        return new Texture(_VideoBaseTexture2.default.fromVideo(video, scaleMode));
    };

    /**
     * Helper function that creates a new Texture based on the video url.
     *
     * @static
     * @param {string} videoUrl - URL of the video
     * @param {number} [scaleMode=PIXI.SCALE_MODES.DEFAULT] - See {@link PIXI.SCALE_MODES} for possible values
     * @return {PIXI.Texture} The newly created texture
     */


    Texture.fromVideoUrl = function fromVideoUrl(videoUrl, scaleMode) {
        return new Texture(_VideoBaseTexture2.default.fromUrl(videoUrl, scaleMode));
    };

    /**
     * Helper function that creates a new Texture based on the source you provide.
     * The soucre can be - frame id, image url, video url, canvae element, video element, base texture
     *
     * @static
     * @param {number|string|PIXI.BaseTexture|HTMLCanvasElement|HTMLVideoElement} source - Source to create texture from
     * @return {PIXI.Texture} The newly created texture
     */


    Texture.from = function from(source) {
        // TODO auto detect cross origin..
        // TODO pass in scale mode?
        if (typeof source === 'string') {
            var texture = _utils.TextureCache[source];

            if (!texture) {
                // check if its a video..
                var isVideo = source.match(/\.(mp4|webm|ogg|h264|avi|mov)$/) !== null;

                if (isVideo) {
                    return Texture.fromVideoUrl(source);
                }

                return Texture.fromImage(source);
            }

            return texture;
        } else if (source instanceof HTMLImageElement) {
            return new Texture(new _BaseTexture2.default(source));
        } else if (source instanceof HTMLCanvasElement) {
            return Texture.fromCanvas(source);
        } else if (source instanceof HTMLVideoElement) {
            return Texture.fromVideo(source);
        } else if (source instanceof _BaseTexture2.default) {
            return new Texture(source);
        }

        // lets assume its a texture!
        return source;
    };

    /**
     * Adds a texture to the global TextureCache. This cache is shared across the whole PIXI object.
     *
     * @static
     * @param {PIXI.Texture} texture - The Texture to add to the cache.
     * @param {string} id - The id that the texture will be stored against.
     */


    Texture.addTextureToCache = function addTextureToCache(texture, id) {
        _utils.TextureCache[id] = texture;
    };

    /**
     * Remove a texture from the global TextureCache.
     *
     * @static
     * @param {string} id - The id of the texture to be removed
     * @return {PIXI.Texture} The texture that was removed
     */


    Texture.removeTextureFromCache = function removeTextureFromCache(id) {
        var texture = _utils.TextureCache[id];

        delete _utils.TextureCache[id];
        delete _utils.BaseTextureCache[id];

        return texture;
    };

    /**
     * The frame specifies the region of the base texture that this texture uses.
     *
     * @member {PIXI.Rectangle}
     * @memberof PIXI.Texture#
     */


    _createClass(Texture, [{
        key: 'frame',
        get: function get() {
            return this._frame;
        }

        /**
         * Set the frame.
         *
         * @param {Rectangle} frame - The new frame to set.
         */
        ,
        set: function set(frame) {
            this._frame = frame;

            this.noFrame = false;

            if (frame.x + frame.width > this.baseTexture.width || frame.y + frame.height > this.baseTexture.height) {
                throw new Error('Texture Error: frame does not fit inside the base Texture dimensions ' + this);
            }

            // this._valid = frame && frame.width && frame.height && this.baseTexture.source && this.baseTexture.hasLoaded;
            this._valid = frame && frame.width && frame.height && this.baseTexture.hasLoaded;

            if (!this.trim && !this.rotate) {
                this.orig = frame;
            }

            if (this._valid) {
                this._updateUvs();
            }
        }

        /**
         * Indicates whether the texture is rotated inside the atlas
         * set to 2 to compensate for texture packer rotation
         * set to 6 to compensate for spine packer rotation
         * can be used to rotate or mirror sprites
         * See {@link PIXI.GroupD8} for explanation
         *
         * @member {number}
         */

    }, {
        key: 'rotate',
        get: function get() {
            return this._rotate;
        }

        /**
         * Set the rotation
         *
         * @param {number} rotate - The new rotation to set.
         */
        ,
        set: function set(rotate) {
            this._rotate = rotate;
            if (this._valid) {
                this._updateUvs();
            }
        }

        /**
         * The width of the Texture in pixels.
         *
         * @member {number}
         */

    }, {
        key: 'width',
        get: function get() {
            return this.orig ? this.orig.width : 0;
        }

        /**
         * The height of the Texture in pixels.
         *
         * @member {number}
         */

    }, {
        key: 'height',
        get: function get() {
            return this.orig ? this.orig.height : 0;
        }
    }]);

    return Texture;
}(_eventemitter2.default);

/**
 * An empty texture, used often to not have to create multiple empty textures.
 * Can not be destroyed.
 *
 * @static
 * @constant
 */


exports.default = Texture;
Texture.EMPTY = new Texture(new _BaseTexture2.default());
Texture.EMPTY.destroy = function _emptyDestroy() {/* empty */};
Texture.EMPTY.on = function _emptyOn() {/* empty */};
Texture.EMPTY.once = function _emptyOnce() {/* empty */};
Texture.EMPTY.emit = function _emptyEmit() {/* empty */};

game.Texture.inject({
    staticInit: function staticInit(baseTexture, x, y, width, height, rotate) {
        this.super(baseTexture, x, y, width, height);
        if (!game.webgl) return;
        this._frame = new _math.Rectangle(0, 0, 1, 1);
        this._updateID = 0;
        this._updateUvs();
        this._valid = true;
        this._orig = this.baseTexture;
        this._rotate = rotate || 0;
    },

    _updateUvs: function _updateUvs() {
        if (!this._uvs) this._uvs = new _TextureUvs2.default();

        this._frame.x = this.position.x;
        this._frame.y = this.position.y;
        this._frame.width = this.width;
        this._frame.height = this.height;

        this._uvs.set(this._frame, this.baseTexture, this._rotate);

        this._updateID++;
    }
});

},{"../math":53,"../utils":101,"./BaseTexture":92,"./TextureUvs":95,"./VideoBaseTexture":96,"eventemitter3":4}],95:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _GroupD = require('../math/GroupD8');

var _GroupD2 = _interopRequireDefault(_GroupD);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * A standard object to store the Uvs of a texture
 *
 * @class
 * @private
 * @memberof PIXI
 */
var TextureUvs = function () {
    /**
     *
     */
    function TextureUvs() {
        _classCallCheck(this, TextureUvs);

        this.x0 = 0;
        this.y0 = 0;

        this.x1 = 1;
        this.y1 = 0;

        this.x2 = 1;
        this.y2 = 1;

        this.x3 = 0;
        this.y3 = 1;

        this.uvsUint32 = new Uint32Array(4);
    }

    /**
     * Sets the texture Uvs based on the given frame information.
     *
     * @private
     * @param {PIXI.Rectangle} frame - The frame of the texture
     * @param {PIXI.Rectangle} baseFrame - The base frame of the texture
     * @param {number} rotate - Rotation of frame, see {@link PIXI.GroupD8}
     */


    TextureUvs.prototype.set = function set(frame, baseFrame, rotate) {
        var tw = baseFrame.width;
        var th = baseFrame.height;

        if (rotate) {
            // width and height div 2 div baseFrame size
            var w2 = frame.width / 2 / tw;
            var h2 = frame.height / 2 / th;

            // coordinates of center
            var cX = frame.x / tw + w2;
            var cY = frame.y / th + h2;

            rotate = _GroupD2.default.add(rotate, _GroupD2.default.NW); // NW is top-left corner
            this.x0 = cX + w2 * _GroupD2.default.uX(rotate);
            this.y0 = cY + h2 * _GroupD2.default.uY(rotate);

            rotate = _GroupD2.default.add(rotate, 2); // rotate 90 degrees clockwise
            this.x1 = cX + w2 * _GroupD2.default.uX(rotate);
            this.y1 = cY + h2 * _GroupD2.default.uY(rotate);

            rotate = _GroupD2.default.add(rotate, 2);
            this.x2 = cX + w2 * _GroupD2.default.uX(rotate);
            this.y2 = cY + h2 * _GroupD2.default.uY(rotate);

            rotate = _GroupD2.default.add(rotate, 2);
            this.x3 = cX + w2 * _GroupD2.default.uX(rotate);
            this.y3 = cY + h2 * _GroupD2.default.uY(rotate);
        } else {
            this.x0 = frame.x / tw;
            this.y0 = frame.y / th;

            this.x1 = (frame.x + frame.width) / tw;
            this.y1 = frame.y / th;

            this.x2 = (frame.x + frame.width) / tw;
            this.y2 = (frame.y + frame.height) / th;

            this.x3 = frame.x / tw;
            this.y3 = (frame.y + frame.height) / th;
        }

        this.uvsUint32[0] = (this.y0 * 65535 & 0xFFFF) << 16 | this.x0 * 65535 & 0xFFFF;
        this.uvsUint32[1] = (this.y1 * 65535 & 0xFFFF) << 16 | this.x1 * 65535 & 0xFFFF;
        this.uvsUint32[2] = (this.y2 * 65535 & 0xFFFF) << 16 | this.x2 * 65535 & 0xFFFF;
        this.uvsUint32[3] = (this.y3 * 65535 & 0xFFFF) << 16 | this.x3 * 65535 & 0xFFFF;
    };

    return TextureUvs;
}();

exports.default = TextureUvs;

},{"../math/GroupD8":49}],96:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BaseTexture2 = require('./BaseTexture');

var _BaseTexture3 = _interopRequireDefault(_BaseTexture2);

var _utils = require('../utils');

var _ticker = require('../ticker');

var ticker = _interopRequireWildcard(_ticker);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * A texture of a [playing] Video.
 *
 * Video base textures mimic Pixi BaseTexture.from.... method in their creation process.
 *
 * This can be used in several ways, such as:
 *
 * ```js
 * let texture = PIXI.VideoBaseTexture.fromUrl('http://mydomain.com/video.mp4');
 *
 * let texture = PIXI.VideoBaseTexture.fromUrl({ src: 'http://mydomain.com/video.mp4', mime: 'video/mp4' });
 *
 * let texture = PIXI.VideoBaseTexture.fromUrls(['/video.webm', '/video.mp4']);
 *
 * let texture = PIXI.VideoBaseTexture.fromUrls([
 *     { src: '/video.webm', mime: 'video/webm' },
 *     { src: '/video.mp4', mime: 'video/mp4' }
 * ]);
 * ```
 *
 * See the ["deus" demo](http://www.goodboydigital.com/pixijs/examples/deus/).
 *
 * @class
 * @extends PIXI.BaseTexture
 * @memberof PIXI
 */
var VideoBaseTexture = function (_BaseTexture) {
    _inherits(VideoBaseTexture, _BaseTexture);

    /**
     * @param {HTMLVideoElement} source - Video source
     * @param {number} [scaleMode=PIXI.SCALE_MODES.DEFAULT] - See {@link PIXI.SCALE_MODES} for possible values
     */
    function VideoBaseTexture(source, scaleMode) {
        _classCallCheck(this, VideoBaseTexture);

        if (!source) {
            throw new Error('No video source element specified.');
        }

        // hook in here to check if video is already available.
        // BaseTexture looks for a source.complete boolean, plus width & height.

        if ((source.readyState === source.HAVE_ENOUGH_DATA || source.readyState === source.HAVE_FUTURE_DATA) && source.width && source.height) {
            source.complete = true;
        }

        var _this = _possibleConstructorReturn(this, _BaseTexture.call(this, source, scaleMode));

        _this.width = source.videoWidth;
        _this.height = source.videoHeight;

        _this._autoUpdate = true;
        _this._isAutoUpdating = false;

        /**
         * When set to true will automatically play videos used by this texture once
         * they are loaded. If false, it will not modify the playing state.
         *
         * @member {boolean}
         * @default true
         */
        _this.autoPlay = true;

        _this.update = _this.update.bind(_this);
        _this._onCanPlay = _this._onCanPlay.bind(_this);

        source.addEventListener('play', _this._onPlayStart.bind(_this));
        source.addEventListener('pause', _this._onPlayStop.bind(_this));
        _this.hasLoaded = false;
        _this.__loaded = false;

        if (!_this._isSourceReady()) {
            source.addEventListener('canplay', _this._onCanPlay);
            source.addEventListener('canplaythrough', _this._onCanPlay);
        } else {
            _this._onCanPlay();
        }
        return _this;
    }

    /**
     * Returns true if the underlying source is playing.
     *
     * @private
     * @return {boolean} True if playing.
     */


    VideoBaseTexture.prototype._isSourcePlaying = function _isSourcePlaying() {
        var source = this.source;

        return source.currentTime > 0 && source.paused === false && source.ended === false && source.readyState > 2;
    };

    /**
     * Returns true if the underlying source is ready for playing.
     *
     * @private
     * @return {boolean} True if ready.
     */


    VideoBaseTexture.prototype._isSourceReady = function _isSourceReady() {
        return this.source.readyState === 3 || this.source.readyState === 4;
    };

    /**
     * Runs the update loop when the video is ready to play
     *
     * @private
     */


    VideoBaseTexture.prototype._onPlayStart = function _onPlayStart() {
        // Just in case the video has not recieved its can play even yet..
        if (!this.hasLoaded) {
            this._onCanPlay();
        }

        if (!this._isAutoUpdating && this.autoUpdate) {
            ticker.shared.add(this.update, this);
            this._isAutoUpdating = true;
        }
    };

    /**
     * Fired when a pause event is triggered, stops the update loop
     *
     * @private
     */


    VideoBaseTexture.prototype._onPlayStop = function _onPlayStop() {
        if (this._isAutoUpdating) {
            ticker.shared.remove(this.update, this);
            this._isAutoUpdating = false;
        }
    };

    /**
     * Fired when the video is loaded and ready to play
     *
     * @private
     */


    VideoBaseTexture.prototype._onCanPlay = function _onCanPlay() {
        this.hasLoaded = true;

        if (this.source) {
            this.source.removeEventListener('canplay', this._onCanPlay);
            this.source.removeEventListener('canplaythrough', this._onCanPlay);

            this.width = this.source.videoWidth;
            this.height = this.source.videoHeight;

            // prevent multiple loaded dispatches..
            if (!this.__loaded) {
                this.__loaded = true;
                this.emit('loaded', this);
            }

            if (this._isSourcePlaying()) {
                this._onPlayStart();
            } else if (this.autoPlay) {
                this.source.play();
            }
        }
    };

    /**
     * Destroys this texture
     *
     */


    VideoBaseTexture.prototype.destroy = function destroy() {
        if (this._isAutoUpdating) {
            ticker.shared.remove(this.update, this);
        }

        if (this.source && this.source._pixiId) {
            delete _utils.BaseTextureCache[this.source._pixiId];
            delete this.source._pixiId;
        }

        _BaseTexture.prototype.destroy.call(this);
    };

    /**
     * Mimic Pixi BaseTexture.from.... method.
     *
     * @static
     * @param {HTMLVideoElement} video - Video to create texture from
     * @param {number} [scaleMode=PIXI.SCALE_MODES.DEFAULT] - See {@link PIXI.SCALE_MODES} for possible values
     * @return {PIXI.VideoBaseTexture} Newly created VideoBaseTexture
     */


    VideoBaseTexture.fromVideo = function fromVideo(video, scaleMode) {
        if (!video._pixiId) {
            video._pixiId = 'video_' + (0, _utils.uid)();
        }

        var baseTexture = _utils.BaseTextureCache[video._pixiId];

        if (!baseTexture) {
            baseTexture = new VideoBaseTexture(video, scaleMode);
            _utils.BaseTextureCache[video._pixiId] = baseTexture;
        }

        return baseTexture;
    };

    /**
     * Helper function that creates a new BaseTexture based on the given video element.
     * This BaseTexture can then be used to create a texture
     *
     * @static
     * @param {string|object|string[]|object[]} videoSrc - The URL(s) for the video.
     * @param {string} [videoSrc.src] - One of the source urls for the video
     * @param {string} [videoSrc.mime] - The mimetype of the video (e.g. 'video/mp4'). If not specified
     *  the url's extension will be used as the second part of the mime type.
     * @param {number} scaleMode - See {@link PIXI.SCALE_MODES} for possible values
     * @return {PIXI.VideoBaseTexture} Newly created VideoBaseTexture
     */


    VideoBaseTexture.fromUrl = function fromUrl(videoSrc, scaleMode) {
        var video = document.createElement('video');

        video.setAttribute('webkit-playsinline', '');
        video.setAttribute('playsinline', '');

        // array of objects or strings
        if (Array.isArray(videoSrc)) {
            for (var i = 0; i < videoSrc.length; ++i) {
                video.appendChild(createSource(videoSrc[i].src || videoSrc[i], videoSrc[i].mime));
            }
        }
        // single object or string
        else {
                video.appendChild(createSource(videoSrc.src || videoSrc, videoSrc.mime));
            }

        video.load();

        return VideoBaseTexture.fromVideo(video, scaleMode);
    };

    /**
     * Should the base texture automatically update itself, set to true by default
     *
     * @member {boolean}
     * @memberof PIXI.VideoBaseTexture#
     */


    _createClass(VideoBaseTexture, [{
        key: 'autoUpdate',
        get: function get() {
            return this._autoUpdate;
        }

        /**
         * Sets autoUpdate property.
         *
         * @param {number} value - enable auto update or not
         */
        ,
        set: function set(value) {
            if (value !== this._autoUpdate) {
                this._autoUpdate = value;

                if (!this._autoUpdate && this._isAutoUpdating) {
                    ticker.shared.remove(this.update, this);
                    this._isAutoUpdating = false;
                } else if (this._autoUpdate && !this._isAutoUpdating) {
                    ticker.shared.add(this.update, this);
                    this._isAutoUpdating = true;
                }
            }
        }
    }]);

    return VideoBaseTexture;
}(_BaseTexture3.default);

exports.default = VideoBaseTexture;


VideoBaseTexture.fromUrls = VideoBaseTexture.fromUrl;

function createSource(path, type) {
    if (!type) {
        type = 'video/' + path.substr(path.lastIndexOf('.') + 1);
    }

    var source = document.createElement('source');

    source.src = path;
    source.type = type;

    return source;
}

},{"../ticker":98,"../utils":101,"./BaseTexture":92}],97:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _const = require('../const');

var _eventemitter = require('eventemitter3');

var _eventemitter2 = _interopRequireDefault(_eventemitter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Internal event used by composed emitter
var TICK = 'tick';

/**
 * A Ticker class that runs an update loop that other objects listen to.
 * This class is composed around an EventEmitter object to add listeners
 * meant for execution on the next requested animation frame.
 * Animation frames are requested only when necessary,
 * e.g. When the ticker is started and the emitter has listeners.
 *
 * @class
 * @memberof PIXI.ticker
 */

var Ticker = function () {
    /**
     *
     */
    function Ticker() {
        var _this = this;

        _classCallCheck(this, Ticker);

        /**
         * Internal emitter used to fire 'tick' event
         * @private
         */
        this._emitter = new _eventemitter2.default();

        /**
         * Internal current frame request ID
         * @private
         */
        this._requestId = null;

        /**
         * Internal value managed by minFPS property setter and getter.
         * This is the maximum allowed milliseconds between updates.
         * @private
         */
        this._maxElapsedMS = 100;

        /**
         * Whether or not this ticker should invoke the method
         * {@link PIXI.ticker.Ticker#start} automatically
         * when a listener is added.
         *
         * @member {boolean}
         * @default false
         */
        this.autoStart = false;

        /**
         * Scalar time value from last frame to this frame.
         * This value is capped by setting {@link PIXI.ticker.Ticker#minFPS}
         * and is scaled with {@link PIXI.ticker.Ticker#speed}.
         * **Note:** The cap may be exceeded by scaling.
         *
         * @member {number}
         * @default 1
         */
        this.deltaTime = 1;

        /**
         * Time elapsed in milliseconds from last frame to this frame.
         * Opposed to what the scalar {@link PIXI.ticker.Ticker#deltaTime}
         * is based, this value is neither capped nor scaled.
         * If the platform supports DOMHighResTimeStamp,
         * this value will have a precision of 1 µs.
         *
         * @member {number}
         * @default 1 / TARGET_FPMS
         */
        this.elapsedMS = 1 / _const.TARGET_FPMS; // default to target frame time

        /**
         * The last time {@link PIXI.ticker.Ticker#update} was invoked.
         * This value is also reset internally outside of invoking
         * update, but only when a new animation frame is requested.
         * If the platform supports DOMHighResTimeStamp,
         * this value will have a precision of 1 µs.
         *
         * @member {number}
         * @default 0
         */
        this.lastTime = 0;

        /**
         * Factor of current {@link PIXI.ticker.Ticker#deltaTime}.
         * @example
         * // Scales ticker.deltaTime to what would be
         * // the equivalent of approximately 120 FPS
         * ticker.speed = 2;
         *
         * @member {number}
         * @default 1
         */
        this.speed = 1;

        /**
         * Whether or not this ticker has been started.
         * `true` if {@link PIXI.ticker.Ticker#start} has been called.
         * `false` if {@link PIXI.ticker.Ticker#stop} has been called.
         * While `false`, this value may change to `true` in the
         * event of {@link PIXI.ticker.Ticker#autoStart} being `true`
         * and a listener is added.
         *
         * @member {boolean}
         * @default false
         */
        this.started = false;

        /**
         * Internal tick method bound to ticker instance.
         * This is because in early 2015, Function.bind
         * is still 60% slower in high performance scenarios.
         * Also separating frame requests from update method
         * so listeners may be called at any time and with
         * any animation API, just invoke ticker.update(time).
         *
         * @private
         * @param {number} time - Time since last tick.
         */
        this._tick = function (time) {
            _this._requestId = null;

            if (_this.started) {
                // Invoke listeners now
                _this.update(time);
                // Listener side effects may have modified ticker state.
                if (_this.started && _this._requestId === null && _this._emitter.listeners(TICK, true)) {
                    _this._requestId = requestAnimationFrame(_this._tick);
                }
            }
        };
    }

    /**
     * Conditionally requests a new animation frame.
     * If a frame has not already been requested, and if the internal
     * emitter has listeners, a new frame is requested.
     *
     * @private
     */


    Ticker.prototype._requestIfNeeded = function _requestIfNeeded() {
        if (this._requestId === null && this._emitter.listeners(TICK, true)) {
            // ensure callbacks get correct delta
            this.lastTime = performance.now();
            this._requestId = requestAnimationFrame(this._tick);
        }
    };

    /**
     * Conditionally cancels a pending animation frame.
     *
     * @private
     */


    Ticker.prototype._cancelIfNeeded = function _cancelIfNeeded() {
        if (this._requestId !== null) {
            cancelAnimationFrame(this._requestId);
            this._requestId = null;
        }
    };

    /**
     * Conditionally requests a new animation frame.
     * If the ticker has been started it checks if a frame has not already
     * been requested, and if the internal emitter has listeners. If these
     * conditions are met, a new frame is requested. If the ticker has not
     * been started, but autoStart is `true`, then the ticker starts now,
     * and continues with the previous conditions to request a new frame.
     *
     * @private
     */


    Ticker.prototype._startIfPossible = function _startIfPossible() {
        if (this.started) {
            this._requestIfNeeded();
        } else if (this.autoStart) {
            this.start();
        }
    };

    /**
     * Calls {@link module:eventemitter3.EventEmitter#on} internally for the
     * internal 'tick' event. It checks if the emitter has listeners,
     * and if so it requests a new animation frame at this point.
     *
     * @param {Function} fn - The listener function to be added for updates
     * @param {Function} [context] - The listener context
     * @returns {PIXI.ticker.Ticker} This instance of a ticker
     */


    Ticker.prototype.add = function add(fn, context) {
        this._emitter.on(TICK, fn, context);

        this._startIfPossible();

        return this;
    };

    /**
     * Calls {@link module:eventemitter3.EventEmitter#once} internally for the
     * internal 'tick' event. It checks if the emitter has listeners,
     * and if so it requests a new animation frame at this point.
     *
     * @param {Function} fn - The listener function to be added for one update
     * @param {Function} [context] - The listener context
     * @returns {PIXI.ticker.Ticker} This instance of a ticker
     */


    Ticker.prototype.addOnce = function addOnce(fn, context) {
        this._emitter.once(TICK, fn, context);

        this._startIfPossible();

        return this;
    };

    /**
     * Calls {@link module:eventemitter3.EventEmitter#off} internally for 'tick' event.
     * It checks if the emitter has listeners for 'tick' event.
     * If it does, then it cancels the animation frame.
     *
     * @param {Function} [fn] - The listener function to be removed
     * @param {Function} [context] - The listener context to be removed
     * @returns {PIXI.ticker.Ticker} This instance of a ticker
     */


    Ticker.prototype.remove = function remove(fn, context) {
        this._emitter.off(TICK, fn, context);

        if (!this._emitter.listeners(TICK, true)) {
            this._cancelIfNeeded();
        }

        return this;
    };

    /**
     * Starts the ticker. If the ticker has listeners
     * a new animation frame is requested at this point.
     */


    Ticker.prototype.start = function start() {
        if (!this.started) {
            this.started = true;
            this._requestIfNeeded();
        }
    };

    /**
     * Stops the ticker. If the ticker has requested
     * an animation frame it is canceled at this point.
     */


    Ticker.prototype.stop = function stop() {
        if (this.started) {
            this.started = false;
            this._cancelIfNeeded();
        }
    };

    /**
     * Triggers an update. An update entails setting the
     * current {@link PIXI.ticker.Ticker#elapsedMS},
     * the current {@link PIXI.ticker.Ticker#deltaTime},
     * invoking all listeners with current deltaTime,
     * and then finally setting {@link PIXI.ticker.Ticker#lastTime}
     * with the value of currentTime that was provided.
     * This method will be called automatically by animation
     * frame callbacks if the ticker instance has been started
     * and listeners are added.
     *
     * @param {number} [currentTime=performance.now()] - the current time of execution
     */


    Ticker.prototype.update = function update() {
        var currentTime = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : performance.now();

        var elapsedMS = void 0;

        // If the difference in time is zero or negative, we ignore most of the work done here.
        // If there is no valid difference, then should be no reason to let anyone know about it.
        // A zero delta, is exactly that, nothing should update.
        //
        // The difference in time can be negative, and no this does not mean time traveling.
        // This can be the result of a race condition between when an animation frame is requested
        // on the current JavaScript engine event loop, and when the ticker's start method is invoked
        // (which invokes the internal _requestIfNeeded method). If a frame is requested before
        // _requestIfNeeded is invoked, then the callback for the animation frame the ticker requests,
        // can receive a time argument that can be less than the lastTime value that was set within
        // _requestIfNeeded. This difference is in microseconds, but this is enough to cause problems.
        //
        // This check covers this browser engine timing issue, as well as if consumers pass an invalid
        // currentTime value. This may happen if consumers opt-out of the autoStart, and update themselves.

        if (currentTime > this.lastTime) {
            // Save uncapped elapsedMS for measurement
            elapsedMS = this.elapsedMS = currentTime - this.lastTime;

            // cap the milliseconds elapsed used for deltaTime
            if (elapsedMS > this._maxElapsedMS) {
                elapsedMS = this._maxElapsedMS;
            }

            this.deltaTime = elapsedMS * _const.TARGET_FPMS * this.speed;

            // Invoke listeners added to internal emitter
            this._emitter.emit(TICK, this.deltaTime);
        } else {
            this.deltaTime = this.elapsedMS = 0;
        }

        this.lastTime = currentTime;
    };

    /**
     * The frames per second at which this ticker is running.
     * The default is approximately 60 in most modern browsers.
     * **Note:** This does not factor in the value of
     * {@link PIXI.ticker.Ticker#speed}, which is specific
     * to scaling {@link PIXI.ticker.Ticker#deltaTime}.
     *
     * @memberof PIXI.ticker.Ticker#
     * @readonly
     */


    _createClass(Ticker, [{
        key: 'FPS',
        get: function get() {
            return 1000 / this.elapsedMS;
        }

        /**
         * Manages the maximum amount of milliseconds allowed to
         * elapse between invoking {@link PIXI.ticker.Ticker#update}.
         * This value is used to cap {@link PIXI.ticker.Ticker#deltaTime},
         * but does not effect the measured value of {@link PIXI.ticker.Ticker#FPS}.
         * When setting this property it is clamped to a value between
         * `0` and `PIXI.TARGET_FPMS * 1000`.
         *
         * @memberof PIXI.ticker.Ticker#
         * @default 10
         */

    }, {
        key: 'minFPS',
        get: function get() {
            return 1000 / this._maxElapsedMS;
        }

        /**
         * Sets the min fps.
         *
         * @param {number} fps - value to set.
         */
        ,
        set: function set(fps) {
            // Clamp: 0 to TARGET_FPMS
            var minFPMS = Math.min(Math.max(0, fps) / 1000, _const.TARGET_FPMS);

            this._maxElapsedMS = 1 / minFPMS;
        }
    }]);

    return Ticker;
}();

exports.default = Ticker;

},{"../const":30,"eventemitter3":4}],98:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.Ticker = exports.shared = undefined;

var _Ticker = require('./Ticker');

var _Ticker2 = _interopRequireDefault(_Ticker);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * The shared ticker instance used by {@link PIXI.extras.MovieClip}.
 * and by {@link PIXI.interaction.InteractionManager}.
 * The property {@link PIXI.ticker.Ticker#autoStart} is set to `true`
 * for this instance. Please follow the examples for usage, including
 * how to opt-out of auto-starting the shared ticker.
 *
 * @example
 * let ticker = PIXI.ticker.shared;
 * // Set this to prevent starting this ticker when listeners are added.
 * // By default this is true only for the PIXI.ticker.shared instance.
 * ticker.autoStart = false;
 * // FYI, call this to ensure the ticker is stopped. It should be stopped
 * // if you have not attempted to render anything yet.
 * ticker.stop();
 * // Call this when you are ready for a running shared ticker.
 * ticker.start();
 *
 * @example
 * // You may use the shared ticker to render...
 * let renderer = PIXI.autoDetectRenderer(800, 600);
 * let stage = new PIXI.Container();
 * let interactionManager = PIXI.interaction.InteractionManager(renderer);
 * document.body.appendChild(renderer.view);
 * ticker.add(function (time) {
 *     renderer.render(stage);
 * });
 *
 * @example
 * // Or you can just update it manually.
 * ticker.autoStart = false;
 * ticker.stop();
 * function animate(time) {
 *     ticker.update(time);
 *     renderer.render(stage);
 *     requestAnimationFrame(animate);
 * }
 * animate(performance.now());
 *
 * @type {PIXI.ticker.Ticker}
 * @memberof PIXI.ticker
 */
var shared = new _Ticker2.default();

shared.autoStart = true;

/**
 * @namespace PIXI.ticker
 */
exports.shared = shared;
exports.Ticker = _Ticker2.default;

},{"./Ticker":97}],99:[function(require,module,exports){
"use strict";

exports.__esModule = true;
exports.default = createIndicesForQuads;
/**
 * Generic Mask Stack data structure
 *
 * @class
 * @memberof PIXI
 * @param {number} size - Number of quads
 * @return {Uint16Array} indices
 */
function createIndicesForQuads(size) {
    // the total number of indices in our array, there are 6 points per quad.

    var totalIndices = size * 6;

    var indices = new Uint16Array(totalIndices);

    // fill the indices with the quads to draw
    for (var i = 0, j = 0; i < totalIndices; i += 6, j += 4) {
        indices[i + 0] = j + 0;
        indices[i + 1] = j + 1;
        indices[i + 2] = j + 2;
        indices[i + 3] = j + 0;
        indices[i + 4] = j + 2;
        indices[i + 5] = j + 3;
    }

    return indices;
}

},{}],100:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.default = determineCrossOrigin;

var _url2 = require('url');

var _url3 = _interopRequireDefault(_url2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var tempAnchor = void 0;

/**
 * Sets the `crossOrigin` property for this resource based on if the url
 * for this resource is cross-origin. If crossOrigin was manually set, this
 * function does nothing.
 * Nipped from the resource loader!
 *
 * @ignore
 * @param {string} url - The url to test.
 * @param {object} [loc=window.location] - The location object to test against.
 * @return {string} The crossOrigin value to use (or empty string for none).
 */
function determineCrossOrigin(url) {
    var loc = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : window.location;

    // data: and javascript: urls are considered same-origin
    if (url.indexOf('data:') === 0) {
        return '';
    }

    // default is window.location
    loc = loc || window.location;

    if (!tempAnchor) {
        tempAnchor = document.createElement('a');
    }

    // let the browser determine the full href for the url of this resource and then
    // parse with the node url lib, we can't use the properties of the anchor element
    // because they don't work in IE9 :(
    tempAnchor.href = url;
    url = _url3.default.parse(tempAnchor.href);

    var samePort = !url.port && loc.port === '' || url.port === loc.port;

    // if cross origin
    if (url.hostname !== loc.hostname || !samePort || url.protocol !== loc.protocol) {
        return 'anonymous';
    }

    return '';
}

},{"url":27}],101:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.BaseTextureCache = exports.TextureCache = exports.pluginTarget = exports.EventEmitter = undefined;
exports.uid = uid;
exports.hex2rgb = hex2rgb;
exports.hex2string = hex2string;
exports.rgb2hex = rgb2hex;
exports.getResolutionOfUrl = getResolutionOfUrl;
exports.decomposeDataUri = decomposeDataUri;
exports.getUrlFileExtension = getUrlFileExtension;
exports.getSvgSize = getSvgSize;
exports.skipHello = skipHello;
exports.sayHello = sayHello;
exports.isWebGLSupported = isWebGLSupported;
exports.sign = sign;
exports.removeItems = removeItems;

var _const = require('../const');

var _eventemitter = require('eventemitter3');

var _eventemitter2 = _interopRequireDefault(_eventemitter);

var _pluginTarget = require('./pluginTarget');

var _pluginTarget2 = _interopRequireDefault(_pluginTarget);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var nextUid = 0;
var saidHello = false;

/**
 * @namespace PIXI.utils
 */
exports.EventEmitter = _eventemitter2.default;
exports.pluginTarget = _pluginTarget2.default;

/**
 * Gets the next unique identifier
 *
 * @memberof PIXI.utils
 * @return {number} The next unique identifier to use.
 */

function uid() {
    return ++nextUid;
}

/**
 * Converts a hex color number to an [R, G, B] array
 *
 * @memberof PIXI.utils
 * @param {number} hex - The number to convert
 * @param  {number[]} [out=[]] If supplied, this array will be used rather than returning a new one
 * @return {number[]} An array representing the [R, G, B] of the color.
 */
function hex2rgb(hex, out) {
    out = out || [];

    if (hex.length === 5) hex = hex + hex.substring(2);

    out[0] = (hex >> 16 & 0xFF) / 255;
    out[1] = (hex >> 8 & 0xFF) / 255;
    out[2] = (hex & 0xFF) / 255;

    return out;
}

/**
 * Converts a hex color number to a string.
 *
 * @memberof PIXI.utils
 * @param {number} hex - Number in hex
 * @return {string} The string color.
 */
function hex2string(hex) {
    hex = hex.toString(16);
    hex = '000000'.substr(0, 6 - hex.length) + hex;

    return '#' + hex;
}

/**
 * Converts a color as an [R, G, B] array to a hex number
 *
 * @memberof PIXI.utils
 * @param {number[]} rgb - rgb array
 * @return {number} The color number
 */
function rgb2hex(rgb) {
    return (rgb[0] * 255 << 16) + (rgb[1] * 255 << 8) + rgb[2] * 255;
}

/**
 * get the resolution / device pixel ratio of an asset by looking for the prefix
 * used by spritesheets and image urls
 *
 * @memberof PIXI.utils
 * @param {string} url - the image path
 * @return {number} resolution / device pixel ratio of an asset
 */
function getResolutionOfUrl(url) {
    var resolution = _const.RETINA_PREFIX.exec(url);

    if (resolution) {
        return parseFloat(resolution[1]);
    }

    return 1;
}

/**
 * Typedef for decomposeDataUri return object.
 *
 * @typedef {object} DecomposedDataUri
 * @property {mediaType} Media type, eg. `image`
 * @property {subType} Sub type, eg. `png`
 * @property {encoding} Data encoding, eg. `base64`
 * @property {data} The actual data
 */

/**
 * Split a data URI into components. Returns undefined if
 * parameter `dataUri` is not a valid data URI.
 *
 * @memberof PIXI.utils
 * @param {string} dataUri - the data URI to check
 * @return {DecomposedDataUri|undefined} The decomposed data uri or undefined
 */
function decomposeDataUri(dataUri) {
    var dataUriMatch = _const.DATA_URI.exec(dataUri);

    if (dataUriMatch) {
        return {
            mediaType: dataUriMatch[1] ? dataUriMatch[1].toLowerCase() : undefined,
            subType: dataUriMatch[2] ? dataUriMatch[2].toLowerCase() : undefined,
            encoding: dataUriMatch[3] ? dataUriMatch[3].toLowerCase() : undefined,
            data: dataUriMatch[4]
        };
    }

    return undefined;
}

/**
 * Get type of the image by regexp for extension. Returns undefined for unknown extensions.
 *
 * @memberof PIXI.utils
 * @param {string} url - the image path
 * @return {string|undefined} image extension
 */
function getUrlFileExtension(url) {
    var extension = _const.URL_FILE_EXTENSION.exec(url);

    if (extension) {
        return extension[1].toLowerCase();
    }

    return undefined;
}

/**
 * Typedef for Size object.
 *
 * @typedef {object} Size
 * @property {width} Width component
 * @property {height} Height component
 */

/**
 * Get size from an svg string using regexp.
 *
 * @memberof PIXI.utils
 * @param {string} svgString - a serialized svg element
 * @return {Size|undefined} image extension
 */
function getSvgSize(svgString) {
    var sizeMatch = _const.SVG_SIZE.exec(svgString);
    var size = {};

    if (sizeMatch) {
        size[sizeMatch[1]] = Math.round(parseFloat(sizeMatch[2]));
        size[sizeMatch[3]] = Math.round(parseFloat(sizeMatch[4]));
    }

    return size;
}

/**
 * Skips the hello message of renderers that are created after this is run.
 *
 */
function skipHello() {
    saidHello = true;
}

/**
 * Logs out the version and renderer information for this running instance of PIXI.
 * If you don't want to see this message you can run `PIXI.utils.skipHello()` before
 * creating your renderer. Keep in mind that doing that will forever makes you a jerk face.
 *
 * @static
 * @memberof PIXI.utils
 * @param {string} type - The string renderer type to log.
 */
function sayHello(type) {
    if (saidHello) {
        return;
    }

    if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
        var args = ['\n %c %c %c Pixi.js ' + _const.VERSION + ' - \u2730 ' + type + ' \u2730  %c  %c  http://www.pixijs.com/  %c %c \u2665%c\u2665%c\u2665 \n\n', 'background: #ff66a5; padding:5px 0;', 'background: #ff66a5; padding:5px 0;', 'color: #ff66a5; background: #030307; padding:5px 0;', 'background: #ff66a5; padding:5px 0;', 'background: #ffc3dc; padding:5px 0;', 'background: #ff66a5; padding:5px 0;', 'color: #ff2424; background: #fff; padding:5px 0;', 'color: #ff2424; background: #fff; padding:5px 0;', 'color: #ff2424; background: #fff; padding:5px 0;'];

        window.console.log.apply(console, args);
    } else if (window.console) {
        window.console.log('Pixi.js ' + _const.VERSION + ' - ' + type + ' - http://www.pixijs.com/');
    }

    saidHello = true;
}

/**
 * Helper for checking for webgl support
 *
 * @memberof PIXI.utils
 * @return {boolean} is webgl supported
 */
function isWebGLSupported() {
    var contextOptions = { stencil: true, failIfMajorPerformanceCaveat: true };

    try {
        if (!window.WebGLRenderingContext) {
            return false;
        }

        var canvas = document.createElement('canvas');
        var gl = canvas.getContext('webgl', contextOptions) || canvas.getContext('experimental-webgl', contextOptions);

        var success = !!(gl && gl.getContextAttributes().stencil);

        if (gl) {
            var loseContext = gl.getExtension('WEBGL_lose_context');

            if (loseContext) {
                loseContext.loseContext();
            }
        }

        gl = null;

        return success;
    } catch (e) {
        return false;
    }
}

/**
 * Returns sign of number
 *
 * @memberof PIXI.utils
 * @param {number} n - the number to check the sign of
 * @returns {number} 0 if `n` is 0, -1 if `n` is negative, 1 if `n` is positive
 */
function sign(n) {
    if (n === 0) return 0;

    return n < 0 ? -1 : 1;
}

/**
 * Remove a range of items from an array
 *
 * @memberof PIXI.utils
 * @param {Array<*>} arr The target array
 * @param {number} startIdx The index to begin removing from (inclusive)
 * @param {number} removeCount How many items to remove
 */
function removeItems(arr, startIdx, removeCount) {
    var length = arr.length;

    if (startIdx >= length || removeCount === 0) {
        return;
    }

    removeCount = startIdx + removeCount > length ? length - startIdx : removeCount;

    var len = length - removeCount;

    for (var i = startIdx; i < len; ++i) {
        arr[i] = arr[i + removeCount];
    }

    arr.length = len;
}

/**
 * @todo Describe property usage
 *
 * @memberof PIXI.utils
 * @private
 */
var TextureCache = exports.TextureCache = {};

/**
 * @todo Describe property usage
 *
 * @memberof PIXI.utils
 * @private
 */
var BaseTextureCache = exports.BaseTextureCache = {};

},{"../const":30,"./pluginTarget":103,"eventemitter3":4}],102:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.default = maxRecommendedTextures;

var _ismobilejs = require('ismobilejs');

var _ismobilejs2 = _interopRequireDefault(_ismobilejs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function maxRecommendedTextures(max) {
    if (_ismobilejs2.default.tablet || _ismobilejs2.default.phone) {
        // check if the res is iphone 6 or higher..
        return 2;
    }

    // desktop should be ok
    return max;
}

},{"ismobilejs":5}],103:[function(require,module,exports){
"use strict";

exports.__esModule = true;
/**
 * Mixins functionality to make an object have "plugins".
 *
 * @example
 *      function MyObject() {}
 *
 *      pluginTarget.mixin(MyObject);
 *
 * @mixin
 * @memberof PIXI.utils
 * @param {object} obj - The object to mix into.
 */
function pluginTarget(obj) {
    obj.__plugins = {};

    /**
     * Adds a plugin to an object
     *
     * @param {string} pluginName - The events that should be listed.
     * @param {Function} ctor - The constructor function for the plugin.
     */
    obj.registerPlugin = function registerPlugin(pluginName, ctor) {
        obj.__plugins[pluginName] = ctor;
    };

    /**
     * Instantiates all the plugins of this object
     *
     */
    obj.prototype.initPlugins = function initPlugins() {
        this.plugins = this.plugins || {};

        for (var o in obj.__plugins) {
            this.plugins[o] = new obj.__plugins[o](this);
        }
    };

    /**
     * Removes all the plugins of this object
     *
     */
    obj.prototype.destroyPlugins = function destroyPlugins() {
        for (var o in this.plugins) {
            this.plugins[o].destroy();
            this.plugins[o] = null;
        }

        this.plugins = null;
    };
}

exports.default = {
    /**
     * Mixes in the properties of the pluginTarget into another object
     *
     * @param {object} obj - The obj to mix into
     */
    mixin: function mixin(obj) {
        pluginTarget(obj);
    }
};

},{}],104:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Matrix = require('../core/math/Matrix');

var _Matrix2 = _interopRequireDefault(_Matrix);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var tempMat = new _Matrix2.default();

/**
 * class controls uv transform and frame clamp for texture
 */

var TextureTransform = function () {
    /**
     *
     * @param {PIXI.Texture} texture observed texture
     * @param {number} [clampMargin] Changes frame clamping, 0.5 by default. Use -0.5 for extra border.
     * @constructor
     */
    function TextureTransform(texture, clampMargin) {
        _classCallCheck(this, TextureTransform);

        this._texture = texture;

        this.mapCoord = new _Matrix2.default();

        this.uClampFrame = new Float32Array(4);

        this.uClampOffset = new Float32Array(2);

        this._lastTextureID = -1;

        /**
         * Changes frame clamping
         * Works with TilingSprite and Mesh
         * Change to 1.5 if you tex ture has repeated right and bottom lines, that leads to smoother borders
         *
         * @default 0
         * @member {number}
         */
        this.clampOffset = 0;

        /**
         * Changes frame clamping
         * Works with TilingSprite and Mesh
         * Change to -0.5 to add a pixel to the edge, recommended for transparent trimmed textures in atlas
         *
         * @default 0.5
         * @member {number}
         */
        this.clampMargin = typeof clampMargin === 'undefined' ? 0.5 : clampMargin;
    }

    /**
     * texture property
     * @member {PIXI.Texture}
     * @memberof PIXI.TextureTransform
     */


    /**
     * updates matrices if texture was changed
     * @param {boolean} forceUpdate if true, matrices will be updated any case
     */
    TextureTransform.prototype.update = function update(forceUpdate) {
        var tex = this.texture;

        if (!tex || !tex._valid) {
            return;
        }

        if (!forceUpdate && this._lastTextureID === this.texture._updateID) {
            return;
        }

        this._lastTextureID = this.texture._updateID;

        var uvs = this.texture._uvs;

        this.mapCoord.set(uvs.x1 - uvs.x0, uvs.y1 - uvs.y0, uvs.x3 - uvs.x0, uvs.y3 - uvs.y0, uvs.x0, uvs.y0);

        var orig = tex.orig;
        var trim = tex.trim;

        if (trim) {
            tempMat.set(orig.width / trim.width, 0, 0, orig.height / trim.height, -trim.x / trim.width, -trim.y / trim.height);
            this.mapCoord.append(tempMat);
        }

        var texBase = tex.baseTexture;
        var frame = this.uClampFrame;
        var margin = this.clampMargin / 1;
        var offset = this.clampOffset;

        frame[0] = (tex._frame.x + margin + offset) / texBase.width;
        frame[1] = (tex._frame.y + margin + offset) / texBase.height;
        frame[2] = (tex._frame.x + tex._frame.width - margin + offset) / texBase.width;
        frame[3] = (tex._frame.y + tex._frame.height - margin + offset) / texBase.height;
        this.uClampOffset[0] = offset / texBase.width;
        this.uClampOffset[1] = offset / texBase.height;
    };

    _createClass(TextureTransform, [{
        key: 'texture',
        get: function get() {
            return this._texture;
        }

        /**
         * sets texture value
         * @param {PIXI.Texture} value texture to be set
         */
        ,
        set: function set(value) {
            this._texture = value;
            this._lastTextureID = -1;
        }
    }]);

    return TextureTransform;
}();

exports.default = TextureTransform;

},{"../core/math/Matrix":50}],105:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _core = require('../core');

var core = _interopRequireWildcard(_core);

var _CanvasTinter = require('../core/sprites/canvas/CanvasTinter');

var _CanvasTinter2 = _interopRequireDefault(_CanvasTinter);

var _TextureTransform = require('./TextureTransform');

var _TextureTransform2 = _interopRequireDefault(_TextureTransform);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var tempPoint = new core.Point();

/**
 * A tiling sprite is a fast way of rendering a tiling image
 *
 * @class
 * @extends PIXI.Sprite
 * @memberof PIXI.extras
 */

var TilingSprite = function (_core$Sprite) {
    _inherits(TilingSprite, _core$Sprite);

    /**
     * @param {PIXI.Texture} texture - the texture of the tiling sprite
     * @param {number} [width=100] - the width of the tiling sprite
     * @param {number} [height=100] - the height of the tiling sprite
     */
    function TilingSprite(texture) {
        var width = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 100;
        var height = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 100;

        _classCallCheck(this, TilingSprite);

        /**
         * Tile transform
         *
         * @member {PIXI.TransformStatic}
         */
        var _this = _possibleConstructorReturn(this, _core$Sprite.call(this, texture));

        _this.tileTransform = new core.TransformStatic();

        // /// private

        /**
         * The with of the tiling sprite
         *
         * @member {number}
         * @private
         */
        _this._width = width;

        /**
         * The height of the tiling sprite
         *
         * @member {number}
         * @private
         */
        _this._height = height;

        /**
         * Canvas pattern
         *
         * @type {CanvasPattern}
         * @private
         */
        _this._canvasPattern = null;

        /**
         * transform that is applied to UV to get the texture coords
         *
         * @member {PIXI.extras.TextureTransform}
         */
        _this.uvTransform = texture.transform || new _TextureTransform2.default(texture);
        return _this;
    }
    /**
     * Changes frame clamping in corresponding textureTransform, shortcut
     * Change to -0.5 to add a pixel to the edge, recommended for transparent trimmed textures in atlas
     *
     * @default 0.5
     * @member {number}
     * @memberof PIXI.TilingSprite
     */


    /**
     * @private
     */
    TilingSprite.prototype._onTextureUpdate = function _onTextureUpdate() {
        if (this.uvTransform) {
            this.uvTransform.texture = this._texture;
        }
    };

    /**
     * Renders the object using the WebGL renderer
     *
     * @private
     * @param {PIXI.WebGLRenderer} renderer - The renderer
     */


    TilingSprite.prototype._renderWebGL = function _renderWebGL(renderer) {
        // tweak our texture temporarily..
        var texture = this.texture;

        if (!texture || !texture.valid) {
            return;
        }

        this.tileTransform.updateLocalTransform();
        this.uvTransform.update();

        renderer.setObjectRenderer(renderer.plugins.tilingSprite);
        renderer.plugins.tilingSprite.render(this);
    };

    /**
     * Renders the object using the Canvas renderer
     *
     * @private
     * @param {PIXI.CanvasRenderer} renderer - a reference to the canvas renderer
     */


    TilingSprite.prototype._renderCanvas = function _renderCanvas(renderer) {
        var texture = this._texture;

        if (!texture.baseTexture.hasLoaded) {
            return;
        }

        var context = renderer.context;
        var transform = this.worldTransform;
        var resolution = renderer.resolution;
        var baseTexture = texture.baseTexture;
        var baseTextureResolution = texture.baseTexture.resolution;
        var modX = this.tilePosition.x / this.tileScale.x % texture._frame.width;
        var modY = this.tilePosition.y / this.tileScale.y % texture._frame.height;

        // create a nice shiny pattern!
        // TODO this needs to be refreshed if texture changes..
        if (!this._canvasPattern) {
            // cut an object from a spritesheet..
            var tempCanvas = new core.CanvasRenderTarget(texture._frame.width, texture._frame.height, baseTextureResolution);

            // Tint the tiling sprite
            if (this.tint !== 0xFFFFFF) {
                if (this.cachedTint !== this.tint) {
                    this.cachedTint = this.tint;

                    this.tintedTexture = _CanvasTinter2.default.getTintedTexture(this, this.tint);
                }
                tempCanvas.context.drawImage(this.tintedTexture, 0, 0);
            } else {
                tempCanvas.context.drawImage(baseTexture.source, -texture._frame.x, -texture._frame.y);
            }
            this._canvasPattern = tempCanvas.context.createPattern(tempCanvas.canvas, 'repeat');
        }

        // set context state..
        context.globalAlpha = this.worldAlpha;
        context.setTransform(transform.a * resolution, transform.b * resolution, transform.c * resolution, transform.d * resolution, transform.tx * resolution, transform.ty * resolution);

        // TODO - this should be rolled into the setTransform above..
        context.scale(this.tileScale.x / baseTextureResolution, this.tileScale.y / baseTextureResolution);

        context.translate(modX + this.anchor.x * -this._width, modY + this.anchor.y * -this._height);

        // check blend mode
        var compositeOperation = renderer.blendModes[this.blendMode];

        if (compositeOperation !== renderer.context.globalCompositeOperation) {
            context.globalCompositeOperation = compositeOperation;
        }

        // fill the pattern!
        context.fillStyle = this._canvasPattern;
        context.fillRect(-modX, -modY, this._width / this.tileScale.x * baseTextureResolution, this._height / this.tileScale.y * baseTextureResolution);
    };

    /**
     * Updates the bounds of the tiling sprite.
     *
     * @private
     */


    TilingSprite.prototype._calculateBounds = function _calculateBounds() {
        var minX = this._width * -this._anchor._x;
        var minY = this._height * -this._anchor._y;
        var maxX = this._width * (1 - this._anchor._x);
        var maxY = this._height * (1 - this._anchor._y);

        this._bounds.addFrame(this.transform, minX, minY, maxX, maxY);
    };

    /**
     * Gets the local bounds of the sprite object.
     *
     * @param {PIXI.Rectangle} rect - The output rectangle.
     * @return {PIXI.Rectangle} The bounds.
     */


    TilingSprite.prototype.getLocalBounds = function getLocalBounds(rect) {
        // we can do a fast local bounds if the sprite has no children!
        if (this.children.length === 0) {
            this._bounds.minX = this._width * -this._anchor._x;
            this._bounds.minY = this._height * -this._anchor._y;
            this._bounds.maxX = this._width * (1 - this._anchor._x);
            this._bounds.maxY = this._height * (1 - this._anchor._x);

            if (!rect) {
                if (!this._localBoundsRect) {
                    this._localBoundsRect = new core.Rectangle();
                }

                rect = this._localBoundsRect;
            }

            return this._bounds.getRectangle(rect);
        }

        return _core$Sprite.prototype.getLocalBounds.call(this, rect);
    };

    /**
     * Checks if a point is inside this tiling sprite.
     *
     * @param {PIXI.Point} point - the point to check
     * @return {boolean} Whether or not the sprite contains the point.
     */


    TilingSprite.prototype.containsPoint = function containsPoint(point) {
        this.worldTransform.applyInverse(point, tempPoint);

        var width = this._width;
        var height = this._height;
        var x1 = -width * this.anchor._x;

        if (tempPoint.x > x1 && tempPoint.x < x1 + width) {
            var y1 = -height * this.anchor._y;

            if (tempPoint.y > y1 && tempPoint.y < y1 + height) {
                return true;
            }
        }

        return false;
    };

    /**
     * Destroys this tiling sprite
     *
     */


    TilingSprite.prototype.destroy = function destroy() {
        _core$Sprite.prototype.destroy.call(this);

        this.tileTransform = null;
        this.uvTransform = null;
    };

    /**
     * Helper function that creates a new tiling sprite based on the source you provide.
     * The source can be - frame id, image url, video url, canvas element, video element, base texture
     *
     * @static
     * @param {number|string|PIXI.BaseTexture|HTMLCanvasElement|HTMLVideoElement} source - Source to create texture from
     * @param {number} width - the width of the tiling sprite
     * @param {number} height - the height of the tiling sprite
     * @return {PIXI.Texture} The newly created texture
     */


    TilingSprite.from = function from(source, width, height) {
        return new TilingSprite(core.Texture.from(source), width, height);
    };

    /**
     * Helper function that creates a tiling sprite that will use a texture from the TextureCache based on the frameId
     * The frame ids are created when a Texture packer file has been loaded
     *
     * @static
     * @param {string} frameId - The frame Id of the texture in the cache
     * @param {number} width - the width of the tiling sprite
     * @param {number} height - the height of the tiling sprite
     * @return {PIXI.extras.TilingSprite} A new TilingSprite using a texture from the texture cache matching the frameId
     */


    TilingSprite.fromFrame = function fromFrame(frameId, width, height) {
        var texture = core.utils.TextureCache[frameId];

        if (!texture) {
            throw new Error('The frameId "' + frameId + '" does not exist in the texture cache ' + this);
        }

        return new TilingSprite(texture, width, height);
    };

    /**
     * Helper function that creates a sprite that will contain a texture based on an image url
     * If the image is not in the texture cache it will be loaded
     *
     * @static
     * @param {string} imageId - The image url of the texture
     * @param {number} width - the width of the tiling sprite
     * @param {number} height - the height of the tiling sprite
     * @param {boolean} [crossorigin] - if you want to specify the cross-origin parameter
     * @param {number} [scaleMode=PIXI.SCALE_MODES.DEFAULT] - if you want to specify the scale mode,
     *  see {@link PIXI.SCALE_MODES} for possible values
     * @return {PIXI.extras.TilingSprite} A new TilingSprite using a texture from the texture cache matching the image id
     */


    TilingSprite.fromImage = function fromImage(imageId, width, height, crossorigin, scaleMode) {
        return new TilingSprite(core.Texture.fromImage(imageId, crossorigin, scaleMode), width, height);
    };

    /**
     * The width of the sprite, setting this will actually modify the scale to achieve the value set
     *
     * @member {number}
     * @memberof PIXI.extras.TilingSprite#
     */


    _createClass(TilingSprite, [{
        key: 'clampMargin',
        get: function get() {
            return this.uvTransform.clampMargin;
        }

        /**
         * setter for clampMargin
         *
         * @param {number} value assigned value
         */
        ,
        set: function set(value) {
            this.uvTransform.clampMargin = value;
            this.uvTransform.update(true);
        }

        /**
         * The scaling of the image that is being tiled
         *
         * @member {PIXI.ObservablePoint}
         * @memberof PIXI.DisplayObject#
         */

    }, {
        key: 'tileScale',
        get: function get() {
            return this.tileTransform.scale;
        }

        /**
         * Copies the point to the scale of the tiled image.
         *
         * @param {PIXI.Point|PIXI.ObservablePoint} value - The value to set to.
         */
        ,
        set: function set(value) {
            this.tileTransform.scale.copy(value);
        }

        /**
         * The offset of the image that is being tiled
         *
         * @member {PIXI.ObservablePoint}
         * @memberof PIXI.TilingSprite#
         */

    }, {
        key: 'tilePosition',
        get: function get() {
            return this.tileTransform.position;
        }

        /**
         * Copies the point to the position of the tiled image.
         *
         * @param {PIXI.Point|PIXI.ObservablePoint} value - The value to set to.
         */
        ,
        set: function set(value) {
            this.tileTransform.position.copy(value);
        }
    }, {
        key: 'width',
        get: function get() {
            return this._width;
        }

        /**
         * Sets the width.
         *
         * @param {number} value - The value to set to.
         */
        ,
        set: function set(value) {
            this._width = value;
        }

        /**
         * The height of the TilingSprite, setting this will actually modify the scale to achieve the value set
         *
         * @member {number}
         * @memberof PIXI.extras.TilingSprite#
         */

    }, {
        key: 'height',
        get: function get() {
            return this._height;
        }

        /**
         * Sets the width.
         *
         * @param {number} value - The value to set to.
         */
        ,
        set: function set(value) {
            this._height = value;
        }
    }]);

    return TilingSprite;
}(core.Sprite);

exports.default = TilingSprite;


game.TilingSprite.inject({
    staticInit: function staticInit(texture, width, height) {
        this.super(texture, width, height);
        this.tileTransform = new core.TransformStatic();
        this.uvTransform = new _TextureTransform2.default(this.texture);
        this._blendMode = PIXI.BLEND_MODES.NORMAL;
    },

    _renderWebGL: function _renderWebGL(renderer) {
        // tweak our texture temporarily..
        var texture = this.texture;

        if (!texture) return;

        this.tileTransform.position.x = this.tilePosition.x;
        this.tileTransform.position.y = this.tilePosition.y;
        this.tileTransform.updateLocalTransform();
        this.uvTransform.update();

        renderer.setObjectRenderer(renderer.plugins.tilingSprite);
        renderer.plugins.tilingSprite.render(this);
    }
});

},{"../core":48,"../core/sprites/canvas/CanvasTinter":85,"./TextureTransform":104}],106:[function(require,module,exports){
'use strict';

var _core = require('../core');

var core = _interopRequireWildcard(_core);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DisplayObject = core.DisplayObject;
var _tempMatrix = new core.Matrix();

DisplayObject.prototype._cacheAsBitmap = false;
DisplayObject.prototype._cacheData = false;

// figured theres no point adding ALL the extra variables to prototype.
// this model can hold the information needed. This can also be generated on demand as
// most objects are not cached as bitmaps.
/**
 * @class
 * @ignore
 */

var CacheData =
/**
 *
 */
function CacheData() {
    _classCallCheck(this, CacheData);

    this.originalRenderWebGL = null;
    this.originalRenderCanvas = null;
    this.originalCalculateBounds = null;
    this.originalGetLocalBounds = null;

    this.originalUpdateTransform = null;
    this.originalHitTest = null;
    this.originalDestroy = null;
    this.originalMask = null;
    this.originalFilterArea = null;
    this.sprite = null;
};

Object.defineProperties(DisplayObject.prototype, {
    /**
     * Set this to true if you want this display object to be cached as a bitmap.
     * This basically takes a snap shot of the display object as it is at that moment. It can
     * provide a performance benefit for complex static displayObjects.
     * To remove simply set this property to 'false'
     *
     * @member {boolean}
     * @memberof PIXI.DisplayObject#
     */
    cacheAsBitmap: {
        get: function get() {
            return this._cacheAsBitmap;
        },
        set: function set(value) {
            if (this._cacheAsBitmap === value) {
                return;
            }

            this._cacheAsBitmap = value;

            var data = void 0;

            if (value) {
                if (!this._cacheData) {
                    this._cacheData = new CacheData();
                }

                data = this._cacheData;

                data.originalRenderWebGL = this.renderWebGL;
                data.originalRenderCanvas = this.renderCanvas;

                data.originalUpdateTransform = this.updateTransform;
                data.originalCalculateBounds = this._calculateBounds;
                data.originalGetLocalBounds = this.getLocalBounds;

                data.originalDestroy = this.destroy;

                data.originalContainsPoint = this.containsPoint;

                data.originalMask = this._mask;
                data.originalFilterArea = this.filterArea;

                this.renderWebGL = this._renderCachedWebGL;
                this.renderCanvas = this._renderCachedCanvas;

                this.destroy = this._cacheAsBitmapDestroy;
            } else {
                data = this._cacheData;

                if (data.sprite) {
                    this._destroyCachedDisplayObject();
                }

                this.renderWebGL = data.originalRenderWebGL;
                this.renderCanvas = data.originalRenderCanvas;
                this._calculateBounds = data.originalCalculateBounds;
                this.getLocalBounds = data.originalGetLocalBounds;

                this.destroy = data.originalDestroy;

                this.updateTransform = data.originalUpdateTransform;
                this.containsPoint = data.originalContainsPoint;

                this._mask = data.originalMask;
                this.filterArea = data.originalFilterArea;
            }
        }
    }
});

/**
 * Renders a cached version of the sprite with WebGL
 *
 * @private
 * @memberof PIXI.DisplayObject#
 * @param {PIXI.WebGLRenderer} renderer - the WebGL renderer
 */
DisplayObject.prototype._renderCachedWebGL = function _renderCachedWebGL(renderer) {
    if (!this.visible || this.worldAlpha <= 0 || !this.renderable) {
        return;
    }

    this._initCachedDisplayObject(renderer);

    this._cacheData.sprite._transformID = -1;
    this._cacheData.sprite.worldAlpha = this.worldAlpha;
    this._cacheData.sprite._renderWebGL(renderer);
};

/**
 * Prepares the WebGL renderer to cache the sprite
 *
 * @private
 * @memberof PIXI.DisplayObject#
 * @param {PIXI.WebGLRenderer} renderer - the WebGL renderer
 */
DisplayObject.prototype._initCachedDisplayObject = function _initCachedDisplayObject(renderer) {
    if (this._cacheData && this._cacheData.sprite) {
        return;
    }

    // make sure alpha is set to 1 otherwise it will get rendered as invisible!
    var cacheAlpha = this.alpha;

    this.alpha = 1;

    // first we flush anything left in the renderer (otherwise it would get rendered to the cached texture)
    renderer.currentRenderer.flush();
    // this.filters= [];

    // next we find the dimensions of the untransformed object
    // this function also calls updatetransform on all its children as part of the measuring.
    // This means we don't need to update the transform again in this function
    // TODO pass an object to clone too? saves having to create a new one each time!
    var bounds = this.getLocalBounds().clone();

    // add some padding!
    if (this._filters) {
        var padding = this._filters[0].padding;

        bounds.pad(padding);
    }

    // for now we cache the current renderTarget that the webGL renderer is currently using.
    // this could be more elegent..
    var cachedRenderTarget = renderer._activeRenderTarget;
    // We also store the filter stack - I will definitely look to change how this works a little later down the line.
    var stack = renderer.filterManager.filterStack;

    // this renderTexture will be used to store the cached DisplayObject

    var renderTexture = core.RenderTexture.create(bounds.width | 0, bounds.height | 0);

    // need to set //
    var m = _tempMatrix;

    m.tx = -bounds.x;
    m.ty = -bounds.y;

    // reset
    this.transform.worldTransform.identity();

    // set all properties to there original so we can render to a texture
    this.renderWebGL = this._cacheData.originalRenderWebGL;

    renderer.render(this, renderTexture, true, m, true);
    // now restore the state be setting the new properties

    renderer.bindRenderTarget(cachedRenderTarget);

    renderer.filterManager.filterStack = stack;

    this.renderWebGL = this._renderCachedWebGL;
    this.updateTransform = this.displayObjectUpdateTransform;

    this._mask = null;
    this.filterArea = null;

    // create our cached sprite
    var cachedSprite = new core.Sprite(renderTexture);

    cachedSprite.transform.worldTransform = this.transform.worldTransform;
    cachedSprite.anchor.x = -(bounds.x / bounds.width);
    cachedSprite.anchor.y = -(bounds.y / bounds.height);
    cachedSprite.alpha = cacheAlpha;
    cachedSprite._bounds = this._bounds;

    // easy bounds..
    this._calculateBounds = this._calculateCachedBounds;
    this.getLocalBounds = this._getCachedLocalBounds;

    this._cacheData.sprite = cachedSprite;

    this.transform._parentID = -1;
    // restore the transform of the cached sprite to avoid the nasty flicker..
    this.updateTransform();

    // map the hit test..
    this.containsPoint = cachedSprite.containsPoint.bind(cachedSprite);
};

/**
 * Renders a cached version of the sprite with canvas
 *
 * @private
 * @memberof PIXI.DisplayObject#
 * @param {PIXI.WebGLRenderer} renderer - the WebGL renderer
 */
DisplayObject.prototype._renderCachedCanvas = function _renderCachedCanvas(renderer) {
    if (!this.visible || this.worldAlpha <= 0 || !this.renderable) {
        return;
    }

    this._initCachedDisplayObjectCanvas(renderer);

    this._cacheData.sprite.worldAlpha = this.worldAlpha;

    this._cacheData.sprite.renderCanvas(renderer);
};

// TODO this can be the same as the webGL verison.. will need to do a little tweaking first though..
/**
 * Prepares the Canvas renderer to cache the sprite
 *
 * @private
 * @memberof PIXI.DisplayObject#
 * @param {PIXI.WebGLRenderer} renderer - the WebGL renderer
 */
DisplayObject.prototype._initCachedDisplayObjectCanvas = function _initCachedDisplayObjectCanvas(renderer) {
    if (this._cacheData && this._cacheData.sprite) {
        return;
    }

    // get bounds actually transforms the object for us already!
    var bounds = this.getLocalBounds();

    var cacheAlpha = this.alpha;

    this.alpha = 1;

    var cachedRenderTarget = renderer.context;

    var renderTexture = core.RenderTexture.create(bounds.width | 0, bounds.height | 0);

    // need to set //
    var m = _tempMatrix;

    this.transform.worldTransform.copy(m);
    m.invert();

    m.tx -= bounds.x;
    m.ty -= bounds.y;

    // m.append(this.transform.worldTransform.)
    // set all properties to there original so we can render to a texture
    this.renderCanvas = this._cacheData.originalRenderCanvas;

    // renderTexture.render(this, m, true);
    renderer.render(this, renderTexture, true, m, false);

    // now restore the state be setting the new properties
    renderer.context = cachedRenderTarget;

    this.renderCanvas = this._renderCachedCanvas;
    this._calculateBounds = this._calculateCachedBounds;

    this._mask = null;
    this.filterArea = null;

    // create our cached sprite
    var cachedSprite = new core.Sprite(renderTexture);

    cachedSprite.transform.worldTransform = this.transform.worldTransform;
    cachedSprite.anchor.x = -(bounds.x / bounds.width);
    cachedSprite.anchor.y = -(bounds.y / bounds.height);
    cachedSprite._bounds = this._bounds;
    cachedSprite.alpha = cacheAlpha;

    this.updateTransform();
    this.updateTransform = this.displayObjectUpdateTransform;

    this._cacheData.sprite = cachedSprite;

    this.containsPoint = cachedSprite.containsPoint.bind(cachedSprite);
};

/**
 * Calculates the bounds of the cached sprite
 *
 * @private
 */
DisplayObject.prototype._calculateCachedBounds = function _calculateCachedBounds() {
    this._cacheData.sprite._calculateBounds();
};

/**
 * Gets the bounds of the cached sprite.
 *
 * @private
 * @return {Rectangle} The local bounds.
 */
DisplayObject.prototype._getCachedLocalBounds = function _getCachedLocalBounds() {
    return this._cacheData.sprite.getLocalBounds();
};

/**
 * Destroys the cached sprite.
 *
 * @private
 */
DisplayObject.prototype._destroyCachedDisplayObject = function _destroyCachedDisplayObject() {
    this._cacheData.sprite._texture.destroy(true);
    this._cacheData.sprite = null;
};

/**
 * Destroys the cached object.
 *
 * @private
 */
DisplayObject.prototype._cacheAsBitmapDestroy = function _cacheAsBitmapDestroy() {
    this.cacheAsBitmap = false;
    this.destroy();
};

},{"../core":48}],107:[function(require,module,exports){
'use strict';

var _core = require('../core');

var core = _interopRequireWildcard(_core);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
 * The instance name of the object.
 *
 * @memberof PIXI.DisplayObject#
 * @member {string}
 */
core.DisplayObject.prototype.name = null;

/**
 * Returns the display object in the container
 *
 * @memberof PIXI.Container#
 * @param {string} name - instance name
 * @return {PIXI.DisplayObject} The child with the specified name.
 */
core.Container.prototype.getChildByName = function getChildByName(name) {
    for (var i = 0; i < this.children.length; i++) {
        if (this.children[i].name === name) {
            return this.children[i];
        }
    }

    return null;
};

},{"../core":48}],108:[function(require,module,exports){
'use strict';

var _core = require('../core');

var core = _interopRequireWildcard(_core);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
 * Returns the global position of the displayObject. Does not depend on object scale, rotation and pivot.
 *
 * @memberof PIXI.DisplayObject#
 * @param {Point} point - the point to write the global value to. If null a new point will be returned
 * @param {boolean} skipUpdate - setting to true will stop the transforms of the scene graph from
 *  being updated. This means the calculation returned MAY be out of date BUT will give you a
 *  nice performance boost
 * @return {Point} The updated point
 */
core.DisplayObject.prototype.getGlobalPosition = function getGlobalPosition() {
    var point = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new core.Point();
    var skipUpdate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    if (this.parent) {
        this.parent.toGlobal(this.position, point, skipUpdate);
    } else {
        point.x = this.position.x;
        point.y = this.position.y;
    }

    return point;
};

},{"../core":48}],109:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _TextureTransform = require('./TextureTransform');

Object.defineProperty(exports, 'TextureTransform', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_TextureTransform).default;
  }
});

var _TilingSprite = require('./TilingSprite');

Object.defineProperty(exports, 'TilingSprite', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_TilingSprite).default;
  }
});

var _TilingSpriteRenderer = require('./webgl/TilingSpriteRenderer');

Object.defineProperty(exports, 'TilingSpriteRenderer', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_TilingSpriteRenderer).default;
  }
});

var _cacheAsBitmap = require('./cacheAsBitmap');

Object.defineProperty(exports, 'cacheAsBitmap', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_cacheAsBitmap).default;
  }
});

var _getChildByName = require('./getChildByName');

Object.defineProperty(exports, 'getChildByName', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_getChildByName).default;
  }
});

var _getGlobalPosition = require('./getGlobalPosition');

Object.defineProperty(exports, 'getGlobalPosition', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_getGlobalPosition).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./TextureTransform":104,"./TilingSprite":105,"./cacheAsBitmap":106,"./getChildByName":107,"./getGlobalPosition":108,"./webgl/TilingSpriteRenderer":110}],110:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.TilingSpriteRenderer = undefined;

var _core = require('../../core');

var core = _interopRequireWildcard(_core);

var _const = require('../../core/const');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

 // eslint-disable-line no-undef

var tempMat = new core.Matrix();
var tempArray = new Float32Array(4);

/**
 * WebGL renderer plugin for tiling sprites
 */

var TilingSpriteRenderer = exports.TilingSpriteRenderer = function (_core$ObjectRenderer) {
    _inherits(TilingSpriteRenderer, _core$ObjectRenderer);

    /**
     * constructor for renderer
     *
     * @param {WebGLRenderer} renderer The renderer this tiling awesomeness works for.
     */
    function TilingSpriteRenderer(renderer) {
        _classCallCheck(this, TilingSpriteRenderer);

        var _this = _possibleConstructorReturn(this, _core$ObjectRenderer.call(this, renderer));

        _this.shader = null;
        _this.simpleShader = null;
        _this.quad = null;
        return _this;
    }

    /**
     * Sets up the renderer context and necessary buffers.
     *
     * @private
     */


    TilingSpriteRenderer.prototype.onContextChange = function onContextChange() {
        var gl = this.renderer.gl;

        this.shader = new core.Shader(gl, "#define GLSLIFY 1\nattribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\nuniform mat3 translationMatrix;\nuniform mat3 uTransform;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n\n    vTextureCoord = (uTransform * vec3(aTextureCoord, 1.0)).xy;\n}\n", "#define GLSLIFY 1\nvarying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform vec4 uColor;\nuniform mat3 uMapCoord;\nuniform vec4 uClampFrame;\nuniform vec2 uClampOffset;\n\nvoid main(void)\n{\n    vec2 coord = mod(vTextureCoord - uClampOffset, vec2(1.0, 1.0)) + uClampOffset;\n    coord = (uMapCoord * vec3(coord, 1.0)).xy;\n    coord = clamp(coord, uClampFrame.xy, uClampFrame.zw);\n\n    vec4 sample = texture2D(uSampler, coord);\n    vec4 color = vec4(uColor.rgb * uColor.a, uColor.a);\n\n    gl_FragColor = sample * color ;\n}\n");
        this.simpleShader = new core.Shader(gl, "#define GLSLIFY 1\nattribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\nuniform mat3 translationMatrix;\nuniform mat3 uTransform;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n\n    vTextureCoord = (uTransform * vec3(aTextureCoord, 1.0)).xy;\n}\n", "#define GLSLIFY 1\nvarying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform vec4 uColor;\n\nvoid main(void)\n{\n    vec4 sample = texture2D(uSampler, vTextureCoord);\n    vec4 color = vec4(uColor.rgb * uColor.a, uColor.a);\n    gl_FragColor = sample * color;\n}\n");

        this.quad = new core.Quad(gl);
        this.quad.initVao(this.shader);
    };

    /**
     *
     * @param {PIXI.extras.TilingSprite} ts tilingSprite to be rendered
     */


    TilingSpriteRenderer.prototype.render = function render(ts) {
        var quad = this.quad;
        var vertices = quad.vertices;

        vertices[0] = vertices[6] = ts._width * game.scale * -ts.anchor.x;
        vertices[1] = vertices[3] = ts._height * game.scale * -ts.anchor.y;

        vertices[2] = vertices[4] = ts._width * game.scale * (1.0 - ts.anchor.x);
        vertices[5] = vertices[7] = ts._height * game.scale * (1.0 - ts.anchor.y);

        vertices = quad.uvs;

        vertices[0] = vertices[6] = -ts.anchor.x;
        vertices[1] = vertices[3] = -ts.anchor.y;

        vertices[2] = vertices[4] = 1.0 - ts.anchor.x;
        vertices[5] = vertices[7] = 1.0 - ts.anchor.y;

        quad.upload();

        var renderer = this.renderer;
        var tex = ts.texture;
        var baseTex = tex.baseTexture;
        var lt = ts.tileTransform.localTransform;
        var uv = ts.uvTransform;
        var isSimple = baseTex.isPowerOfTwo && tex.width === baseTex.width && tex.height === baseTex.height;

        // auto, force repeat wrapMode for big tiling textures
        if (isSimple) {
            if (!baseTex._glTextures[renderer.CONTEXT_UID]) {
                if (baseTex.wrapMode === _const.WRAP_MODES.CLAMP) {
                    baseTex.wrapMode = _const.WRAP_MODES.REPEAT;
                }
            } else {
                isSimple = baseTex.wrapMode !== _const.WRAP_MODES.CLAMP;
            }
        }

        var shader = isSimple ? this.simpleShader : this.shader;

        renderer.bindShader(shader);

        var w = tex.width;
        var h = tex.height;
        var W = ts._width;
        var H = ts._height;

        tempMat.set(lt.a * w / W, lt.b * w / H, lt.c * h / W, lt.d * h / H, lt.tx / W, lt.ty / H);

        // that part is the same as above:
        // tempMat.identity();
        // tempMat.scale(tex.width, tex.height);
        // tempMat.prepend(lt);
        // tempMat.scale(1.0 / ts._width, 1.0 / ts._height);

        tempMat.invert();
        if (isSimple) {
            tempMat.append(uv.mapCoord);
        } else {
            shader.uniforms.uMapCoord = uv.mapCoord.toArray(true);
            shader.uniforms.uClampFrame = uv.uClampFrame;
            shader.uniforms.uClampOffset = uv.uClampOffset;
        }
        shader.uniforms.uTransform = tempMat.toArray(true);

        var color = tempArray;

        core.utils.hex2rgb(0xffffff, color);
        color[3] = ts._worldAlpha;
        shader.uniforms.uColor = color;
        shader.uniforms.translationMatrix = ts._worldTransform.toArray(true);

        renderer.bindTexture(tex);
        renderer.setBlendMode(ts._blendMode);

        if (game.debug) game.debug._draws++;
        quad.draw();
    };

    return TilingSpriteRenderer;
}(core.ObjectRenderer);

core.WebGLRenderer.registerPlugin('tilingSprite', TilingSpriteRenderer);

},{"../../core":48,"../../core/const":30}],111:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _core = require('../../core');

var core = _interopRequireWildcard(_core);

var _BlurXFilter = require('./BlurXFilter');

var _BlurXFilter2 = _interopRequireDefault(_BlurXFilter);

var _BlurYFilter = require('./BlurYFilter');

var _BlurYFilter2 = _interopRequireDefault(_BlurYFilter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * The BlurFilter applies a Gaussian blur to an object.
 * The strength of the blur can be set for x- and y-axis separately.
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 */
var BlurFilter = function (_core$Filter) {
  _inherits(BlurFilter, _core$Filter);

  /**
   * @param {number} strength - The strength of the blur filter.
   * @param {number} quality - The quality of the blur filter.
   * @param {number} resolution - The reoslution of the blur filter.
   */
  function BlurFilter(strength, quality, resolution) {
    _classCallCheck(this, BlurFilter);

    var _this = _possibleConstructorReturn(this, _core$Filter.call(this));

    _this.blurXFilter = new _BlurXFilter2.default();
    _this.blurYFilter = new _BlurYFilter2.default();
    _this.resolution = 1;

    _this.padding = 0;
    _this.resolution = resolution || 1;
    _this.quality = quality || 4;
    _this.blur = strength || 8;
    return _this;
  }

  /**
   * Applies the filter.
   *
   * @param {PIXI.FilterManager} filterManager - The manager.
   * @param {PIXI.RenderTarget} input - The input target.
   * @param {PIXI.RenderTarget} output - The output target.
   */


  BlurFilter.prototype.apply = function apply(filterManager, input, output) {
    var renderTarget = filterManager.getRenderTarget(true);

    this.blurXFilter.apply(filterManager, input, renderTarget, true);
    this.blurYFilter.apply(filterManager, renderTarget, output, false);

    filterManager.returnRenderTarget(renderTarget);
  };

  /**
   * Sets the strength of both the blurX and blurY properties simultaneously
   *
   * @member {number}
   * @memberOf PIXI.filters.BlurFilter#
   * @default 2
   */


  _createClass(BlurFilter, [{
    key: 'blur',
    get: function get() {
      return this.blurXFilter.blur;
    }

    /**
     * Sets the strength of the blur.
     *
     * @param {number} value - The value to set.
     */
    ,
    set: function set(value) {
      this.blurXFilter.blur = this.blurYFilter.blur = value;
      this.padding = Math.max(Math.abs(this.blurXFilter.strength), Math.abs(this.blurYFilter.strength)) * 2;
    }

    /**
     * Sets the number of passes for blur. More passes means higher quaility bluring.
     *
     * @member {number}
     * @memberof PIXI.filters.BlurYFilter#
     * @default 1
     */

  }, {
    key: 'quality',
    get: function get() {
      return this.blurXFilter.quality;
    }

    /**
     * Sets the quality of the blur.
     *
     * @param {number} value - The value to set.
     */
    ,
    set: function set(value) {
      this.blurXFilter.quality = this.blurYFilter.quality = value;
    }

    /**
     * Sets the strength of the blurX property
     *
     * @member {number}
     * @memberOf PIXI.filters.BlurFilter#
     * @default 2
     */

  }, {
    key: 'blurX',
    get: function get() {
      return this.blurXFilter.blur;
    }

    /**
     * Sets the strength of the blurX.
     *
     * @param {number} value - The value to set.
     */
    ,
    set: function set(value) {
      this.blurXFilter.blur = value;
      this.padding = Math.max(Math.abs(this.blurXFilter.strength), Math.abs(this.blurYFilter.strength)) * 2;
    }

    /**
     * Sets the strength of the blurY property
     *
     * @member {number}
     * @memberOf PIXI.filters.BlurFilter#
     * @default 2
     */

  }, {
    key: 'blurY',
    get: function get() {
      return this.blurYFilter.blur;
    }

    /**
     * Sets the strength of the blurY.
     *
     * @param {number} value - The value to set.
     */
    ,
    set: function set(value) {
      this.blurYFilter.blur = value;
      this.padding = Math.max(Math.abs(this.blurXFilter.strength), Math.abs(this.blurYFilter.strength)) * 2;
    }
  }]);

  return BlurFilter;
}(core.Filter);

exports.default = BlurFilter;

},{"../../core":48,"./BlurXFilter":112,"./BlurYFilter":113}],112:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _core = require('../../core');

var core = _interopRequireWildcard(_core);

var _generateBlurVertSource = require('./generateBlurVertSource');

var _generateBlurVertSource2 = _interopRequireDefault(_generateBlurVertSource);

var _generateBlurFragSource = require('./generateBlurFragSource');

var _generateBlurFragSource2 = _interopRequireDefault(_generateBlurFragSource);

var _getMaxBlurKernelSize = require('./getMaxBlurKernelSize');

var _getMaxBlurKernelSize2 = _interopRequireDefault(_getMaxBlurKernelSize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * The BlurXFilter applies a horizontal Gaussian blur to an object.
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 */
var BlurXFilter = function (_core$Filter) {
    _inherits(BlurXFilter, _core$Filter);

    /**
     * @param {number} strength - The strength of the blur filter.
     * @param {number} quality - The quality of the blur filter.
     * @param {number} resolution - The reoslution of the blur filter.
     */
    function BlurXFilter(strength, quality, resolution) {
        _classCallCheck(this, BlurXFilter);

        var vertSrc = (0, _generateBlurVertSource2.default)(5, true);
        var fragSrc = (0, _generateBlurFragSource2.default)(5);

        var _this = _possibleConstructorReturn(this, _core$Filter.call(this,
        // vertex shader
        vertSrc,
        // fragment shader
        fragSrc));

        _this.resolution = resolution || 1;

        _this._quality = 0;

        _this.quality = quality || 4;
        _this.strength = strength || 8;

        _this.firstRun = true;
        return _this;
    }

    /**
     * Applies the filter.
     *
     * @param {PIXI.FilterManager} filterManager - The manager.
     * @param {PIXI.RenderTarget} input - The input target.
     * @param {PIXI.RenderTarget} output - The output target.
     * @param {boolean} clear - Should the output be cleared before rendering?
     */


    BlurXFilter.prototype.apply = function apply(filterManager, input, output, clear) {
        if (this.firstRun) {
            var gl = filterManager.renderer.gl;
            var kernelSize = (0, _getMaxBlurKernelSize2.default)(gl);

            this.vertexSrc = (0, _generateBlurVertSource2.default)(kernelSize, true);
            this.fragmentSrc = (0, _generateBlurFragSource2.default)(kernelSize);

            this.firstRun = false;
        }

        this.uniforms.strength = 1 / output.size.width * (output.size.width / input.size.width);

        // screen space!
        this.uniforms.strength *= this.strength;
        this.uniforms.strength /= this.passes; // / this.passes//Math.pow(1, this.passes);

        if (this.passes === 1) {
            filterManager.applyFilter(this, input, output, clear);
        } else {
            var renderTarget = filterManager.getRenderTarget(true);
            var flip = input;
            var flop = renderTarget;

            for (var i = 0; i < this.passes - 1; i++) {
                filterManager.applyFilter(this, flip, flop, true);

                var temp = flop;

                flop = flip;
                flip = temp;
            }

            filterManager.applyFilter(this, flip, output, clear);

            filterManager.returnRenderTarget(renderTarget);
        }
    };

    /**
     * Sets the strength of both the blur.
     *
     * @member {number}
     * @memberof PIXI.filters.BlurXFilter#
     * @default 16
     */


    _createClass(BlurXFilter, [{
        key: 'blur',
        get: function get() {
            return this.strength;
        }

        /**
         * Sets the strength of the blur.
         *
         * @param {number} value - The value to set.
         */
        ,
        set: function set(value) {
            this.padding = Math.abs(value) * 2;
            this.strength = value;
        }

        /**
        * Sets the quality of the blur by modifying the number of passes. More passes means higher
        * quaility bluring but the lower the performance.
        *
        * @member {number}
        * @memberof PIXI.filters.BlurXFilter#
        * @default 4
        */

    }, {
        key: 'quality',
        get: function get() {
            return this._quality;
        }

        /**
         * Sets the quality of the blur.
         *
         * @param {number} value - The value to set.
         */
        ,
        set: function set(value) {
            this._quality = value;
            this.passes = value;
        }
    }]);

    return BlurXFilter;
}(core.Filter);

exports.default = BlurXFilter;

},{"../../core":48,"./generateBlurFragSource":114,"./generateBlurVertSource":115,"./getMaxBlurKernelSize":116}],113:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _core = require('../../core');

var core = _interopRequireWildcard(_core);

var _generateBlurVertSource = require('./generateBlurVertSource');

var _generateBlurVertSource2 = _interopRequireDefault(_generateBlurVertSource);

var _generateBlurFragSource = require('./generateBlurFragSource');

var _generateBlurFragSource2 = _interopRequireDefault(_generateBlurFragSource);

var _getMaxBlurKernelSize = require('./getMaxBlurKernelSize');

var _getMaxBlurKernelSize2 = _interopRequireDefault(_getMaxBlurKernelSize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * The BlurYFilter applies a horizontal Gaussian blur to an object.
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 */
var BlurYFilter = function (_core$Filter) {
    _inherits(BlurYFilter, _core$Filter);

    /**
     * @param {number} strength - The strength of the blur filter.
     * @param {number} quality - The quality of the blur filter.
     * @param {number} resolution - The reoslution of the blur filter.
     */
    function BlurYFilter(strength, quality, resolution) {
        _classCallCheck(this, BlurYFilter);

        var vertSrc = (0, _generateBlurVertSource2.default)(5, false);
        var fragSrc = (0, _generateBlurFragSource2.default)(5);

        var _this = _possibleConstructorReturn(this, _core$Filter.call(this,
        // vertex shader
        vertSrc,
        // fragment shader
        fragSrc));

        _this.resolution = resolution || 1;

        _this._quality = 0;

        _this.quality = quality || 4;
        _this.strength = strength || 8;

        _this.firstRun = true;
        return _this;
    }

    /**
     * Applies the filter.
     *
     * @param {PIXI.FilterManager} filterManager - The manager.
     * @param {PIXI.RenderTarget} input - The input target.
     * @param {PIXI.RenderTarget} output - The output target.
     * @param {boolean} clear - Should the output be cleared before rendering?
     */


    BlurYFilter.prototype.apply = function apply(filterManager, input, output, clear) {
        if (this.firstRun) {
            var gl = filterManager.renderer.gl;
            var kernelSize = (0, _getMaxBlurKernelSize2.default)(gl);

            this.vertexSrc = (0, _generateBlurVertSource2.default)(kernelSize, false);
            this.fragmentSrc = (0, _generateBlurFragSource2.default)(kernelSize);

            this.firstRun = false;
        }

        this.uniforms.strength = 1 / output.size.height * (output.size.height / input.size.height);

        this.uniforms.strength *= this.strength;
        this.uniforms.strength /= this.passes;

        if (this.passes === 1) {
            filterManager.applyFilter(this, input, output, clear);
        } else {
            var renderTarget = filterManager.getRenderTarget(true);
            var flip = input;
            var flop = renderTarget;

            for (var i = 0; i < this.passes - 1; i++) {
                filterManager.applyFilter(this, flip, flop, true);

                var temp = flop;

                flop = flip;
                flip = temp;
            }

            filterManager.applyFilter(this, flip, output, clear);

            filterManager.returnRenderTarget(renderTarget);
        }
    };

    /**
     * Sets the strength of both the blur.
     *
     * @member {number}
     * @memberof PIXI.filters.BlurYFilter#
     * @default 2
     */


    _createClass(BlurYFilter, [{
        key: 'blur',
        get: function get() {
            return this.strength;
        }

        /**
         * Sets the strength of the blur.
         *
         * @param {number} value - The value to set.
         */
        ,
        set: function set(value) {
            this.padding = Math.abs(value) * 2;
            this.strength = value;
        }

        /**
         * Sets the quality of the blur by modifying the number of passes. More passes means higher
         * quaility bluring but the lower the performance.
         *
         * @member {number}
         * @memberof PIXI.filters.BlurXFilter#
         * @default 4
         */

    }, {
        key: 'quality',
        get: function get() {
            return this._quality;
        }

        /**
         * Sets the quality of the blur.
         *
         * @param {number} value - The value to set.
         */
        ,
        set: function set(value) {
            this._quality = value;
            this.passes = value;
        }
    }]);

    return BlurYFilter;
}(core.Filter);

exports.default = BlurYFilter;

},{"../../core":48,"./generateBlurFragSource":114,"./generateBlurVertSource":115,"./getMaxBlurKernelSize":116}],114:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.default = generateFragBlurSource;
var GAUSSIAN_VALUES = {
    5: [0.153388, 0.221461, 0.250301],
    7: [0.071303, 0.131514, 0.189879, 0.214607],
    9: [0.028532, 0.067234, 0.124009, 0.179044, 0.20236],
    11: [0.0093, 0.028002, 0.065984, 0.121703, 0.175713, 0.198596],
    13: [0.002406, 0.009255, 0.027867, 0.065666, 0.121117, 0.174868, 0.197641],
    15: [0.000489, 0.002403, 0.009246, 0.02784, 0.065602, 0.120999, 0.174697, 0.197448]
};

var fragTemplate = ['varying vec2 vBlurTexCoords[%size%];', 'uniform sampler2D uSampler;', 'void main(void)', '{', '    gl_FragColor = vec4(0.0);', '    %blur%', '}'].join('\n');

function generateFragBlurSource(kernelSize) {
    var kernel = GAUSSIAN_VALUES[kernelSize];
    var halfLength = kernel.length;

    var fragSource = fragTemplate;

    var blurLoop = '';
    var template = 'gl_FragColor += texture2D(uSampler, vBlurTexCoords[%index%]) * %value%;';
    var value = void 0;

    for (var i = 0; i < kernelSize; i++) {
        var blur = template.replace('%index%', i);

        value = i;

        if (i >= halfLength) {
            value = kernelSize - i - 1;
        }

        blur = blur.replace('%value%', kernel[value]);

        blurLoop += blur;
        blurLoop += '\n';
    }

    fragSource = fragSource.replace('%blur%', blurLoop);
    fragSource = fragSource.replace('%size%', kernelSize);

    return fragSource;
}

},{}],115:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.default = generateVertBlurSource;
var vertTemplate = ['attribute vec2 aVertexPosition;', 'attribute vec2 aTextureCoord;', 'uniform float strength;', 'uniform mat3 projectionMatrix;', 'varying vec2 vBlurTexCoords[%size%];', 'void main(void)', '{', 'gl_Position = vec4((projectionMatrix * vec3((aVertexPosition), 1.0)).xy, 0.0, 1.0);', '%blur%', '}'].join('\n');

function generateVertBlurSource(kernelSize, x) {
    var halfLength = Math.ceil(kernelSize / 2);

    var vertSource = vertTemplate;

    var blurLoop = '';
    var template = void 0;
    // let value;

    if (x) {
        template = 'vBlurTexCoords[%index%] = aTextureCoord + vec2(%sampleIndex% * strength, 0.0);';
    } else {
        template = 'vBlurTexCoords[%index%] = aTextureCoord + vec2(0.0, %sampleIndex% * strength);';
    }

    for (var i = 0; i < kernelSize; i++) {
        var blur = template.replace('%index%', i);

        // value = i;

        // if(i >= halfLength)
        // {
        //     value = kernelSize - i - 1;
        // }

        blur = blur.replace('%sampleIndex%', i - (halfLength - 1) + '.0');

        blurLoop += blur;
        blurLoop += '\n';
    }

    vertSource = vertSource.replace('%blur%', blurLoop);
    vertSource = vertSource.replace('%size%', kernelSize);

    return vertSource;
}

},{}],116:[function(require,module,exports){
"use strict";

exports.__esModule = true;
exports.default = getMaxKernelSize;
function getMaxKernelSize(gl) {
    var maxVaryings = gl.getParameter(gl.MAX_VARYING_VECTORS);
    var kernelSize = 15;

    while (kernelSize > maxVaryings) {
        kernelSize -= 2;
    }

    return kernelSize;
}

},{}],117:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _core = require('../../core');

var core = _interopRequireWildcard(_core);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

 // eslint-disable-line no-undef

/**
 * The ColorMatrixFilter class lets you apply a 5x4 matrix transformation on the RGBA
 * color and alpha values of every pixel on your displayObject to produce a result
 * with a new set of RGBA color and alpha values. It's pretty powerful!
 *
 * ```js
 *  let colorMatrix = new PIXI.ColorMatrixFilter();
 *  container.filters = [colorMatrix];
 *  colorMatrix.contrast(2);
 * ```
 * @author Clément Chenebault <clement@goodboydigital.com>
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 */

var ColorMatrixFilter = function (_core$Filter) {
    _inherits(ColorMatrixFilter, _core$Filter);

    /**
     *
     */
    function ColorMatrixFilter() {
        _classCallCheck(this, ColorMatrixFilter);

        var _this = _possibleConstructorReturn(this, _core$Filter.call(this,
        // vertex shader
        "#define GLSLIFY 1\nattribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}",
        // fragment shader
        "#define GLSLIFY 1\nvarying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform float m[20];\n\nvoid main(void)\n{\n\n    vec4 c = texture2D(uSampler, vTextureCoord);\n\n    gl_FragColor.r = (m[0] * c.r);\n        gl_FragColor.r += (m[1] * c.g);\n        gl_FragColor.r += (m[2] * c.b);\n        gl_FragColor.r += (m[3] * c.a);\n        gl_FragColor.r += m[4] * c.a;\n\n    gl_FragColor.g = (m[5] * c.r);\n        gl_FragColor.g += (m[6] * c.g);\n        gl_FragColor.g += (m[7] * c.b);\n        gl_FragColor.g += (m[8] * c.a);\n        gl_FragColor.g += m[9] * c.a;\n\n     gl_FragColor.b = (m[10] * c.r);\n        gl_FragColor.b += (m[11] * c.g);\n        gl_FragColor.b += (m[12] * c.b);\n        gl_FragColor.b += (m[13] * c.a);\n        gl_FragColor.b += m[14] * c.a;\n\n     gl_FragColor.a = (m[15] * c.r);\n        gl_FragColor.a += (m[16] * c.g);\n        gl_FragColor.a += (m[17] * c.b);\n        gl_FragColor.a += (m[18] * c.a);\n        gl_FragColor.a += m[19] * c.a;\n\n//    gl_FragColor = vec4(m[0]);\n}\n"));

        _this.uniforms.m = [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0];
        return _this;
    }

    /**
     * Transforms current matrix and set the new one
     *
     * @param {number[]} matrix - 5x4 matrix
     * @param {boolean} multiply - if true, current matrix and matrix are multiplied. If false,
     *  just set the current matrix with @param matrix
     */


    ColorMatrixFilter.prototype._loadMatrix = function _loadMatrix(matrix) {
        var multiply = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        var newMatrix = matrix;

        if (multiply) {
            this._multiply(newMatrix, this.uniforms.m, matrix);
            newMatrix = this._colorMatrix(newMatrix);
        }

        // set the new matrix
        this.uniforms.m = newMatrix;
    };

    /**
     * Multiplies two mat5's
     *
     * @private
     * @param {number[]} out - 5x4 matrix the receiving matrix
     * @param {number[]} a - 5x4 matrix the first operand
     * @param {number[]} b - 5x4 matrix the second operand
     * @returns {number[]} 5x4 matrix
     */


    ColorMatrixFilter.prototype._multiply = function _multiply(out, a, b) {
        // Red Channel
        out[0] = a[0] * b[0] + a[1] * b[5] + a[2] * b[10] + a[3] * b[15];
        out[1] = a[0] * b[1] + a[1] * b[6] + a[2] * b[11] + a[3] * b[16];
        out[2] = a[0] * b[2] + a[1] * b[7] + a[2] * b[12] + a[3] * b[17];
        out[3] = a[0] * b[3] + a[1] * b[8] + a[2] * b[13] + a[3] * b[18];
        out[4] = a[0] * b[4] + a[1] * b[9] + a[2] * b[14] + a[3] * b[19];

        // Green Channel
        out[5] = a[5] * b[0] + a[6] * b[5] + a[7] * b[10] + a[8] * b[15];
        out[6] = a[5] * b[1] + a[6] * b[6] + a[7] * b[11] + a[8] * b[16];
        out[7] = a[5] * b[2] + a[6] * b[7] + a[7] * b[12] + a[8] * b[17];
        out[8] = a[5] * b[3] + a[6] * b[8] + a[7] * b[13] + a[8] * b[18];
        out[9] = a[5] * b[4] + a[6] * b[9] + a[7] * b[14] + a[8] * b[19];

        // Blue Channel
        out[10] = a[10] * b[0] + a[11] * b[5] + a[12] * b[10] + a[13] * b[15];
        out[11] = a[10] * b[1] + a[11] * b[6] + a[12] * b[11] + a[13] * b[16];
        out[12] = a[10] * b[2] + a[11] * b[7] + a[12] * b[12] + a[13] * b[17];
        out[13] = a[10] * b[3] + a[11] * b[8] + a[12] * b[13] + a[13] * b[18];
        out[14] = a[10] * b[4] + a[11] * b[9] + a[12] * b[14] + a[13] * b[19];

        // Alpha Channel
        out[15] = a[15] * b[0] + a[16] * b[5] + a[17] * b[10] + a[18] * b[15];
        out[16] = a[15] * b[1] + a[16] * b[6] + a[17] * b[11] + a[18] * b[16];
        out[17] = a[15] * b[2] + a[16] * b[7] + a[17] * b[12] + a[18] * b[17];
        out[18] = a[15] * b[3] + a[16] * b[8] + a[17] * b[13] + a[18] * b[18];
        out[19] = a[15] * b[4] + a[16] * b[9] + a[17] * b[14] + a[18] * b[19];

        return out;
    };

    /**
     * Create a Float32 Array and normalize the offset component to 0-1
     *
     * @private
     * @param {number[]} matrix - 5x4 matrix
     * @return {number[]} 5x4 matrix with all values between 0-1
     */


    ColorMatrixFilter.prototype._colorMatrix = function _colorMatrix(matrix) {
        // Create a Float32 Array and normalize the offset component to 0-1
        var m = new Float32Array(matrix);

        m[4] /= 255;
        m[9] /= 255;
        m[14] /= 255;
        m[19] /= 255;

        return m;
    };

    /**
     * Adjusts brightness
     *
     * @param {number} b - value of the brigthness (0-1, where 0 is black)
     * @param {boolean} multiply - if true, current matrix and matrix are multiplied. If false,
     *  just set the current matrix with @param matrix
     */


    ColorMatrixFilter.prototype.brightness = function brightness(b, multiply) {
        var matrix = [b, 0, 0, 0, 0, 0, b, 0, 0, 0, 0, 0, b, 0, 0, 0, 0, 0, 1, 0];

        this._loadMatrix(matrix, multiply);
    };

    /**
     * Set the matrices in grey scales
     *
     * @param {number} scale - value of the grey (0-1, where 0 is black)
     * @param {boolean} multiply - if true, current matrix and matrix are multiplied. If false,
     *  just set the current matrix with @param matrix
     */


    ColorMatrixFilter.prototype.greyscale = function greyscale(scale, multiply) {
        var matrix = [scale, scale, scale, 0, 0, scale, scale, scale, 0, 0, scale, scale, scale, 0, 0, 0, 0, 0, 1, 0];

        this._loadMatrix(matrix, multiply);
    };

    /**
     * Set the black and white matrice.
     *
     * @param {boolean} multiply - if true, current matrix and matrix are multiplied. If false,
     *  just set the current matrix with @param matrix
     */


    ColorMatrixFilter.prototype.blackAndWhite = function blackAndWhite(multiply) {
        var matrix = [0.3, 0.6, 0.1, 0, 0, 0.3, 0.6, 0.1, 0, 0, 0.3, 0.6, 0.1, 0, 0, 0, 0, 0, 1, 0];

        this._loadMatrix(matrix, multiply);
    };

    /**
     * Set the hue property of the color
     *
     * @param {number} rotation - in degrees
     * @param {boolean} multiply - if true, current matrix and matrix are multiplied. If false,
     *  just set the current matrix with @param matrix
     */


    ColorMatrixFilter.prototype.hue = function hue(rotation, multiply) {
        rotation = (rotation || 0) / 180 * Math.PI;

        var cosR = Math.cos(rotation);
        var sinR = Math.sin(rotation);
        var sqrt = Math.sqrt;

        /* a good approximation for hue rotation
         This matrix is far better than the versions with magic luminance constants
         formerly used here, but also used in the starling framework (flash) and known from this
         old part of the internet: quasimondo.com/archives/000565.php
          This new matrix is based on rgb cube rotation in space. Look here for a more descriptive
         implementation as a shader not a general matrix:
         https://github.com/evanw/glfx.js/blob/58841c23919bd59787effc0333a4897b43835412/src/filters/adjust/huesaturation.js
          This is the source for the code:
         see http://stackoverflow.com/questions/8507885/shift-hue-of-an-rgb-color/8510751#8510751
         */

        var w = 1 / 3;
        var sqrW = sqrt(w); // weight is

        var a00 = cosR + (1.0 - cosR) * w;
        var a01 = w * (1.0 - cosR) - sqrW * sinR;
        var a02 = w * (1.0 - cosR) + sqrW * sinR;

        var a10 = w * (1.0 - cosR) + sqrW * sinR;
        var a11 = cosR + w * (1.0 - cosR);
        var a12 = w * (1.0 - cosR) - sqrW * sinR;

        var a20 = w * (1.0 - cosR) - sqrW * sinR;
        var a21 = w * (1.0 - cosR) + sqrW * sinR;
        var a22 = cosR + w * (1.0 - cosR);

        var matrix = [a00, a01, a02, 0, 0, a10, a11, a12, 0, 0, a20, a21, a22, 0, 0, 0, 0, 0, 1, 0];

        this._loadMatrix(matrix, multiply);
    };

    /**
     * Set the contrast matrix, increase the separation between dark and bright
     * Increase contrast : shadows darker and highlights brighter
     * Decrease contrast : bring the shadows up and the highlights down
     *
     * @param {number} amount - value of the contrast (0-1)
     * @param {boolean} multiply - if true, current matrix and matrix are multiplied. If false,
     *  just set the current matrix with @param matrix
     */


    ColorMatrixFilter.prototype.contrast = function contrast(amount, multiply) {
        var v = (amount || 0) + 1;
        var o = -128 * (v - 1);

        var matrix = [v, 0, 0, 0, o, 0, v, 0, 0, o, 0, 0, v, 0, o, 0, 0, 0, 1, 0];

        this._loadMatrix(matrix, multiply);
    };

    /**
     * Set the saturation matrix, increase the separation between colors
     * Increase saturation : increase contrast, brightness, and sharpness
     *
     * @param {number} amount - The saturation amount (0-1)
     * @param {boolean} multiply - if true, current matrix and matrix are multiplied. If false,
     *  just set the current matrix with @param matrix
     */


    ColorMatrixFilter.prototype.saturate = function saturate() {
        var amount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        var multiply = arguments[1];

        var x = amount * 2 / 3 + 1;
        var y = (x - 1) * -0.5;

        var matrix = [x, y, y, 0, 0, y, x, y, 0, 0, y, y, x, 0, 0, 0, 0, 0, 1, 0];

        this._loadMatrix(matrix, multiply);
    };

    /**
     * Desaturate image (remove color)
     *
     * Call the saturate function
     *
     */


    ColorMatrixFilter.prototype.desaturate = function desaturate() // eslint-disable-line no-unused-vars
    {
        this.saturate(-1);
    };

    /**
     * Negative image (inverse of classic rgb matrix)
     *
     * @param {boolean} multiply - if true, current matrix and matrix are multiplied. If false,
     *  just set the current matrix with @param matrix
     */


    ColorMatrixFilter.prototype.negative = function negative(multiply) {
        var matrix = [0, 1, 1, 0, 0, 1, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0];

        this._loadMatrix(matrix, multiply);
    };

    /**
     * Sepia image
     *
     * @param {boolean} multiply - if true, current matrix and matrix are multiplied. If false,
     *  just set the current matrix with @param matrix
     */


    ColorMatrixFilter.prototype.sepia = function sepia(multiply) {
        var matrix = [0.393, 0.7689999, 0.18899999, 0, 0, 0.349, 0.6859999, 0.16799999, 0, 0, 0.272, 0.5339999, 0.13099999, 0, 0, 0, 0, 0, 1, 0];

        this._loadMatrix(matrix, multiply);
    };

    /**
     * Color motion picture process invented in 1916 (thanks Dominic Szablewski)
     *
     * @param {boolean} multiply - if true, current matrix and matrix are multiplied. If false,
     *  just set the current matrix with @param matrix
     */


    ColorMatrixFilter.prototype.technicolor = function technicolor(multiply) {
        var matrix = [1.9125277891456083, -0.8545344976951645, -0.09155508482755585, 0, 11.793603434377337, -0.3087833385928097, 1.7658908555458428, -0.10601743074722245, 0, -70.35205161461398, -0.231103377548616, -0.7501899197440212, 1.847597816108189, 0, 30.950940869491138, 0, 0, 0, 1, 0];

        this._loadMatrix(matrix, multiply);
    };

    /**
     * Polaroid filter
     *
     * @param {boolean} multiply - if true, current matrix and matrix are multiplied. If false,
     *  just set the current matrix with @param matrix
     */


    ColorMatrixFilter.prototype.polaroid = function polaroid(multiply) {
        var matrix = [1.438, -0.062, -0.062, 0, 0, -0.122, 1.378, -0.122, 0, 0, -0.016, -0.016, 1.483, 0, 0, 0, 0, 0, 1, 0];

        this._loadMatrix(matrix, multiply);
    };

    /**
     * Filter who transforms : Red -> Blue and Blue -> Red
     *
     * @param {boolean} multiply - if true, current matrix and matrix are multiplied. If false,
     *  just set the current matrix with @param matrix
     */


    ColorMatrixFilter.prototype.toBGR = function toBGR(multiply) {
        var matrix = [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0];

        this._loadMatrix(matrix, multiply);
    };

    /**
     * Color reversal film introduced by Eastman Kodak in 1935. (thanks Dominic Szablewski)
     *
     * @param {boolean} multiply - if true, current matrix and matrix are multiplied. If false,
     *  just set the current matrix with @param matrix
     */


    ColorMatrixFilter.prototype.kodachrome = function kodachrome(multiply) {
        var matrix = [1.1285582396593525, -0.3967382283601348, -0.03992559172921793, 0, 63.72958762196502, -0.16404339962244616, 1.0835251566291304, -0.05498805115633132, 0, 24.732407896706203, -0.16786010706155763, -0.5603416277695248, 1.6014850761964943, 0, 35.62982807460946, 0, 0, 0, 1, 0];

        this._loadMatrix(matrix, multiply);
    };

    /**
     * Brown delicious browni filter (thanks Dominic Szablewski)
     *
     * @param {boolean} multiply - if true, current matrix and matrix are multiplied. If false,
     *  just set the current matrix with @param matrix
     */


    ColorMatrixFilter.prototype.browni = function browni(multiply) {
        var matrix = [0.5997023498159715, 0.34553243048391263, -0.2708298674538042, 0, 47.43192855600873, -0.037703249837783157, 0.8609577587992641, 0.15059552388459913, 0, -36.96841498319127, 0.24113635128153335, -0.07441037908422492, 0.44972182064877153, 0, -7.562075277591283, 0, 0, 0, 1, 0];

        this._loadMatrix(matrix, multiply);
    };

    /**
     * Vintage filter (thanks Dominic Szablewski)
     *
     * @param {boolean} multiply - if true, current matrix and matrix are multiplied. If false,
     *  just set the current matrix with @param matrix
     */


    ColorMatrixFilter.prototype.vintage = function vintage(multiply) {
        var matrix = [0.6279345635605994, 0.3202183420819367, -0.03965408211312453, 0, 9.651285835294123, 0.02578397704808868, 0.6441188644374771, 0.03259127616149294, 0, 7.462829176470591, 0.0466055556782719, -0.0851232987247891, 0.5241648018700465, 0, 5.159190588235296, 0, 0, 0, 1, 0];

        this._loadMatrix(matrix, multiply);
    };

    /**
     * We don't know exactly what it does, kind of gradient map, but funny to play with!
     *
     * @param {number} desaturation - Tone values.
     * @param {number} toned - Tone values.
     * @param {string} lightColor - Tone values, example: `0xFFE580`
     * @param {string} darkColor - Tone values, example: `0xFFE580`
     * @param {boolean} multiply - if true, current matrix and matrix are multiplied. If false,
     *  just set the current matrix with @param matrix
     */


    ColorMatrixFilter.prototype.colorTone = function colorTone(desaturation, toned, lightColor, darkColor, multiply) {
        desaturation = desaturation || 0.2;
        toned = toned || 0.15;
        lightColor = lightColor || 0xFFE580;
        darkColor = darkColor || 0x338000;

        var lR = (lightColor >> 16 & 0xFF) / 255;
        var lG = (lightColor >> 8 & 0xFF) / 255;
        var lB = (lightColor & 0xFF) / 255;

        var dR = (darkColor >> 16 & 0xFF) / 255;
        var dG = (darkColor >> 8 & 0xFF) / 255;
        var dB = (darkColor & 0xFF) / 255;

        var matrix = [0.3, 0.59, 0.11, 0, 0, lR, lG, lB, desaturation, 0, dR, dG, dB, toned, 0, lR - dR, lG - dG, lB - dB, 0, 0];

        this._loadMatrix(matrix, multiply);
    };

    /**
     * Night effect
     *
     * @param {number} intensity - The intensity of the night effect.
     * @param {boolean} multiply - if true, current matrix and matrix are multiplied. If false,
     *  just set the current matrix with @param matrix
     */


    ColorMatrixFilter.prototype.night = function night(intensity, multiply) {
        intensity = intensity || 0.1;
        var matrix = [intensity * -2.0, -intensity, 0, 0, 0, -intensity, 0, intensity, 0, 0, 0, intensity, intensity * 2.0, 0, 0, 0, 0, 0, 1, 0];

        this._loadMatrix(matrix, multiply);
    };

    /**
     * Predator effect
     *
     * Erase the current matrix by setting a new indepent one
     *
     * @param {number} amount - how much the predator feels his future victim
     * @param {boolean} multiply - if true, current matrix and matrix are multiplied. If false,
     *  just set the current matrix with @param matrix
     */


    ColorMatrixFilter.prototype.predator = function predator(amount, multiply) {
        var matrix = [
        // row 1
        11.224130630493164 * amount, -4.794486999511719 * amount, -2.8746118545532227 * amount, 0 * amount, 0.40342438220977783 * amount,
        // row 2
        -3.6330697536468506 * amount, 9.193157196044922 * amount, -2.951810836791992 * amount, 0 * amount, -1.316135048866272 * amount,
        // row 3
        -3.2184197902679443 * amount, -4.2375030517578125 * amount, 7.476448059082031 * amount, 0 * amount, 0.8044459223747253 * amount,
        // row 4
        0, 0, 0, 1, 0];

        this._loadMatrix(matrix, multiply);
    };

    /**
     * LSD effect
     *
     * Multiply the current matrix
     *
     * @param {boolean} multiply - if true, current matrix and matrix are multiplied. If false,
     *  just set the current matrix with @param matrix
     */


    ColorMatrixFilter.prototype.lsd = function lsd(multiply) {
        var matrix = [2, -0.4, 0.5, 0, 0, -0.5, 2, -0.4, 0, 0, -0.4, -0.5, 3, 0, 0, 0, 0, 0, 1, 0];

        this._loadMatrix(matrix, multiply);
    };

    /**
     * Erase the current matrix by setting the default one
     *
     */


    ColorMatrixFilter.prototype.reset = function reset() {
        var matrix = [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0];

        this._loadMatrix(matrix, false);
    };

    /**
     * The matrix of the color matrix filter
     *
     * @member {number[]}
     * @memberof PIXI.filters.ColorMatrixFilter#
     * @default [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0]
     */


    _createClass(ColorMatrixFilter, [{
        key: 'matrix',
        get: function get() {
            return this.uniforms.m;
        }

        /**
         * Sets the matrix directly.
         *
         * @param {number[]} value - the value to set to.
         */
        ,
        set: function set(value) {
            this.uniforms.m = value;
        }
    }]);

    return ColorMatrixFilter;
}(core.Filter);

// Americanized alias


exports.default = ColorMatrixFilter;
ColorMatrixFilter.prototype.grayscale = ColorMatrixFilter.prototype.greyscale;

},{"../../core":48}],118:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _core = require('../../core');

var core = _interopRequireWildcard(_core);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

 // eslint-disable-line no-undef

/**
 * The DisplacementFilter class uses the pixel values from the specified texture
 * (called the displacement map) to perform a displacement of an object. You can
 * use this filter to apply all manor of crazy warping effects. Currently the r
 * property of the texture is used to offset the x and the g property of the texture
 * is used to offset the y.
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 */

var DisplacementFilter = function (_core$Filter) {
    _inherits(DisplacementFilter, _core$Filter);

    /**
     * @param {PIXI.Sprite} sprite - The sprite used for the displacement map. (make sure its added to the scene!)
     * @param {number} scale - The scale of the displacement
     */
    function DisplacementFilter(sprite, scale) {
        _classCallCheck(this, DisplacementFilter);

        var maskMatrix = new core.Matrix();

        sprite.renderable = false;

        var _this = _possibleConstructorReturn(this, _core$Filter.call(this,
        // vertex shader
        "#define GLSLIFY 1\nattribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\nuniform mat3 filterMatrix;\n\nvarying vec2 vTextureCoord;\nvarying vec2 vFilterCoord;\n\nvoid main(void)\n{\n   gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n   vFilterCoord = ( filterMatrix * vec3( aTextureCoord, 1.0)  ).xy;\n   vTextureCoord = aTextureCoord;\n}",
        // fragment shader
        "#define GLSLIFY 1\nvarying vec2 vFilterCoord;\nvarying vec2 vTextureCoord;\n\nuniform vec2 scale;\n\nuniform sampler2D uSampler;\nuniform sampler2D mapSampler;\n\nuniform vec4 filterClamp;\n\nvoid main(void)\n{\n   vec4 map =  texture2D(mapSampler, vFilterCoord);\n\n   map -= 0.5;\n   map.xy *= scale;\n\n   gl_FragColor = texture2D(uSampler, clamp(vec2(vTextureCoord.x + map.x, vTextureCoord.y + map.y), filterClamp.xy, filterClamp.zw));\n}\n"));

        _this.maskSprite = sprite;
        _this.maskMatrix = maskMatrix;

        _this.uniforms.mapSampler = sprite.texture;
        _this.uniforms.filterMatrix = maskMatrix.toArray(true);
        _this.uniforms.scale = { x: 1, y: 1 };

        if (scale === null || scale === undefined) {
            scale = 20;
        }

        _this.scale = new core.Point(scale, scale);
        return _this;
    }

    /**
     * Applies the filter.
     *
     * @param {PIXI.FilterManager} filterManager - The manager.
     * @param {PIXI.RenderTarget} input - The input target.
     * @param {PIXI.RenderTarget} output - The output target.
     */


    DisplacementFilter.prototype.apply = function apply(filterManager, input, output) {
        var ratio = 1 / output.destinationFrame.width * (output.size.width / input.size.width);

        this.uniforms.filterMatrix = filterManager.calculateSpriteMatrix(this.maskMatrix, this.maskSprite);
        this.uniforms.scale.x = this.scale.x * ratio;
        this.uniforms.scale.y = this.scale.y * ratio;

        // draw the filter...
        filterManager.applyFilter(this, input, output);
    };

    /**
     * The texture used for the displacement map. Must be power of 2 sized texture.
     *
     * @member {PIXI.Texture}
     * @memberof PIXI.filters.DisplacementFilter#
     */


    _createClass(DisplacementFilter, [{
        key: 'map',
        get: function get() {
            return this.uniforms.mapSampler;
        }

        /**
         * Sets the texture to use for the displacement.
         *
         * @param {PIXI.Texture} value - The texture to set to.
         */
        ,
        set: function set(value) {
            this.uniforms.mapSampler = value;
        }
    }]);

    return DisplacementFilter;
}(core.Filter);

exports.default = DisplacementFilter;

},{"../../core":48}],119:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _core = require('../../core');

var core = _interopRequireWildcard(_core);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

 // eslint-disable-line no-undef

/**
 *
 * Basic FXAA implementation based on the code on geeks3d.com with the
 * modification that the texture2DLod stuff was removed since it's
 * unsupported by WebGL.
 *
 * @see https://github.com/mitsuhiko/webgl-meincraft
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI
 *
 */

var FXAAFilter = function (_core$Filter) {
    _inherits(FXAAFilter, _core$Filter);

    /**
     *
     */
    function FXAAFilter() {
        _classCallCheck(this, FXAAFilter);

        // TODO - needs work
        return _possibleConstructorReturn(this, _core$Filter.call(this,
        // vertex shader
        "#define GLSLIFY 1\nattribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 v_rgbNW;\nvarying vec2 v_rgbNE;\nvarying vec2 v_rgbSW;\nvarying vec2 v_rgbSE;\nvarying vec2 v_rgbM;\n\nuniform vec4 filterArea;\n\nvarying vec2 vTextureCoord;\n\nvec2 mapCoord( vec2 coord )\n{\n    coord *= filterArea.xy;\n    coord += filterArea.zw;\n\n    return coord;\n}\n\nvec2 unmapCoord( vec2 coord )\n{\n    coord -= filterArea.zw;\n    coord /= filterArea.xy;\n\n    return coord;\n}\n\nvoid texcoords(vec2 fragCoord, vec2 resolution,\n               out vec2 v_rgbNW, out vec2 v_rgbNE,\n               out vec2 v_rgbSW, out vec2 v_rgbSE,\n               out vec2 v_rgbM) {\n    vec2 inverseVP = 1.0 / resolution.xy;\n    v_rgbNW = (fragCoord + vec2(-1.0, -1.0)) * inverseVP;\n    v_rgbNE = (fragCoord + vec2(1.0, -1.0)) * inverseVP;\n    v_rgbSW = (fragCoord + vec2(-1.0, 1.0)) * inverseVP;\n    v_rgbSE = (fragCoord + vec2(1.0, 1.0)) * inverseVP;\n    v_rgbM = vec2(fragCoord * inverseVP);\n}\n\nvoid main(void) {\n\n   gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n\n   vTextureCoord = aTextureCoord;\n\n   vec2 fragCoord = vTextureCoord * filterArea.xy;\n\n   texcoords(fragCoord, filterArea.xy, v_rgbNW, v_rgbNE, v_rgbSW, v_rgbSE, v_rgbM);\n}",
        // fragment shader
        "#define GLSLIFY 1\nvarying vec2 v_rgbNW;\nvarying vec2 v_rgbNE;\nvarying vec2 v_rgbSW;\nvarying vec2 v_rgbSE;\nvarying vec2 v_rgbM;\n\nvarying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform vec4 filterArea;\n\n/**\n Basic FXAA implementation based on the code on geeks3d.com with the\n modification that the texture2DLod stuff was removed since it's\n unsupported by WebGL.\n \n --\n \n From:\n https://github.com/mitsuhiko/webgl-meincraft\n \n Copyright (c) 2011 by Armin Ronacher.\n \n Some rights reserved.\n \n Redistribution and use in source and binary forms, with or without\n modification, are permitted provided that the following conditions are\n met:\n \n * Redistributions of source code must retain the above copyright\n notice, this list of conditions and the following disclaimer.\n \n * Redistributions in binary form must reproduce the above\n copyright notice, this list of conditions and the following\n disclaimer in the documentation and/or other materials provided\n with the distribution.\n \n * The names of the contributors may not be used to endorse or\n promote products derived from this software without specific\n prior written permission.\n \n THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS\n \"AS IS\" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT\n LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR\n A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT\n OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,\n SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT\n LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,\n DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY\n THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT\n (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE\n OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.\n */\n\n#ifndef FXAA_REDUCE_MIN\n#define FXAA_REDUCE_MIN   (1.0/ 128.0)\n#endif\n#ifndef FXAA_REDUCE_MUL\n#define FXAA_REDUCE_MUL   (1.0 / 8.0)\n#endif\n#ifndef FXAA_SPAN_MAX\n#define FXAA_SPAN_MAX     8.0\n#endif\n\n//optimized version for mobile, where dependent\n//texture reads can be a bottleneck\nvec4 fxaa(sampler2D tex, vec2 fragCoord, vec2 resolution,\n          vec2 v_rgbNW, vec2 v_rgbNE,\n          vec2 v_rgbSW, vec2 v_rgbSE,\n          vec2 v_rgbM) {\n    vec4 color;\n    mediump vec2 inverseVP = vec2(1.0 / resolution.x, 1.0 / resolution.y);\n    vec3 rgbNW = texture2D(tex, v_rgbNW).xyz;\n    vec3 rgbNE = texture2D(tex, v_rgbNE).xyz;\n    vec3 rgbSW = texture2D(tex, v_rgbSW).xyz;\n    vec3 rgbSE = texture2D(tex, v_rgbSE).xyz;\n    vec4 texColor = texture2D(tex, v_rgbM);\n    vec3 rgbM  = texColor.xyz;\n    vec3 luma = vec3(0.299, 0.587, 0.114);\n    float lumaNW = dot(rgbNW, luma);\n    float lumaNE = dot(rgbNE, luma);\n    float lumaSW = dot(rgbSW, luma);\n    float lumaSE = dot(rgbSE, luma);\n    float lumaM  = dot(rgbM,  luma);\n    float lumaMin = min(lumaM, min(min(lumaNW, lumaNE), min(lumaSW, lumaSE)));\n    float lumaMax = max(lumaM, max(max(lumaNW, lumaNE), max(lumaSW, lumaSE)));\n    \n    mediump vec2 dir;\n    dir.x = -((lumaNW + lumaNE) - (lumaSW + lumaSE));\n    dir.y =  ((lumaNW + lumaSW) - (lumaNE + lumaSE));\n    \n    float dirReduce = max((lumaNW + lumaNE + lumaSW + lumaSE) *\n                          (0.25 * FXAA_REDUCE_MUL), FXAA_REDUCE_MIN);\n    \n    float rcpDirMin = 1.0 / (min(abs(dir.x), abs(dir.y)) + dirReduce);\n    dir = min(vec2(FXAA_SPAN_MAX, FXAA_SPAN_MAX),\n              max(vec2(-FXAA_SPAN_MAX, -FXAA_SPAN_MAX),\n                  dir * rcpDirMin)) * inverseVP;\n    \n    vec3 rgbA = 0.5 * (\n                       texture2D(tex, fragCoord * inverseVP + dir * (1.0 / 3.0 - 0.5)).xyz +\n                       texture2D(tex, fragCoord * inverseVP + dir * (2.0 / 3.0 - 0.5)).xyz);\n    vec3 rgbB = rgbA * 0.5 + 0.25 * (\n                                     texture2D(tex, fragCoord * inverseVP + dir * -0.5).xyz +\n                                     texture2D(tex, fragCoord * inverseVP + dir * 0.5).xyz);\n    \n    float lumaB = dot(rgbB, luma);\n    if ((lumaB < lumaMin) || (lumaB > lumaMax))\n        color = vec4(rgbA, texColor.a);\n    else\n        color = vec4(rgbB, texColor.a);\n    return color;\n}\n\nvoid main() {\n\n      vec2 fragCoord = vTextureCoord * filterArea.xy;\n\n      vec4 color;\n\n    color = fxaa(uSampler, fragCoord, filterArea.xy, v_rgbNW, v_rgbNE, v_rgbSW, v_rgbSE, v_rgbM);\n\n      gl_FragColor = color;\n}\n"));
    }

    return FXAAFilter;
}(core.Filter);

exports.default = FXAAFilter;

},{"../../core":48}],120:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _FXAAFilter = require('./fxaa/FXAAFilter');

Object.defineProperty(exports, 'FXAAFilter', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_FXAAFilter).default;
  }
});

var _NoiseFilter = require('./noise/NoiseFilter');

Object.defineProperty(exports, 'NoiseFilter', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_NoiseFilter).default;
  }
});

var _DisplacementFilter = require('./displacement/DisplacementFilter');

Object.defineProperty(exports, 'DisplacementFilter', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_DisplacementFilter).default;
  }
});

var _BlurFilter = require('./blur/BlurFilter');

Object.defineProperty(exports, 'BlurFilter', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_BlurFilter).default;
  }
});

var _BlurXFilter = require('./blur/BlurXFilter');

Object.defineProperty(exports, 'BlurXFilter', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_BlurXFilter).default;
  }
});

var _BlurYFilter = require('./blur/BlurYFilter');

Object.defineProperty(exports, 'BlurYFilter', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_BlurYFilter).default;
  }
});

var _ColorMatrixFilter = require('./colormatrix/ColorMatrixFilter');

Object.defineProperty(exports, 'ColorMatrixFilter', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_ColorMatrixFilter).default;
  }
});

var _VoidFilter = require('./void/VoidFilter');

Object.defineProperty(exports, 'VoidFilter', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_VoidFilter).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./blur/BlurFilter":111,"./blur/BlurXFilter":112,"./blur/BlurYFilter":113,"./colormatrix/ColorMatrixFilter":117,"./displacement/DisplacementFilter":118,"./fxaa/FXAAFilter":119,"./noise/NoiseFilter":121,"./void/VoidFilter":122}],121:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _core = require('../../core');

var core = _interopRequireWildcard(_core);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

 // eslint-disable-line no-undef

/**
 * @author Vico @vicocotea
 * original filter: https://github.com/evanw/glfx.js/blob/master/src/filters/adjust/noise.js
 */

/**
 * A Noise effect filter.
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 */

var NoiseFilter = function (_core$Filter) {
  _inherits(NoiseFilter, _core$Filter);

  /**
   *
   */
  function NoiseFilter() {
    _classCallCheck(this, NoiseFilter);

    var _this = _possibleConstructorReturn(this, _core$Filter.call(this,
    // vertex shader
    "#define GLSLIFY 1\nattribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}",
    // fragment shader
    "precision highp float;\n#define GLSLIFY 1\n\nvarying vec2 vTextureCoord;\nvarying vec4 vColor;\n\nuniform float noise;\nuniform sampler2D uSampler;\n\nfloat rand(vec2 co)\n{\n    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);\n}\n\nvoid main()\n{\n    vec4 color = texture2D(uSampler, vTextureCoord);\n\n    float diff = (rand(gl_FragCoord.xy) - 0.5) * noise;\n\n    color.r += diff;\n    color.g += diff;\n    color.b += diff;\n\n    gl_FragColor = color;\n}\n"));

    _this.noise = 0.5;
    return _this;
  }

  /**
   * The amount of noise to apply.
   *
   * @member {number}
   * @memberof PIXI.filters.NoiseFilter#
   * @default 0.5
   */


  _createClass(NoiseFilter, [{
    key: 'noise',
    get: function get() {
      return this.uniforms.noise;
    }

    /**
     * Sets the amount of noise to apply.
     *
     * @param {number} value - The value to set to.
     */
    ,
    set: function set(value) {
      this.uniforms.noise = value;
    }
  }]);

  return NoiseFilter;
}(core.Filter);

exports.default = NoiseFilter;

},{"../../core":48}],122:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _core = require('../../core');

var core = _interopRequireWildcard(_core);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// @see https://github.com/substack/brfs/issues/25
 // eslint-disable-line no-undef

/**
 * Does nothing. Very handy.
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 */

var VoidFilter = function (_core$Filter) {
    _inherits(VoidFilter, _core$Filter);

    /**
     *
     */
    function VoidFilter() {
        _classCallCheck(this, VoidFilter);

        var _this = _possibleConstructorReturn(this, _core$Filter.call(this,
        // vertex shader
        "#define GLSLIFY 1\nattribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}",
        // fragment shader
        "#define GLSLIFY 1\nvarying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\n\nvoid main(void)\n{\n   gl_FragColor = texture2D(uSampler, vTextureCoord);\n}\n"));

        _this.glShaderKey = 'void';
        return _this;
    }

    return VoidFilter;
}(core.Filter);

exports.default = VoidFilter;

},{"../../core":48}],123:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _core = require('../core');

var core = _interopRequireWildcard(_core);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var tempPoint = new core.Point();
var tempPolygon = new core.Polygon();

/**
 * Base mesh class
 * @class
 * @extends PIXI.Container
 * @memberof PIXI.mesh
 */

var Mesh = function (_game$Container) {
  _inherits(Mesh, _game$Container);

  /**
   * @param {PIXI.Texture} texture - The texture to use
   * @param {Float32Array} [vertices] - if you want to specify the vertices
   * @param {Float32Array} [uvs] - if you want to specify the uvs
   * @param {Uint16Array} [indices] - if you want to specify the indices
   * @param {number} [drawMode] - the drawMode, can be any of the Mesh.DRAW_MODES consts
   */
  function Mesh(texture, vertices, uvs, indices, drawMode) {
    _classCallCheck(this, Mesh);

    /**
     * The texture of the Mesh
     *
     * @member {PIXI.Texture}
     * @private
     */
    var _this = _possibleConstructorReturn(this, _game$Container.call(this));

    _this._texture = null;

    /**
     * The Uvs of the Mesh
     *
     * @member {Float32Array}
     */
    _this.uvs = uvs || new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]);

    /**
     * An array of vertices
     *
     * @member {Float32Array}
     */
    _this.vertices = vertices || new Float32Array([0, 0, 100, 0, 100, 100, 0, 100]);

    /*
     * @member {Uint16Array} An array containing the indices of the vertices
     */
    //  TODO auto generate this based on draw mode!
    _this.indices = indices || new Uint16Array([0, 1, 3, 2]);

    /**
     * Version of mesh uvs are dirty or not
     *
     * @member {number}
     */
    _this.dirty = 0;

    /**
     * Version of mesh indices
     *
     * @member {number}
     */
    _this.indexDirty = 0;

    /**
     * The blend mode to be applied to the sprite. Set to `PIXI.BLEND_MODES.NORMAL` to remove
     * any blend mode.
     *
     * @member {number}
     * @default PIXI.BLEND_MODES.NORMAL
     * @see PIXI.BLEND_MODES
     */
    _this.blendMode = core.BLEND_MODES.NORMAL;

    /**
     * Triangles in canvas mode are automatically antialiased, use this value to force triangles
     * to overlap a bit with each other.
     *
     * @member {number}
     */
    _this.canvasPadding = 0;

    /**
     * The way the Mesh should be drawn, can be any of the {@link PIXI.mesh.Mesh.DRAW_MODES} consts
     *
     * @member {number}
     * @see PIXI.mesh.Mesh.DRAW_MODES
     */
    _this.drawMode = drawMode || Mesh.DRAW_MODES.TRIANGLE_MESH;

    // run texture setter;
    _this.texture = texture;

    /**
     * The default shader that is used if a mesh doesn't have a more specific one.
     *
     * @member {PIXI.Shader}
     */
    _this.shader = null;

    /**
     * The tint applied to the mesh. This is a [r,g,b] value. A value of [1,1,1] will remove any
     * tint effect.
     *
     * @member {number}
     * @memberof PIXI.mesh.Mesh#
     */
    _this.tintRgb = new Float32Array([1, 1, 1]);

    /**
     * A map of renderer IDs to webgl render data
     *
     * @private
     * @member {object<number, object>}
     */
    _this._glDatas = {};
    return _this;
  }

  /**
   * Renders the object using the WebGL renderer
   *
   * @private
   * @param {PIXI.WebGLRenderer} renderer - a reference to the WebGL renderer
   */


  Mesh.prototype._renderWebGL = function _renderWebGL(renderer) {
    renderer.setObjectRenderer(renderer.plugins.mesh);
    renderer.plugins.mesh.render(this);
  };

  /**
   * Renders the object using the Canvas renderer
   *
   * @private
   * @param {PIXI.CanvasRenderer} renderer - The canvas renderer.
   */


  Mesh.prototype._renderCanvas = function _renderCanvas(renderer) {
    renderer.plugins.mesh.render(this);
  };

  /**
   * When the texture is updated, this event will fire to update the scale and frame
   *
   * @private
   */


  Mesh.prototype._onTextureUpdate = function _onTextureUpdate() {}
  /* empty */


  /**
   * Returns the bounds of the mesh as a rectangle. The bounds calculation takes the worldTransform into account.
   *
   */
  ;

  Mesh.prototype._calculateBounds = function _calculateBounds() {
    // TODO - we can cache local bounds and use them if they are dirty (like graphics)
    this._bounds.addVertices(this.transform, this.vertices, 0, this.vertices.length);
  };

  /**
   * Tests if a point is inside this mesh. Works only for TRIANGLE_MESH
   *
   * @param {PIXI.Point} point - the point to test
   * @return {boolean} the result of the test
   */


  Mesh.prototype.containsPoint = function containsPoint(point) {
    if (!this.getBounds().contains(point.x, point.y)) {
      return false;
    }

    this.worldTransform.applyInverse(point, tempPoint);

    var vertices = this.vertices;
    var points = tempPolygon.points;
    var indices = this.indices;
    var len = this.indices.length;
    var step = this.drawMode === Mesh.DRAW_MODES.TRIANGLES ? 3 : 1;

    for (var i = 0; i + 2 < len; i += step) {
      var ind0 = indices[i] * 2;
      var ind1 = indices[i + 1] * 2;
      var ind2 = indices[i + 2] * 2;

      points[0] = vertices[ind0];
      points[1] = vertices[ind0 + 1];
      points[2] = vertices[ind1];
      points[3] = vertices[ind1 + 1];
      points[4] = vertices[ind2];
      points[5] = vertices[ind2 + 1];

      if (tempPolygon.contains(tempPoint.x, tempPoint.y)) {
        return true;
      }
    }

    return false;
  };

  /**
   * The texture that the mesh uses.
   *
   * @member {PIXI.Texture}
   * @memberof PIXI.mesh.Mesh#
   */


  _createClass(Mesh, [{
    key: 'texture',
    get: function get() {
      return this._texture;
    }

    /**
     * Sets the texture the mesh uses.
     *
     * @param {Texture} value - The value to set.
     */
    ,
    set: function set(value) {
      if (this._texture === value) {
        return;
      }

      this._texture = value;

      if (value) {
        // wait for the texture to load
        if (value.baseTexture._hasLoaded) {
          this._onTextureUpdate();
        } else {
          value.baseTexture._once('update', this._onTextureUpdate, this);
        }
      }
    }

    /**
     * The tint applied to the mesh. This is a hex value. A value of 0xFFFFFF will remove any tint effect.
     *
     * @member {number}
     * @memberof PIXI.mesh.Mesh#
     * @default 0xFFFFFF
     */

  }, {
    key: 'tint',
    get: function get() {
      return core.utils.rgb2hex(this.tintRgb);
    }

    /**
     * Sets the tint the mesh uses.
     *
     * @param {number} value - The value to set.
     */
    ,
    set: function set(value) {
      this.tintRgb = core.utils.hex2rgb(value, this.tintRgb);
    }
  }]);

  return Mesh;
}(game.Container);

/**
 * Different drawing buffer modes supported
 *
 * @static
 * @constant
 * @type {object}
 * @property {number} TRIANGLE_MESH
 * @property {number} TRIANGLES
 */


exports.default = Mesh;
Mesh.DRAW_MODES = {
  TRIANGLE_MESH: 0,
  TRIANGLES: 1
};

},{"../core":48}],124:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Plane2 = require('./Plane');

var _Plane3 = _interopRequireDefault(_Plane2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DEFAULT_BORDER_SIZE = 10;

/**
 * The NineSlicePlane allows you to stretch a texture using 9-slice scaling. The corners will remain unscaled (useful
 * for buttons with rounded corners for example) and the other areas will be scaled horizontally and or vertically
 *
 *```js
 * let Plane9 = new PIXI.NineSlicePlane(PIXI.Texture.fromImage('BoxWithRoundedCorners.png'), 15, 15, 15, 15);
 *  ```
 * <pre>
 *      A                          B
 *    +---+----------------------+---+
 *  C | 1 |          2           | 3 |
 *    +---+----------------------+---+
 *    |   |                      |   |
 *    | 4 |          5           | 6 |
 *    |   |                      |   |
 *    +---+----------------------+---+
 *  D | 7 |          8           | 9 |
 *    +---+----------------------+---+

 *  When changing this objects width and/or height:
 *     areas 1 3 7 and 9 will remain unscaled.
 *     areas 2 and 8 will be stretched horizontally
 *     areas 4 and 6 will be stretched vertically
 *     area 5 will be stretched both horizontally and vertically
 * </pre>
 *
 * @class
 * @extends PIXI.mesh.Plane
 * @memberof PIXI.mesh
 *
 */

var NineSlicePlane = function (_Plane) {
    _inherits(NineSlicePlane, _Plane);

    /**
     * @param {PIXI.Texture} texture - The texture to use on the NineSlicePlane.
     * @param {int} [leftWidth=10] size of the left vertical bar (A)
     * @param {int} [topHeight=10] size of the top horizontal bar (C)
     * @param {int} [rightWidth=10] size of the right vertical bar (B)
     * @param {int} [bottomHeight=10] size of the bottom horizontal bar (D)
     */
    function NineSlicePlane(texture, leftWidth, topHeight, rightWidth, bottomHeight) {
        _classCallCheck(this, NineSlicePlane);

        var _this = _possibleConstructorReturn(this, _Plane.call(this, texture, 4, 4));

        var uvs = _this.uvs;

        // right and bottom uv's are always 1
        uvs[6] = uvs[14] = uvs[22] = uvs[30] = 1;
        uvs[25] = uvs[27] = uvs[29] = uvs[31] = 1;

        _this._origWidth = texture.width;
        _this._origHeight = texture.height;
        _this._uvw = 1 / _this._origWidth;
        _this._uvh = 1 / _this._origHeight;

        /**
         * The width of the NineSlicePlane, setting this will actually modify the vertices and UV's of this plane
         *
         * @member {number}
         * @memberof PIXI.NineSlicePlane#
         * @override
         */
        _this.width = texture.width;

        /**
         * The height of the NineSlicePlane, setting this will actually modify the vertices and UV's of this plane
         *
         * @member {number}
         * @memberof PIXI.NineSlicePlane#
         * @override
         */
        _this.height = texture.height;

        uvs[2] = uvs[10] = uvs[18] = uvs[26] = _this._uvw * leftWidth;
        uvs[4] = uvs[12] = uvs[20] = uvs[28] = 1 - _this._uvw * rightWidth;
        uvs[9] = uvs[11] = uvs[13] = uvs[15] = _this._uvh * topHeight;
        uvs[17] = uvs[19] = uvs[21] = uvs[23] = 1 - _this._uvh * bottomHeight;

        /**
         * The width of the left column (a)
         *
         * @member {number}
         */
        _this.leftWidth = typeof leftWidth !== 'undefined' ? leftWidth : DEFAULT_BORDER_SIZE;

        /**
         * The width of the right column (b)
         *
         * @member {number}
         */
        _this.rightWidth = typeof rightWidth !== 'undefined' ? rightWidth : DEFAULT_BORDER_SIZE;

        /**
         * The height of the top row (c)
         *
         * @member {number}
         */
        _this.topHeight = typeof topHeight !== 'undefined' ? topHeight : DEFAULT_BORDER_SIZE;

        /**
         * The height of the bottom row (d)
         *
         * @member {number}
         */
        _this.bottomHeight = typeof bottomHeight !== 'undefined' ? bottomHeight : DEFAULT_BORDER_SIZE;
        return _this;
    }

    /**
     * Updates the horizontal vertices.
     *
     */


    NineSlicePlane.prototype.updateHorizontalVertices = function updateHorizontalVertices() {
        var vertices = this.vertices;

        vertices[9] = vertices[11] = vertices[13] = vertices[15] = this._topHeight;
        vertices[17] = vertices[19] = vertices[21] = vertices[23] = this._height - this._bottomHeight;
        vertices[25] = vertices[27] = vertices[29] = vertices[31] = this._height;
    };

    /**
     * Updates the vertical vertices.
     *
     */


    NineSlicePlane.prototype.updateVerticalVertices = function updateVerticalVertices() {
        var vertices = this.vertices;

        vertices[2] = vertices[10] = vertices[18] = vertices[26] = this._leftWidth;
        vertices[4] = vertices[12] = vertices[20] = vertices[28] = this._width - this._rightWidth;
        vertices[6] = vertices[14] = vertices[22] = vertices[30] = this._width;
    };

    /**
     * Renders the object using the Canvas renderer
     *
     * @private
     * @param {PIXI.CanvasRenderer} renderer - The canvas renderer to render with.
     */


    NineSlicePlane.prototype._renderCanvas = function _renderCanvas(renderer) {
        var context = renderer.context;

        context.globalAlpha = this.worldAlpha;

        var transform = this.worldTransform;
        var res = renderer.resolution;

        if (renderer.roundPixels) {
            context.setTransform(transform.a * res, transform.b * res, transform.c * res, transform.d * res, transform.tx * res | 0, transform.ty * res | 0);
        } else {
            context.setTransform(transform.a * res, transform.b * res, transform.c * res, transform.d * res, transform.tx * res, transform.ty * res);
        }

        var base = this._texture.baseTexture;
        var textureSource = base.source;
        var w = base.width;
        var h = base.height;

        this.drawSegment(context, textureSource, w, h, 0, 1, 10, 11);
        this.drawSegment(context, textureSource, w, h, 2, 3, 12, 13);
        this.drawSegment(context, textureSource, w, h, 4, 5, 14, 15);
        this.drawSegment(context, textureSource, w, h, 8, 9, 18, 19);
        this.drawSegment(context, textureSource, w, h, 10, 11, 20, 21);
        this.drawSegment(context, textureSource, w, h, 12, 13, 22, 23);
        this.drawSegment(context, textureSource, w, h, 16, 17, 26, 27);
        this.drawSegment(context, textureSource, w, h, 18, 19, 28, 29);
        this.drawSegment(context, textureSource, w, h, 20, 21, 30, 31);
    };

    /**
     * Renders one segment of the plane.
     * to mimic the exact drawing behavior of stretching the image like WebGL does, we need to make sure
     * that the source area is at least 1 pixel in size, otherwise nothing gets drawn when a slice size of 0 is used.
     *
     * @private
     * @param {CanvasRenderingContext2D} context - The context to draw with.
     * @param {CanvasImageSource} textureSource - The source to draw.
     * @param {number} w - width of the texture
     * @param {number} h - height of the texture
     * @param {number} x1 - x index 1
     * @param {number} y1 - y index 1
     * @param {number} x2 - x index 2
     * @param {number} y2 - y index 2
     */


    NineSlicePlane.prototype.drawSegment = function drawSegment(context, textureSource, w, h, x1, y1, x2, y2) {
        // otherwise you get weird results when using slices of that are 0 wide or high.
        var uvs = this.uvs;
        var vertices = this.vertices;

        var sw = (uvs[x2] - uvs[x1]) * w;
        var sh = (uvs[y2] - uvs[y1]) * h;
        var dw = vertices[x2] - vertices[x1];
        var dh = vertices[y2] - vertices[y1];

        // make sure the source is at least 1 pixel wide and high, otherwise nothing will be drawn.
        if (sw < 1) {
            sw = 1;
        }

        if (sh < 1) {
            sh = 1;
        }

        // make sure destination is at least 1 pixel wide and high, otherwise you get
        // lines when rendering close to original size.
        if (dw < 1) {
            dw = 1;
        }

        if (dh < 1) {
            dh = 1;
        }

        context.drawImage(textureSource, uvs[x1] * w, uvs[y1] * h, sw, sh, vertices[x1], vertices[y1], dw, dh);
    };

    /**
     * The width of the NineSlicePlane, setting this will actually modify the vertices and UV's of this plane
     *
     * @member {number}
     * @memberof PIXI.NineSlicePlane#
     */


    _createClass(NineSlicePlane, [{
        key: 'width',
        get: function get() {
            return this._width;
        }

        /**
         * Sets the width.
         *
         * @param {number} value - the value to set to.
         */
        ,
        set: function set(value) {
            this._width = value;
            this.updateVerticalVertices();
        }

        /**
         * The height of the NineSlicePlane, setting this will actually modify the vertices and UV's of this plane
         *
         * @member {number}
         * @memberof PIXI.NineSlicePlane#
         */

    }, {
        key: 'height',
        get: function get() {
            return this._height;
        }

        /**
         * Sets the height.
         *
         * @param {number} value - the value to set to.
         */
        ,
        set: function set(value) {
            this._height = value;
            this.updateHorizontalVertices();
        }

        /**
         * The width of the left column
         *
         * @member {number}
         */

    }, {
        key: 'leftWidth',
        get: function get() {
            return this._leftWidth;
        }

        /**
         * Sets the width of the left column.
         *
         * @param {number} value - the value to set to.
         */
        ,
        set: function set(value) {
            this._leftWidth = value;

            var uvs = this.uvs;
            var vertices = this.vertices;

            uvs[2] = uvs[10] = uvs[18] = uvs[26] = this._uvw * value;
            vertices[2] = vertices[10] = vertices[18] = vertices[26] = value;

            this.dirty = true;
        }

        /**
         * The width of the right column
         *
         * @member {number}
         */

    }, {
        key: 'rightWidth',
        get: function get() {
            return this._rightWidth;
        }

        /**
         * Sets the width of the right column.
         *
         * @param {number} value - the value to set to.
         */
        ,
        set: function set(value) {
            this._rightWidth = value;

            var uvs = this.uvs;
            var vertices = this.vertices;

            uvs[4] = uvs[12] = uvs[20] = uvs[28] = 1 - this._uvw * value;
            vertices[4] = vertices[12] = vertices[20] = vertices[28] = this._width - value;

            this.dirty = true;
        }

        /**
         * The height of the top row
         *
         * @member {number}
         */

    }, {
        key: 'topHeight',
        get: function get() {
            return this._topHeight;
        }

        /**
         * Sets the height of the top row.
         *
         * @param {number} value - the value to set to.
         */
        ,
        set: function set(value) {
            this._topHeight = value;

            var uvs = this.uvs;
            var vertices = this.vertices;

            uvs[9] = uvs[11] = uvs[13] = uvs[15] = this._uvh * value;
            vertices[9] = vertices[11] = vertices[13] = vertices[15] = value;

            this.dirty = true;
        }

        /**
         * The height of the bottom row
         *
         * @member {number}
         */

    }, {
        key: 'bottomHeight',
        get: function get() {
            return this._bottomHeight;
        }

        /**
         * Sets the height of the bottom row.
         *
         * @param {number} value - the value to set to.
         */
        ,
        set: function set(value) {
            this._bottomHeight = value;

            var uvs = this.uvs;
            var vertices = this.vertices;

            uvs[17] = uvs[19] = uvs[21] = uvs[23] = 1 - this._uvh * value;
            vertices[17] = vertices[19] = vertices[21] = vertices[23] = this._height - value;

            this.dirty = true;
        }
    }]);

    return NineSlicePlane;
}(_Plane3.default);

exports.default = NineSlicePlane;

},{"./Plane":125}],125:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _Mesh2 = require('./Mesh');

var _Mesh3 = _interopRequireDefault(_Mesh2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * The Plane allows you to draw a texture across several points and them manipulate these points
 *
 *```js
 * for (let i = 0; i < 20; i++) {
 *     points.push(new PIXI.Point(i * 50, 0));
 * };
 * let Plane = new PIXI.Plane(PIXI.Texture.fromImage("snake.png"), points);
 *  ```
 *
 * @class
 * @extends PIXI.mesh.Mesh
 * @memberof PIXI.mesh
 *
 */
var Plane = function (_Mesh) {
    _inherits(Plane, _Mesh);

    /**
     * @param {PIXI.Texture} texture - The texture to use on the Plane.
     * @param {number} verticesX - The number of vertices in the x-axis
     * @param {number} verticesY - The number of vertices in the y-axis
     */
    function Plane(texture, verticesX, verticesY) {
        _classCallCheck(this, Plane);

        /**
         * Tracker for if the Plane is ready to be drawn. Needed because Mesh ctor can
         * call _onTextureUpdated which could call refresh too early.
         *
         * @member {boolean}
         * @private
         */
        var _this = _possibleConstructorReturn(this, _Mesh.call(this, texture));

        _this._ready = true;

        _this.verticesX = verticesX || 10;
        _this.verticesY = verticesY || 10;

        _this.drawMode = _Mesh3.default.DRAW_MODES.TRIANGLES;
        _this.refresh();
        return _this;
    }

    /**
     * Refreshes
     *
     */


    Plane.prototype.refresh = function refresh() {
        var total = this.verticesX * this.verticesY;
        var verts = [];
        var colors = [];
        var uvs = [];
        var indices = [];
        var texture = this.texture;

        var segmentsX = this.verticesX - 1;
        var segmentsY = this.verticesY - 1;

        var sizeX = texture.width / segmentsX;
        var sizeY = texture.height / segmentsY;

        for (var i = 0; i < total; i++) {
            var x = i % this.verticesX;
            var y = i / this.verticesX | 0;

            verts.push(x * sizeX, y * sizeY);

            // this works for rectangular textures.
            uvs.push(texture._uvs.x0 + (texture._uvs.x1 - texture._uvs.x0) * (x / (this.verticesX - 1)), texture._uvs.y0 + (texture._uvs.y3 - texture._uvs.y0) * (y / (this.verticesY - 1)));
        }

        //  cons

        var totalSub = segmentsX * segmentsY;

        for (var _i = 0; _i < totalSub; _i++) {
            var xpos = _i % segmentsX;
            var ypos = _i / segmentsX | 0;

            var value = ypos * this.verticesX + xpos;
            var value2 = ypos * this.verticesX + xpos + 1;
            var value3 = (ypos + 1) * this.verticesX + xpos;
            var value4 = (ypos + 1) * this.verticesX + xpos + 1;

            indices.push(value, value2, value3);
            indices.push(value2, value4, value3);
        }

        // console.log(indices)
        this.vertices = new Float32Array(verts);
        this.uvs = new Float32Array(uvs);
        this.colors = new Float32Array(colors);
        this.indices = new Uint16Array(indices);

        this.indexDirty = true;
    };

    /**
     * Clear texture UVs when new texture is set
     *
     * @private
     */


    Plane.prototype._onTextureUpdate = function _onTextureUpdate() {
        _Mesh3.default.prototype._onTextureUpdate.call(this);

        // wait for the Plane ctor to finish before calling refresh
        if (this._ready) {
            this.refresh();
        }
    };

    return Plane;
}(_Mesh3.default);

exports.default = Plane;

},{"./Mesh":123}],126:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _Mesh2 = require('./Mesh');

var _Mesh3 = _interopRequireDefault(_Mesh2);

var _core = require('../core');

var core = _interopRequireWildcard(_core);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * The rope allows you to draw a texture across several points and them manipulate these points
 *
 *```js
 * for (let i = 0; i < 20; i++) {
 *     points.push(new PIXI.Point(i * 50, 0));
 * };
 * let rope = new PIXI.Rope(PIXI.Texture.fromImage("snake.png"), points);
 *  ```
 *
 * @class
 * @extends PIXI.mesh.Mesh
 * @memberof PIXI.mesh
 *
 */
var Rope = function (_Mesh) {
    _inherits(Rope, _Mesh);

    /**
     * @param {PIXI.Texture} texture - The texture to use on the rope.
     * @param {PIXI.Point[]} points - An array of {@link PIXI.Point} objects to construct this rope.
     */
    function Rope(texture, points) {
        _classCallCheck(this, Rope);

        /*
         * @member {PIXI.Point[]} An array of points that determine the rope
         */
        var _this = _possibleConstructorReturn(this, _Mesh.call(this, texture));

        _this.points = points;

        /*
         * @member {Float32Array} An array of vertices used to construct this rope.
         */
        _this.vertices = new Float32Array(points.length * 4);

        /*
         * @member {Float32Array} The WebGL Uvs of the rope.
         */
        _this.uvs = new Float32Array(points.length * 4);

        /*
         * @member {Float32Array} An array containing the color components
         */
        _this.colors = new Float32Array(points.length * 2);

        /*
         * @member {Uint16Array} An array containing the indices of the vertices
         */
        _this.indices = new Uint16Array(points.length * 2);

        /**
         * Tracker for if the rope is ready to be drawn. Needed because Mesh ctor can
         * call _onTextureUpdated which could call refresh too early.
         *
         * @member {boolean}
         * @private
         */
        _this._ready = true;

        _this.refresh();
        return _this;
    }

    /**
     * Refreshes
     *
     */


    Rope.prototype.refresh = function refresh() {
        var points = this.points;

        // if too little points, or texture hasn't got UVs set yet just move on.
        if (points.length < 1 || !this._texture._uvs) {
            return;
        }

        var uvs = this.uvs;

        var indices = this.indices;
        var colors = this.colors;

        var textureUvs = this._texture._uvs;
        var offset = new core.Point(textureUvs.x0, textureUvs.y0);
        var factor = new core.Point(textureUvs.x2 - textureUvs.x0, textureUvs.y2 - textureUvs.y0);

        uvs[0] = 0 + offset.x;
        uvs[1] = 0 + offset.y;
        uvs[2] = 0 + offset.x;
        uvs[3] = Number(factor.y) + offset.y;

        colors[0] = 1;
        colors[1] = 1;

        indices[0] = 0;
        indices[1] = 1;

        var total = points.length;

        for (var i = 1; i < total; i++) {
            // time to do some smart drawing!
            var index = i * 4;
            var amount = i / (total - 1);

            uvs[index] = amount * factor.x + offset.x;
            uvs[index + 1] = 0 + offset.y;

            uvs[index + 2] = amount * factor.x + offset.x;
            uvs[index + 3] = Number(factor.y) + offset.y;

            index = i * 2;
            colors[index] = 1;
            colors[index + 1] = 1;

            index = i * 2;
            indices[index] = index;
            indices[index + 1] = index + 1;
        }

        this.dirty = true;
        this.indexDirty = true;
    };

    /**
     * Clear texture UVs when new texture is set
     *
     * @private
     */


    Rope.prototype._onTextureUpdate = function _onTextureUpdate() {
        _Mesh.prototype._onTextureUpdate.call(this);

        // wait for the Rope ctor to finish before calling refresh
        if (this._ready) {
            this.refresh();
        }
    };

    /**
     * Updates the object transform for rendering
     *
     * @private
     */


    Rope.prototype.updateTransform = function updateTransform() {
        var points = this.points;

        if (points.length < 1) {
            return;
        }

        var lastPoint = points[0];
        var nextPoint = void 0;
        var perpX = 0;
        var perpY = 0;

        // this.count -= 0.2;

        var vertices = this.vertices;
        var total = points.length;

        for (var i = 0; i < total; i++) {
            var point = points[i];
            var index = i * 4;

            if (i < points.length - 1) {
                nextPoint = points[i + 1];
            } else {
                nextPoint = point;
            }

            perpY = -(nextPoint.x - lastPoint.x);
            perpX = nextPoint.y - lastPoint.y;

            var ratio = (1 - i / (total - 1)) * 10;

            if (ratio > 1) {
                ratio = 1;
            }

            var perpLength = Math.sqrt(perpX * perpX + perpY * perpY);
            var num = this._texture.height / 2; // (20 + Math.abs(Math.sin((i + this.count) * 0.3) * 50) )* ratio;

            perpX /= perpLength;
            perpY /= perpLength;

            perpX *= num;
            perpY *= num;

            vertices[index] = point.x + perpX;
            vertices[index + 1] = point.y + perpY;
            vertices[index + 2] = point.x - perpX;
            vertices[index + 3] = point.y - perpY;

            lastPoint = point;
        }

        // this.containerUpdateTransform();
        _Mesh.prototype.updateTransform.call(this);
    };

    return Rope;
}(_Mesh3.default);

exports.default = Rope;

},{"../core":48,"./Mesh":123}],127:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _Mesh = require('./Mesh');

Object.defineProperty(exports, 'Mesh', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Mesh).default;
  }
});

var _MeshRenderer = require('./webgl/MeshRenderer');

Object.defineProperty(exports, 'MeshRenderer', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_MeshRenderer).default;
  }
});

var _Plane = require('./Plane');

Object.defineProperty(exports, 'Plane', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Plane).default;
  }
});

var _NineSlicePlane = require('./NineSlicePlane');

Object.defineProperty(exports, 'NineSlicePlane', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_NineSlicePlane).default;
  }
});

var _Rope = require('./Rope');

Object.defineProperty(exports, 'Rope', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Rope).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./Mesh":123,"./NineSlicePlane":124,"./Plane":125,"./Rope":126,"./webgl/MeshRenderer":128}],128:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.MeshRenderer = undefined;

var _core = require('../../core');

var core = _interopRequireWildcard(_core);

var _pixiGlCore = require('pixi-gl-core');

var _pixiGlCore2 = _interopRequireDefault(_pixiGlCore);

var _Mesh = require('../Mesh');

var _Mesh2 = _interopRequireDefault(_Mesh);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

 // eslint-disable-line no-undef

/**
 * WebGL renderer plugin for tiling sprites
 */

var MeshRenderer = exports.MeshRenderer = function (_core$ObjectRenderer) {
    _inherits(MeshRenderer, _core$ObjectRenderer);

    /**
     * constructor for renderer
     *
     * @param {WebGLRenderer} renderer The renderer this tiling awesomeness works for.
     */
    function MeshRenderer(renderer) {
        _classCallCheck(this, MeshRenderer);

        var _this = _possibleConstructorReturn(this, _core$ObjectRenderer.call(this, renderer));

        _this.shader = null;
        return _this;
    }

    /**
     * Sets up the renderer context and necessary buffers.
     *
     * @private
     */


    MeshRenderer.prototype.onContextChange = function onContextChange() {
        var gl = this.renderer.gl;

        this.shader = new core.Shader(gl, "#define GLSLIFY 1\nattribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 translationMatrix;\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n\n    vTextureCoord = aTextureCoord;\n}\n", "#define GLSLIFY 1\nvarying vec2 vTextureCoord;\nuniform float alpha;\nuniform vec3 tint;\n\nuniform sampler2D uSampler;\n\nvoid main(void)\n{\n    gl_FragColor = texture2D(uSampler, vTextureCoord) * vec4(tint * alpha, alpha);\n}\n");
    };

    /**
     * renders mesh
     *
     * @param {PIXI.mesh.Mesh} mesh mesh instance
     */


    MeshRenderer.prototype.render = function render(mesh) {
        var renderer = this.renderer;
        var gl = renderer.gl;
        var texture = mesh._texture;

        if (!texture._valid) {
            return;
        }

        var glData = mesh._glDatas[renderer.CONTEXT_UID];

        if (!glData) {
            glData = {
                shader: this.shader,
                vertexBuffer: _pixiGlCore2.default.GLBuffer.createVertexBuffer(gl, mesh.vertices, gl.STREAM_DRAW),
                uvBuffer: _pixiGlCore2.default.GLBuffer.createVertexBuffer(gl, mesh.uvs, gl.STREAM_DRAW),
                indexBuffer: _pixiGlCore2.default.GLBuffer.createIndexBuffer(gl, mesh.indices, gl.STATIC_DRAW),
                // build the vao object that will render..
                vao: new _pixiGlCore2.default.VertexArrayObject(gl),
                dirty: mesh.dirty,
                indexDirty: mesh.indexDirty
            };

            // build the vao object that will render..
            glData.vao = new _pixiGlCore2.default.VertexArrayObject(gl).addIndex(glData.indexBuffer).addAttribute(glData.vertexBuffer, glData.shader.attributes.aVertexPosition, gl.FLOAT, false, 2 * 4, 0).addAttribute(glData.uvBuffer, glData.shader.attributes.aTextureCoord, gl.FLOAT, false, 2 * 4, 0);

            mesh._glDatas[renderer.CONTEXT_UID] = glData;
        }

        if (mesh.dirty !== glData.dirty) {
            glData.dirty = mesh.dirty;
            glData.uvBuffer.upload();
        }

        if (mesh.indexDirty !== glData.indexDirty) {
            glData.indexDirty = mesh.indexDirty;
            glData.indexBuffer.upload();
        }

        glData.vertexBuffer.upload();

        renderer.bindShader(glData.shader);
        renderer.bindTexture(texture, 0);
        renderer.state.setBlendMode(mesh.blendMode);

        glData.shader.uniforms.translationMatrix = mesh._worldTransform.toArray(true);
        glData.shader.uniforms.alpha = mesh._worldAlpha;
        glData.shader.uniforms.tint = mesh.tintRgb;

        var drawMode = mesh.drawMode === _Mesh2.default.DRAW_MODES.TRIANGLE_MESH ? gl.TRIANGLE_STRIP : gl.TRIANGLES;

        glData.vao.bind().draw(drawMode, mesh.indices.length).unbind();
    };

    return MeshRenderer;
}(core.ObjectRenderer);

core.WebGLRenderer.registerPlugin('mesh', MeshRenderer);

},{"../../core":48,"../Mesh":123,"pixi-gl-core":12}],129:[function(require,module,exports){
(function (global){
'use strict';

exports.__esModule = true;
exports.prepare = exports.particles = exports.mesh = exports.loaders = exports.interaction = exports.filters = exports.extras = exports.extract = exports.accessibility = undefined;

var _core = require('./core');

Object.keys(_core).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(exports, key, {
        enumerable: true,
        get: function get() {
            return _core[key];
        }
    });
});

require('./polyfill');

var _accessibility = require('./accessibility');

var accessibility = _interopRequireWildcard(_accessibility);

var _extract = require('./extract');

var extract = _interopRequireWildcard(_extract);

var _extras = require('./extras');

var extras = _interopRequireWildcard(_extras);

var _filters = require('./filters');

var filters = _interopRequireWildcard(_filters);

var _interaction = require('./interaction');

var interaction = _interopRequireWildcard(_interaction);

var _loaders = require('./loaders');

var loaders = _interopRequireWildcard(_loaders);

var _mesh = require('./mesh');

var mesh = _interopRequireWildcard(_mesh);

var _particles = require('./particles');

var particles = _interopRequireWildcard(_particles);

var _prepare = require('./prepare');

var prepare = _interopRequireWildcard(_prepare);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// export core
// export * from './deprecation';
exports.accessibility = accessibility;
exports.extract = extract;
exports.extras = extras;
exports.filters = filters;
exports.interaction = interaction;
exports.loaders = loaders;
exports.mesh = mesh;
exports.particles = particles;
exports.prepare = prepare;

// Always export pixi globally.


// export libs
// import polyfills

global.PIXI = exports; // eslint-disable-line

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./accessibility":2,"./core":48,"./extract":2,"./extras":109,"./filters":120,"./interaction":2,"./loaders":2,"./mesh":127,"./particles":2,"./polyfill":2,"./prepare":2}]},{},[129])(129)
});


/*!
 * pixi-filters - v2.5.0
 * Compiled Wed, 10 Jan 2018 17:38:59 UTC
 *
 * pixi-filters is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var __filters=function(e,t){"use strict";var n="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}",r="varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\n\nuniform float gamma;\nuniform float contrast;\nuniform float saturation;\nuniform float brightness;\nuniform float red;\nuniform float green;\nuniform float blue;\nuniform float alpha;\n\nvoid main(void)\n{\n    vec4 c = texture2D(uSampler, vTextureCoord);\n\n    if (c.a > 0.0) {\n        c.rgb /= c.a;\n\n        vec3 rgb = pow(c.rgb, vec3(1. / gamma));\n        rgb = mix(vec3(.5), mix(vec3(dot(vec3(.2125, .7154, .0721), rgb)), rgb, saturation), contrast);\n        rgb.r *= red;\n        rgb.g *= green;\n        rgb.b *= blue;\n        c.rgb = rgb * brightness;\n\n        c.rgb *= c.a;\n    }\n\n    gl_FragColor = c * alpha;\n}\n",o=function(e){function t(t){e.call(this,n,r),Object.assign(this,{gamma:1,saturation:1,contrast:1,brightness:1,red:1,green:1,blue:1,alpha:1},t)}return e&&(t.__proto__=e),t.prototype=Object.create(e&&e.prototype),t.prototype.constructor=t,t.prototype.apply=function(e,t,n,r){this.uniforms.gamma=Math.max(this.gamma,1e-4),this.uniforms.saturation=this.saturation,this.uniforms.contrast=this.contrast,this.uniforms.brightness=this.brightness,this.uniforms.red=this.red,this.uniforms.green=this.green,this.uniforms.blue=this.blue,this.uniforms.alpha=this.alpha,e.applyFilter(this,t,n,r)},t}(t.Filter),i=n,l="\nvarying vec2 vTextureCoord;\nuniform sampler2D uSampler;\n\nuniform vec2 uOffset;\n\nvoid main(void)\n{\n    vec4 color = vec4(0.0);\n\n    // Sample top left pixel\n    color += texture2D(uSampler, vec2(vTextureCoord.x - uOffset.x, vTextureCoord.y + uOffset.y));\n\n    // Sample top right pixel\n    color += texture2D(uSampler, vec2(vTextureCoord.x + uOffset.x, vTextureCoord.y + uOffset.y));\n\n    // Sample bottom right pixel\n    color += texture2D(uSampler, vec2(vTextureCoord.x + uOffset.x, vTextureCoord.y - uOffset.y));\n\n    // Sample bottom left pixel\n    color += texture2D(uSampler, vec2(vTextureCoord.x - uOffset.x, vTextureCoord.y - uOffset.y));\n\n    // Average\n    color *= 0.25;\n\n    gl_FragColor = color;\n}\n",s=function(e){function n(n,r){void 0===n&&(n=4),void 0===r&&(r=3),e.call(this,i,l),this._pixelSize=new t.Point,this.pixelSize=1,this._kernels=null,Array.isArray(n)?this.kernels=n:(this._blur=n,this.quality=r)}e&&(n.__proto__=e),n.prototype=Object.create(e&&e.prototype),n.prototype.constructor=n;var r={kernels:{configurable:!0},pixelSize:{configurable:!0},quality:{configurable:!0},blur:{configurable:!0}};return n.prototype.apply=function(e,t,n,r){var o,i=this.pixelSize.x/t.size.width,l=this.pixelSize.y/t.size.height;if(1===this._quality||0===this._blur)o=this._kernels[0]+.5,this.uniforms.uOffset[0]=o*i,this.uniforms.uOffset[1]=o*l,e.applyFilter(this,t,n,r);else{for(var s,a=e.getRenderTarget(!0),u=t,c=a,f=this._quality-1,d=0;d<f;d++)o=this._kernels[d]+.5,this.uniforms.uOffset[0]=o*i,this.uniforms.uOffset[1]=o*l,e.applyFilter(this,u,c,!0),s=u,u=c,c=s;o=this._kernels[f]+.5,this.uniforms.uOffset[0]=o*i,this.uniforms.uOffset[1]=o*l,e.applyFilter(this,u,n,r),e.returnRenderTarget(a)}},n.prototype._generateKernels=function(){var e=this._blur,t=this._quality,n=[e];if(e>0)for(var r=e,o=e/t,i=1;i<t;i++)r-=o,n.push(r);this._kernels=n},r.kernels.get=function(){return this._kernels},r.kernels.set=function(e){Array.isArray(e)&&e.length>0?(this._kernels=e,this._quality=e.length,this._blur=Math.max.apply(Math,e)):(this._kernels=[0],this._quality=1)},r.pixelSize.set=function(e){"number"==typeof e?(this._pixelSize.x=e,this._pixelSize.y=e):Array.isArray(e)?(this._pixelSize.x=e[0],this._pixelSize.y=e[1]):e instanceof t.Point?(this._pixelSize.x=e.x,this._pixelSize.y=e.y):(this._pixelSize.x=1,this._pixelSize.y=1)},r.pixelSize.get=function(){return this._pixelSize},r.quality.get=function(){return this._quality},r.quality.set=function(e){this._quality=Math.max(1,Math.round(e)),this._generateKernels()},r.blur.get=function(){return this._blur},r.blur.set=function(e){this._blur=e,this._generateKernels()},Object.defineProperties(n.prototype,r),n}(t.Filter),a=n,u="\nuniform sampler2D uSampler;\nvarying vec2 vTextureCoord;\n\nuniform float threshold;\n\nvoid main() {\n    vec4 color = texture2D(uSampler, vTextureCoord);\n\n    // A simple & fast algorithm for getting brightness.\n    // It's inaccuracy , but good enought for this feature.\n    float _max = max(max(color.r, color.g), color.b);\n    float _min = min(min(color.r, color.g), color.b);\n    float brightness = (_max + _min) * 0.5;\n\n    if(brightness > threshold) {\n        gl_FragColor = color;\n    } else {\n        gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);\n    }\n}\n",c=function(e){function t(t){void 0===t&&(t=.5),e.call(this,a,u),this.threshold=t}e&&(t.__proto__=e),t.prototype=Object.create(e&&e.prototype),t.prototype.constructor=t;var n={threshold:{configurable:!0}};return n.threshold.get=function(){return this.uniforms.threshold},n.threshold.set=function(e){this.uniforms.threshold=e},Object.defineProperties(t.prototype,n),t}(t.Filter),f="uniform sampler2D uSampler;\nvarying vec2 vTextureCoord;\n\nuniform sampler2D bloomTexture;\nuniform float bloomScale;\nuniform float brightness;\n\nvoid main() {\n    vec4 color = texture2D(uSampler, vTextureCoord);\n    color.rgb *= brightness;\n    vec4 bloomColor = vec4(texture2D(bloomTexture, vTextureCoord).rgb, 0.0);\n    bloomColor.rgb *= bloomScale;\n    gl_FragColor = color + bloomColor;\n}\n",d=function(e){function n(n){e.call(this,a,f),"number"==typeof n&&(n={threshold:n}),n=Object.assign({threshold:.5,bloomScale:1,brightness:1,kernels:null,blur:8,quality:4,pixelSize:1,resolution:t.settings.RESOLUTION},n),this.bloomScale=n.bloomScale,this.brightness=n.brightness;var r=n.kernels,o=n.blur,i=n.quality,l=n.pixelSize,u=n.resolution;this._extractFilter=new c(n.threshold),this._extractFilter.resolution=u,this._blurFilter=r?new s(r):new s(o,i),this.pixelSize=l,this.resolution=u}e&&(n.__proto__=e),n.prototype=Object.create(e&&e.prototype),n.prototype.constructor=n;var r={resolution:{configurable:!0},threshold:{configurable:!0},blur:{configurable:!0},kernels:{configurable:!0},quality:{configurable:!0},pixelSize:{configurable:!0}};return n.prototype.apply=function(e,t,n,r,o){var i=e.getRenderTarget(!0);this._extractFilter.apply(e,t,i,!0,o);var l=e.getRenderTarget(!0);this._blurFilter.apply(e,i,l,!0,o),this.uniforms.bloomScale=this.bloomScale,this.uniforms.brightness=this.brightness,this.uniforms.bloomTexture=l,e.applyFilter(this,t,n,r),e.returnRenderTarget(l),e.returnRenderTarget(i)},r.resolution.get=function(){return this._resolution},r.resolution.set=function(e){this._resolution=e,this._blurFilter&&(this._blurFilter.resolution=e)},r.threshold.get=function(){return this._extractFilter.threshold},r.threshold.set=function(e){this._extractFilter.threshold=e},r.blur.get=function(){return this._blurFilter.blur},r.blur.set=function(e){this._blurFilter.blur=e},r.kernels.get=function(){return this._blurFilter.kernels},r.kernels.set=function(e){this._blurFilter.kernels=e},r.quality.get=function(){return this._blurFilter.quality},r.quality.set=function(e){this._blurFilter.quality=e},r.pixelSize.get=function(){return this._blurFilter.pixelSize},r.pixelSize.set=function(e){this._blurFilter.pixelSize=e},Object.defineProperties(n.prototype,r),n}(t.Filter),p=n,g="varying vec2 vTextureCoord;\n\nuniform vec4 filterArea;\nuniform float pixelSize;\nuniform sampler2D uSampler;\n\nvec2 mapCoord( vec2 coord )\n{\n    coord *= filterArea.xy;\n    coord += filterArea.zw;\n\n    return coord;\n}\n\nvec2 unmapCoord( vec2 coord )\n{\n    coord -= filterArea.zw;\n    coord /= filterArea.xy;\n\n    return coord;\n}\n\nvec2 pixelate(vec2 coord, vec2 size)\n{\n    return floor( coord / size ) * size;\n}\n\nvec2 getMod(vec2 coord, vec2 size)\n{\n    return mod( coord , size) / size;\n}\n\nfloat character(float n, vec2 p)\n{\n    p = floor(p*vec2(4.0, -4.0) + 2.5);\n    if (clamp(p.x, 0.0, 4.0) == p.x && clamp(p.y, 0.0, 4.0) == p.y)\n    {\n        if (int(mod(n/exp2(p.x + 5.0*p.y), 2.0)) == 1) return 1.0;\n    }\n    return 0.0;\n}\n\nvoid main()\n{\n    vec2 coord = mapCoord(vTextureCoord);\n\n    // get the rounded color..\n    vec2 pixCoord = pixelate(coord, vec2(pixelSize));\n    pixCoord = unmapCoord(pixCoord);\n\n    vec4 color = texture2D(uSampler, pixCoord);\n\n    // determine the character to use\n    float gray = (color.r + color.g + color.b) / 3.0;\n\n    float n =  65536.0;             // .\n    if (gray > 0.2) n = 65600.0;    // :\n    if (gray > 0.3) n = 332772.0;   // *\n    if (gray > 0.4) n = 15255086.0; // o\n    if (gray > 0.5) n = 23385164.0; // &\n    if (gray > 0.6) n = 15252014.0; // 8\n    if (gray > 0.7) n = 13199452.0; // @\n    if (gray > 0.8) n = 11512810.0; // #\n\n    // get the mod..\n    vec2 modd = getMod(coord, vec2(pixelSize));\n\n    gl_FragColor = color * character( n, vec2(-1.0) + modd * 2.0);\n\n}",h=function(e){function t(t){void 0===t&&(t=8),e.call(this,p,g),this.size=t}e&&(t.__proto__=e),t.prototype=Object.create(e&&e.prototype),t.prototype.constructor=t;var n={size:{configurable:!0}};return n.size.get=function(){return this.uniforms.pixelSize},n.size.set=function(e){this.uniforms.pixelSize=e},Object.defineProperties(t.prototype,n),t}(t.Filter),m=t.filters,v=m.BlurXFilter,x=m.BlurYFilter,y=m.AlphaFilter,b=function(e){function n(n,r,o,i){var l,s;void 0===n&&(n=2),void 0===r&&(r=4),void 0===o&&(o=t.settings.RESOLUTION),void 0===i&&(i=5),e.call(this),"number"==typeof n?(l=n,s=n):n instanceof t.Point?(l=n.x,s=n.y):Array.isArray(n)&&(l=n[0],s=n[1]),this.blurXFilter=new v(l,r,o,i),this.blurYFilter=new x(s,r,o,i),this.blurYFilter.blendMode=t.BLEND_MODES.SCREEN,this.defaultFilter=new y}e&&(n.__proto__=e),n.prototype=Object.create(e&&e.prototype),n.prototype.constructor=n;var r={blur:{configurable:!0},blurX:{configurable:!0},blurY:{configurable:!0}};return n.prototype.apply=function(e,t,n){var r=e.getRenderTarget(!0);this.defaultFilter.apply(e,t,n),this.blurXFilter.apply(e,t,r),this.blurYFilter.apply(e,r,n),e.returnRenderTarget(r)},r.blur.get=function(){return this.blurXFilter.blur},r.blur.set=function(e){this.blurXFilter.blur=this.blurYFilter.blur=e},r.blurX.get=function(){return this.blurXFilter.blur},r.blurX.set=function(e){this.blurXFilter.blur=e},r.blurY.get=function(){return this.blurYFilter.blur},r.blurY.set=function(e){this.blurYFilter.blur=e},Object.defineProperties(n.prototype,r),n}(t.Filter),_=n,C="uniform float radius;\nuniform float strength;\nuniform vec2 center;\nuniform sampler2D uSampler;\nvarying vec2 vTextureCoord;\n\nuniform vec4 filterArea;\nuniform vec4 filterClamp;\nuniform vec2 dimensions;\n\nvoid main()\n{\n    vec2 coord = vTextureCoord * filterArea.xy;\n    coord -= center * dimensions.xy;\n    float distance = length(coord);\n    if (distance < radius) {\n        float percent = distance / radius;\n        if (strength > 0.0) {\n            coord *= mix(1.0, smoothstep(0.0, radius / distance, percent), strength * 0.75);\n        } else {\n            coord *= mix(1.0, pow(percent, 1.0 + strength * 0.75) * radius / distance, 1.0 - percent);\n        }\n    }\n    coord += center * dimensions.xy;\n    coord /= filterArea.xy;\n    vec2 clampedCoord = clamp(coord, filterClamp.xy, filterClamp.zw);\n    gl_FragColor = texture2D(uSampler, clampedCoord);\n    if (coord != clampedCoord) {\n        gl_FragColor *= max(0.0, 1.0 - length(coord - clampedCoord));\n    }\n}\n",S=function(e){function t(t,n,r){e.call(this,_,C),this.center=t||[.5,.5],this.radius=n||100,this.strength=r||1}e&&(t.__proto__=e),t.prototype=Object.create(e&&e.prototype),t.prototype.constructor=t;var n={radius:{configurable:!0},strength:{configurable:!0},center:{configurable:!0}};return t.prototype.apply=function(e,t,n,r){this.uniforms.dimensions[0]=t.sourceFrame.width,this.uniforms.dimensions[1]=t.sourceFrame.height,e.applyFilter(this,t,n,r)},n.radius.get=function(){return this.uniforms.radius},n.radius.set=function(e){this.uniforms.radius=e},n.strength.get=function(){return this.uniforms.strength},n.strength.set=function(e){this.uniforms.strength=e},n.center.get=function(){return this.uniforms.center},n.center.set=function(e){this.uniforms.center=e},Object.defineProperties(t.prototype,n),t}(t.Filter),F=n,z="varying vec2 vTextureCoord;\nuniform sampler2D texture;\nuniform vec3 originalColor;\nuniform vec3 newColor;\nuniform float epsilon;\nvoid main(void) {\n    vec4 currentColor = texture2D(texture, vTextureCoord);\n    vec3 colorDiff = originalColor - (currentColor.rgb / max(currentColor.a, 0.0000000001));\n    float colorDistance = length(colorDiff);\n    float doReplace = step(colorDistance, epsilon);\n    gl_FragColor = vec4(mix(currentColor.rgb, (newColor + colorDiff) * currentColor.a, doReplace), currentColor.a);\n}\n",A=function(e){function n(t,n,r){void 0===t&&(t=16711680),void 0===n&&(n=0),void 0===r&&(r=.4),e.call(this,F,z),this.originalColor=t,this.newColor=n,this.epsilon=r}e&&(n.__proto__=e),n.prototype=Object.create(e&&e.prototype),n.prototype.constructor=n;var r={originalColor:{configurable:!0},newColor:{configurable:!0},epsilon:{configurable:!0}};return r.originalColor.set=function(e){var n=this.uniforms.originalColor;"number"==typeof e?(t.utils.hex2rgb(e,n),this._originalColor=e):(n[0]=e[0],n[1]=e[1],n[2]=e[2],this._originalColor=t.utils.rgb2hex(n))},r.originalColor.get=function(){return this._originalColor},r.newColor.set=function(e){var n=this.uniforms.newColor;"number"==typeof e?(t.utils.hex2rgb(e,n),this._newColor=e):(n[0]=e[0],n[1]=e[1],n[2]=e[2],this._newColor=t.utils.rgb2hex(n))},r.newColor.get=function(){return this._newColor},r.epsilon.set=function(e){this.uniforms.epsilon=e},r.epsilon.get=function(){return this.uniforms.epsilon},Object.defineProperties(n.prototype,r),n}(t.Filter),T=n,w="precision mediump float;\n\nvarying mediump vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform vec2 texelSize;\nuniform float matrix[9];\n\nvoid main(void)\n{\n   vec4 c11 = texture2D(uSampler, vTextureCoord - texelSize); // top left\n   vec4 c12 = texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y - texelSize.y)); // top center\n   vec4 c13 = texture2D(uSampler, vec2(vTextureCoord.x + texelSize.x, vTextureCoord.y - texelSize.y)); // top right\n\n   vec4 c21 = texture2D(uSampler, vec2(vTextureCoord.x - texelSize.x, vTextureCoord.y)); // mid left\n   vec4 c22 = texture2D(uSampler, vTextureCoord); // mid center\n   vec4 c23 = texture2D(uSampler, vec2(vTextureCoord.x + texelSize.x, vTextureCoord.y)); // mid right\n\n   vec4 c31 = texture2D(uSampler, vec2(vTextureCoord.x - texelSize.x, vTextureCoord.y + texelSize.y)); // bottom left\n   vec4 c32 = texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y + texelSize.y)); // bottom center\n   vec4 c33 = texture2D(uSampler, vTextureCoord + texelSize); // bottom right\n\n   gl_FragColor =\n       c11 * matrix[0] + c12 * matrix[1] + c13 * matrix[2] +\n       c21 * matrix[3] + c22 * matrix[4] + c23 * matrix[5] +\n       c31 * matrix[6] + c32 * matrix[7] + c33 * matrix[8];\n\n   gl_FragColor.a = c22.a;\n}\n",D=function(e){function t(t,n,r){e.call(this,T,w),this.matrix=t,this.width=n,this.height=r}e&&(t.__proto__=e),t.prototype=Object.create(e&&e.prototype),t.prototype.constructor=t;var n={matrix:{configurable:!0},width:{configurable:!0},height:{configurable:!0}};return n.matrix.get=function(){return this.uniforms.matrix},n.matrix.set=function(e){this.uniforms.matrix=new Float32Array(e)},n.width.get=function(){return 1/this.uniforms.texelSize[0]},n.width.set=function(e){this.uniforms.texelSize[0]=1/e},n.height.get=function(){return 1/this.uniforms.texelSize[1]},n.height.set=function(e){this.uniforms.texelSize[1]=1/e},Object.defineProperties(t.prototype,n),t}(t.Filter),O=n,R="precision mediump float;\n\nvarying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\n\nvoid main(void)\n{\n    float lum = length(texture2D(uSampler, vTextureCoord.xy).rgb);\n\n    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);\n\n    if (lum < 1.00)\n    {\n        if (mod(gl_FragCoord.x + gl_FragCoord.y, 10.0) == 0.0)\n        {\n            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);\n        }\n    }\n\n    if (lum < 0.75)\n    {\n        if (mod(gl_FragCoord.x - gl_FragCoord.y, 10.0) == 0.0)\n        {\n            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);\n        }\n    }\n\n    if (lum < 0.50)\n    {\n        if (mod(gl_FragCoord.x + gl_FragCoord.y - 5.0, 10.0) == 0.0)\n        {\n            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);\n        }\n    }\n\n    if (lum < 0.3)\n    {\n        if (mod(gl_FragCoord.x - gl_FragCoord.y - 5.0, 10.0) == 0.0)\n        {\n            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);\n        }\n    }\n}\n",P=function(e){function t(){e.call(this,O,R)}return e&&(t.__proto__=e),t.prototype=Object.create(e&&e.prototype),t.prototype.constructor=t,t}(t.Filter),M=n,L="varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\n\nuniform vec4 filterArea;\nuniform vec2 dimensions;\n\nconst float SQRT_2 = 1.414213;\n\nconst float light = 1.0;\n\nuniform float curvature;\nuniform float lineWidth;\nuniform float lineContrast;\nuniform bool verticalLine;\nuniform float noise;\nuniform float noiseSize;\n\nuniform float vignetting;\nuniform float vignettingAlpha;\nuniform float vignettingBlur;\n\nuniform float seed;\nuniform float time;\n\nfloat rand(vec2 co) {\n    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);\n}\n\nvoid main(void)\n{\n    vec2 pixelCoord = vTextureCoord.xy * filterArea.xy;\n    vec2 coord = pixelCoord / dimensions;\n\n    vec2 dir = vec2(coord - vec2(0.5, 0.5));\n\n    float _c = curvature > 0. ? curvature : 1.;\n    float k = curvature > 0. ?(length(dir * dir) * 0.25 * _c * _c + 0.935 * _c) : 1.;\n    vec2 uv = dir * k;\n\n    gl_FragColor = texture2D(uSampler, vTextureCoord);\n    vec3 rgb = gl_FragColor.rgb;\n\n\n    if (noise > 0.0 && noiseSize > 0.0)\n    {\n        pixelCoord.x = floor(pixelCoord.x / noiseSize);\n        pixelCoord.y = floor(pixelCoord.y / noiseSize);\n        float _noise = rand(pixelCoord * noiseSize * seed) - 0.5;\n        rgb += _noise * noise;\n    }\n\n    if (lineWidth > 0.0) {\n        float v = (verticalLine ? uv.x * dimensions.x : uv.y * dimensions.y) * min(1.0, 2.0 / lineWidth ) / _c;\n        float j = 1. + cos(v * 1.2 - time) * 0.5 * lineContrast;\n        rgb *= j;\n        float segment = verticalLine ? mod((dir.x + .5) * dimensions.x, 4.) : mod((dir.y + .5) * dimensions.y, 4.);\n        rgb *= 0.99 + ceil(segment) * 0.015;\n    }\n\n    if (vignetting > 0.0)\n    {\n        float outter = SQRT_2 - vignetting * SQRT_2;\n        float darker = clamp((outter - length(dir) * SQRT_2) / ( 0.00001 + vignettingBlur * SQRT_2), 0.0, 1.0);\n        rgb *= darker + (1.0 - darker) * (1.0 - vignettingAlpha);\n    }\n\n    gl_FragColor.rgb = rgb;\n}\n",j=function(e){function t(t){e.call(this,M,L),this.time=0,this.seed=0,Object.assign(this,{curvature:1,lineWidth:1,lineContrast:.25,verticalLine:!1,noise:0,noiseSize:1,seed:0,vignetting:.3,vignettingAlpha:1,vignettingBlur:.3,time:0},t)}e&&(t.__proto__=e),t.prototype=Object.create(e&&e.prototype),t.prototype.constructor=t;var n={curvature:{configurable:!0},lineWidth:{configurable:!0},lineContrast:{configurable:!0},verticalLine:{configurable:!0},noise:{configurable:!0},noiseSize:{configurable:!0},vignetting:{configurable:!0},vignettingAlpha:{configurable:!0},vignettingBlur:{configurable:!0}};return t.prototype.apply=function(e,t,n,r){this.uniforms.dimensions[0]=t.sourceFrame.width,this.uniforms.dimensions[1]=t.sourceFrame.height,this.uniforms.seed=this.seed,this.uniforms.time=this.time,e.applyFilter(this,t,n,r)},n.curvature.set=function(e){this.uniforms.curvature=e},n.curvature.get=function(){return this.uniforms.curvature},n.lineWidth.set=function(e){this.uniforms.lineWidth=e},n.lineWidth.get=function(){return this.uniforms.lineWidth},n.lineContrast.set=function(e){this.uniforms.lineContrast=e},n.lineContrast.get=function(){return this.uniforms.lineContrast},n.verticalLine.set=function(e){this.uniforms.verticalLine=e},n.verticalLine.get=function(){return this.uniforms.verticalLine},n.noise.set=function(e){this.uniforms.noise=e},n.noise.get=function(){return this.uniforms.noise},n.noiseSize.set=function(e){this.uniforms.noiseSize=e},n.noiseSize.get=function(){return this.uniforms.noiseSize},n.vignetting.set=function(e){this.uniforms.vignetting=e},n.vignetting.get=function(){return this.uniforms.vignetting},n.vignettingAlpha.set=function(e){this.uniforms.vignettingAlpha=e},n.vignettingAlpha.get=function(){return this.uniforms.vignettingAlpha},n.vignettingBlur.set=function(e){this.uniforms.vignettingBlur=e},n.vignettingBlur.get=function(){return this.uniforms.vignettingBlur},Object.defineProperties(t.prototype,n),t}(t.Filter),I=n,k="precision mediump float;\n\nvarying vec2 vTextureCoord;\nvarying vec4 vColor;\n\nuniform vec4 filterArea;\nuniform sampler2D uSampler;\n\nuniform float angle;\nuniform float scale;\n\nfloat pattern()\n{\n   float s = sin(angle), c = cos(angle);\n   vec2 tex = vTextureCoord * filterArea.xy;\n   vec2 point = vec2(\n       c * tex.x - s * tex.y,\n       s * tex.x + c * tex.y\n   ) * scale;\n   return (sin(point.x) * sin(point.y)) * 4.0;\n}\n\nvoid main()\n{\n   vec4 color = texture2D(uSampler, vTextureCoord);\n   float average = (color.r + color.g + color.b) / 3.0;\n   gl_FragColor = vec4(vec3(average * 10.0 - 5.0 + pattern()), color.a);\n}\n",E=function(e){function t(t,n){void 0===t&&(t=1),void 0===n&&(n=5),e.call(this,I,k),this.scale=t,this.angle=n}e&&(t.__proto__=e),t.prototype=Object.create(e&&e.prototype),t.prototype.constructor=t;var n={scale:{configurable:!0},angle:{configurable:!0}};return n.scale.get=function(){return this.uniforms.scale},n.scale.set=function(e){this.uniforms.scale=e},n.angle.get=function(){return this.uniforms.angle},n.angle.set=function(e){this.uniforms.angle=e},Object.defineProperties(t.prototype,n),t}(t.Filter),B=n,X="varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform float alpha;\nuniform vec3 color;\nvoid main(void){\n    vec4 sample = texture2D(uSampler, vTextureCoord);\n\n    // Un-premultiply alpha before applying the color\n    if (sample.a > 0.0) {\n        sample.rgb /= sample.a;\n    }\n\n    // Premultiply alpha again\n    sample.rgb = color.rgb * sample.a;\n\n    // alpha user alpha\n    sample *= alpha;\n\n    gl_FragColor = sample;\n}",N=function(e){function n(n,r,o,i,l){void 0===n&&(n=45),void 0===r&&(r=5),void 0===o&&(o=2),void 0===i&&(i=0),void 0===l&&(l=.5),e.call(this),this.tintFilter=new t.Filter(B,X),this.blurFilter=new t.filters.BlurFilter,this.blurFilter.blur=o,this.targetTransform=new t.Matrix,this.rotation=n,this.padding=r,this.distance=r,this.alpha=l,this.color=i}e&&(n.__proto__=e),n.prototype=Object.create(e&&e.prototype),n.prototype.constructor=n;var r={distance:{configurable:!0},rotation:{configurable:!0},blur:{configurable:!0},alpha:{configurable:!0},color:{configurable:!0}};return n.prototype.apply=function(e,t,n,r){var o=e.getRenderTarget();o.transform=this.targetTransform,this.tintFilter.apply(e,t,o,!0),this.blurFilter.apply(e,o,n),e.applyFilter(this,t,n,r),o.transform=null,e.returnRenderTarget(o)},n.prototype._updatePadding=function(){this.padding=this.distance+2*this.blur},n.prototype._updateTargetTransform=function(){this.targetTransform.tx=this.distance*Math.cos(this.angle),this.targetTransform.ty=this.distance*Math.sin(this.angle)},r.distance.get=function(){return this._distance},r.distance.set=function(e){this._distance=e,this._updatePadding(),this._updateTargetTransform()},r.rotation.get=function(){return this.angle/t.DEG_TO_RAD},r.rotation.set=function(e){this.angle=e*t.DEG_TO_RAD,this._updateTargetTransform()},r.blur.get=function(){return this.blurFilter.blur},r.blur.set=function(e){this.blurFilter.blur=e,this._updatePadding()},r.alpha.get=function(){return this.tintFilter.uniforms.alpha},r.alpha.set=function(e){this.tintFilter.uniforms.alpha=e},r.color.get=function(){return t.utils.rgb2hex(this.tintFilter.uniforms.color)},r.color.set=function(e){t.utils.hex2rgb(e,this.tintFilter.uniforms.color)},Object.defineProperties(n.prototype,r),n}(t.Filter),K=n,q="precision mediump float;\n\nvarying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform float strength;\nuniform vec4 filterArea;\n\n\nvoid main(void)\n{\n\tvec2 onePixel = vec2(1.0 / filterArea);\n\n\tvec4 color;\n\n\tcolor.rgb = vec3(0.5);\n\n\tcolor -= texture2D(uSampler, vTextureCoord - onePixel) * strength;\n\tcolor += texture2D(uSampler, vTextureCoord + onePixel) * strength;\n\n\tcolor.rgb = vec3((color.r + color.g + color.b) / 3.0);\n\n\tfloat alpha = texture2D(uSampler, vTextureCoord).a;\n\n\tgl_FragColor = vec4(color.rgb * alpha, alpha);\n}\n",G=function(e){function t(t){void 0===t&&(t=5),e.call(this,K,q),this.strength=t}e&&(t.__proto__=e),t.prototype=Object.create(e&&e.prototype),t.prototype.constructor=t;var n={strength:{configurable:!0}};return n.strength.get=function(){return this.uniforms.strength},n.strength.set=function(e){this.uniforms.strength=e},Object.defineProperties(t.prototype,n),t}(t.Filter),W=n,Y="// precision highp float;\n\nvarying vec2 vTextureCoord;\nuniform sampler2D uSampler;\n\nuniform vec4 filterArea;\nuniform vec4 filterClamp;\nuniform vec2 dimensions;\nuniform float aspect;\n\nuniform sampler2D displacementMap;\nuniform float offset;\nuniform float sinDir;\nuniform float cosDir;\nuniform int fillMode;\n\nuniform float seed;\nuniform vec2 red;\nuniform vec2 green;\nuniform vec2 blue;\n\nconst int TRANSPARENT = 0;\nconst int ORIGINAL = 1;\nconst int LOOP = 2;\nconst int CLAMP = 3;\nconst int MIRROR = 4;\n\nvoid main(void)\n{\n    vec2 coord = (vTextureCoord * filterArea.xy) / dimensions;\n\n    if (coord.x > 1.0 || coord.y > 1.0) {\n        return;\n    }\n\n    float cx = coord.x - 0.5;\n    float cy = (coord.y - 0.5) * aspect;\n    float ny = (-sinDir * cx + cosDir * cy) / aspect + 0.5;\n\n    // displacementMap: repeat\n    // ny = ny > 1.0 ? ny - 1.0 : (ny < 0.0 ? 1.0 + ny : ny);\n\n    // displacementMap: mirror\n    ny = ny > 1.0 ? 2.0 - ny : (ny < 0.0 ? -ny : ny);\n\n    vec4 dc = texture2D(displacementMap, vec2(0.5, ny));\n\n    float displacement = (dc.r - dc.g) * (offset / filterArea.x);\n\n    coord = vTextureCoord + vec2(cosDir * displacement, sinDir * displacement * aspect);\n\n    if (fillMode == CLAMP) {\n        coord = clamp(coord, filterClamp.xy, filterClamp.zw);\n    } else {\n        if( coord.x > filterClamp.z ) {\n            if (fillMode == ORIGINAL) {\n                gl_FragColor = texture2D(uSampler, vTextureCoord);\n                return;\n            } else if (fillMode == LOOP) {\n                coord.x -= filterClamp.z;\n            } else if (fillMode == MIRROR) {\n                coord.x = filterClamp.z * 2.0 - coord.x;\n            } else {\n                gl_FragColor = vec4(0., 0., 0., 0.);\n                return;\n            }\n        } else if( coord.x < filterClamp.x ) {\n            if (fillMode == ORIGINAL) {\n                gl_FragColor = texture2D(uSampler, vTextureCoord);\n                return;\n            } else if (fillMode == LOOP) {\n                coord.x += filterClamp.z;\n            } else if (fillMode == MIRROR) {\n                coord.x *= -filterClamp.z;\n            } else {\n                gl_FragColor = vec4(0., 0., 0., 0.);\n                return;\n            }\n        }\n\n        if( coord.y > filterClamp.w ) {\n            if (fillMode == ORIGINAL) {\n                gl_FragColor = texture2D(uSampler, vTextureCoord);\n                return;\n            } else if (fillMode == LOOP) {\n                coord.y -= filterClamp.w;\n            } else if (fillMode == MIRROR) {\n                coord.y = filterClamp.w * 2.0 - coord.y;\n            } else {\n                gl_FragColor = vec4(0., 0., 0., 0.);\n                return;\n            }\n        } else if( coord.y < filterClamp.y ) {\n            if (fillMode == ORIGINAL) {\n                gl_FragColor = texture2D(uSampler, vTextureCoord);\n                return;\n            } else if (fillMode == LOOP) {\n                coord.y += filterClamp.w;\n            } else if (fillMode == MIRROR) {\n                coord.y *= -filterClamp.w;\n            } else {\n                gl_FragColor = vec4(0., 0., 0., 0.);\n                return;\n            }\n        }\n    }\n\n    gl_FragColor.r = texture2D(uSampler, coord + red * (1.0 - seed * 0.4) / filterArea.xy).r;\n    gl_FragColor.g = texture2D(uSampler, coord + green * (1.0 - seed * 0.3) / filterArea.xy).g;\n    gl_FragColor.b = texture2D(uSampler, coord + blue * (1.0 - seed * 0.2) / filterArea.xy).b;\n    gl_FragColor.a = texture2D(uSampler, coord).a;\n}\n",Z=function(e){function n(n){void 0===n&&(n={}),e.call(this,W,Y),n=Object.assign({slices:5,offset:100,direction:0,fillMode:0,average:!1,seed:0,red:[0,0],green:[0,0],blue:[0,0],minSize:8,sampleSize:512},n),this.direction=n.direction,this.red=n.red,this.green=n.green,this.blue=n.blue,this.offset=n.offset,this.fillMode=n.fillMode,this.average=n.average,this.seed=n.seed,this.minSize=n.minSize,this.sampleSize=n.sampleSize,this._canvas=document.createElement("canvas"),this._canvas.width=4,this._canvas.height=this.sampleSize,this.texture=t.Texture.fromCanvas(this._canvas,t.SCALE_MODES.NEAREST),this._slices=0,this.slices=n.slices}e&&(n.__proto__=e),n.prototype=Object.create(e&&e.prototype),n.prototype.constructor=n;var r={sizes:{configurable:!0},offsets:{configurable:!0},slices:{configurable:!0},direction:{configurable:!0},red:{configurable:!0},green:{configurable:!0},blue:{configurable:!0}};return n.prototype.apply=function(e,t,n,r){var o=t.sourceFrame.width,i=t.sourceFrame.height;this.uniforms.dimensions[0]=o,this.uniforms.dimensions[1]=i,this.uniforms.aspect=i/o,this.uniforms.seed=this.seed,this.uniforms.offset=this.offset,this.uniforms.fillMode=this.fillMode,e.applyFilter(this,t,n,r)},n.prototype._randomizeSizes=function(){var e=this._sizes,t=this._slices-1,n=this.sampleSize,r=Math.min(this.minSize/n,.9/this._slices);if(this.average){for(var o=this._slices,i=1,l=0;l<t;l++){var s=i/(o-l),a=Math.max(s*(1-.6*Math.random()),r);e[l]=a,i-=a}e[t]=i}else{for(var u=1,c=Math.sqrt(1/this._slices),f=0;f<t;f++){var d=Math.max(c*u*Math.random(),r);e[f]=d,u-=d}e[t]=u}this.shuffle()},n.prototype.shuffle=function(){for(var e=this._sizes,t=this._slices-1;t>0;t--){var n=Math.random()*t>>0,r=e[t];e[t]=e[n],e[n]=r}},n.prototype._randomizeOffsets=function(){for(var e=0;e<this._slices;e++)this._offsets[e]=Math.random()*(Math.random()<.5?-1:1)},n.prototype.refresh=function(){this._randomizeSizes(),this._randomizeOffsets(),this.redraw()},n.prototype.redraw=function(){var e,t=this.sampleSize,n=this.texture,r=this._canvas.getContext("2d");r.clearRect(0,0,8,t);for(var o=0,i=0;i<this._slices;i++){e=Math.floor(256*this._offsets[i]);var l=this._sizes[i]*t,s=e>0?e:0,a=e<0?-e:0;r.fillStyle="rgba("+s+", "+a+", 0, 1)",r.fillRect(0,o>>0,t,l+1>>0),o+=l}n._updateID++,n.baseTexture.emit("update",n.baseTexture),this.uniforms.displacementMap=n},r.sizes.set=function(e){for(var t=Math.min(this._slices,e.length),n=0;n<t;n++)this._sizes[n]=e[n]},r.sizes.get=function(){return this._sizes},r.offsets.set=function(e){for(var t=Math.min(this._slices,e.length),n=0;n<t;n++)this._offsets[n]=e[n]},r.offsets.get=function(){return this._offsets},r.slices.get=function(){return this._slices},r.slices.set=function(e){this._slices!==e&&(this._slices=e,this.uniforms.slices=e,this._sizes=this.uniforms.slicesWidth=new Float32Array(e),this._offsets=this.uniforms.slicesOffset=new Float32Array(e),this.refresh())},r.direction.get=function(){return this._direction},r.direction.set=function(e){if(this._direction!==e){this._direction=e;var n=e*t.DEG_TO_RAD;this.uniforms.sinDir=Math.sin(n),this.uniforms.cosDir=Math.cos(n)}},r.red.get=function(){return this.uniforms.red},r.red.set=function(e){this.uniforms.red=e},r.green.get=function(){return this.uniforms.green},r.green.set=function(e){this.uniforms.green=e},r.blue.get=function(){return this.uniforms.blue},r.blue.set=function(e){this.uniforms.blue=e},n.prototype.destroy=function(){this.texture.destroy(!0),this.texture=null,this._canvas=null,this.red=null,this.green=null,this.blue=null,this._sizes=null,this._offsets=null},Object.defineProperties(n.prototype,r),n}(t.Filter);Z.TRANSPARENT=0,Z.ORIGINAL=1,Z.LOOP=2,Z.CLAMP=3,Z.MIRROR=4;var Q=n,U="varying vec2 vTextureCoord;\nvarying vec4 vColor;\n\nuniform sampler2D uSampler;\n\nuniform float distance;\nuniform float outerStrength;\nuniform float innerStrength;\nuniform vec4 glowColor;\nuniform vec4 filterArea;\nuniform vec4 filterClamp;\nconst float PI = 3.14159265358979323846264;\n\nvoid main(void) {\n    vec2 px = vec2(1.0 / filterArea.x, 1.0 / filterArea.y);\n    vec4 ownColor = texture2D(uSampler, vTextureCoord);\n    vec4 curColor;\n    float totalAlpha = 0.0;\n    float maxTotalAlpha = 0.0;\n    float cosAngle;\n    float sinAngle;\n    vec2 displaced;\n    for (float angle = 0.0; angle <= PI * 2.0; angle += %QUALITY_DIST%) {\n       cosAngle = cos(angle);\n       sinAngle = sin(angle);\n       for (float curDistance = 1.0; curDistance <= %DIST%; curDistance++) {\n           displaced.x = vTextureCoord.x + cosAngle * curDistance * px.x;\n           displaced.y = vTextureCoord.y + sinAngle * curDistance * px.y;\n           curColor = texture2D(uSampler, clamp(displaced, filterClamp.xy, filterClamp.zw));\n           totalAlpha += (distance - curDistance) * curColor.a;\n           maxTotalAlpha += (distance - curDistance);\n       }\n    }\n    maxTotalAlpha = max(maxTotalAlpha, 0.0001);\n\n    ownColor.a = max(ownColor.a, 0.0001);\n    ownColor.rgb = ownColor.rgb / ownColor.a;\n    float outerGlowAlpha = (totalAlpha / maxTotalAlpha)  * outerStrength * (1. - ownColor.a);\n    float innerGlowAlpha = ((maxTotalAlpha - totalAlpha) / maxTotalAlpha) * innerStrength * ownColor.a;\n    float resultAlpha = (ownColor.a + outerGlowAlpha);\n    gl_FragColor = vec4(mix(mix(ownColor.rgb, glowColor.rgb, innerGlowAlpha / ownColor.a), glowColor.rgb, outerGlowAlpha / resultAlpha) * resultAlpha, resultAlpha);\n}\n",V=function(e){function n(t,n,r,o,i){void 0===t&&(t=10),void 0===n&&(n=4),void 0===r&&(r=0),void 0===o&&(o=16777215),void 0===i&&(i=.1),e.call(this,Q,U.replace(/%QUALITY_DIST%/gi,""+(1/i/t).toFixed(7)).replace(/%DIST%/gi,""+t.toFixed(7))),this.uniforms.glowColor=new Float32Array([0,0,0,1]),this.distance=t,this.color=o,this.outerStrength=n,this.innerStrength=r}e&&(n.__proto__=e),n.prototype=Object.create(e&&e.prototype),n.prototype.constructor=n;var r={color:{configurable:!0},distance:{configurable:!0},outerStrength:{configurable:!0},innerStrength:{configurable:!0}};return r.color.get=function(){return t.utils.rgb2hex(this.uniforms.glowColor)},r.color.set=function(e){t.utils.hex2rgb(e,this.uniforms.glowColor)},r.distance.get=function(){return this.uniforms.distance},r.distance.set=function(e){this.uniforms.distance=e},r.outerStrength.get=function(){return this.uniforms.outerStrength},r.outerStrength.set=function(e){this.uniforms.outerStrength=e},r.innerStrength.get=function(){return this.uniforms.innerStrength},r.innerStrength.set=function(e){this.uniforms.innerStrength=e},Object.defineProperties(n.prototype,r),n}(t.Filter),H=n,$="vec3 mod289(vec3 x)\n{\n    return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\nvec4 mod289(vec4 x)\n{\n    return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\nvec4 permute(vec4 x)\n{\n    return mod289(((x * 34.0) + 1.0) * x);\n}\nvec4 taylorInvSqrt(vec4 r)\n{\n    return 1.79284291400159 - 0.85373472095314 * r;\n}\nvec3 fade(vec3 t)\n{\n    return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);\n}\n// Classic Perlin noise, periodic variant\nfloat pnoise(vec3 P, vec3 rep)\n{\n    vec3 Pi0 = mod(floor(P), rep); // Integer part, modulo period\n    vec3 Pi1 = mod(Pi0 + vec3(1.0), rep); // Integer part + 1, mod period\n    Pi0 = mod289(Pi0);\n    Pi1 = mod289(Pi1);\n    vec3 Pf0 = fract(P); // Fractional part for interpolation\n    vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0\n    vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);\n    vec4 iy = vec4(Pi0.yy, Pi1.yy);\n    vec4 iz0 = Pi0.zzzz;\n    vec4 iz1 = Pi1.zzzz;\n    vec4 ixy = permute(permute(ix) + iy);\n    vec4 ixy0 = permute(ixy + iz0);\n    vec4 ixy1 = permute(ixy + iz1);\n    vec4 gx0 = ixy0 * (1.0 / 7.0);\n    vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;\n    gx0 = fract(gx0);\n    vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);\n    vec4 sz0 = step(gz0, vec4(0.0));\n    gx0 -= sz0 * (step(0.0, gx0) - 0.5);\n    gy0 -= sz0 * (step(0.0, gy0) - 0.5);\n    vec4 gx1 = ixy1 * (1.0 / 7.0);\n    vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;\n    gx1 = fract(gx1);\n    vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);\n    vec4 sz1 = step(gz1, vec4(0.0));\n    gx1 -= sz1 * (step(0.0, gx1) - 0.5);\n    gy1 -= sz1 * (step(0.0, gy1) - 0.5);\n    vec3 g000 = vec3(gx0.x, gy0.x, gz0.x);\n    vec3 g100 = vec3(gx0.y, gy0.y, gz0.y);\n    vec3 g010 = vec3(gx0.z, gy0.z, gz0.z);\n    vec3 g110 = vec3(gx0.w, gy0.w, gz0.w);\n    vec3 g001 = vec3(gx1.x, gy1.x, gz1.x);\n    vec3 g101 = vec3(gx1.y, gy1.y, gz1.y);\n    vec3 g011 = vec3(gx1.z, gy1.z, gz1.z);\n    vec3 g111 = vec3(gx1.w, gy1.w, gz1.w);\n    vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));\n    g000 *= norm0.x;\n    g010 *= norm0.y;\n    g100 *= norm0.z;\n    g110 *= norm0.w;\n    vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));\n    g001 *= norm1.x;\n    g011 *= norm1.y;\n    g101 *= norm1.z;\n    g111 *= norm1.w;\n    float n000 = dot(g000, Pf0);\n    float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));\n    float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));\n    float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));\n    float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));\n    float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));\n    float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));\n    float n111 = dot(g111, Pf1);\n    vec3 fade_xyz = fade(Pf0);\n    vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);\n    vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);\n    float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);\n    return 2.2 * n_xyz;\n}\nfloat turb(vec3 P, vec3 rep, float lacunarity, float gain)\n{\n    float sum = 0.0;\n    float sc = 1.0;\n    float totalgain = 1.0;\n    for (float i = 0.0; i < 6.0; i++)\n    {\n        sum += totalgain * pnoise(P * sc, rep);\n        sc *= lacunarity;\n        totalgain *= gain;\n    }\n    return abs(sum);\n}\n",J="varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform vec4 filterArea;\nuniform vec2 dimensions;\n\nuniform vec2 light;\nuniform bool parallel;\nuniform float aspect;\n\nuniform float gain;\nuniform float lacunarity;\nuniform float time;\n\n${perlin}\n\nvoid main(void) {\n    gl_FragColor = texture2D(uSampler, vTextureCoord);\n    vec2 coord = vTextureCoord * filterArea.xy / dimensions.xy;\n\n    float d;\n\n    if (parallel) {\n        float _cos = light.x;\n        float _sin = light.y;\n        d = (_cos * coord.x) + (_sin * coord.y * aspect);\n    } else {\n        float dx = coord.x - light.x / dimensions.x;\n        float dy = (coord.y - light.y / dimensions.y) * aspect;\n        float dis = sqrt(dx * dx + dy * dy) + 0.00001;\n        d = dy / dis;\n    }\n\n    vec3 dir = vec3(d, d, 0.0);\n\n    float noise = turb(dir + vec3(time, 0.0, 62.1 + time) * 0.05, vec3(480.0, 320.0, 480.0), lacunarity, gain);\n    noise = mix(noise, 0.0, 0.3);\n    //fade vertically.\n    vec4 mist = vec4(noise, noise, noise, 1.0) * (1.0 - coord.y);\n    mist.a = 1.0;\n    gl_FragColor += mist;\n}\n",ee=function(e){function n(n){e.call(this,H,J.replace("${perlin}",$)),"number"==typeof n&&(console.warn("GodrayFilter now uses options instead of (angle, gain, lacunarity, time)"),n={angle:n},void 0!==arguments[1]&&(n.gain=arguments[1]),void 0!==arguments[2]&&(n.lacunarity=arguments[2]),void 0!==arguments[3]&&(n.time=arguments[3])),n=Object.assign({angle:30,gain:.5,lacunarity:2.5,time:0,parallel:!0,center:[0,0]},n),this._angleLight=new t.Point,this.angle=n.angle,this.gain=n.gain,this.lacunarity=n.lacunarity,this.parallel=n.parallel,this.center=n.center,this.time=n.time}e&&(n.__proto__=e),n.prototype=Object.create(e&&e.prototype),n.prototype.constructor=n;var r={angle:{configurable:!0},gain:{configurable:!0},lacunarity:{configurable:!0}};return n.prototype.apply=function(e,t,n,r){var o=t.sourceFrame,i=o.width,l=o.height;this.uniforms.light=this.parallel?this._angleLight:this.center,this.uniforms.parallel=this.parallel,this.uniforms.dimensions[0]=i,this.uniforms.dimensions[1]=l,this.uniforms.aspect=l/i,this.uniforms.time=this.time,e.applyFilter(this,t,n,r)},r.angle.get=function(){return this._angle},r.angle.set=function(e){this._angle=e;var n=e*t.DEG_TO_RAD;this._angleLight.x=Math.cos(n),this._angleLight.y=Math.sin(n)},r.gain.get=function(){return this.uniforms.gain},r.gain.set=function(e){this.uniforms.gain=e},r.lacunarity.get=function(){return this.uniforms.lacunarity},r.lacunarity.set=function(e){this.uniforms.lacunarity=e},Object.defineProperties(n.prototype,r),n}(t.Filter),te=n,ne="varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform vec4 filterArea;\n\nuniform vec2 uVelocity;\nuniform int uKernelSize;\nuniform float uOffset;\n\nconst int MAX_KERNEL_SIZE = 2048;\nconst int ITERATION = MAX_KERNEL_SIZE - 1;\n\nvec2 velocity = uVelocity / filterArea.xy;\n\n// float kernelSize = min(float(uKernelSize), float(MAX_KERNELSIZE));\n\n// In real use-case , uKernelSize < MAX_KERNELSIZE almost always.\n// So use uKernelSize directly.\nfloat kernelSize = float(uKernelSize);\nfloat k = kernelSize - 1.0;\nfloat offset = -uOffset / length(uVelocity) - 0.5;\n\nvoid main(void)\n{\n    gl_FragColor = texture2D(uSampler, vTextureCoord);\n\n    if (uKernelSize == 0)\n    {\n        return;\n    }\n\n    for(int i = 0; i < ITERATION; i++) {\n        if (i == int(k)) {\n            break;\n        }\n        vec2 bias = velocity * (float(i) / k + offset);\n        gl_FragColor += texture2D(uSampler, vTextureCoord + bias);\n    }\n    gl_FragColor /= kernelSize;\n}\n",re=function(e){function n(n,r,o){void 0===n&&(n=[0,0]),void 0===r&&(r=5),void 0===o&&(o=0),e.call(this,te,ne),this._velocity=new t.Point(0,0),this.velocity=n,this.kernelSize=r,this.offset=o}e&&(n.__proto__=e),n.prototype=Object.create(e&&e.prototype),n.prototype.constructor=n;var r={velocity:{configurable:!0},offset:{configurable:!0}};return n.prototype.apply=function(e,t,n,r){var o=this.velocity,i=o.x,l=o.y;this.uniforms.uKernelSize=0!==i||0!==l?this.kernelSize:0,e.applyFilter(this,t,n,r)},r.velocity.set=function(e){Array.isArray(e)?(this._velocity.x=e[0],this._velocity.y=e[1]):e instanceof t.Point&&(this._velocity.x=e.x,this._velocity.y=e.y),this.uniforms.uVelocity[0]=this._velocity.x,this.uniforms.uVelocity[1]=this._velocity.y},r.velocity.get=function(){return this._velocity},r.offset.set=function(e){this.uniforms.uOffset=e},r.offset.get=function(){return this.uniforms.uOffset},Object.defineProperties(n.prototype,r),n}(t.Filter),oe=n,ie="varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\n\nuniform float epsilon;\n\nconst int MAX_COLORS = %maxColors%;\n\nuniform vec3 originalColors[MAX_COLORS];\nuniform vec3 targetColors[MAX_COLORS];\n\nvoid main(void)\n{\n    gl_FragColor = texture2D(uSampler, vTextureCoord);\n\n    float alpha = gl_FragColor.a;\n    if (alpha < 0.0001)\n    {\n      return;\n    }\n\n    vec3 color = gl_FragColor.rgb / alpha;\n\n    for(int i = 0; i < MAX_COLORS; i++)\n    {\n      vec3 origColor = originalColors[i];\n      if (origColor.r < 0.0)\n      {\n        break;\n      }\n      vec3 colorDiff = origColor - color;\n      if (length(colorDiff) < epsilon)\n      {\n        vec3 targetColor = targetColors[i];\n        gl_FragColor = vec4((targetColor + colorDiff) * alpha, alpha);\n        return;\n      }\n    }\n}\n",le=function(e){function n(t,n,r){void 0===n&&(n=.05),void 0===r&&(r=null),r=r||t.length,e.call(this,oe,ie.replace(/%maxColors%/g,r)),this.epsilon=n,this._maxColors=r,this._replacements=null,this.uniforms.originalColors=new Float32Array(3*r),this.uniforms.targetColors=new Float32Array(3*r),this.replacements=t}e&&(n.__proto__=e),n.prototype=Object.create(e&&e.prototype),n.prototype.constructor=n;var r={replacements:{configurable:!0},maxColors:{configurable:!0},epsilon:{configurable:!0}};return r.replacements.set=function(e){var n=this.uniforms.originalColors,r=this.uniforms.targetColors,o=e.length;if(o>this._maxColors)throw"Length of replacements ("+o+") exceeds the maximum colors length ("+this._maxColors+")";n[3*o]=-1;for(var i=0;i<o;i++){var l=e[i],s=l[0];"number"==typeof s?s=t.utils.hex2rgb(s):l[0]=t.utils.rgb2hex(s),n[3*i]=s[0],n[3*i+1]=s[1],n[3*i+2]=s[2];var a=l[1];"number"==typeof a?a=t.utils.hex2rgb(a):l[1]=t.utils.rgb2hex(a),r[3*i]=a[0],r[3*i+1]=a[1],r[3*i+2]=a[2]}this._replacements=e},r.replacements.get=function(){return this._replacements},n.prototype.refresh=function(){this.replacements=this._replacements},r.maxColors.get=function(){return this._maxColors},r.epsilon.set=function(e){this.uniforms.epsilon=e},r.epsilon.get=function(){return this.uniforms.epsilon},Object.defineProperties(n.prototype,r),n}(t.Filter),se=n,ae="varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform vec4 filterArea;\nuniform vec2 dimensions;\n\nuniform float sepia;\nuniform float noise;\nuniform float noiseSize;\nuniform float scratch;\nuniform float scratchDensity;\nuniform float scratchWidth;\nuniform float vignetting;\nuniform float vignettingAlpha;\nuniform float vignettingBlur;\nuniform float seed;\n\nconst float SQRT_2 = 1.414213;\nconst vec3 SEPIA_RGB = vec3(112.0 / 255.0, 66.0 / 255.0, 20.0 / 255.0);\n\nfloat rand(vec2 co) {\n    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);\n}\n\nvec3 Overlay(vec3 src, vec3 dst)\n{\n    // if (dst <= 0.5) then: 2 * src * dst\n    // if (dst > 0.5) then: 1 - 2 * (1 - dst) * (1 - src)\n    return vec3((dst.x <= 0.5) ? (2.0 * src.x * dst.x) : (1.0 - 2.0 * (1.0 - dst.x) * (1.0 - src.x)),\n                (dst.y <= 0.5) ? (2.0 * src.y * dst.y) : (1.0 - 2.0 * (1.0 - dst.y) * (1.0 - src.y)),\n                (dst.z <= 0.5) ? (2.0 * src.z * dst.z) : (1.0 - 2.0 * (1.0 - dst.z) * (1.0 - src.z)));\n}\n\n\nvoid main()\n{\n    gl_FragColor = texture2D(uSampler, vTextureCoord);\n    vec3 color = gl_FragColor.rgb;\n\n    if (sepia > 0.0)\n    {\n        float gray = (color.x + color.y + color.z) / 3.0;\n        vec3 grayscale = vec3(gray);\n\n        color = Overlay(SEPIA_RGB, grayscale);\n\n        color = grayscale + sepia * (color - grayscale);\n    }\n\n    vec2 coord = vTextureCoord * filterArea.xy / dimensions.xy;\n\n    if (vignetting > 0.0)\n    {\n        float outter = SQRT_2 - vignetting * SQRT_2;\n        vec2 dir = vec2(vec2(0.5, 0.5) - coord);\n        dir.y *= dimensions.y / dimensions.x;\n        float darker = clamp((outter - length(dir) * SQRT_2) / ( 0.00001 + vignettingBlur * SQRT_2), 0.0, 1.0);\n        color.rgb *= darker + (1.0 - darker) * (1.0 - vignettingAlpha);\n    }\n\n    if (scratchDensity > seed && scratch != 0.0)\n    {\n        float phase = seed * 256.0;\n        float s = mod(floor(phase), 2.0);\n        float dist = 1.0 / scratchDensity;\n        float d = distance(coord, vec2(seed * dist, abs(s - seed * dist)));\n        if (d < seed * 0.6 + 0.4)\n        {\n            highp float period = scratchDensity * 10.0;\n\n            float xx = coord.x * period + phase;\n            float aa = abs(mod(xx, 0.5) * 4.0);\n            float bb = mod(floor(xx / 0.5), 2.0);\n            float yy = (1.0 - bb) * aa + bb * (2.0 - aa);\n\n            float kk = 2.0 * period;\n            float dw = scratchWidth / dimensions.x * (0.75 + seed);\n            float dh = dw * kk;\n\n            float tine = (yy - (2.0 - dh));\n\n            if (tine > 0.0) {\n                float _sign = sign(scratch);\n\n                tine = s * tine / period + scratch + 0.1;\n                tine = clamp(tine + 1.0, 0.5 + _sign * 0.5, 1.5 + _sign * 0.5);\n\n                color.rgb *= tine;\n            }\n        }\n    }\n\n    if (noise > 0.0 && noiseSize > 0.0)\n    {\n        vec2 pixelCoord = vTextureCoord.xy * filterArea.xy;\n        pixelCoord.x = floor(pixelCoord.x / noiseSize);\n        pixelCoord.y = floor(pixelCoord.y / noiseSize);\n        // vec2 d = pixelCoord * noiseSize * vec2(1024.0 + seed * 512.0, 1024.0 - seed * 512.0);\n        // float _noise = snoise(d) * 0.5;\n        float _noise = rand(pixelCoord * noiseSize * seed) - 0.5;\n        color += _noise * noise;\n    }\n\n    gl_FragColor.rgb = color;\n}\n",ue=function(e){function t(t,n){void 0===n&&(n=0),e.call(this,se,ae),"number"==typeof t?(this.seed=t,t=null):this.seed=n,Object.assign(this,{sepia:.3,noise:.3,noiseSize:1,scratch:.5,scratchDensity:.3,scratchWidth:1,vignetting:.3,vignettingAlpha:1,vignettingBlur:.3},t)}e&&(t.__proto__=e),t.prototype=Object.create(e&&e.prototype),t.prototype.constructor=t;var n={sepia:{configurable:!0},noise:{configurable:!0},noiseSize:{configurable:!0},scratch:{configurable:!0},scratchDensity:{configurable:!0},scratchWidth:{configurable:!0},vignetting:{configurable:!0},vignettingAlpha:{configurable:!0},vignettingBlur:{configurable:!0}};return t.prototype.apply=function(e,t,n,r){this.uniforms.dimensions[0]=t.sourceFrame.width,this.uniforms.dimensions[1]=t.sourceFrame.height,this.uniforms.seed=this.seed,e.applyFilter(this,t,n,r)},n.sepia.set=function(e){this.uniforms.sepia=e},n.sepia.get=function(){return this.uniforms.sepia},n.noise.set=function(e){this.uniforms.noise=e},n.noise.get=function(){return this.uniforms.noise},n.noiseSize.set=function(e){this.uniforms.noiseSize=e},n.noiseSize.get=function(){return this.uniforms.noiseSize},n.scratch.set=function(e){this.uniforms.scratch=e},n.scratch.get=function(){return this.uniforms.scratch},n.scratchDensity.set=function(e){this.uniforms.scratchDensity=e},n.scratchDensity.get=function(){return this.uniforms.scratchDensity},n.scratchWidth.set=function(e){this.uniforms.scratchWidth=e},n.scratchWidth.get=function(){return this.uniforms.scratchWidth},n.vignetting.set=function(e){this.uniforms.vignetting=e},n.vignetting.get=function(){return this.uniforms.vignetting},n.vignettingAlpha.set=function(e){this.uniforms.vignettingAlpha=e},n.vignettingAlpha.get=function(){return this.uniforms.vignettingAlpha},n.vignettingBlur.set=function(e){this.uniforms.vignettingBlur=e},n.vignettingBlur.get=function(){return this.uniforms.vignettingBlur},Object.defineProperties(t.prototype,n),t}(t.Filter),ce=n,fe="varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\n\nuniform vec2 thickness;\nuniform vec4 outlineColor;\nuniform vec4 filterClamp;\n\nconst float DOUBLE_PI = 3.14159265358979323846264 * 2.;\n\nvoid main(void) {\n    vec4 ownColor = texture2D(uSampler, vTextureCoord);\n    vec4 curColor;\n    float maxAlpha = 0.;\n    vec2 displaced;\n    for (float angle = 0.; angle <= DOUBLE_PI; angle += ${angleStep}) {\n        displaced.x = vTextureCoord.x + thickness.x * cos(angle);\n        displaced.y = vTextureCoord.y + thickness.y * sin(angle);\n        curColor = texture2D(uSampler, clamp(displaced, filterClamp.xy, filterClamp.zw));\n        maxAlpha = max(maxAlpha, curColor.a);\n    }\n    float resultAlpha = max(maxAlpha, ownColor.a);\n    gl_FragColor = vec4((ownColor.rgb + outlineColor.rgb * (1. - ownColor.a)) * resultAlpha, resultAlpha);\n}\n",de=function(e){function n(t,r,o){void 0===t&&(t=1),void 0===r&&(r=0),void 0===o&&(o=.1);var i=Math.max(o*n.MAX_SAMPLES,n.MIN_SAMPLES),l=(2*Math.PI/i).toFixed(7);e.call(this,ce,fe.replace(/\$\{angleStep\}/,l)),this.uniforms.thickness=new Float32Array([0,0]),this.thickness=t,this.uniforms.outlineColor=new Float32Array([0,0,0,1]),this.color=r,this.quality=o}e&&(n.__proto__=e),n.prototype=Object.create(e&&e.prototype),n.prototype.constructor=n;var r={color:{configurable:!0}};return n.prototype.apply=function(e,t,n,r){this.uniforms.thickness[0]=this.thickness/t.size.width,this.uniforms.thickness[1]=this.thickness/t.size.height,e.applyFilter(this,t,n,r)},r.color.get=function(){return t.utils.rgb2hex(this.uniforms.outlineColor)},r.color.set=function(e){t.utils.hex2rgb(e,this.uniforms.outlineColor)},Object.defineProperties(n.prototype,r),n}(t.Filter);de.MIN_SAMPLES=1,de.MAX_SAMPLES=100;var pe=n,ge="precision mediump float;\n\nvarying vec2 vTextureCoord;\n\nuniform vec2 size;\nuniform sampler2D uSampler;\n\nuniform vec4 filterArea;\n\nvec2 mapCoord( vec2 coord )\n{\n    coord *= filterArea.xy;\n    coord += filterArea.zw;\n\n    return coord;\n}\n\nvec2 unmapCoord( vec2 coord )\n{\n    coord -= filterArea.zw;\n    coord /= filterArea.xy;\n\n    return coord;\n}\n\nvec2 pixelate(vec2 coord, vec2 size)\n{\n\treturn floor( coord / size ) * size;\n}\n\nvoid main(void)\n{\n    vec2 coord = mapCoord(vTextureCoord);\n\n    coord = pixelate(coord, size);\n\n    coord = unmapCoord(coord);\n\n    gl_FragColor = texture2D(uSampler, coord);\n}\n",he=function(e){function t(t){void 0===t&&(t=10),e.call(this,pe,ge),this.size=t}e&&(t.__proto__=e),t.prototype=Object.create(e&&e.prototype),t.prototype.constructor=t;var n={size:{configurable:!0}};return n.size.get=function(){return this.uniforms.size},n.size.set=function(e){"number"==typeof e&&(e=[e,e]),this.uniforms.size=e},Object.defineProperties(t.prototype,n),t}(t.Filter),me=n,ve="varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform vec4 filterArea;\n\nuniform float uRadian;\nuniform vec2 uCenter;\nuniform float uRadius;\nuniform int uKernelSize;\n\nconst int MAX_KERNEL_SIZE = 2048;\nconst int ITERATION = MAX_KERNEL_SIZE - 1;\n\n// float kernelSize = min(float(uKernelSize), float(MAX_KERNELSIZE));\n\n// In real use-case , uKernelSize < MAX_KERNELSIZE almost always.\n// So use uKernelSize directly.\nfloat kernelSize = float(uKernelSize);\nfloat k = kernelSize - 1.0;\n\n\nvec2 center = uCenter.xy / filterArea.xy;\nfloat aspect = filterArea.y / filterArea.x;\n\nfloat gradient = uRadius / filterArea.x * 0.3;\nfloat radius = uRadius / filterArea.x - gradient * 0.5;\n\nvoid main(void)\n{\n    gl_FragColor = texture2D(uSampler, vTextureCoord);\n\n    if (uKernelSize == 0)\n    {\n        return;\n    }\n\n    vec2 coord = vTextureCoord;\n\n    vec2 dir = vec2(center - coord);\n    float dist = length(vec2(dir.x, dir.y * aspect));\n\n    float radianStep;\n\n    if (radius >= 0.0 && dist > radius) {\n        float delta = dist - radius;\n        float gap = gradient;\n        float scale = 1.0 - abs(delta / gap);\n        if (scale <= 0.0) {\n            return;\n        }\n        radianStep = uRadian * scale / k;\n    } else {\n        radianStep = uRadian / k;\n    }\n\n    float s = sin(radianStep);\n    float c = cos(radianStep);\n    mat2 rotationMatrix = mat2(vec2(c, -s), vec2(s, c));\n\n    for(int i = 0; i < ITERATION; i++) {\n        if (i == int(k)) {\n            break;\n        }\n\n        coord -= center;\n        coord.y *= aspect;\n        coord = rotationMatrix * coord;\n        coord.y /= aspect;\n        coord += center;\n\n        vec4 sample = texture2D(uSampler, coord);\n\n        // switch to pre-multiplied alpha to correctly blur transparent images\n        // sample.rgb *= sample.a;\n\n        gl_FragColor += sample;\n    }\n    gl_FragColor /= kernelSize;\n}\n",xe=function(e){function t(t,n,r,o){void 0===t&&(t=0),void 0===n&&(n=[0,0]),void 0===r&&(r=5),void 0===o&&(o=-1),e.call(this,me,ve),this._angle=0,this.angle=t,this.center=n,this.kernelSize=r,this.radius=o}e&&(t.__proto__=e),t.prototype=Object.create(e&&e.prototype),t.prototype.constructor=t;var n={angle:{configurable:!0},center:{configurable:!0},radius:{configurable:!0}};return t.prototype.apply=function(e,t,n,r){this.uniforms.uKernelSize=0!==this._angle?this.kernelSize:0,e.applyFilter(this,t,n,r)},n.angle.set=function(e){this._angle=e,this.uniforms.uRadian=e*Math.PI/180},n.angle.get=function(){return this._angle},n.center.get=function(){return this.uniforms.uCenter},n.center.set=function(e){this.uniforms.uCenter=e},n.radius.get=function(){return this.uniforms.uRadius},n.radius.set=function(e){(e<0||e===1/0)&&(e=-1),this.uniforms.uRadius=e},Object.defineProperties(t.prototype,n),t}(t.Filter),ye=n,be="varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\n\nuniform vec4 filterArea;\nuniform vec4 filterClamp;\nuniform vec2 dimensions;\n\nuniform bool mirror;\nuniform float boundary;\nuniform vec2 amplitude;\nuniform vec2 waveLength;\nuniform vec2 alpha;\nuniform float time;\n\nfloat rand(vec2 co) {\n    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);\n}\n\nvoid main(void)\n{\n    vec2 pixelCoord = vTextureCoord.xy * filterArea.xy;\n    vec2 coord = pixelCoord / dimensions;\n\n    if (coord.y < boundary) {\n        gl_FragColor = texture2D(uSampler, vTextureCoord);\n        return;\n    }\n\n    float k = (coord.y - boundary) / (1. - boundary + 0.0001);\n    float areaY = boundary * dimensions.y / filterArea.y;\n    float v = areaY + areaY - vTextureCoord.y;\n    float y = mirror ? v : vTextureCoord.y;\n\n    float _amplitude = ((amplitude.y - amplitude.x) * k + amplitude.x ) / filterArea.x;\n    float _waveLength = ((waveLength.y - waveLength.x) * k + waveLength.x) / filterArea.y;\n    float _alpha = (alpha.y - alpha.x) * k + alpha.x;\n\n    float x = vTextureCoord.x + cos(v * 6.28 / _waveLength - time) * _amplitude;\n    x = clamp(x, filterClamp.x, filterClamp.z);\n\n    vec4 color = texture2D(uSampler, vec2(x, y));\n\n    gl_FragColor = color * _alpha;\n}\n",_e=function(e){function t(t){e.call(this,ye,be),Object.assign(this,{mirror:!0,boundary:.5,amplitude:[0,20],waveLength:[30,100],alpha:[1,1],time:0},t)}e&&(t.__proto__=e),t.prototype=Object.create(e&&e.prototype),t.prototype.constructor=t;var n={mirror:{configurable:!0},boundary:{configurable:!0},amplitude:{configurable:!0},waveLength:{configurable:!0},alpha:{configurable:!0}};return t.prototype.apply=function(e,t,n,r){this.uniforms.dimensions[0]=t.sourceFrame.width,this.uniforms.dimensions[1]=t.sourceFrame.height,this.uniforms.time=this.time,e.applyFilter(this,t,n,r)},n.mirror.set=function(e){this.uniforms.mirror=e},n.mirror.get=function(){return this.uniforms.mirror},n.boundary.set=function(e){this.uniforms.boundary=e},n.boundary.get=function(){return this.uniforms.boundary},n.amplitude.set=function(e){this.uniforms.amplitude[0]=e[0],this.uniforms.amplitude[1]=e[1]},n.amplitude.get=function(){return this.uniforms.amplitude},n.waveLength.set=function(e){this.uniforms.waveLength[0]=e[0],this.uniforms.waveLength[1]=e[1]},n.waveLength.get=function(){return this.uniforms.waveLength},n.alpha.set=function(e){this.uniforms.alpha[0]=e[0],this.uniforms.alpha[1]=e[1]},n.alpha.get=function(){return this.uniforms.alpha},Object.defineProperties(t.prototype,n),t}(t.Filter),Ce=n,Se="precision mediump float;\n\nvarying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform vec4 filterArea;\nuniform vec2 red;\nuniform vec2 green;\nuniform vec2 blue;\n\nvoid main(void)\n{\n   gl_FragColor.r = texture2D(uSampler, vTextureCoord + red/filterArea.xy).r;\n   gl_FragColor.g = texture2D(uSampler, vTextureCoord + green/filterArea.xy).g;\n   gl_FragColor.b = texture2D(uSampler, vTextureCoord + blue/filterArea.xy).b;\n   gl_FragColor.a = texture2D(uSampler, vTextureCoord).a;\n}\n",Fe=function(e){function t(t,n,r){void 0===t&&(t=[-10,0]),void 0===n&&(n=[0,10]),void 0===r&&(r=[0,0]),e.call(this,Ce,Se),this.red=t,this.green=n,this.blue=r}e&&(t.__proto__=e),t.prototype=Object.create(e&&e.prototype),t.prototype.constructor=t;var n={red:{configurable:!0},green:{configurable:!0},blue:{configurable:!0}};return n.red.get=function(){return this.uniforms.red},n.red.set=function(e){this.uniforms.red=e},n.green.get=function(){return this.uniforms.green},n.green.set=function(e){this.uniforms.green=e},n.blue.get=function(){return this.uniforms.blue},n.blue.set=function(e){this.uniforms.blue=e},Object.defineProperties(t.prototype,n),t}(t.Filter),ze=n,Ae="varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform vec4 filterArea;\nuniform vec4 filterClamp;\n\nuniform vec2 center;\n\nuniform float amplitude;\nuniform float wavelength;\n// uniform float power;\nuniform float brightness;\nuniform float speed;\nuniform float radius;\n\nuniform float time;\n\nconst float PI = 3.14159;\n\nvoid main()\n{\n    float halfWavelength = wavelength * 0.5 / filterArea.x;\n    float maxRadius = radius / filterArea.x;\n    float currentRadius = time * speed / filterArea.x;\n\n    float fade = 1.0;\n\n    if (maxRadius > 0.0) {\n        if (currentRadius > maxRadius) {\n            gl_FragColor = texture2D(uSampler, vTextureCoord);\n            return;\n        }\n        fade = 1.0 - pow(currentRadius / maxRadius, 2.0);\n    }\n\n    vec2 dir = vec2(vTextureCoord - center / filterArea.xy);\n    dir.y *= filterArea.y / filterArea.x;\n    float dist = length(dir);\n\n    if (dist <= 0.0 || dist < currentRadius - halfWavelength || dist > currentRadius + halfWavelength) {\n        gl_FragColor = texture2D(uSampler, vTextureCoord);\n        return;\n    }\n\n    vec2 diffUV = normalize(dir);\n\n    float diff = (dist - currentRadius) / halfWavelength;\n\n    float p = 1.0 - pow(abs(diff), 2.0);\n\n    // float powDiff = diff * pow(p, 2.0) * ( amplitude * fade );\n    float powDiff = 1.25 * sin(diff * PI) * p * ( amplitude * fade );\n\n    vec2 offset = diffUV * powDiff / filterArea.xy;\n\n    // Do clamp :\n    vec2 coord = vTextureCoord + offset;\n    vec2 clampedCoord = clamp(coord, filterClamp.xy, filterClamp.zw);\n    gl_FragColor = texture2D(uSampler, clampedCoord);\n    if (coord != clampedCoord) {\n        gl_FragColor *= max(0.0, 1.0 - length(coord - clampedCoord));\n    }\n\n    // No clamp :\n    // gl_FragColor = texture2D(uSampler, vTextureCoord + offset);\n\n    gl_FragColor.rgb *= 1.0 + (brightness - 1.0) * p * fade;\n}\n",Te=function(e){function t(t,n,r){void 0===t&&(t=[0,0]),void 0===n&&(n={}),void 0===r&&(r=0),e.call(this,ze,Ae),this.center=t,Array.isArray(n)&&(console.warn("Deprecated Warning: ShockwaveFilter params Array has been changed to options Object."),n={}),n=Object.assign({amplitude:30,wavelength:160,brightness:1,speed:500,radius:-1},n),this.amplitude=n.amplitude,this.wavelength=n.wavelength,this.brightness=n.brightness,this.speed=n.speed,this.radius=n.radius,this.time=r}e&&(t.__proto__=e),t.prototype=Object.create(e&&e.prototype),t.prototype.constructor=t;var n={center:{configurable:!0},amplitude:{configurable:!0},wavelength:{configurable:!0},brightness:{configurable:!0},speed:{configurable:!0},radius:{configurable:!0}};return t.prototype.apply=function(e,t,n,r){this.uniforms.time=this.time,e.applyFilter(this,t,n,r)},n.center.get=function(){return this.uniforms.center},n.center.set=function(e){this.uniforms.center=e},n.amplitude.get=function(){return this.uniforms.amplitude},n.amplitude.set=function(e){this.uniforms.amplitude=e},n.wavelength.get=function(){return this.uniforms.wavelength},n.wavelength.set=function(e){this.uniforms.wavelength=e},n.brightness.get=function(){return this.uniforms.brightness},n.brightness.set=function(e){this.uniforms.brightness=e},n.speed.get=function(){return this.uniforms.speed},n.speed.set=function(e){this.uniforms.speed=e},n.radius.get=function(){return this.uniforms.radius},n.radius.set=function(e){this.uniforms.radius=e},Object.defineProperties(t.prototype,n),t}(t.Filter),we=n,De="varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform sampler2D uLightmap;\nuniform vec4 filterArea;\nuniform vec2 dimensions;\nuniform vec4 ambientColor;\nvoid main() {\n    vec4 diffuseColor = texture2D(uSampler, vTextureCoord);\n    vec2 lightCoord = (vTextureCoord * filterArea.xy) / dimensions;\n    vec4 light = texture2D(uLightmap, lightCoord);\n    vec3 ambient = ambientColor.rgb * ambientColor.a;\n    vec3 intensity = ambient + light.rgb;\n    vec3 finalColor = diffuseColor.rgb * intensity;\n    gl_FragColor = vec4(finalColor, diffuseColor.a);\n}\n",Oe=function(e){function n(t,n,r){void 0===n&&(n=0),void 0===r&&(r=1),e.call(this,we,De),this.uniforms.ambientColor=new Float32Array([0,0,0,r]),this.texture=t,this.color=n}e&&(n.__proto__=e),n.prototype=Object.create(e&&e.prototype),n.prototype.constructor=n;var r={texture:{configurable:!0},color:{configurable:!0},alpha:{configurable:!0}};return n.prototype.apply=function(e,t,n,r){this.uniforms.dimensions[0]=t.sourceFrame.width,this.uniforms.dimensions[1]=t.sourceFrame.height,e.applyFilter(this,t,n,r)},r.texture.get=function(){return this.uniforms.uLightmap},r.texture.set=function(e){this.uniforms.uLightmap=e},r.color.set=function(e){var n=this.uniforms.ambientColor;"number"==typeof e?(t.utils.hex2rgb(e,n),this._color=e):(n[0]=e[0],n[1]=e[1],n[2]=e[2],n[3]=e[3],this._color=t.utils.rgb2hex(n))},r.color.get=function(){return this._color},r.alpha.get=function(){return this.uniforms.ambientColor[3]},r.alpha.set=function(e){this.uniforms.ambientColor[3]=e},Object.defineProperties(n.prototype,r),n}(t.Filter),Re=n,Pe="varying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform float blur;\nuniform float gradientBlur;\nuniform vec2 start;\nuniform vec2 end;\nuniform vec2 delta;\nuniform vec2 texSize;\n\nfloat random(vec3 scale, float seed)\n{\n    return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);\n}\n\nvoid main(void)\n{\n    vec4 color = vec4(0.0);\n    float total = 0.0;\n\n    float offset = random(vec3(12.9898, 78.233, 151.7182), 0.0);\n    vec2 normal = normalize(vec2(start.y - end.y, end.x - start.x));\n    float radius = smoothstep(0.0, 1.0, abs(dot(vTextureCoord * texSize - start, normal)) / gradientBlur) * blur;\n\n    for (float t = -30.0; t <= 30.0; t++)\n    {\n        float percent = (t + offset - 0.5) / 30.0;\n        float weight = 1.0 - abs(percent);\n        vec4 sample = texture2D(uSampler, vTextureCoord + delta / texSize * percent * radius);\n        sample.rgb *= sample.a;\n        color += sample * weight;\n        total += weight;\n    }\n\n    gl_FragColor = color / total;\n    gl_FragColor.rgb /= gl_FragColor.a + 0.00001;\n}\n",Me=function(e){function n(n,r,o,i){void 0===n&&(n=100),void 0===r&&(r=600),void 0===o&&(o=null),void 0===i&&(i=null),e.call(this,Re,Pe),this.uniforms.blur=n,this.uniforms.gradientBlur=r,this.uniforms.start=o||new t.Point(0,window.innerHeight/2),this.uniforms.end=i||new t.Point(600,window.innerHeight/2),this.uniforms.delta=new t.Point(30,30),this.uniforms.texSize=new t.Point(window.innerWidth,window.innerHeight),this.updateDelta()}e&&(n.__proto__=e),n.prototype=Object.create(e&&e.prototype),n.prototype.constructor=n;var r={blur:{configurable:!0},gradientBlur:{configurable:!0},start:{configurable:!0},end:{configurable:!0}};return n.prototype.updateDelta=function(){this.uniforms.delta.x=0,this.uniforms.delta.y=0},r.blur.get=function(){return this.uniforms.blur},r.blur.set=function(e){this.uniforms.blur=e},r.gradientBlur.get=function(){return this.uniforms.gradientBlur},r.gradientBlur.set=function(e){this.uniforms.gradientBlur=e},r.start.get=function(){return this.uniforms.start},r.start.set=function(e){this.uniforms.start=e,this.updateDelta()},r.end.get=function(){return this.uniforms.end},r.end.set=function(e){this.uniforms.end=e,this.updateDelta()},Object.defineProperties(n.prototype,r),n}(t.Filter),Le=function(e){function t(){e.apply(this,arguments)}return e&&(t.__proto__=e),t.prototype=Object.create(e&&e.prototype),t.prototype.constructor=t,t.prototype.updateDelta=function(){var e=this.uniforms.end.x-this.uniforms.start.x,t=this.uniforms.end.y-this.uniforms.start.y,n=Math.sqrt(e*e+t*t);this.uniforms.delta.x=e/n,this.uniforms.delta.y=t/n},t}(Me),je=function(e){function t(){e.apply(this,arguments)}return e&&(t.__proto__=e),t.prototype=Object.create(e&&e.prototype),t.prototype.constructor=t,t.prototype.updateDelta=function(){var e=this.uniforms.end.x-this.uniforms.start.x,t=this.uniforms.end.y-this.uniforms.start.y,n=Math.sqrt(e*e+t*t);this.uniforms.delta.x=-t/n,this.uniforms.delta.y=e/n},t}(Me),Ie=function(e){function t(t,n,r,o){void 0===t&&(t=100),void 0===n&&(n=600),void 0===r&&(r=null),void 0===o&&(o=null),e.call(this),this.tiltShiftXFilter=new Le(t,n,r,o),this.tiltShiftYFilter=new je(t,n,r,o)}e&&(t.__proto__=e),t.prototype=Object.create(e&&e.prototype),t.prototype.constructor=t;var n={blur:{configurable:!0},gradientBlur:{configurable:!0},start:{configurable:!0},end:{configurable:!0}};return t.prototype.apply=function(e,t,n){var r=e.getRenderTarget(!0);this.tiltShiftXFilter.apply(e,t,r),this.tiltShiftYFilter.apply(e,r,n),e.returnRenderTarget(r)},n.blur.get=function(){return this.tiltShiftXFilter.blur},n.blur.set=function(e){this.tiltShiftXFilter.blur=this.tiltShiftYFilter.blur=e},n.gradientBlur.get=function(){return this.tiltShiftXFilter.gradientBlur},n.gradientBlur.set=function(e){this.tiltShiftXFilter.gradientBlur=this.tiltShiftYFilter.gradientBlur=e},n.start.get=function(){return this.tiltShiftXFilter.start},n.start.set=function(e){this.tiltShiftXFilter.start=this.tiltShiftYFilter.start=e},n.end.get=function(){return this.tiltShiftXFilter.end},n.end.set=function(e){this.tiltShiftXFilter.end=this.tiltShiftYFilter.end=e},Object.defineProperties(t.prototype,n),t}(t.Filter),ke=n,Ee="varying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform float radius;\nuniform float angle;\nuniform vec2 offset;\nuniform vec4 filterArea;\n\nvec2 mapCoord( vec2 coord )\n{\n    coord *= filterArea.xy;\n    coord += filterArea.zw;\n\n    return coord;\n}\n\nvec2 unmapCoord( vec2 coord )\n{\n    coord -= filterArea.zw;\n    coord /= filterArea.xy;\n\n    return coord;\n}\n\nvec2 twist(vec2 coord)\n{\n    coord -= offset;\n\n    float dist = length(coord);\n\n    if (dist < radius)\n    {\n        float ratioDist = (radius - dist) / radius;\n        float angleMod = ratioDist * ratioDist * angle;\n        float s = sin(angleMod);\n        float c = cos(angleMod);\n        coord = vec2(coord.x * c - coord.y * s, coord.x * s + coord.y * c);\n    }\n\n    coord += offset;\n\n    return coord;\n}\n\nvoid main(void)\n{\n\n    vec2 coord = mapCoord(vTextureCoord);\n\n    coord = twist(coord);\n\n    coord = unmapCoord(coord);\n\n    gl_FragColor = texture2D(uSampler, coord );\n\n}\n",Be=function(e){function t(t,n,r){void 0===t&&(t=200),void 0===n&&(n=4),void 0===r&&(r=20),e.call(this,ke,Ee),this.radius=t,this.angle=n,this.padding=r}e&&(t.__proto__=e),t.prototype=Object.create(e&&e.prototype),t.prototype.constructor=t;var n={offset:{configurable:!0},radius:{configurable:!0},angle:{configurable:!0}};return n.offset.get=function(){return this.uniforms.offset},n.offset.set=function(e){this.uniforms.offset=e},n.radius.get=function(){return this.uniforms.radius},n.radius.set=function(e){this.uniforms.radius=e},n.angle.get=function(){return this.uniforms.angle},n.angle.set=function(e){this.uniforms.angle=e},Object.defineProperties(t.prototype,n),t}(t.Filter),Xe=n,Ne="varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform vec4 filterArea;\n\nuniform vec2 uCenter;\nuniform float uStrength;\nuniform float uInnerRadius;\nuniform float uRadius;\n\nconst float MAX_KERNEL_SIZE = 32.0;\n\nfloat random(vec3 scale, float seed) {\n    // use the fragment position for a different seed per-pixel\n    return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);\n}\n\nvoid main() {\n\n    float minGradient = uInnerRadius * 0.3;\n    float innerRadius = (uInnerRadius + minGradient * 0.5) / filterArea.x;\n\n    float gradient = uRadius * 0.3;\n    float radius = (uRadius - gradient * 0.5) / filterArea.x;\n\n    float countLimit = MAX_KERNEL_SIZE;\n\n    vec2 dir = vec2(uCenter.xy / filterArea.xy - vTextureCoord);\n    float dist = length(vec2(dir.x, dir.y * filterArea.y / filterArea.x));\n\n    float strength = uStrength;\n\n    float delta = 0.0;\n    float gap;\n    if (dist < innerRadius) {\n        delta = innerRadius - dist;\n        gap = minGradient;\n    } else if (radius >= 0.0 && dist > radius) { // radius < 0 means it's infinity\n        delta = dist - radius;\n        gap = gradient;\n    }\n\n    if (delta > 0.0) {\n        float normalCount = gap / filterArea.x;\n        delta = (normalCount - delta) / normalCount;\n        countLimit *= delta;\n        strength *= delta;\n        if (countLimit < 1.0)\n        {\n            gl_FragColor = texture2D(uSampler, vTextureCoord);\n            return;\n        }\n    }\n\n    // randomize the lookup values to hide the fixed number of samples\n    float offset = random(vec3(12.9898, 78.233, 151.7182), 0.0);\n\n    float total = 0.0;\n    vec4 color = vec4(0.0);\n\n    dir *= strength;\n\n    for (float t = 0.0; t < MAX_KERNEL_SIZE; t++) {\n        float percent = (t + offset) / MAX_KERNEL_SIZE;\n        float weight = 4.0 * (percent - percent * percent);\n        vec2 p = vTextureCoord + dir * percent;\n        vec4 sample = texture2D(uSampler, p);\n\n        // switch to pre-multiplied alpha to correctly blur transparent images\n        // sample.rgb *= sample.a;\n\n        color += sample * weight;\n        total += weight;\n\n        if (t > countLimit){\n            break;\n        }\n    }\n\n    gl_FragColor = color / total;\n\n    // switch back from pre-multiplied alpha\n    gl_FragColor.rgb /= gl_FragColor.a + 0.00001;\n\n}\n",Ke=function(e){function t(t,n,r,o){void 0===t&&(t=.1),void 0===n&&(n=[0,0]),void 0===r&&(r=0),void 0===o&&(o=-1),e.call(this,Xe,Ne),this.center=n,this.strength=t,this.innerRadius=r,this.radius=o}e&&(t.__proto__=e),t.prototype=Object.create(e&&e.prototype),t.prototype.constructor=t;var n={center:{configurable:!0},strength:{configurable:!0},innerRadius:{configurable:!0},radius:{configurable:!0}};return n.center.get=function(){return this.uniforms.uCenter},n.center.set=function(e){this.uniforms.uCenter=e},n.strength.get=function(){return this.uniforms.uStrength},n.strength.set=function(e){this.uniforms.uStrength=e},n.innerRadius.get=function(){return this.uniforms.uInnerRadius},n.innerRadius.set=function(e){this.uniforms.uInnerRadius=e},n.radius.get=function(){return this.uniforms.uRadius},n.radius.set=function(e){(e<0||e===1/0)&&(e=-1),this.uniforms.uRadius=e},Object.defineProperties(t.prototype,n),t}(t.Filter);return e.AdjustmentFilter=o,e.AdvancedBloomFilter=d,e.AsciiFilter=h,e.BloomFilter=b,e.BulgePinchFilter=S,e.ColorReplaceFilter=A,e.ConvolutionFilter=D,e.CrossHatchFilter=P,e.CRTFilter=j,e.DotFilter=E,e.DropShadowFilter=N,e.EmbossFilter=G,e.GlitchFilter=Z,e.GlowFilter=V,e.GodrayFilter=ee,e.KawaseBlurFilter=s,e.MotionBlurFilter=re,e.MultiColorReplaceFilter=le,e.OldFilmFilter=ue,e.OutlineFilter=de,e.PixelateFilter=he,e.RadialBlurFilter=xe,e.ReflectionFilter=_e,e.RGBSplitFilter=Fe,e.ShockwaveFilter=Te,e.SimpleLightmapFilter=Oe,e.TiltShiftFilter=Ie,e.TiltShiftAxisFilter=Me,e.TiltShiftXFilter=Le,e.TiltShiftYFilter=je,e.TwistFilter=Be,e.ZoomBlurFilter=Ke,e}({},PIXI);Object.assign(PIXI.filters,this.__filters);

// Panda 2 code

game.webgl = PIXI.utils.isWebGLSupported();
game.filters = PIXI.filters;
game.mesh = PIXI.mesh;
game.merge(game.filters, __filters);

game.Renderer.inject({
    init: function(width, height) {
        this.super(width, height);

        if (!game.webgl) return;

        var options = { view: this.canvas, preserveDrawingBuffer: true };
        game.merge(options, game.config.pixi);
        game.merge(options, game.config.renderer);
        if (!game.Debug || game.Debug && !game.Debug.enabled) PIXI.utils.skipHello();
        this.pixi = new PIXI.WebGLRenderer(width, height, options);
        this.context = this.pixi.gl;
    },

    _initContext: function() {
        if (game.webgl) {
            this.context = {};
            return;
        }
        this.super();
    },

    _render: function(container) {
        if (game.webgl) {
            var bgColor = game.scene.backgroundColor;
            if (this.pixi._backgroundColor !== bgColor) {
                var newColor = bgColor.replace('#', '0x');
                if (newColor.length === 5) newColor += newColor.substr(newColor.length - 3); // Allows to use short '#222'
                this.pixi._backgroundColor = bgColor; // Cache bgColor so it's updated only when changed
                this.pixi.backgroundColor = newColor;
            }

            this.pixi.render(container);
        }
        else {
            this.super(container);
        }
    },

    _resize: function(width, height) {
        if (game.webgl && this.pixi) this.pixi.resize(width, height);
        else this.super(width, height);
    }
});

game.Matrix.inject({
    toArray: function(transpose, out) {
        if (!this.array) this.array = new Float32Array(9);

        var array = out || this.array;

        if (transpose) {
            array[0] = this.a;
            array[1] = this.b;
            array[2] = 0;
            array[3] = this.c;
            array[4] = this.d;
            array[5] = 0;
            array[6] = this.tx;
            array[7] = this.ty;
            array[8] = 1;
        }
        else {
            array[0] = this.a;
            array[1] = this.c;
            array[2] = this.tx;
            array[3] = this.b;
            array[4] = this.d;
            array[5] = this.ty;
            array[6] = 0;
            array[7] = 0;
            array[8] = 1;
        }

        return array;
    },

    copy: function(matrix) {
        matrix.a = this.a;
        matrix.b = this.b;
        matrix.c = this.c;
        matrix.d = this.d;
        matrix.tx = this.tx;
        matrix.ty = this.ty;

        return matrix;
    }
});

if (game.Debug) {
    game.Debug.inject({
        _drawFakeTouch: function() {
            // TODO
        },

        _drawHitArea: function() {
            // TODO
        },
        
        _updatePanel: function() {
            this.super();
            this.addText('WEBGL', game.webgl);
            this.panel.innerHTML = this.text;
        }
    });
}

});
