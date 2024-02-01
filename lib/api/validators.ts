import { z } from "zod";

export type ValidMethods = "GET" | "POST" | "PUT" | "DELETE";

// Comments
export const CommentValidators = {
  CommentSchema: z.object({
    id: z.string().cuid(),
    userId: z.string().cuid(),
    postId: z.string().cuid(),
    content: z.string(),
    user: z.object({
      id: z.string().cuid(),
      name: z.string(),
    }),
    createdAt: z.date(),
    updatedAt: z.date(),
  }),
  CreateCommentSchema: z.object({
    content: z.string(),
    postId: z.string().cuid(),
    userId: z.string().cuid(),
  }),
};
export type CreateCommentArgs = z.infer<
  typeof CommentValidators.CreateCommentSchema
>;
export type Comment = z.infer<typeof CommentValidators.CommentSchema>;

// Communities
export const CommunitiesValidators = {
  CommunitySchema: z.object({
    id: z.string().cuid(),
    name: z.string(),
    slug: z.string(),
    creatorId: z.string().cuid(),
    createdAt: z.date(),
    description: z.string(),
    updatedAt: z.date(),
    creator: z.object({
      id: z.string().cuid(),
      name: z.string(),
      image: z.string().nullable(),
    }),
  }),
  CreateCommunitySchema: z.object({
    name: z.string(),
    slug: z.string(),
    tags: z.array(z.string().cuid()),
    description: z.string().default(""),
    creatorId: z.string().cuid(),
  }),
  CommunityQuerySchema: z.object({
    communityId: z.string(),
  }),
};
export type Community = z.infer<typeof CommunitiesValidators.CommunitySchema>;
export type CreateCommunityArgs = z.infer<
  typeof CommunitiesValidators.CreateCommunitySchema
>;
export type CommunityResponse = {
  community: Community;
  isOwn: boolean;
  isSubscriber: boolean;
};
export type CommunityByIDQuery = z.infer<
  typeof CommunitiesValidators.CommunityQuerySchema
>;

// Posts

const PostValidTagsSchema = z.union([
  z.literal("h1"),
  z.literal("h2"),
  z.literal("h3"),
  z.literal("h4"),
  z.literal("h5"),
  z.literal("p"),
  z.literal("img"),
]);
export const ContentSchema = z.object({
  id: z.string(),
  tag: PostValidTagsSchema,
  data: z.object({
    text: z.string().optional(),
    src: z.string().optional(),
    formData: z.any().optional(),
  }),
});
export const PostVailidators = {
  PostSchema: z.object({
    id: z.string().cuid(),
    description: z.string().nullable(),
    title: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
    views: z.number(),
    _count: z.object({
      comments: z.number(),
      likes: z.number(),
    }),
    image: z.string().nullable(),
    commentsVisible: z.boolean(),
    subscribersOnly: z.boolean(),
    isPublished: z.boolean(),
    author: z.object({
      id: z.string().cuid(),
      name: z.string(),
      community: z.object({
        slug: z.string(),
        name: z.string(),
      }),
      image: z.string().nullable(),
    }),
  }),
  PostUpdateSchema: z.object({
    id: z.string().cuid(),
    authorId: z.string().cuid(),
    title: z.string().optional(),
    description: z.string().optional().nullable(),
    content: z.array(ContentSchema).optional(),
    image: z.string().optional().nullable(),
    isPublished: z.boolean().optional(),
    subscribersOnly: z.boolean().optional(),
    commentsVisible: z.boolean().optional(),
  }),
  PostContentSchema: ContentSchema,
};

export const PostArraySchema = z.array(PostVailidators.PostSchema);
export const CommunityPostsSchema = z.object({
  featuredPost: PostVailidators.PostSchema.nullable(),
  recentPosts: PostArraySchema,
  posts: PostArraySchema,
  unpublishedPosts: PostArraySchema,
});

export type ValidTags = z.infer<typeof PostValidTagsSchema>;
export type PostContent = z.infer<typeof PostVailidators.PostContentSchema>;
export type PostItem = z.infer<typeof PostVailidators.PostSchema>;
export type PostUpdateArgs = z.infer<typeof PostVailidators.PostUpdateSchema>;
export type PostResponse = {
  post: PostItem;
  isAuthor: boolean;
  isSubscriber: boolean;
  isLiked: boolean;
};
export type CommunityPosts = z.infer<typeof CommunityPostsSchema>;

// User
export type FeedItem = Record<string, PostResponse[]>;
