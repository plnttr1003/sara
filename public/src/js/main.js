function loadNewItems(skip, limit, elem) {
		var
			requestURL = '/promo',
			params='skip='+ skip +'&limit='+ limit,
			request = new XMLHttpRequest();

		request.open("POST", requestURL, true);
		request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
		request.send(params);
		request.onload = function(e) {
			if (request.status === 200) {
				console.log('====', request.responseText);
				if (request.responseText != 'out') {
					elem.insertAdjacentHTML('beforeend', request.responseText);
				}
			}
		}
}


function init() {
	console.log('== == == ||| *** ||| == == ==')
	var contentBlock = document.querySelector('.content_block');
	var scrollCheck = document.querySelector('.scroll_check');
	var body = document.body;
	var skip = 15;
	console.log('scrollCheck', scrollCheck);
	console.log('height', document.body.offsetHeight);
	document.addEventListener('scroll', function() {
		console.log('offsetTop:', scrollCheck.offsetTop, 'scrollTop', body.scrollTop + body.offsetHeight);
		if (scrollCheck.offsetTop < (body.scrollTop + body.offsetHeight + 100)) {
			skip = skip + 15;
			loadNewItems(skip, 15, contentBlock);
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

