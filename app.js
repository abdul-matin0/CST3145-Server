const express = require("express");
const cors = require("cors");

let app = express();
app.set('json spaces', 3);

app.use(cors());

app.use(function(req, res, next) {
    console.log("Incoming request: " + req.url);
    next();
});

app.get("/", function(req, res) {
    res.send("Welcome to my website!");
});

app.get("/user", function(req, res) {

   res.json({
      "email": "user@email.com",
      "password": "password"
   });
   
})

app.get("/lessons", function(req, res) {

    let lessons = [
        { id: 1, subject: 'Math', location: 'London', imageURL: 'assets/math.jpg', altText: 'math image', price: 100, spaces: 5, icon: 'fas fa-calculator' },
        { id: 2, subject: 'English', location: 'Lagos', imageURL: 'assets/english.jpg', altText: 'english image', price: 200, spaces: 5, icon: 'fas fa-book-open' },
        { id: 3, subject: 'Chemistry', location: 'Dubai', imageURL: 'assets/chemistry.jpg', altText: 'chemistry image', price: 300, spaces: 5, icon: 'fas fa-atom' },
        { id: 4, subject: 'Physics', location: 'Hull', imageURL: 'assets/physics.jpg', altText: 'physics image', price: 100, spaces: 5, icon: 'fas fa-tools' },
        { id: 5, subject: 'Biology', location: 'Leeds', imageURL: 'assets/biology.jpg', altText: 'biology image', price: 150, spaces: 5, icon: 'fas fa-user-md' },
        { id: 6, subject: 'Literature', location: 'London', imageURL: 'assets/literature.jpg', altText: 'literature image', price: 100, spaces: 5, icon: 'fas fa-calculator' },
        { id: 7, subject: 'Geography', location: 'Fulham', imageURL: 'assets/geography.jpg', altText: 'geography image', price: 200, spaces: 5, icon: 'fas fa-book-open' },
        { id: 8, subject: 'Hospitality', location: 'Dubai', imageURL: 'assets/hospitality.jpg', altText: 'hospitality image', price: 300, spaces: 5, icon: 'fas fa-atom' },
        { id: 9, subject: 'Nutrition', location: 'Hendon', imageURL: 'assets/nutrition.jpg', altText: 'nutrition image', price: 100, spaces: 5, icon: 'fas fa-tools' },
        { id: 10, subject: 'Law', location: 'London', imageURL: 'assets/law.jpg', altText: 'law image', price: 150, spaces: 5, icon: 'fas fa-user-md' }
    ];

    res.json(lessons);
});

app.use(function(req, res) {
    res.status(404).send("Resource not found...");
});

app.listen(3000, function() {
    console.log("App started on port 3000");
});