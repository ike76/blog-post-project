const express = require('express');
const morgan = require('morgan')
const blogPostRouter = require('./routes');
const app = express();
const {PORT, DATABASE_URL, TEST_DATABASE_URL} = require('./config');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use('/blog-posts', blogPostRouter)

let server;



function runServer(databaseUrl, port=PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl,  err => {
      if (err) {
        return reject(err);
      }

      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
      .on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
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
	runServer(DATABASE_URL).catch(err=>console.error(err));
}




module.exports = {app, runServer, closeServer}

