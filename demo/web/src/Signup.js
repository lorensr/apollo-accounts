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

const LogInLink = props => <Link to="/login" {...props} />

class Signup extends Component {
  state = {
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

  onSubmit = async e => {
    e.preventDefault()
    this.setState({ error: null })
    try {
      await Accounts.createUser({
        email: this.state.email,
        password: this.state.password
      })
      this.props.history.push('/login')
    } catch (err) {
      this.setState({ error: err.message })
    }
  }

  render() {
    const { classes } = this.props
    const { email, password, error } = this.state
    return (
      <form onSubmit={this.onSubmit} className={classes.formContainer}>
        <Typography variant="display1" gutterBottom={true}>
          Sign up
        </Typography>
        <FormControl margin="normal">
          <InputLabel htmlFor="email">Email</InputLabel>
          <Input id="email" value={email} onChange={this.onChangeEmail} />
        </FormControl>
        <FormControl margin="normal">
          <InputLabel htmlFor="password">Password</InputLabel>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={this.onChangePassword}
          />
        </FormControl>
        <Button variant="raised" color="primary" type="submit">
          Sign Up
        </Button>
        {error && <FormError error={error} />}
        <Button component={LogInLink}>Log In</Button>
      </form>
    )
  }
}

export default withStyles(styles)(Signup)
