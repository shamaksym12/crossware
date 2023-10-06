const db = require("../../db/models");
const Company = db.Company;
const Project = db.Project;

exports.all = (req, res) => {
    Company.findAll({ include: ["projects"] })
        .then(companies => {
            res.status(200).json({
                success: true,
                data: companies
            });
        })
        .catch(err => {
            return res.status(500).json({ success: false, message: err.message });
        });
};

exports.getCompany = (req, res) => {
    const id = req.params.id;

    Company.findByPk(id, { include: [{model: Project, as: "projects", include: ["user"]}] })
        .then(company => {
            res.status(200).json({
                success: true,
                data: company
            });
        })
        .catch(err => {
            return res.status(500).json({ success: false, message: err.message });
        });
};

exports.create = (req, res) => {
    if (!req.body.name) return res.status(400).json({ success: false, message: 'Company Name cannot be empty!' });

    Company.create(req.body)
        .then(data => {
            return res.status(200).json({ success: true, data: data });
        })
        .catch(err => {
            return res.status(500).json({ success: false, message: err.message });
        });
};

exports.update = (req, res) => {
    const id = req.params.id;

    Company.update(req.body, { where: { id: id } })
        .then(num => {
            if (num == 1) return res.status(200).json({ success: true });
            else return res.status(200).json({ success: false });
        })
        .catch(err => {
            return res.status(500).json({ success: false, message: err.message });
        });
};

exports.delete = (req, res) => {
    const id = req.params.id;

    Company.destroy({ where: { id: id } })
        .then(num => {
            if (num == 1) return res.status(200).json({ success: true });
            else return res.status(200).json({ success: false });
        })
        .catch(err => {
            return res.status(500).json({ success: false, message: err.message });
        });
};