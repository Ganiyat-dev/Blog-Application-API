const router = require("express").Router();
const auth = require("./../middleware/auth");
const PostController = require("./../controllers/post");

router.post("/", auth(), PostController.create);
router.get("/", auth(), PostController.getAll);
router.get("/:post_id", PostController.getOne);
router.put("/:post_id", PostController.update);
router.delete("/:post_id", auth(), PostController.delete);

module.exports = router;