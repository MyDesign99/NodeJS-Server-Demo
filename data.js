// ----------------------------------------------------------------
//		EXPORTABLES
// ----------------------------------------------------------------
exports.getPersonalScore = getPersonalScore;
exports.getStudentScores = getStudentScores;
exports.getCourseName = getCourseName;
exports.getCourseRank = getCourseRank;

// ----------------------------------------------------------------

function getPersonalScore (userName)
{
   switch (userName.toLowerCase()) {
      case "betty" :
         return 90;
      case "billy" :
         return 50;
      case "john" :
         return 75;
   }

   return 0;
}

// ----------------------------------------------------------------

function getStudentScores (studentID)
{
	const idStr = studentID.toString();
	switch (idStr) {
		case "1" :
			return {sp: 90, hist: 91, eng: 92, calc: 87, chem: 88, phys: 89};
		case "2" :
			return {sp: 94, hist: 95, eng: 94, calc: 94, chem: 95, phys: 94};
		case "3" :
			return {sp: 80, hist: 75, eng: 69, calc: 62, chem: 71, phys: 65};
		case "4" :
			return {sp: 99, hist: 99, eng: 99, calc: 99, chem: 99, phys: 99};
		case "5" :
			return {sp: 40, hist: 45, eng: 49, calc: 32, chem: 31, phys: 35};
      case "6" :
			return {sp: 88, hist: 87, eng: 88, calc: 92, chem: 91, phys: 92};
		case "7" :
			return {sp: 77, hist: 77, eng: 77, calc: 78, chem: 78, phys: 78};
         
		case "8" :
			return {sp: 80, hist: 75, eng: 69, calc: 62, chem: 71, phys: 65};
		case "9" :
			return {sp: 72, hist: 69, eng: 70, calc: 39, chem: 42, phys: 38};
		case "10" :
			return {sp: 90, hist: 92, eng: 93, calc: 85, chem: 88, phys: 82};
		case "11" :
			return {sp: 78, hist: 76, eng: 74, calc: 71, chem: 74, phys: 69};
		case "12" :
			return {sp: 80, hist: 77, eng: 75, calc: 99, chem: 94, phys: 96};
		case "13" :
			return {sp: 99, hist: 94, eng: 96, calc: 71, chem: 73, phys: 68};
		case "14" :
			return {sp: 66, hist: 55, eng: 53, calc: 48, chem: 48, phys: 44};
		case "15" :
			return {sp: 77, hist: 88, eng: 85, calc: 91, chem: 85, phys: 82};
		case "16" :
			return {sp: 68, hist: 69, eng: 68, calc: 65, chem: 64, phys: 65};
		case "17" :
			return {sp: 88, hist: 87, eng: 85, calc: 92, chem: 93, phys: 90};
		case "18" :
			return {sp: 62, hist: 65, eng: 66, calc: 68, chem: 69, phys: 66};
		case "19" :
			return {sp: 92, hist: 75, eng: 74, calc: 71, chem: 92, phys: 73};
		case "20" :
			return {sp: 99, hist: 98, eng: 97, calc: 81, chem: 82, phys: 80};
		}
	return {sp:0, hist:0, eng:0, calc:0, chem:0, phys:0};
}

function getCourseName (tag)
{
	switch (tag) {
		case "sp":
      case "sp1":
      case "sp2":
			return "Spanish 3";
		case "hist":
      case "hist1":
      case "hist2":
         return "AP US Hist";
      case "eng":
      case "eng1":
      case "eng2":
			return "AP Literature";
      case "calc":
      case "calc1":
      case "calc2":
			return "AP Calc A";
      case "chem":
      case "chem1":
      case "chem2":
			return "AP Chemistry";
      case "phys":
      case "phys1":
      case "phys2":
			return "Physics 1";
	}
	return "Unknown Course";
}

function getRawRank (score)
{
	if (score <= 30) {
		return 5;
	}
	if (score <= 35) {
		return 10;
	}
	if (score <= 40) {
		return 15;
	}
	if (score <= 44) {
		return 20;
	}
	if (score <= 48) {
		return 25;
	}
	if (score <= 52) {
		return 30;
	}
	if (score <= 56) {
		return 35;
	}
	if (score <= 60) {
		return 40;
	}
	if (score <= 64) {
		return 45;
	}
	if (score <= 68) {
		return 50;
	}
	if (score <= 72) {
		return 55;
	}
	if (score <= 75) {
		return 60;
	}
	if (score <= 78) {
		return 65;
	}
	if (score <= 81) {
		return 70;
	}
	if (score <= 84) {
		return 75;
	}
	if (score <= 87) {
		return 80;
	}
	if (score <= 90) {
		return 85;
	}
	if (score <= 93) {
		return 90;
	}
	if (score <= 96) {
		return 95;
	}
	return 99;
}

function getCourseRank (tag, score)
{
	$offset = 0;
	switch (tag) {
		case "sp":
      case "sp1":
      case "sp2":
			$offset = 4;
			break;
		case "hist":
      case "hist1":
      case "hist2":
			$offset = 2;
			break;
      case "eng":
      case "eng1":
      case "eng2":
			$offset = 0;
			break;
      case "calc":
      case "calc1":
      case "calc2":
			$offset = -4;
			break;
      case "chem":
      case "chem1":
      case "chem2":
			$offset = -2;
			break;
      case "phys":
      case "phys1":
      case "phys2":
			$offset = -4;
			break;
	}
	return getRawRank (score - $offset);
}
