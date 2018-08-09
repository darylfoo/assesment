//Declarations
const fs = require('fs');
const Worker = require('worker-middleware').Worker;
//Declarations

//Export function to app.js
exports = module.exports = {};
exports.create_meme = create_meme ;
//Export function to app.js

//Image class
function img_obj(id, name, url, page) {

	this.id = id,
	this.name = name,
	this.url = url,
	this.page = page,
	this.requestCount = 0
}

//Main function to create image data
//1. Validate Input
//2. Read File find latest page
//3. If latest page already max (9), assign to new page else, assign to lastest page
//4. Overwirte json file and respond called API
function create_meme(req,res){

	var name = req.body.name;
	var url = req.body.url;

	if(!name && !url){
		return res.json({
			 error: {
			 	message :"Name and URL cannot be blank"
			 } 
		})
	}

	if(!name)
	{
		return res.json({
			 error: {
			 	message :"Name cannot be blank"
			 } 
		})
	}

	if(!url)
	{
		return res.json({
			 error: {
			 	message :"URL cannot be blank"
			 } 
		})
	}

	fs.readFile('image_data.json', 'utf8', function (err, data) {

		if (err) throw err;
		image_data = JSON.parse(data);

		var w = new Worker();
		var meme_in_page = [];
		var latest_img = image_data[image_data.length-1];

		for(var i = 0; i < image_data.length; i++){
			
			w.do(push_result(image_data, latest_img, meme_in_page , i));

		}

		w.do(assign_page(meme_in_page, latest_img, name, url));

		w.run(function(context, err){
			image_data.push(context.new_img);

			fs.writeFile('image_data.json', JSON.stringify(image_data, null, 4), function(err){
		    
			    console.log('File successfully overwritten! - Check your project directory for the image_data.json file');
			
			});

			res.json({

				"data":{

					"message" : "New image data inserted",
					"New image data": context.new_img

				}

			});
		});
	});
}

function push_result(image_data, latest_img, meme_in_page , i){
	return function(context, next){

		if(image_data[i].page == latest_img.page){

			meme_in_page.push(image_data[i]);
			next();

		}

		else{

			next();

		}
	}
}

function assign_page(meme_in_page, latest_img, name, url){
	return function(context, next){

		if(meme_in_page.length >= 9){

			context.new_img = new img_obj((latest_img.id + 1), name, url, (latest_img.page + 1));
			next();

		}

		else{

			context.new_img = new img_obj((latest_img.id + 1), name, url, (latest_img.page));
			next();

		}
	}
}