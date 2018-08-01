# Apollo Accounts Password—Server [![npm version](https://badge.fury.io/js/apollo-accounts-password-server.svg)](https://www.npmjs.com/package/apollo-accounts-password-server)

Server side of [Apollo Accounts Password](https://github.com/flyblackbird/apollo-accounts), a full-stack JS accounts system for Apollo and MongoDB.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Usage](#usage)
- [Demo](#demo)
- [API](#api)
  - [createApolloAccounts](#createapolloaccounts)
  - [accountsContext](#accountscontext)
- [Eject](#eject)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Usage

`npm install apollo-accounts-password-server`

```js
import { ApolloServer, makeExecutableSchema } from 'apollo-server'
import { merge } from 'lodash'
import mongodb from 'mongodb'

import {
  createApolloAccounts,
  accountsContext
} from 'apollo-accounts-password-server'

const start = async () => {
  const client = await mongodb.MongoClient.connect(process.env.MONGO_URL)
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
  }
  `

  const resolvers = {
    Query: {
      publicField: () => 'public',
      privateField: () => 'private',
      privateType: () => ({
        field: () => 'private'
      }),
      adminField: (root, args, context) => {
        if (context.user.isAdmin) {
          return 'admin field'
        }
      }
    },
    User: {
      firstName: () => 'first'
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
```

`createApolloAccounts()` generates typedefs, resolvers, and directives for us to use in our schema. It creates a `User` type that we can extend and an `@auth` directive for fields and types that returns an error if the client is not logged in. It also creates resolvers and types used by [`apollo-accounts-password-client`](https://github.com/flyblackbird/apollo-accounts/tree/master/client).

## Demo

See [flyblackbird/apollo-accounts](https://github.com/flyblackbird/apollo-accounts/#demo)

## API

### createApolloAccounts

`createApolloAccounts(options)`

[`options` format](https://github.com/accounts-js/accounts/blob/master/packages/server/src/types/accounts-server-options.ts). Detailed format:

- `options.db`: (*Required*) the database connection. Using the `mongodb` module:

```js  
const client = await mongodb.MongoClient.connect(process.env.MONGO_URL)

// uses the db listed at the end of the MONGO_URL
const db = client.db() 
// or:
const db = client.db('my-db-name')
```

Using Mongoose:

```js
await mongoose.connect(
  'mongodb://localhost:27017/apollo-accounts-demo',
  { useNewUrlParser: true }
)
const db = mongoose.connection
```

- `options.tokenSecret`: (*Required*) a secret the library uses for token creation. You can generate a secret with `openssl rand -base64 30`.
- `options.siteUrl`: (*Required*) eg `'http://localhost:3000'` or `'https://myapp.com'`
- `options.sendMail`: (*Required*) a function that sends an email. For instance:

```js
import nodemailer from 'nodemailer'
let transporter = nodemailer.createTransport('smtps://username:password@smtp.example.com/?pool=true')

...
sendMail: ({ from, subject, to, text, html }) => {
  transporter.sendMail({
    from,
    to,
    subject,
    text,
    html
  }, (err, info) => {
    console.log(info)
  })
}
```

- `options.emailTemplates`: templates for auth emails. [Format](https://github.com/accounts-js/accounts/blob/master/packages/server/src/utils/email.ts). Defaults:

```
{
  from: 'accounts-js <no-reply@accounts-js.com>',
  verifyEmail: {
    subject: () => 'Verify your account email',
    text: (user, url) =>
      `To verify your account email please click on this link: ${url}`,
    html: (user, url) =>
      `To verify your account email please <a href="${url}">click here</a>.`,
  },
  resetPassword: {
    subject: () => 'Reset your password',
    text: (user, url) => `To reset your password please click on this link: ${url}`,
    html: (user, url) => `To reset your password please <a href="${url}">click here</a>.`,
  }
}
```

- `options.userObjectSanitizer`: a function that, given a user object from the database, returns a filtered user object that will be sent to the client. The default only removes authentication data (`user.services`). Here is an example that removes the `username` field:

```js
userObjectSanitizer: (user, omit, pick) => omit(user, ['username'])
```

- `options.tokenConfigs`: expiration for the access and refresh tokens. The default values are: 

```js
tokenConfigs: {
  accessToken: {
    expiresIn: '90m',
  },
  refreshToken: {
    expiresIn: '90d',
  },
}
```

The refresh token expiration matches Meteor's default 90-day login token expiration. 

Expiration format matches [`jwt.sign`](https://github.com/auth0/node-jsonwebtoken#jwtsignpayload-secretorprivatekey-options-callback)'s `options.expiresIn`.


- `options.impersonationAuthorize`: a function that, given the current user and the target of impersonation, returns whether to allow impersonation. For example:

```js
impersonationAuthorize: (currentUser, targetUser) => currentUser.isAdmin
```

### accountsContext

Sets the request context so that we can access `context.user` in our resolvers:

```js
const server = new ApolloServer({
  schema,
  context: ({ req }) => accountsContext(req)
})
```

## Eject

This package is like Apollo Boost—if at some point you need more configuration options than this package exposes, you can eject by directly installing the below `accounts-js` packages and configuring them yourself:

`npm install @accounts/server @accounts/password @accounts/graphql-api @accounts/database-manager @accounts/mongo`

See [index.js](https://github.com/flyblackbird/apollo-accounts/tree/master/server/index.js)

[*Credits*](https://github.com/flyblackbird/apollo-accounts/#credits)