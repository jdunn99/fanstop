/** Imports */
import { User } from "../Model/User";
import {
  Resolver,
  Query,
  Ctx,
  Mutation,
  Arg,
  ObjectType,
  Field,
} from "type-graphql";
import { Context } from "../types";
import bcrypt from "bcrypt";
import { tokenize } from "../tokenize";

/** Type Definitions */

/**
 * Represents an Error when a User inputs something into a Field.
 */
@ObjectType()
class InputError {
  @Field()
  field: string;
  @Field()
  message: string;
}

/**
 * JWT Authentication class to be used with GraphQL.
 */
@ObjectType()
class Token {
  @Field()
  access?: string;
  @Field()
  refresh?: string;
}

/**
 * Response class when called by a mutation in the User resolver.
 */
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
  /** Queries */

  /**
   * Fetches the logged in User (if it exists). Paginates their posts.
   * @param {string} [cursor] - Optional cursor paramter for pagination.
   * @param {ReturnModelType<typeof User, {}>} UserModel - The User database being queried. Called to make sure the user is signed in.
   * @param {Request} req - The Request generated via Express.
   * @returns {Promise<User | null} - The logged in User (if it exists).
   */
  @Query(() => User, { nullable: true })
  async user(
    @Arg("cursor", { nullable: true }) cursor: string,
    @Ctx() { UserModel, req }: Context
  ): Promise<User | null> {
    if (!req.userId) return null; // Not signed in. Return null.

    // Pagination
    if (!cursor)
      return await UserModel.findOne({ _id: req.userId })
        .populate({
          path: "posts",
          options: { limit: 15, sort: { createdAt: -1 } },
        })
        .populate("supporting", "-password -admin")
        .populate("notifications")
        .populate("supporters", "name");

    return await UserModel.findOne({ _id: req.userId })
      .populate({
        path: "posts",
        options: {
          limit: 15,
          sort: {
            createdAt: -1,
          },

          where: {
            createdAt: {
              $lt: cursor,
            },
          },
        },
      })
      .populate("supporting", "-password -admin")
      .populate("notifications")
      .populate("supporters", "name");
  }

  /**
   * Fetches a User given an ID. Paginates the User's Posts.
   * @param {string} id - The ID of the user being fetched.
   * @param {string} [cursor] - Optional cursor paramter for pagination.
   * @param {ReturnModelType<typeof User, {}>} UserModel - The User database being queried. Called to make sure the user is signed in.
   * @returns {Promise<User | null} - The queried User (if it exists)
   */
  @Query(() => User, { nullable: true })
  async fetchUser(
    @Arg("cursor", () => String, { nullable: true }) cursor: string,
    @Arg("id") id: string,
    @Ctx() { UserModel }: Context
  ): Promise<User | null> {
    // Pagination
    if (!cursor)
      return await UserModel.findOne({ _id: id })
        .populate({
          path: "posts",
          options: {
            limit: 15,
            sort: { createdAt: -1 },
          },
        })
        .populate("supporters", "name");

    const result = await UserModel.findOne({ _id: id })
      .populate({
        path: "posts",
        options: {
          limit: 15,
          sort: { createdAt: -1 },
          where: {
            createdAt: {
              $lt: cursor,
            },
          },
        },
      })
      .populate("supporters", "name");

    return result;
  }

  /**
   * Fetches the current registerd Users
   * @param {string} [cursor] - Optional cursor paramter for Pagination
   * @param {ReturnModelType<typeof User, {}>} UserModel - The User database being queried. Called to make sure the user is signed in.
   * @returns {Promise<User>} - A paginated array of Users
   */
  @Query(() => [User])
  async users(
    @Arg("cursor", { nullable: true }) cursor: string,
    @Ctx() { UserModel }: Context
  ): Promise<User[]> {
    return !cursor
      ? await UserModel.find().limit(2).populate("posts")
      : await UserModel.find({ _id: { $gt: cursor } }).limit(2);
  }

  /** Mutations */

  /**
   * Registers a User to the database.
   * @param {string} name - The User's name
   * @param {string} password - The User's password
   * @param {string} email - The User's email
   * @param {ReturnModelType<typeof User, {}>} UserModel - The User database being queried. Called to make sure the user is signed in.
   * @returns {Promise<UserResponse>} The Response generated from registration.
   */
  @Mutation(() => UserResponse)
  async register(
    @Arg("name") name: string,
    @Arg("password") password: string,
    @Arg("email") email: string,
    @Arg("bio", { nullable: true }) bio: string,
    @Ctx() { UserModel }: Context
  ): Promise<UserResponse> {
    const error = [] as any;

    // Make sure the password length is at least 6 characters
    if (password.length < 6)
      error.push({
        field: "password",
        message: "Password must be 6 or more characters.",
      });

    // Checks if a User exists with the requested email
    const user = await UserModel.findOne({ email: email.toLowerCase() });

    // Hashes and stores the hash in our database.
    const hashed = bcrypt.hashSync(password, 10);

    if (user !== null) {
      return {
        errors: [
          {
            field: "email",
            message: "user already exists",
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
        bio: bio ? bio : "",
        password: hashed,
        supporting: [],
        supporters: [],
      });

      return { user: result };
    }
  }

  /**
   * Logs a User in with JWT
   * @param {string} password - The User's password.
   * @param {string} email - The User's email.
   * @param {ReturnModelType<typeof User, {}>} UserModel - The User database being queried.
   * @param {Response} res - Express response used to set JWTs.
   * @returns - The Logged in User (if successful). Otherwise null.
   */
  @Mutation(() => UserResponse)
  async login(
    @Arg("password") password: string,
    @Arg("email") email: string,
    @Ctx() { UserModel, res }: Context
  ): Promise<UserResponse> {
    const user = await UserModel.findOne({ email: email })
      .populate("posts")
      .populate("supporting", "-password -admin ")
      .populate("supporters", "name");
    if (!user)
      return {
        errors: [
          {
            field: "email",
            message: "Email does not exist",
          },
        ],
      };

    // Invalid password check
    if (!bcrypt.compareSync(password, user.password))
      return {
        errors: [
          {
            field: "password",
            message: "Password is incorrect",
          },
        ],
      };

    // genereate our tokens
    const { access, refresh } = tokenize(user);
    res.cookie("access", access);
    res.cookie("refresh", refresh);

    return {
      user,
      token: {
        access,
        refresh,
      },
    };
  }

  /**
   * Invalidates JWTs and logs the User out.
   * @param {Request} req - The Request generated via Express.
   * @param {Response} res - The Response generated via Express. Used to invalidate JWTs.
   * @returns {boolean} Whether or not the JWTs were successfully invalidated.
   */
  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: Context): Boolean {
    if (!req.userId) return false; // user is not signed in

    res.clearCookie("access");
    res.clearCookie("refresh");

    return true;
  }

  /**
   * Updates a User.
   * @param {string} [name] - Optional name to be changed to.
   * @param {ReturnModelType<typeof User, {}>} UserModel - The User database being queried. Called to make sure the user is signed in.
   * @param {Request} req - The Request generated via Express.
   * @returns {Promise<UserResponse>} -  The updated User.
   */
  @Mutation(() => UserResponse)
  async updateUser(
    @Arg("name", { nullable: true }) name: string,
    @Arg("bio", { nullable: true }) bio: string,
    @Arg("image", { nullable: true }) image: string,
    @Ctx() { req, UserModel }: Context
  ): Promise<UserResponse> {
    const user = await UserModel.findOne({ _id: req.userId });
    if (!user) {
      return {
        errors: [{ field: "", message: "User not found" }],
      };
    }

    if (name) user.name = name;
    if (bio) user.bio = bio;
    if (image) user.image = image;
    await user.save();

    return { user: user };
  }

  /**
   * Adds or removes a User from another User's supporters.
   * @param {string} id - The supporters ID.
   * @param {boolean} add - Determines if we are adding or removing from the supports array.
   * @param {ReturnModelType<typeof User, {}>} UserModel - The User database being queried. Called to make sure the user is signed in.
   * @param {Request} req - The Request generated via Express.
   * @returns {Promise<UserResonse>} - The Updated User.
   */
  @Mutation(() => UserResponse)
  async handleSupporter(
    @Arg("id") id: string,
    @Arg("add") add: boolean,
    @Ctx() { UserModel, req }: Context
  ): Promise<UserResponse> {
    const supporter = await UserModel.findOne({ _id: id })
      .populate("posts", "title createdAt desc")
      .populate("supporters", "name")
      .populate("supporting", "name email");

    if (!supporter)
      return {
        errors: [{ field: "", message: "User is not found" }],
      };

    const user = await UserModel.findOne({ _id: req.userId });
    if (!user)
      return {
        errors: [{ field: "", message: "Not signed in." }],
      };

    if (add) {
      user.supporting.push(supporter);
      supporter.supporters.push(user);
    } else {
      user.supporting = user.supporting.filter((x) => {
        return x?.toString() !== id;
      });

      supporter.supporters = supporter.supporters.filter((x) => {
        return (x as User)._id?.toString() !== user._id.toString();
      });
      console.log(supporter.supporters);
    }

    await user.save();
    await supporter.save();

    return { user: supporter };
  }

  @Mutation(() => Boolean)
  async clearSupporters(@Ctx() { UserModel }: Context): Promise<Boolean> {
    const users = await UserModel.find({});
    users.forEach(async (user) => {
      user.supporters = [];
      user.supporting = [];
      await user.save();
    });
    return true;
  }
  @Mutation(() => Boolean)
  async deleteAll(@Ctx() { UserModel }: Context): Promise<Boolean> {
    await UserModel.deleteMany({});

    return true;
  }

  /**
   * Removes a Notifcation from the Array
   * @param {string} id - The ID of the Notification to be removed
   * @param {ReturnModelType<typeof User, {}>} UserModel - The User database being queried. Called to make sure the user is signed in.
   * @param {Request} req - The Request generated via Express.
   * @returns {Promise<User>} - The Updated User.
   */
  @Mutation(() => User)
  async deleteNotification(
    @Arg("id") id: string,
    @Ctx() { req, UserModel }: Context
  ): Promise<User> {
    const user = await UserModel.findOne({ _id: req.userId }).populate(
      "notifications"
    );
    if (!user) throw Error();

    const result = user.notifications?.filter((x: any) => x._id !== id);
    user.notifications = result;

    await user.save();

    return user;
  }
}
