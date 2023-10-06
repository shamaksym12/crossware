module.exports = app => {
    const thumbnails = require("../controllers/thumbnail.controller.js");
    const auth = require("../middleware/auth");
    const getSftpConfig = require("../middleware/sftpconfig");
    const router = require("express").Router();

    router.get("/:project_id/:path", auth, getSftpConfig, thumbnails.getThumbnail);

    app.use('/api/thumbnail', router);
};