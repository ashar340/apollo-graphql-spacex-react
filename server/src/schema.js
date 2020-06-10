const { gql } = require('apollo-server');

//var for the schema
const typeDefs = gql`
# schema goes here (written in SDL)
type Launch {
    id: ID!
    site: String
    mission: Mission
    rocket: Rocket
    isBooked: Boolean!
}

type Rocket {
    id: ID!
    name: String
    type: String
}

type User {
    id: ID!
    email: String!
    trips: [Launch]!
}

type Mission {
    name: String
    missionPatch(size: PatchSize): String
}

enum PatchSize {
    SMALL
    LARGE
}

#Used to Query (CLients)
type Query {
    launches(
        """
        The number of results to show. Must be >= 1. Default = 20
        """
        pageSize: Int
        """
        If we add a cursor here, it only would add results _after_ this cursor
        """
        after: String
    ): LaunchConnection!
    launch(id: ID!): Launch
    me: User
}

"""
Simple Wrapper around the list of launches containing a cursor to the last item in the list. Passing this cursor to the launches query to fetch results
after these.
"""

type LaunchConnection {
    cursor: String! #indicates current position in the data set
    hasMore: Boolean! #indication if more data is there to fetch beyond launches
    launches: [Launch]!
}
type Mutation {
    #This mutation would allow the logged-in user to book a trip for one/more of the launches
    bookTrips(launchIds: [ID]!): TripUpdateResponse!

    cancelTrip(launchIDs: ID!): TripUpdateResponse!
    login(email: String): String #the login token
}

type TripUpdateResponse {
    success: Boolean! #contains asuccess status
    message: String
    launches: [Launch]
}
`;

module.exports = typeDefs;