import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import passport from "passport";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import urlRoutes from "./routes/urls.routes";
import { NextFunction } from "express-serve-static-core";
import cookieSession from "cookie-session";
import cookieParser from "cookie-parser";
import { getClient } from "./repository/mongodb.db";
import winston from "winston";
import startCron from "./services/checkUrl.service";
var FacebookStrategy = require("passport-facebook").Strategy;

interface IProfile {
  _json: IUser;
}
interface IUser {
  id: string;
  name: string;
  picture: {
    data: {
      height: number;
      is_silhouetter: boolean;
      url: string;
      width: number;
    };
  };
}

dotenv.config();

const app: Express = express();
app.use(express.json());
const port = process.env.PORT;

// starting cron job
startCron();

// set up cors to allow us to accept requests from our client
app.use(
  cors({
    origin: process.env.CLIENT_URL, // allow to server to accept request from different origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // allow session cookie from browser to pass through
  })
);

app.use(
  cookieSession({
    name: "session",
    keys: ["keys"],
    maxAge: 24 * 60 * 60 * 100,
  })
);

// parse cookies
app.use(cookieParser());

app.use(passport.initialize());
app.use(passport.session());

// routes
app.use("/auth", authRoutes);
app.use("/urls", urlRoutes);

const authCheck = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    res.status(401).json({
      authenticated: false,
      message: "user has not been authenticated",
    });
  } else {
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

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(async (profile: IUser[], done) => {
  const userProfile = { ...profile[0] };
  const client = getClient();
  try {
    await client.connect();
    const user = await client
      .db("monitoringLinks")
      .collection("users")
      .findOne({ id: userProfile.id });
    if (user) {
      done(null, user);
    } else {
      done(new Error("Failed to deserialize an user"));
    }
  } catch (err) {
    throw err;
  } finally {
    client.close();
  }
});

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID!,
      clientSecret: process.env.FACEBOOK_APP_SECRET!,
      callbackURL: "/auth/facebook/redirect",
      profileFields: ["id", "displayName", "photos", "email"],
    },
    async function (
      accessToken: string,
      refreshToken: string,
      profile: IProfile,
      done: (arg0: any, arg1: any) => any
    ) {
      // find current user in UserModel
      const client = getClient();
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
      } catch (err: any) {
        console.log("err", err);
        throw new Error(err);
      } finally {
        client.close();
      }
    }
  )
);

app.get("/", (_req: Request, res: Response) => {
  res.send("Monitoring Links Api");
});

// winston
const { combine, timestamp, label, printf } = winston.format;
const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level} ${message}`;
});
global.logger = winston.createLogger({
  level: "silly",
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "monitoring-api.log" }),
  ],
  format: combine(label({ label: "monitoring-api" }), timestamp(), myFormat),
});

// error log
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err.message) {
    logger.error(`${req.method} ${req.baseUrl} - ${err.message}`);
    res.status(400).send({ error: err.message });
  } else {
    logger.error(`${req.method} ${req.baseUrl} - ${err}`);
    res.status(400).send({ error: err });
  }
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
