function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
function init() {
	var locales = ['rus', 'eng'];
	var locale = locales[getRandomInt(0, 2)]
	document.body.className = locale;
	changeBodyClass();
	var localeInterval = setInterval(changeBodyClass, 5000);

	document.querySelector('.text.bottom_text.text_input').addEventListener('focus', function() {
		clearInterval(localeInterval);
		this.setAttribute('placeholder', this.value);
		this.style.textDecoration = 'none';
		this.value = '';
		document.getElementById('lang').value = document.body.className;
		console.log('locale form', document.getElementById('lang'));
	})
}

function changeBodyClass() {
	if (document.body.className.indexOf('rus') !== -1) {
		document.body.className = 'eng'
		document.querySelector('input.text.bottom_text.text_input').value = 'PUT YOUR TEXT HERE';
	}
	else if (document.body.className.indexOf('eng') !== -1) {
		document.body.className = 'rus'
		document.querySelector('input.text.bottom_text.text_input').value = 'ЧТО ДУМАЕТЕ ОБ ЭТОМ?';
	}
}
(function ready(fn) {
	if (document.readyState != 'loading'){
		fn();
	} else {
		document.addEventListener('DOMContentLoaded', fn);
	}
})(init)