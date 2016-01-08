'use strict';

var CategoryModel = require('../models').Category;
var LinkModel = require('../models').Link;

exports.index = function(req, res) {
	CategoryModel.find({}, {}, { sort: { timestamp: 1 }})
	.exec(function(err, data) {
		if (err) {
			res.json(500, {msg: 'Error getting categories.', err: err});
		}
		else {
			if (!data){
				res.json(404, {msg: 'Category Not Found.'});
			} else {
				res.json(data);
			}
		}
	});
};

exports.findById = function(req, res) {
	CategoryModel.findById(req.params.id)
	.exec(function(err, data) {
		if (err) {
			res.json(500, {msg: 'Error getting category.', err: err});
		}
		else {
			res.json(data);
		}
	});
};

exports.update = function(req, res) {
	CategoryModel.findById(req.params.id)
	.exec(function(err, data) {
		if (err) {
			res.json(500, {msg: 'Error getting category.', err: err});
		}
		else {
			if (req.body.hasOwnProperty('title')) {
				data.title = req.body.title;
			}
			if (req.body.hasOwnProperty('page')) {
				data.page = req.body.page;
			}
			data.save(function(err) {
				if (err) {
					res.json(500, {msg: 'Error updating category.', err: err});
				}
				else {
          res.json({ message: 'category updated!' });
        }
			});

		}
	});
};

exports.delete = function(req, res) {
	LinkModel.find({ category: req.params.id })
	.exec(function(err, data) {
		if (err) {
			res.json(500, {msg: 'Error deleting category.', err: err});
		}
		else if (data && data.length > 0) {
			res.json(500, {msg: 'Category not empty.'});
		}
		else {
			CategoryModel.remove({ _id: req.params.id })
			.exec(function(err1) {
				if (err1) {
					res.json(500, {msg: 'Error deleting category.', err: err1});
				}
				else {
					res.json({ message: 'category deleted!' });
				}
			});
		}
	});

};


exports.create = function(req, res) {
	var newCategory = new CategoryModel({
		title: req.body.title
	})
	if (req.body.hasOwnProperty('page')) {
		newCategory.page = req.body.page;
	}
	newCategory.save(function(err) {
		if (err){
			res.json(500, {msg: 'Error createing new category.', err: err});
		} else {
			res.json(newCategory);
		}
	});
};