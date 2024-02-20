const controller = require("../controllers/borrows");
const router = require("express").Router();
const Authorization = require("../middlewares/authorization");

router.post("/", Authorization, controller.create);

router.put("/:id/return/", Authorization, controller.returnBorrow);

router.get("/me/:all", Authorization, controller.getAllByUser);

module.exports = router;
