const Post = require('../models/post');

module.exports.createPost = async (req, res) => {
    try {
        const { title, text, author } = req.body;

        // Validations
        if (!title || !text || !author) {
            return res.status(400).json({ error: 'Please provide title, text and author' });
        }
        if (title.length < 5) {
            return res.status(400).json({ error: 'Title must be at least 5 characters long' });
        }
        if (text.length < 5) {
            return res.status(400).json({ error: 'Text must be at least 5 characters long' });
        }
        
        // Create post
        const post = await new Post.create({
            title,
            text,
            author
        });
        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }


}

module.exports.listPosts = async (req, res) => {
    try {
        const posts = await Post.find();
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports.getPostById = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports.updatePostById = async (req, res) => {
    try {
        const { id } = req.params;
        const postUpdate = await Post.findByIdAndUpdate(
            { id }, 
            { $set: req.body }, 
            { runValidators: true, new: true}
        )

        if (!postUpdate) {
            return res.status(404).json({ error: 'Post not found' });
        }

        res.status(200).json(postUpdate);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports.deletePostById = async (req, res) => {
    try {
        const { id } = req.params;
        const postDelete = await Post.findByIdAndDelete(id);
        if (!postDelete) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.status(200).json(postDelete);
    } catch (error) {
        res.status(500).json({ error: error.message });        
    }
}
