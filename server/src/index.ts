import express from 'express';
import 'reflect-metadata';
import mongoose = require('mongoose');
import config from './Model/config';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { UserResolver } from './Resolvers/user';
import { PostResolver } from './Resolvers/post';
import { User } from './Model/User';
import { Post } from './Model/Post';
import { getModelForClass } from '@typegoose/typegoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const main = async () => {
	const auth = require('./middleware/auth');
	const app = express();

	// middleware
	app.use(cookieParser());
	app.use(auth);

	const corsOptions = {
		origin: 'http://localhost:3000',
		credentials: true,
	};

	app.set('trust proxy', 1);
	app.use(cors(corsOptions));

	// init mongoose
	await mongoose
		.connect(config.MONGO_URL, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			dbName: config.MONGO_DB_NAME,
		})
		.catch((err) => console.log(err));

	// init graphql
	const apolloServer = new ApolloServer({
		schema: await buildSchema({
			resolvers: [UserResolver, PostResolver],
			validate: false,
		}),
		context: ({ req, res }) => ({
			UserModel: getModelForClass(User),
			PostModel: getModelForClass(Post),
			req,
			res,
		}),
	});

	apolloServer.applyMiddleware({ app, cors: false });

	app.listen(config.PORT, () =>
		console.log(`Server started on ${config.PORT}`)
	);
};

main().catch((err) => console.log(err));
