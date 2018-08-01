# Apollo Accounts Password—Client [![npm version](https://badge.fury.io/js/apollo-accounts-password-client.svg)](https://www.npmjs.com/package/apollo-accounts-password-client)

Client side of [Apollo Accounts Password](https://github.com/flyblackbird/apollo-accounts), a full-stack JS accounts system for Apollo and MongoDB.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Usage](#usage)
- [Demo](#demo)
- [API](#api)
  - [Constructor](#constructor)
  - [createUser](#createuser)
  - [login](#login)
  - [refreshSession](#refreshsession)
  - [logout](#logout)
  - [getUser](#getuser)
  - [sendVerificationEmail](#sendverificationemail)
  - [verifyEmail](#verifyemail)
  - [requestPasswordReset](#requestpasswordreset)
  - [resetPassword](#resetpassword)
  - [changePassword](#changepassword)
  - [getTwoFactorSecret](#gettwofactorsecret)
  - [twoFactorSet](#twofactorset)
  - [impersonate](#impersonate)
  - [stopImpersonation](#stopimpersonation)
- [Eject](#eject)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Usage

`npm install apollo-accounts-password-client`

```js
import ApolloAccounts from 'apollo-accounts-password-client'
import ApolloClient from 'apollo-boost'

const apolloClient = new ApolloClient({
  uri: 'http://localhost:4000/graphql'
})

const Accounts = new ApolloAccounts(apolloClient)

Accounts.login({
  user: {
    email: 'bar@example.com'
  },
  password: 'foo'
})
```

(You'll also need to set up a server at `localhost:4000/graphql` that uses [apollo-accounts-password-server](https://github.com/flyblackbird/apollo-accounts/tree/master/server).)

## Demo

See [flyblackbird/apollo-accounts](https://github.com/flyblackbird/apollo-accounts/#demos)

## API

Below we list all the methods of `ApolloAccounts`. Most methods return a promise that resolves when the response is received from the server. If you need other methods that are supported by `accounts-js`, you can access them through:
  - `Accounts.accountsGraphQL`: an instance of a `GraphQLClient` from [`@accounts/graphql-client`](https://github.com/accounts-js/accounts/tree/master/packages/graphql-client)
  - `Accounts.accountsClient`: an instance of `AccountsClient` from [`@accounts/client`](https://github.com/accounts-js/accounts/tree/master/packages/client)
  - `Accounts.accountsPassword`: an instance of `AccountsClientPassword` from [`@accounts/client-password`](https://github.com/accounts-js/accounts/tree/master/packages/client-password)

### Constructor

`new ApolloAccounts(`[apolloClientInstance](https://www.apollographql.com/docs/react/api/apollo-client.html#apollo-client)`, `[accountsClientOptions](https://github.com/accounts-js/accounts/blob/master/packages/client/src/types/options.ts)`)`

Usually `accountsClientOptions` is left out, unless you're in React Native:

```js
import { AsyncStorage } from 'react-native'

const Accounts = new ApolloAccounts(apolloClient, {
  tokenStorage: AsyncStorage
})
```

### createUser

```
createUser({ email, password })
createUser({ username, password })
```

[Does not](https://github.com/accounts-js/accounts/issues/377) automatically log the user in.

### login 

`login(loginInfo)`

- `loginInfo`:
  - `user` an object of the form `{ email: 'a@b.c' }` or `{ username: 'loren' }`
  - `password`
  - `code` if you're using 2fa

```js
Accounts.login({ password: 'foo', user: { email: 'bar@example.com' } })
```

### refreshSession

`const { accessToken, refreshToken } = Accounts.refreshSession()` 

Gets the login tokens from LocalStorage, or if the `accessToken` is expired, refreshes it (i.e. gets a new `accessToken` from the server using the `refreshToken`).

If it returns `null`, the `refreshToken` is expired, and the user must login again.

### logout

`logout()`

Tells the server to invalidate the tokens and clears them from memory on the client.

### getUser

```js
const tokens = Accounts.refreshSession()
if (!tokens) {
  redirectTo('/login')
  return
}

const user = Accounts.getUser(tokens.accessToken)
```

Fetches the user doc, given the `accessToken` returned by [`refreshSession()`](#refreshsession).

### sendVerificationEmail

`sendVerificationEmail(emailAddress)`

Sends an email which contains a link to this app with a secret token in the URL.

### verifyEmail

`verifyEmail(token)`

- `token`: retrieved from the URL (the link clicked in the verification email)

### requestPasswordReset

`requestPasswordReset(emailAddress)`

Sends an email which contains a link to this app with a secret token in the URL.

### resetPassword

`resetPassword(token, newPassword)`

- `token`: retrieved from the URL (the link clicked in the reset password email)

### changePassword

`changePassword(old, new)`

### getTwoFactorSecret

`const secret = Accounts.getTwoFactorSecret()`

- `secret`: 
  - `base32`: backup code for user to write down if they'd like
  - `otpauth_url`: a QR code to be displayed, for instance with `qrcode.react`: `<QRCode value={secret.otpauth_url} />`

[Example usage](https://github.com/flyblackbird/apollo-accounts/tree/master/demo/web/src/TwoFactor.js)

### twoFactorSet

`twoFactorSet(secret, oneTimeCode)`

- `secret` obtained from [`getTwoFactorSecret`](#gettwofactorsecret)
- `oneTimeCode` entered by the user after they use an app like Authy to scan the QR code.

### impersonate

`impersonate(user)`

- `user`: `{ userId }` or `{ username }` or `{ email }`

If the current user has the correct authorization (see [`options.impersonationAuthorize`](https://github.com/flyblackbird/apollo-accounts/tree/master/server#createapolloaccounts)), this fetches and saves the target user's tokens.

### stopImpersonation

`stopImpersonation()`

Deletes the impersonated user's tokens and restores the original user's tokens.

## Eject

This package is like Apollo Boost—if at some point you need more configuration options than this package exposes, you can eject by directly installing the below `accounts-js` packages and configuring them yourself:

`npm install @accounts/client @accounts/client-password  @accounts/graphql-client`

```js
import ApolloClient from 'apollo-boost'

const apolloClient = new ApolloClient({ ... })
const accountsGraphQL = new GraphQLClient({ graphQLClient: apolloClient })
const accountsClient = new AccountsClient(
  accountsClientOptions,
  accountsGraphQL
)
const accountsPassword = new AccountsClientPassword(accountsClient)
```

---

[Credits](https://github.com/flyblackbird/apollo-accounts/#credits)