//Declarations
const fs = require('fs');
//Declarations

//Export function to app.js
exports = module.exports = {};
exports.get_all_data = get_all_data ;
//Export function to app.js

//Main function to return all data, read file, return results and update request count
function get_all_data(req, res){
	fs.readFile('image_data.json', 'utf8', function (err, data) {

		if (err) throw err;
		image_data = JSON.parse(data);

		for(var i = 0; i < image_data.length; i++){

			image_data[i].requestCount += 1;

			if(i == image_data.length - 1){

				res.json(image_data);

				fs.writeFile('image_data.json', JSON.stringify(image_data, null, 4), function(err){
				    
				    console.log('File successfully overwritten! - Check your project directory for the image_data.json file');
				
				});
			}
		}
	});
}