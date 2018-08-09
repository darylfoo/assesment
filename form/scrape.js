//Declarations
const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
const Worker = require("worker-middleware").Worker;
//Declarations

//Export function to app.js
exports = module.exports = {};
exports.extract_data = extract_data ;
//Export function to app.js

//Image class
function img_obj(id, name, url, page) {

	this.id = id,
	this.name = name,
	this.url = url,
	this.page = page,
	this.requestCount = 0
}

//Main Function called in app.js
function extract_data(req, res){

	var image_data = [];
	var w = new Worker();

	//Loop all pages to get data
	for(var i = 1; i <= 95; i++){
		w.do(find_data(image_data, i));
	}
	//Assign ID to all retrieved data
	w.do(assign_id(image_data));

	w.run(function(context, err){
		//Write into json file to store results
		fs.writeFile('image_data.json', JSON.stringify(image_data, null, 4), function(err){
		    console.log('File successfully written! - Check your project directory for the image_data.json file');
		});

		//Respond called API with message
		res.json({
			"data":{
				"message": "Data retrieved, check image_data.json for results"
			}
		});

	});
}

//Function using cheerio js to scrape data from website
function find_data(image_data, page){
	return function(context, next){

		//Define url, page variable used to loop all 95 pages
		var url = 'http://interview.funplay8.com/index.php?page=' + page;
		request(url, function(error, response, html){
			if(!error){

		        var $ = cheerio.load(html);
		        var name_arr = [];
		        var url_arr = [];
		        var w = new Worker();

		        //Define selectors by finding unique class name in website
		        var meme_name = $('.meme-name');
		        var meme_url =  $('.meme-img');

		        //Get both name and url in a page and push into an array
		        w.do(function(context, then){
		        	meme_name.each(function(i){
			        	var data = $(this);
			        	name_arr.push(data.children().text());
			        });
			    
		        	meme_url.each(function(i){
			        	var data = $(this);
			        	url_arr.push(data.attr('src'));
			        });
			 
		        	name_arr.forEach(function(element, i){
			        	var obj = new img_obj(null, element, url_arr[i], page);
			        	image_data.push(obj);
			        });
		        	then();
		        });

		        w.run(function(context, err){
		        	next();
		        });
		    }
		});
	}
}

//Function to assign ID to data
function assign_id(image_data){
	return function(context, next){
		for(var i = 0; i< image_data.length; i++){
			image_data[i].id = i + 1;
			if(i == image_data.length -1){
				next();
			}
		}
	}
}