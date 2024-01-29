const controller = require("../controllers/books");
const router = require("express").Router();
const cacheNoStore = require("../middlewares/cacheNoStore");

router.post("/", cacheNoStore, controller.create);

router.delete("/:id", cacheNoStore, controller.remove);

router.get("/pages", cacheNoStore, controller.getAmountOfPages);
router.get("/:pageNumber", cacheNoStore, controller.getAllBooks);
router.get(
  "/search/:pageNumber",
  cacheNoStore,
  controller.getBooksByStrInTitle
);
router.get("/genre/:pageNumber", cacheNoStore, controller.getBooksByGenre);
router.get(
  "/published/:pageNumber",
  cacheNoStore,
  controller.getBooksByPublishedInRange
);
router.get(
  "/country/:pageNumber",
  cacheNoStore,
  controller.getBooksByAuthorCountry
);

module.exports = router;
