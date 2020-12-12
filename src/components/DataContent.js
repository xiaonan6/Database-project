import { Typography } from '@material-ui/core'
import React from 'react'

export default class DataContent extends React.Component {

    render() {
        return (
            <>
                <Typography variant='body2'>
                  <span> <b>{this.props.category}:</b> <a href={this.props.link} rel="noreferrer" target="_blank">{this.props.value}</a> </span> <br/>
                </Typography>
            </>
        )
    }
}