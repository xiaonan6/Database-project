import React, { memo } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup
} from 'react-simple-maps';
import InfoCard from './InfoCard';
import { Grid } from '@material-ui/core';


const geoUrl = 'https://cdn.jsdelivr.net/npm/us-atlas@3/counties-10m.json';

class CountiesMap extends React.Component {
    constructor(props) {
        super(props)
        this.handleReset = this.handleReset.bind(this)
        this.state = {
            county: 'United States',
            cases: this.props.cases,
            deaths: this.props.deaths,
            // other data
            data: []
        }
    }

    handleReset() {
        this.setState({county: 'United States'})
    }

    handleCountyPick(newCounty) {
        this.setState({county: newCounty})
    }


    render() {
        return(
            <>
            <Grid container direction='row' spacing={3}>
                <Grid item xs={9}>
                    <ComposableMap data-tip='' projection='geoAlbersUsa'>
                        <ZoomableGroup>
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
                                                    this.handleCountyPick(geo.properties.name)
                                                }}
                                                style={{
                                                    default: {
                                                        strokeWidth: '0.1px',
                                                        stroke: '#000',
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
                                    </>
                                )}
                            </Geographies>
                        </ZoomableGroup>
                    </ComposableMap>
                </Grid>
                <Grid item xs>
                    <InfoCard title={this.state.county}/>
                </Grid>
            </Grid>
            </>
        )
    }
}



export default memo(CountiesMap)