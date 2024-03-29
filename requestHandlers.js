var exec = require("child_process").exec;
var querystring = require("querystring"),
	fs = require("fs"),
	formidable = require("formidable");

function start(response, postData)
{
	console.log("Request handler 'start' was called.");
	
	var body = '<html>'+
		'<head>'+
		'<meta http-equiv="Content-Type" content="text/html; '+
		'charset=UTF-8" />'+
		'</head>'+
		'<body>'+
		'<form action="/upload" enctype="multipart/form-data" method="post">'+
		'<input type="file" name="upload">' +
		'<input type="submit" value="Upload file" />'+
		'</form>'+
		'</body>'+
		'</html>';

		response.writeHead(200, {"Content-Type": "text/html"});
		response.write(body);
		response.end();
}

function upload(response, request)
{
	console.log("Request handler 'upload' was called.");

	var form = new formidable.IncomingForm();
	console.log("about to parse");
	form.parse(request, function(error, fileds, files){
		console.log("parsing done");

		fs.rename(files.upload.path, "/Temp/ayincuba2.jpg", function(error){
			if (error){
				fs.unlink("/Temp/ayincuba2.jpg");
				fs.rename(files.upload.path, "/Temp/ayincuba1.jpg");
			}
		});
	});

	response.writeHead(200, {"Content-Type": "text/plain"});
	response.write("received image: <br>");
	response.write("<img src='/show' />");
	response.end();
}

function show(response, postData)
{
	console.log("Request handler 'show' was called.");
	fs.readFile("/Temp/ayincuba2.jpg", "binary", function(error, file){
		if (error){
			response.writeHead(500, {"Content-Type": "text/plain"});
			response.write(error + "\n");
			response.end();
		}else{
			response.writeHead(200, {"Content-Type" : "image/png"});
			response.write(file, "binary");
			response.end();
		}

	});

}

exports.start = start;
exports.upload = upload;
exports.show = show;