const controller = require("../controllers/genres");
const router = require("express").Router();
const cacheNoStore = require("../middlewares/cacheNoStore");

router.get("/", cacheNoStore, controller.getGenres);

module.exports = router;
