var textPlaceHolder = document.querySelector('.text.bottom_text.text_input');
var textInput = document.getElementById('text_input');


function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
function init() {
	console.log('initLang', initLang2);
	var locales = ['rus', 'eng'];
	var locale = locales[getRandomInt(0, 2)];
	//console.log('initLang', initLang);
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
	textPlaceHolder.addEventListener('focus', function() {
		clearInterval(localeInterval);
		this.style.textDecoration = 'none';
		if (!clearedTextInput) {
			this.textContent = '';
			clearedTextInput = true;
		}
		document.getElementById('lang').value = document.body.className;
	});

	textPlaceHolder.addEventListener('blur', function() {
		textInput.value = this.textContent;
	});


	document.getElementById('image').addEventListener('focus', function() {
		clearInterval(localeInterval);
	});

	document.getElementById('render').addEventListener('click', function() {
		clearInterval(localeInterval);
	});


}



function changeBodyClass() {
	if (document.body.className.indexOf('rus') !== -1) {
		document.body.className = 'eng'
		textPlaceHolder.textContent = 'PUT YOUR TEXT HERE';
		textInput.value = 'PUT YOUR TEXT HERE';
	}
	else if (document.body.className.indexOf('eng') !== -1) {
		document.body.className = 'rus'
		textPlaceHolder.textContent = 'ЧТО ДУМАЕТЕ ОБ ЭТОМ?';
		textInput.value = 'ЧТО ДУМАЕТЕ ОБ ЭТОМ?';
	}
}
(function ready(fn) {
	if (document.readyState != 'loading'){
		fn();
	} else {
		document.addEventListener('DOMContentLoaded', fn);
	}
})(init)