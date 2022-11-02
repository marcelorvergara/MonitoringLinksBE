"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const passport_1 = __importDefault(require("passport"));
const cors_1 = __importDefault(require("cors"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const cookie_session_1 = __importDefault(require("cookie-session"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const mongodb_db_1 = require("./repository/mongodb.db");
const winston_1 = __importDefault(require("winston"));
var FacebookStrategy = require("passport-facebook").Strategy;
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
const port = process.env.PORT;
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
app.use("/auth", auth_routes_1.default);
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
passport_1.default.deserializeUser((profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    const userProfile = Object.assign({}, profile[0]);
    try {
        const client = (0, mongodb_db_1.getClient)();
        yield client.connect();
        const user = yield client
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
        throw new Error(err);
    }
}));
passport_1.default.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "/auth/facebook/redirect",
    profileFields: ["id", "displayName", "photos", "email"],
}, function (accessToken, refreshToken, profile, done) {
    return __awaiter(this, void 0, void 0, function* () {
        // find current user in UserModel
        try {
            const client = (0, mongodb_db_1.getClient)();
            yield client.connect();
            const currentUser = yield client
                .db("monitoringLinks")
                .collection("users")
                .find({})
                .toArray();
            if (currentUser.length === 0) {
                const newUser = yield client
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
    });
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
