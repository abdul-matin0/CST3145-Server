const express = require("express");
// cors required for cross origin resource sharing
const cors = require("cors");
const path = require('path');
let propertiesReader = require("properties-reader");
const bodyParser = require('body-parser');



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

/// mongoDB connection string
const dbURI = dbPprefix + dbUserName + ":" + dbPassword + dbUrl + dbParams;

/// connecting by using MongoDB Stable API
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const client = new MongoClient(dbURI, { serverApi: ServerApiVersion.v1 });
let db = client.db(dbName);

/// using express
let app = express();
app.set('json spaces', 3);
app.set(express.json())
app.set(express.urlencoded({ extended: true }))

/// setup cors middleware
app.use(cors());

app.use(bodyParser.json()); // parse application/json

/// logger’ middleware that output all requests to the server console 
app.use(function (req, res, next) {
    // log incoming requests to console
    console.log("Incoming request: " + req.url);
    next();
});

/// serving static files
app.use('/static', express.static(path.join(__dirname, 'public')))

/// https://localhost:3000/:collectionName
/// get route returns all lessons
app.get('/:collectionName', function (req, res, next) {
    req.collection.find({}).toArray(function (error, results) {
        if (error) {
            return next(error);
        }
        res.send(results);
    });
});


//  http://localhost:3000/collections/products/2/title/asc
// app.get('/collections/:collectionName/:max/:sortAspect/:sortAscDesc', function(
// app.get('/:collectionName'
//     , function (req, res, next) {
//   //  const collectionName = req.params.collectionName;
//         // req.collection.find({}, {limit: 3, sort: [["price", -1]]}).toArray

//         // TODO: Validate params
//         // var max = parseInt(req.params.max, 10); // base 10
//         // let sortDirection = 1;
//         // if (req.params.sortAscDesc === "desc") {
//         // sortDirection = -1;
//         // }
//         // req.collection.find({}, {limit: max, sort: [[req.params.sortAspect,
//         // sortDirection]]}).toArray(function(err, results) {
//         // req.collection.findOne({ _id: new ObjectId(req.params.id) },
//         // req.collection.find({}).toArray(function (err, results) {
//         req.collection.findOne({ id: 10 }, function (err, results) {
//             if (err) {
//                 return next(err);
//             }
//             res.send(results);
//         });
//     });


/// post route saves order to order collection
app.post('/:collectionName'
    , function (req, res, next) {
        try {
            req.body._id = new ObjectId();
            req.collection.insertOne(req.body, function (err, results) {
                if (err) {
                    return next(err);
                }
                res.send(results);
            });
        } catch (e) {
            next(e);
        }
    });

/// A PUT route that updates the number of available spaces in the
/// 'lesson' collection after an order is submitted
app.put('/:collectionName/:id', function (req, res, next) {
    var id = req.params.id;
    req.collection.updateOne({ _id: new ObjectId(id) }, { $set: req.body }, function (err, results) {
        if (err) {
            return next(err);
        }
        res.send(results);
    });
});


app.get("/", function (req, res) {
    res.send("Welcome to my website!");
});

/// handles invalid request
app.use(function (req, res) {
    res.status(404).send("Resource not found...");
});

/// middlware allows to intercept a param and intialize related collection
app.param('collectionName'
    , function (req, res, next, collectionName) {
        console.log('connection');
        req.collection = db.collection(collectionName);
        return next();
    });

/// listening on port 3000
app.listen(3000, function () {
    console.log("App started on port 3000");
});