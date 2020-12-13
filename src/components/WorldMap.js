import React from 'react';
import { geoCentroid } from 'd3-geo';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup
} from 'react-simple-maps';
// import labels from './StatesMapLabels';
// import InfoCard from './InfoCard';
import { Grid } from '@material-ui/core';


const geoUrl = "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";


export default class WorldMap extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    render() {
        return (
            <>
              <ComposableMap data-tip="" projectionConfig={{ scale: 200 }}>
                <ZoomableGroup>
                  <Geographies geography={geoUrl}>
                    {({ geographies }) =>
                      geographies.map(geo => (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          onMouseEnter={() => {
                              const { NAME, POP_EST } = geo.properties;
                            
                          }}
                          onMouseLeave={() => {
                            
                          }}
                          style={{
                            default: {
                              fill: "#D6D6DA",
                              outline: "none"
                            },
                            hover: {
                              fill: "#F53",
                              outline: "none"
                            },
                            pressed: {
                              fill: "#E42",
                              outline: "none"
                            }
                          }}
                        />
                      ))
                    }
                  </Geographies>
                </ZoomableGroup>
              </ComposableMap>
            </>
          );
    }
}
