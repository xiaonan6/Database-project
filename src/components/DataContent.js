import { Typography } from '@material-ui/core'
import React from 'react'

export default class DataContent extends React.Component {

    render() {
        return (
            <>
                <Typography variant='body2'>
                   <b>{this.props.category}:</b> {this.props.value} <br/>
                </Typography>
            </>
        )
    }
}