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

const onLoginHooks = []
export const onLogin = hook => onLoginHooks.push(hook)
const callOnLoginHooks = info => onLoginHooks.forEach(hook => hook(info))

const onCreateUserHooks = []
export const onCreateUser = hook => onCreateUserHooks.push(hook)
const callOnCreateUserHooks = user =>
  onCreateUserHooks.forEach(hook => hook(user))

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
      'Warning: Must provide a tokenSecret (long random string) to createApolloAccounts()'
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

  // full list of hooks:
  // https://github.com/accounts-js/accounts/blob/master/packages/server/src/utils/server-hooks.ts
  accountsServer.on('LoginSuccess', callOnLoginHooks)
  accountsServer.on('CreateUserSuccess', callOnCreateUserHooks)

  return createAccountsGraphQL(accountsServer, { extend: true })
}
