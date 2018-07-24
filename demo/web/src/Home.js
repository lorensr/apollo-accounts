import { Button, Typography } from '@material-ui/core'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import Accounts from './utils/accounts'

class Home extends Component {
  state = {
    user: null
  }

  async componentDidMount() {
    // refresh the session to get a new accessToken if expired
    const tokens = await Accounts.refreshSession()
    if (!tokens) {
      this.props.history.push('/login')
      return
    }
    const user = await Accounts.getUser(tokens ? tokens.accessToken : '')
    await this.setState({ user })
  }

  onResendEmail = async () => {
    const { user } = this.state
    await Accounts.sendVerificationEmail(user.emails[0].address)
  }

  onLogout = async () => {
    await Accounts.logout()
    this.props.history.push('/login')
  }

  render() {
    const { user } = this.state
    if (!user) {
      return null
    }

    return (
      <div>
        <Typography gutterBottom={true}>You are logged in</Typography>
        <Typography gutterBottom={true}>
          Email: {user.emails[0].address}
        </Typography>
        <Typography gutterBottom={true}>
          You email is {user.emails[0].verified ? 'verified' : 'unverified'}
        </Typography>
        {!user.emails[0].verified && (
          <Button onClick={this.onResendEmail}>
            Resend verification email
          </Button>
        )}

        <Link to="two-factor">Set up 2fa</Link>

        <Button variant="raised" color="primary" onClick={this.onLogout}>
          Logout
        </Button>
      </div>
    )
  }
}

export default Home
