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
router.get("/profit", cacheNoStore, controller.getProfitInRange);

module.exports = router;
