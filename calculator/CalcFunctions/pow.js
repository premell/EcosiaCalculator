function pow(num){

	num = "@"+num+"@"

    numberofpowers=(num.match(/\^/g) || []).length
	for(k=0;k<=numberofpowers;k++){

		//get whats before and after the first "^"
		before = num.replace(/(.*?)\^.*/,"$1")
		after = num.replace(/.*?\^(.*)/,"$1")

		//I have to add these everytime because "Math.pow" scrambles the order
		before="@"+before
		after=after+"@"

		//see how many characters to the right and to the left should be used in the power
		c=0
		brackets=0
		for(i in before){
			if(before.charAt(before.length-i-1)==")"){
				brackets++
				c++
			}
			if(before[before.length-i]=="("){
				brackets=brackets-1
			}
			if(brackets<=0){
				beforecharacter=i
				//c is 0 when no brackets have been detected, then it should go until the next operator
				//otherwise "2^12+2", would only get the "2^1"
				if(c==0){
					numbersbefore=before.replace(/.*?(\-?[^\-\+\/\^\*\@\)\(\,]*)$/,"$1")
					beforecharacter=numbersbefore.length
				}
				break
			}
		}
		c=0
		brackets=0
		for(i in after){
			if(after[i]=="("){
				brackets++ 
				c++
			}
			if(after[i]==")"){
				brackets=brackets-1
			}
			if(brackets<=0){
				aftercharacter=i
				//c is 0 when no brackets have been detected, then it should go until the next operator
				//otherwise "2^12+2", would only get the "2^1"
				if(c==0){
					numbersafter=after.replace(/^(\-?[^\-\+\/\*\@\,]*).*/,"$1")
					aftercharacter=numbersafter.length
				}
				break
			}
		}
		//replaces the characters after and before the "^" and puts them into the "Math.pow"
		//remember that double "\" have to be used with "new RegExp"
		num = num.replace(new RegExp("(.{" + beforecharacter + "})\\^(.{" + aftercharacter + "})"),"(Math.pow($1,$2))")		
	}
	//This is because I had problems using "e^" multiple times in a row
	num=num.replace(/Math\.pow\(e\,/gi,"Math.exp(")

	num=num.replace(/\@/g,"")
    return num
}
