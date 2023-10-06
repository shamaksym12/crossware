const db = require("../../db/models");
const Helmet = db.Helmet;
const Project = db.Project;
const Company = db.Company;
const { lookup } = require('geoip-lite');

const checkActive = async () => {
    const helmets = await Helmet.findAll();

    helmets.map(async (helmet) => {
        const updatedTime = new Date(helmet.updatedAt);
        const currentTime = new Date();
        const checkValue = 10 * 60 * 1000;

        if ((currentTime.getTime() - updatedTime.getTime()) > checkValue && helmet.trtc_id !== 'Test Sample' && helmet.device_id && helmet.is_online) {
            Helmet.update({ is_online: false }, { where: { id: helmet.id } })
                .then(num => {
                    if (num == 1) console.log('Offline a helmet ' + helmet.trtc_id);
                    else console.log('Offline helmet error ' + helmet.trtc_id);
                })
                .catch(err => {
                    console.log('Offline helmet error ' + helmet.trtc_id + ' ' + err.message);
                });
        }
    });
};

// setInterval(checkActive, 10 * 60 * 1000);

exports.all = (req, res) => {
    Helmet.findAll({ where: { company_id: req.query.company_id }, include: { model: Company, as: "Company" } })
        .then(helmets => {
            res.status(200).json({
                success: true,
                data: helmets
            });
        })
        .catch(err => {
            return res.status(500).json({ success: false, message: err.message });
        });
};

exports.create = (req, res) => {
    const client_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const client_location = lookup(client_ip);

    if (req.body.deviceId && req.body.trtcId) {
        Helmet.findOne({ where: { device_id: req.body.deviceId } })
            .then(helmet => {
                const newHelmet = {
                    trtc_id: req.body.trtcId ? req.body.trtcId : helmet ? helmet.trtc_id : '',
                    device_id: req.body.deviceId,
                    name: req.body.name || '',
                    helmet_number: req.body.helmetNumber || '',
                    phone_number: req.body.phoneNumber || '',
                    society: req.body.society || '',
                    email: req.body.email || '',
                    team: req.body.team || '',
                    location_lat: req.body.locationLat ? req.body.locationLat : helmet ? helmet.location_lat : 0,
                    location_lng: req.body.locationLng ? req.body.locationLng : helmet ? helmet.location_lng : 0,
                    ip_address: client_ip,
                    is_online: true,
                    company_id: req.body.company_id ? req.body.company_id : helmet ? helmet.company_id : 1,
                    project_id: req.body.project_id ? req.body.project_id : helmet ? helmet.project_id : 1
                };

                if (helmet) {
                    delete newHelmet["name"];

                    Helmet.update(newHelmet, { where: { device_id: req.body.deviceId } })
                        .then(num => {
                            if (num == 1) {
                                newHelmet['id'] = helmet.id;
                                console.log(newHelmet, 'newHelmet');
                                return res.status(200).json({ success: true, data: newHelmet });
                            }
                            else return res.status(200).json({ success: false });
                        })
                        .catch(err => {
                            return res.status(500).json({ success: false, message: err.message });
                        });
                } else {
                    Helmet.create(newHelmet)
                        .then(data => {
                            return res.status(200).json({ success: true, data: data });
                        })
                        .catch(err => {
                            return res.status(500).json({ success: false, message: err.message });
                        });
                }
            })
            .catch(err => {
                return res.status(500).json({ success: false, message: err.message });
            });
    } else {
        const newHelmet = {
            trtc_id: req.body.trtcId || '',
            device_id: req.body.deviceId || '',
            name: req.body.name || '',
            helmet_number: req.body.helmetNumber || '',
            phone_number: req.body.phoneNumber || '',
            society: req.body.society || '',
            email: req.body.email || '',
            team: req.body.team || '',
            location_lat: client_location ? client_location.ll[0] : 0,
            location_lng: client_location ? client_location.ll[1] : 0,
            ip_address: client_ip,
            is_online: true,
            company_id: req.body.company_id || 1,
            project_id: req.body.project_id || 1
        };

        Helmet.create(newHelmet)
            .then(data => {
                return res.status(200).json({ success: true, data: data });
            })
            .catch(err => {
                return res.status(500).json({ success: false, message: err.message });
            });
    }
};

exports.getShare = (req, res) => {
    Helmet.findOne({ where: { id: req.params.id } }).then(helmet => helmet.project_id).then(project_id => {
        const connection = req.sftp.connect(req.sftp_config);
        const dir_name = `/data/project${project_id}/share/${req.params.id}`;

        connection.then(() => {
            return req.sftp.list(dir_name);
        }).then((list) => {
            let data = list.map((file, index) => {
                let type = "node";
                if (file.name.endsWith('.mp4')) {
                    type = "video";
                }
                if (file.name.endsWith('.jpg') || file.name.endsWith('.png')) {
                    type = "image";
                }
                return {
                    id: index,
                    name: file.name,
                    size: file.size,
                    type: type,
                    lastModified: new Date(file.modifyTime),
                }
            });

            if (req.query.from || req.query.to) {
                const from = new Date(req.query.from);
                const to = new Date(req.query.to);

                data = data.filter(file => file.date >= from && file.date <= to);
            }

            return res.status(200).json({
                success: true,
                data: data,
            });
        });
    });

}

exports.postShare = (req, res) => {
    let dir_name;

    Helmet.findOne({ where: { id: req.params.id } })
        .then((helmet) => {
            if (!helmet) {
                throw new Error('Helmet not found');
            }
            return helmet.project_id;
        })
        .then((project_id) => {
            dir_name = `/data/project${project_id}/share/${req.params.id}`;
            const connection = req.sftp.connect(req.sftp_config);
            return connection.then(() => {
                return req.sftp.mkdir(dir_name, true);
            }).then(() => {
                return req.sftp.fastPut(req.file.path, `${dir_name}/${decodeURIComponent(req.file.filename)}`);
            }).then(() => {
                req.sftp.end();
                return res.status(200).json({
                    success: true,
                });
            }).catch((err) => {
                req.sftp.end();
                console.error(err);
                return res.status(500).json({
                    success: false,
                    message: 'Internal Server Error',
                });
            });
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({
                success: false,
                message: 'Internal Server Error',
            });
        });
};


exports.getShareFile = (req, res) => {
    Helmet.findOne({ where: { id: req.params.id } }).then(helmet => helmet.project_id).then(project_id => {
        const connection = req.sftp.connect(req.sftp_config);
        const file_dir = `/data/project${project_id}/share/${req.params.id}`;
        const file_path = `${file_dir}/${req.params.name}`;

        const fs = require('fs');
        fs.mkdirSync(file_dir, { recursive: true });

        connection.then(() => {
            req.sftp.fastGet(file_path, file_path).then(() => {
                return res.download(file_path);
            }).catch(error => {
                console.log(error);
                return res.status(500).json({ success: false });
            });
        })
    });

}

exports.update = (req, res) => {
    const id = req.params.id;
    const newHelmet = {};

    if (req.body.deviceId && req.body.trtcId && req.body.locationLat && req.body.locationLng) {
        newHelmet['location_lat'] = req.body.locationLat;
        newHelmet['location_lng'] = req.body.locationLng;
        newHelmet['is_online'] = true;
    } else {
        if (req.body.name) newHelmet['name'] = req.body.name;
        if (req.body.helmetNumber) newHelmet['helmet_number'] = req.body.helmetNumber;
        if (req.body.phoneNumber) newHelmet['phone_number'] = req.body.phoneNumber;
        if (req.body.society) newHelmet['society'] = req.body.society;
        if (req.body.email) newHelmet['email'] = req.body.email;
        if (req.body.team) newHelmet['team'] = req.body.team;
    }

    Helmet.update(newHelmet, { where: { id: id } })
        .then(num => {
            if (num == 1) {
                newHelmet['id'] = id;
                console.log(newHelmet, 'update');
                return res.status(200).json({ success: true, data: newHelmet });
            }
            else return res.status(200).json({ success: false });
        })
        .catch(err => {
            return res.status(500).json({ success: false, message: err.message });
        });
};

exports.delete = (req, res) => {
    const id = req.params.id;

    Helmet.destroy({ where: { id: id } })
        .then(num => {
            if (num == 1) return res.status(200).json({ success: true });
            else return res.status(200).json({ success: false });
        })
        .catch(err => {
            return res.status(500).json({ success: false, message: err.message });
        });
};

exports.getFtpPath = (req, res) => {
    const device_id = req.query.device_id;

    Helmet.findOne({ where: { device_id: device_id }, include: [{ model: db.sequelize.model('Project'), as: "Project" }] })
        .then(helmet => {
            if (helmet) {
                const project = helmet.Project;

                return res.status(200).json({ success: true, path: `data/project${project.id}` });
            } else return res.status(200).json({ success: false, path: "Not existed helemt!" });
        })
        .catch(err => {
            return res.status(500).json({ success: false, message: err.message });
        })
};

exports.addToProject = (req, res) => {
    const device_id = req.body.device_id;
    const id = req.params.id
    Helmet.update({ "device_id": device_id }, { where: { id: id } })
        .then(num => {
            if (num) {
                return res.status(200).json({ success: true });
            }
            else return res.status(200).json({ success: false });
        })
        .catch(err => {
            return res.status(500).json({ success: false, message: err.message });
        });
}
