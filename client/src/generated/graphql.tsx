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


export type QueryFetchUserArgs = {
  id: Scalars['String'];
};


export type QueryPostArgs = {
  id: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  _id?: Maybe<Scalars['ID']>;
  name: Scalars['String'];
  email: Scalars['String'];
  bio?: Maybe<Scalars['String']>;
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
  tips: Scalars['Float'];
  poster?: Maybe<User>;
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
  updateUser: UserResponse;
  handleSupporter: UserResponse;
  login: UserResponse;
  logout: Scalars['Boolean'];
  deleteAll: Scalars['Boolean'];
  deleteNotification: User;
  likePost?: Maybe<Scalars['Int']>;
  createPost: Post;
  deleteAllPosts: Scalars['Boolean'];
};


export type MutationRegisterArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
  name: Scalars['String'];
};


export type MutationUpdateUserArgs = {
  links?: Maybe<Scalars['String']>;
  bio?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
};


export type MutationHandleSupporterArgs = {
  add: Scalars['Boolean'];
  id: Scalars['String'];
};


export type MutationLoginArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationDeleteNotificationArgs = {
  id: Scalars['String'];
};


export type MutationLikePostArgs = {
  id: Scalars['String'];
};


export type MutationCreatePostArgs = {
  buildMap?: Maybe<Array<BuildInput>>;
  desc: Scalars['String'];
  title: Scalars['String'];
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

export type Subscription = {
  __typename?: 'Subscription';
  notify: Notification;
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
    & Pick<Post, '_id' | 'title' | 'desc'>
    & { poster?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, '_id'>
    )> }
  ) }
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
      & Pick<User, '_id' | 'name'>
      & { supporting: Array<(
        { __typename?: 'User' }
        & Pick<User, '_id' | 'name' | 'email'>
        & { supporters: Array<(
          { __typename?: 'User' }
          & Pick<User, '_id'>
        )> }
      )>, posts: Array<(
        { __typename?: 'Post' }
        & Pick<Post, '_id' | 'title' | 'desc'>
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
      & Pick<User, 'name' | '_id' | 'email'>
      & { supporting: Array<(
        { __typename?: 'User' }
        & Pick<User, '_id'>
      )>, supporters: Array<(
        { __typename?: 'User' }
        & Pick<User, '_id'>
      )>, posts: Array<(
        { __typename?: 'Post' }
        & Pick<Post, 'title' | '_id' | 'createdAt' | 'desc'>
      )> }
    )> }
  ) }
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
      & Pick<User, 'name' | '_id' | 'email'>
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
}>;


export type FetchUserQuery = (
  { __typename?: 'Query' }
  & { fetchUser?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'name' | '_id' | 'email'>
    & { supporting: Array<(
      { __typename?: 'User' }
      & Pick<User, '_id'>
    )>, supporters: Array<(
      { __typename?: 'User' }
      & Pick<User, '_id'>
    )>, posts: Array<(
      { __typename?: 'Post' }
      & Pick<Post, 'title' | '_id' | 'createdAt' | 'desc'>
    )> }
  )> }
);

export type UserQueryVariables = Exact<{ [key: string]: never; }>;


export type UserQuery = (
  { __typename?: 'Query' }
  & { user?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, '_id' | 'name'>
    & { supporting: Array<(
      { __typename?: 'User' }
      & Pick<User, '_id' | 'name' | 'email'>
      & { supporters: Array<(
        { __typename?: 'User' }
        & Pick<User, '_id'>
      )> }
    )>, posts: Array<(
      { __typename?: 'Post' }
      & Pick<Post, '_id' | 'title' | 'desc'>
    )>, notifications: Array<(
      { __typename?: 'Notification' }
      & Pick<Notification, '_id' | 'message' | 'date'>
    )> }
  )> }
);

export type NotificationSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type NotificationSubscription = (
  { __typename?: 'Subscription' }
  & { notify: (
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
      _id
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
export const SupporterDocument = gql`
    mutation Supporter($id: String!, $add: Boolean!) {
  handleSupporter(id: $id, add: $add) {
    errors {
      field
      message
    }
    user {
      name
      _id
      supporting {
        _id
      }
      email
      supporters {
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
export const FetchPostDocument = gql`
    query FetchPost($id: String!) {
  post(id: $id) {
    _id
    title
    desc
    poster {
      name
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
    query FetchUser($id: String!) {
  fetchUser(id: $id) {
    name
    _id
    supporting {
      _id
    }
    email
    supporters {
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
    query User {
  user {
    _id
    supporting {
      _id
      name
      email
      supporters {
        _id
      }
    }
    name
    posts {
      _id
      title
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
export const NotificationDocument = gql`
    subscription Notification {
  notify {
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
 *   },
 * });
 */
export function useNotificationSubscription(baseOptions?: Apollo.SubscriptionHookOptions<NotificationSubscription, NotificationSubscriptionVariables>) {
        return Apollo.useSubscription<NotificationSubscription, NotificationSubscriptionVariables>(NotificationDocument, baseOptions);
      }
export type NotificationSubscriptionHookResult = ReturnType<typeof useNotificationSubscription>;
export type NotificationSubscriptionResult = Apollo.SubscriptionResult<NotificationSubscription>;