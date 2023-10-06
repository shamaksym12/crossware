module.exports = app => {
    const medias = require("../controllers/media.controller.js");
    const auth = require("../middleware/auth");
    const getSftpConfig = require("../middleware/sftpconfig");
    const router = require("express").Router();

    router.get("/:project_id", auth, getSftpConfig, medias.getmedias);    
    router.get("/data/:project_id/:path", auth, getSftpConfig, medias.getMedia);
    router.get("/download/:project_id/:path", auth, getSftpConfig, medias.download);
    router.delete("/:project_id/:path", auth, getSftpConfig, medias.delete);

    app.use('/api/media', router);
};