function numformat(num){
    	
	num = "@"+num+"@"

	//this is to format the verious user inputs into javascript compatable data
	num = num.replace(/\s/g, "");
	num = num.replace(/=/, "");
	num = num.replace(/arc/gi, "a");
	num = num.replace(/cos(inus)?/gi, "cos")
	num = num.replace(/sin(us)?/gi, "sin")
	num = num.replace(/tan(gens)?/gi, "tan")
	num = num.replace(/(squareroot|sqrt|\u221A)/gi, "sqrt") 
	num = num.replace(/(pi|\u03C0)/gi, "PI");
	num = num.replace(/(\u00D7|x)/gi, "*")

    //the first coma or dot from the right should become a dot. so 1,500.00 will stay 1,500.00 but 1,5 will become 1.5
	num = num.replace(/([0-9\,\.]*)[\.\,]/g, "$1.");
	//after the "," is converted to ".", the other "," are unessesary and should be removed!
	num = num.replace(/\,/,"")


	


	//This will be unfortunately be very hard to read, but this section is made to format the input 
	//to mathematical rules. For instance adding brackets for priority rules

    //Adds multiplication sign: "2(sin(3))"=>"2*(sin(3))"
    //I dont seperate "2pi" or "4abs" from each other here since they should be considered as one number
    //otherwise you get "sin2pi" => "sin(2)*pi"
    num = num.replace(/([\)\.0-9]|Ans|PI)((\(|PI|Ans|a?(sin|cos|tan)|ln|log|exp|sqrt))/g, "$1*$2")
    // "sin(3)"=>"(sin(3))"
    //I dont think this one is needed anymore
	//num = num.replace(/((a?(sin|cos|tan)|exp|ln|log|sqrt)\((.*(\(.*\))*.*)(\)))/g, "\($1\)")
	//"sin2cos" => "sin(2)*cos"
	num = num.replace(/(a?(sin|cos|tan)|ln|log|abs|exp|PI|sqrt)(\-?([\.0-9]|PI|Ans)+?)(a?(sin|cos|tan)|ln|log|exp|sqrt)/g, "$1($3)*$5")
	//"sin(3)3"=> "sin(3)*3"
	num = num.replace(/((a?(sin|cos|tan)|abs|exp|PI|sqrt)\(.*\))([0-9pi])/g, "$1*$4")
	//"3!2" => "3!*2"
	num= num.replace(/\!([\.0-9]|PI|Ans)+/g, "!*$1")
	//"sin2"=>"sin(2)"
	num = num.replace(/(a?(sin|cos|tan)|abs|exp|sqrt|ln|sqrt|log)(\-?([0-9\.\,]|PI|ANS)+)/gi,"$1($3)")
    //"2--3"=>"2+3"
    num = num.replace(/\-\-/, "+")



	//match brackets: "sin(2+3" => "sin(2+3)"
	var left = (num.match(/\(/g) || []).length; //left brackets (
	var right = (num.match(/\)/g) || []).length; //right brackets )
    num = num + ")".repeat(left - right)


    return num
}