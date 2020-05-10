module.exports = (x,y,callback)=> {
	if(x > 0 && y >0){
      setTimeout(()=>
      	callback(null,{
      			area : (x,y)=> (x*y),
      		perimeter : (x,y)=> (2*(x+y))
      	})
      	,2000);
	}
	else {
		setTimeout(()=> 
			callback(new Error('Length and breadth should be greater than zero'),null)
			,2000);
	}
}
