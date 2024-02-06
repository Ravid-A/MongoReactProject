const controller = require("../controllers/statistics");
const router = require("express").Router();
const Authorization = require("../middlewares/authorization");

router.get("/", Authorization, controller.getStatistics);
router.get("/authors", controller.getPopularAuthors);
router.get("/books", controller.getPopularBooks);

module.exports = router;
