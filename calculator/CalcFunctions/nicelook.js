function nicelook(num){
    
	//this part is to make num look nicer

	//Add brackets around "/" so that 3/5*3 becomes (3/5)*3
	for(i=0; i < num.length; i++){
		var firstpart = num.substring(0, i);
		var secondpart = num.substring(i,num.length) 
		//I've realized that this is not the optimal way of doing this
		//Regexp rarely go well in for loops, instead one should calculate the "(" and the ")" until 
		//they match and thereby deduce that the brackets are closed
		
		
		
		//Readability of this is unfortunatly almost impossible, but I will break the expression up by parts:

		//  ([\+\-\*\/\!\@])  should start with operator (or beginning of expression in case of @)
		//  (.[^\(]*?(\(.*\))*[^\)]*?) then any amounts or closed brackets, but no open brackets so that the bracket continue
		//to after the divison sign "/". Also to disallow operators is to give the shortest match infront of "/"
		//   "\/"    then comes the actual division sign
		//	(\-?[^\(]*?(\(.*\))*[^\)]*?) then it is repeated for symmetri
		//	([\+\-\*\/\!\@])
		
		secondpart = secondpart.replace(/([\+\-\*\/\!\@])([^\(\+\-\*\/\!]*?(\(.*\))*[^\)\+\-\*\/\!]*?)\/(\-?[^\(\+\-\*\/\!]*?(\(.*\))*[^\)\+\-\*\/\!]*?)([\+\-\*\/\!\@])/g,"$1($2/$4)$6")

		//Remove double brackets for readabilitys sake
		secondpart = secondpart.replace(/\(\(([^\(\)]*?(\(.*\))*[^\)\(]*?)\)\)/g, "($1)")

		//add them back toghters
		num = firstpart+secondpart 
		//remove empty brackets in the beginning: (2+3)==>2+3
		num=num.replace(/^\@\((([^\(\)]*?(\(.*?\))*?[^\)\(]*?))\)\@$/,"$1")

	}
	num = num.replace(/\(\(([^\(\)]*?(\(.*\))*[^\)\(]*?)\)\)/g, "($1)")
	
	//Converting into unicode to look nicer
	num = num.replace(/PI/g, "\u03C0");
	num = num.replace(/(sqrt)/g, "\u221A") 
	num = num.replace(/exp/g, "e^")
	num = num.replace(/\*/gi, "\u00D7")


	//if its only one number in brackets, the brackets should be removed (3)--->3
	//this is a ugly fix, the [^a-z] makes sure "sin(3)" dosent turn into "sin3"
    num = num.replace(/([^a-z])\(([0-9\.\,])\)/g, "$1$2")
	num=num.replace(/\@/g,"")
    return num
}