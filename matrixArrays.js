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



function setupWord (wordToMatrix) 
{
	trueVectorIndex = 0, splitStrIndex = 0;
	trueVector = [];

	word = wordToMatrix.toUpperCase();	

	len = word.length;
	splitStr = word.split("");
}


function init (cb)
{
	for (var i = 0; i < 16; i++)		
	{ 
		charInPlace[i] = '*'; 			
		flags[i] = 0;
	}				
	prevLoc = (Math.floor(Math.random() * 16)); // start by placing the first char in this random place
	charInPlace[prevLoc] = splitStr[splitStrIndex];
	flags[prevLoc] = 1;
	splitStrIndex++;
	trueVector[trueVectorIndex] = prevLoc;
	trueVectorIndex++;
	cb(); 
}


 // when choosing a cell, in which places we can put letter
function chooseRandomLoc()
{
	var tempArr;

	if ((prevLoc == 5) || (prevLoc == 6) || (prevLoc == 9) || (prevLoc == 10))
	{
		randomLoc = Math.floor(Math.random() * 9);
	}

	else if ((prevLoc == 1) || (prevLoc == 2))
	{
		tempArr =[3,4,5,6,7];
		randomLoc = tempArr[Math.floor(Math.random() * 5)];
	}

	else if ((prevLoc == 13) || (prevLoc == 14))
	{
		tempArr =[0,1,2,3,7];
		randomLoc = tempArr[Math.floor(Math.random() * 5)];
	}

	else if ((prevLoc == 4) || (prevLoc == 8))
	{
		tempArr =[1,2,3,4,5];
		randomLoc = tempArr[Math.floor(Math.random() * 5)];
	}

	else if ((prevLoc == 7) || (prevLoc == 11))
	{
		tempArr =[0,1,5,6,7];
		randomLoc = tempArr[Math.floor(Math.random() * 5)];	
	}

	else if (prevLoc == 0)
	{
		tempArr =[3,4,5];
		randomLoc = tempArr[Math.floor(Math.random() * 3)];		
	}

	else if (prevLoc == 3)
	{
		tempArr =[5,6,7];
		randomLoc = tempArr[Math.floor(Math.random() * 3)];		
	}

	else if (prevLoc == 15)
	{
		tempArr =[0,1,7];
		randomLoc = tempArr[Math.floor(Math.random() * 3)];	
	}

	else if (prevLoc == 12)
	{
		tempArr =[1,2,3];
		randomLoc = tempArr[Math.floor(Math.random() * 3)];	
	}		
}


function assignChars (cb)
{
	while(splitStrIndex != len)
	{
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
				sequenty.run([init, assignChars, printArray, chooseRandom]);
			}
		}


		if ((flags[nextLoc] != 1) && (nextLoc > -1)	&& (nextLoc < 16))
		{
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


function chooseRandom (cb) // put random letter in the empty places
{
	for (var i = 0; i < 16; i++)
	{
		if (flags[i] == 0)
		{
			charInPlace[i] = letters[Math.floor(Math.random() * 26)];
			flags[i] = 1;
		}
	}
	cb();
}


function printArray (cb)
{
	var index = 0;					
	console.log("\nWord is: " + word + "\n");

	for (var i = 0; i < 4; i++)			// print array 4X4
	{
		for (var j = 0; j < 4; j++)
		{
			process.stdout.write(charInPlace[index] + "    ");
			index++;
		}
		console.log("\n");
	}
	cb();
}



exports.getMatrixArrays = function(wordToMatrix) {	
	setupWord(wordToMatrix);
	sequenty.run([init, assignChars, printArray, chooseRandom]);

	returnValues.returnArrays = [];

	for (var i in charInPlace) {
		returnValues.returnArrays.push({ 
			"matrix" : charInPlace[i],
        	"trueVector" : trueVector[i]
  		});
	}
	return returnValues;
};


