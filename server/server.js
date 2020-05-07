const express = require("express");
const router = require("./router");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
router(app);
app.listen(PORT, () => console.log(`Express server started on ${PORT}`));
