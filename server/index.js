import { AccountsServer } from '@accounts/server'
import { AccountsPassword } from '@accounts/password'
import MongoDBInterface from '@accounts/mongo'
import { createAccountsGraphQL } from '@accounts/graphql-api'
import { DatabaseManager } from '@accounts/database-manager'
import { randomBytes } from 'crypto'

export { accountsContext } from '@accounts/graphql-api'

const METEOR_ID_LENGTH = 17
const idProvider = () =>
  randomBytes(30)
    .toString('base64')
    .replace(/[\W_]+/g, '')
    .substr(0, METEOR_ID_LENGTH)

export const createApolloAccounts = ({ db, tokenSecret }) => {
  const userStorage = new MongoDBInterface(db, {
    convertUserIdToMongoObjectId: false,
    convertSessionIdToMongoObjectId: false,
    idProvider
  })

  const dbManager = new DatabaseManager({
    sessionStorage: userStorage,
    userStorage
  })

  const accountsServer = new AccountsServer(
    { db: dbManager, tokenSecret },
    {
      password: new AccountsPassword({ passwordHashAlgorithm: 'sha256' })
    }
  )

  return createAccountsGraphQL(accountsServer, { extend: true })
}
