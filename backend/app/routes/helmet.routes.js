const auth = require("../middleware/auth");
const companies = require("../controllers/company.controller");
module.exports = app => {
    const helmets = require("../controllers/helmet.controller.js");
    const router = require("express").Router();
    const auth = require("../middleware/auth");
    const getSftpConfig = require("../middleware/sftpconfig");

    const multer = require('multer')
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            const fs = require('fs');
            fs.mkdirSync('/upload', { recursive: true });
            cb(null, '/upload');
        },
        filename: (req, file, cb) => {
            cb(null, file.originalname)
        }
    })
    const upload = multer({ storage: storage })

    router.get("/", auth, helmets.all);
    router.post("/", helmets.create);
    router.get("/:id/share", auth, getSftpConfig, helmets.getShare);
    router.post("/:id/share", auth, getSftpConfig, upload.single('file'), helmets.postShare);
    router.get("/:id/share/:name", auth, getSftpConfig, helmets.getShareFile);
    router.patch("/:id", helmets.update);
    router.delete("/:id", helmets.delete);
    router.get("/get_ftp_path", helmets.getFtpPath);
    router.post("/:id/project", auth, helmets.addToProject);

    app.use('/api/helmet', router);
};
