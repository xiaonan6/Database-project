import React from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup
} from 'react-simple-maps';
import InfoCard from './InfoCard';
import { Grid } from '@material-ui/core';


const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/counties-10m.json";

export default class CountiesMap extends React.Component {




    render() {
        return(
            <>
            <Grid container direction='row' spacing={3}>
                <Grid item xs={9}>
                    <ComposableMap projection='geoAlbersUsa'>
                        <ZoomableGroup>
                            <Geographies geography={geoUrl}>
                                {({ geographies }) => (
                                    <>
                                        {geographies.map(geo => (
                                            <Geography
                                                key={geo.rsmKey}
                                                geography={geo}
                                                onMouseDownCapture={() => {
                                                    // this.handleCountyPick(geo.properties.name)
                                                    console.log(geo.properties.name)
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
                    <InfoCard title={'Counties'}/>
                </Grid>
            </Grid>
            </>
        )
    }
}