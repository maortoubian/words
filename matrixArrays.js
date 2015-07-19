var sequenty = require ('sequenty');

var returnValues = { returnArrays: [] };
var flags = [];					// 1 or 0, if the cell is empty or not
var charInPlace = [];			// the char in this place (if there is one)
var splitStr = [];				// the string split to chars
var trueVector = [];			// save the assignment so we'll know what is the right answer
var letters = ['A','B','C','D','E','F','G','H','I',
 				'J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
var randomLoc, nextLoc, prevLoc;
var word, len, splitStr;
var trueVectorIndex = 0, splitStrIndex = 0;
var errorsCounter = 0;


//converting the word to uppercase and saving the len
function setupWord (wordToMatrix) {
	trueVectorIndex = 0, splitStrIndex = 0;
	trueVector = [];

	word = wordToMatrix.toUpperCase();	

	len = word.length;
	splitStr = word.split("");
}

// start by placing the first char in this random place
function init (cb){
	for (var i = 0; i < 16; i++)		
	{ 
		charInPlace[i] = '*'; 			
		flags[i] = 0;
	}				
	prevLoc = (Math.floor(Math.random() * 16)); 
	charInPlace[prevLoc] = splitStr[splitStrIndex];
	flags[prevLoc] = 1;
	splitStrIndex++;
	trueVector[trueVectorIndex] = prevLoc;
	trueVectorIndex++;
	cb(); 
}


 // when choosing a cell, in which places we can put letter
function chooseRandomLoc(){
	var tempArr;

	if ((prevLoc == 5) || (prevLoc == 6) || (prevLoc == 9) || (prevLoc == 10)){
		randomLoc = Math.floor(Math.random() * 9);
	}

	else if ((prevLoc == 1) || (prevLoc == 2)){
		tempArr =[3,4,5,6,7];
		randomLoc = tempArr[Math.floor(Math.random() * 5)];
	}

	else if ((prevLoc == 13) || (prevLoc == 14)){
		tempArr =[0,1,2,3,7];
		randomLoc = tempArr[Math.floor(Math.random() * 5)];
	}

	else if ((prevLoc == 4) || (prevLoc == 8)){
		tempArr =[1,2,3,4,5];
		randomLoc = tempArr[Math.floor(Math.random() * 5)];
	}

	else if ((prevLoc == 7) || (prevLoc == 11)){
		tempArr =[0,1,5,6,7];
		randomLoc = tempArr[Math.floor(Math.random() * 5)];	
	}

	else if (prevLoc == 0){
		tempArr =[3,4,5];
		randomLoc = tempArr[Math.floor(Math.random() * 3)];		
	}

	else if (prevLoc == 3){
		tempArr =[5,6,7];
		randomLoc = tempArr[Math.floor(Math.random() * 3)];		
	}

	else if (prevLoc == 15){
		tempArr =[0,1,7];
		randomLoc = tempArr[Math.floor(Math.random() * 3)];	
	}

	else if (prevLoc == 12){
		tempArr =[1,2,3];
		randomLoc = tempArr[Math.floor(Math.random() * 3)];	
	}		
}

//assigning the letters in the matrix randomly
function assignChars (cb){
	while(splitStrIndex != len){
		chooseRandomLoc();

		if (randomLoc == 0) nextLoc = prevLoc - 5;
		else if (randomLoc == 1) nextLoc = prevLoc - 4;
		else if (randomLoc == 2) nextLoc = prevLoc - 3;
		else if (randomLoc == 3) nextLoc = prevLoc + 1;
		else if (randomLoc == 4) nextLoc = prevLoc + 5;
		else if (randomLoc == 5) nextLoc = prevLoc + 4;
		else if (randomLoc == 6) nextLoc = prevLoc + 3;
		else if (randomLoc == 7) nextLoc = prevLoc - 1;

		// if it's stuck, we'll start again instead of getting a neverending loop
		if (flags[nextLoc] == 1) {	
			errorsCounter++;

			if (errorsCounter > 40) {
				errorsCounter = 0;
				setupWord(word);
				sequenty.run([init, assignChars, chooseRandom]);
			}
		}


		if ((flags[nextLoc] != 1) && (nextLoc > -1)	&& (nextLoc < 16)){
			charInPlace[nextLoc] = splitStr[splitStrIndex];
			splitStrIndex++;
			flags[nextLoc] = 1;
			trueVector[trueVectorIndex] = nextLoc;
			trueVectorIndex++;
			prevLoc = nextLoc;
		}
	}
	errorsCounter = 0;	// initiize the error check 
	cb();
}

// put random letter in the empty places
function chooseRandom (cb) {
	for (var i = 0; i < 16; i++){
		if (flags[i] == 0){
			charInPlace[i] = letters[Math.floor(Math.random() * 26)];
			flags[i] = 1;
		}
	}
	cb();
}

//returning the matrix ready element
exports.getMatrixArrays = function(wordToMatrix) {	
	setupWord(wordToMatrix);
	sequenty.run([init, assignChars, chooseRandom]);

	returnValues.returnArrays = [];

	for (var i in charInPlace) {
		returnValues.returnArrays.push({ 
			"matrix" : charInPlace[i],
        	"trueVector" : trueVector[i]
  		});
	}
	return returnValues;
};


