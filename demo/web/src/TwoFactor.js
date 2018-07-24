import {
  Button,
  FormControl,
  Input,
  InputLabel,
  Typography
} from '@material-ui/core'
import QRCode from 'qrcode.react'
import React, { Component } from 'react'

import Accounts from './utils/accounts'

class TwoFactor extends Component {
  state = {
    oneTimeCode: '',
    secret: null
  }

  async componentDidMount() {
    this.onGetTwoFactorSecret()
  }

  onGetTwoFactorSecret = async () => {
    const secret = await Accounts.getTwoFactorSecret()
    if (secret) {
      const { __typename, ...secretFields } = secret
      this.setState({ secret: secretFields })
    }
  }

  onChangeOneTimeCode = ({ target }) => {
    this.setState({ oneTimeCode: target.value })
  }

  onSetTwoFactor = async () => {
    try {
      await Accounts.twoFactorSet(
        this.state.secret,
        this.state.oneTimeCode
      )
      this.props.history.push('/')
    } catch (err) {
      console.log(err)
      alert(err.message)
    }
  }

  render() {
    const { secret, oneTimeCode } = this.state
    if (!secret) {
      return null
    }
    return (
      <div>
        <Typography gutterBottom={true}>Two-factor authentication</Typography>
        <Typography gutterBottom={true}>Backup code:</Typography>
        <Typography gutterBottom={true}>{secret.base32}</Typography>
        <Typography gutterBottom={true}>
          Use Authy for example
        </Typography>
        <QRCode value={secret.otpauth_url} />
        <Typography gutterBottom={true}>Confirm with one-time code:</Typography>
        <FormControl margin="normal">
          <InputLabel htmlFor="one-time-code">One time code</InputLabel>
          <Input
            id="one-time-code"
            value={oneTimeCode}
            onChange={this.onChangeOneTimeCode}
          />
        </FormControl>
        <Button onClick={this.onSetTwoFactor}>Submit</Button>
      </div>
    )
  }
}

export default TwoFactor
