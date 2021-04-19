import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
};

export type Query = {
  __typename?: 'Query';
  user?: Maybe<User>;
  fetchUser?: Maybe<User>;
  users: Array<User>;
  posts: Array<Post>;
  post?: Maybe<Post>;
  feed: Array<Post>;
};


export type QueryUserArgs = {
  cursor?: Maybe<Scalars['String']>;
};


export type QueryFetchUserArgs = {
  id: Scalars['String'];
  cursor?: Maybe<Scalars['String']>;
};


export type QueryUsersArgs = {
  cursor?: Maybe<Scalars['String']>;
};


export type QueryPostArgs = {
  id: Scalars['String'];
};


export type QueryFeedArgs = {
  cursor?: Maybe<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  _id?: Maybe<Scalars['ID']>;
  name: Scalars['String'];
  email: Scalars['String'];
  bio?: Maybe<Scalars['String']>;
  image?: Maybe<Scalars['String']>;
  links?: Maybe<Scalars['String']>;
  password: Scalars['String'];
  supporters: Array<User>;
  supporting: Array<User>;
  admin: Scalars['Boolean'];
  posts: Array<Post>;
  feed: Array<Post>;
  notifications: Array<Notification>;
};

export type Post = {
  __typename?: 'Post';
  _id?: Maybe<Scalars['ID']>;
  title: Scalars['String'];
  desc: Scalars['String'];
  buildMap: Array<BuildMap>;
  images: Array<Scalars['String']>;
  likes: Scalars['Int'];
  poster?: Maybe<User>;
  author?: Maybe<Scalars['String']>;
  createdAt: Scalars['DateTime'];
};

export type BuildMap = {
  __typename?: 'BuildMap';
  type: Scalars['String'];
  value: Scalars['String'];
};


export type Notification = {
  __typename?: 'Notification';
  _id?: Maybe<Scalars['ID']>;
  message: Scalars['String'];
  date: Scalars['DateTime'];
};

export type Mutation = {
  __typename?: 'Mutation';
  register: UserResponse;
  login: UserResponse;
  logout: Scalars['Boolean'];
  updateUser: UserResponse;
  handleSupporter: UserResponse;
  clearSupporters: Scalars['Boolean'];
  deleteAll: Scalars['Boolean'];
  deleteNotification: User;
  createPost: Post;
  updatePost: UpdatedPostResponse;
  deletePost: Scalars['Boolean'];
  likePost?: Maybe<Scalars['Int']>;
  deleteAllPosts: Scalars['Boolean'];
};


export type MutationRegisterArgs = {
  bio?: Maybe<Scalars['String']>;
  email: Scalars['String'];
  password: Scalars['String'];
  name: Scalars['String'];
};


export type MutationLoginArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationUpdateUserArgs = {
  image?: Maybe<Scalars['String']>;
  bio?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
};


export type MutationHandleSupporterArgs = {
  add: Scalars['Boolean'];
  id: Scalars['String'];
};


export type MutationDeleteNotificationArgs = {
  id: Scalars['String'];
};


export type MutationCreatePostArgs = {
  buildMap?: Maybe<Array<BuildInput>>;
  desc: Scalars['String'];
  title: Scalars['String'];
};


export type MutationUpdatePostArgs = {
  desc: Scalars['String'];
  title: Scalars['String'];
  id: Scalars['String'];
};


export type MutationDeletePostArgs = {
  id: Scalars['String'];
};


export type MutationLikePostArgs = {
  id: Scalars['String'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<InputError>>;
  user?: Maybe<User>;
  token?: Maybe<Token>;
};

export type InputError = {
  __typename?: 'InputError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type Token = {
  __typename?: 'Token';
  access: Scalars['String'];
  refresh: Scalars['String'];
};

export type BuildInput = {
  type: Scalars['String'];
  value: Scalars['String'];
};

export type UpdatedPostResponse = {
  __typename?: 'UpdatedPostResponse';
  title: Scalars['String'];
  desc: Scalars['String'];
};

export type Subscription = {
  __typename?: 'Subscription';
  notification: Notification;
  likeSubscription: Scalars['Int'];
};


export type SubscriptionNotificationArgs = {
  supporting?: Maybe<Array<Scalars['String']>>;
  subscriber: Scalars['String'];
};

export type CreatePostMutationVariables = Exact<{
  buildMap?: Maybe<Array<BuildInput>>;
  title: Scalars['String'];
  desc: Scalars['String'];
}>;


export type CreatePostMutation = (
  { __typename?: 'Mutation' }
  & { createPost: (
    { __typename?: 'Post' }
    & Pick<Post, '_id' | 'title' | 'desc' | 'createdAt'>
    & { poster?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, '_id'>
    )> }
  ) }
);

export type DeletePostMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type DeletePostMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deletePost'>
);

export type DeleteNotificationMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type DeleteNotificationMutation = (
  { __typename?: 'Mutation' }
  & { deleteNotification: (
    { __typename?: 'User' }
    & { notifications: Array<(
      { __typename?: 'Notification' }
      & Pick<Notification, '_id' | 'message' | 'date'>
    )> }
  ) }
);

export type LikePostMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type LikePostMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'likePost'>
);

export type LoginMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { login: (
    { __typename?: 'UserResponse' }
    & { user?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'bio' | 'image' | '_id' | 'name'>
      & { supporters: Array<(
        { __typename?: 'User' }
        & Pick<User, '_id' | 'name'>
      )>, supporting: Array<(
        { __typename?: 'User' }
        & Pick<User, '_id' | 'name' | 'email'>
        & { supporters: Array<(
          { __typename?: 'User' }
          & Pick<User, '_id'>
        )> }
      )>, posts: Array<(
        { __typename?: 'Post' }
        & Pick<Post, '_id' | 'title' | 'desc' | 'createdAt'>
      )>, notifications: Array<(
        { __typename?: 'Notification' }
        & Pick<Notification, '_id' | 'message' | 'date'>
      )> }
    )>, errors?: Maybe<Array<(
      { __typename?: 'InputError' }
      & Pick<InputError, 'field' | 'message'>
    )>>, token?: Maybe<(
      { __typename?: 'Token' }
      & Pick<Token, 'access' | 'refresh'>
    )> }
  ) }
);

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'logout'>
);

export type RegisterMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
  name: Scalars['String'];
  bio?: Maybe<Scalars['String']>;
}>;


export type RegisterMutation = (
  { __typename?: 'Mutation' }
  & { register: (
    { __typename?: 'UserResponse' }
    & { errors?: Maybe<Array<(
      { __typename?: 'InputError' }
      & Pick<InputError, 'field' | 'message'>
    )>> }
  ) }
);

export type SupporterMutationVariables = Exact<{
  id: Scalars['String'];
  add: Scalars['Boolean'];
}>;


export type SupporterMutation = (
  { __typename?: 'Mutation' }
  & { handleSupporter: (
    { __typename?: 'UserResponse' }
    & { errors?: Maybe<Array<(
      { __typename?: 'InputError' }
      & Pick<InputError, 'field' | 'message'>
    )>>, user?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'bio' | 'name' | '_id' | 'image' | 'email'>
      & { supporting: Array<(
        { __typename?: 'User' }
        & Pick<User, '_id' | 'name' | 'email'>
      )>, supporters: Array<(
        { __typename?: 'User' }
        & Pick<User, 'name' | '_id'>
      )>, posts: Array<(
        { __typename?: 'Post' }
        & Pick<Post, 'title' | '_id' | 'createdAt' | 'desc'>
      )> }
    )> }
  ) }
);

export type UpdatePostMutationVariables = Exact<{
  id: Scalars['String'];
  title: Scalars['String'];
  desc: Scalars['String'];
}>;


export type UpdatePostMutation = (
  { __typename?: 'Mutation' }
  & { updatePost: (
    { __typename?: 'UpdatedPostResponse' }
    & Pick<UpdatedPostResponse, 'title' | 'desc'>
  ) }
);

export type UpdateUserMutationVariables = Exact<{
  bio?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  image?: Maybe<Scalars['String']>;
}>;


export type UpdateUserMutation = (
  { __typename?: 'Mutation' }
  & { updateUser: (
    { __typename?: 'UserResponse' }
    & { user?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'bio' | 'image' | 'name'>
    )> }
  ) }
);

export type FetchFeedQueryVariables = Exact<{
  cursor?: Maybe<Scalars['String']>;
}>;


export type FetchFeedQuery = (
  { __typename?: 'Query' }
  & { feed: Array<(
    { __typename?: 'Post' }
    & Pick<Post, '_id' | 'title' | 'createdAt' | 'author' | 'likes'>
    & { buildMap: Array<(
      { __typename?: 'BuildMap' }
      & Pick<BuildMap, 'type' | 'value'>
    )> }
  )> }
);

export type FetchPostQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type FetchPostQuery = (
  { __typename?: 'Query' }
  & { post?: Maybe<(
    { __typename?: 'Post' }
    & Pick<Post, '_id' | 'title' | 'desc' | 'likes'>
    & { poster?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'bio' | 'name' | 'image' | '_id' | 'email'>
      & { supporting: Array<(
        { __typename?: 'User' }
        & Pick<User, '_id'>
      )>, supporters: Array<(
        { __typename?: 'User' }
        & Pick<User, '_id'>
      )> }
    )>, buildMap: Array<(
      { __typename?: 'BuildMap' }
      & Pick<BuildMap, 'type' | 'value'>
    )> }
  )> }
);

export type FetchUserQueryVariables = Exact<{
  id: Scalars['String'];
  cursor?: Maybe<Scalars['String']>;
}>;


export type FetchUserQuery = (
  { __typename?: 'Query' }
  & { fetchUser?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'name' | 'image' | 'bio' | '_id' | 'email'>
    & { supporting: Array<(
      { __typename?: 'User' }
      & Pick<User, 'image' | '_id'>
    )>, supporters: Array<(
      { __typename?: 'User' }
      & Pick<User, '_id' | 'name'>
    )>, posts: Array<(
      { __typename?: 'Post' }
      & Pick<Post, 'title' | '_id' | 'createdAt' | 'desc'>
    )> }
  )> }
);

export type UserQueryVariables = Exact<{
  cursor?: Maybe<Scalars['String']>;
}>;


export type UserQuery = (
  { __typename?: 'Query' }
  & { user?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, '_id' | 'image' | 'bio' | 'name'>
    & { supporting: Array<(
      { __typename?: 'User' }
      & Pick<User, '_id' | 'name' | 'image' | 'email'>
    )>, supporters: Array<(
      { __typename?: 'User' }
      & Pick<User, '_id' | 'name'>
    )>, posts: Array<(
      { __typename?: 'Post' }
      & Pick<Post, '_id' | 'title' | 'createdAt' | 'desc'>
    )>, notifications: Array<(
      { __typename?: 'Notification' }
      & Pick<Notification, '_id' | 'message' | 'date'>
    )> }
  )> }
);

export type UsersQueryVariables = Exact<{
  cursor?: Maybe<Scalars['String']>;
}>;


export type UsersQuery = (
  { __typename?: 'Query' }
  & { users: Array<(
    { __typename?: 'User' }
    & Pick<User, 'name' | '_id' | 'image'>
  )> }
);

export type LikeSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type LikeSubscription = (
  { __typename?: 'Subscription' }
  & Pick<Subscription, 'likeSubscription'>
);

export type NotificationSubscriptionVariables = Exact<{
  subscriber: Scalars['String'];
  supporting?: Maybe<Array<Scalars['String']>>;
}>;


export type NotificationSubscription = (
  { __typename?: 'Subscription' }
  & { notification: (
    { __typename?: 'Notification' }
    & Pick<Notification, '_id' | 'message' | 'date'>
  ) }
);


export const CreatePostDocument = gql`
    mutation CreatePost($buildMap: [BuildInput!], $title: String!, $desc: String!) {
  createPost(buildMap: $buildMap, title: $title, desc: $desc) {
    _id
    title
    desc
    poster {
      _id
    }
    createdAt
  }
}
    `;
export type CreatePostMutationFn = Apollo.MutationFunction<CreatePostMutation, CreatePostMutationVariables>;

/**
 * __useCreatePostMutation__
 *
 * To run a mutation, you first call `useCreatePostMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatePostMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createPostMutation, { data, loading, error }] = useCreatePostMutation({
 *   variables: {
 *      buildMap: // value for 'buildMap'
 *      title: // value for 'title'
 *      desc: // value for 'desc'
 *   },
 * });
 */
export function useCreatePostMutation(baseOptions?: Apollo.MutationHookOptions<CreatePostMutation, CreatePostMutationVariables>) {
        return Apollo.useMutation<CreatePostMutation, CreatePostMutationVariables>(CreatePostDocument, baseOptions);
      }
export type CreatePostMutationHookResult = ReturnType<typeof useCreatePostMutation>;
export type CreatePostMutationResult = Apollo.MutationResult<CreatePostMutation>;
export type CreatePostMutationOptions = Apollo.BaseMutationOptions<CreatePostMutation, CreatePostMutationVariables>;
export const DeletePostDocument = gql`
    mutation DeletePost($id: String!) {
  deletePost(id: $id)
}
    `;
export type DeletePostMutationFn = Apollo.MutationFunction<DeletePostMutation, DeletePostMutationVariables>;

/**
 * __useDeletePostMutation__
 *
 * To run a mutation, you first call `useDeletePostMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeletePostMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deletePostMutation, { data, loading, error }] = useDeletePostMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeletePostMutation(baseOptions?: Apollo.MutationHookOptions<DeletePostMutation, DeletePostMutationVariables>) {
        return Apollo.useMutation<DeletePostMutation, DeletePostMutationVariables>(DeletePostDocument, baseOptions);
      }
export type DeletePostMutationHookResult = ReturnType<typeof useDeletePostMutation>;
export type DeletePostMutationResult = Apollo.MutationResult<DeletePostMutation>;
export type DeletePostMutationOptions = Apollo.BaseMutationOptions<DeletePostMutation, DeletePostMutationVariables>;
export const DeleteNotificationDocument = gql`
    mutation DeleteNotification($id: String!) {
  deleteNotification(id: $id) {
    notifications {
      _id
      message
      date
    }
  }
}
    `;
export type DeleteNotificationMutationFn = Apollo.MutationFunction<DeleteNotificationMutation, DeleteNotificationMutationVariables>;

/**
 * __useDeleteNotificationMutation__
 *
 * To run a mutation, you first call `useDeleteNotificationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteNotificationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteNotificationMutation, { data, loading, error }] = useDeleteNotificationMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteNotificationMutation(baseOptions?: Apollo.MutationHookOptions<DeleteNotificationMutation, DeleteNotificationMutationVariables>) {
        return Apollo.useMutation<DeleteNotificationMutation, DeleteNotificationMutationVariables>(DeleteNotificationDocument, baseOptions);
      }
export type DeleteNotificationMutationHookResult = ReturnType<typeof useDeleteNotificationMutation>;
export type DeleteNotificationMutationResult = Apollo.MutationResult<DeleteNotificationMutation>;
export type DeleteNotificationMutationOptions = Apollo.BaseMutationOptions<DeleteNotificationMutation, DeleteNotificationMutationVariables>;
export const LikePostDocument = gql`
    mutation LikePost($id: String!) {
  likePost(id: $id)
}
    `;
export type LikePostMutationFn = Apollo.MutationFunction<LikePostMutation, LikePostMutationVariables>;

/**
 * __useLikePostMutation__
 *
 * To run a mutation, you first call `useLikePostMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLikePostMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [likePostMutation, { data, loading, error }] = useLikePostMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useLikePostMutation(baseOptions?: Apollo.MutationHookOptions<LikePostMutation, LikePostMutationVariables>) {
        return Apollo.useMutation<LikePostMutation, LikePostMutationVariables>(LikePostDocument, baseOptions);
      }
export type LikePostMutationHookResult = ReturnType<typeof useLikePostMutation>;
export type LikePostMutationResult = Apollo.MutationResult<LikePostMutation>;
export type LikePostMutationOptions = Apollo.BaseMutationOptions<LikePostMutation, LikePostMutationVariables>;
export const LoginDocument = gql`
    mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    user {
      bio
      image
      _id
      supporters {
        _id
        name
      }
      supporting {
        _id
        name
        email
        supporters {
          _id
        }
      }
      posts {
        _id
        title
        desc
        createdAt
      }
      name
      notifications {
        _id
        message
        date
      }
    }
    errors {
      field
      message
    }
    token {
      access
      refresh
    }
  }
}
    `;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, baseOptions);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;
export type LogoutMutationFn = Apollo.MutationFunction<LogoutMutation, LogoutMutationVariables>;

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutMutation(baseOptions?: Apollo.MutationHookOptions<LogoutMutation, LogoutMutationVariables>) {
        return Apollo.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, baseOptions);
      }
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = Apollo.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = Apollo.BaseMutationOptions<LogoutMutation, LogoutMutationVariables>;
export const RegisterDocument = gql`
    mutation Register($email: String!, $password: String!, $name: String!, $bio: String) {
  register(email: $email, password: $password, name: $name, bio: $bio) {
    errors {
      field
      message
    }
  }
}
    `;
export type RegisterMutationFn = Apollo.MutationFunction<RegisterMutation, RegisterMutationVariables>;

/**
 * __useRegisterMutation__
 *
 * To run a mutation, you first call `useRegisterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerMutation, { data, loading, error }] = useRegisterMutation({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *      name: // value for 'name'
 *      bio: // value for 'bio'
 *   },
 * });
 */
export function useRegisterMutation(baseOptions?: Apollo.MutationHookOptions<RegisterMutation, RegisterMutationVariables>) {
        return Apollo.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument, baseOptions);
      }
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = Apollo.MutationResult<RegisterMutation>;
export type RegisterMutationOptions = Apollo.BaseMutationOptions<RegisterMutation, RegisterMutationVariables>;
export const SupporterDocument = gql`
    mutation Supporter($id: String!, $add: Boolean!) {
  handleSupporter(id: $id, add: $add) {
    errors {
      field
      message
    }
    user {
      bio
      name
      _id
      image
      supporting {
        _id
        name
        email
      }
      email
      supporters {
        name
        _id
      }
      posts {
        title
        _id
        createdAt
        desc
      }
    }
  }
}
    `;
export type SupporterMutationFn = Apollo.MutationFunction<SupporterMutation, SupporterMutationVariables>;

/**
 * __useSupporterMutation__
 *
 * To run a mutation, you first call `useSupporterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSupporterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [supporterMutation, { data, loading, error }] = useSupporterMutation({
 *   variables: {
 *      id: // value for 'id'
 *      add: // value for 'add'
 *   },
 * });
 */
export function useSupporterMutation(baseOptions?: Apollo.MutationHookOptions<SupporterMutation, SupporterMutationVariables>) {
        return Apollo.useMutation<SupporterMutation, SupporterMutationVariables>(SupporterDocument, baseOptions);
      }
export type SupporterMutationHookResult = ReturnType<typeof useSupporterMutation>;
export type SupporterMutationResult = Apollo.MutationResult<SupporterMutation>;
export type SupporterMutationOptions = Apollo.BaseMutationOptions<SupporterMutation, SupporterMutationVariables>;
export const UpdatePostDocument = gql`
    mutation UpdatePost($id: String!, $title: String!, $desc: String!) {
  updatePost(id: $id, title: $title, desc: $desc) {
    title
    desc
  }
}
    `;
export type UpdatePostMutationFn = Apollo.MutationFunction<UpdatePostMutation, UpdatePostMutationVariables>;

/**
 * __useUpdatePostMutation__
 *
 * To run a mutation, you first call `useUpdatePostMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePostMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePostMutation, { data, loading, error }] = useUpdatePostMutation({
 *   variables: {
 *      id: // value for 'id'
 *      title: // value for 'title'
 *      desc: // value for 'desc'
 *   },
 * });
 */
export function useUpdatePostMutation(baseOptions?: Apollo.MutationHookOptions<UpdatePostMutation, UpdatePostMutationVariables>) {
        return Apollo.useMutation<UpdatePostMutation, UpdatePostMutationVariables>(UpdatePostDocument, baseOptions);
      }
export type UpdatePostMutationHookResult = ReturnType<typeof useUpdatePostMutation>;
export type UpdatePostMutationResult = Apollo.MutationResult<UpdatePostMutation>;
export type UpdatePostMutationOptions = Apollo.BaseMutationOptions<UpdatePostMutation, UpdatePostMutationVariables>;
export const UpdateUserDocument = gql`
    mutation UpdateUser($bio: String, $name: String, $image: String) {
  updateUser(bio: $bio, name: $name, image: $image) {
    user {
      bio
      image
      name
    }
  }
}
    `;
export type UpdateUserMutationFn = Apollo.MutationFunction<UpdateUserMutation, UpdateUserMutationVariables>;

/**
 * __useUpdateUserMutation__
 *
 * To run a mutation, you first call `useUpdateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserMutation, { data, loading, error }] = useUpdateUserMutation({
 *   variables: {
 *      bio: // value for 'bio'
 *      name: // value for 'name'
 *      image: // value for 'image'
 *   },
 * });
 */
export function useUpdateUserMutation(baseOptions?: Apollo.MutationHookOptions<UpdateUserMutation, UpdateUserMutationVariables>) {
        return Apollo.useMutation<UpdateUserMutation, UpdateUserMutationVariables>(UpdateUserDocument, baseOptions);
      }
export type UpdateUserMutationHookResult = ReturnType<typeof useUpdateUserMutation>;
export type UpdateUserMutationResult = Apollo.MutationResult<UpdateUserMutation>;
export type UpdateUserMutationOptions = Apollo.BaseMutationOptions<UpdateUserMutation, UpdateUserMutationVariables>;
export const FetchFeedDocument = gql`
    query FetchFeed($cursor: String) {
  feed(cursor: $cursor) {
    _id
    buildMap {
      type
      value
    }
    title
    createdAt
    author
    likes
  }
}
    `;

/**
 * __useFetchFeedQuery__
 *
 * To run a query within a React component, call `useFetchFeedQuery` and pass it any options that fit your needs.
 * When your component renders, `useFetchFeedQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFetchFeedQuery({
 *   variables: {
 *      cursor: // value for 'cursor'
 *   },
 * });
 */
export function useFetchFeedQuery(baseOptions?: Apollo.QueryHookOptions<FetchFeedQuery, FetchFeedQueryVariables>) {
        return Apollo.useQuery<FetchFeedQuery, FetchFeedQueryVariables>(FetchFeedDocument, baseOptions);
      }
export function useFetchFeedLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FetchFeedQuery, FetchFeedQueryVariables>) {
          return Apollo.useLazyQuery<FetchFeedQuery, FetchFeedQueryVariables>(FetchFeedDocument, baseOptions);
        }
export type FetchFeedQueryHookResult = ReturnType<typeof useFetchFeedQuery>;
export type FetchFeedLazyQueryHookResult = ReturnType<typeof useFetchFeedLazyQuery>;
export type FetchFeedQueryResult = Apollo.QueryResult<FetchFeedQuery, FetchFeedQueryVariables>;
export const FetchPostDocument = gql`
    query FetchPost($id: String!) {
  post(id: $id) {
    _id
    title
    desc
    poster {
      bio
      name
      image
      _id
      supporting {
        _id
      }
      email
      supporters {
        _id
      }
    }
    buildMap {
      type
      value
    }
    likes
  }
}
    `;

/**
 * __useFetchPostQuery__
 *
 * To run a query within a React component, call `useFetchPostQuery` and pass it any options that fit your needs.
 * When your component renders, `useFetchPostQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFetchPostQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useFetchPostQuery(baseOptions: Apollo.QueryHookOptions<FetchPostQuery, FetchPostQueryVariables>) {
        return Apollo.useQuery<FetchPostQuery, FetchPostQueryVariables>(FetchPostDocument, baseOptions);
      }
export function useFetchPostLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FetchPostQuery, FetchPostQueryVariables>) {
          return Apollo.useLazyQuery<FetchPostQuery, FetchPostQueryVariables>(FetchPostDocument, baseOptions);
        }
export type FetchPostQueryHookResult = ReturnType<typeof useFetchPostQuery>;
export type FetchPostLazyQueryHookResult = ReturnType<typeof useFetchPostLazyQuery>;
export type FetchPostQueryResult = Apollo.QueryResult<FetchPostQuery, FetchPostQueryVariables>;
export const FetchUserDocument = gql`
    query FetchUser($id: String!, $cursor: String) {
  fetchUser(id: $id, cursor: $cursor) {
    name
    image
    bio
    _id
    supporting {
      image
      _id
    }
    email
    supporters {
      _id
      name
    }
    posts {
      title
      _id
      createdAt
      desc
    }
  }
}
    `;

/**
 * __useFetchUserQuery__
 *
 * To run a query within a React component, call `useFetchUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useFetchUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFetchUserQuery({
 *   variables: {
 *      id: // value for 'id'
 *      cursor: // value for 'cursor'
 *   },
 * });
 */
export function useFetchUserQuery(baseOptions: Apollo.QueryHookOptions<FetchUserQuery, FetchUserQueryVariables>) {
        return Apollo.useQuery<FetchUserQuery, FetchUserQueryVariables>(FetchUserDocument, baseOptions);
      }
export function useFetchUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FetchUserQuery, FetchUserQueryVariables>) {
          return Apollo.useLazyQuery<FetchUserQuery, FetchUserQueryVariables>(FetchUserDocument, baseOptions);
        }
export type FetchUserQueryHookResult = ReturnType<typeof useFetchUserQuery>;
export type FetchUserLazyQueryHookResult = ReturnType<typeof useFetchUserLazyQuery>;
export type FetchUserQueryResult = Apollo.QueryResult<FetchUserQuery, FetchUserQueryVariables>;
export const UserDocument = gql`
    query User($cursor: String) {
  user(cursor: $cursor) {
    _id
    image
    bio
    supporting {
      _id
      name
      image
      email
    }
    supporters {
      _id
      name
    }
    name
    posts {
      _id
      title
      createdAt
      desc
    }
    notifications {
      _id
      message
      date
    }
  }
}
    `;

/**
 * __useUserQuery__
 *
 * To run a query within a React component, call `useUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserQuery({
 *   variables: {
 *      cursor: // value for 'cursor'
 *   },
 * });
 */
export function useUserQuery(baseOptions?: Apollo.QueryHookOptions<UserQuery, UserQueryVariables>) {
        return Apollo.useQuery<UserQuery, UserQueryVariables>(UserDocument, baseOptions);
      }
export function useUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserQuery, UserQueryVariables>) {
          return Apollo.useLazyQuery<UserQuery, UserQueryVariables>(UserDocument, baseOptions);
        }
export type UserQueryHookResult = ReturnType<typeof useUserQuery>;
export type UserLazyQueryHookResult = ReturnType<typeof useUserLazyQuery>;
export type UserQueryResult = Apollo.QueryResult<UserQuery, UserQueryVariables>;
export const UsersDocument = gql`
    query Users($cursor: String) {
  users(cursor: $cursor) {
    name
    _id
    image
  }
}
    `;

/**
 * __useUsersQuery__
 *
 * To run a query within a React component, call `useUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUsersQuery({
 *   variables: {
 *      cursor: // value for 'cursor'
 *   },
 * });
 */
export function useUsersQuery(baseOptions?: Apollo.QueryHookOptions<UsersQuery, UsersQueryVariables>) {
        return Apollo.useQuery<UsersQuery, UsersQueryVariables>(UsersDocument, baseOptions);
      }
export function useUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UsersQuery, UsersQueryVariables>) {
          return Apollo.useLazyQuery<UsersQuery, UsersQueryVariables>(UsersDocument, baseOptions);
        }
export type UsersQueryHookResult = ReturnType<typeof useUsersQuery>;
export type UsersLazyQueryHookResult = ReturnType<typeof useUsersLazyQuery>;
export type UsersQueryResult = Apollo.QueryResult<UsersQuery, UsersQueryVariables>;
export const LikeDocument = gql`
    subscription Like {
  likeSubscription
}
    `;

/**
 * __useLikeSubscription__
 *
 * To run a query within a React component, call `useLikeSubscription` and pass it any options that fit your needs.
 * When your component renders, `useLikeSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLikeSubscription({
 *   variables: {
 *   },
 * });
 */
export function useLikeSubscription(baseOptions?: Apollo.SubscriptionHookOptions<LikeSubscription, LikeSubscriptionVariables>) {
        return Apollo.useSubscription<LikeSubscription, LikeSubscriptionVariables>(LikeDocument, baseOptions);
      }
export type LikeSubscriptionHookResult = ReturnType<typeof useLikeSubscription>;
export type LikeSubscriptionResult = Apollo.SubscriptionResult<LikeSubscription>;
export const NotificationDocument = gql`
    subscription Notification($subscriber: String!, $supporting: [String!]) {
  notification(subscriber: $subscriber, supporting: $supporting) {
    _id
    message
    date
  }
}
    `;

/**
 * __useNotificationSubscription__
 *
 * To run a query within a React component, call `useNotificationSubscription` and pass it any options that fit your needs.
 * When your component renders, `useNotificationSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNotificationSubscription({
 *   variables: {
 *      subscriber: // value for 'subscriber'
 *      supporting: // value for 'supporting'
 *   },
 * });
 */
export function useNotificationSubscription(baseOptions: Apollo.SubscriptionHookOptions<NotificationSubscription, NotificationSubscriptionVariables>) {
        return Apollo.useSubscription<NotificationSubscription, NotificationSubscriptionVariables>(NotificationDocument, baseOptions);
      }
export type NotificationSubscriptionHookResult = ReturnType<typeof useNotificationSubscription>;
export type NotificationSubscriptionResult = Apollo.SubscriptionResult<NotificationSubscription>;