module.exports = app => {
    const users = require("../controllers/user.controller.js");

    const router = require("express").Router();

    router.post("/signup", users.signup);

    router.post("/login", users.login);

    const auth = require("../middleware/auth");
    router.get("/location", auth, users.getAllLocations)
    router.post("/location", auth, users.setLocation)

    app.use('/api', router);
};