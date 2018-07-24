import { Button, Typography } from '@material-ui/core'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import FormError from './components/FormError'
import Accounts from './utils/accounts'

const HomeLink = props => <Link to="/" {...props} />

class VerifyEmail extends Component {
  state = {
    error: null,
    success: false
  }

  async componentDidMount() {
    try {
      await Accounts.verifyEmail(this.props.match.params.token)
      this.setState({ success: true })
    } catch (err) {
      this.setState({ error: err.message })
    }
  }

  render() {
    const { error, success } = this.state
    return (
      <div>
        {error && <FormError error={error} />}
        {success && <Typography>Your email has been verified</Typography>}
        <Button component={HomeLink}>Go Home</Button>
      </div>
    )
  }
}

export default VerifyEmail
