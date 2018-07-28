import { ApolloServer, makeExecutableSchema } from 'apollo-server'
import {
  createApolloAccounts,
  accountsContext
} from 'apollo-accounts-password-server'
import { merge } from 'lodash'
import mongodb from 'mongodb'

const start = async () => {
  // await mongoose.connect(
  //   // 'mongodb://localhost:27017/accounts-js-graphql-example'
  //   'mongodb://localhost:3001/meteor',
  //   { useNewUrlParser: true }
  // )
  // const db = mongoose.connection

  // OR:
  // const client = await mongodb.MongoClient.connect(process.env.MONGO_URL);
  const client = await mongodb.MongoClient.connect(
    // 'mongodb://localhost:3001/meteor'
    'mongodb://localhost:27017/apollo-accounts-demo',
    { useNewUrlParser: true }
  )
  const db = client.db()

  const accounts = createApolloAccounts({
    db,
    tokenSecret: process.env.TOKEN_SECRET,
    siteUrl:
      process.env.NODE_ENV === 'production'
        ? 'https://myapp.com'
        : 'http://localhost:3000'
  })

  const typeDefs = `
  type PrivateType @auth {
    field: String
  }

  type Query {
    publicField: String
    privateField: String @auth
    privateType: PrivateType
    adminField: String @auth
  }

  type Mutation {
    _: String
  }

  extend type User {
    firstName: String
    lastName: String
  }
  `

  const resolvers = {
    Query: {
      publicField: () => 'public',
      privateField: () => 'private',
      privateType: () => ({
        field: () => 'private'
      }),
      adminField: (roots, args, context) => {
        if (context.user.admin) {
          return 'admin field'
        }
      }
    },
    User: {
      firstName: () => 'first',
      lastName: () => 'last'
    }
  }

  const schema = makeExecutableSchema({
    typeDefs: [typeDefs, accounts.typeDefs],
    resolvers: merge(accounts.resolvers, resolvers),
    schemaDirectives: {
      ...accounts.schemaDirectives
    }
  })

  const server = new ApolloServer({
    schema,
    context: ({ req }) => accountsContext(req),
    formatError: e => console.log(e) || e
  })

  server.listen(4000).then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`)
  })
}

start()
