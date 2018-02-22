const router = require('express').Router()
const {BlogPost} = require('../models/blogPost')
const uuid = require('uuid');

router.get('/', (req, res)=>{
	BlogPost.find()
		.limit(10)
		.then(posts=>{
			res.json(posts.map(post=> post.serialize()))
		})
});

router.get('/:id', (req, res) => {
	BlogPost.findById(req.params.id)
		.then(post=> res.status(200).json(post.serialize()))
		.catch(err=> {
			console.error(err);
			res.status(500).json({message: 'post not found 🧐 '})
		} )
})

router.post('/', (req, res) => {
	const requiredFields = ['title', 'content', 'author'];
	requiredFields.forEach(field=>{
		if (!(field in req.body)){
			const message = `missing field: ${field}`;
			return res.status(400).send(message);
		}
	})
	if(!(req.body.author.firstName)) return res.status(400).send('author firstName missing');
	if(!(req.body.author.lastName)) return res.status(400).send('author lastName missing');

	BlogPost.create({
		title: req.body.title,
		content: req.body.content,
		author: {
			firstName: req.body.author.firstName,
			lastName: req.body.author.lastName
		},		
		publishDate: Date.now()
	})
	.then(post=> res.status(201).json(post.serialize()))
	.catch(err=>{
		console.error(err);
		res.status(500).json({message: "internal server error 😒"})
	})
})

router.put('/:id', (req, res)=>{
	if(!( req.body.id && req.params.id && req.params.id === req.body.id )){
		const message = `header id (${req.params.id}) and body id (${req.body.id}) must match`
		return res.status(400).send(message);
	}
	const availParams = ['title', 'author', 'content']
	const update = {}
	availParams.forEach(p=>{
		if (p in req.body){ update[p] = req.body[p] }
	})
	BlogPost.findByIdAndUpdate(req.params.id, {$set: update}, {new: true})
		.then(blogpost => res.status(200).json(blogpost.serialize()))
		.catch(err=> res.status(500).json({message: 'internal server error 😒'}))
	
})

router.delete('/:id', (req, res)=>{
	BlogPost.findByIdAndRemove(req.params.id)
		.then(()=>{res.status(204).end()})
		.catch(err=> res.status(500).json({message: "internal server error 😒"}))
})

module.exports = router;