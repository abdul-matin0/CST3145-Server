const express = require("express");
// cors required for cross origin resource sharing
const cors = require("cors");
const path = require('path');
let propertiesReader = require("properties-reader");
/// gets lessons data from lessons
const lessonsData = require('./lessons');

// configuring connection settings to the DB with properties
let propertiesPath = path.resolve(__dirname, "conf/db.properties");
let properties = propertiesReader(propertiesPath);

let dbPprefix = properties.get("db.prefix");
// URL encoding
let dbUserName = encodeURIComponent(properties.get("db.user"));
let dbPassword = encodeURIComponent(properties.get("db.password"));
let dbName = properties.get("db.dbName");
let dbUrl = properties.get("db.dbUrl");
let dbParams = properties.get("db.params");
const myRouter =require("./Routes/myRoutes.js")
// mongoDB connection string
const dbURI = dbPprefix + dbUserName + ":" + dbPassword + dbUrl + dbParams;

// connecting by using MongoDB Stable API
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const client = new MongoClient(dbURI, { serverApi: ServerApiVersion.v1 });
let db = client.db(dbName);

// using express
let app = express();
app.set('json spaces', 3);

// setup cors middleware
app.use(cors());

// logger’ middleware that output all requests to the server console 
app.use(function (req, res, next) {
    // log incoming requests to console
    console.log("Incoming request: " + req.url);
    next();
});

// serving static files
app.use('/static', express.static(path.join(__dirname, 'public')))

/// middlware allows to intercept a param and intialize related collection
app.param('collectionName'
    , function (req, res, next, collectionName) {
        req.collection = db.collection(collectionName);
        return next();
    });


//  http://localhost:3000/collections/products/2/title/asc
// app.get('/collections/:collectionName/:max/:sortAspect/:sortAscDesc', function(
app.get('/:collectionName'
    , function (req, res, next) {
  //  const collectionName = req.params.collectionName;
        // req.collection.find({}, {limit: 3, sort: [["price", -1]]}).toArray

        // TODO: Validate params
        // var max = parseInt(req.params.max, 10); // base 10
        // let sortDirection = 1;
        // if (req.params.sortAscDesc === "desc") {
        // sortDirection = -1;
        // }
        // req.collection.find({}, {limit: max, sort: [[req.params.sortAspect,
        // sortDirection]]}).toArray(function(err, results) {
        // req.collection.findOne({ _id: new ObjectId(req.params.id) },
        // req.collection.find({}).toArray(function (err, results) {
        req.collection.findOne({ id: 10 }, function (err, results) {
            if (err) {
                return next(err);
            }
            res.send(results);
        });
    });


app.post('/collections/:collectionName'
    , function (req, res, next) {
        // TODO: Validate req.body
        req.collection.insertOne(req.body, function (err, results) {
            if (err) {
                return next(err);
            }
            res.send(results);
        });
    });

app.delete('/collections/:collectionName/:id'
    , function (req, res, next) {
        req.collection.deleteOne(
            { _id: new ObjectId(req.params.id) }, function (err, result) {
                if (err) {
                    return next(err);
                } else {
                    res.send((result.deletedCount === 1) ? { msg: "success" } : { msg: "error" });
                }
            }
        );
    });

app.put('/collections/:collectionName/:id'
    , function (req, res, next) {
        // TODO: Validate req.body
        req.collection.updateOne({ _id: new ObjectId(req.params.id) },
            { $set: req.body },
            { safe: true, multi: false }, function (err, result) {
                if (err) {
                    return next(err);
                } else {
                    res.send((result.matchedCount === 1) ? { msg: "success" } : { msg: "error" });
                }
            }
        );
    });

app.get("/", function (req, res) {
    res.send("Welcome to my website!");
});

/// {/user} route endpoint to get user details
app.get("/user", function (req, res) {

    res.json({
        "email": "user@email.com",
        "password": "password"
    });
})

/// {/lessons} route to get list of lessons
app.get("/lessons", function (req, res) {
    res.json(lessonsData.lessons);
});
app.use("/api/v1",myRouter)

/// handles invalid request
app.use(function (req, res) {
    res.status(404).send("Resource not found...");
});

/// listening on port 3000
app.listen(3000, function () {
    console.log("App started on port 3000");
});