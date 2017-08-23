function setBackground(imageType, imageBinaryCode) {
	document.querySelector('.photo_uploader label').style.visibility = 'hidden';
	var base64Image = 'data:' + imageType + ';base64,' + btoa(imageBinaryCode);

	//document.querySelector('.photo_uploader').style.backgroundImage = 'url(' + base64Image +')';
	var blobImg = document.createElement('img');
	var photoUploader = document.querySelector('.photo_uploader');
	blobImg.src = base64Image;
	photoUploader.appendChild(blobImg);
	blobImg.addEventListener('load', function(){
		blobImg.offsetWidth = 'auto';
		blobImg.offsetHeight = 'auto';
		console.log('width', blobImg.offsetWidth, 'height', blobImg.offsetHeight);
		console.log(403.88/280.34, blobImg.offsetHeight/blobImg.offsetWidth);
		if (blobImg.offsetHeight/blobImg.offsetWidth <= 403.88/280.34) {
			photoUploader.className = 'photo_uploader horizontal_loaded'
			blobImg.style.marginLeft = '-' + blobImg.offsetWidth/2 + 'px';
			blobImg.style.left = '50%';
		}
		else {
			photoUploader.className = 'photo_uploader vertical_loaded'
			blobImg.style.marginTop = '-' + blobImg.offsetHeight/2 + 'px';
			blobImg.style.top = '50%';
		}
	})
}
function handleFileSelect(evt) {
	dropZone.classList.remove('dragover');
	evt.stopPropagation();
	evt.preventDefault();
	var files = evt.dataTransfer.files;
	var file = files[0];
	var start = 0;
	var stop = file.size - 1;
	var reader = new FileReader();
	reader.onloadend = function(evt) {
		console.log('load end');
		if (evt.target.readyState == FileReader.DONE) { // DONE == 2
			setBackground(file.type, evt.target.result);
		}
	};
	var blob = file.slice(start, stop + 1);
	reader.readAsBinaryString(blob);
}
function handleDragOver(evt) {
	evt.stopPropagation();
	evt.preventDefault();
	evt.dataTransfer.dropEffect = 'copy';
	dropZone.classList.add('dragover');
	document.querySelector('.photo_uploader label').style.visibility = 'hidden';
}
function handleDragLeave(evt) {
	dropZone.classList.remove('dragover');
}
function renderCanvas() {
	var textPlaceHolder = document.querySelector('.text.bottom_text.text_input');
	document.querySelector('.svg_spinner').className = 'svg_spinner show';
	var placeholderTextSpan = document.createElement('span');
	placeholderTextSpan.textContent = textPlaceHolder.textContent;
	textPlaceHolder.textContent = '';
	textPlaceHolder.appendChild(placeholderTextSpan);

	document.getElementById('textWidth').value = placeholderTextSpan.offsetWidth;

	console.log('width', placeholderTextSpan.offsetWidth);
	setTimeout(function(){document.querySelector('form').submit()}, 5000);
}

(function stylizeFileInput() {
	var input = document.getElementById('image');
	var label  = document.getElementById('labelForFile');
	var labelVal = document.getElementById('labelForFile').innerHTML;

	input.addEventListener('change', function(evt) {
		console.log(evt.target.files[0]);
		var file = evt.target.files[0];
		var start = 0;
		var stop = file.size - 1;

		var reader = new FileReader();
		reader.onloadend = function(evt) {
			console.log('load end');
			if (evt.target.readyState == FileReader.DONE) { // DONE == 2
				setBackground(file.type, evt.target.result);
			}
		};
		var blob = file.slice(start, stop + 1);
		reader.readAsBinaryString(blob);

	});
})();

var render = document.getElementById('render');
var dropZone = document.getElementById('drop_zone');
//dropZone.addEventListener('dragover', handleDragOver, false);
//dropZone.addEventListener('dragleave', handleDragLeave, false);
//dropZone.addEventListener('drop', handleFileSelect, false);
render.addEventListener('click', renderCanvas);