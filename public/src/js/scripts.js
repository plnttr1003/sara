function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
function init() {
	var locales = ['rus', 'eng'];
	document.body.className = locales[getRandomInt(0, 2)];
	changeBodyClass();
	setInterval(changeBodyClass, 5000);
}
function changeBodyClass() {
	if (document.body.className.indexOf('rus') !== -1) {
		document.body.className = 'eng'
		document.querySelector('input.text.bottom_text.text_input').value = 'PUT YOUR TEXT HERE';
		document.querySelector('input.save').value = 'SAVE';
	}
	else if (document.body.className.indexOf('eng') !== -1) {
		document.body.className = 'rus'
		document.querySelector('input.text.bottom_text.text_input').value = 'ЧТО ДУМАЕТЕ ОБ ЭТОМ?';
		document.querySelector('input.save').value = 'СОХРАНИТЬ';
	}
}
(function ready(fn) {
	if (document.readyState != 'loading'){
		fn();
	} else {
		document.addEventListener('DOMContentLoaded', fn);
	}
})(init)