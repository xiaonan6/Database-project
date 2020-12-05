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
    console.log('Conneced to database.')
    connection.query("show databases", function (err, rows, fields) {
        if (err) {
            console.error(err)
            return
        } else {
            console.log(rows)
        }
    })
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
    SELECT r.State, SUM(u.Confirmed) AS total_Confirmed, SUM(u.Deaths) AS total_Deaths,
    SUM(u.Recovered) AS total_Recovered
    FROM USCases u JOIN Region r ON u.FIPS = r.FIPS
    GROUP BY r.State
    HAVING r.State = ${state};
    `
    connection.query(query, function(err, rows, fields) {
        if (err) console.log(err)
        else {
            res.json(rows)
        }
    })
}

function getWorldCases(req, res) {
    var query = `
    SELECT w.Country, SUM(w.Confirmed) AS total_Confirmed, SUM(w.Deaths) AS total_Deaths, SUM(w.Recovered) AS total_Recovered
    FROM WorldCases w
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
    WITH temp AS (SELECT r.County, SUM(u.Confirmed) AS total_Confirmed, SUM(u.Deaths)
    AS total_Deaths, SUM(u.Recovered) AS total_Recovered
    FROM USCases u JOIN Region r ON u.FIPS = r.FIPS
    GROUP BY r.County)
    , riskyCounty AS( SELECT r.County
    FROM USCases u JOIN Region r ON u.FIPS = r.FIPS
    WHERE Date = CURDATE()
    GROUP BY r.State
    HAVING u.Confirmed > AVG(u.Confirmed))
    ,Total AS (SELECT r.County, SUM(u.Confirmed) AS today_Confirmed, SUM(u.Deaths) AS
    today_Deaths, SUM(u.Recovered) AS today_Recovered
    FROM USCases u JOIN Region r ON u.FIPS = r.FIPS
    WHERE Date = CURDATE()
    GROUP BY r.County)
    SELECT CURDATE() AS Date, a.County, a.today_Confirmed, a.today_Deaths,
    a.today_Recovered,b.total_Confirmed, b.total_Deaths, b.total_Recovered
    FROM Total a join temp b on a.County = b.County
    WHERE a.County IN (SELECT * FROM riskyCounty);
    `
    connection.query(query, function(err, rows, fields) {
        if (err) console.log(err)
        else {
            res.json(rows)
        }
    })
}



function getCountyCasesByCounty(req, res) {
    var county = req.params.county
    var query = `
    WITH today AS (SELECT r.County, SUM(u.Confirmed) AS today_Confirmed,
    SUM(u.Deaths) AS today_Deaths, SUM(u.Recovered) AS today_Recovered
    FROM USCases u JOIN Region r ON u.FIPS = r.FIPS
    WHERE Date = CURDATE()
    GROUP BY r.County)
    , total AS (SELECT r.County, SUM(u.Confirmed) AS total_Confirmed, SUM(u.Deaths) AS
    total_Deaths, SUM(u.Recovered) AS total_Recovered
    FROM USCases u JOIN Region r ON u.FIPS = r.FIPS
    GROUP BY r.County)
    ,policy AS (SELECT p.County, p.policy_name, p.policy_expiry_date
    FROM USPolicy p JOIN Regoin r ON p.State = r.State
    WHERE r.Latitude = “userInputLat” AND r.Longitude = ${county}
    GROUP BY p.State
    HAVING p.policy_issue_Date = MAX(p.policy_issue_Date)
    )
    SELECT a.County, p.State, p.policy_name, p.policy_expiry_date, a.today_Confirmed,
    a.today_Deaths, a.today_Recovered,b.total_Confirmed, b.total_Deaths,
    b.total_Recovered
    FROM today a JOIN total b ON a. County = b.County JOIN policy p ON a.County =
    p.County;
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
    getCountyCasesByCounty: getCountyCasesByCounty
}
