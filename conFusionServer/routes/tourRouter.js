const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');

const Tours = require('../models/tours');

const tourRouter = express.Router();
tourRouter.use(bodyParser.json());

tourRouter.route('/')
.get((req,res,next)=>{
	Tours.find({})
	//.populate('comments.author')
	.then((tours)=>{
		res.statusCode=200;
		res.setHeader('Content-Type','application/json');
		res.json(tours);
	},(err)=>next(err))
	.catch((err)=> next(err));
})
.post(authenticate.verifyUser,(req,res,next)=>{
	Tours.create(req.body)
	.then((tour)=> {
		console.log('Tour created');
			res.statusCode=200;
		res.setHeader('Content-Type','application/json');
		res.json(tour);
	},(err)=>next(err))
	.catch((err)=> next(err));
})
.put(authenticate.verifyUser,(req,res,next)=>{
	res.statusCode=403;
	res.end('PUT operation not supported on /tours');
})
.delete(authenticate.verifyUser,(req,res,next)=>{
	Tours.remove({})
	.then((resp)=>{
	    res.statusCode=200;
		res.setHeader('Content-Type','application/json');
		res.json(resp);
	},(err)=>next(err))
	.catch((err)=> next(err));
});

tourRouter.route('/:tourId')
.get((req,res,next)=>{
 Tours.findById(req.params.tourId)
 .populate('comments.author')
 	.then((tour)=>{
		res.statusCode=200;
		res.setHeader('Content-Type','application/json');
		res.json(tour);
	},(err)=>next(err))
	.catch((err)=> next(err));
})
.post(authenticate.verifyUser,(req,res,next)=>{
	res.statusCode=403;
	res.end('POST operation not supported on /tours/' +
		 req.params.tourId);
})
.put(authenticate.verifyUser,(req,res,next)=>{
 Tours.findByIdAndUpdate(req.params.tourId,{
 	$set: req.body
 },{new : true})
 .then((tour)=>{
 		res.statusCode=200;
		res.setHeader('Content-Type','application/json');
		res.json(tour);
 },(err)=>next(err))
	.catch((err)=> next(err));
})
.delete(authenticate.verifyUser,(req,res,next)=>{
Tours.findByIdAndRemove(req.params.tourId)
.then((resp)=>{
 		res.statusCode=200;
		res.setHeader('Content-Type','application/json');
		res.json(resp);
},(err)=>next(err))
	.catch((err)=> next(err));
});



tourRouter.route('/:tourId/comments')
.get((req,res,next)=>{
	Tours.findById(req.params.tourId)
	.populate('comments.author')
	.then((tour)=>{
		if(tour != null){
	    res.statusCode=200;
		res.setHeader('Content-Type','application/json');
		res.json(tour.comments);
		} else {
			err = new Error('Tour '+ req.params.tourId + ' not found');
			err.status=404;
			return next(err);
		}
	},(err)=>next(err))
	.catch((err)=> next(err));
})
.post(authenticate.verifyUser,(req,res,next)=>{
	Tours.findById(req.params.tourId)
	.then((tour)=> {
		if(tour != null){
		req.body.author = req.user._id;	
        tour.comments.push(req.body);
		tour.save()
		.then((tour)=>{
		Tours.findById(tour._id)
		.populate('comments.author')
		.then((tour)=>{
		res.statusCode=200;
		res.setHeader('Content-Type','application/json');
	    res.json(tour);		
		})	
		},(err)=> next(err));
       }
	  else {
	  	err = new Error('Tour '+ req.params.tourId + ' does not exist');
	  	err.status=404;
	  	return next(err);
	  }
	},(err)=>next(err))
	.catch((err)=> next(err));
})
.put(authenticate.verifyUser,(req,res,next)=>{
	res.statusCode=403;
	res.end('PUT operation not supported on /tours/' + req.params.tourId + '/comments');
})
.delete(authenticate.verifyUser,(req,res,next)=>{
	Tours.findById(req.params.tourId)
	.then((tour)=>{
		if(tour != null){
	    for(var i = tour.comments.length -1;i>=0;i--){
	    	tour.comments.id(tour.comments[i]._id).remove();
	    }
	     tour.save()
		.then((tour)=>{
		res.statusCode=200;
		res.setHeader('Content-Type','application/json');
	    res.json(tour);			
		},(err)=>next(err));
		} 
		else {
		err = new Error('Tour '+ req.params.tourId + ' does not exist');
	  	err.status=404;
	  	return next(err);
		}
	},(err)=>next(err))
	.catch((err)=> next(err));
});

tourRouter.route('/:tourId/comments/:commentId')
.get((req,res,next)=>{
 Tours.findById(req.params.tourId)
 .populate('comments.author')
 	.then((tour)=>{
    if(tour != null && tour.comments.id(req.params.commentId) != null){
	    res.statusCode=200;
		res.setHeader('Content-Type','application/json');
		res.json(tour.comments.id(req.params.commentId));
		} 
		else if(dish === null){
			err = new Error('Tour '+ req.params.tourId + ' not found');
			err.status=404;
			return next(err);
		} 
		else {
			err = new Error('Comment '+ req.params.commentId + ' not found');
			err.status=404;
			return next(err);
		}
	},(err)=>next(err))
	.catch((err)=> next(err));
})
.post(authenticate.verifyUser,(req,res,next)=>{
	res.statusCode=403;
	res.end('POST operation not supported on /tours/' +
		 req.params.tourId + '/comments' + req.params.commentId);
})
.put(authenticate.verifyUser,(req,res,next)=>{
 Tours.findById(req.params.tourId)
 	.then((tour)=>{
    if(tour != null && tour.comments.id(req.params.commentId) != null){
    	if(req.body.rating){
          tour.comments.id(req.params.commentId).rating = req.body.rating;
    	}
    	if(req.body.comment){
         tour.comments.id(req.params.commentId).comment = req.body.comment;
    	}
	   tour.save()
		.then((tour)=>{
			Tours.findById(tour._id)
			.populate('comments.author')
			 .then((tour)=>{
		 	 res.statusCode=200;
		     res.setHeader('Content-Type','application/json');
	         res.json(tour);	
			 })
					
		},(err)=>next(err));
		} 
		else if(dish === null){
			err = new Error('Tour '+ req.params.tourId + ' not found');
			err.status=404;
			return next(err);
		} 
		else {
			err = new Error('Comment '+ req.params.commentId + ' not found');
			err.status=404;
			return next(err);
		}
	},(err)=>next(err))
	.catch((err)=> next(err));
})
.delete(authenticate.verifyUser,(req,res,next)=>{
	Tours.findById(req.params.tourId)
	.then((tour)=>{
		if(tour != null && tour.comments.id(req.params.commentId) != null){
	      tour.comments.id(req.params.commentId).remove();
	     tour.save()
		.then((tour)=>{
		Tours.findById(tour._id)
			.populate('comments.author')
			 .then((tour)=>{
		 	 res.statusCode=200;
		     res.setHeader('Content-Type','application/json');
	         res.json(tour);	
			 })		
		},(err)=>next(err));
		} 
		else if(dish === null){
			err = new Error('Tour '+ req.params.tourId + ' not found');
			err.status=404;
			return next(err);
		} 
		else {
			err = new Error('Comment '+ req.params.commentId + ' not found');
			err.status=404;
			return next(err);
		}
	},(err)=>next(err))
	.catch((err)=> next(err));
});


module.exports = tourRouter;