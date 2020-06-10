// A resolver is a function that's responsible for populating the data for a single field in your schema. Whenever a client queries for a particular field, the resolver for that field fetches the requested data from the appropriate data source.

//This is a top-level resolver, this will execute before the children for this field
//This does not use 'context' they're just destructing the dataSources we defined
const {
    paginateResults
} = require('./utils');

module.exports = {
    Query: {
        launches: async (_, {
            pageSize = 20,
            after
        }, {
            dataSources
        }) => {
            const allLaunches = await dataSources.launchAPI.getAllLaunches();
            //Reverse Chronological Order   
            allLaunches.reverse();
            const launches = paginateResults({
                after,
                pageSize,
                results: allLaunches
            });
            return {
                launches,
                cursor: launches.length ? launches[launches.length - 1].cursor : null,
                //Making sure if we have anymore results or not, if the paginated results is the same as last item then no more results 
                hasMore: launches.length ?
                    launches[launches.length - 1].cursor !==
                    allLaunches[allLaunches.length - 1].cursor : false
            };
        },
        launch: (_, {
                id
            }, {
                dataSources
            }) =>
            dataSources.launchAPI.getLaunchById({
                launchId: id
            }),
        me: (_, __, {
            dataSources
        }) => dataSources.userAPI.findOrCreateUser()
    },
    Mutation: {
        login: async (_, {
            email
        }, {
            dataSources
        }) => {
            const user = await dataSources.userAPI.findOrCreateUser({
                email
            });
            if (user) return Buffer.from(email).toString('base64');
        },
        bookTrips: async (_, {
            launchIds
        }, {
            dataSources
        }) => {
            const results = await dataSources.userAPI.bookTrips({
                launchIds
            });
            const launches = await dataSources.launchAPI.getLaunchesByIds({
                launchIds,
            });

            return {
                success: results && results.length === launchIds.length,
                message:
                results.length === launchIds.length ?
                    'trips successfully booked' :
                    `this wasnt able to be booked: ${launchIds.filter(
                    id => !results.includes(id),
                )}`,
                launches,
            };
        },

        cancelTrip: async (_, {
            launchId
        }, {
            dataSources
        }) => {
            const result = await dataSources.userAPI.cancelTrip({
                launchId
            });

            if (!result)
                return {
                    success: false,
                    message: 'cannot cancel trip'
                };

            const launch = await dataSources.launchAPI.getLaunchById({
                launchId
            });
            return {
                success: true,
                message: 'trip cancelled',
                launches: [launch],
            };
        }
    },
    Mission: {
        missionPatch: (mission, {
            size
        } = {
            size: 'LARGE'
        }) => {
            return size === 'SMALL' ?
                mission.missionPatchSmall :
                mission.missionPatchLarge;
        },
    },

    Launch: {
        isBooked: async (launch, _, {
                dataSources
            }) =>
            dataSources.userAPI.isBookedOnLaunch({
                launchId: launch.id
            }),
    },

    User: {
        trips: async (_, __, {
            dataSources
        }) => {
            //get ids of the launch by user
            const launchIds = await dataSources.userAPI.getLaunchIdsByUser();
            if (!launchIds.length) return [];
            //looking up launch by Ids
            return (
                dataSources.launchAPI.getLaunchByIds({
                    launchIds,
                }) || []
            );
        },
    },
};