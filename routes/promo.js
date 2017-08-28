var jade = require('jade');
var path = require('path');
var __appdir = path.dirname(require.main.filename);

var Promo = require('../models/main.js').Promo;

exports.index = function(req, res) {
	Promo.where('title').where('status').ne('hidden').limit(12).sort('-date').exec(function(err, promo) {
		res.render('promo', {promo: promo});
	});
}

exports.promo = function(req, res) {
	var id = req.params.id;
	Promo.findById(id).exec(function(err, promo) {
		res.render('promo/promo.jade', {promo: promo});
	});
}

/*exports.get_promo = function(req, res) {
	var post = req.body;
	Promo.where('title').sort('-date').skip(post.skip).limit(post.limit).exec(function(err, promo) {
		console.log('++ promo ++', promo);
		if (promo && promo.length > 0) {
			console.log('Promo.length', promo.length);
			res.send(jade.renderFile(__appdir + '/views/promo/get_promo.jade', {promo: promo}));
		} else {
			res.send('***' + Promo + '***' + 'out' + ' || ' +  promo + 'SKIP: ' +  post.skip + 'LIMIT: ' + post.limit);
		}
	});
}*/

exports.get_promo = function(req, res) {
	Promo.where('title').where('status').ne('hidden').skip(12).limit(12).sort('-date').exec(function(err, promo) {
		//res.render('promo', {promo: promo});
		res.send(jade.renderFile(__appdir + '/views/promo/get_promo.jade', {promo: promo}));
		//res.send('skip: ' + req.body.skip + 'limit: ' + req.body.skip);
	});
}