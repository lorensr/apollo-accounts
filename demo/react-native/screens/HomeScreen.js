import React from 'react'
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native'
import { Form, Item, Input, Button } from 'native-base'

import Accounts from '../utils/accounts'

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null
  }

  constructor(props) {
    super(props)
    this.state = { username: null, password: null, user: null }
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
        >
          <View style={styles.welcomeContainer}>
            <Image
              source={
                __DEV__
                  ? require('../assets/images/robot-dev.png')
                  : require('../assets/images/robot-prod.png')
              }
              style={styles.welcomeImage}
            />
          </View>

          <View style={styles.getStartedContainer}>
            <Text style={styles.getStartedText}>Apollo Accounts Password</Text>

            <Text style={styles.getStartedText}>React Native Demo</Text>
          </View>

          {this.state.user ? (
            <Text
              style={{
                marginTop: 30,
                textAlign: 'center'
              }}
            >
              Logged in as {this.state.user.username}, id {this.state.user.id}
            </Text>
          ) : (
            <View>
              <Form>
                <Item>
                  <Input
                    placeholder="Username"
                    autoCapitalize="none"
                    onChangeText={username => this.setState({ username })}
                    value={this.state.username}
                  />
                </Item>
                <Item last>
                  <Input
                    placeholder="Password"
                    onChangeText={password => this.setState({ password })}
                    value={this.state.password}
                    secureTextEntry
                  />
                </Item>
              </Form>

              <View style={{ marginTop: 40 }}>
                <Button block onPress={this.login} style={{ color: 'white' }}>
                  {/* todo why is text dark? */}
                  <Text>Login!</Text>
                </Button>
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    )
  }

  login = async () => {
    const { password, username } = this.state
    try {
      const result = await Accounts.login({
        password,
        user: { username }
      })
      console.log(result)
      const user = await Accounts.getUser(result.tokens.accessToken)
      this.setState({ user })
      console.log(user)
    } catch (err) {
      Alert.alert('Login failed', err.message)
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center'
  },
  contentContainer: {
    paddingTop: 30
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center'
  }
})
