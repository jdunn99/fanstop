import { Post } from '../Model/Post';
import { Notification, NotificationPayload } from '../Model/Notification';
import { User } from '../Model/User';
import {
	Resolver,
	Query,
	Ctx,
	Arg,
	Mutation,
	InputType,
	Subscription,
	Field,
	Root,
	PubSub,
	PubSubEngine,
	Int,
} from 'type-graphql';
import { Context } from '../types';
import { BuildMap } from 'src/Model/BuildMap';

interface Payload {
	notification: NotificationPayload;
	subscribers: string[];
}

@InputType()
class BuildInput implements Partial<BuildMap> {
	@Field()
	type: string;

	@Field()
	value: string;
}

@Resolver(() => Post)
export class PostResolver {
	/*
	 * @desc: Gets the posts from the database
	 * @params:
	 * @returns: [Post]
	 */
	@Query(() => [Post])
	async posts(@Ctx() { PostModel }: Context): Promise<Post[]> {
		return await PostModel.find().populate('poster', '-password');
	}

	/*
	 * @desc: Gets a post based on the id
	 * @params:
	 *  @param => id: string
	 * @returns: Post | null
	 */
	@Query(() => Post, { nullable: true })
	async post(
		@Arg('id') id: string,
		@Ctx() { PostModel, UserModel, req }: Context
	): Promise<Post | null> {
		const user = await UserModel.findOne({ _id: req.userId });
		if (!user) return null;

		return await PostModel.findOne({ _id: id }).populate(
			'poster',
			'-password'
		);
	}

	@Query(() => [Post])
	async feed(@Ctx() { UserModel, req }: Context): Promise<Post[]> {
		const user = await UserModel.findOne({ _id: req.userId }).populate({
			path: 'supporting',
			select: 'posts',
			populate: {
				path: 'posts',
				select: 'createdAt _id title desc',
			},
		});

		if (!user) return [] as Post[];

		// const result =  await PostModel.find(
		const result = [] as Post[];

		user.supporting.forEach((sup: any) => {
			if (sup.posts.length > 0) {
				result.push(...sup.posts);
			}
		});

		console.log(`\n${result}`);
		user.feed = result.sort((a, b) => {
			return b.createdAt.getTime() - a.createdAt.getTime();
		});

		console.log(user.feed);
		await user.save();

		return result;
	}

	@Subscription(() => Notification, {
		topics: 'POST_NOTIFICATION',
		filter: ({ payload, args }) =>
			payload.subscribers.includes(args.subscriber),
	})
	async postNotification(
		@Root() payload: Payload,
		@Arg('subscriber') _subscriber: string
	): Promise<Notification> {
		return {
			...payload.notification,
			date: new Date(),
		} as Notification;
	}

	@Subscription(() => Notification, {
		topics: 'LIKE_NOTIFICATION',
		filter: ({ payload, args }) => {
			console.log(payload.subscribers, args.subscriber);
			return payload.subscribers.toString() !== args.subscriber;
		},
	})
	async likeNotification(
		@Root() payload: Payload,
		@Arg('subscriber') _subscriber: string
	): Promise<Notification> {
		return {
			...payload.notification,
			date: new Date(),
		} as Notification;
	}

	@Mutation(() => Int, { nullable: true })
	async likePost(
		@Arg('id') id: string,
		@PubSub() pubsub: PubSubEngine,
		@Ctx() { PostModel, UserModel, req }: Context
	): Promise<number | null> {
		const user = (await UserModel.findOne({ _id: req.userId })) as User;
		if (!user) return null;

		const post = await PostModel.findOne(
			{ _id: id },
			async (err, result) => {
				if (err) throw Error();

				result!.likes += 1;
				await result?.save();
			}
		);

		if (!post) return null;

		const notification = {
			_id: post._id,
			message: `${user.name} liked your post - ${post.title}.`,
			createdAt: post.createdAt,
			name: user.name,
			date: new Date(),
		} as Notification;

		await pubsub.publish('LIKE_NOTIFICATION', {
			notification: notification,
			subscribers: user._id,
		});

		// TODO: Push notification to Poster

		return post.likes;
	}

	/*
	 * @desc: Stores post in the database
	 * @params:
	 *  @param => title: string
	 *  @param => text: string
	 * 	@param => buildMap: [BuildInput]
	 * @returns: Post
	 */
	@Mutation(() => Post)
	async createPost(
		@PubSub() pubsub: PubSubEngine,
		@Arg('title') title: string,
		@Arg('desc') desc: string,
		@Arg('buildMap', () => [BuildInput], { nullable: true })
		buildMap: [BuildInput],
		@Ctx() { PostModel, UserModel, req }: Context
	): Promise<Post> {
		const user = await UserModel.findOne({ _id: req.userId });
		if (!user) throw Error();

		const post = new PostModel({
			title: title,
			likes: 0,
			tips: 0,
			posterId: req.userId.toString(),
			poster: user!._id,
			desc: desc,
		});

		post.buildMap.push(...buildMap);

		const savedPost = await post.save();

		await savedPost.populate('buildMap').execPopulate();

		if (!user.posts) user.posts = [savedPost.toObject()];
		else user.posts.push(savedPost.toObject());

		await user
			.populate({
				path: 'supporters',
				select: 'notifications',
			})
			.execPopulate();

		const notification = {
			_id: savedPost._id,
			message: `${user.name} created a new post.`,
			createdAt: savedPost.createdAt,
			name: user.name,
			date: new Date(),
		} as Notification;

		const subscribers = user.supporters as [User];

		console.log(subscribers);
		// Now fire our Notification subscription
		await pubsub.publish('POST_NOTIFICATION', {
			notification: notification,
			subscribers: subscribers.map((x) => x._id),
		});

		user.supporters.forEach((sup: any) => {
			UserModel.findOne({ _id: sup._id }, async (err, result) => {
				if (err) throw Error;
				result?.notifications?.push(notification);

				console.log(result);
				await result?.save();
			});
		});
		await user.save();

		return savedPost;
	}

	@Mutation(() => Boolean)
	async deleteAllPosts(@Ctx() { PostModel }: Context): Promise<Boolean> {
		await PostModel.deleteMany({});
		return true;
	}
}
