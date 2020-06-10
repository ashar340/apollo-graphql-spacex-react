const { ApolloServer } = require('apollo-server');
const typeDefs = require('./schema');
const { createStore } = require('./utils');
const resolvers = require('./resolvers');
const LaunchAPI = require('./datasources/launch');
const userAPI = require('./datasources/user');

const store = createStore();

const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => ({
        launchAPI: new LaunchAPI(),
        userAPI: new userAPI({ store })
    })
});

server.listen().then(({url}) => {
    console.log(`Server is up at ${url}`);
});