import {
  Button,
  FormControl,
  Input,
  InputLabel,
  Snackbar,
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

const LogInLink = props => <Link to="/login" {...props} />

class Login extends Component {
  state = {
    email: '',
    error: null,
    newPassword: '',
    snackbarMessage: null
  }

  onChangeEmail = ({ target }) => {
    this.setState({ email: target.value })
  }

  onChangeNewPassword = ({ target }) => {
    this.setState({ newPassword: target.value })
  }

  onSubmit = async e => {
    e.preventDefault()
    this.setState({ error: null, snackbarMessage: null })
    const token = this.props.match.params.token
    try {
      // If no tokens send email to user
      if (!token) {
        await Accounts.requestPasswordReset(this.state.email)
        this.setState({ snackbarMessage: 'Email sent' })
      } else {
        // If token try to change user password
        await Accounts.resetPassword(token, this.state.newPassword)
        this.setState({
          snackbarMessage: 'Your password has been reset successfully'
        })
        this.props.history.push('/')
      }
    } catch (err) {
      // tslint:disable-next-line:no-console
      console.log(err)
      this.setState({ error: err.message, snackbarMessage: null })
    }
  }

  onSanckbarClose = () => {
    this.setState({ snackbarMessage: null })
  }

  render() {
    const { classes, match } = this.props
    const { email, newPassword, error, snackbarMessage } = this.state
    return (
      <form onSubmit={this.onSubmit} className={classes.formContainer}>
        <Typography variant="display1" gutterBottom={true}>
          Reset Password
        </Typography>
        {!match.params.token && (
          <FormControl margin="normal">
            <InputLabel htmlFor="email">Email</InputLabel>
            <Input id="email" value={email} onChange={this.onChangeEmail} />
          </FormControl>
        )}
        {match.params.token && (
          <FormControl margin="normal">
            <InputLabel htmlFor="new-password">New Password</InputLabel>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={this.onChangeNewPassword}
            />
          </FormControl>
        )}
        <Button variant="raised" color="primary" type="submit">
          Reset Password
        </Button>
        {error && <FormError error={error} />}
        <Button component={LogInLink}>Log In</Button>
        <Snackbar
          anchorOrigin={{
            horizontal: 'right',
            vertical: 'top'
          }}
          open={!!snackbarMessage}
          autoHideDuration={4000}
          onClose={this.onSanckbarClose}
          message={<span>{snackbarMessage}</span>}
        />
      </form>
    )
  }
}

export default withStyles(styles)(Login)
