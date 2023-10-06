const isInvalidDate = (date) => Number.isNaN(date.getTime());

const convertDateFormat = (str) => {
    const date = str.split('_');
    return date[0] + ' ' + date[1].replace(/-/g, ':');
};

const fileListFilter = (fileList) => {
    fileList = fileList.filter(file => {
        return file.name.endsWith('.jpeg') || file.name.endsWith('.mp4');
    });
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

exports.getmedias = (req, res) => {
    const connection = req.sftp.connect(req.sftp_config);
    connection.then(() => {
        return req.sftp.list(`/data/project${req.params.project_id}/`)
    }).then((list) => {
        mediaList = fileListFilter(list);

        if (req.query.from || req.query.to) {
            const from = new Date(req.query.from);
            const to = new Date(req.query.to);

            mediaList = mediaList.filter(media => media.date >= from && media.date <= to);
        }

        res.status(200).json({
            success: true,
            data: mediaList.map((file) => {return {...file, date: file.date.toLocaleString("ja-JP")}}),
        });
    });
};

exports.getMedia = (req, res) => {
    const connection = req.sftp.connect(req.sftp_config);
    connection.then(() => {
        return req.sftp.get(`/data/project${req.params.project_id}/${req.params.path}`)
    }).then((stream) => {
        if (req.params.path.endsWith('.mp4')) {
            res.setHeader('Content-Type', 'video/mp4');
        } else {
            res.setHeader('Content-Type', 'image/jpeg');
        }
        res.status(200).send(stream);
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
    if(!fs.existsSync(`${localDir}download/media`)) {
        fs.mkdirSync(`${localDir}download/media`);
    };
    const connection = req.sftp.connect(req.sftp_config);
    connection.then(() => {
        req.sftp.fastGet(`/data/project${req.params.project_id}/${req.params.path}`, `${localDir}download/media/${req.params.path}`).then(() => {
            return res.download(`${localDir}download/media/${req.params.path}`);
        }).catch(error => {
            console.log(error);
            return res.status(500).json({ success: false });
        });
    });
};
