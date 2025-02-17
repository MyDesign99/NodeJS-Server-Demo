const http			= require ('http');
const Controller	= require ('./controller');

const port     = 3000;

const path1 = 'api/get/imageurl';
const path2 = 'api/personal/imageurl';
const path3 = 'api/student/imageurl';

// -----------------------------------------------------------

var server = http.createServer (function (request, response) 
{
	if (request.method == 'POST') {
		var postBody = "";
		request.on ('data', function(data) {
			postBody += data;
		})
		
		request.on ('end', function() {
			if (Controller.isUrlMatch (request, path1)) {
				Controller.singleImageUrl (postBody, 
					function (url) {
						sendPlainHtml (response, url);
					});
			}

			if (Controller.isUrlMatch (request, path2)) {
				Controller.personalImageUrl (postBody, 
					function (url) {
						sendPlainHtml (response, url);
					});
			}

			if (Controller.isUrlMatch (request, path3)) {
				Controller.studentUrlArray (postBody, 
					function (urlArray) {
						sendArrayAsPlainHtml (response, urlArray);
					});
			}
		});
	} 
});


function sendPlainHtml (responseObj, theText)
{ 
	responseObj.writeHead (200, {"Content-Type": "text/plain"});
   responseObj.end (theText);
}

function sendArrayAsPlainHtml (responseObj, theArray)
{ 
	const theText = JSON.stringify (theArray);
	sendPlainHtml (responseObj, theText);
}

// -----------------------------------------------------
// -----------------------------------------------------

server.listen (port);
console.log ("MD99-http Server Demo is listening on port " + port);
