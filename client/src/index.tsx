import { ApolloClient } from 'apollo-client';
import gql from 'graphql-tag';
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { ApolloProvider, useQuery } from '@apollo/react-hooks';
import React from 'react';
import ReactDOM from 'react-dom';
import Login from './pages/login';
import Pages from './pages';
import injectStyles from './styles';
import { resolvers, typeDefs } from './resolvers';

const cache = new InMemoryCache();
const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
    cache,
    link: new HttpLink({
        uri: 'http://localhost:4000/',
        headers: {
            authorization: localStorage.getItem('token'),
        },
    }),
    typeDefs,
    resolvers,
});

cache.writeData({
    data: {
        isLoggedIn: !!localStorage.getItem('token'),
        cartItems: [],
    },
});

const IS_LOGGED_IN = gql`
    query IsUserLoggedIn {
        isLoggedIn @client
    }
`;

function IsLoggedIn() {
    const { data } = useQuery(IS_LOGGED_IN);
    return data.isLoggedIn ? <Pages /> : <Login />;
}

//Connecting the Apollo Client to React
//This would just work like a context provider - providing access throughout the Component Tree as a Top-Level Component
injectStyles();
ReactDOM.render(
    <ApolloProvider client = {client}>
        <IsLoggedIn />
    </ApolloProvider>,
    document.getElementById('root')
);

//Vanilla Way
/* client
    .query({
        query: gql`
            query GetLaunch {
                launch(id: 56) {
                    id
                    mission {
                        name
                    }
                }
            }
            `
        })
        .then(result => console.log(result)); */