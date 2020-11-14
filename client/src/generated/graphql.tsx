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
  password: Scalars['String'];
  supporters: Scalars['Int'];
  supporting: Array<User>;
  admin: Scalars['Boolean'];
  posts: Array<Post>;
};

export type Post = {
  __typename?: 'Post';
  _id?: Maybe<Scalars['ID']>;
  title: Scalars['String'];
  text: Scalars['String'];
  likes: Scalars['Int'];
  tips: Scalars['Float'];
  poster?: Maybe<User>;
  posterId: Scalars['String'];
  createdAt: Scalars['DateTime'];
};


export type Mutation = {
  __typename?: 'Mutation';
  register: UserResponse;
  handleSupporter: UserResponse;
  login: UserResponse;
  logout: Scalars['Boolean'];
  deleteAll: Scalars['Boolean'];
  createPost: Post;
};


export type MutationRegisterArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
  name: Scalars['String'];
};


export type MutationHandleSupporterArgs = {
  add: Scalars['Boolean'];
  id: Scalars['String'];
};


export type MutationLoginArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationCreatePostArgs = {
  text: Scalars['String'];
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
      & Pick<User, '_id'>
      & { supporting: Array<(
        { __typename?: 'User' }
        & Pick<User, '_id' | 'name' | 'email' | 'supporters'>
      )>, posts: Array<(
        { __typename?: 'Post' }
        & Pick<Post, '_id' | 'title' | 'text'>
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
      & Pick<User, 'name' | '_id' | 'email' | 'supporters'>
      & { supporting: Array<(
        { __typename?: 'User' }
        & Pick<User, '_id'>
      )>, posts: Array<(
        { __typename?: 'Post' }
        & Pick<Post, 'title' | '_id' | 'createdAt' | 'text'>
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
    & Pick<Post, 'title' | 'text'>
    & { poster?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'name' | '_id' | 'email' | 'supporters'>
      & { supporting: Array<(
        { __typename?: 'User' }
        & Pick<User, '_id'>
      )> }
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
    & Pick<User, 'name' | '_id' | 'email' | 'supporters'>
    & { supporting: Array<(
      { __typename?: 'User' }
      & Pick<User, '_id'>
    )>, posts: Array<(
      { __typename?: 'Post' }
      & Pick<Post, 'title' | '_id' | 'createdAt' | 'text'>
    )> }
  )> }
);

export type UserQueryVariables = Exact<{ [key: string]: never; }>;


export type UserQuery = (
  { __typename?: 'Query' }
  & { user?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, '_id'>
    & { supporting: Array<(
      { __typename?: 'User' }
      & Pick<User, '_id' | 'name' | 'email' | 'supporters'>
    )>, posts: Array<(
      { __typename?: 'Post' }
      & Pick<Post, '_id' | 'title' | 'text'>
    )> }
  )> }
);


export const LoginDocument = gql`
    mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    user {
      _id
      supporting {
        _id
        name
        email
        supporters
      }
      posts {
        _id
        title
        text
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
      supporters
      posts {
        title
        _id
        createdAt
        text
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
    title
    text
    poster {
      name
      _id
      supporting {
        _id
      }
      email
      supporters
    }
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
    supporters
    posts {
      title
      _id
      createdAt
      text
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
      supporters
    }
    posts {
      _id
      title
      text
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