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


function getDailyIncreaseInfo(req, res)
 {
    var query = `
        SELECT r.State, SUM(u.Confirmed) AS today_Confirmed, SUM(u.Deaths) AS today_Deaths, SUM(u.Recovered) AS today_Recovered
        FROM US_df u JOIN US_region_df r ON u.FIPS = r.FIPS
        WHERE Date = (select Distinct MAX(Date) from US_df)
        GROUP BY r.State
        ORDER BY SUM(u.Confirmed) DESC, r.State ASC;
    `
    connection.query(query, function(err, rows, fields) {
        if (err) console.log(err)
        else {
            res.json(rows)
        }
    })
 }

function getStateCasesByState(req, res) {
    var state = req.params.state
    var query = `
    With policy AS (SELECT p.PROVINCE_STATE_NAME, p.POLICY_NAME, p.POLICY_ISSUE_DATE, p.POLICY_NOTE_TEXT, p.POLICY_URL
        FROM US_Policy p JOIN US_region_df r ON p.PROVINCE_STATE_NAME = r.State
        where p.PROVINCE_STATE_NAME = (select State from US_region_df where State = '${state}')
        and p.POLICY_ISSUE_DATE = (select MAX(p.POLICY_ISSUE_DATE) from US_Policy p where p.PROVINCE_STATE_NAME = '${state}' GROUP BY p.PROVINCE_STATE_NAME))
    SELECT r.State, SUM(u.Confirmed) AS total_Confirmed, SUM(u.Deaths) AS total_Deaths,
    SUM(u.Recovered) AS total_Recovered
    FROM US_df u JOIN US_region_df r ON u.FIPS = r.FIPS
    GROUP BY r.State
    HAVING r.State = '${state}';
    `
    connection.query(query, function(err, rows, fields) {
        if (err) console.log(err)
        else {
            console.log(rows);
            res.json(rows)
        }
    })
}



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

function getRiskyCounties(req, res) {
    var query = `
    WITH temp AS (SELECT r.County, SUM(u.Confirmed) AS total_Confirmed, SUM(u.Deaths) AS total_Deaths, SUM(u.Recovered) AS total_Recovered
    FROM US_df u JOIN US_region_df r ON u.FIPS = r.FIPS
    GROUP BY r.County)
    , riskyCounty AS( SELECT r.State, r.County, u.Confirmed
    FROM US_df u JOIN US_region_df r ON u.FIPS = r.FIPS 
    WHERE u.Date = (select MAX(Date) from US_df)
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

function getConfirmCaseAllStates(req, res) {
    var query = `
    SELECT r.State, SUM(u.Confirmed) AS total_Confirmed
    FROM US_df u JOIN US_region_df r ON u.FIPS = r.FIPS
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

function getCountyCasesByCounty(req, res) {
    var county = req.params.county
    var query = `
    WITH today AS (SELECT r.State, r.County, SUM(u.Confirmed) AS today_Confirmed, SUM(u.Deaths) AS today_Deaths, SUM(u.Recovered) AS today_Recovered
    FROM US_df u JOIN US_region_df r ON u.FIPS = r.FIPS
    WHERE u.Date = (select MAX(Date) from US_df)
    GROUP BY r.County)
    , total AS (SELECT r.County, SUM(u.Confirmed) AS total_Confirmed, SUM(u.Deaths) AS
    total_Deaths, SUM(u.Recovered) AS total_Recovered
    FROM US_df u JOIN US_region_df r ON u.FIPS = r.FIPS
    GROUP BY r.County)
    , policy AS (SELECT r.County,p.PROVINCE_STATE_NAME, p.POLICY_NAME, p.POLICY_ISSUE_DATE, p.POLICY_NOTE_TEXT, p.POLICY_URL
    FROM US_Policy p JOIN US_region_df r ON p.PROVINCE_STATE_NAME = r.State
    where p.PROVINCE_STATE_NAME = (select State from US_region_df where County = ${county})
    and p.POLICY_ISSUE_DATE = (select MAX(p.POLICY_ISSUE_DATE) from US_Policy p where p.PROVINCE_STATE_NAME = (select State from US_region_df where County = ${county}) GROUP BY p.PROVINCE_STATE_NAME)
    )
    SELECT p.County, p.POLICY_NAME, p.POLICY_NOTE_TEXT, p.POLICY_URL, a.today_Confirmed,
    a.today_Deaths, a.today_Recovered,b.total_Confirmed, b.total_Deaths,
    b.total_Recovered
    FROM today a JOIN total b ON a.County = b.County JOIN policy p ON a.County = p.County
    where p.County = '${county}';
    
    `
    connection.query(query, function(err, rows, fields) {
        if (err) console.log(err)
        else {
            res.json(rows)
        }
    })
}

module.exports = {
    getDailyIncreaseInfo: getDailyIncreaseInfo,
    getStateCasesByState: getStateCasesByState,
    getWorldCases: getWorldCases,
    getRiskyCounties: getRiskyCounties,
    getCountyCasesByCounty: getCountyCasesByCounty,
    getConfirmCaseAllStates: getConfirmCaseAllStates,
    getConfirmDeathAllStates: getConfirmDeathAllStates,
}
