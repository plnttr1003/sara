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




function save_image(promo, files, newPath, framePath, fontName, res, req) {
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
																promo.path.share = 'images/promo/' + promo._id + '/s.jpg';
																promo.path.original = '/images/promo/' + promo._id + '/original.jpg';
																promo.path.thumb = '/images/promo/' + promo._id + '/thumb.jpg';
																del([newPath + '/logoTemp.jpg', newPath + '/frameText.jpg', files.image.path]);
																console.log(promo._id, true);
																res.cookie('_co' + promo._id, true);
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
			promo.save(function(err) {
				res.redirect('/i/' + promo._id);
			});
		})();
	}

	var newPath = __appdir + '/public/images/promo/' + promo._id;
	var framePath = __appdir + (promo.lang === 'rus' ? '/public/images/frame_ru.png' : '/public/images/frame_en.png');

	var fontName = __appdir + '/public/fonts/Formular-Medium.ttf';

	save_image(promo, files, newPath, framePath, fontName, res, req);

}


// ------------------------
// *** Edit promo Block ***
// ------------------------


exports.edit = function(req, res) {
	console.log('=== === EDIT === ===');
	var id = req.params.id;
	var cookieName = '_co' + id;
	console.log('id ', id);
	var cookie = req.cookies.cookieName;
	console.log('cookie ', cookie);

	console.log(req.params.id);
	Promo.findById(id).exec(
		function(err, promo) {
				res.render('auth/promo/add.jade', {
					promo: promo
				});
		});

		console.log('BODY', req.body);
	}


exports.edit_form = function(req, res) {
	var id = req.params.id;
	var post = req.body;
	var files = req.files;
	console.log('post', post);

	Promo.findById(id).exec(function(err, promo) {
		promo.title = post.title;
		console.log(post.title);
		//team.phone = post.phone;
		//team.num = post.num;

		if (!files.image) {
			return (function () {
				promo.save(function(err, promo) {
					res.redirect('back');
				});
			})();
		}

		/*fs.mkdir(__appdir + '/public/images/teams/' + team._id, function() {
			var newPath = __appdir + '/public/images/teams/' + team._id;;
			gm(files.image.path).resize(1200, false).write(newPath + '/original.jpg', function() {
				gm(files.image.path).resize(400, false).write(newPath + '/thumb.jpg', function() {
					team.path.original = '/images/teams/' + team._id + '/logo.jpg';
					team.path.thumb = '/images/teams/' + team._id + '/thumb.jpg';
					team.save(function() {
						res.redirect('/auth/teams');
					});
				});
			});
		});*/

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