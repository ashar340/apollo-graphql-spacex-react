const { ApolloServer } = require('apollo-server');
const typeDefs = require('./schema');
const { createStore } = require('./utils');
const resolvers = require('./resolvers');
const LaunchAPI = require('./datasources/launch');
const userAPI = require('./datasources/user');
const isEmail = require('isemail');

const store = createStore();

const server = new ApolloServer({
    context: async ({ req }) => {
        //auth check
        const auth = req.headers && req.headers.authorization || '';
        const email = Buffer.from(auth, 'base64').toString('ascii');
        if (!isEmail.validate(email)) return { user: null };

        //lookup a user by email
        const users = await store.users.findOrCreate({ where: { email } });
        const user = users && users[0] || null;
        return { user: {...user.dataValues } };
    },
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