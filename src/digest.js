define([
	"polyvitamins~extend@master",
	"polyvitamins~compareObjects@master"
], function(extend, compareObjects) {
	var Digest = function() {
		this.$$watchers = [];
		this.$$digestRequired = false;
        this.$$digestInProgress = false;
        this.$$digestInterationCount=0;
	}

	Digest.prototype = {
		constructor: Digest,
		$watch: function(expr, fn) {
            var watcher = {
                expr: expr,
                listner: fn || false,
                last: extend(true, {}, expr(this))
            };

            this.$$watchers.push(watcher);
            var index = this.$$watchers.length-1, watchers=this.$$watchers;

            watcher.destroy = function() {
                watchers[index]=null;
            }

            return watcher;
        },
        $apply: function(exprFn) {
            exprFn.call(this);
            this.$digest();
        },
        $digest: function() {
            if (this.$$digestInProgress) { this.$$digestRequired = true; return }
            this.$$digestInProgress = true;
            
            this.$$watchers.forEach(function(watch) {
                if (watch===null) return;
                var newly = watch.expr(this);
                var diff = compareObjects(newly, watch.last);
                if (diff.$$hashKey) delete diff.$$hashKey; // Удаляем hashKey angular
                if (JSON.stringify(diff) !== '{}') {
                 watch.listner(newly, watch.last, diff);
                  watch.last = extend(true, {}, newly);
                }
                
            }, this);
            if (this.$$digestRequired) {
                this.$$digestInterationCount++;
                if (this.$digestInterationCount>5) {
                    throw 'Digest max interation count';
                }
                this.$digest();
            } else {
                this.$$digestInterationCount=0;
                this.$$digestInProgress = false;
            }
        },
        $approve: function() {
            this.$$watchers.forEach(function(watch) {
                if (watch===null) return;
                var newly = watch.expr(this);
                var diff = compareObjects(newly, watch.last);
                if (diff.$$hashKey) delete diff.$$hashKey; // Удаляем hashKey angular
                if (JSON.stringify(diff) !== '{}') {
                    watch.last = sx.utils.extend(true, {}, newly);
                }
            });
        },
	}
});