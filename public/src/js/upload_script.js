function setBackground(imageType, imageBinaryCode) {
	document.querySelector('.photo_uploader label').style.visibility = 'hidden';
	var base64Image = 'data:' + imageType + ';base64,' + btoa(imageBinaryCode);

	document.querySelector('.photo_uploader').style.backgroundImage = 'url(' + base64Image +')';
	//base64Image;
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
	html2canvas(document.querySelector('.photo_container'), {
	onrendered: function(canvas) {
		document.body.appendChild(canvas);
		//console.log(canvas.toDataURL());
		var imageData = canvas.toDataURL("image/png");
		document.getElementById('imageContent').value = imageData;
		document.querySelector('form').submit();
	},
	width: 508,
	height: 731
});
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