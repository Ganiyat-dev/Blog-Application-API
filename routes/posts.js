const router = require("express").Router();
const auth = require("../middleware/auth");

const {
    createPost,
    getAllPosts,
    getPost,
    updatePost,
    deletePost
} = require('../controllers/posts');

router.route('/').get(getAllPosts).post( auth(), createPost);
router.route('/:id').get(getPost).patch( auth(), updatePost).delete( auth(), deletePost);


module.exports = router;