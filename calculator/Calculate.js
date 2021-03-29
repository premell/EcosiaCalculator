function calculate(num) {//The main calculator

	//Format the inputted number and make it look nice
	num=numformat(num)

	//displaynum is what will be seen by the user. This has to be set before all the technical "Math." stuff, 
	//but after the brackets has been put in place.
	displaynum = nicelook(num)


	//This is technical stuff and should not appear on the display, so it will be formatted after displaynum.
	//E should become "10^"
	num = num.replace(/([^\@\(\)\+\-\*\/\^p])E([0-9\.]+)/g, "$1*(10^$2)")
	num = num.replace(/E([0-9\.]*)/g, "(10^$1)")

	//puts "Math." before expressions for the javascript engine.
	num = num.replace(/(a?(sin|cos|tan)|abs|ln|log|PI|sqrt)/g, "Math.$1");

	//evaluating "!" and "^" since JavaScript cannot calculate them with normal methods.
	num = pow(num)
	num =factorial(num)

	//Inverse rad to deg	
	if (RadiansOn == 0) {
		num = num.replace(/(a?(sin\(|cos\(|tan\())((.*(\(.*\))*.*)(\)))/g, "$1(($3 * Math.PI / 180))")//"$1($3 * 180 / pi)")
	}
	//Inverse "log" and "ln" to javsacript convention, once again this is the last thing to do 
	//since we want to be able to distinguish between "ln" and "log" earlier.
	num = num.replace(/log/gi, "log10")
	num = num.replace(/ln/gi, "log")

	console.log("num before eval " + num)
	//finally evaluating the expression
	try {
		result = eval(num);
	} catch (e) {
		if (e instanceof SyntaxError|| e instanceof ReferenceError || e instanceof TypeError) {
			//In case of error, the result should be "NaN"
			AddToHistoryList(displaynum+"="+NaN);
			printHistory(displaynum+"=")
			return NaN
		} else {
			throw(e)
		}
	}

	try{
		result = parseFloat((result).toFixed(10))
	}catch(e){
		if(e instanceof TypeError){
			//In case of error, the result should be "NaN"
			AddToHistoryList(displaynum+"="+NaN);
			printHistory(displaynum+"=")
			return NaN
		}
	}
	//print it to the display
	printHistory(displaynum + "=")
	AddToHistoryList(displaynum+"="+result);

	return (result)
}