const express = require("express");
const bodyParser = require('body-parser');
const cors = require("cors");
const xml = require("libxmljs");
const fs = require("fs");

const app = express();

const option = {
  origin: "http://81.21.193.231:9000",
  method: "*",
  optionsSuccessStatus: 200
};

app.use(bodyParser.json());
app.use(express.static("public"));
let file;
fs.readFile("./kurs.xml", (err, data) => {
  if (err) {
    throw err;
  }
  const datatmp = data.toString().replace(/\r?\n|\r| {2,}/g, '');
  // console.log(datatmp)
  file = xml.parseXmlString(datatmp);

});

function save() {
  fs.writeFile("./kurs.xml", file.toString(), (err) => {
    if(err) {
      console.log("somefing went wrong")
    } else {
      console.log("OK");
    }
  })
}

app.options("/kurs/get/kurs", cors(option));

app.get("/api/lessons/list", cors(option), (req, res)  => {
  let resp = []

  let obj = file.find(`//lekcja`);
  console.log(obj);
  for (let objElement of obj) {
    let tmp = {}
    tmp.id = objElement.attr('nr').value()
    tmp.name = objElement.attr("nazwa") && objElement.attr("nazwa").value()
    resp.push(tmp)
  }
  // resp = resp.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))
  console.log(resp)
  res.json(resp)
});

app.get("/api/lessons/:id", cors(option), (req, res) => {
  // console.log(req);
  let resp = {name:"", data: []}
  // console.log(file.get("//").text());
  console.log(req.params);
  let obj = file.find(`//lekcja[@nr='${req.params.id}']`);
  console.log(obj[0]);
  resp.name = obj[0].attr("nazwa") && obj[0].attr("nazwa").value()
  for (let objElement of obj[0].find("slowo")) {
    let tmp = {}
    tmp.en = objElement.get('en').text();
    tmp.pl = objElement.get('pl').text();
    resp.data.push(tmp)
  }
  // resp = resp.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))
  console.log(resp)
  res.json(resp)
});


const port = 9000;
app.options("/api/lesson/edit/:id",cors(option));
app.post("/api/lesson/edit/:id",cors(option), (req, res) => {
  console.log("test")
  let resp = {name:"", data: []}
  let obj = file.find(`//lekcja[@nr='${req.params.id}']`);
  console.log(obj[0].text());
  obj[0].attr({nazwa: req.body.name});
  save();
  resp.name = obj[0].attr("nazwa") && obj[0].attr("nazwa").value()
  for (let objElement of obj[0].find("slowo")) {
    let tmp = {}
    tmp.en = objElement.get('en').text();
    tmp.pl = objElement.get('pl').text();
    resp.data.push(tmp)
  }
  res.json(resp);
});

app.options("/api/lesson/add",cors(option));
app.post("/api/lesson/add",cors(option), (req, res) => {
  let resp = []
  console.log("test", "add");
  let obj = file.find(`//lekcja`);
  let root = file.root();
  root.node("lekcja").attr({nazwa: req.body.name, nr: obj.length+1});
  obj = file.find(`//lekcja`);
  console.log(obj);
  for (let objElement of obj) {
    let tmp = {}
    tmp.id = objElement.attr('nr').value()
    tmp.name = objElement.attr("nazwa") && objElement.attr("nazwa").value()
    resp.push(tmp)
  }
  // resp = resp.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))
  console.log(resp)
  res.json(resp)
});

app.options("/api/lesson/:id/edit/:fisk",cors(option));
app.post("/api/lesson/:id/edit/:fisk", cors(option), (req, res) => {
  let resp = {name:"", data: []}
  // console.log(file.get("//").text());
  console.log(req.params);
  let obj = file.find(`//lekcja[@nr='${req.params.id}']`);
  console.log(obj[0]);
  let elems = obj[0].find("slowo");
  if (req.body.pl) {
    elems[req.params.fisk].get("pl").text(req.body.pl)
  }

  if (req.body.en) {
    elems[req.params.fisk].get("en").text(req.body.en)
  }

  resp.name = obj[0].attr("nazwa") && obj[0].attr("nazwa").value()
  for (let objElement of obj[0].find("slowo")) {
    let tmp = {}
    tmp.en = objElement.get('en').text();
    tmp.pl = objElement.get('pl').text();
    resp.data.push(tmp)
  }
  // resp = resp.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))
  console.log(resp)
  res.json(resp)
});

app.options("/api/lesson/:id/addfisk", cors(option));
app.post("/api/lesson/:id/addfisk", cors(option), (req, res) => {
  let resp = {name:"", data: []}
  // console.log(file.get("//").text());
  console.log(req.params);
  let obj = file.find(`//lekcja[@nr='${req.params.id}']`);
  obj[0].node("slowo")
    .node("pl", req.body.pl)
    .parent().node("en", req.body.en)

  resp.name = obj[0].attr("nazwa") && obj[0].attr("nazwa").value()
  for (let objElement of obj[0].find("slowo")) {
    let tmp = {}
    tmp.en = objElement.get('en').text();
    tmp.pl = objElement.get('pl').text();
    resp.data.push(tmp)
  }
  // resp = resp.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))
  console.log(resp)
  res.json(resp)
});

app.options("/api/lesson/:id/removefisk", cors(option));
app.get("/api/lesson/:id/removefisk/:fisk", cors(option), (req, res) => {
  let resp = {name:"", data: []}
  // console.log(file.get("//").text());
  console.log(req.params);
  let obj = file.find(`//lekcja[@nr='${req.params.id}']`);
  let elems = obj[0].find("slowo");
  elems[req.params.fisk].remove();

  resp.name = obj[0].attr("nazwa") && obj[0].attr("nazwa").value()
  for (let objElement of obj[0].find("slowo")) {
    let tmp = {}
    tmp.en = objElement.get('en').text();
    tmp.pl = objElement.get('pl').text();
    resp.data.push(tmp)
  }
  // resp = resp.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))
  console.log(resp)
  res.json(resp)
});

app.get("/api/lesson/remove/:id", cors(option),(req, res) => {
  let obj = file.find(`//lekcja[@nr='${req.params.id}']`);
  obj[0].remove()

  let resp = []

  obj = file.find(`//lekcja`);
  console.log(obj);
  for (let objElement of obj) {
    let tmp = {}
    tmp.id = objElement.attr('nr').value()
    tmp.name = objElement.attr("nazwa") && objElement.attr("nazwa").value()
    resp.push(tmp)
  }
  // resp = resp.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))
  console.log(resp)
  res.json(resp)
});



app.listen(port, () => console.log(`App listening on port ${port}!`));
