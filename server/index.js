import { AccountsServer } from '@accounts/server'
import { AccountsPassword } from '@accounts/password'
import MongoDBInterface from '@accounts/mongo'
import { createAccountsGraphQL } from '@accounts/graphql-api'
import { DatabaseManager } from '@accounts/database-manager'
import { randomBytes } from 'crypto'
import { defaultsDeep } from 'lodash'

export { accountsContext } from '@accounts/graphql-api'

const METEOR_ID_LENGTH = 17
const idProvider = () =>
  randomBytes(30)
    .toString('base64')
    .replace(/[\W_]+/g, '')
    .substr(0, METEOR_ID_LENGTH)

const dateProvider = date => (date ? date : new Date())

const defaultOptions = {
  tokenSecret: 'insecure',
  tokenConfigs: {
    refreshToken: {
      expiresIn: '90d'
    }
  },
  siteUrl: 'http://localhost:3000'
}

export const createApolloAccounts = ({ db, ...givenOptions }) => {
  if (!db) {
    console.error('createApolloAccounts: db is a required parameter')
  }
  if (!givenOptions.tokenSecret) {
    console.log(
      'Must provide a tokenSecret (long random string) to createApolloAccounts()'
    )
  }

  const mongoStorage = new MongoDBInterface(db, {
    convertUserIdToMongoObjectId: false,
    convertSessionIdToMongoObjectId: false,
    idProvider,
    dateProvider
  })

  const dbManager = new DatabaseManager({
    sessionStorage: mongoStorage,
    userStorage: mongoStorage
  })

  const options = defaultsDeep(givenOptions, defaultOptions)

  const accountsServer = new AccountsServer(
    { db: dbManager, ...options },
    {
      password: new AccountsPassword({ passwordHashAlgorithm: 'sha256' })
    }
  )

  return createAccountsGraphQL(accountsServer, { extend: true })
}
