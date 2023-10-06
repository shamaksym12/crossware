const db = require("../../db/models");
const Project = db.Project;
const User = db.User;
const fs = require('fs');
const path = require('path'); 

const fileListFilter = (fileList) => {
    const ret = fileList.map((file, index) => {
        const filename = file.name.split('.')[0].split('---');
        let title = '', name = '';
        if (filename.length > 1) {
            name = filename[filename.length - 1];
            title = file.name.split('.')[0].replace('---' + name, '');
        }else{
            title = filename[0];
        }

        return {
            id: index,
            title: title,
            date: new Date(file.modifyTime),
            name: name,
            duration: "00:00",
            checked: false,
            url: file.name,
            type: file.name.endsWith('.mp4') ? 'video' : 'image',
        }
    })
    return ret;
};

exports.all = (req, res) => {
    Project.findAll({ include: ["user"] })
        .then(projects => {
            res.status(200).json({
                success: true,
                data: projects
            });
        })
        .catch(err => {
            return res.status(500).json({ success: false, message: err.message });
        });
};

exports.create = (req, res) => {
    if (!req.body.title) return res.status(400).json({ success: false, message: 'Project Title cannot be empty!' });
    if (!req.body.owner_user_id) return res.status(400).json({ success: false, message: 'Project Owner User cannot be empty!' });
    // if (!req.body.company_id) return res.status(400).json({ success: false, message: 'Project Company cannot be empty!' });
    if (!req.body.address) return res.status(400).json({ success: false, message: 'Project Address cannot be empty!' });

    const project = {
        ...req.body,
        // company_id: 1
    };

    User.findOne({where: {id: req.body.owner_user_id, privilege: 'admin'}}).then((user) => {
        if(user) {
            Project.create(project)
                .then(data => {
                    const connection = req.sftp.connect(req.sftp_config);

                    connection.then(() => {
                        req.sftp.mkdir(`/data/project${data.id}`).then(() => {
                            req.sftp.mkdir(`/data/project${data.id}/thumbnail`).then(() => {
                                console.log(data);
                                return res.status(200).json({success: true, data: data});
                            }).catch(error => {
                                console.log(error);
                                return res.status(500).json({success: false});
                            });
                        }).catch(error => {
                            console.log(error);
                            return res.status(500).json({success: false});
                        });
                    });
                })
                .catch(err => {
                    return res.status(500).json({success: false, message: err.message});
                })
        } else {
            return res.status(500).json({success: false, message: "the owner doesn't have a privilege"});
        }
    }).catch(err => {
            return res.status(500).json({ success: false, message: err.message });
    });
};

exports.update = (req, res) => {
    const id = req.params.id;

    Project.update(req.body, { where: { id: id } })
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

    Project.destroy({ where: { id: id } })
        .then(num => {
            if (num == 1) {
                const connection = req.sftp.connect(req.sftp_config);

                connection.then(() => {
                    req.sftp.rmdir(`/data/project${id}`, true).then(() => {
                        return res.status(200).json({ success: true });
                    }).catch(error => {
                        console.log(error);
                        return res.status(500).json({ success: false });
                    });
                });
            }
            else return res.status(200).json({ success: false });
        })
        .catch(err => {
            return res.status(500).json({ success: false, message: err.message });
        });
};

exports.download = (req, res) => {
    const id = req.params.id;
    const localDir = __dirname.substring(0, __dirname.length - 15);
    const remoteDir = `/data/project${id}/`;

    const connection = req.sftp.connect(req.sftp_config);
    connection.then(() => {
        return req.sftp.list(remoteDir)
    }).then((list) => {
        const files = fileListFilter(list);
        let count = 0;

        if (!files.length) res.status(200).json({ success: false, message: "No files" });

        fs.unlink(`${localDir}download/data.zip`, function(err) {
            if (err) console.log(err);
        });

        fs.readdir(`${localDir}download/project`, (err, allFiles) => {
            if (err) console.log(err, 'err');
          
            for (const file of allFiles) {
                fs.unlink(path.join(`${localDir}download/project`, file), (err) => {
                    if (err) throw err;
                });
            }
        });          

        files.map(async (file) => {
            req.sftp.fastGet(`${remoteDir}${file.url}`, `${localDir}download/project/${file.url}`).then(() => {
                count++;
                
                if (count == files.length) {
                    const zip_a_folder = require('zip-a-folder');

                    zip_a_folder.zip(`${localDir}download/project`, `${localDir}download/data.zip`)
                        .then(() => {
                            res.download(`${localDir}download/data.zip`);
                        })
                        .catch(err => {
                            return res.status(500).json({ success: false, message: err.message });
                        });
                }
            });
        });
    }).catch(err => {
        res.status(500).json({ success: false, message: "Project doesn't exist!" });
    });
};