'use strict';

var LinkModel = require('../models').Link;

exports.index = function(req, res) {
	LinkModel.find({}, {}, { sort: { timestamp: 1 }})
	// .populate('category')
	.exec(function(err, data) {
		if (err) {
			res.json(500, {msg: 'Error getting links.', err: err});
		}
		else {
			res.json(data);
		}
	});
};

exports.findById = function(req, res) {
	LinkModel.findById(req.params.id)
	// .populate('category')
	.exec(function(err, data) {
		if (err) {
			res.json(500, {msg: 'Error getting Link.', err: err});
		}
		else {
			res.json(data);
		}
	});
};

exports.update = function(req, res) {
	LinkModel.findById(req.params.id)
	.exec(function(err, data) {
		if (err) {
			res.json(500, {msg: 'Error getting link.', err: err});
		}
		else {
			if (req.body.hasOwnProperty('url')) {
				data.url = req.body.url;
			}
			if (req.body.hasOwnProperty('title')) {
				data.title = req.body.title;
			}
			if (req.body.hasOwnProperty('category')) {
				data.category = req.body.category;
			}
			data.save(function(err) {
				if (err) {
					res.json(500, {msg: 'Error updating link.', err: err});
				}
				else {
          res.json({ message: 'link updated!' });
        }
			});

		}
	});
};

exports.delete = function(req, res) {
	LinkModel.remove({ _id: req.params.id })
	.exec(function(err, data) {
		if (err) {
			res.json(500, {msg: 'Error deleting link.', err: err});
		}
		else {
			res.json({ message: 'link deleted!' });
		}
	});
};


exports.create = function(req, res) {
	var newLink = new LinkModel({
		url: req.body.url,
		title: req.body.title,
		category: req.body.category
	})
	newLink.save(function(err) {
		if (err){
			res.json(500, {msg: 'Error createing new link.', err: err});
		} else {
			res.json(newLink);
		}
	});
};