const router = require("express").Router();
const controller = require("../controllers/users");
const authorization = require("../middlewares/authorization");

router.post("/register", controller.create);
router.post("/login", controller.login);

router.get("/me", authorization, controller.me);

module.exports = router;
