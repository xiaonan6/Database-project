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
import { Grid } from '@material-ui/core';
import DataContent from './DataContent.js'


const geoUrl = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';


class StatesMap extends React.Component {
    constructor(props) {
        super(props)
        this.handleReset = this.handleReset.bind(this)
        this.handleStatePick = this.handleStatePick.bind(this)
        this.state = {
            state: 'United States',
            data: []
        }
    }
    
    componentDidMount() {

    }

    async handleReset() {
        await this.setState({state: 'United States'})
        console.log(this.state.state)
    }

    async handleStatePick(newState) {
        await this.setState({state: newState})
        console.log(this.state.state)
        // query the data with the newState
        await fetch(`http://192.168.1.235:8081/stateCases/${newState}`, {
            method: 'GET'
        })
        .then(res => res.json())
        .then(infoList => {
            if (!infoList) return
            let dataDiv = infoList.map((infoObj, i) =>
                <>
                    <DataContent category='Confirmed Cases' value={infoObj.total_Confirmed}/>
                    <DataContent category='Deaths' value={infoObj.total_Deaths}/>
                </>
            )
            this.setState({data: dataDiv})
            console.log(this.state.data)
        })
        .catch(err => console.log(err))
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
                            {geographies.map(geo => (
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
                                        fill: '#DDD'
                                    },
                                    hover: {
                                        fill: '#f24954'
                                    },
                                    pressed: {
                                        fill: '#f24954'
                                    }
                                }}
                            />
                            ))}
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
                <InfoCard title={this.state.state} resetHandler={this.handleReset} data={this.state.data}/>
            </Grid>
        </Grid>
        </>
        
        );
    }
}

export default memo(StatesMap);