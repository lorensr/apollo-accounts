## Apollo Accounts Password

Full-stack JS accounts system for Apollo and MongoDB

[Compatible](#meteor-compatibility) with Meteor's `accounts-password`.

Based on [accounts-js](https://accounts-js.netlify.com/).

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Documentation](#documentation)
- [Demos](#demos)
  - [Web](#web)
  - [React Native](#react-native)
  - [Server](#server)
    - [MongoDB](#mongodb)
    - [Start server](#start-server)
    - [Query server](#query-server)
- [Meteor compatibility](#meteor-compatibility)
- [Contributing](#contributing)
  - [React Native](#react-native-1)
- [Credits](#credits)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Documentation

**[apollo-accounts-password-client](client/README.md)**

**[apollo-accounts-password-server](server/README.md)**

## Demos

```
git clone https://github.com/flyblackbird/apollo-accounts
cd apollo-accounts
```

- [Web](#web)
- [React Native](#react-native)
- [Server](#server)

### Web

```
cd demo/web
npm install
npm start
```

[localhost:3000](http://localhost:3000)

![Web app login screen](https://www.dropbox.com/s/o91zqqg5gi197nl/Screenshot%202018-07-28%2002.20.13.png?raw=1)

### React Native

```
cd demo/react-native
npm start
```

Either scan the QR code with the Expo app or open a simulator (eg hit `i` for iOS simulator).

### Server

- [MongoDB](#mongodb)
- [Start server](#start-server)
- [Query server](#query-server)

#### MongoDB

If you're using an existing `accounts-password` Meteor app's database, you can first run `meteor start` in your Meteor app directory and then add a `MONGO_URL` to the `npm start` command in the [next section](#start-server):

```
MONGO_URL="mongodb://localhost:3001/meteor" npm start
```

To start with a new database:

```
brew install docker-compose
```

If you run into an error, you might need to do:

```
sudo mkdir /usr/local/Frameworks
sudo chown $(whoami):admin /usr/local/Frameworks
```

Create a docker machine:

```
docker-machine create --driver virtualbox default
eval "$(docker-machine env default)"
```

Start mongo:

```
cd demo/server
docker-compose up -d
```

#### Start server

```
npm install
npm start
```

#### Query server

Open GraphQL Playground at [localhost:4000](http://localhost:4000/) and try these operations:

```graphql
mutation {
  register(user: { username: "loren", password: "pass" })
}

mutation {
  authenticate(
    serviceName: "password"
    params: { password: "pass", user: { username: "loren" } }
  ) {
    tokens {
      accessToken
    }
  }
}

query {
  privateField
}
```

## Meteor compatibility

This package is configured to use the same hashing algorithms as Meteor's `accounts-password`, and both it and Meteor stores user documents in a `users` MongoDB collection, and the documents are in the same format, including a the `services.password.bcrypt` field. So you can use the same database to back both a Meteor app and a node app using this package—a user created with one app will be able to login with the same username/email and password in the other app. If you are migrating away from Meteor, then after you've switched over to the node app, you can delete all of the `services.resume` fields, as this package does not use them. (Instead, it creates a collection called `sessions`.) 

Some of the API methods are named differently (for instance `login()` instead of `loginWithPassword()`) or act differently (for instance taking different arguments, or in the case of `onCreateUser()`, is executed after the user is stored instead of beforehand). Here are the [client](https://github.com/flyblackbird/apollo-accounts/tree/master/client#api) and [server](https://github.com/flyblackbird/apollo-accounts/tree/master/server#api) APIs.

## Contributing

Build and link packages:

```
git clone https://github.com/flyblackbird/apollo-accounts.git
cd apollo-accounts/client
npm run build
npm link
cd ../server
npm run build
npm link
```

Run server and web client:

```
cd ../demo/server
npm link apollo-accounts-password-server
npm install
npm start
```

```
cd demo/web
npm link apollo-accounts-password-client
npm install
npm start
```

### React Native

RN doesn't like symlinks in `node_modules/`, so we use `wml`:

```
npm i -g wml
cd apollo-accounts
wml add client demo/react-native/node_modules/apollo-accounts-password-client
wml start
```

In another terminal:

```
rm -rf demo/react-native/node_modules/apollo-accounts-password-client/node_modules/
cd demo/react-native
npm start
```

## Credits

Thank you to:
- Our [contributors](https://github.com/flyblackbird/apollo-accounts/graphs/contributors)
- [Blackbird Air](https://www.flyblackbird.com/) for sponsoring
- [accounts-js](https://accounts-js.netlify.com/) and [their sponsors](https://github.com/accounts-js/accounts#thank-you)