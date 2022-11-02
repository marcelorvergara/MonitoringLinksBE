"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const passport_1 = __importDefault(require("passport"));
const cors_1 = __importDefault(require("cors"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const urls_routes_1 = __importDefault(require("./routes/urls.routes"));
const cookie_session_1 = __importDefault(require("cookie-session"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const mongodb_db_1 = require("./repository/mongodb.db");
const winston_1 = __importDefault(require("winston"));
const checkUrl_service_1 = __importDefault(require("./services/checkUrl.service"));
var FacebookStrategy = require("passport-facebook").Strategy;
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
const port = process.env.PORT;
// starting cron job
(0, checkUrl_service_1.default)();
// set up cors to allow us to accept requests from our client
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // allow session cookie from browser to pass through
}));
app.use((0, cookie_session_1.default)({
    name: "session",
    keys: ["keys"],
    maxAge: 24 * 60 * 60 * 100,
}));
// parse cookies
app.use((0, cookie_parser_1.default)());
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
// routes
app.use("/auth", auth_routes_1.default);
app.use("/urls", urls_routes_1.default);
const authCheck = (req, res, next) => {
    if (!req.user) {
        res.status(401).json({
            authenticated: false,
            message: "user has not been authenticated",
        });
    }
    else {
        next();
    }
};
app.get("/", authCheck, (req, res) => {
    res.status(200).json({
        authenticated: true,
        message: "user successfully authenticated",
        user: req.user,
        cookies: req.cookies,
    });
});
passport_1.default.serializeUser(function (user, cb) {
    cb(null, user);
});
passport_1.default.deserializeUser(async (profile, done) => {
    const userProfile = Object.assign({}, profile[0]);
    const client = (0, mongodb_db_1.getClient)();
    try {
        await client.connect();
        const user = await client
            .db("monitoringLinks")
            .collection("users")
            .findOne({ id: userProfile.id });
        if (user) {
            done(null, user);
        }
        else {
            done(new Error("Failed to deserialize an user"));
        }
    }
    catch (err) {
        throw err;
    }
    finally {
        client.close();
    }
});
passport_1.default.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "/auth/facebook/redirect",
    profileFields: ["id", "displayName", "photos", "email"],
}, async function (accessToken, refreshToken, profile, done) {
    // find current user in UserModel
    const client = (0, mongodb_db_1.getClient)();
    try {
        await client.connect();
        const currentUser = await client
            .db("monitoringLinks")
            .collection("users")
            .find({})
            .toArray();
        if (currentUser.length === 0) {
            const newUser = await client
                .db("monitoringLinks")
                .collection("users")
                .insertOne(profile._json);
            if (newUser) {
                done(null, newUser);
            }
        }
        done(null, currentUser);
    }
    catch (err) {
        console.log("err", err);
        throw new Error(err);
    }
    finally {
        client.close();
    }
}));
app.get("/", (_req, res) => {
    res.send("Monitoring Links Api");
});
// winston
const { combine, timestamp, label, printf } = winston_1.default.format;
const myFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level} ${message}`;
});
global.logger = winston_1.default.createLogger({
    level: "silly",
    transports: [
        new winston_1.default.transports.Console(),
        new winston_1.default.transports.File({ filename: "monitoring-api.log" }),
    ],
    format: combine(label({ label: "monitoring-api" }), timestamp(), myFormat),
});
// error log
app.use((err, req, res, next) => {
    if (err.message) {
        logger.error(`${req.method} ${req.baseUrl} - ${err.message}`);
        res.status(400).send({ error: err.message });
    }
    else {
        logger.error(`${req.method} ${req.baseUrl} - ${err}`);
        res.status(400).send({ error: err });
    }
});
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
