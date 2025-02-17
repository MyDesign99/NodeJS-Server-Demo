// ----------------------------------------------------------------
//		IMPORTS
// ----------------------------------------------------------------
const crypto = require('node:crypto');
const fs     = require('node:fs');
const axios  = require('axios');

// ----------------------------------------------------------------
//		CONSTANTS
// ----------------------------------------------------------------
const gAuthTokenUrl = "/api/get/authtoken";
const gErrorImgUrl  = "/images/image_not_found.png";


const gRemoteUrl = "https://mydesign99.com";


// ----------------------------------------------------------------
//		EXPORTABLES
// ----------------------------------------------------------------
exports.createImageURL = createImageURL;
exports.errorImageURL = errorImageURL;
exports.getMD99AuthToken = getMD99AuthToken;

// ----------------------------------------------------------------

function createImageURL (publicKey, token, value, longAssetName)
{
	const assetName = stripAssetName (longAssetName);
	
	return (gRemoteUrl + "/get/" + publicKey + "/" + token + "/" + value + "/" + assetName + ".png");
}

function errorImageURL ()
{
	return (gRemoteUrl + gErrorImgUrl);
}
	
function getMD99AuthToken (publicKey, secretKey, tokenCallback)		// callback format (success, token, errMsg)
{
	const tokenObj = readTokenFromCache ();
	if (tokenObj.success) {
		//console.log("Found valid token in the file cache");
		tokenCallback (true, tokenObj.token, "");
		return;
	}

	const payloadAr = {'client_id': publicKey};
	const fullJwt   = buildJWT (payloadAr, secretKey)
	const params    = new URLSearchParams ({'jwt': fullJwt});
	
	const postUrl = gRemoteUrl + gAuthTokenUrl;
	axios.post (postUrl, params)
	.then (function (axResponse) 
	{
		console.log("Success: Got valid response from MD99 server");

		const retData = parseTokenFromJMCResult (axResponse.data);
		if (! retData.success) {
			tokenCallback (false, "", retData.message);
			return;
		}
		writeTokenToCache (retData);
		
		tokenCallback (true, retData.token, "");
		return;
	})
	.catch (function (error) 
	{
		tokenCallback (false, "", error);
		return;
	});
}

// ----------------------------------------------------------------
// ----------------------------------------------------------------

function buildJWT (payloadAsAr, secret)
{ 
	hdrAr = {"alg" : "HS256", "typ" : "JWT"};

	const hdr64  = arrayTo64 (hdrAr);
	const pay64  = arrayTo64 (payloadAsAr);
	const full64 = hdr64 + "." + pay64;
	const sign64 = crypto.createHmac ('sha256', secret)
								.update (full64)
								.digest ('base64');

	// massage the encoding to math the PHP version
	let fullJWT = full64 + "." + sign64;
	fullJWT = fullJWT.replaceAll("+", "-");
	fullJWT = fullJWT.replaceAll("/", "_");
	if (fullJWT.substring(fullJWT.length-1) == "=") {
		fullJWT = fullJWT.substring(0, fullJWT.length-1)
	}

	return fullJWT;
}


function arrayTo64 (srcAr)
{ 
	const asStr = JSON.stringify (srcAr);
	return btoa (asStr);
}


function parseTokenFromJMCResult (responseData)
{
	if (! responseData.hasOwnProperty ("is_success"))
		return formatError ("Invalid response format (s)");
	if (responseData.is_success != "1") {
		if (! responseData.hasOwnProperty ("err_msg"))
			return formatError ("Invalid response format (em)");
		
		return formatError (responseData.err_msg);
	}

	if (! responseData.hasOwnProperty ("data"))
		return formatError ("Invalid response format (data)");
	
		
	const data = responseData.data 
	if (! data.hasOwnProperty ("token"))	
		return formatError ("Invalid response format (token)");
	
	return formatSuccess (responseData.data);
}


function formatSuccess (retObj) 
{
	retObj.success = true;
	return retObj;
}

function formatError (msg) 
{
	const retObj = {success: false, message: msg};
	return retObj;
}


function stripAssetName (name)
{
	name = name.replaceAll (" " , "-");				// replace spaces with dashes
	name = name.toLowerCase();							// change to all lower case
	name = name.replace (/[^-a-z0-9_]/g, "");		// keep only dash, underscore, letters and numbers
	name = name.replace (/\-+/g, '-');				// remove duplicate dashes
	name = name.replace (/^\-+|\-+$/g, "");    	// trim leading and trailing dashes
	return name;
}

// ----------------------------------------------------------------
// ----------------------------------------------------------------

function writeTokenToCache (dataAr)
{
	const path = 'md99_data.txt';

	const jsonStr = JSON.stringify (dataAr);
	fs.writeFile (path, jsonStr, function (err) {
        if (err) {
            console.log("Error writing token data to file: " + err);
				return
        }
        //console.log("The file was saved!");
    });	
}

function readTokenFromCache ()
{
	const path = 'md99_data.txt';

	if (! fs.existsSync (path)) {
		//console.log("Error when reading token data from file: File doesn't exist");
		return {success: false};
	}

	let jsonStr;
	try {
		jsonStr = fs.readFileSync (path, 'utf8');
		//console.log("Got token data from file(inner): " + jsonStr);
	}catch (err) {
		console.log("Error when reading token data from file");
		return {success: false};
	}

	if (jsonStr.length == 0) {
		return {success: false};
	}
	
	let jsonObj;
	try {
		jsonObj = JSON.parse (jsonStr);
	}catch {
		console.log("Error when reading token data from file: Bad JSON format");
		return {success: false};
	}

	if (! jsonObj.hasOwnProperty ('expires')) {
		console.log("Error when reading token data from file: expires property does not exist");
		return {success: false};
	}
	const curTime = Date.now() / 1000;
	if (curTime > jsonObj.expires) {
		//console.log ("Token has expired");
		return {success: false};
	}

	//console.log("Found the TOKEN!!!");
	jsonObj.success = true;
	return jsonObj;
}