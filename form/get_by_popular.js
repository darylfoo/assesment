//Declarations
const fs = require('fs');
const Worker = require('worker-middleware').Worker;
//Declarations

//Export function to app.js
exports = module.exports = {};
exports.get_by_popular = get_by_popular;
//Export function to app.js

//Function to get results by most request count
function get_by_popular(req, res){

	var img_pop = [];
	var w = new Worker();

	//Read file, find image with highest number of request count, push result into array and return results and override json file
	fs.readFile('image_data.json', 'utf8', function (err, data) {

		if (err) throw err;
		image_data = JSON.parse(data);

		var max_req_co = Math.max(...image_data.map(image_data=>image_data.requestCount));

		for(var i = 0; i < image_data.length; i++){
			w.do(push_result(image_data, img_pop, max_req_co, i));
		}

		w.run(function(context, err){
			res.json(img_pop);

			fs.writeFile('image_data.json', JSON.stringify(image_data, null, 4), function(err){
			    
			    console.log('File successfully overwritten! - Check your project directory for the image_data.json file');
			
			});

		});
	});
}

function push_result(image_data, img_pop, max_req_co, i){

	return function(context, next){
		if(image_data[i].requestCount == max_req_co){

			image_data[i].requestCount += 1;

			img_pop.push(image_data[i]);

			next();
		}

		else{

			next();

		}
	}
}