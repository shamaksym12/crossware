module.exports = app => {
    const companies = require("../controllers/company.controller.js");
    const router = require("express").Router();
    const auth = require("../middleware/auth");

    router.get("/", auth, companies.all);
    router.get("/:id", auth, companies.getCompany);
    router.post("/", auth, companies.create);
    router.patch("/:id", auth, companies.update);
    router.delete("/:id", auth, companies.delete);

    app.use('/api/company', router);
};