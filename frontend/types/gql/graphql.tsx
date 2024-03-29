import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export enum Category {
  Other = 'OTHER',
  Slot = 'SLOT',
  Table = 'TABLE'
}

export type CategoryModel = {
  __typename?: 'CategoryModel';
  id: Category | '%future added value';
  label: Scalars['String']['output'];
};

export type GameHistoryDto = {
  limit: Scalars['Float']['input'];
  offset: Scalars['Float']['input'];
};

/** Top wins return type */
export type GameHistoryModel = {
  __typename?: 'GameHistoryModel';
  history: Array<HistoryModel>;
};

export type GameModel = {
  __typename?: 'GameModel';
  category: Category | '%future added value';
  id: Scalars['Float']['output'];
  name: Scalars['String']['output'];
};

/** Top win type */
export type HistoryModel = {
  __typename?: 'HistoryModel';
  bet: Scalars['Float']['output'];
  createdAt: Scalars['String']['output'];
  game: Scalars['String']['output'];
  multiplier: Scalars['Float']['output'];
  win: Scalars['Float']['output'];
};

export type LoginDto = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Login mutation */
  login: Scalars['Boolean']['output'];
  /** Logout mutation */
  logout: Scalars['Boolean']['output'];
  /** Register mutation */
  register: Scalars['String']['output'];
};


export type MutationLoginArgs = {
  login: LoginDto;
};


export type MutationRegisterArgs = {
  registerData: RegisterDto;
};

export type Query = {
  __typename?: 'Query';
  /** Returns list of categories */
  categoryList: Array<CategoryModel>;
  gameHistory: GameHistoryModel;
  /** Returns list of games with ids */
  gameList: Array<GameModel>;
  topWins: TopWinsModel;
  user: UserModel;
};


export type QueryGameHistoryArgs = {
  historyInput: GameHistoryDto;
};

export type RegisterDto = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type Subscription = {
  __typename?: 'Subscription';
  userBalance: UserBalanceModel;
};

/** Top win type */
export type TopWinModel = {
  __typename?: 'TopWinModel';
  game: Scalars['String']['output'];
  multiplier: Scalars['Float']['output'];
  username: Scalars['String']['output'];
  win: Scalars['Float']['output'];
};

/** Top wins return type */
export type TopWinsModel = {
  __typename?: 'TopWinsModel';
  topMultipliers: Array<TopWinModel>;
  topWins: Array<TopWinModel>;
};

/** User's balance */
export type UserBalanceModel = {
  __typename?: 'UserBalanceModel';
  balance: Scalars['Float']['output'];
};

/** User return type */
export type UserModel = {
  __typename?: 'UserModel';
  _id: Scalars['String']['output'];
  balance: Scalars['Float']['output'];
  username: Scalars['String']['output'];
};

export type LoginMutationVariables = Exact<{
  credentials: LoginDto;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: boolean };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type RegisterMutationVariables = Exact<{
  registerData: RegisterDto;
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: string };

export type UserQueryVariables = Exact<{ [key: string]: never; }>;


export type UserQuery = { __typename?: 'Query', user: { __typename?: 'UserModel', username: string, balance: number } };

export type CategoryListQueryVariables = Exact<{ [key: string]: never; }>;


export type CategoryListQuery = { __typename?: 'Query', categoryList: Array<{ __typename?: 'CategoryModel', id: Category, label: string }> };

export type GameHistoryQueryVariables = Exact<{
  historyInput: GameHistoryDto;
}>;


export type GameHistoryQuery = { __typename?: 'Query', gameHistory: { __typename?: 'GameHistoryModel', history: Array<{ __typename?: 'HistoryModel', bet: number, createdAt: string, game: string, multiplier: number, win: number }> } };

export type GameListQueryVariables = Exact<{ [key: string]: never; }>;


export type GameListQuery = { __typename?: 'Query', gameList: Array<{ __typename?: 'GameModel', id: number, category: Category, name: string }> };

export type TopWinsQueryVariables = Exact<{ [key: string]: never; }>;


export type TopWinsQuery = { __typename?: 'Query', topWins: { __typename?: 'TopWinsModel', topWins: Array<{ __typename?: 'TopWinModel', win: number, username: string, game: string }>, topMultipliers: Array<{ __typename?: 'TopWinModel', multiplier: number, username: string, game: string }> } };

export type UserBalanceSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type UserBalanceSubscription = { __typename?: 'Subscription', userBalance: { __typename?: 'UserBalanceModel', balance: number } };


export const LoginDocument = gql`
    mutation login($credentials: LoginDto!) {
  login(login: $credentials)
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
 *      credentials: // value for 'credentials'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const LogoutDocument = gql`
    mutation logout {
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
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, options);
      }
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = Apollo.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = Apollo.BaseMutationOptions<LogoutMutation, LogoutMutationVariables>;
export const RegisterDocument = gql`
    mutation register($registerData: RegisterDto!) {
  register(registerData: $registerData)
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
 *      registerData: // value for 'registerData'
 *   },
 * });
 */
export function useRegisterMutation(baseOptions?: Apollo.MutationHookOptions<RegisterMutation, RegisterMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument, options);
      }
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = Apollo.MutationResult<RegisterMutation>;
export type RegisterMutationOptions = Apollo.BaseMutationOptions<RegisterMutation, RegisterMutationVariables>;
export const UserDocument = gql`
    query user {
  user {
    username
    balance
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
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UserQuery, UserQueryVariables>(UserDocument, options);
      }
export function useUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserQuery, UserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UserQuery, UserQueryVariables>(UserDocument, options);
        }
export type UserQueryHookResult = ReturnType<typeof useUserQuery>;
export type UserLazyQueryHookResult = ReturnType<typeof useUserLazyQuery>;
export type UserQueryResult = Apollo.QueryResult<UserQuery, UserQueryVariables>;
export const CategoryListDocument = gql`
    query categoryList {
  categoryList {
    id
    label
  }
}
    `;

/**
 * __useCategoryListQuery__
 *
 * To run a query within a React component, call `useCategoryListQuery` and pass it any options that fit your needs.
 * When your component renders, `useCategoryListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCategoryListQuery({
 *   variables: {
 *   },
 * });
 */
export function useCategoryListQuery(baseOptions?: Apollo.QueryHookOptions<CategoryListQuery, CategoryListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CategoryListQuery, CategoryListQueryVariables>(CategoryListDocument, options);
      }
export function useCategoryListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CategoryListQuery, CategoryListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CategoryListQuery, CategoryListQueryVariables>(CategoryListDocument, options);
        }
export type CategoryListQueryHookResult = ReturnType<typeof useCategoryListQuery>;
export type CategoryListLazyQueryHookResult = ReturnType<typeof useCategoryListLazyQuery>;
export type CategoryListQueryResult = Apollo.QueryResult<CategoryListQuery, CategoryListQueryVariables>;
export const GameHistoryDocument = gql`
    query gameHistory($historyInput: GameHistoryDto!) {
  gameHistory(historyInput: $historyInput) {
    history {
      bet
      createdAt
      game
      multiplier
      win
    }
  }
}
    `;

/**
 * __useGameHistoryQuery__
 *
 * To run a query within a React component, call `useGameHistoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useGameHistoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGameHistoryQuery({
 *   variables: {
 *      historyInput: // value for 'historyInput'
 *   },
 * });
 */
export function useGameHistoryQuery(baseOptions: Apollo.QueryHookOptions<GameHistoryQuery, GameHistoryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GameHistoryQuery, GameHistoryQueryVariables>(GameHistoryDocument, options);
      }
export function useGameHistoryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GameHistoryQuery, GameHistoryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GameHistoryQuery, GameHistoryQueryVariables>(GameHistoryDocument, options);
        }
export type GameHistoryQueryHookResult = ReturnType<typeof useGameHistoryQuery>;
export type GameHistoryLazyQueryHookResult = ReturnType<typeof useGameHistoryLazyQuery>;
export type GameHistoryQueryResult = Apollo.QueryResult<GameHistoryQuery, GameHistoryQueryVariables>;
export const GameListDocument = gql`
    query gameList {
  gameList {
    id
    category
    name
  }
}
    `;

/**
 * __useGameListQuery__
 *
 * To run a query within a React component, call `useGameListQuery` and pass it any options that fit your needs.
 * When your component renders, `useGameListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGameListQuery({
 *   variables: {
 *   },
 * });
 */
export function useGameListQuery(baseOptions?: Apollo.QueryHookOptions<GameListQuery, GameListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GameListQuery, GameListQueryVariables>(GameListDocument, options);
      }
export function useGameListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GameListQuery, GameListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GameListQuery, GameListQueryVariables>(GameListDocument, options);
        }
export type GameListQueryHookResult = ReturnType<typeof useGameListQuery>;
export type GameListLazyQueryHookResult = ReturnType<typeof useGameListLazyQuery>;
export type GameListQueryResult = Apollo.QueryResult<GameListQuery, GameListQueryVariables>;
export const TopWinsDocument = gql`
    query topWins {
  topWins {
    topWins {
      win
      username
      game
    }
    topMultipliers {
      multiplier
      username
      game
    }
  }
}
    `;

/**
 * __useTopWinsQuery__
 *
 * To run a query within a React component, call `useTopWinsQuery` and pass it any options that fit your needs.
 * When your component renders, `useTopWinsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTopWinsQuery({
 *   variables: {
 *   },
 * });
 */
export function useTopWinsQuery(baseOptions?: Apollo.QueryHookOptions<TopWinsQuery, TopWinsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TopWinsQuery, TopWinsQueryVariables>(TopWinsDocument, options);
      }
export function useTopWinsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TopWinsQuery, TopWinsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TopWinsQuery, TopWinsQueryVariables>(TopWinsDocument, options);
        }
export type TopWinsQueryHookResult = ReturnType<typeof useTopWinsQuery>;
export type TopWinsLazyQueryHookResult = ReturnType<typeof useTopWinsLazyQuery>;
export type TopWinsQueryResult = Apollo.QueryResult<TopWinsQuery, TopWinsQueryVariables>;
export const UserBalanceDocument = gql`
    subscription userBalance {
  userBalance {
    balance
  }
}
    `;

/**
 * __useUserBalanceSubscription__
 *
 * To run a query within a React component, call `useUserBalanceSubscription` and pass it any options that fit your needs.
 * When your component renders, `useUserBalanceSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserBalanceSubscription({
 *   variables: {
 *   },
 * });
 */
export function useUserBalanceSubscription(baseOptions?: Apollo.SubscriptionHookOptions<UserBalanceSubscription, UserBalanceSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<UserBalanceSubscription, UserBalanceSubscriptionVariables>(UserBalanceDocument, options);
      }
export type UserBalanceSubscriptionHookResult = ReturnType<typeof useUserBalanceSubscription>;
export type UserBalanceSubscriptionResult = Apollo.SubscriptionResult<UserBalanceSubscription>;