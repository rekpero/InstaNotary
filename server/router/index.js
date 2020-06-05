const repository = require("../repository");
var multer = require("multer");
var upload = multer();

module.exports = (app) => {
  app.post("/uploadNotary/file", upload.single("fileData"), (req, res) => {
    repository.parseFileUpload(req.file, JSON.parse(req.body.fileDetails), res);
  });

  app.post("/uploadNotary/text", (req, res) => {
    repository.parseTextUpload(req.body, res);
  });

  app.get("/notary/phone/:phone", (req, res) => {
    repository.getNotaryFilesByPhoneNumber(req.params.phone, res);
  });

  app.delete("/notary/phone/:phone/:id", (req, res) => {
    repository.deleteNotaryFiles(req.params.phone, req.params.id, res);
  });
};
