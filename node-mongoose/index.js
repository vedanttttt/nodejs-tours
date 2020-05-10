const mongoose = require('mongoose');
const Tours = require('./models/tours');

const url = 'mongodb://localhost:27017/conFusion';
const connect = mongoose.connect(url);

connect.then((db)=>{
console.log('Connected correctly to server');

Tours.create({
	name : 'Rome',
	description: 'Test'
})
  .then((tour)=>{
 	console.log(tour);

 	return Tours.findByIdAndUpdate(tour._id,{
 		$set: {description: 'Updated Test'}
 	},{
 		new : true
 	}).exec();
 })
 .then((tour)=>{
 	console.log(tour);

   tour.comments.push({
   	rating : 5,
   	comment: 'I m loving it',
   	author: 'Bhaiya'
   });
  
    return tour.save();

})
 .then((tour)=>{
    console.log(tour);
    
 	return Tours.remove({});
})
 .then(()=>{
 	return mongoose.connection.close();
 })
  .catch((err)=> {
  	console.log(err);
  })
});