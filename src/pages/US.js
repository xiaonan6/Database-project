import React from 'react'
import MenuBar from '../components/MenuBar.js'
import PropTypes from 'prop-types';
import { AppBar, Box, Typography, Tabs, Tab } from '@material-ui/core'
import StatesTab from '../components/StatesTab.js'
import CountiesTab from '../components/CountiesTab.js'
import ReactToolTip from 'react-tooltip'



export default class US extends React.Component {
    constructor(props) {
        super(props);
        this.handleTabSwitch = this.handleTabSwitch.bind(this);
        this.handleTooltipUpdate = this.handleTooltipUpdate.bind(this);
        this.state = {
          toolTip: "",
          currentTab: 0
        }
    }

    async handleTabSwitch(event, newValue) {
      await this.setState({currentTab: newValue})
    }

    handleTooltipUpdate(newValue) {
      this.setState({toolTip: newValue})
    }

    render() {
        return(
            <>
                <MenuBar/>
                <AppBar position='static' color='default'>
                  <Tabs value={this.state.currentTab} onChange={this.handleTabSwitch} aria-label="simple tabs example">
                    <Tab label="State" />
                    <Tab label="County" />
                  </Tabs>
                </AppBar>
                <TabPanel value={this.state.currentTab} index={0}>
                  <StatesTab setTooltipContent={this.handleTooltipUpdate}/>
                  <ReactToolTip>{this.state.toolTip}</ReactToolTip>
                </TabPanel>
                <TabPanel value={this.state.currentTab} index={1}>
                  <CountiesTab setTooltipContent={this.handleTooltipUpdate}/>
                  <ReactToolTip>{this.state.toolTip}</ReactToolTip>
                </TabPanel>
            </>
        )
    }
}


function TabPanel(props) {
  const { children, value, index, ...other } = props;  
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}
  
TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};
  