import controller from "../controller";
import express from "express";
import multer from "multer";
const upload = multer();

export default (app: express.Application) => {
  app.post(
    "/uploadNotary/file",
    upload.single("fileData"),
    (req: express.Request, res: express.Response) => {
      req.socket.removeAllListeners("timeout");
      controller.parseFileUpload(
        req.file,
        JSON.parse(req.body.fileDetails),
        res
      );
    }
  );

  app.post(
    "/uploadNotary/text",
    (req: express.Request, res: express.Response) => {
      controller.parseTextUpload(req.body, res);
    }
  );

  app.get(
    "/notary/phone/:phone",
    (req: express.Request, res: express.Response) => {
      controller.getNotaryFilesByPhoneNumber(req.params.phone, res);
    }
  );

  app.get("/appConfigs", (req: express.Request, res: express.Response) => {
    controller.getAppConfigs(res);
  });

  app.delete(
    "/notary/phone/:phone/:id",
    (req: express.Request, res: express.Response) => {
      controller.deleteNotaryFiles(req.params.phone, req.params.id, res);
    }
  );
};
