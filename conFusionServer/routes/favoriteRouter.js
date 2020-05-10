const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var authenticate = require('../authenticate');

const Favorites = require('../models/favorites');
const Tours = require('../models/tours');

const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
/*
.get(authenticate.verifyUser,(req,res,next)=>{
	Favorites.findOne({})
	.populate('user')
	.populate('tours')
	.then((favorite)=>{
		if(favorite != null && favorite.user.equals(req.user._id)){
		res.statusCode=200;
		res.setHeader('Content-Type','application/json');
		res.json(favorite);
	} 
	else if(favorite === null && favorite.user.equals(req.user._id)){
		var err = new Error('Favorite document does not exist');
		err.status=404;
		return next(err);
	}
	else {
		var err = new Error('You are not authorized');
		err.status=403;
		return next(err);
	}
	},(err)=>next(err))
	.catch((err)=>next(err));
})
*/

.get(authenticate.verifyUser, (req,res,next) => {
    Favorites.findOne({user: req.user._id})
    .populate('user')
    .populate('tours')
    .then((favorites) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorites);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser,(req,res,next)=>{
	Favorites.findOne({user: req.user._id})
        .then((favorite)=>{
        	if(favorite === null){
        		Favorites.create({user: req.user._id})
        		.then((favorite)=>{
        			//favorite.user = req.user._id;
	        favorite.save()
	        .then((favorite)=>{
				if(favorite != null){
			for (var i=0; i<req.body.length; i++) {
                if (favorite.tours.indexOf(req.body[i]._id) === -1) {
                    favorite.tours.push(req.body[i]._id);
                }	
			}
				favorite.save()
				.then((favorite)=>{
					//Favorites.findById(favorite._id)
					Favorites.find({})
					//.populate('tours')
					.then((favorite)=>{
					res.statusCode=200;
					res.setHeader('Content-Type','application/json');
					res.json(favorite);	
					})
				},(err)=>next(err));
				}
		else{
			err = new Error('Favorite '+ req.params.tourId + ' not found');
			err.status=404;
			return next(err);
		}
		
	},(err)=>next(err))
.catch((err)=>next(err));
},(err)=>next(err))
.catch((err)=>next(err));
        		}
        	
        	else if(favorite != null){
          favorite.user = req.user._id;
	        favorite.save()
	        .then((favorite)=>{
				if(favorite != null){
					var arr = req.body;
					for(var i=0;i<(arr.length);i++){
				favorite.tours.push(arr[i]);
			}
				favorite.save()
				.then((favorite)=>{
					Favorites.findById(favorite._id)
					//.populate('tours')
					.then((favorite)=>{
					res.statusCode=200;
					res.setHeader('Content-Type','application/json');
					res.json(favorite);	
					})
				},(err)=>next(err));
				}
		else{
			err = new Error('Favorite '+ req.params.tourId + ' not found');
			err.status=404;
			return next(err);
		}
		
	},(err)=>next(err))
.catch((err)=>next(err));
} 
else {
	var err = new Error('You are not authorized');
	err.status=403;
	return next(err);
}
},(err)=>next(err))
  .catch((err)=>next(err));
})
.put(authenticate.verifyUser,(req,res,next)=>{
	res.statusCode=403;
	res.end('Put operation not supported on /favorites');
})
.delete(authenticate.verifyUser,(req,res,next)=>{
	Favorites.findOne({user: req.user._id})
	.then((favorite)=>{
		if( favorite != null && favorite.user.equals(req.user._id)){
		Favorites.remove({})
	.then((resp)=>{
	    res.statusCode=200;
		res.setHeader('Content-Type','application/json');
		res.json(resp);		
	},(err)=>next(err))
	.catch((err)=>next(err));	
		}
		else if(favorite == null){
			var err = new Error('Favorite already does not exist');
			err.status=404;
			return next(err);
		}
		else{
			var err = new Error('You are not authorized');
			err.status=403;
			return next(err);
		}
	},(err)=>next(err))
	.catch((err)=> next(err));
	});




favoriteRouter.route('/:tourId')
.get(authenticate.verifyUser,(req,res,next)=>{
	//Favorites.findById(req.params.favoriteId)
	Favorites.findOne({user: req.user._id})
	.populate('tours')
	.populate('user')
	     .then((favorite)=>{
	     	if(favorite != null){
		 res.statusCode=200;
		res.setHeader('Content-Type','application/json');
		res.json(favorite);
	} 
	else if (favorite === null){
		var err = new Error('Favorite document does not exist');
		err.status=404;
		return next(err);
	}
	else {
		var err = new Error('You are not authorized');
		err.status=403;
		return next(err);
	}
	},(err)=>next(err))
	.catch((err)=>next(err));
})
.post(authenticate.verifyUser,(req,res,next)=>{
        Favorites.findOne({user: req.user._id})
        .then((favorite)=>{
        	if(favorite === null){
        		Favorites.create({})
        		.then((favorite)=>{
        			favorite.user = req.user._id;
	        favorite.save()
	        .then((favorite)=>{
				if(favorite != null){
				favorite.tours.push(req.params.tourId);
				favorite.save()
				.then((favorite)=>{
					//Favorites.findById(favorite._id)
					Favorites.find({})
					//.populate('tours')
					.then((favorite)=>{
					res.statusCode=200;
					res.setHeader('Content-Type','application/json');
					res.json(favorite);	
					})
				},(err)=>next(err));
				}
		else{
			err = new Error('Favorite '+ req.params.tourId + ' not found');
			err.status=404;
			return next(err);
		}
		
	},(err)=>next(err))
.catch((err)=>next(err));
},(err)=>next(err))
.catch((err)=>next(err));
        		}
        	
        	else if(favorite != null) {
          favorite.user = req.user._id;
	        favorite.save()
	        .then((favorite)=>{
				if(favorite != null){
					var arr = favorite.tours;
					var index = arr.indexOf(req.params.tourId);
					if(index > (-1)){
						var err = new Error('This tour is already added into favorite');
						err.status=401;
						return next(err);
					}
					else{
					arr.push(req.params.tourId);	
					}
				favorite.save()
				.then((favorite)=>{
					Favorites.findById(favorite._id)
					//.populate('tours')
					.then((favorite)=>{
					res.statusCode=200;
					res.setHeader('Content-Type','application/json');
					res.json(favorite);	
					})
				},(err)=>next(err));
				}
		else{
			err = new Error('Favorite '+ req.params.tourId + ' not found');
			err.status=404;
			return next(err);
		}
		
	},(err)=>next(err))
.catch((err)=>next(err));
} 
else{
	 var err = new Error('You are  not authenticated');
	 err.status=403;
	 return next(err);
} 
},(err)=>next(err))
  .catch((err)=>next(err));      
})
.put(authenticate.verifyUser,(req,res,next)=>{
	res.statusCode=403;
	res.end('Put operation not supported on /favorites/' + req.params.favoriteId);
})
.delete(authenticate.verifyUser,(req,res,next)=>{
	Favorites.findOne({user: req.user._id})
	.then((favorite)=>{
		if(favorite != null && favorite.tours.indexOf(req.params.tourId) != null){
	  // delete favorite.tours.indexOf(req.params.tourId);
	var ar = favorite.tours;
	 var index = favorite.tours.indexOf(req.params.tourId);
	 
	 if(index > (-1)){
	 	ar.splice(index,1);
	 	//return favorite.tours;
	 }
	 else{
	 	var err = new Error('This tour is not in favorites');
	 	err.status=404;
	 	return next(err);
	 }
	 
	 // removeByAttr(ar,'id',req.params.tourId);
	    favorite.save()
	    .then((favorite)=>{
	    	res.statusCode=200;
	    	res.setHeader('Content-Type','application/json');
	    	res.send(favorite);
	    },(err)=>next(err))
	    .catch((err)=>next(err));	
		}
		else if(favorite === null){
				var err = new Error('Favorite document doesnt exist');
				err.status=404;
				return next(err);
			}
		else if(favorite.tours.indexOf(req.params.tourId) === null){
			var err = new Error('Tour '+ req.params.tourId + ' not exist in favorite');
			err.status=404;
			return next(err);
		}
		else{
			var err= new Error('You are not authorized to delete this tour from favorite');
			err.status=403;
			return next(err);
		}
},(err)=>next(err))
	.catch((err)=>next(err));
});

module.exports=favoriteRouter;
