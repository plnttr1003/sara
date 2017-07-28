var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');
var del = require('del');
var async = require('async');
var gm = require('gm').subClass({ imageMagick: true });
var del = require('del');

var Promo = require('../../models/main.js').Promo;

var __appdir = path.dirname(require.main.filename);

// ------------------------
// *** Handlers Block ***
// ------------------------

var checkNested = function (obj, layers) {

	if (typeof layers == 'string') {layers = layers.split('.');}

	for (var i = 0; i < layers.length; i++) {
		if (!obj || !obj.hasOwnProperty(layers[i])) {return false;}
		obj = obj[layers[i]];
	}
	return true;
}

// ------------------------
// *** Admin promo Block ***
// ------------------------

exports.list = function(req, res) {
	Promo.find().sort('-date').exec(function(err, promo) {
		res.render('auth/promo/', {promo: promo});
	});
}

// ------------------------
// *** Add promo Block ***
// ------------------------

exports.add = function(req, res) {
	res.render('auth/promo/add.jade');
}

exports.add_form = function(req, res) {

	var post = req.body;
	var files = req.files;

	var promo = new Promo();
	promo.title = post.title;
	promo.imageContent = post.imageContent;
	promo.lang = post.lang;

	if (!files.image) {
		return (function () {
			promo.save(function(err, team) {
				res.redirect('/i/' + promo._id + '#s');
			});
		})();
	}


	console.log('__appdir', __appdir);
	console.log('files.path', files.image.path);
	console.log('files', files);


	console.log(gm());

	mkdirp(__appdir + '/public/images/promo/' + promo._id, function() {
		var newPath = __appdir + '/public/images/promo/' + promo._id;

		var originalStream = fs.createWriteStream(newPath + '/original.jpg');
		var thumbStream = fs.createWriteStream(newPath + '/thumb.jpg');

		gm(files.image.path).resize(800, false).stream().pipe(originalStream);
		gm(files.image.path).resize(400, false).stream().pipe(thumbStream);

		promo.path.original = '/images/promo/' + promo._id + '/original.jpg';
		promo.path.thumb = '/images/promo/' + promo._id + '/thumb.jpg';

		promo.save(function() {
			res.redirect('/i/' + promo._id + '#s');
		});

	});
}


// ------------------------
// *** Edit promo Block ***
// ------------------------


exports.edit = function(req, res) {

	var id = req.params.id;
	console.log(req.params.id);
	Promo.findById(id).exec(
		function(err, promo) {
				async.forEach(promo.container, function(container, callback) {
					callback();
				}, function() {
					res.render('auth/promo/add.jade', {
						promo: promo,
						containerOutput: JSON.stringify(promo.container)
					});
				});
		});
	}


exports.edit_form = function(req, res) {
	var post = req.body;
	var id = req.params.id;
	var promoObjects = post;

	var promo = new Promo();
	promo.title = promoObjects['title'],
	promo.imageContent = promoObjects['imageContent'];
	promo.lang = promoObjects['lang'];


	promo.save(function() {
		res.redirect('/auth/promo');
	});
}


// ------------------------
// *** Remove promo Block ***
// ------------------------


exports.remove = function(req, res) {
	var id = req.body.id;
	console.log('-----------');
	console.log(req.body);
	Promo.findByIdAndRemove(id, function() {
		del.sync(__appdir + '/public/images/promo/' + id);
		res.send('ok');
	});
}