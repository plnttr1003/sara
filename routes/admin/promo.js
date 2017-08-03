var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var del = require('del');
var async = require('async');
var gm = require('gm');
//var gm = require('gm').subClass({imageMagick: true});
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

exports.add_form = function(req, res, next) {

	var post = req.body;
	var files = req.files;

	var promo = new Promo();
	promo.title = post.title;
	promo.textWidth = post.textWidth;
	promo.lang = post.lang;

	if (!files.image) {
		return (function () {
			promo.save(function(err, team) {
				res.redirect('/i/' + promo._id);
			});
		})();
	}

	var newPath = __appdir + '/public/images/promo/' + promo._id;
	var framePath = __appdir + (promo.lang === 'rus' ? '/public/images/frame_ru.png' : '/public/images/frame_en.png');

	var fontName = __appdir + '/public/fonts/Formular-Medium.ttf';
	mkdirp(__appdir + '/public/images/promo/' + promo._id, function() {
		gm(files.image.path).orientation(function(err, orient) {
			gm(files.image.path).size(function(err, size) {
				if (err) return next(err);
						console.log('orientation ', orient);
						var vertical = (orient === 'RightTop' || orient === 'LeftBottom');
						console.log('vertical ', vertical);
						gm(files.image.path).autoOrient().quality(100)
							.resize(((403.88/280.34 >= size.height/size.width) && !vertical) ? (size.width * (405 / size.height)) : 282)
							.crop(282, 405, ((403.88/280.34 >= size.height/size.width) && !vertical) ? ((size.width * (405 / size.height)) - 282) / 2 : 0,  ((403.88/280.34 >= size.height/size.width) && !vertical) ? 0 : ((size.height * (282 / size.width)) - 405) / 2)
							.write(newPath + '/logoTemp.jpg', function(err) { // crop 282x405
								if (err) return next(err);

								gm(framePath).quality(100)
									.font(fontName, 20)
									.drawText((508 - promo.textWidth) / 2, 662, promo.title)
									.write(newPath + '/frameText.jpg', function(err) {

									gm(newPath + '/frameText.jpg').quality(100)
										.command('composite')
										.gravity('Center')
										.in(newPath + '/logoTemp.jpg')
										.write(newPath + '/s.jpg', function(err) { // crop 282x405
											if (err) return next(err);



												gm(files.image.path).autoOrient().resize(800, false).write(newPath + '/original.jpg', function(err) {
														if (err) return next(err);

													gm(files.image.path).autoOrient().resize(400, false).write(newPath + '/thumb.jpg', function(err) {
															if (err) return next(err);

																promo.path.original = '/images/promo/' + promo._id + '/original.jpg';
																promo.path.thumb = '/images/promo/' + promo._id + '/thumb.jpg';
																promo.path.share = 'images/promo/' + promo._id + '/s.jpg'
																//del([newPath + '/logoTemp.jpg', newPath + '/frameText.jpg', files.image.path]);
																promo.save(function() {
																	rimraf(files.image.path, function() {
																		res.redirect('/i/' + promo._id);
															});
														});

													});
												});

										})
								})
						});

			});
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