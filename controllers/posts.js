const Post = require('../models/Post');
const auth =  require('../middleware/auth'); 

const post = {};

const createPost = async (req, res) => {
    const data = req.body;
    //     const post = await Post.create(req.body)
    try {
        const post = await new Post({
            user_id: data.user_id,
            title: data.title,
            body: data.body
        }).save();
        res.status(200).send({ message: 'Post created successfully', data: post });
    } catch (error) {
        res.status(400).send({ message: 'Error creating post', error: error.message });
    }
}

const getPost = async (req, res) => {
    try {
        const { id: post_id } = req.params;
        const post = await Post.findOne({ _id: post_id }).populate("user_id", "name email");
        if (!post) {
            return res.status(400).send({ message: 'Post not found' });
        }
        res.status(200).send({ message: 'Post retrieved successfully', data: { post } });
    } catch (error) {
        res.status(400).send({ message: 'Error retrieving post', error: error.message });
    }
}

const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find({}).populate("user_id", "name email");
        if (!posts) {
            return res.status(400).send({ message: 'Posts not found' });
        }
        res.status(200).send({ message: 'Posts retrieved successfully', data: { posts } });
    } catch (error) {
        res.status(400).send({ message: 'Error retrieving posts', error: error.message });
    }
}



const updatePost = async (req, res) => {
    try {
        const {id: post_id} = req.params;
        const post = await Post.findOne({_id: post_id});
        if (post.user_id != req.USER_ID) {
            return res.status(401).json({ message: 'You are not authorized to edit this post' });
        }
        const newPost = await Post.findByIdAndUpdate({ _id: post_id }, req.body, { new: true });
        if (!post) {
            return res.status(400).send({ message: 'Post not found' })
        }
        res.status(200).send({ newPost, status: 'Post updated successfully' });
    } catch (error) {
        res.status(400).send({ message: 'Error updating post', error });
    }
}

const deletePost = async (req, res) => {
    try {
        const {id: post_id} = req.params;
        const post = await Post.findOne({ _id: post_id});
        if (post.user_id != req.USER_ID) {
            return res.status(403).send({ message: 'You are not authorized to delete this post' });
        }
        await Post.findByIdAndDelete({_id: post_id});
        res.status(200).send({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(400).send({ message: 'Error deleting post', error });
    }
}

module.exports = {
    createPost,
    getAllPosts,
    getPost,
    updatePost,
    deletePost
}