const router = require("express").Router();
const homeRoutes = require("./home-routes");
const api = require("./api");
const dashboard = require("./dashboard-routes");

router.use("/", homeRoutes);
router.use("/api", api);
router.use("/dashboard", dashboard);

module.exports = router;
