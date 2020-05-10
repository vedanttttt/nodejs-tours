
/*var rect = {
     area : (x,y)=> (x*y),
     perimeter : (x,y)=> (2*(x+y))
};
*/
var rect = require('./rect');

function solve(l,b){
	rect(l,b,(err,rect)=>{
		if(err){
			console.log(err.message);
		}
		else{
			console.log('Area of the rectangle with length=' + l + ' and breadth=' + b+" is: " + rect.area(l,b));
            console.log('Perimeter of the rectangle with length=' + l + ' and breadth=' + b+" is: " + rect.perimeter(l,b));

		}
	})
	console.log('This statement is after all this shit');
	}

solve(3,5);
solve(0,7);
solve(-1,5);