//Declarations
const fs = require('fs');
const Worker = require('worker-middleware').Worker;
//Declarations

//Export function to app.js
exports = module.exports = {};
exports.get_by_page = get_by_page;
//Export function to app.js

//Function to find image data by page, read json file, find all results with given page, return results and overide file 
function get_by_page(req, res){

	var img_page = [];
	var page = req.query.page;
	var w = new Worker();

	if(!page)
	{
		return res.json({
			 error: {
			 	message :"Page value cannot be blank"
			 } 
		});
	}

	fs.readFile('image_data.json', 'utf8', function (err, data) {

		if (err) throw err;
		image_data = JSON.parse(data);

		for(var i = 0; i < image_data.length; i++){

			w.do(push_result(image_data, img_page, page, i));
		}

		w.run(function(context, err){
			if(img_page.length == 0){
				res.json({
					"data":{
						"message" : "Page does not exists"
					}
				});
			}

			else{

				res.json(img_page);

				fs.writeFile('image_data.json', JSON.stringify(image_data, null, 4), function(err){
				    
				    console.log('File successfully overwritten! - Check your project directory for the image_data.json file');
				
				});

			}
			

		});
	});
}

function push_result(image_data, img_page, page, i){

	return function(context, next){

		if(image_data[i].page == page){

			image_data[i].requestCount += 1;

			img_page.push(image_data[i]);
			
			next();
		}

		else{
			next();
		}
	}
}