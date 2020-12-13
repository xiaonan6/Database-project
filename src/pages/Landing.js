import { Typography } from '@material-ui/core'
import React from 'react'
import MenuBar from '../components/MenuBar'


export default class Landing extends React.Component {
    constructor(props) {
        super(props)
        this.handleDisclaimerCheck = this.handleDisclaimerCheck.bind(this)
    }

    async handleDisclaimerCheck(event) {
        await this.setState({checkBox: event.target.checked})
        console.log(this.state.checkBox)
    }

    render() {
        return (
            <div>
                <MenuBar/>
                <div style={{paddingLeft: '20%', paddingRight: '25%'}}>
                    
                    <div>
                        <Typography align='center' variant='h3'>
                            Welcome to
                        </Typography>
                        <Typography align='center' variant='h2'>
                            COVID-19 Tracker
                        </Typography>
                        <Typography align='center' variant='h6'>
                            A health and safety look up tool for your next travel plans.
                        </Typography>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                        <img src='https://media.giphy.com/media/9tA6H1madRvUc/giphy.gif' alt='plane network c/o Harvard University'/>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                        <Typography align='center' variant='caption'>
                            gif provided by Harvard University
                        </Typography>
                    </div>
                    <div>
                        <Typography variant='h5'>
                            Mission:
                        </Typography>
                        <Typography variant='body1'>
                            We want to you to stay safe safe when you are traveling and we do so by:
                            <br/>
                            Showing current covid-19 statistics so that you can assess your risk when traveling.
                            <br/>
                            Showing current health guidelines you must follow in the states you intend to travel to.
                        </Typography>
                    </div>
                    <div style={{marginTop: 10}}>
                        <Typography variant='h5'>
                            <b>Disclaimer:</b> We do not advise you to travel at all during the pandemic.
                            This tool is only to help inform you and help you assess your risk 
                            and that of others when traveling. 
                            <br/>
                            <b>If you contract covid-19, we are not responsible.</b>
                            <br/>
                            Safe travels.
                        </Typography>
                    </div>
                    <div style={{marginTop: 20}}>
                        <Typography align='center' variant='h4'>
                            Where do you plan on traveling to?
                        </Typography>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'center', marginTop: '5%', marginBottom: '10%'}}>
                        <button onClick={()=>window.location.href='/US'}>
                            Within the United States
                        <img src='https://lh3.googleusercontent.com/proxy/3izoghNTOdMqOl5zLTtk1vthaPrqZE2Ey5qQq4Dn70crfT6kGmeLlDyKIvbR-9OeM5l1KwEmRfC0Np5eBNYnmuNmBaDNmz043cZUgQp9Gz-oL90vXhg' 
                        alt='world map' href='/US'/> 
                        </button>
                        
                        <button onClick={()=>window.location.href='/World'}>Different Country
                        <img src='https://smart.servier.com/wp-content/uploads/2016/10/world-map-update.png' alt='world map'/> 
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}