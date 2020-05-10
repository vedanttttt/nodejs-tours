const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
	rating: {
		type: Number,
		min: 1,
		max: 5,
		required : true
	},
	author: {
		type: String,
		required: true
	},
	comment : {
		type: String,
		required: true
	}
},{
	timestamps: true
});

const tourSchema = new Schema({
	name : {
		type : String,
		unique: true,
		required: true
	},
	description: {
		type : String ,
		required: true
	},
	comments : [commentSchema]
},{
	timestamps: true
});

var Tours = mongoose.model('Tour',tourSchema);
module.exports = Tours;