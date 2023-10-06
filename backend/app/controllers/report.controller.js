const { Readable } = require("stream");

const fileListFilter = (fileList) => {
    fileList = fileList.filter(file => {
        return file.name.endsWith('.txt');
    });

    const ret = fileList.map((file, index) => {
        const filename = file.name.split('.')[0].split('---');
        let title = '', name = '';
        
        if (filename.length > 1) {
            name = filename[filename.length - 1];
            title = file.name.split('.')[0].replace('---' + name, '');
        } else {
            title = filename[0];
        }
        
        return {
            id: index,
            title: title,
            content: file.content,
            date: new Date(file.modifyTime),
            name: name,
            status: false,
            url: file.name
        }
    });

    return ret
};

exports.getReports = (req, res) => {
    const connection = req.sftp.connect(req.sftp_config);

    connection.then(() => {
        return req.sftp.list(`/data/project${req.params.project_id}/`)
    }).then((list) => {
        reportList = fileListFilter(list);

        if (req.query.from || req.query.to) {
            const from = new Date(req.query.from);
            const to = new Date(req.query.to);

            reportList = reportList.filter(report => report.date >= from && report.date <= to);
        }

        res.status(200).json({
            success: true,
            data: reportList.map((file) => {return {...file, date: file.date.toLocaleString("ja-JP")}}),
        });
    });
};

exports.getReport = (req, res) => {
    const connection = req.sftp.connect(req.sftp_config);

    connection.then(() => {
        return req.sftp.get(`/data/project${req.params.project_id}/${req.params.path}`)
    }).then((stream) => {
        if (req.params.path.endsWith('.txt')) {
            res.setHeader('Content-Type', 'text/plain');
        }
        res.status(200).send(stream);
    });
};

exports.updateReport = (req, res) => {
    const connection = req.sftp.connect(req.sftp_config);

    connection.then(() => {
        if (req.params.path.split('.')[0].split('---')[0] !== req.body.title) {
            req.sftp.rename(`/data/project${req.params.project_id}/${req.params.path}`, `/data/project${req.params.project_id}/${req.body.title}---${req.body.name}.txt`).then(() => {
                const readable = Readable.from([req.body.content])

                req.sftp.put(readable, `/data/project${req.params.project_id}/${req.body.title}---${req.body.name}.txt`).then(() => {
                    return res.status(200).json({ success: true });
                }).catch(error => {
                    console.log(error);
                    return res.status(500).json({ success: false });
                });
            }).catch(error => {
                console.log(error);
                return res.status(500).json({ success: false });
            });
        } else {
            const readable = Readable.from([req.body.content])

            req.sftp.put(readable, `/data/project${req.params.project_id}/${req.body.title}---${req.body.name}.txt`).then(() => {
                return res.status(200).json({ success: true });
            }).catch(error => {
                console.log(error);
                return res.status(500).json({ success: false });
            });
        }
    });
};

exports.createReport = (req, res) => {
    const connection = req.sftp.connect(req.sftp_config);

    return connection.then(() => {
        const readable = Readable.from([req.body.content])

        return req.sftp.put(readable, `/data/project${req.params.project_id}/${req.body.title}---${req.body.name}.txt`).then(() => {
            return res.status(200).json({ success: true });
        }).catch(error => {
            console.log(error);
            return res.status(500).json({ success: false });
        });
    });
};

exports.delete = (req, res) => {
    const connection = req.sftp.connect(req.sftp_config);
    connection.then(() => {
        req.sftp.delete(`/data/project${req.params.project_id}/${req.params.path}`).then(() => {
            return res.status(200).json({ success: true });
        }).catch(error => {
            console.log(error);
            return res.status(500).json({ success: false });
        });
    });
};

exports.download = (req, res) => {
    const localDir = __dirname.substring(0, __dirname.length - 15);
    const fs = require("fs");
    if (!fs.existsSync(`${localDir}download`)) {
        fs.mkdirSync(`${localDir}download`);
    };
    if(!fs.existsSync(`${localDir}download/report`)) {
        fs.mkdirSync(`${localDir}download/report`);
    };
    const connection = req.sftp.connect(req.sftp_config);
    connection.then(() => {
        req.sftp.fastGet(`/data/project${req.params.project_id}/${req.params.path}`, `${localDir}download/report/${req.params.path}`).then(() => {
            return res.download(`${localDir}download/report/${req.params.path}`);
        }).catch(error => {
            console.log(error);
            return res.status(500).json({ success: false });
        });
    });
};
