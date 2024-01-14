/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date string, such as 2007-12-03, compliant with the `full-date` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  Date: { input: any; output: any; }
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: { input: any; output: any; }
};

export type Mutation = {
  __typename: 'Mutation';
  _version: Scalars['String']['output'];
};

export type Node = {
  id: Scalars['ID']['output'];
};

export type Query = {
  __typename: 'Query';
  _version: Scalars['String']['output'];
  node?: Maybe<Node>;
  nodes: Array<Maybe<Node>>;
  stories?: Maybe<QueryStoriesList>;
  story?: Maybe<Story>;
  user?: Maybe<User>;
};


export type QueryNodeArgs = {
  id: Scalars['ID']['input'];
};


export type QueryNodesArgs = {
  ids: Array<Scalars['ID']['input']>;
};


export type QueryStoriesArgs = {
  page?: Scalars['Int']['input'];
};


export type QueryStoryArgs = {
  id: Scalars['ID']['input'];
};


export type QueryUserArgs = {
  id: Scalars['ID']['input'];
};

export type QueryStoriesList = {
  __typename: 'QueryStoriesList';
  nodes: Array<Story>;
  totalCount?: Maybe<Scalars['Int']['output']>;
};

export type Story = Node & {
  __typename: 'Story';
  comments_count?: Maybe<Scalars['Int']['output']>;
  created_at?: Maybe<Scalars['Date']['output']>;
  domain?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  points: Scalars['Int']['output'];
  submitter?: Maybe<User>;
  title: Scalars['String']['output'];
  url?: Maybe<Scalars['String']['output']>;
  username?: Maybe<Scalars['String']['output']>;
};

export type User = Node & {
  __typename: 'User';
  id: Scalars['ID']['output'];
  username?: Maybe<Scalars['String']['output']>;
};

export type GetStoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetStoriesQuery = { __typename: 'Query', stories?: { __typename: 'QueryStoriesList', nodes: Array<{ __typename: 'Story', id: string, title: string, url?: string | null, domain?: string | null, username?: string | null, points: number, comments_count?: number | null, created_at?: any | null, submitter?: { __typename: 'User', username?: string | null } | null }> } | null };


export const GetStoriesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getStories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"points"}},{"kind":"Field","name":{"kind":"Name","value":"comments_count"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"submitter"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetStoriesQuery, GetStoriesQueryVariables>;