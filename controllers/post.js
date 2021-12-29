const Post = require('../models/Post');
const auth =  require('../middleware/auth'); 

const post = {};

post.create = async (req, res) => {
    const data = req.body;

    try {
        const post = await new Post({
            user_id: data.user_id,
            title: data.title,
            body: data.body
        }).save();
        res.status(200).send({
            message: 'Post created successfully',
            data: {
                post
            }
        });
    } catch (error) {
        res.status(400).send({ message: 'Error creating post', error });
    }
}

post.getOne = async (req, res) => {
    try {
        const post = await Post.findById(req.params.post_id).populate("user_id", "name email");
        res.status(200).send({ message: 'Post retrieved successfully', data: { post } });
    } catch (error) {
        res.status(400).send({ message: 'Error retrieving post', error });
    }
}

post.getAll = async (req, res) => {
    try {
        const posts = await Post.find().populate("user_id", "name email");
        res.status(200).send({ message: 'All posts retrieved successfully', data: { posts } });
    } catch (error) {
        res.status(400).send({ message: 'Error retrieving posts', error });
    }
}

post.update = async (req, res) => {
    const data = req.body;
    try {
        const post = await Post.findOne({_id: req.params.post_id});
        if (post.user_id != req.USER_ID) {
            return res.status(403).send({ message: 'You are not authorized to edit this post' });
        }
        if (!post) return res.status(400).send({ message: 'Post not found' });
        const newPost = await Post.findByIdAndUpdate(
            req.params.post_id,
            {
                $set: {
                    title: data.title,
                    body: data.body
                }
            },
            { new: true }
        )
        res.status(200).send({ message: 'Post updated successfully', data: { newPost } });
    } catch (error) {
        res.status(400).send({ message: 'Error updating post', error });
    }
}

post.delete = async (req, res) => {
    try {
        const post = await Post.findOne({ _id: req.params.post_id});
        if (post.user_id != req.USER_ID) {
            return res.status(403).send({ message: 'You are not authorized to delete this post' });
        }
        await Post.findByIdAndDelete(req.params.post_id);
        res.status(200).send({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(400).send({ message: 'Error deleting post', error });
    }
}

module.exports = post