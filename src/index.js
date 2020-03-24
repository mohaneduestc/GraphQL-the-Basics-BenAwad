const { ApolloServer, gql, pubsub } = require("apollo-server");

const typeDefs = gql`
  type Query {
    hello(name: String): String
    user: User
  }

  type User {
    id: ID!
    username: String!
    firstLetterOfUsername: String!
  }
  type Error {
    field: String!
    message: String!
  }

  type RegisterResponse {
    errors: [Error]
    user: User
  }

  input UserInfo {
    username: String!
    password: String!
    age: Int
  }

  type Mutation {
    register(userInfo: UserInfo!): RegisterResponse!
    login(userInfo: UserInfo): String!
  }
  type Subscription {
    newUser: User!
  }
`;

const NEW_USER = "NEW_USER";

const resolvers = {
  Subscription: {
    newUser: {
      subscribe: (_, __, { pubsub }) => pubsub.asyncIterator(NEW_USER)
    }
  },
  User: {
    firstLetterOfUsername: parent => {
      return parent.username ? parent.username[0] : null;
    }
  },
  Query: {
    hello: (parent, { name }) => {
      return `Hello ${name}`;
    },
    user: () => ({
      id: 1,
      username: "bob"
    })
  },
  Mutation: {
    login: (parent, { userInfo: { username } }, context, info) => {
      return username;
    },
    register: (_, __, { pubsub }) => {
        pubsub.publish(NEW_USER,{
            newUser:
        })
      return {
        errors: [
          {
            field: "username",
            message: "bad"
          },
          {
            field: "username1",
            message: "bad1"
          }
        ],
        user: {
          id: 1,
          username: "bob"
        }
      };
    }
  }
};

const pubsub = new pubsub();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => ({ req, res })
});

server.listen().then(({ url }) => console.log(`server listen at ${url}`));
