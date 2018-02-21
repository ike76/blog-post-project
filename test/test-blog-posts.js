const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const should = chai.should()
const expect = chai.expect
const {app, runServer, closeServer} = require('../server');


describe('Blog Posts', function(){
	before(()=>{
		return runServer()
	})
	after(() => {
		return closeServer()
	})

	it('should GET all posts', function(){
		return chai.request(app)
			.get('/blog-posts')
			.then(function(res){
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.an('array');
				res.body.length.should.be.above( 1, 'how many posts there are');
				res.body.forEach(post=>{
					post.should.be.an('object');
					post.should.include.keys(['id', 'title', 'content', 'author', 'publishDate'])
				})
			})
	})

	it('should POST a new post', function(){
		const newPost = {title: 'good morning', content: 'lovely day were having', author: 'mr. Rogers'}
		return chai.request(app)
			.post('/blog-posts')
			.send(newPost)
			.then(function(res){
				res.should.have.status(201);
				res.should.be.json;
				res.should.be.an('object');
				res.body.should.deep.equal(Object.assign(newPost, {id: res.body.id, publishDate: res.body.publishDate}))
				newPost.id = res.body.id;
				return chai.request(app)
					.get('/blog-posts')
			})
			.then(function(res){
				res.body[0].id.should.equal(newPost.id) // it has to be the first one.
			})
	})

	it('should change post with PUT', function(){
		const updatedPost = {title: 'ugh', content: 'this weather sucks', author: 'mr. Rogers'}
		return chai.request(app)
			.get('/blog-posts')
			.then(function(res){
				updatedPost.id = res.body[0].id
				updatedPost.publishDate = res.body[0].publishDate
				return chai.request(app)
					.put(`/blog-posts/${res.body[0].id}`)
					.send(updatedPost)
			})
			.then(function(res){
				res.should.have.status(201);
				res.body.should.deep.equal(updatedPost)
			})
	})
	it('should delete a post', function(){
		return chai.request(app)
			.get('/blog-posts')
			.then(function(res){
				let id = res.body[0].id
				return chai.request(app)
					.delete(`/blog-posts/${id}`)
			})
			.then(function(res){
				res.should.have.status(204)
			})

	})
})