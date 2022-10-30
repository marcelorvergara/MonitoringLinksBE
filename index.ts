import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import passport from "passport";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import { NextFunction } from "express-serve-static-core";
import cookieSession from "cookie-session";
import cookieParser from "cookie-parser";
import { getClient } from "./repository/mongodb.db";
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
const CLIENT_HOME_PAGE_URL = "http://localhost:3000/";

// set up cors to allow us to accept requests from our client
app.use(
  cors({
    origin: "http://localhost:3000", // allow to server to accept request from different origin
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

app.use("/auth", authRoutes);

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
  )
);

app.get("/", (_req: Request, res: Response) => {
  res.send("Express + Typescript Server");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
