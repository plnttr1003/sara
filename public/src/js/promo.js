function init() {
	var timestampKey = timestamp;
	var storage = window.localStorage;
	console.log(timestampKey, storage, storage[timestampKey]);
	if (storage[timestampKey] === 'true' || storage[timestampKey]) document.querySelector('.edit').style.display = 'block';
}
(function ready(fn) {
	if (document.readyState != 'loading'){
		fn();
	} else {
		document.addEventListener('DOMContentLoaded', fn);
	}
})(init)