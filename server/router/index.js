const repository = require("../repository");
var multer = require("multer");
var upload = multer();

module.exports = (app) => {
  app.post("/uploadNotary/file", upload.single("fileData"), (req, res) => {
    // console.log(req.body.fileDetails, req.file);
    repository.parseFileUpload(req.file, JSON.parse(req.body.fileDetails), res);
  });

  app.post("/uploadNotary/text", (req, res) => {
    // console.log(req.body.fileDetails, req.file);
    console.log(req);
    repository.parseTextUpload(req.body, res);
  });

  app.get("/notary", (req, res) => {
    // console.log(req.file);
    repository.getAllFiles(res);
  });

  app.get("/notary/phone/:phone", (req, res) => {
    // console.log(req.file);
    repository.getNotaryFilesByPhoneNumber(req.params.phone, res);
  });

  app.get("/notary/hash/:hash", (req, res) => {
    // console.log(req.file);
    repository.getNotaryFilesByHash(req.params.hash, res);
  });

  app.delete("/notary/hash/:hash", (req, res) => {
    // console.log(req.file);
    repository.deleteNotaryFilesByHash(req.params.hash, res);
  });
};
