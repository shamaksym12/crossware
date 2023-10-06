require('dotenv').config();

module.exports = {
    "dev_google": {
        "username": process.env.MYSQL_USER,
        "password": process.env.MYSQL_PASSWORD,
        "database": process.env.MYSQL_DB,
        "host": process.env.MYSQL_HOST,
        "dialect": "mysql",
        "pool": {
            "max": 15,
            "min": 5,
            "acquire": 30000,
            "idle": 20000,
            "evict": 15000
        }
    },
    "dev_local": {
        "username": "root",
        "password": "",
        "database": "crossware",
        "host": "db",
        "dialect": "mysql",
        "pool": {
            "max": 15,
            "min": 5,
            "acquire": 30000,
            "idle": 20000,
            "evict": 15000
        }
    },
};