const Client = require('ssh2-sftp-client');

const getSftpConfig = (req, res, next) => {
    const sftp = new Client('client');
    var config = null;

    switch (req.user.email) {
        case "toyama-msh@taisei-bm.co.jp":
            config = {
                host: process.env.SFTP_HOST,
                username: 'taisei',
                password: 'taisei12345',
            };
            break;
        default:
            config = {
                host: process.env.SFTP_HOST,
                username: process.env.SFTP_USER,
                password: process.env.SFTP_PASS,
            };
            break;
    }

    req.sftp = sftp;
    req.sftp_config = config;
    
    return next();
  };
  
  module.exports = getSftpConfig;