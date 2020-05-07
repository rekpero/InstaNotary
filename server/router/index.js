const repository = require("../repository");
var multer = require("multer");
var upload = multer();

module.exports = (app) => {
  app.post("/uploadNotary", upload.single("fileData"), (req, res) => {
    // console.log(req.file);
    repository.parseFileUpload(req.file, req.body, res);
  });

  app.get("/notary/:hash", (req, res) => {
    // console.log(req.file);
    repository.getIpfsFile(req.params.hash, res);
  });
};
