const express = require("express");
const router = require("./router");
const bodyParser = require("body-parser");
const timeout = require("connect-timeout");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;
app.use(timeout(120000));
app.use(bodyParser.json());
app.use(haltOnTimedOut);
app.use(cors());
app.use(haltOnTimedOut);
router(app);

function haltOnTimedOut(req, res, next) {
  if (!req.timedout) next();
}
app.listen(PORT, () => console.log(`Express server started on ${PORT}`));
