module.exports = app => {
    const reports = require("../controllers/report.controller.js");
    const auth = require("../middleware/auth");
    const getSftpConfig = require("../middleware/sftpconfig");
    const router = require("express").Router();

    router.get("/:project_id", auth, getSftpConfig, reports.getReports);    
    router.get("/data/:project_id/:path", auth, getSftpConfig, reports.getReport);
    router.get("/download/:project_id/:path", auth, getSftpConfig, reports.download);
    router.put("/:project_id/:path", auth, getSftpConfig, reports.updateReport);
    router.post("/:project_id", auth, getSftpConfig, reports.createReport);
    router.delete("/:project_id/:path", auth, getSftpConfig, reports.delete);

    app.use('/api/report', router);
};