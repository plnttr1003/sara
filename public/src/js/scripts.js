var inputTextPlaceHolder = document.querySelector('input.text.bottom_text.text_input');
var textPlaceHolder = document.querySelector('div.text.bottom_text.text_input');
var textInput = document.getElementById('text_input');
var submitButton = document.getElementById('submit');
var textValue = ['PUT YOUR TEXT HERE', 'МЕСТО ДЛЯ ТЕКСТА'];
var textContent;

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
function init() {
	var hash = window.location.hash.replace('#', '');
	var locales = ['rus', 'eng'];
	var locale;
	if (hash === 'rus') {
		locale = 'eng';
	}
	else if (hash === 'eng') {
		locale = 'rus';
	}
	else {
		locale = locales[getRandomInt(0, 2)];
	}
	var initLang = initLang2 ? initLang2 : null;
	if (!initLang) {
		document.body.className = locale;
		changeBodyClass();
		var localeInterval = setInterval(changeBodyClass, 5000);
	}
	else {
		document.body.className = initLang;
		if (!inputTextPlaceHolder.value) {
			inputTextPlaceHolder.setAttribute('placeholder', initLang === 'eng' ? textValue[0] : textValue[1]);
		}
	}
	var clearedTextInput = false;

	inputTextPlaceHolder.addEventListener('focus', function() {
		clearInterval(localeInterval);
		submitButton.className = 'save item add_image visible_button';
		inputTextPlaceHolder.setAttribute('placeholder', '');
		textPlaceHolder.textContent = '';
	});

	inputTextPlaceHolder.addEventListener('blur', function() {
		if (this.value === '' || this.value === ' ') {
			textPlaceHolder.textContent = textContent;
			inputTextPlaceHolder.setAttribute('placeholder', locale === 'eng' ? textValue[0] : textValue[1]);
		}
		else {
			textPlaceHolder.textContent = this.value;
		}
	});
	inputTextPlaceHolder.addEventListener('keyup', function() {
		textPlaceHolder.textContent = this.value;
	});

	document.getElementById('image').addEventListener('focus', function() {
		clearInterval(localeInterval);
		submitButton.className = 'save item add_image visible_button';
	});

	submitButton.addEventListener('click', function() {
		clearInterval(localeInterval);
	});
}


function changeBodyClass() {
	if (document.body.className.indexOf('rus') !== -1) {
		document.body.className = 'eng';
		inputTextPlaceHolder.setAttribute('placeholder', textValue[0]);
		textContent = textValue[0];
	}
	else if (document.body.className.indexOf('eng') !== -1) {
		document.body.className = 'rus';
		inputTextPlaceHolder.setAttribute('placeholder', textValue[1]);
		textContent = textValue[1];
	}
}
(function ready(fn) {
	if (document.readyState != 'loading'){
		fn();
	} else {
		document.addEventListener('DOMContentLoaded', fn);
	}
})(init)