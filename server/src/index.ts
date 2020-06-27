import express from "express";
import router from "./router";
import bodyParser from "body-parser";
import timeout from "connect-timeout";
import cors from "cors";
import dotenv from "dotenv";
import { logger } from "./utils";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000; // default port to listen

function haltOnTimedOut(req: any, res: any, next: any) {
  if (!req.timedout) next();
}
// app.use(timeout("5s"));
app.use(bodyParser.json());
app.use(haltOnTimedOut);

const loggerMiddleware = (
  request: express.Request,
  response: express.Response,
  next: any
) => {
  logger.info(`${request.method} ${request.path}`);
  next();
};

app.use(loggerMiddleware);
app.use(haltOnTimedOut);

app.use(cors());
app.use(haltOnTimedOut);

app.use("/uploadNotary/file", (req, res, next) => {
  req.setTimeout(5 * 60 * 1000); // No need to offset

  req.socket.removeAllListeners("timeout"); // This is the work around
  req.socket.once("timeout", () => {
    req.timedout = true;
    res.status(504).send("Timeout");
  });

  next();
});

router(app);

app.listen(PORT, () => logger.info(`Express server started on ${PORT}`));
