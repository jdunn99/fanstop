/** Imports */
import express from "express";
import "reflect-metadata";
import mongoose = require("mongoose");
import config from "./Model/config";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./Resolvers/user";
import { PostResolver } from "./Resolvers/post";
import { User } from "./Model/User";
import { Post } from "./Model/Post";
import { getModelForClass } from "@typegoose/typegoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";

const main = async () => {
  /** Setup */
  const auth = require("./middleware/auth");
  const app = express();
  const corsOptions = {
    origin: "http://localhost:3000",
    credentials: true,
  };

  /** Middleware */
  app.use(cookieParser());
  app.use(auth);
  app.set("trust proxy", 1);
  app.use(cors(corsOptions));

  /** Database setup */
  await mongoose
    .connect(config.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: config.MONGO_DB_NAME,
    })
    .catch((err) => console.log(err));

  /** Initialize GraphQL */
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver, PostResolver],
      validate: false,
    }),
    context: async ({ req, res, connection }) => {
      if (connection) {
        return {
          ...connection.context,
          UserModel: getModelForClass(User),
        };
      } else {
        return {
          req,
          res,
          UserModel: getModelForClass(User),
          PostModel: getModelForClass(Post),
        };
      }
    },
    playground: true,
  });

  /** Apollo setup */
  apolloServer.applyMiddleware({ app, cors: false });
  const httpServer = http.createServer(app);

  apolloServer.installSubscriptionHandlers(httpServer);

  httpServer.listen(config.PORT, () =>
    console.log(`Server started on ${config.PORT}`)
  );
};

main().catch((err) => console.log(err)); // Debug errors.
