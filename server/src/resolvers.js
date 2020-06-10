// A resolver is a function that's responsible for populating the data for a single field in your schema. Whenever a client queries for a particular field, the resolver for that field fetches the requested data from the appropriate data source.

//This is a top-level resolver, this will execute before the children for this field
//This does not use 'context' they're just destructing the dataSources we defined

module.exports = {
    Query: {
        launches: (_, __, { dataSources }) =>
            dataSources.launchAPI.getAllLaunches(),
        launch: (_, { id }, {dataSources}) =>
            dataSources.launchAPI.getLaunchById({ launchId: id }),
        me: (_, __, { dataSources }) => dataSources.userAPI.findOrCreateUser()
    },

    Mission: {
        missionPatch: (mission, { size } = { size: 'LARGE' }) => {
            
        }
    }
};