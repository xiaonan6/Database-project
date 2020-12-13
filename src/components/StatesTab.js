import React, { memo } from 'react';
import { geoCentroid } from 'd3-geo';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from 'react-simple-maps';
import labels from './StatesMapLabels';
import InfoCard from './InfoCard';
import { 
    Card, 
    CardContent, 
    FormControl, 
    FormControlLabel, 
    FormLabel, 
    Grid, 
    RadioGroup, 
    Radio,
    Typography, 
    Divider,
} from '@material-ui/core';
import DataContent from './DataContent.js'
import { scaleQuantile } from 'd3-scale';
import Popup from './Popup.js'


const geoUrl = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';

class StatesTab extends React.Component {
    constructor(props) {
        super(props)
        this.handleReset = this.handleReset.bind(this)
        this.handleStatePick = this.handleStatePick.bind(this)
        this.handleHeatMapSwitch = this.handleHeatMapSwitch.bind(this)
        this.handleClickOpen = this.handleClickOpen.bind(this)
        this.handleClickClose = this.handleClickClose.bind(this)
        this.state = {
            state: 'United States',
            USCases: [],
            allStateCases: [],
            allStateDeaths: [],
            riskyList: [],
            data: [],
            policyDisplay: [],
            heatMapSelection : 'none',
            viewPolicy: false,
        }
    }

    handleClickOpen() {
        this.setState({viewPolicy : true})
    }

    handleClickClose() {
        this.setState({viewPolicy : false})
    }

    casesColorScale;
    deathsColorScale;
    
    async componentDidMount() {
        await fetch(`http://localhost:8081/riskyStates`, {
            method: 'GET'
        })
        .then(res => res.json())
        .then(infoList => {
            if (!infoList) return
            let dataDiv = infoList.map((infoObj, i) => 
            <>
                <DataContent category={i+1} value={infoObj.State}/>
            </>
            )
            this.setState({riskyList: dataDiv})
        })
        .catch(err => console.log(err))

        await fetch(`http://localhost:8081/USCases`, {
            method: 'GET'
        })
        .then(res => res.json())
        .then(infoList => {
            if (!infoList) return
            let dataDiv = infoList.map((infoObj, i) => 
            <>
                <DataContent category='Total Cases' value={infoObj.total_Confirmed}/>
                <DataContent category='Total Deaths' value={infoObj.total_Deaths}/>
            </>
            )
            this.setState({USCases: dataDiv, data: dataDiv})
        })
        .catch(err => console.log(err))

        await fetch(`http://localhost:8081/allCaseState`, {
            method: 'GET'
        })
        .then(res => res.json())
        .then(infoList => {
            if (!infoList) return
            this.casesColorScale = scaleQuantile()
                .domain(infoList.map((infoObj) => infoObj.total_Confirmed))
                .range([
                    "#fce8e8",
                    "#f0cece",
                    "#ebb5b5",
                    "#e09494",
                    "#db7b7b",
                    "#d66363",
                    "#c94f4f",
                    "#ba3a3a",
                    "#a12b2b",
                    "#7a1c1c",
                ])
            this.setState({allStateCases: infoList})
        })
        .catch(err => console.log(err))

        await fetch(`http://localhost:8081/allDeathState`, {
            method: 'GET'
        })
        .then(res => res.json())
        .then(infoList => {
            if (!infoList) return
            this.deathsColorScale = scaleQuantile()
                .domain(infoList.map((infoObj) => infoObj.total_Deaths))
                .range([
                    "#d1d1d1",
                    "#bababa",
                    "#a3a3a3",
                    "#919191",
                    "#7d7d7d",
                    "#6e6e6e",
                    "#616161",
                    "#4f4f4f",
                ])
            this.setState({allStateDeaths: infoList})
        })
        .catch(err => console.log(err))
        
    }

    async handleReset() {
        await this.setState({state: 'United States', data: this.state.USCases, allPolicy: [], policyDisplay: []})
    }

    async handleStatePick(newState) {
        await this.setState({state: newState, policyDisplay: ["None"]})
        
        // query the data with the newState
        await fetch(`http://localhost:8081/stateCases/${newState}`, {
            method: 'GET'
        })
        .then(res => res.json())
        .then(infoList => {
            if (!infoList) return
            let dataDiv = infoList.map((infoObj, i) =>
                <>
                    <DataContent category='Total Cases' value={infoObj.total_Confirmed}/>
                    <DataContent category='Total Deaths' value={infoObj.total_Deaths}/>
                    <DataContent category="Today's New Cases" value={infoObj.today_Confirmed}/>
                    <DataContent category="Today's New Deaths" value={infoObj.today_Deaths}/>
                </>
            )
            this.setState({data: dataDiv})
        })
        .catch(err => console.log(err))

        await fetch(`http://localhost:8081/statePolicy/${newState}`, {
            method: 'GET'
        })
        .then(res => res.json())
        .then(infoList => {
            if (!infoList) return
            let policyDiv = infoList.map((infoObj, i) =>
                <>
                    <Typography variant='body1'>
                        <b>Policy Name : </b><a href={infoObj.POLICY_URL} rel="noreferrer" target="_blank">{infoObj.POLICY_NAME}</a> <br/>
                        <b>Policy Note : </b>{infoObj.POLICY_NOTE_TEXT} <br/>
                    </Typography>
                    <Divider/>
                </>
            )
            if (infoList.length !== 0) {
                if (infoList.length > 1) {
                    //view more
                    let dataDiv = 
                    <>
                        <DataContent category='Policy' value={infoList[0].POLICY_NAME} link={infoList[0].POLICY_URL}/>
                        <Popup buttonName='View All Policies' title={`${this.state.state} Covid-19 Policies`} data={policyDiv}/>
                    </>;
                    this.setState({policyDisplay: dataDiv})
                } else {
                    let dataDiv = 
                    <>
                        <DataContent category='Policy' value={infoList[0].POLICY_NAME} link={infoList[0].POLICY_URL}/>
                    </>;
                    this.setState({policyDisplay: dataDiv})
                }

            }
        })
        .catch(err => console.log(err))
    }

    async handleHeatMapSwitch(event, newValue) {
        await this.setState({heatMapSelection: newValue})
    }

    render() {
        return (
        <>
        <Grid container direction='row' spacing={3}>
            <Grid item xs={9}>
                <ComposableMap data-tip='' projection='geoAlbersUsa'>
                    <Geographies geography={geoUrl}>
                        {({ geographies }) => (
                        <>
                            {geographies.map(geo => {
                                const x = this.state.allStateCases.find(obj => obj.State === geo.properties.name)
                                const y = this.state.allStateDeaths.find(obj => obj.State === geo.properties.name)
                                return(
                                 <Geography
                                    key={geo.rsmKey}
                                    geography={geo}
                                    onMouseEnter={() => {
                                        this.props.setTooltipContent(`${geo.properties.name}`)
                                    }}
                                    onMouseLeave={() => {
                                        this.props.setTooltipContent('');
                                    }}
                                    onMouseDownCapture={() => {
                                        this.handleStatePick(geo.properties.name)
                                    }}
                                    style={{
                                        default: {
                                            stroke: '#FFF',
                                            fill: this.state.heatMapSelection === 'cases' ? 
                                                    x ? this.casesColorScale(x.total_Confirmed) : "#DDD"
                                                    : this.state.heatMapSelection === 'death' ? 
                                                    y ? this.deathsColorScale(y.total_Deaths) : "#DDD"
                                                    : '#DDD'
                                        },
                                        hover: {
                                            fill: '#f24954'
                                        },
                                        pressed: {
                                            fill: '#f24954'
                                        }
                                    }}
                                />
                            )})}
                            {geographies.map(geo => {
                            const centroid = geoCentroid(geo);
                            const cur = labels.find(s => s.val === geo.id);
                            return (
                                <g key={geo.rsmKey + '-name'}>
                                {cur &&
                                    centroid[0] > -160 &&
                                    centroid[0] < -67 &&
                                    <Marker coordinates={centroid}>
                                        <text y='2' fontSize={10} textAnchor='middle'>
                                        {cur.id}
                                        </text>
                                    </Marker>
                                    }
                                </g>
                            );
                            })}
                        </>
                        )}
                    </Geographies>
                </ComposableMap>
            </Grid>
            <Grid item xs={3}>
                <InfoCard title={this.state.state} resetHandler={this.handleReset} data={this.state.data} data2={this.state.policyDisplay}/>
                <InfoCard title={'Top 10 Risky States By Cases'} data={this.state.riskyList} display='none'/>
                <Card variant='outlined'>
                    <CardContent>
                        <FormControl component='fieldset'>
                            <FormLabel component='legend'>Heat Map</FormLabel>
                            <RadioGroup aria-label='heat map' name='heat map' value={this.state.heatMapSelection} onChange={this.handleHeatMapSwitch}>
                                <FormControlLabel value='none' control={<Radio />} label="None"/>
                                <FormControlLabel value='cases' control={<Radio />} label="By Cases"/>
                                <FormControlLabel value='death' control={<Radio />} label="By Death"/>
                            </RadioGroup>
                        </FormControl>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
        </>
        
        );
    }
}

export default memo(StatesTab);