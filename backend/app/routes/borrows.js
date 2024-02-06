const controller = require("../controllers/borrows");
const router = require("express").Router();
const Authorization = require("../middlewares/authorization");
const cacheNoStore = require("../middlewares/cacheNoStore");

router.post("/", Authorization, controller.create);

router.put("/:id/return/", Authorization, controller.returnBorrow);

router.get("/me/:all", Authorization, controller.getAllByUser);
router.get("/popular/authors", cacheNoStore, controller.getPopularAuthors);
router.get("/popular/books", cacheNoStore, controller.getPopularBooks);

module.exports = router;
