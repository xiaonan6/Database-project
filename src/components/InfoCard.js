import React from 'react'
import { 
    Card, 
    CardContent, 
    Typography, 
    Divider, 
    Button 
} from '@material-ui/core'



export default function InfoCard(props){
    var show = props.display

        return(
            <>
                <Card variant='outlined'>
                    <CardContent>
                        <Typography variant='h5' align='center' style={{ paddingBottom: 10}}>
                            {props.title}
                        </Typography>
                        <Divider variant='middle'/>
                        <div style={{marginLeft: '15%', marginRight: '15%', paddingTop: 10}}>
                            {props.data}
                            {props.data2}
                        
                        </div>
                        <div align='center' style={{paddingTop: '5%'}}>
                            <Button variant='contained' color='primary' onClick={props.resetHandler} style={{display: show}}>
                                Reset
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </>
        )
}