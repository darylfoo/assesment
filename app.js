//Declarations
const express = require('express');
const http = require('http');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser");
const scrape = require("./form/scrape.js");
const data = require("./form/get_all_data.js");
const id = require("./form/get_by_id.js");
const page = require("./form/get_by_page.js");
const popular = require("./form/get_by_popular.js");
const create = require("./form/create_meme.js");
//Declarations

//Set Route
exports = module.exports = router;
//Set Route

//Server Setup
var port = 1337;
var server = http.createServer(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

server.listen(port);

server.on("listening",function(){
	var addr = server.address();
	console.log("Server on listening : "+addr.port);
});
//Server Setup

//API

//Get data from website (GET)
app.get('/scrape', function(req, res, next){
	scrape.extract_data(req, res);
});

//Return all data (GET)
app.get('/meme/all', function(req,res, next){
	data.get_all_data(req, res);
});

//Return meme by id (GET)
app.get('/meme/id', function(req,res, next){
	id.get_by_id(req, res);
});

//Return meme results by page (GET)
app.get('/meme/page', function(req,res, next){
	page.get_by_page(req, res);
});

//Return meme with most request count (GET)
app.get('/meme/popular', function(req,res, next){
	popular.get_by_popular(req, res);
});

//Create new image data (POST)
app.post('/meme/create', function(req,res, next){
	create.create_meme(req, res);
});

app.get('/',function(req,res){
	res.sendFile(__dirname +'/index.html');
});
//API