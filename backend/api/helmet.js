const express = require('express');
const { check, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const auth = require("./middleware/auth");
const Helmet = require('../models/Helmet');
const { lookup } = require('geoip-lite');

const router = express.Router();

const checkActive = async () => {
  const helmets = await Helmet.find();

  helmets.map(async (helmet) => {
    const updatedTime = new Date(helmet.updated_at);
    const currentTime = new Date();
    const checkValue = 10 * 60 * 1000;
    
    if ((currentTime.getTime() - updatedTime.getTime()) > checkValue && helmet.trtcId !== '222' && helmet.deviceId) {
      await helmet.delete();

      console.log('Delted a helmet ' + helmet.trtcId);
    }
  });
};

setInterval(checkActive, 60 * 1000);

router.get("/", auth, (req, res) => {
  Helmet.find().then((helmets) => {
    res.status(200).json({
      success: true,
      data: helmets
    });
  });
});

router.post("/", (req, res) => {
  const client_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const client_location = lookup(client_ip);
  console.log(client_ip, client_location, 'client_location')

  if (req.body.deviceId && req.body.trtcId) {
    Helmet.findOne({ deviceId: req.body.deviceId })
    .then((helmet) => {
      if (helmet) {
        helmet.name = req.body.name;
        helmet.trtcId = req.body.trtcId;
        helmet.deviceId = req.body.deviceId;
        helmet.ip_address = client_ip,
        helmet.locationLat = req.body.locationLat ? req.body.locationLat : client_location ? client_location.ll[0] : 0;
        helmet.locationLng = req.body.locationLng ? req.body.locationLng : client_location ? client_location.ll[1] : 0;
        helmet.updated_at = new Date();

        helmet.save((error) => {
          if (error) {
            return res.status(200).json({ success: false, message: error });
          }

          return res.status(200).json({ success: true, data: helmet });
        });
      } else {
        const newHelmet = new Helmet({
          ...req.body,
          locationLat: req.body.locationLat ? req.body.locationLat : client_location ? client_location.ll[0] : 0,
          locationLng: req.body.locationLng ? req.body.locationLng : client_location ? client_location.ll[1] : 0,
          ip_address: client_ip,
          created_at: new Date(),
          updated_at: new Date()
        });
  
        newHelmet.save((error) => {
          if (error) {
            return res.status(200).json({ success: false, message: error });
          }
  
          return res.status(200).json({ success: true, data: newHelmet });
        });
      }
    });
  } else {
    const newHelmet = new Helmet({
      ...req.body,
      locationLat: client_location ? client_location.ll[0] : 0,
      locationLng: client_location ? client_location.ll[1] : 0,
      ip_address: client_ip,
      created_at: new Date(),
      updated_at: new Date()
    });

    newHelmet.save((error) => {
      if (error) {
        return res.status(200).json({ success: false, message: error });
      }

      return res.status(200).json({ success: true, data: newHelmet });
    });
  }
});

router.patch("/:id", (req, res) => {
  if (mongoose.Types.ObjectId.isValid(req.params.id)) {
    Helmet.findById(req.params.id)
      .then((helmet) => {
        if (req.body.locationLat) helmet.locationLat = req.body.locationLat;
        if (req.body.locationLng) helmet.locationLng = req.body.locationLng;
        if (req.body.name) helmet.name = req.body.name;
        if (req.body.helmetNumber) helmet.helmetNumber = req.body.helmetNumber;
        if (req.body.team) helmet.team = req.body.team;
        if (req.body.society) helmet.society = req.body.society;
        if (req.body.phoneNumber) helmet.phoneNumber = req.body.phoneNumber;
        if (req.body.email) helmet.email = req.body.email;
        helmet.updated_at = new Date();

        helmet.save((error) => {
          if (error) {
            return res.status(200).json({ success: false, message: error });
          }

          return res.status(200).json({ success: true, data: helmet });
        });
      });
  } else {
    return res.status(200).json({ success: false, message: 'Helmet inactive!' });
  }
});

router.delete("/:id", (req, res) => {
  if (mongoose.Types.ObjectId.isValid(req.params.id)) {
    Helmet.findById(req.params.id)
      .then((helmet) => {
        helmet.delete((error) => {
          if (error) {
            return res.status(200).json({ success: false, message: error });
          }

          return res.status(200).json({ success: true });
        });
      });
  } else {
    return res.status(200).json({ success: false, message: 'Helmet inactive!' });
  }
});

module.exports = router;