import React from 'react'
import { Card, CardContent, Typography, Divider, Button } from '@material-ui/core'



export default class InfoCard extends React.Component{

    render() {
        return(
            <>
                <Card variant='outlined'>
                    <CardContent>
                        <Typography variant='h5' align='center' style={{ paddingBottom: 10}}>
                            {this.props.title}
                        </Typography>
                        <Divider variant='middle'/>
                        <div style={{marginLeft: '15%', marginRight: '15%', paddingTop: 10}}>
                            {this.props.data}
                        </div>
                        <div align='center' style={{paddingTop: '5%'}}>
                            <Button variant='contained' color='primary' onClick={this.props.resetHandler}>
                                Reset
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </>
        )
    }
}