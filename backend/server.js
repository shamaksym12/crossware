const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');

dotenv.config();

const PORT = process.env.PORT || 8080;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(cors());

app.use("/data", express.static(__dirname + "/data"));
app.use("/data/thumbnail", express.static(__dirname + "/data/thumbnail"));

require("./app/routes/user.routes")(app);
require("./app/routes/helmet.routes")(app);
require("./app/routes/project.routes")(app);
require("./app/routes/company.routes")(app);
require("./app/routes/log.routes")(app);
require("./app/routes/report.routes")(app);
require("./app/routes/media.routes")(app);
require("./app/routes/thumbnail.routes")(app);

const db = require("./db/models");

db.sequelize.authenticate()
  .then(() => {
    console.log(`Connected db: (${process.env.DB_HOST})`);
  })
  .catch((err) => {
    console.log("Failed to connect db: " + err.message);
  });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
