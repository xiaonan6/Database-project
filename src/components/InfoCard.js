import React from 'react'
import { Card, CardContent, Typography, Divider, Button } from '@material-ui/core'



export default class InfoCard extends React.Component{

    render() {
        return(
            <>
                <Card variant='outlined'>
                    <CardContent>
                        <Typography variant='h5' align='center'>
                            {this.props.title}
                        </Typography>
                        <Divider variant='middle'/>
                        <div style={{marginLeft: '15%', marginRight: '15%'}}>
                        <Typography >
                            Data 1 goes here, but it is really long so idk what will happen.
                            <br/>
                            Data 2 goes here
                            <br/>
                            Data 3 goes here
                        </Typography>
                        </div>
                        <Button variant='contained' color='primary' onClick={() => {console.log("hello")}}>
                            Reset
                        </Button>
                    </CardContent>
                </Card>
            </>
        )
    }
}