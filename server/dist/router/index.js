"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const controller_1 = __importDefault(require("../controller"));
const multer_1 = __importDefault(require("multer"));
const upload = multer_1.default();
exports.default = (app) => {
    app.post("/uploadNotary/file", upload.single("fileData"), (req, res) => {
        req.socket.removeAllListeners("timeout");
        controller_1.default.parseFileUpload(req.file, JSON.parse(req.body.fileDetails), res);
    });
    app.post("/updateNotary/:id", (req, res) => {
        req.socket.removeAllListeners("timeout");
        controller_1.default.parseFileUploadOverride(req.params.id, req.body, res);
    });
    app.post("/uploadNotary/text", (req, res) => {
        controller_1.default.parseTextUpload(req.body, res);
    });
    app.get("/notary/phone/:phone", (req, res) => {
        controller_1.default.getNotaryFilesByPhoneNumber(req.params.phone, res);
    });
    app.get("/appConfigs", (req, res) => {
        controller_1.default.getAppConfigs(res);
    });
    app.delete("/notary/phone/:phone/:id", (req, res) => {
        controller_1.default.deleteNotaryFiles(req.params.phone, req.params.id, res);
    });
};
//# sourceMappingURL=index.js.map