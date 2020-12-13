import React, { memo } from 'react';
import { geoCentroid } from 'd3-geo';
import InfoCard from './InfoCard';
import DataContent from './DataContent.js'
import { scaleQuantile } from 'd3-scale';


import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup
} from 'react-simple-maps';
// import labels from './StatesMapLabels';
// import InfoCard from './InfoCard';
import { Card, CardContent, FormControl, FormControlLabel, FormLabel, Grid, RadioGroup, Radio } from '@material-ui/core';


const geoUrl = "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";


class WorldMap extends React.Component {
  constructor(props) {
    super(props)
    this.handleHeatMapSwitch = this.handleHeatMapSwitch.bind(this)

    this.state = {
      country: 'world',
      data: [],
      top10: [],
      policyDisplay: [],
      allCountryCases: [],
      allCountryDeaths: [],

      heatMapSelection: 'none',
    }
  }

  async handleHeatMapSwitch(event, newValue) {
    await this.setState({ heatMapSelection: newValue })
  }

  async handleCountryPick(name) {
    await this.setState({
      country: name,
    })
    fetch(`http://localhost:8081/worldCases/${name}`)
      .then(r => r.json())
      .then(res => {
        if (!res) return
        let dataDiv = res.map((infoObj, i) =>
          <>
            <DataContent category='Total Cases' value={infoObj.total_Confirmed} />
            <DataContent category='Total Deaths' value={infoObj.total_Deaths} />
            <DataContent category="total_Recovered" value={infoObj.total_Recovered} />
          </>
        )
        this.setState({
          data: dataDiv
        })
      })
  }

  async handleReset() {
    await this.setState({ state: 'world', data: [], allPolicy: [], policyDisplay: [] })
  }

  async componentDidMount() {
    await fetch(`http://localhost:8081/riskyCountry`, {
      method: 'GET'
    })
      .then(r => r.json())
      .then(r => {
        let dataDiv = r.map((infoObj, i) =>
          <>
            <DataContent category={i + 1} value={infoObj.Country} />
          </>
        )
        this.setState({
          top10: dataDiv
        })
      })
    await fetch(`http://localhost:8081/allCaseWorld`, {
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
        this.setState({ allCountryCases: infoList })
      })
      .catch(err => console.log(err))
    await fetch(`http://localhost:8081/allDeathWorld`, {
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
        this.setState({ allCountryDeaths: infoList })
      })
      .catch(err => console.log(err))
  }

  render() {
    return (
      <>
        <Grid container direction='row' spacing={3}>
          <Grid item xs={9}>
            <ComposableMap data-tip="" projectionConfig={{ scale: 200 }}>
              <ZoomableGroup>
                <Geographies geography={geoUrl}>
                  {({ geographies }) =>
                    geographies.map(geo => {
                      const x = this.state.allCountryCases.find(obj => obj.Country === geo.properties.NAME)
                      const y = this.state.allCountryDeaths.find(obj => obj.Country === geo.properties.NAME)

                      return <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        onMouseEnter={() => {
                          const { NAME } = geo.properties;
                          this.props.setTooltipContent(NAME)
                        }}
                        onMouseLeave={() => {
                          this.props.setTooltipContent('')
                        }}
                        onMouseDownCapture={() => this.handleCountryPick(geo.properties.NAME)}
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
                    })
                  }
                </Geographies>
              </ZoomableGroup>
            </ComposableMap>
          </Grid>
          <Grid item xs={3}>
            <InfoCard title={this.state.country} resetHandler={e => this.handleReset()} data={this.state.data} data2={this.state.policyDisplay} />
            <InfoCard title={'Top 10 Risky Country By Cases'} data={this.state.top10} display='none' />
            <Card variant='outlined'>
              <CardContent>
                <FormControl component='fieldset'>
                  <FormLabel component='legend'>Heat Map</FormLabel>
                  <RadioGroup aria-label='heat map' name='heat map' value={this.state.heatMapSelection} onChange={this.handleHeatMapSwitch}>
                    <FormControlLabel value='none' control={<Radio />} label="None" />
                    <FormControlLabel value='cases' control={<Radio />} label="By Cases" />
                    <FormControlLabel value='death' control={<Radio />} label="By Death" />
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

export default memo(WorldMap);
