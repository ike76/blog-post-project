const express = require('express');
const morgan = require('morgan')
const blogPostRouter = require('./blogPostRouter');
const app = express();

let server;
app.use('/blog-posts', blogPostRouter)

const runServer = function(){
	const port = process.env.PORT || 8080;
	return new Promise((resolve, reject) => {
		server = app.listen(port, () => {
			console.log(`app is listening on port ${port}`)
			resolve();
		})
		.on('error', err => reject(err))
	})
}
const closeServer = function(){
	return new Promise((resolve, reject) => {
		console.log('closing server')
		server.close(err=>{
			if(err){
				reject(err)
				return; // just so we don't also call resolve()
			}
			resolve();
		});
	});
}

if(require.main === module) {
	runServer().catch(err=>console.error(err));
}




module.exports = {app, runServer, closeServer}

