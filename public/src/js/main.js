function loadNewItems(skip, limit, elem) {
	var requestURL = '/p';
	var params='skip='+ skip +'&limit='+ limit;
	var request = new XMLHttpRequest();

	request.open("POST", requestURL, true);
	request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	request.send(params);
	request.onload = function(e) {
		if (request.status === 200) {
			if (request.responseText != 'out') {
				elem.insertAdjacentHTML('beforeend', request.responseText);
			}
		}
	}
	//console.log('skip', skip, 'limit', limit);
}


function init() {
	var contentBlock = document.querySelector('.content_block');
	var scrollCheck = document.querySelector('.scroll_check');
	var body = document.body;
	var skip = 12;
	var lastStartLoadedItem = document.querySelector('.promo_block:nth-child(16)');
	document.addEventListener('scroll', function() {
		if (scrollCheck.offsetTop < (body.scrollTop + body.offsetHeight + 100)) {
			skip = skip + 3;
			loadNewItems(skip, 3, contentBlock);
		}
	})
}
(function ready(fn) {
	if (document.readyState != 'loading'){
		fn();
	} else {
		document.addEventListener('DOMContentLoaded', fn);
	}
})(init)