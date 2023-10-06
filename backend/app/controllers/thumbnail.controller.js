const { execSync } = require('child_process');
const sharp = require('sharp');
const fs = require('fs');

exports.getThumbnail = (req, res) => {
    const connection = req.sftp.connect(req.sftp_config);
    var thumbnail_name = req.params.path + ".jpeg";
    connection.then(() => {
        return req.sftp.exists(`/data/project${req.params.project_id}/thumbnail/${thumbnail_name}`)
    }).then((exists) => {
        if (exists) {
            req.sftp.get(`/data/project${req.params.project_id}/thumbnail/${thumbnail_name}`).then((stream) => {
                return res.status(200).send(stream);
            }).catch(error => {
                console.error(error);
                return res.status(500);
            });
        } else {
            if (req.params.path.endsWith('.jpeg')) {
                req.sftp.get(`/data/project${req.params.project_id}/${req.params.path}`, `/cache/${req.params.path}`).then(() => {
                    sharp(`/cache/${req.params.path}`).resize(200, 200).toFile(`/cache/${thumbnail_name}`, (err, resizeImage) => {
                        if (err) {
                            console.log(err);
                            res.status(500);
                        }
                        req.sftp.put(`/cache/${thumbnail_name}`, `/data/project${req.params.project_id}/thumbnail/${thumbnail_name}`);
                    });
                    remove(req.params.path, thumbnail_name);
                    return res.redirect(req.protocol + '://' + req.get('host') + req.originalUrl);
                }).catch(error => {
                    console.error(error);
                    return res.status(500);
                });
            } else if (req.params.path.endsWith('.mp4')) {
                req.sftp.get(`/data/project${req.params.project_id}/${req.params.path}`, `/cache/${req.params.path}`).then(() => {
                    execSync("ffmpeg -i '" + "/cache/" + req.params.path + "' -vf scale=200:200 -frames:v 1 '/cache/" + thumbnail_name + "'");
                    req.sftp.put(`/cache/${thumbnail_name}`, `/data/project${req.params.project_id}/thumbnail/${thumbnail_name}`);
                    remove(req.params.path, thumbnail_name);
                    return res.redirect(req.protocol + '://' + req.get('host') + req.originalUrl);
                }).catch(error => {
                    console.error(error);
                    return res.status(500);
                });
            }
        }
        res.status(500);
    });
};

function remove(name, thumbnail_name) {
    fs.unlink(`/cache/${name}`, (error) => {
        console.error(error);
    });
    fs.unlink(`/cache/${thumbnail_name}`, (error) => {
        console.error(error);
    });
}
