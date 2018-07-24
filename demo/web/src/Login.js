import {
  Button,
  FormControl,
  Input,
  InputLabel,
  Typography,
  withStyles
} from '@material-ui/core'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import FormError from './components/FormError'
import Accounts from './utils/accounts'

const styles = () => ({
  formContainer: {
    display: 'flex',
    flexDirection: 'column'
  }
})

const SignUpLink = props => <Link to="/signup" {...props} />
const ResetPasswordLink = props => <Link to="/reset-password" {...props} />

class Login extends Component {
  state = {
    code: '',
    email: '',
    error: null,
    password: ''
  }

  onChangeEmail = ({ target }) => {
    this.setState({ email: target.value })
  }

  onChangePassword = ({ target }) => {
    this.setState({ password: target.value })
  }

  onChangeCode = ({ target }) => {
    this.setState({ code: target.value })
  }

  onSubmit = async e => {
    e.preventDefault()
    this.setState({ error: null })
    try {
      await Accounts.login({
        code: this.state.code,
        password: this.state.password,
        user: {
          email: this.state.email
        }
      })
      this.props.history.push('/')
    } catch (err) {
      this.setState({ error: err.message })
    }
  }

  render() {
    const { classes } = this.props
    const { email, password, code, error } = this.state
    return (
      <form onSubmit={this.onSubmit} className={classes.formContainer}>
        <Typography variant="display1" gutterBottom={true}>
          Login
        </Typography>
        <FormControl margin="normal">
          <InputLabel htmlFor="email">Email</InputLabel>
          <Input
            id="email"
            value={email}
            autoComplete="email"
            onChange={this.onChangeEmail}
          />
        </FormControl>
        <FormControl margin="normal">
          <InputLabel htmlFor="password">Password</InputLabel>
          <Input
            id="password"
            type="password"
            value={password}
            autoComplete="current-password"
            onChange={this.onChangePassword}
          />
        </FormControl>
        <FormControl margin="normal">
          <InputLabel htmlFor="password">2fa code if enabled</InputLabel>
          <Input id="code" value={code} onChange={this.onChangeCode} />
        </FormControl>
        <Button variant="raised" color="primary" type="submit">
          Login
        </Button>
        {error && <FormError error={error} />}
        <Button component={SignUpLink}>Sign Up</Button>
        <Button component={ResetPasswordLink}>Reset Password</Button>
      </form>
    )
  }
}

export default withStyles(styles)(Login)
