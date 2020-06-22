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

app.use(timeout("600000"));
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

router(app);

function haltOnTimedOut(req: any, res: any, next: any) {
  if (!req.timedout) next();
}

app.listen(PORT, () => logger.info(`Express server started on ${PORT}`));
