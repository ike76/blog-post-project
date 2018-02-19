const express = require('express');
const router = express.Router();

const blogPostRouter = require('./blogPostRouter');



const app = express();


app.use('/blog-posts', blogPostRouter)

app.listen(8080, () => {
	console.log(`your app is listening on port 8080`)
})