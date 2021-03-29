function calc_fac(p1) { 

//try to evaluate the expression before the "!"
	p1 = p1.substring(0, p1.length - 1)	
	try {
		p1 = eval(p1);
	} catch (e) {
		if (e instanceof SyntaxError|| e instanceof ReferenceError || e instanceof TypeError) {
			return NaN
		} else {
			throw(e)
		}
	}
	//This is how "!" for integers is calculated
	//Also I couldn't get negative numbers to work
	if (Number.isInteger(p1) && p1 >= 0) {
		var rval = 1;
		for (var i = 2; i <= p1; i++)
			rval = rval * i;
		return rval;
	//This is how "!" for decimals is calculated
	} else if (p1 >= 0) {
		var g = 7;
		var C = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
		var x = C[0];
		for (var i = 1; i < g + 2; i++)
			x += C[i] / (p1 + i);
		var t = p1 + g + 0.5;
		return Math.sqrt(2 * Math.PI) * Math.pow(t, (p1 + 0.5)) * Math.exp(-t) * x;
	} else {
		return NaN;
	}
	return NaN
}

function factorial(num){

	num = "@"+num+"@"

	numberoffactorials=(num.match(/\!/g) || []).length
    for(k=0;k<=numberoffactorials;k++){

		//get whats before and after the first "!"
		before = num.replace(/(.*?)\!.*/,"$1")
	
		//see how many characters to the left should be used to calculate the factorial
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
	
		//calculate the factorial on said characters
		//remember that double "\" have to be used with "new RegExp"
		num = num.replace(new RegExp("(.{" + beforecharacter + "}\\!)"),calc_fac)
		
		//this is so that in case of NaN, the outprinted number should still make sense
		if(/NaN/.test(num.replace(new RegExp("(.{" + beforecharacter + "}\\!)"),calc_fac))==false){
			num = num.replace(new RegExp("(.{" + beforecharacter + "}\\!)"),calc_fac)
		}
	}
	num=num.replace(/\@/g,"")
	return num
}