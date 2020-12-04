const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
var routes = require('./routes.js');

const app = express();

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

app.get('/dailyCases', routes.getDailyIncreaseInfo);

app.get('/stateCases/:state', routes.getStateCasesByState);

app.get('/worldCases', routes.getWorldCases)

app.get('/riskyCounties', routes.getRiskyCounties);

app.get('/countyCases/:county', routes.getCountyCasesByCounty);


app.listen(8080, ()=> {
    console.log('Server listening on PORT 8081');
})

