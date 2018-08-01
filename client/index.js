import { AccountsClient } from '@accounts/client'
import { AccountsClientPassword } from '@accounts/client-password'
import GraphQLClient from '@accounts/graphql-client'

export default class Accounts {
  constructor(apolloClient, accountsClientOptions) {
    const accountsGraphQL = new GraphQLClient({ graphQLClient: apolloClient })
    const accountsClient = new AccountsClient(
      accountsClientOptions,
      accountsGraphQL
    )
    const accountsPassword = new AccountsClientPassword(accountsClient)

    this.accountsGraphQL = accountsGraphQL
    this.accountsClient = accountsClient
    this.accountsPassword = accountsPassword

    this.createUser = accountsPassword.createUser.bind(accountsPassword)
    this.login = accountsPassword.login.bind(accountsPassword)
    this.refreshSession = accountsClient.refreshSession.bind(accountsClient)
    this.logout = accountsClient.logout.bind(accountsClient)

    this.getUser = accountsGraphQL.getUser.bind(accountsGraphQL)

    this.sendVerificationEmail = accountsGraphQL.sendVerificationEmail.bind(
      accountsGraphQL
    )
    this.verifyEmail = accountsGraphQL.verifyEmail.bind(accountsGraphQL)

    this.requestPasswordReset = accountsPassword.requestPasswordReset.bind(
      accountsPassword
    )
    this.resetPassword = accountsPassword.resetPassword.bind(accountsPassword)
    this.changePassword = accountsPassword.changePassword.bind(accountsPassword)

    this.twoFactorSet = accountsGraphQL.twoFactorSet.bind(accountsGraphQL)
    this.getTwoFactorSecret = accountsGraphQL.getTwoFactorSecret.bind(
      accountsGraphQL
    )

    this.impersonate = accountsClient.impersonate.bind(accountsClient)
    this.stopImpersonation = accountsClient.stopImpersonation.bind(
      accountsClientOptions
    )
  }
}
