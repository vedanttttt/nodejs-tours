var http = require('http');
const port = 3000;
const hostname = 'localhost';

const server = http.createServer((req,res)=>{
	console.log(req.headers);
	res.statusCode = 200;
	res.setHeader('Content-Type','text/plain');
	res.end('Welcome to our server');
});

server.listen(port,hostname,()=>{
	(`Server running at http://${hostname}:${port}`);
});