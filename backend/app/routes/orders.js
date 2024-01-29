const controller = require("../controllers/orders");
const router = require("express").Router();
const cacheNoStore = require("../middlewares/cacheNoStore");

router.post("/", cacheNoStore, controller.create);

router.get("/", cacheNoStore, controller.getAll);
router.get(
  "/max-total-in-year-range",
  cacheNoStore,
  controller.getMaxTotalInYearRange
);
router.get(
  "/top-3-popular-genres",
  cacheNoStore,
  controller.getTop3PopularGenres
);
router.get("/profit", cacheNoStore, controller.getProfitInRange);
router.get(
  "/top-5-popular-authors",
  cacheNoStore,
  controller.getTop5PopularAuthors
);

module.exports = router;
