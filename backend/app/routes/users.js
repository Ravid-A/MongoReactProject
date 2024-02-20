const router = require("express").Router();
const controller = require("../controllers/users");
const authorization = require("../middlewares/authorization");

router.post("/register", controller.create);
router.post("/login", controller.login);

router.get("/", authorization, controller.getAll);
router.get("/me", authorization, controller.me);

router.patch("/update", authorization, controller.update);
router.patch("/updatepassword", authorization, controller.updatePassword);

router.put("/:id", authorization, controller.updateAdmin);

router.delete("/:id", authorization, controller.deleteUser);

module.exports = router;
