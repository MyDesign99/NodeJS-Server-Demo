// ----------------------------------------------------------------
//		IMPORTS
// ----------------------------------------------------------------
const Url	  = require('node:url');
const MD99Auth= require ('./sdk/src/md99-auth/md99-auth');
const Data	  = require ('./data');

// ----------------------------------------------------------------
//		CONSTANTS
// ----------------------------------------------------------------
const publicKey = "";
const secretKey = "";

// ----------------------------------------------------------------
//		EXPORTABLES
// ----------------------------------------------------------------
exports.singleImageUrl = singleImageUrl;
exports.personalImageUrl = personalImageUrl;
exports.studentUrlArray = studentUrlArray;
exports.isUrlMatch = isUrlMatch;

// ----------------------------------------------------------------
//		TOP-LEVEL ENTRY POINTS
// ----------------------------------------------------------------

function singleImageUrl (postParams, urlCallback)			// callback format (url)
{
	postObj = processPostParams (postParams);
	const missingParam = findMissingParam (postObj, ["value", "asset_name"]);
	if (missingParam != null) {
		console.log (missingParam);
		urlCallback (MD99Auth.errorImageURL ());
		return;
	}

	MD99Auth.getMD99AuthToken (publicKey, secretKey, 
		function (success, token, errMsg) {
			if (! success) {
				console.log (errMsg);
				urlCallback (MD99Auth.errorImageURL ());
				return;
			}
			const url = MD99Auth.createImageURL (publicKey, token, postObj.value, postObj.asset_name);
			urlCallback (url);
			return;
		}
	);
}


function personalImageUrl (postParams, urlCallback)			// callback format (url)
{
	postObj = processPostParams (postParams);
	const missingParam = findMissingParam (postObj, ["user_name"]);
	if (missingParam != null) {
		console.log (missingParam);
		urlCallback (MD99Auth.errorImageURL ());
		return;
	}

	const assetName = "radial-simple";
//	const assetName = "Student Score";
	const localValue = Data.getPersonalScore (postObj['user_name']);
	
	MD99Auth.getMD99AuthToken (publicKey, secretKey, 
		function (success, token, errMsg) {
			if (! success) {
				console.log (errMsg);
				urlCallback (MD99Auth.errorImageURL ());
				return;
			}
			const url = MD99Auth.createImageURL (publicKey, token, localValue, assetName);
			urlCallback (url);
			return;
		}
	);
}


function studentUrlArray (postParams, urlCallback)			// callback format (imageArrays)
{
	postObj = processPostParams (postParams);
	const missingParam = findMissingParam (postObj, ["student_id"]);
	if (missingParam != null) {
		console.log (missingParam);
		urlCallback (MD99Auth.errorImageURL ());
		return;
	}

	const studentScores = Data.getStudentScores (postObj ['student_id']);

	MD99Auth.getMD99AuthToken (publicKey, secretKey, 
		function (success, token, errMsg) {
			if (! success) {
				console.log (errMsg);
				urlCallback (MD99Auth.errorImageURL ());
				return;
			}
			const fullAr  = studentImages (publicKey, token, studentScores);
			const fullObj = {image_data: fullAr};
			urlCallback (fullObj);
			return;
		}
	);
}

// ----------------------------------------------------------------

function studentImages (publicKey, token, scoresAr)
{
	var retAr = [];
	for (let key in scoresAr) {
		const score = scoresAr[key];
		const tag1  = key + "1";
		const tag2  = key + "2";
		const cName = Data.getCourseName (key);
		const rank  = Data.getCourseRank (key, score);
		const newRecord1 = courseScoreArray (publicKey, token, tag1, score, cName);
		const newRecord2 = courseScoreArray (publicKey, token, tag2, rank,  cName);
		retAr.push (newRecord1);
		retAr.push (newRecord2);
	}
	return retAr;
}

function courseScoreArray (publicKey, token, tag, score, courseName)
{
	var assetName = "unknown";
	switch (tag) {
		case "sp1":
		case "hist1":
		case "eng1":
		case "calc1":
		case "chem1":
		case "phys1":
			assetName = "Student Score";
			break;

		case "sp2":
		case "hist2":
		case "eng2":
		case "calc2":
		case "chem2":
		case "phys2":
			assetName = "Bar Percent";
			break;
	}

	const url = MD99Auth.createImageURL (publicKey, token, score, assetName);
	return {img_id: tag, score: score, url: url, course_name: courseName};
}


// ----------------------------------------------------------------
//		UTILITIES
// ----------------------------------------------------------------

function processPostParams (postParams)
{
	const decodedData = decodeURIComponent (postParams);
	
	var postObj = {dummy_param: 123};
	try {
		postObj = JSON.parse (decodedData);
	}
	catch (err) {
	}
	return postObj;
}


function findMissingParam (inputObj, paramNameAr)
{
	for (var i1 = 0; i1 < paramNameAr.length; i1++) {
		const paramName = paramNameAr[i1];
   	if (! inputObj.hasOwnProperty (paramName)) {
			return ("Missing param: " + paramName);
		}
	}
   return null;
}


function isUrlMatch (request, myPath)
{
	const pathOnly = Url.parse (request.url).pathname;
	
	var path1 = pathOnly.toLowerCase();
	var path2 = myPath.toLowerCase();
	
	path1 = stripBegEndSlash (path1);
	path2 = stripBegEndSlash (path2);

	return (path1 == path2);
}


function stripBegEndSlash (srcStr)
{
	if (srcStr.substr (0,1) == "/") {
		srcStr = srcStr.substr (1);
	}
	if (srcStr.substr (srcStr.length - 1) == "/") {
		srcStr = srcStr.substr (0, srcStr.length - 1);
	}
	return srcStr;
}


