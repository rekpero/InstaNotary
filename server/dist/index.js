"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router_1 = __importDefault(require("./router"));
const body_parser_1 = __importDefault(require("body-parser"));
// import timeout from "connect-timeout";
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const utils_1 = require("./utils");
dotenv_1.default.config();
const app = express_1.default();
const PORT = process.env.PORT || 5000; // default port to listen
function haltOnTimedOut(req, res, next) {
    if (!req.timedout)
        next();
}
// app.use(timeout("5s"));
app.use(body_parser_1.default.json());
app.use(haltOnTimedOut);
const loggerMiddleware = (request, response, next) => {
    utils_1.logger.info(`${request.method} ${request.path}`);
    next();
};
app.use(loggerMiddleware);
app.use(haltOnTimedOut);
app.use(cors_1.default());
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
router_1.default(app);
app.listen(PORT, () => utils_1.logger.info(`Express server started on ${PORT}`));
//# sourceMappingURL=index.js.map