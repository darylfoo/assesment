//Declarations
const fs = require('fs');
//Declarations

//Export function to app.js
exports = module.exports = {};
exports.get_by_id = get_by_id ;
//Export function to app.js

//Main function to get image data by id. Read file, find image with given id, return results and override file
function get_by_id(req, res){
	var id = req.query.id;
	if(!id)
	{
		return res.json({
			 error: {
			 	message :"ID cannot be blank"
			 } 
		});
	}

	fs.readFile('image_data.json', 'utf8', function (err, data) {

		if (err) throw err;
		image_data = JSON.parse(data);

		for(var i = 0; i < image_data.length; i++){

			if(image_data[i].id == id){

				image_data[i].requestCount += 1;

				res.json(image_data[i]);

				fs.writeFile('image_data.json', JSON.stringify(image_data, null, 4), function(err){
				    
				    console.log('File successfully overwritten! - Check your project directory for the image_data.json file');
				
				});

				break;
			}

			else if(i == image_data.length - 1){
				res.json({
					"data":{
						"message" : "No image with this ID"
					}
				});
			}

		}
	});
}