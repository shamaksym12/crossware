module.exports = app => {
    const logs = require("../controllers/log.controller.js");

    const router = require("express").Router();

    router.post("/", logs.create);

    app.use('/api/log', router);
};