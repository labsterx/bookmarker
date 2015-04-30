var mongoose   = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var CategorySchema = new Schema({
	title:      { type: String, required: true, unique: true, trim: true },
	timestamp:  { type: Date, 'default': Date.now }
});

module.exports = mongoose.model('Category', CategorySchema);

