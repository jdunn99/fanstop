import { Post } from '../Model/Post';
import {
	Resolver,
	Int,
	Query,
	Ctx,
	Arg,
	Mutation,
	InputType,
	Field,
} from 'type-graphql';
import { Context } from '../types';

@InputType()
class BuildInput {
	@Field()
	actionType: string;

	@Field(() => Int)
	index: number;
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
		@Ctx() { PostModel }: Context
	): Promise<Post | null> {
		return await PostModel.findOne({ _id: id }).populate(
			'poster',
			'-password'
		);
	}

	/*
	 * @desc: Create a post
	 * @params:
	 *  @param => title: string
	 *  @param => text: string
	 * @returns: Post
	 */
	@Mutation(() => Post)
	async createPost(
		@Arg('title') title: string,
		@Arg('text') text: string,
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
			buildMap: buildMap,
		});

		post.text.push(text);

		const savedPost = await post.save();
		await savedPost.populate('poster', '-password').execPopulate();

		user.posts.push(savedPost.toObject());

		await user.save();
		return savedPost;
	}
}
