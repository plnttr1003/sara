var textPlaceHolder = document.querySelector('.text.bottom_text.text_input');
var textInput = document.getElementById('text_input');
var submitButton = document.getElementById('submit');

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
function init() {
	console.log('** ** HASH ** **', window.location.hash);
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
	}
	var clearedTextInput = false;
	var textContent;
	textPlaceHolder.addEventListener('focus', function() {
		clearInterval(localeInterval);
		this.style.textDecoration = 'none';
		textContent = this.textContent;
		if (this.textContent === 'PUT YOUR TEXT HERE' || this.textContent === 'МЕСТО ДЛЯ ТЕКСТА') {
			clearedTextInput = true;
			this.textContent = '';
		}
		document.getElementById('lang').value = document.body.className;
		submitButton.className = 'save item add_image visible_button';
	});

	textPlaceHolder.addEventListener('blur', function() {
		console.log('vlur');
		if (this.textContent === '' || this.textContent === ' ') {
			this.textContent = textContent;
		}
		console.log('this.textContent', this.textContent);
		textInput.value = (this.textContent !== 'PUT YOUR TEXT HERE' && this.textContent !== 'МЕСТО ДЛЯ ТЕКСТА') ? this.textContent : '';
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
		document.body.className = 'eng'
		textPlaceHolder.textContent = 'PUT YOUR TEXT HERE';
		textInput.value = '';
	}
	else if (document.body.className.indexOf('eng') !== -1) {
		document.body.className = 'rus'
		textPlaceHolder.textContent = 'МЕСТО ДЛЯ ТЕКСТА';
		textInput.value = '';
	}
}
(function ready(fn) {
	if (document.readyState != 'loading'){
		fn();
	} else {
		document.addEventListener('DOMContentLoaded', fn);
	}
})(init)