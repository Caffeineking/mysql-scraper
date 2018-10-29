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

// get route for all the LA curbed info
  
  app.get("/allLaCurbed", function(req, res) {
    // Grab every document in the Articles collection
    db.laCurbed.findAll({})
      .then(function(scrapeDb) {
        // If we were able to successfully find Articles, send them back to the client
        res.json(scrapeDb);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });
  
  // scrape data from LA curbed

  app.get("/scrapeLaCurbed", function(req, res) {
    // Make a request via axios for the news section of `ycombinator`
    axios.get("https://la.curbed.com/maps/things-to-do-kids-los-angeles").then(function(response) {
      // Load the html body from axios into cheerio
      var $ = cheerio.load(response.data);
      // For each element with a "title" class
      $(".c-mapstack__card").each(function(i, element) {
        // Save the text and href of each link enclosed in the current element
        var title = $(element).find("h1").text();
        var link = $(element).find("a").eq(1).attr("href");
        var description = $(element).find("p").eq(0).text();
        var descriptionTwo = $(element).find("p").eq(1).text();
        var address = $(element).find("div.c-mapstack__address").text();
        var image = $("div.embed").children().find("href");
        console.log(image);
        // var address = $(element).children().text();
        // If this found element had both a title and a link
        if (title && link && description && descriptionTwo && address) {
          // Insert the data in the scrapedData db
          db.laCurbed.create({
            title: title,
            link: link,
            description: description,
            descriptionTwo:descriptionTwo,
            address: address            
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

  // scraping eyespyla.com
  
  app.get("/scrapeEyeSpyLa", function(req, res) {
    // Make a request via axios for the news section of the website up ^^
    axios.get("http://eyespyla.com/www/thebuzz.nsf/457fe5b571dabc0288256eaf007c316b/ac8e0cf7863ed12d88256eaf0081da16!OpenDocument").then(function(response) {
      // Load the html body from axios into cheerio
      var $ = cheerio.load(response.data);
      // For each element with a "title" class
      $("tbody").find("tr").each(function(i, element) {
        // Save the text and href of each link enclosed in the current element
        var title = $(element).find("tr").find("td").eq(1).text();
        // var link = $(element).find("a").eq(1).attr("href");
        // var description = $(element).find("p").eq(0).text();
        // var descriptionTwo = $(element).find("p").eq(1).text();
        // var address = $(element).find("div.c-mapstack__address").text();
        // var image = $("div.embed").children().find("href");
       console.log(title);
        // var address = $(element).children().text();
        // If this found element had both a title and a link
        // if (title && link && description && descriptionTwo && address) {
          if (title) {http://eyespyla.com/www/thebuzz.nsf/457fe5b571dabc0288256eaf007c316b/ac8e0cf7863ed12d88256eaf0081da16!OpenDocument
          // Insert the data in the scrapedData db
          db.eyespyla.create({
            title: title
            // link: link
            // description: description,
            // descriptionTwo:descriptionTwo,
            // address: address            
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