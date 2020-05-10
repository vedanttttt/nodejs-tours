const express = require('express');
const bodyParser = require('body-parser');



const tourRouter = express.Router();
tourRouter.use(bodyParser.json());

tourRouter.route('/')
.all((req,res,next)=>{
	res.statusCode = 200;
	res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req,res,next)=>{
	res.end('Will provide all the tours to you');
})
.post((req,res,next)=>{
	res.end('Will post the tour: ' + req.body.name + ' with details:' + req.body.description);
})
.put((req,res,next)=>{
	res.statusCode=403;
	res.end('PUT operation not supported on /tours');
})
.delete((req,res,next)=>{
	res.end('Deleting all the tours');
});

tourRouter.route('/:tourId')
.get((req,res,next)=>{
 res.end('Will get the tour: ' + req.params.tourId + ' to you!' );
})
.post((req,res,next)=>{
	res.statusCode=403;
	res.end('POST operation not supported on /tours/:tourId' +
		 req.params.tourId);
})
.put((req,res,next)=>{
 res.write('Updating the tour: ' + req.params.tourId + ' \n');
 res.end('Will update the tour: ' + req.body.name + ' with details: '+ req.body.description);
})
.delete((req,res,next)=>{
 res.end('Deleting the tour: ' + req.params.tourId);
});

module.exports = tourRouter;