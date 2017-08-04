function init() {
	var cookieName = document.querySelector('.photo_container').dataset.id;
	console.log(cookieName);
	console.log(getCookie(cookieName));
	if (getCookie(cookieName)) document.querySelector('.edit').style.display = 'block';
}
function getCookie(name) {
  var matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}
(function ready(fn) {
	if (document.readyState != 'loading'){
		fn();
	} else {
		document.addEventListener('DOMContentLoaded', fn);
	}
})(init)