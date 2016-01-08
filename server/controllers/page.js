'use strict';

var PageModel = require('../models').Page;
var CategoryModel = require('../models').Category;

exports.index = function(req, res) {
	PageModel.find({}, {}, { sort: { timestamp: 1 }})
	.exec(function(err, data) {
		if (err) {
			res.json(500, {msg: 'Error getting pages.', err: err});
		}
		else {
			if (!data){
				res.json(404, {msg: 'PageModel Not Found.'});
			} else {
				res.json(data);
			}
		}
	});
};

exports.findById = function(req, res) {
	PageModel.findById(req.params.id)
	.exec(function(err, data) {
		if (err) {
			res.json(500, {msg: 'Error getting page.', err: err});
		}
		else {
			res.json(data);
		}
	});
};

exports.update = function(req, res) {
	PageModel.findById(req.params.id)
	.exec(function(err, data) {
		if (err) {
			res.json(500, {msg: 'Error getting page.', err: err});
		}
		else {
			if (req.body.hasOwnProperty('title')) {
				data.title = req.body.title;
			}
			data.save(function(err) {
				if (err) {
					res.json(500, {msg: 'Error updating page.', err: err});
				}
				else {
          res.json({ message: 'page updated!' });
        }
			});

		}
	});
};

exports.delete = function(req, res) {
	CategoryModel.find({ page: req.params.id })
	.exec(function(err, data) {
		if (err) {
			res.json(500, {msg: 'Error deleting page.', err: err});
		}
		else if (data && data.length > 0) {
			res.json(500, {msg: 'Page not empty.'});
		}
		else {
			PageModel.remove({ _id: req.params.id })
			.exec(function(err1) {
				if (err1) {
					res.json(500, {msg: 'Error deleting page.', err: err1});
				}
				else {
					res.json({ message: 'page deleted!' });
				}
			});
		}
	});

};


exports.create = function(req, res) {
	var newPage = new PageModel({
		title: req.body.title
	})
	newPage.save(function(err) {
		if (err){
			res.json(500, {msg: 'Error createing new category.', err: err});
		} else {
			res.json(newPage);
		}
	});
};