import React, { memo } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup
} from 'react-simple-maps';
import InfoCard from './InfoCard';
import { Grid } from '@material-ui/core';
import DataContent from './DataContent.js'
//import DataContent from './DataContent';


const geoUrl = 'https://cdn.jsdelivr.net/npm/us-atlas@3/counties-10m.json';

class CountiesTab extends React.Component {
    constructor(props) {
        super(props)
        this.handleReset = this.handleReset.bind(this)
        this.state = {
            county: 'United States',
            commaForTitle: '',
            state: '',
            USCases: [],
            riskyList: [],
            data: []
        }
    }

    async componentDidMount() {
        await fetch(`http://localhost:8081/riskyCounties`, {
            method: 'GET'
        })
        .then(res => res.json())
        .then(infoList => {
            if (!infoList) return
            let dataDiv = infoList.map((infoObj, i) => 
            <>
                <DataContent category={i+1} value={`${infoObj.County}, ${infoObj.State}`}/>
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
    }

    async handleReset() {
        await this.setState({county: 'United States', commaForTitle: '', state: '', data: this.state.USCases})
    }

    async handleCountyPick(newCounty, newState) {
        await this.setState({county: newCounty, commaForTitle: ',', state: newState})
        await fetch(`http://localhost:8081/countyCases/${newState}/${newCounty}`, {
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
    }


    //get the state the county is in using the geo id.
    findState(id) {
        let state;
        if (1001 <= id && id <= 1133) {
            state = 'Alabama'
        } else if (2013 <= id && id <= 2290) {
            state = 'Alaska'
        } else if (4001 <= id && id <= 4027) {
            state = 'Arizona'
        } else if (5001 <= id && id <= 5149) {
            state = 'Arkansas' 
        } else if (6001 <= id && id <= 6115) {
            state = 'California'
        } else if (8001 <= id && id <= 8125) {
            state = 'Colorado'
        } else if (9001 <= id && id <= 9015) {
            state = 'Connecticut'
        } else if (10001 <= id && id <= 10005) {
            state = 'Delaware'
        } else if (12001 <= id && id <= 12133) {
            state = 'Florida'
        } else if (13001 <= id && id <= 13321) {
            state = 'Georgia'
        } else if (15001 <= id && id <= 15009) {
            state = 'Hawaii'
        } else if (16001 <= id && id <= 16087) {
            state = 'Idaho'
        } else if (17001 <= id && id <= 17203) {
            state = 'Illinois'
        } else if (18001 <= id && id <= 18183) {
            state = 'Indiana'
        } else if (19001 <= id && id <= 19197) {
            state = 'Iowa'
        } else if (20001 <= id && id <= 20209) {
            state = 'Kansas'
        } else if (21001 <= id && id <= 21239) {
            state = 'Kentucky'
        } else if (22001 <= id && id <= 22127) {
            state = 'Louisiana'
        } else if (23001 <= id && id <= 23031) {
            state = 'Maine'
        } else if (24001 <= id && id <= 24510) {
            state = 'Maryland'
        } else if (25001 <= id && id <= 25027) {
            state = 'Massachusetts'
        } else if (26001 <= id && id <= 26165) {
            state = 'Michigan'
        } else if (27001 <= id && id <= 27173) {
            state = 'Minnesota'
        } else if (28001 <= id && id <= 28163) {
            state = 'Mississippi'
        } else if (29001 <= id && id <= 29510) {
            state = 'Missouri'
        } else if (30001 <= id && id <= 30111) {
            state = 'Montana'
        } else if (31001 <= id && id <= 31185) {
            state = 'Nebraska'
        } else if (32001 <= id && id <= 32510) {
            state = 'Nevada'
        } else if (33001 <= id && id <= 33019) {
            state = 'New Hampshire'
        } else if (34001 <= id && id <= 34041) {
            state = 'New Jersey'
        } else if (35001 <= id && id <= 35061) {
            state = 'New Mexico'
        } else if (36001 <= id && id <= 36123) {
            state = 'New York'
        } else if (37001 <= id && id <= 37199) {
            state = 'North Carolina'
        } else if (38001 <= id && id <= 38105) {
            state = 'North Dakota'
        } else if (39001 <= id && id <= 39175) {
            state = 'Ohio'
        } else if (40001 <= id && id <= 40153) {
            state = 'Oklahoma'
        } else if (41001 <= id && id <= 41071) {
            state = 'Oregon'
        } else if (42001 <= id && id <= 42133) {
            state = 'Pennsylvania'
        } else if (44001 <= id && id <= 44009) {
            state = 'Rhode Island'
        } else if (45001 <= id && id <= 45091) {
            state = 'South Carolina'
        } else if (46003 <= id && id <= 46137) {
            state = 'South Dakota'
        } else if (47001 <= id && id <= 47189) {
            state = 'Tennessee'
        } else if (48001 <= id && id <= 48507) {
            state = 'Texas'
        } else if (49001 <= id && id <= 49057) {
            state = 'Utah'
        } else if (50001 <= id && id <= 50027) {
            state = 'Vermont'
        } else if (51001 <= id && id <= 51840) {
            state = 'Virginia'
        } else if (53001 <= id && id <= 53077) {
            state = 'Washington'
        } else if (54001 <= id && id <= 54109) {
            state = 'West Virginia'
        } else if (55001 <= id && id <= 55141) {
            state = 'Wisonsin'
        } else if (56001 <= id && id <= 56045) {
            state = 'Wyoming'
        } else {
            state = 'United States'
        }
        return state;
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
                                                    this.handleCountyPick(geo.properties.name, this.findState(geo.id))
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
                    <InfoCard title={`${this.state.county}${this.state.commaForTitle} ${this.state.state}`} resetHandler={this.handleReset} data={this.state.data}/>
                    <InfoCard title={'Top 10 Risky Counties By Cases'} data={this.state.riskyList} display='none'/>
                </Grid>
            </Grid>
            </>
        )
    }
}



export default memo(CountiesTab)