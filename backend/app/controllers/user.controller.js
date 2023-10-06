const db = require("../../db/models");
const User = db.User;
const { Op } = require("sequelize");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const TLSSigAPIv2 = require('tls-sig-api-v2');

exports.signup = (req, res) => {
    if (!req.body.first_name) return res.status(400).json({ success: false, message: 'First Name cannot be empty!' });
    if (!req.body.last_name) return res.status(400).json({ success: false, message: 'Last Name cannot be empty!' });
    if (!req.body.email) return res.status(400).json({ success: false, message: 'Email cannot be empty!' });
    if (!req.body.password) return res.status(400).json({ success: false, message: 'Password cannot be empty!' });
    if (!req.body.phone_number) return res.status(400).json({ success: false, message: 'Phone number cannot be empty!' });
    // if (!req.body.privilege) return res.status(400).json({ success: false, message: 'Privilege cannot be empty!' });

    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Internal Server Error' });
        }

        bcrypt.hash(req.body.password, salt, (err, hash) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Internal Server Error' });
            }

            const user = {
                ...req.body,
                privilege: 'user',
                company_id: 1,
                password: hash,
                company_id: 1
            };

            User.create(user)
                .then(data => {
                    return res.status(200).json({ success: true, user: data });
                })
                .catch(err => {
                    console.log(err, 'User create error!');
                    return res.status(500).json({ success: false, message: err.message });
                });
        });
    });
};

exports.login = (req, res) => {
    if (!req.body.email) return res.status(400).json({ success: false, message: 'Email cannot be empty!' });
    if (!req.body.password) return res.status(400).json({ success: false, message: 'Password cannot be empty!' });

    const { email, password } = req.body;

    User.findOne({where: { email: email }}).then((user) => {
        if (!user) {
            return res.status(200).json({ success: false, message: 'User not found' });
        }

        bcrypt.compare(password, user.password).then((isMatch) => {
            if (!isMatch) {
                return res.status(200).json({ success: false, message: 'Password incorrect' });
            }

            if (user.privilege == "admin") {
                if (!req.body.company_code) return res.status(400).json({ success: false, message: 'Admin should input company code!' });

                const { company_code } = req.body;

                if (user.company_code !== company_code) return res.status(400).json({ success: false, message: 'Company code incorrect!' });
            }

            const payload = {
                id: user.id,
                email: user.email
            };

            jwt.sign(
                payload,
                'crossware',
                { expiresIn: 1000 * 60 * 60 * 2 },
                (err, token) => {
                    if (err) {
                        return res.status(500).json({ success: false, message: 'Internal Server Error' });
                    }

                    const api = new TLSSigAPIv2.Api(process.env.TECENT_APP_ID, process.env.TECENT_APP_SECRET);
                    const sig = api.genSig(user.id, 86400*180);

                    return res.json({
                        success: true,
                        token: 'Bearer ' + token,
                        user: {
                        ...user,
                        sig,
                        }
                    });
                }
            );
        });
    });
};

exports.getAllLocations = (req, res) => {
    User.findByPk(req.user.id).then(user => {
        const online = new Date();
        online.setMinutes(online.getMinutes() - 2);
        User.findAll({
            where: {
                company_id: user.company_id,
                location_updated_time: {
                    [Op.gt]: online,
                },
            },
            attributes: ["id", "first_name", "last_name", "email", "phone_number", "location_lat", "location_lng"]
        }).then(users => {
            return res.json({
                success: true,
                data: users
            })
        }).catch(err => {
            return res.status(500).json({success: false, message: err.message});
        })
    }).catch(err => {
        return res.status(500).json({success: false, message: err.message});
    })
}

exports.setLocation = (req, res) => {
    User.update(
        {
            location_lat: req.body.location_lat,
            location_lng: req.body.location_lng,
            location_updated_time: new Date(),
        },
        {where: {id: req.user.id}}
    ).then(() => {
        return res.json({success: true})
    }).catch(err => {
        return res.status(500).json({success: false, message: err.message});
    })
}