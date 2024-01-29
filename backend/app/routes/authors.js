const controller = require("../controllers/authors");
const router = require("express").Router();
const cacheNoStore = require("../middlewares/cacheNoStore");

router.post("/", cacheNoStore, controller.create);

router.put("/:id", cacheNoStore, controller.update);

router.get("/", cacheNoStore, controller.getAllAuthors);
router.get("/:id", cacheNoStore, controller.getAuthor);
router.get("/:id/books", cacheNoStore, controller.getAllBooks);

module.exports = router;
