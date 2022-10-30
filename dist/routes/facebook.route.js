"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const express_session_1 = __importDefault(require("express-session"));
const express_1 = __importDefault(require("express"));
const __1 = __importDefault(require(".."));
const router = express_1.default.Router();
const FacebookStrategy = require("passport-facebook").Strategy;
__1.default.use((0, express_session_1.default)({ secret: ".mys3cret.", resave: true, saveUninitialized: true }));
__1.default.use(passport_1.default.initialize());
__1.default.use(passport_1.default.session());
passport_1.default.serializeUser(function (user, cb) {
    cb(null, user);
});
passport_1.default.deserializeUser(function (obj, cb) {
    cb(null, obj);
});
passport_1.default.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:8080/auth/facebook/callback",
    profileFields: ["id", "displayName", "photos", "email"],
}, function (accessToken, refreshToken, profile, done) {
    console.log(accessToken, refreshToken);
    return done(null, profile);
}));
__1.default.get("/", passport_1.default.authenticate("facebook"));
__1.default.get("/auth/facebook/callback", passport_1.default.authenticate("facebook", { failureRedirect: "/failed" }), function (_req, res) {
    res.redirect("/profile");
});
__1.default.get("/failed", (req, res) => {
    res.send("Login failed");
});
__1.default.get("/profile", (req, res) => {
    res.send("Login success" + JSON.stringify(req.user));
});
// logout user
__1.default.get("/logout", (req, res) => {
    req.session.destroy(function (err) {
        res.clearCookie("connect.sid");
        res.send("Logout success");
    });
});
