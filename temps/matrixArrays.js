var sequenty = require ('sequenty');

var word;			// just an example
var len;
var splitStr;

var returnValues = { returnArrays: [] };

var flags = [];					// 1 or 0, if the cell is empty or not
var charInPlace = [];			// the char in this place (if there is one)
var splitStr = [];				// the string split to chars
var trueVector = [];			// save the assignment so we'll know what is the right answer
var trueVectorIndex = 0, splitStrIndex = 0;
var randomLoc, nextLoc, prevLoc;

var letters = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];


function setupWord(wordToMatrix){

	word = wordToMatrix;
	console.log(word);	
	len = word.length;
	splitStr = word.split("");
}


function init (){

	for (var i = 0; i < 16; i++){ 
		charInPlace[i] = '*'; 			
		flags[i] = 0;
	}	

	prevLoc = (Math.floor(Math.random() * 16)); // start by placing the first char in this random place
	charInPlace[prevLoc] = splitStr[splitStrIndex];
	flags[prevLoc] = 1;
	splitStrIndex++;
	trueVector[trueVectorIndex] = prevLoc;
	trueVectorIndex++;
}


function chooseRandomLoc(){

	console.log(prevLoc);
	console.log(randomLoc);
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


function assignChars (){
	while(splitStrIndex != len){

	console.log("assignChars");

		chooseRandomLoc();

		if (randomLoc == 0) nextLoc = prevLoc - 5;
		else if (randomLoc == 1) nextLoc = prevLoc - 4;
		else if (randomLoc == 2) nextLoc = prevLoc - 3;
		else if (randomLoc == 3) nextLoc = prevLoc + 1;
		else if (randomLoc == 4) nextLoc = prevLoc + 5;
		else if (randomLoc == 5) nextLoc = prevLoc + 4;
		else if (randomLoc == 6) nextLoc = prevLoc + 3;
		else if (randomLoc == 7) nextLoc = prevLoc - 1;

		if ((flags[nextLoc] != 1) && (nextLoc > -1)	&& (nextLoc < 16)){

			console.log("blaaaaa");

			charInPlace[nextLoc] = splitStr[splitStrIndex];
			splitStrIndex++;
			flags[nextLoc] = 1;
			trueVector[trueVectorIndex] = nextLoc;
			trueVectorIndex++;
			prevLoc = nextLoc;
		}
		// else - add here if there was no free spaces to place chars
	}

}


function chooseRandom (){

		console.log("chooseRandom");

	for (var i = 0; i < 16; i++)
	{
		if (flags[i] == 0){
			charInPlace[i] = letters[Math.floor(Math.random() * 26)];
			flags[i] = 1;
		}
	}

}


function printArray (){

	console.log("printArray");

	var index = 0;

	console.log("\nWord is: " + word + "\n");

	for (var i = 0; i < 4; i++){			// print array 4X4
	
		for (var j = 0; j < 4; j++){
			process.stdout.write(charInPlace[index] + "    ");
			index++;
		}
		console.log("\n");
	}

}


function printFlagsArray (){

	console.log("printFlagsArray");

	var index = 0;				
	console.log("\n");

	for (var i = 0; i < 4; i++)			// print array 4X4
	{
		for (var j = 0; j < 4; j++)
		{
			process.stdout.write(flags[index] + "   ");
			index++;
		}
		console.log("\n");
	}

}

exports.getMatrixArrays = function(wordToMatrix) {	

	console.log(word);

	setupWord(wordToMatrix);
	init();
	assignChars();
	printArray();
	chooseRandom();
	printArray();

	returnValues.returnArrays = [];

	for (var i in charInPlace) {
		returnValues.returnArrays.push({ 
			"matrix" : charInPlace[i],
        	"trueVector" : trueVector[i]
  		});
	}
	return returnValues;
};





