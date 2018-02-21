const express = require('express'); 
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const { BlogPosts } = require('./models')


BlogPosts.create('hey wuzzup', 'hi i was wondering how its going everyone.  ok bye', 'jimmy');
BlogPosts.create('boo', 'im grumpy and everything is stupid', 'grandpa');

router.get('/', (req, res) => {
	res.json(BlogPosts.get());
})

router.post('/', jsonParser, (req, res) => {
	const requiredFields = [ 'content', 'title', 'author']
	for (let i=0; i<requiredFields.length; i++){
		if (!(requiredFields[i] in req.body)) {
			const message = `missing field in body: '${requiredFields[i]}' please try again, mofo.`;
			console.error(message);
			return res.status(400).send(message)
		} 
	}
	const {title, content, author} = req.body;
	const post = BlogPosts.create(title, content, author);
	res.status(201).json(post)
})
router.put('/:id', jsonParser, (req, res)=>{
	const requiredFields = [ 'content', 'title', 'author']
	for (let i=0; i<requiredFields.length; i++){ // this is not dry - already did this in post
		if (!(requiredFields[i] in req.body)) {
			const message = `missing field in body: '${requiredFields[i]}' please try again, mofo.`;
			console.error(message);
			return res.status(400).send(message)
		} 
	}
	if(req.params.id !== req.body.id) {
		const message = `id in header (${req.params.id}) and message (${req.body.id}) must match`
		console.error(message);		
		return res.status(400).send(message)
	}
	const {content, title, author} = req.body;
	const post = BlogPosts.update({content, title, author, id: req.params.id})
	res.status(201).send(post);
})
router.delete('/:id', (req, res)=>{
	BlogPosts.delete(req.params.id);
	console.log(`deleted blog post ${req.params.id}`)
	res.status(204).end();
})


module.exports = router; 