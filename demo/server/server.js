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
    tokenSecret: 'secret'
  })

  const typeDefs = `
  type PrivateType @auth {
    field: String
  }

  type Query {
    publicField: String
    privateField: String @auth
    privateType: PrivateType
  }

  type Mutation {
    _: String
  }
  `

  const resolvers = {
    Query: {
      publicField: () => 'public',
      privateField: () => 'private',
      privateType: () => ({
        field: () => 'private'
      })
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
    context: ({ req }) => accountsContext(req)
  })

  server.listen(4000).then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`)
  })
}

start()
