import gql from 'graphql-tag';
import { ApolloCache } from 'apollo-cache';
import * as GetCartItemTypes from './pages/__generated__/GetCartItems';
import * as LaunchTileTypes from './pages/__generated__/LaunchTile';
import { Resolvers } from 'apollo-client'

export const typeDefs = gql`
    extend type Query {
        isLoggedIn: Boolean!
        cartItems: [ID!]!
    } 

    extend type Launch {
        isInCart: Boolean!
    }

    extend type Mutation {
        addorRemoveFromCart(id: ID!): [ID!]!
    }
`;

type ResolverFn = (
    parent: any,
    args: any,
    { cache } : { cache: ApolloCache<any> }
) => any;

interface ResolverMap {
    [field: string]: ResolverFn;
}

interface AppResolvers extends Resolvers {
    //Gonna update with app resolvers lateron
}

export const resolvers = {};
export default {}