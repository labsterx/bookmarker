var mongoose   = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var LinkSchema = new Schema({
	url:         { type: String, required: true, trim: true },
	url:         { type: String, required: true, trim: true },
	title:       { type: String, required: true, trim: true },
	category: { type: ObjectId, ref: 'Category', required: true },
	timestamp:   { type: Date, 'default': Date.now }
});

module.exports = mongoose.model('Link', LinkSchema);

