import { Post } from "../Model/Post";
import { Notification, NotificationPayload } from "../Model/Notification";
import { User } from "../Model/User";
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
  ObjectType,
} from "type-graphql";
import { Context } from "../types";
import { BuildMap } from "src/Model/BuildMap";
import { mongoose, DocumentType } from "@typegoose/typegoose";

/** Type Definitions */

enum PayloadType {
  LIKE,
  POST,
}

interface Payload {
  notification: NotificationPayload;
  subscribers: string[];
  type: PayloadType;
}

@InputType()
class BuildInput implements Partial<BuildMap> {
  @Field()
  type: string;

  @Field()
  value: string;
}

@ObjectType()
class UpdatedPostResponse {
  @Field()
  title: string;

  @Field()
  desc: string;
}

@Resolver(() => Post)
export class PostResolver {
  /** Queries */

  /**
   * Queries all the Posts in the database. Used in development, not production.
   * @param {ReturnModelType<typeof Post, {}>} PostModel - The database model being queried.
   * @returns {Promise<Post[]>} An array holding all of the posts.
   */
  @Query(() => [Post])
  async posts(@Ctx() { PostModel }: Context): Promise<Post[]> {
    return await PostModel.find().populate("poster", "-password");
  }

  /**
   * Fetches a post given an ID.
   * @param {string} id - the ID of the post being queried
   * @param {ReturnModelType<typeof Post, {}>} PostModel - The database model being queried.
   * @param {ReturnModelType<typeof User, {}>} UserModel - The User database being queried. Called to make sure the user is signed in.
   * @param {Request} req - The Request generated via Express.
   * @returns {Promise<Post | null>} The Post fetched, or null if the Post does not exist/User is not signed in.
   */
  @Query(() => Post, { nullable: true })
  async post(
    @Arg("id") id: string,
    @Ctx() { PostModel, UserModel, req }: Context
  ): Promise<Post | null> {
    const user = await UserModel.findOne({ _id: req.userId });
    if (!user) return null;

    return await PostModel.findOne({ _id: id }).populate("poster", "-password");
  }

  /**
   * Fetches the User's feed - a paginated collection of posts for the User's supporting array.
   * @param {string} [cursor] - Optional cursor parameter used for pagination.
   * @param {ReturnModelType<typeof Post, {}>} PostModel - The database model being queried.
   * @param {Request} req - The Request generated via Express.
   * @returns {Promise<Post[]>} - The User's feed.
   */
  @Query(() => [Post])
  async feed(
    @Ctx() { UserModel, req }: Context,
    @Arg("cursor", () => String, { nullable: true }) cursor?: string
  ): Promise<Post[]> {
    let user: DocumentType<User> | null = null;

    // Pagination
    if (!cursor) {
      user = await UserModel.findOne({ _id: req.userId }).populate({
        path: "supporting",
        select: "posts",

        populate: {
          path: "posts",
          select: "buildMap author createdAt _id title desc likes",
          options: {
            limit: 2,
            sort: { createdAt: -1 },
          },
        },
      });
    } else {
      user = await UserModel.findOne({ _id: req.userId }).populate({
        path: "supporting",
        select: "posts",

        populate: {
          path: "posts",
          select: "buildMap author createdAt _id title desc likes",
          options: {
            sort: { createdAt: -1 },
            limit: 2,
            where: {
              createdAt: {
                $lt: cursor,
              },
            },
          },
        },
      });
    }

    if (!user) return [] as Post[];

    const result = [] as Post[];

    user.supporting.forEach((sup: any) => {
      if (sup.posts.length > 0) {
        result.push(...sup.posts);
      }
    });

    // Return a paginated result from the query
    user.feed = result
      .sort((a, b) => {
        return b.createdAt.getTime() - a.createdAt.getTime();
      })
      .slice(0, 2);

    await user.save();

    return user.feed ? (user.feed as Post[]) : [];
  }

  /** Mutations */

  /**
   * Creates a Post.
   * @param {PubSubEngine} pubsub - Publishes subscriptions, used for notifications
   * @param {string} title - The title of the Post.
   * @param {string} desc - A short description of the Post
   * @param {BuildInput[]} [buildMap] - Optional parameter that builds a post for the User.
   * @param {ReturnModelType<typeof Post, {}>} PostModel - The database model being queried.
   * @param {ReturnModelType<typeof User, {}>} UserModel - The User database being queried. Called to make sure the user is signed in.
   * @param {Request} req - The Request generated via Express.
   * @returns {Promise<Post>} - The Post that was created.
   */
  @Mutation(() => Post)
  async createPost(
    @PubSub() pubsub: PubSubEngine,
    @Arg("title") title: string,
    @Arg("desc") desc: string,
    @Arg("buildMap", () => [BuildInput], { nullable: true })
    buildMap: [BuildInput],
    @Ctx() { PostModel, UserModel, req }: Context
  ): Promise<Post> {
    const user = await UserModel.findOne({ _id: req.userId });
    if (!user) throw Error();

    const post = new PostModel({
      title: title,
      likes: 0,
      posterId: req.userId.toString(),
      poster: user!._id,
      desc: desc,
      author: user.name,
    });

    post.buildMap.push(...buildMap);

    const savedPost = await post.save();

    await savedPost.populate("buildMap").execPopulate();

    if (!user.posts) user.posts = [savedPost.toObject()];
    else user.posts.push(savedPost.toObject());

    await user
      .populate({
        path: "supporters",
        select: "notifications",
      })
      .execPopulate();

    const notification = {
      _id: mongoose.Types.ObjectId().toHexString(),
      message: `${user.name} created a new post.`,
      createdAt: savedPost.createdAt,
      name: user.name,
      date: new Date(),
    } as Notification;

    const subscribers = user.supporters as [User];

    // Now fire our Notification subscription
    await pubsub.publish("NOTIFICATION", {
      notification: notification,
      type: PayloadType.POST,
      subscribers: subscribers.map((x) => x._id),
    });

    await user.save();

    return savedPost;
  }

  /**
   * Updates a Post.
   * @param {string} id - The ID of the post being updated
   * @param {string} title - The title to change the Post to
   * @param {string} desc  - The description to change the Post to
   * @param {ReturnModelType<typeof Post, {}>} PostModel - The database model being queried.
   * @param {ReturnModelType<typeof User, {}>} UserModel - The User database being queried. Called to make sure the user is signed in.
   * @param {Request} req - The Request generated via Express.
   * @returns The updated Post.
   */
  @Mutation(() => UpdatedPostResponse)
  async updatePost(
    @Arg("id") id: string,
    @Arg("title") title: string,
    @Arg("desc") desc: string,
    @Ctx() { UserModel, PostModel, req }: Context
  ): Promise<UpdatedPostResponse> {
    const user = await UserModel.findOne({ _id: req.userId });
    if (!user) throw Error();
    if (!user.posts?.includes(id)) throw Error();

    const post = await PostModel.findOne({ _id: id }).select("title desc");

    if (!post) throw Error();

    post.title = title;
    post.desc = desc;

    await post.save();

    return {
      title,
      desc,
    };
  }

  /**
   * Deletes a Post based on the ID
   * @param {string} id - The ID of the Post to be deleted
   * @param {ReturnModelType<typeof Post, {}>} PostModel - The database model being queried.
   * @param {ReturnModelType<typeof User, {}>} UserModel - The User database being queried. Called to make sure the user is signed in.
   * @param {Request} req - The Request generated via Express
   * @returns {Promise<Boolean>} Whether the operation succeeds or not.
   */
  @Mutation(() => Boolean)
  async deletePost(
    @Arg("id") id: string,
    @Ctx() { UserModel, PostModel, req }: Context
  ): Promise<Boolean> {
    const user = await UserModel.findOne({ _id: req.userId });
    if (!user) return false;
    if (!user.posts?.includes(id)) return false;

    await PostModel.deleteOne({ _id: id });
    return true;
  }

  /**
   * Updates a Post's likes when neccessary.
   * @param {string} id - The ID of the post being queried
   * @param {PubSubEngine} pubsub - Publishes subscriptions, used for notifications
   * @param {ReturnModelType<typeof Post, {}>} PostModel - The database model being queried.
   * @param {ReturnModelType<typeof User, {}>} UserModel - The User database being queried. Called to make sure the user is signed in.
   * @param {Request} req - The Request generated via Express.
   * @returns {Promise<number | null>} - The number of likes, or null if the post doesn't exist.
   */
  @Mutation(() => Int, { nullable: true })
  async likePost(
    @Arg("id") id: string,
    @PubSub() pubsub: PubSubEngine,
    @Ctx() { PostModel, UserModel, req }: Context
  ): Promise<number | null> {
    const user = (await UserModel.findOne({ _id: req.userId })) as User;
    if (!user) return null;

    const post = await PostModel.findOne({ _id: id }, async (err, result) => {
      if (err) throw Error();

      result!.likes += 1;
      await result?.save();
    });

    if (!post) return null;

    const notification = {
      _id: mongoose.Types.ObjectId().toHexString(),
      message: `${user.name} liked your post - ${post.title}.`,
      createdAt: post.createdAt,
      name: user.name,
      date: new Date(),
    } as Notification;

    await pubsub.publish("NOTIFICATION", {
      notification: notification,
      type: PayloadType.LIKE,
      subscribers: user._id,
    });

    await pubsub.publish("LIKE_SUBSCRIPTION", post.likes);

    return post.likes;
  }

  @Mutation(() => Boolean)
  async deleteAllPosts(@Ctx() { PostModel }: Context): Promise<Boolean> {
    await PostModel.deleteMany({});
    return true;
  }

  /** Subscriptions */

  /**
   * Publishes a Notification to a User when necessary.
   * @param {Payload} payload - The payload containing the notifcation data
   * @param {string} subscriber - The User the Subscription is checking.
   * @param {string[]} [_supporting] - An optional array used to determine whether or not to fire a Subscription.
   * @param {ReturnModelType<typeof User, {}>} UserModel - The User database being queried. Called to make sure the user is signed in.
   * @returns {Promise<Notification>} - The Notification being sent to the User.
   */
  @Subscription(() => Notification, {
    topics: "NOTIFICATION",
    filter: ({ payload, args }) => {
      switch (payload.type) {
        case PayloadType.LIKE:
          return args.supporting.toString().includes(payload.subscribers);
        case PayloadType.POST:
          return payload.subscribers.includes(args.subscriber);
      }
    },
  })
  async notification(
    @Root() payload: Payload,
    @Arg("subscriber") subscriber: string,
    @Arg("supporting", () => [String], { nullable: true })
    _supporting: string[],
    @Ctx() { UserModel }: Context
  ): Promise<Notification> {
    const response = {
      ...payload.notification,
      date: new Date(),
    } as Notification;

    const user = await UserModel.findOne({ _id: subscriber }).populate(
      "notifications"
    );
    user?.notifications?.push(response);
    await user?.save();

    return response;
  }

  /**
   * Updates the number of likes on a Post, when a User likes the Post.
   * @param {number} payload - The number of likes being returned
   * @returns {number} The number of likes sent to the User.
   */
  @Subscription(() => Int, {
    topics: "LIKE_SUBSCRIPTION",
  })
  likeSubscription(@Root() payload: number): number {
    return payload;
  }
}
