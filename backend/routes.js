var mysql = require('mysql')

var connection = mysql.createConnection({
    host: 'cis550-project.csaprfnypzpp.us-east-1.rds.amazonaws.com',
    user: 'admin',
    password: 'covid550project',
    port: '3306',
    database: 'new_schema'
})

connection.connect(function(err) {
    if(err) {
        console.error('Database connection failed: ' + err.stack)
        return;
    }
    console.log('Connected to database.')
})

///////////// US
/// Block 1 for State
//total number of cases & daily STATE increase
function getStateCasesByState(req, res) {
    var state = req.params.state
    var query = `
    WITH yesterday AS (select u.FIPS, r.State, r.County, u.Confirmed AS yesterday_Confirmed, u.Deaths AS yesterday_Deaths, u.Recovered AS yesterday_Recovered, 
        DATE_ADD(u.Date, INTERVAL 1 DAY) as Date
        from US_df u join US_region_df r ON u.FIPS = r.FIPS
        where r.State = '${state}')
        ,countyCases as (SELECT y.State, y.County, u.Confirmed AS total_Confirmed, u.Deaths AS total_Deaths, u.Recovered AS total_Recovered,
        (u.Confirmed - y.yesterday_Confirmed) as today_Confirmed, (u.Deaths - y.yesterday_Deaths) as today_Deaths, 
        (u.Recovered - y.yesterday_Recovered) as today_Recovered
        FROM US_df u JOIN yesterday y ON u.FIPS = y.FIPS and u.Date = y.Date
        where u.Date = (select MAX(Date) from US_df))
        SELECT a.State, sum(a.total_Confirmed) as total_Confirmed, sum(a.total_Deaths) as total_Deaths, sum(a.total_Recovered) as total_Recovered,
        sum(a.today_Confirmed) as today_Confirmed, sum(a.today_Deaths) as today_Deaths, sum(a.today_Recovered) as today_Recovered
        from countyCases a
        group by State;
    `
    connection.query(query, function(err, rows, fields) {
        if (err) console.log(err)
        else {
            console.log(rows);
            res.json(rows)
        }
    })
}

/* POLICY for states */
function getStatePolicy(req, res) {
    var state = req.params.state
    var query = `
    SELECT distinct p.PROVINCE_STATE_NAME, p.POLICY_NAME, p.POLICY_ISSUE_DATE, p.POLICY_NOTE_TEXT, p.POLICY_URL
    FROM US_Policy p JOIN US_region_df r ON p.PROVINCE_STATE_NAME = r.State
    where p.PROVINCE_STATE_NAME = '${state}'
    and p.POLICY_ISSUE_DATE = (select MAX(p.POLICY_ISSUE_DATE) from US_Policy p where p.PROVINCE_STATE_NAME = '${state}');
    `
    connection.query(query, function(err, rows, fields) {
        if (err) console.log(err)
        else {
            console.log(rows);
            res.json(rows)
        }
    })
}

//maybe also add that one in state-block1
function getRiskyCounties(req, res) {
    var state = req.params.state
    var query = `
    WITH temp AS (SELECT r.County, u.Confirmed AS total_Confirmed, u.Deaths AS total_Deaths, u.Recovered AS total_Recovered
        FROM US_df u JOIN US_region_df r ON u.FIPS = r.FIPS
        where u.Date = (select MAX(Date) from US_df)
        GROUP BY r.County)
        , riskyCounty AS( SELECT r.State, r.County, u.Confirmed
        FROM US_df u JOIN US_region_df r ON u.FIPS = r.FIPS 
        WHERE u.Date = (select MAX(Date) from US_df) and r.State = '${state}'
        GROUP BY r.State
        HAVING u.Confirmed > (select AVG(u.Confirmed) from US_df u))
        ,Total AS (SELECT u.Date, r.County, SUM(u.Confirmed) AS today_Confirmed, SUM(u.Deaths) AS today_Deaths, SUM(u.Recovered) AS today_Recovered
        FROM US_df u JOIN US_region_df r ON u.FIPS = r.FIPS 
        WHERE u.Date = (select MAX(Date) from US_df)
        GROUP BY r.County)
        SELECT a.Date, a.County, a.today_Confirmed, a.today_Deaths, a.today_Recovered,b.total_Confirmed, b.total_Deaths, b.total_Recovered
        FROM Total a join temp b on a.County = b.County
        WHERE a.County IN (SELECT County FROM riskyCounty);
    `
    connection.query(query, function(err, rows, fields) {
        if (err) console.log(err)
        else {
            res.json(rows)
        }
    })
}

//block2 for State
function get10riskyStates(req, res) {
    var query = `
        WITH yesterday AS (select u.FIPS, r.State, r.County, u.Confirmed AS yesterday_Confirmed, u.Deaths AS yesterday_Deaths, u.Recovered AS yesterday_Recovered, 
        DATE_ADD(u.Date, INTERVAL 1 DAY) as Date
        from US_df u join US_region_df r ON u.FIPS = r.FIPS)
        ,countyCases as (SELECT y.State, y.County, u.Confirmed AS total_Confirmed, u.Deaths AS total_Deaths, u.Recovered AS total_Recovered,
        (u.Confirmed - y.yesterday_Confirmed) as today_Confirmed, (u.Deaths - y.yesterday_Deaths) as today_Deaths, 
        (u.Recovered - y.yesterday_Recovered) as today_Recovered
        FROM US_df u JOIN yesterday y ON u.FIPS = y.FIPS and u.Date = y.Date
        where u.Date = (select MAX(Date) from US_df))
        SELECT a.State, sum(a.total_Confirmed) as total_Confirmed, sum(a.total_Deaths) as total_Deaths, 
        sum(a.today_Confirmed) as today_Confirmed, sum(a.today_Deaths) as today_Deaths
        from countyCases a group by State
        order by sum(a.total_Confirmed) desc, sum(a.today_Confirmed) desc
        limit 10;
    `
    connection.query(query, function(err, rows, fields) {
        if (err) console.log(err)
        else {
            console.log(rows);
            res.json(rows)
        }
    })
}

/// Block 1 for county
//total number of cases & daily COUNTY increase
function getCountyCasesByCounty(req, res) {
    var county = req.params.county
    var query = `
    WITH yesterday AS (select u.FIPS, r.State, r.County, u.Confirmed AS yesterday_Confirmed, u.Deaths AS yesterday_Deaths, u.Recovered AS yesterday_Recovered, 
        DATE_ADD(u.Date, INTERVAL 1 DAY) as Date
        from US_df u join US_region_df r ON u.FIPS = r.FIPS
        where r.County = '${county}')
        SELECT y.State, y.County, u.Confirmed AS total_Confirmed, u.Deaths AS total_Deaths, u.Recovered AS total_Recovered,
        (u.Confirmed - y.yesterday_Confirmed) as today_Confirmed, (u.Deaths - y.yesterday_Deaths) as today_Deaths, 
        (u.Recovered - y.yesterday_Recovered) as today_Recovered
        FROM US_df u JOIN yesterday y ON u.FIPS = y.FIPS and u.Date = y.Date
        where u.Date = (select MAX(Date) from US_df);
    `
    connection.query(query, function(err, rows, fields) {
        if (err) console.log(err)
        else {
            res.json(rows)
        }
    })
}



////////////World 
function getWorldCases(req, res) {
    var query = `
    SELECT w.Country, SUM(w.Confirmed) AS total_Confirmed, SUM(w.Deaths) AS total_Deaths, SUM(w.Recovered) AS total_Recovered
    FROM World_df w
    GROUP BY w.Country

    ORDER BY SUM(w.Confirmed) DESC;
    `
    connection.query(query, function(err, rows, fields) {
        if (err) console.log(err)
        else {
            res.json(rows)
        }
    })
}



function getConfirmCaseAllStates(req, res) {
    var query = `
    SELECT r.State, sum(u.Confirmed) AS total_Confirmed
    FROM US_df u JOIN US_region_df r ON u.FIPS = r.FIPS
    where u.Date = (select MAX(Date) from US_df)
    GROUP BY r.State;
    `
    connection.query(query, function(err, rows, fields) {
        if (err) console.log(err)
        else {
            console.log(rows);
            res.json(rows)
        }
    })
}

function getConfirmDeathAllStates(req, res) {
    var query = `
    SELECT r.State, SUM(u.Deaths) AS total_Deaths
    FROM US_df u JOIN US_region_df r ON u.FIPS = r.FIPS
    where u.Date = (select MAX(Date) from US_df)
    GROUP BY r.State;
    `
    connection.query(query, function(err, rows, fields) {
        if (err) console.log(err)
        else {
            console.log(rows);
            res.json(rows)
        }
    })
}



module.exports = {
    getStateCasesByState: getStateCasesByState,
    getWorldCases: getWorldCases,
    getRiskyCounties: getRiskyCounties,
    getCountyCasesByCounty: getCountyCasesByCounty,
    getConfirmCaseAllStates: getConfirmCaseAllStates,
    getConfirmDeathAllStates: getConfirmDeathAllStates,
    get10riskyStates: get10riskyStates,
    getStatePolicy: getStatePolicy
}
