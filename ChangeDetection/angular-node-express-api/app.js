var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require("cors");
var users = require('./routes/users');
const puppeteer = require('puppeteer');
const angularPath = "/../dist/ChangeDetection";

var url = 'https://www.fhwn.ac.at/';
var query = 'div';
var app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, angularPath)));

// app.use(cors());
// app.use(bodyParser.json(__dirname,angularPath));
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(express.static(path.join()))
app.get("/content", function (req, res) {

  console.log(url);
  console.log(query);

  (async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url).catch(() => {
      console.warn("Could not navigate to the url.");
      browser.close();
      return;
    });

    const textContent = await page.evaluate(() => document.querySelector('div').textContent);
    const innerText = await page.evaluate(() => document.querySelector('div').innerText);

    console.log(textContent);
    console.log(innerText);
    browser.close();

    let message = {
      textContent: textContent,
      // innerText: innerText
    }
    res.send(JSON.stringify(message));
  })();

});

app.post("/setconfig", function (req, res) {
  url = req.body.url;
  query = req.body.query;
});

app.get("/getconfig", function (req, res) {
  let message = {
    url: url,
    query: query
  }
  res.send(JSON.stringify(message));

});

app.get("**", function (req, res) {
  res.sendFile(path.join(__dirname, angularPath, "index.html"));
  // Build von Angular:
  //statt ng serve
  // for debug:       ng build
  // for production:  ng build --prod
  // das fertig gebuildete angular projekt ist dann in diesem "dist" folder.
});

module.exports = app;

app.listen(3000);

