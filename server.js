const express = require('express');
const bodyParser = require('body-parser');
const mysql      = require('mysql');
// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

var app = express();
var PORT = process.env.PORT || 8081;
var db = require("./models");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());



app.get("/", function(req, res) {
    res.send("Hello world");
  });



  app.get("/all", function(req, res) {
    // Grab every document in the Articles collection
    db.activeKidsScrape.findAll({})
      .then(function(scrapeDb) {
        // If we were able to successfully find Articles, send them back to the client
        res.json(scrapeDb);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });
  

  app.get("/scrape", function(req, res) {
    // Make a request via axios for the news section of `ycombinator`
    axios.get("https://news.ycombinator.com/").then(function(response) {
      // Load the html body from axios into cheerio
      var $ = cheerio.load(response.data);
      // For each element with a "title" class
      $(".title").each(function(i, element) {
        // Save the text and href of each link enclosed in the current element
        var title = $(element).children("a").text();
        var link = $(element).children("a").attr("href");
  
        // If this found element had both a title and a link
        if (title && link) {
          // Insert the data in the scrapedData db
          db.activeKidsScrape.create({
            title: title,
            link: link
          },
          function(err, inserted) {
            if (err) {
              // Log the error if one is encountered during the query
              console.log(err);
            }
            else {
              // Otherwise, log the inserted data
              console.log(inserted);
            }
          });
        }
      });


    });
  
    // Send a "Scrape Complete" message to the browser
    res.send("Scrape Complete");
  });

  //scraping timeout.com

app.get("/scrapeTimeOut", function(req, res) {
    // Make a request via axios for the news section of `ycombinator`
    axios.get("https://www.timeout.com/los-angeles/kids/things-to-do-in-los-angeles-with-kids").then(function(response) {
      // Load the html body from axios into cheerio
      var $ = cheerio.load(response.data);
      // For each element with a "title" class
      $(".card-title").each(function(i, element) {
        // Save the text and href of each link enclosed in the current element
        var title = $(element).children("a").text();
        var link = $(element).children("a").attr("href");
        // var title: = $(element)
  
        // If this found element had both a title and a link
        if (title && link) {
          // Insert the data in the scrapedData db
          db.activeKidsScrape.create({
            title: title,
            link: link
          },
          function(err, inserted) {
            if (err) {
              // Log the error if one is encountered during the query
              console.log(err);
            }
            else {
              // Otherwise, log the inserted data
              console.log(inserted);
            }
          });
        }
      });

      
    });
  
    // Send a "Scrape Complete" message to the browser
    res.send("Scrape Complete");
  });







// Start the server
db.sequelize.sync({ force: false }).then(function() {
    app.listen(PORT, function() {
      console.log("App listening on PORT " + PORT);
    });
  });
  