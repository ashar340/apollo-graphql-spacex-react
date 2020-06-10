import { ApolloClient } from 'apollo-client';
//import gql from 'graphql-tag';
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { ApolloProvider } from '@apollo/react-hooks';
import React from 'react';
import ReactDOM from 'react-dom';
import Pages from './pages';
import injectStyles from './styles';

const cache = new InMemoryCache();
const link = new HttpLink({
    uri: 'http://localhost:4000/'
});

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
    cache,
    link
});

//Connecting the Apollo Client to React
//This would just work like a context provider - providing access throughout the Component Tree as a Top-Level Component
injectStyles();
ReactDOM.render(
    <ApolloProvider client = {client}>
        <Pages/>
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