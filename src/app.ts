import express from "express";
import cors from "cors";
import AppConfig from "./config/appConfig";
import MainRoute from "./routers";
import bodyParser from "body-parser";
import connectWebsiteDatabase from "./config/databaseConfig";
import http from "http";
import SocketService from "./services/socket.service";
import path from "path";

/**
 * Make express app
 */
const app: express.Application = express();
const server = http.createServer(app);
const socketService = new SocketService(server);

app.use('/assets', express.static(path.join(__dirname, '../assets')));

console.log("path___", path.join(__dirname, '../@assets'))


/**
 * Website Database Connection
 */
connectWebsiteDatabase();

app.use(bodyParser.json({ type: "application/json", limit: "100mb" }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));
app.use(cors());

/**
 * API routes
 */
app.use("/", MainRoute);

/**
 * Handle the error in middleware request validation error
 */
app.use((err, req, res, next) => {
    if (err && err.error && err.error.isJoi) {
        console.log("app error", err.error);
        return res.status(400).json({
            responseStatus: "fail",
            responseCode: 400,
            responseMessage: err.error.details[0].message,
        });
    }
    next(err);
});

/**
 *  App Listing
 */
server.listen(AppConfig.port, () => {
    console.log(`Application is running on PORT ${Number(AppConfig.port)}`);
})



export default app;
