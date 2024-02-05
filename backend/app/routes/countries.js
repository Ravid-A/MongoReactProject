const controller = require("../controllers/countries");
const router = require("express").Router();
const cacheNoStore = require("../middlewares/cacheNoStore");

router.get("/", cacheNoStore, controller.getCountries);

module.exports = router;
