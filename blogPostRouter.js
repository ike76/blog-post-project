const express = require('express')
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const { BlogPosts } = require('./models')

router.get('/' (req, res) => {
	res.json(BlogPosts.get());
})


module.exports = router;