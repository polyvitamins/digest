(function(m, o, r, u, l, u, s) {
    var extend = function() {
        var hasOwn = Object.prototype.hasOwnProperty;
        var toStr = Object.prototype.toString;
        var isArray = function isArray(arr) {
            if (typeof Array.isArray === "function") {
                return Array.isArray(arr);
            }
            return toStr.call(arr) === "[object Array]";
        };
        var isPlainObject = function isPlainObject(obj) {
            "use strict";
            if (!obj || toStr.call(obj) !== "[object Object]") {
                return false;
            }
            var has_own_constructor = hasOwn.call(obj, "constructor");
            var has_is_property_of_method = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, "isPrototypeOf");
            if (obj.constructor && !has_own_constructor && !has_is_property_of_method) {
                return false;
            }
            var key;
            for (key in obj) {}
            return typeof key === "undefined" || hasOwn.call(obj, key);
        };
        return function extend() {
            "use strict";
            var options, name, src, copy, copyIsArray, clone, target = arguments[0], i = 1, length = arguments.length, deep = false;
            if (typeof target === "boolean") {
                deep = target;
                target = arguments[1] || {};
                i = 2;
            } else if (typeof target !== "object" && typeof target !== "function" || target == null) {
                target = {};
            }
            for (;i < length; ++i) {
                options = arguments[i];
                if (options != null) {
                    for (name in options) {
                        src = target[name];
                        copy = options[name];
                        if (target !== copy) {
                            if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
                                if (copyIsArray) {
                                    copyIsArray = false;
                                    clone = src && isArray(src) ? src : [];
                                } else {
                                    clone = src && isPlainObject(src) ? src : {};
                                }
                                if (copy.constructor.name !== "Ref") target[name] = extend(deep, clone, copy);
                            } else if (typeof copy !== "undefined") {
                                target[name] = copy;
                            }
                        }
                    }
                }
            }
            return target;
        };
    }();
    var compareobjects = function() {
        return function(newly, oldy) {
            if ("object" !== typeof newly || "object" !== typeof oldy) throw "You can not compare not objects as objects";
            if (JSON.stringify(newly) === JSON.stringify(oldy)) return {};
            var diff = {};
            for (var prop in newly) {
                if (newly.hasOwnProperty(prop)) {
                    if ("object" === typeof newly[prop]) {
                        if ("object" !== typeof oldy[prop]) {
                            diff[prop] = newly[prop];
                        } else {
                            if (JSON.stringify(newly[prop]) !== JSON.stringify(oldy[prop])) diff[prop] = newly[prop];
                        }
                    } else {
                        if (newly[prop] !== oldy[prop]) {
                            diff[prop] = newly[prop];
                        }
                    }
                }
            }
            return diff;
        };
    }();
    (function(extend, compareObjects) {
        var Digest = function() {
            this.$$watchers = [];
            this.$$digestRequired = false;
            this.$$digestInProgress = false;
            this.$$digestInterationCount = 0;
        };
        Digest.prototype = {
            constructor: Digest,
            $watch: function(expr, fn) {
                var watcher = {
                    expr: expr,
                    listner: fn || false,
                    last: extend(true, {}, expr(this))
                };
                this.$$watchers.push(watcher);
                var index = this.$$watchers.length - 1, watchers = this.$$watchers;
                watcher.destroy = function() {
                    watchers[index] = null;
                };
                return watcher;
            },
            $apply: function(exprFn) {
                exprFn.call(this);
                this.$digest();
            },
            $digest: function() {
                if (this.$$digestInProgress) {
                    this.$$digestRequired = true;
                    return;
                }
                this.$$digestInProgress = true;
                this.$$watchers.forEach(function(watch) {
                    if (watch === null) return;
                    var newly = watch.expr(this);
                    var diff = compareObjects(newly, watch.last);
                    if (diff.$$hashKey) delete diff.$$hashKey;
                    if (JSON.stringify(diff) !== "{}") {
                        watch.listner(newly, watch.last, diff);
                        watch.last = extend(true, {}, newly);
                    }
                }, this);
                if (this.$$digestRequired) {
                    this.$$digestInterationCount++;
                    if (this.$digestInterationCount > 5) {
                        throw "Digest max interation count";
                    }
                    this.$digest();
                } else {
                    this.$$digestInterationCount = 0;
                    this.$$digestInProgress = false;
                }
            },
            $approve: function() {
                this.$$watchers.forEach(function(watch) {
                    if (watch === null) return;
                    var newly = watch.expr(this);
                    var diff = compareObjects(newly, watch.last);
                    if (diff.$$hashKey) delete diff.$$hashKey;
                    if (JSON.stringify(diff) !== "{}") {
                        watch.last = sx.utils.extend(true, {}, newly);
                    }
                });
            }
        };
    })(extend, compareobjects);
})();