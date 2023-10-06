module.exports = app => {
    const projects = require("../controllers/project.controller.js");
    const router = require("express").Router();
    const auth = require("../middleware/auth");
    const getSftpConfig = require("../middleware/sftpconfig");

    router.get("/", auth, projects.all);
    router.post("/", auth, getSftpConfig, projects.create);
    router.patch("/:id", auth, projects.update);
    router.delete("/:id", auth, getSftpConfig, projects.delete);
    router.get("/download/:id", auth, getSftpConfig, projects.download);

    app.use('/api/project', router);
};