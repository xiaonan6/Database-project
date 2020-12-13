const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
var routes = require('./routes.js');

const app = express();

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/stateCases/:state', routes.getStateCasesByState); //for state block1: state cases

app.get('/statePolicy/:state', routes.getStatePolicy); //for state block1: state policy

//app.get('/riskyCounties/:state', routes.getRiskyCounties); //this one can be added to state block1/ in the future

app.get('/countyCases/:state/:county', routes.getCountyCasesByCounty); // for county block1

app.get('/countryDailyCases/:country', routes.getDailyWorldCases);//for world block 1

app.get('/worldCases/:country', routes.getWorldCases);//for word block 1 total cases

app.get('/riskyStates', routes.get10riskyStates); //for state block2

app.get('/riskyCounties', routes.get10riskyCounties); //for county block2

app.get('/riskyCountry', routes.get10RiskCountry);//for world block 2

app.get('/USCases', routes.getUScases);





//for heat map
app.get('/allCaseState', routes.getConfirmCaseAllStates);

app.get('/allDeathState', routes.getConfirmDeathAllStates);

app.get('/allCaseWorld', routes.getConfirmCaseCountry);

app.get('/allDeathWorld', routes.getDealthsCaseCountry);

app.listen(8081, () => {
    console.log('Server listening on PORT 8081');
})

