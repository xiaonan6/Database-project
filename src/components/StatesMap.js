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


const geoUrl = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';


class StatesMap extends React.Component {
    constructor(props) {
        super(props)
        this.handleReset = this.handleReset.bind(this)
        this.handleStatePick = this.handleStatePick.bind(this)
        this.state = {
            state: 'United States',
            cases: this.props.cases,
            deaths: this.props.deaths,
            // add other data
            data: []
        }
    }

    handleReset() {
        this.setState({state: 'United States'})
    }

    handleStatePick(newState) {
        this.setState({state: newState})
        // query the data with the newState

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