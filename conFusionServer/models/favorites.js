const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Tours = require('./tours');
/*
var comSchema = new Schema({
	id: {
       type : mongoose.Schema.Types.ObjectId,
       ref: 'Tour'
	}
});
*/
var favSchema = new Schema({
   user : {
   	  type : mongoose.Schema.Types.ObjectId,
   	  ref: 'User'
   },
    tours : [{
       type : mongoose.Schema.Types.ObjectId,
       ref: 'Tour'
	}]
},{
	timestamps: true
});

var Favorites = mongoose.model('Favorite',favSchema);

module.exports = Favorites;