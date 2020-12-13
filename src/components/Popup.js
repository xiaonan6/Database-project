import React from 'react'
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent
} from '@material-ui/core'

export default class Popup extends React.Component {
    constructor(props) {
        super(props)
        this.handleClickOpen = this.handleClickOpen.bind(this)
        this.handleClickClose = this.handleClickClose.bind(this)
        this.state = {
            viewPopup : false,
            data: this.props.data,
        }
    }

    handleClickOpen() {
        this.setState({viewPopup: true})
    }

    handleClickClose() {
        this.setState({viewPopup: false})
    }

    render() {
        return (
            <>
                <Button size='small' variant="outlined" color="primary" onClick={this.handleClickOpen}>
                    {this.props.buttonName}
                </Button>
                <Dialog onClose={this.handleClickClose} open={this.state.viewPopup}>
                    <DialogTitle id="title" onClose={this.handleClickClose}>{this.props.title}</DialogTitle>
                    <DialogContent dividers>
                        {this.state.data}
                    </DialogContent>
                </Dialog>
            </>
        )
    }
}