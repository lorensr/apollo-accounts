import { Typography, withStyles } from '@material-ui/core'
import React from 'react'

const styles = () => ({
  formError: {
    color: 'red'
  }
})

const FormError = ({ classes, error }) => {
  return <Typography className={classes.formError}>{error}</Typography>
}

export default withStyles(styles)(FormError)
