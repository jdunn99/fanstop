import { User } from '../Model/User';
import {
	Resolver,
	Query,
	Ctx,
	Mutation,
	Arg,
	ObjectType,
	Field,
} from 'type-graphql';
import { Context } from '../types';
import bcrypt from 'bcrypt';
import { tokenize } from '../tokenize';

@ObjectType()
class InputError {
	@Field()
	field: string;
	@Field()
	message: string;
}

@ObjectType()
class Token {
	@Field()
	access?: string;
	@Field()
	refresh?: string;
}

@ObjectType()
class UserResponse {
	@Field(() => [InputError], { nullable: true })
	errors?: InputError[];

	@Field(() => User, { nullable: true })
	user?: User;

	@Field(() => Token, { nullable: true })
	token?: Token;
}

@Resolver(() => User)
export class UserResolver {
	/*
	 * @desc: Gets the logged in User
	 * @params:
	 * @returns: User | null
	 */
	@Query(() => User, { nullable: true })
	async user(@Ctx() { UserModel, req }: Context): Promise<User | null> {
		if (!req.userId) return null;

		return await UserModel.findOne({ _id: req.userId })
			.populate({ path: 'posts', options: { sort: { createdAt: -1 } } })
			.populate('supporting', '-password -admin')
			.populate('notifications');
	}

	/*
	 * @desc: Fetch a user by id
	 * @params:
	 * @returns: [User]
	 */
	@Query(() => User, { nullable: true })
	async fetchUser(
		@Arg('id') id: string,
		@Ctx() { UserModel }: Context
	): Promise<User | null> {
		const result = await UserModel.findOne({ _id: id }).populate({
			path: 'posts',
			options: { sort: { createdAt: -1 } },
		});

		console.log(result);
		return result;
	}

	/*
	 * @desc: Gets the users from the database
	 * @params:
	 * 	@param => id: string
	 * @returns: User
	 */
	@Query(() => [User])
	async users(@Ctx() { UserModel }: Context): Promise<User[]> {
		const result = await UserModel.find().populate('posts');
		console.log(result);
		return result;
	}

	/*
	 * @desc: Registers a user to our database
	 * @params:
	 *  @param => name: string
	 *  @param => password: string
	 *  @param => email: string
	 * @returns: UserResponse
	 */
	@Mutation(() => UserResponse)
	async register(
		@Arg('name') name: string,
		@Arg('password') password: string,
		@Arg('email') email: string,
		@Ctx() { UserModel }: Context
	): Promise<UserResponse> {
		const error = [] as any;

		if (password.length < 6)
			error.push({
				field: 'password',
				message: 'password is not valid',
			});

		const hashed = bcrypt.hashSync(password, 10);

		const user = await UserModel.findOne({ email: email.toLowerCase() });

		if (user !== null) {
			return {
				errors: [
					{
						field: 'email',
						message: 'user already exists',
					},
					...error,
				],
			};
		} else if (error.length > 1) {
			return {
				errors: error,
			};
		} else {
			const result = await UserModel.create({
				name,
				email,
				password: hashed,
				supporting: [],
				supporters: [],
			});

			return { user: result };
		}
	}

	/*
	 * @desc: Updated a user based on the requested parameters
	 * @params:
	 *  @param => name: string
	 *  @param => bio: string
	 * @param => bio: string
	 * @returns: UserResponse
	 */
	@Mutation(() => UserResponse)
	async updateUser(
		@Arg('name', { nullable: true }) name: string,
		@Arg('bio', { nullable: true }) bio: string,
		@Arg('links', { nullable: true }) links: string,
		@Ctx() { req, UserModel }: Context
	): Promise<UserResponse> {
		const user = await UserModel.findOne({ _id: req.userId });
		if (!user) {
			return {
				errors: [{ field: '', message: 'User not found' }],
			};
		}

		// TODO: Add error checking for inputs
		if (name) user.name = name;
		if (bio) user.bio = bio;
		if (links) user.links = links;

		await user.save();

		return { user: user };
	}

	/*
	 * @desc: Adds a supporter to the user
	 * @params:
	 * 	@param => id: string
	 * @returns: Boolean
	 */
	@Mutation(() => UserResponse)
	async handleSupporter(
		@Arg('id') id: string,
		@Arg('add') add: boolean,
		@Ctx() { UserModel, req }: Context
	): Promise<UserResponse> {
		const supporter = await UserModel.findOne({ _id: id }).populate(
			'posts'
		);
		if (!supporter)
			return {
				errors: [{ field: '', message: 'User is not a creator in' }],
			};

		await UserModel.findOne({ _id: req.userId }, async (err, result) => {
			if (err) throw Error();
			if (add) {
				result?.supporting.push(id);
				supporter.supporters.push(result!._id);
			} else {
				console.log(id);
				result!.supporting = result!.supporting.filter((x) => x !== id);
				supporter.supporters = supporter.supporters.filter(
					(x) => x !== result!._id
				);
			}

			await result?.save();
			await supporter.save();
		});

		return { user: supporter };
	}

	/*
	 * @desc: Logs in the user with JWTs
	 * @params:
	 * 	@param => password: string
	 * 	@param => email: string
	 * @returns: UserResponse
	 */
	@Mutation(() => UserResponse)
	async login(
		@Arg('password') password: string,
		@Arg('email') email: string,
		@Ctx() { UserModel, res }: Context
	): Promise<UserResponse> {
		// If the email doesn't exist then no matter what password doesn't exist -> return
		console.log('email', email, ' password', password);

		const user = await UserModel.findOne({ email: email })
			.populate('posts')
			.populate('supporting', '-password -admin ');
		if (!user)
			return {
				errors: [
					{
						field: 'email',
						message: 'Email does not exist',
					},
				],
			};

		// Invalid password check
		if (!bcrypt.compareSync(password, user.password))
			return {
				errors: [
					{
						field: 'password',
						message: 'Password is incorrect',
					},
				],
			};

		// genereate our tokens
		const { access, refresh } = tokenize(user);
		res.cookie('access', access);
		res.cookie('refresh', refresh);

		return {
			user,
			token: {
				access,
				refresh,
			},
		};
	}

	/*
	 * @desc: Invalidates JWTs and logs the user out
	 * @params:
	 * @returns: Boolean
	 */
	@Mutation(() => Boolean)
	async logout(@Ctx() { req, res }: Context): Promise<Boolean> {
		if (!req.userId) return false; // user is not signed in

		res.clearCookie('access');
		res.clearCookie('refresh');

		return true;
	}

	@Mutation(() => Boolean)
	async deleteAll(@Ctx() { UserModel }: Context): Promise<Boolean> {
		await UserModel.deleteMany({});

		return true;
	}

	@Mutation(() => User)
	async deleteNotification(
		@Arg('id') id: string,
		@Ctx() { req, UserModel }: Context
	): Promise<User> {
		const user = await UserModel.findOne({ _id: req.userId }).populate(
			'notifications'
		);
		if (!user) throw Error();

		const result = user.notifications?.filter((x: any) => x._id !== id);
		user.notifications = result;

		await user.save();

		return user;
	}
}
