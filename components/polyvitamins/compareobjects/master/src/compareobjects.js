define(function() {
	return function(newly, oldy) {
    	/*
    	Вначае делаем проверностную проверку
    	*/
    	if ("object"!==typeof newly || "object"!==typeof oldy) throw 'You can not compare not objects as objects';
    	if ((JSON.stringify(newly)===JSON.stringify(oldy)) ) return {};

		var diff = {};
		for (var prop in newly) {
			if (newly.hasOwnProperty(prop)) {
				if ("object" === typeof newly[prop]) {
					if ("object" !== typeof oldy[prop]) {
						diff[prop] = newly[prop];
					}
					else {
						if (JSON.stringify(newly[prop])!==JSON.stringify(oldy[prop]))
						diff[prop] = newly[prop];
					}
				} else {
					if (newly[prop] !== oldy[prop]) {
						diff[prop] = newly[prop];
					}
				}
			}
		}
		return diff;
	}
});