const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const blogPostSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true
	}, 
	content: String,
	author: {
		firstName: String,
		lastName: String
	},
	publishDate: {
		type: Date,
		default: Date.now
	}
})

blogPostSchema.virtual('authorName').get(function(){
	return `${this.author.firstName} ${this.author.lastName}`.trim();
});

blogPostSchema.methods.serialize = function(){
	return {
		title: this.title,
		author: this.authorName,
		content: this.content, 
		created: this.publishDate,
		id: this._id
	}
}

const BlogPost = mongoose.model('BlogPost', blogPostSchema);

module.exports = { BlogPost }