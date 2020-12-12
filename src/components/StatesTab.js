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
import { Card, CardContent, FormControl, FormControlLabel, FormLabel, Grid, RadioGroup, Radio } from '@material-ui/core';
import DataContent from './DataContent.js'
import { scaleQuantile } from 'd3-scale';


const geoUrl = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';

class StatesTab extends React.Component {
    constructor(props) {
        super(props)
        this.handleReset = this.handleReset.bind(this)
        this.handleStatePick = this.handleStatePick.bind(this)
        this.handleHeatMapSwitch = this.handleHeatMapSwitch.bind(this)
        this.state = {
            state: 'United States',
            allStateCases: [],
            riskyList: [],
            data: [],
            allPolicy: [],
            policyDisplay: [],
            heatMapSelection : 'none',
        }
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

        await fetch(`http://localhost:8081/allCaseState`, {
            method: 'GET'
        })
        .then(res => res.json())
        .then(infoList => {
            if (!infoList) return
            this.casesColorScale = scaleQuantile()
                .domain(infoList.map((infoObj) => infoObj.total_Confirmed))
                .range([
                "#ffedea",
                "#ffcec5",
                "#ffad9f",
                "#ff8a75",
                "#ff5533",
                "#e2492d",
                "#be3d26",
                "#9a311f",
                "#782618"
                ])
            this.setState({allStateCases: infoList})
        })
        .catch(err => console.log(err))
    }

    async handleReset() {
        await this.setState({state: 'United States', data: [], allPolicy: [], policyDisplay: []})
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
                    <DataContent category='Confirmed Cases' value={infoObj.total_Confirmed}/>
                    <DataContent category='Deaths' value={infoObj.total_Deaths}/>
                    <DataContent category="Today's Confirmed" value={infoObj.today_Confirmed}/>
                    <DataContent category="Today's Deaths" value={infoObj.today_Deaths}/>
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
            if (infoList.length !== 0) {
                if (infoList.length > 1) {
                    //view more
                    let dataDiv = 
                    <>
                        <DataContent category='Policy' value={infoList[0].POLICY_NAME} link={infoList[0].POLICY_URL}/>
                    </>;
                    this.setState({policyDisplay: dataDiv})
                } else {
                    let dataDiv = 
                    <>
                        <DataContent category='Policy' value={infoList[0].POLICY_NAME} link={infoList[0].POLICY_URL}/>
                    </>;
                    this.setState({policyDisplay: dataDiv})
                }
                // map allPolicy
            }
        })
        .catch(err => console.log(err))
    }

    async handleHeatMapSwitch(event, newValue) {
        await this.setState({heatMapSelection: newValue})
        console.log(this.state.heatMapSelection)
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
                                const x = this.state.allStateCases.find(s => s.State === geo.properties.name)
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
                                            fill: x ? this.casesColorScale(x.total_Confirmed) : "#DDD"
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
                <InfoCard title={'Top 10 Risky States'} resetHandler={this.handleReset} data={this.state.riskyList} display='none'/>
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