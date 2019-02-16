const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const configRoutes = require("./routes");

app.use(bodyParser.json());
configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
});6
