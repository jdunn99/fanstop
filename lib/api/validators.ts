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
      image: z.string().nullable(),
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
    image: z.string().optional().nullable(),
    creator: z.object({
      id: z.string().cuid(),
      name: z.string(),
      image: z.string().nullable(),
    }),
    _count: z.object({
      subscribers: z.number(),
      posts: z.number(),
    }),
    tags: z
      .array(
        z.object({
          id: z.string().cuid(),
          name: z.string(),
        })
      )
      .optional(),
  }),
  CommunitySocialsSchema: z.object({
    facebook: z.string().optional(),
    instagram: z.string().optional(),
    twitter: z.string().optional(),
    tiktok: z.string().optional(),
    website: z.string().optional(),
  }),
  CreateCommunitySchema: z.object({
    image: z.string(),
    name: z.string(),
    slug: z.string(),
    tags: z.array(z.string().cuid()),
    description: z.string().default(""),
    facebook: z.string().optional(),
    instagram: z.string().optional(),
    twitter: z.string().optional(),
    tiktok: z.string().optional(),
    website: z.string().optional(),
  }),
  CommunityQuerySchema: z.object({
    communityId: z.string(),
    take: z.string().optional(),
  }),
};
export type Community = z.infer<typeof CommunitiesValidators.CommunitySchema>;
export type CreateCommunityArgs = z.infer<
  typeof CommunitiesValidators.CreateCommunitySchema
>;
export type CommunitySearchResult = {
  isTag: boolean;
  result: CommunityResponse[];
};
export type CommunityResponse = {
  community: Community;
  isOwn: boolean;
  isSubscriber: boolean;
};
export type CommunityByIDQuery = z.infer<
  typeof CommunitiesValidators.CommunityQuerySchema
>;
export type Socials = z.infer<
  typeof CommunitiesValidators.CommunitySocialsSchema
>;

// Groups
const GroupBaseSchema = z.object({
  id: z.string().cuid(),
  name: z.string(),
});

export const GroupValidators = {
  GroupBaseSchema,
  GroupSchema: z
    .object({
      description: z.string(),
      image: z.string().nullable(),
      createdAt: z.date(),
      updatedAt: z.date(),
      slug: z.string(),
      _count: z.object({
        posts: z.number(),
      }),
    })
    .merge(GroupBaseSchema),
};

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
    group: GroupBaseSchema.nullable().optional(),
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
    content: z.array(ContentSchema.nullable()).optional(),
    image: z.string().optional().nullable(),
    isPublished: z.boolean().optional(),
    subscribersOnly: z.boolean().optional(),
    commentsVisible: z.boolean().optional(),
  }),
  CreatePostSchema: z.object({
    title: z.string(),
    authorId: z.string().cuid(),
    description: z.string(),
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
export type CreatePostArgs = z.infer<typeof PostVailidators.CreatePostSchema>;
export type CommunityPosts = z.infer<typeof CommunityPostsSchema>;

// User
export const UsersValidators = {
  UserSearchResult: z.object({
    id: z.string().cuid(),
    name: z.string(),
    community: z.object({
      slug: z.string(),
    }),
    image: z.string(),
    conversations: z.array(
      z.object({
        id: z.string().cuid(),
      })
    ),
  }),
};
export type UserSearchResult = z.infer<typeof UsersValidators.UserSearchResult>;
export type FeedItem = Record<string, PostResponse[]>;

// Tags
export const TagsValidators = {
  Tag: z.object({
    id: z.string().cuid(),
    name: z.string(),
    description: z.string().nullable(),
  }),
};

export type Tag = z.infer<typeof TagsValidators.Tag>;

// Notifications
export const NotificationsValidators = {
  NotifcationSchema: z.object({
    id: z.string().cuid(),
    path: z.string(),
    message: z.string(),
    creatorId: z.string().cuid(),
    receiverId: z.string().cuid(),
    creator: z.object({
      image: z.string(),
      name: z.string(),
    }),
  }),
};

export type Notifcation = z.infer<
  typeof NotificationsValidators.NotifcationSchema
>;

// Conversations
export const ConversationValidators = {
  ConversationSchema: z.object({
    id: z.string().cuid(),
    createdAt: z.date(),
    updatedAt: z.date(),
    users: z.array(
      z.object({
        id: z.string().cuid(),
        community: z.object({
          slug: z.string(),
        }),
        image: z.string(),
        name: z.string(),
      })
    ),
    messages: z.array(z.object({ content: z.string(), createdAt: z.date() })),
  }),
};
export type Conversation = z.infer<
  typeof ConversationValidators.ConversationSchema
>;

// Messages
export const MessagesValidators = {
  MessageSchema: z.object({
    id: z.string().cuid(),
    content: z.string(),
    conversationId: z.string().cuid(),
    userId: z.string().cuid(),
    user: z.object({
      image: z.string(),
      name: z.string(),
    }),
    createdAt: z.date(),
  }),
};
export type Message = z.infer<typeof MessagesValidators.MessageSchema>;
