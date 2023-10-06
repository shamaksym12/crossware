const db = require("../../db/models");
const Log = db.Log;
const { lookup } = require('geoip-lite');

exports.create = (req, res) => {
    const client_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const client_location = lookup(client_ip);

    const newLog = {
        ...req.body,
        location_lat: client_location ? client_location.ll[0] : 0,
        location_lng: client_location ? client_location.ll[1] : 0,
        ip_address: client_ip
    };

    Log.create(newLog)
        .then(data => {
            return res.status(200).json({ success: true, data: data });
        })
        .catch(err => {
            return res.status(500).json({ success: false, message: err.message });
        });
};