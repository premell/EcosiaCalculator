//When typing in the input window
$("#output-value").on("keydown", function (e) {

	//get selected text
	selection=[document.getSelection().anchorOffset,document.getSelection().focusOffset]
	if(selection[0]>selection[1]){
		k=selection[0]
		selection[0]=selection[1]
		selection[1]=k
	}
	output = getOutput();
	char = e.key;
	caret = get_caret_position();

	
	//"sin(", "(" or a random charcter is all considered the "holeword" that should either be skipped over if you use the arrows, 
	//delete or backspace
	holeword = /(a?(sin\(?|cos\(?|tan\(?)|abs\(?|NaN|Ans|exp\(?|pi|ln\(?|sqrt\(?|log\(?)$/
	holewordtoright = /^((a?(sin\(?|cos\(?|tan\(?)|NaN|Ans|abs\(?|exp\(?|pi|sqrt\(?|ln\(?|sqrt\(?|log\(?))/ //[0-9\.\-\+\/\*\x\^\/\)\(\%\!] replaced by ., check how this works

	firstpart = output.substring(0, caret);
	secondpart = output.substring(caret, output.length)


	//keys that should always be allowed, notice any combination of "control" + "other key" is allowed 
	//I don't remember why "AddToHistoryList()" is here, can probably remove it
	if ((e.metaKey || e.ctrlKey && (e.key != "Control" | e.key != "AddToHistoryList()")) || /(Shift|Caps|Tab|Windows|Alt|F[0-9]+)/.test(e.key)) { 
		return true
	} if (char == "Enter") {
		//If last enter was enter or +,-,* etc, ignore enter
		if (ChangeAns == 1 || (/([\-\+\/\*\x\^\/\%])$/.test(output))) { 
			return false;
		}
		result = calculate(output);
		//in case of error
		if (/NaN/.test(result)) {
			printOutput(NaN)
			set_mouse(3)
			Ans=0
			ChangeAns = 1;
			return false
		}
		printOutput(result);
		set_mouse(result.toString().length)
		ChangeAns = 1;
		return false
	} else if (char == "Backspace") {
		//if text is selected, remove it
		if (window.getSelection() != "") {
			return true;
		}else{
			sinuscheck = /(a?(sin|cos|tan)|abs|exp|sqrt|ln|sqrt|log)?\($/
			// this is to remove the lone bracket on right side. "sin(3+3)"-->"3+3". Removes both brackets
			if (sinuscheck.test(firstpart)) {
				caretBefore = caret;
				//this dosent work properly
				RemoveComplete = /^((.*(\(.*\))*.*))(\))/
				secondpart = secondpart.replace(RemoveComplete, "$1")
				set_mouse(caretBefore)
			}
			if(holeword.test(firstpart)){
				//you want to remove entire sin() expression
				replaced = firstpart.replace(holeword, "") 
			}else{
				//you want to remove entire sin() expression
				replaced = firstpart.replace(/.$/, "") 
			}
			output = replaced + secondpart
			printOutput(output);
			set_mouse(caret + replaced.length - firstpart.length)
			return false;
		}
	}
	//Deletes sin etc completely if they are infront
	else if (char == "Delete") {
		//Remove selected text
		if (window.getSelection() != "") {
			return true;
		}else{

			//checks if there are brackets or sin expressions to the right of the caret
			sinuscheck = /^(a?(sin\(|cos\(|tan\()|abs\(|exp\(|sqrt\(|ln\(|sqrt\(|log\()/
			var RemoveComplete = /^.*?\(((.*?(\(.*?\))*?.*?))(\))/

			if (sinuscheck.test(secondpart)) {
				if (/^[^\)]*$/.test(secondpart)) { //Pseudo solution
					RemoveComplete = /^.*?\(((.*?(\(.*?\))*?.*?))(\))*/
				}
				var caretBefore = caret;
				var secondpart = secondpart.replace(RemoveComplete, "$1")
				output = firstpart + secondpart
				printOutput(output);
				set_mouse(caretBefore)
				return false
			//remove brackets "(3+3)"->"3+3"
			}else if (RemoveComplete.test(secondpart)){
				var caretBefore = caret;
				var secondpart = secondpart.replace(RemoveComplete, "$1")
				output = firstpart + secondpart
				printOutput(output);
				set_mouse(caretBefore)
				return false
			}
			return true;
		}
	}


	//if text is selected and any of these are chosen, the brackets should be put around the targeted text
	//and the text should be reselected
	if(/^[sctlg\(\)]$/i.test(char) && selection[0]-selection[1]!=0){
		//you should be able to do the same with a right bracket, but in this case, it has to be treated as a left bracket
		char = char.replace(/^\)$/i, "(")

		char = char.replace(/^s$/i, "sin(")
		char = char.replace(/^c$/i, "cos(")
		char = char.replace(/^t$/i, "tan(")
		char = char.replace(/^e$/i, "e^")
		char = char.replace(/^l$/i, "ln(")
		char = char.replace(/^g$/i, "log(")
		char = char.replace(/^a$/i, "Ans")
		char = char.replace(/^p$/i, "\u03C0")

		//puts brackets around the selected text and reselects it
		output= output.slice(0,selection[0]) + char + output.slice(selection[0],selection[1]) + ")" + output.slice(selection[1],output.length)
		printOutput(output)

		newselection = document.getSelection();
		node=document.getElementById("output-value")
		let range = document.createRange();

		//I havent decided yet if the etc "sin" should be selected aswell or only the numbers
		range.setStart(node.firstChild, selection[0]+char.length-1);
		range.setEnd(node.firstChild, selection[1]+char.length+1);
		
		newselection.removeAllRanges();          
		newselection.addRange(range);

		return false
	}else{
		output= output.slice(0,selection[0]) + output.slice(selection[1],output.length)
	}

	//If an operator is typed
	if (/([\-\+\,\/\*\x\^\/\)\(\%\!E])+$/.test(char)) {

		//removes the selected text, however if you click "(", it should put brackets around the entire expression
		
		 firstpart = output.substring(0, caret);
		 secondpart = output.substring(caret, output.length)
	
		//char = char.replace(/\,/g,".")

		
		//if there is a ")" to the right and you write ")", it should simply skip over it instead of printing out a new one
		if(/^\)/.test(secondpart) && /\)/.test(char)){
			set_mouse(caret+1)
			return false
		}
		//This is for when people type "exp", prohibiting the "x" makes this "e^pi" instead of "expi". its a nicer type experience,
		//like "i" is prohibited so if someone types "pi" it becomes "pi" instead of "pii" (this problem comes from our autocomplete e=>e^)
		if(/e\^$/.test(firstpart) && char=="x"){
			return false
		}
		//there should never be more ")" than "("
		if(/\)/.test(char) && ((firstpart.match(/\)/g) || []).length>=(firstpart.match(/\(/g) || []).length)){
			return false
		}

		if(/[E\+\-\!\*\/\^\%\u00D7][\-]$/.test(firstpart)){
			return false
		}
		//If last entry was ( you cannot use an operator, (+ is invalid. Similarly if you want to write ) the last entry cannot be an operator. +) is invalid
		//also added E, E*3 is invalid.
		else if(/[\+\*\/\^\!\%\x]/.test(char) && /[\(E]$/.test(firstpart) || /[\)]/.test(char) && /[\+\!\*\/\^\%\x\u00D7]$/.test(firstpart)){ 
			return false
		}
		//cannot use these operators to start the expression
		if(output=="" && /^[\+\*\/\x\^\%\!\)]$/.test(char)){
			return false
		}
		//checks if you were about to write 2 operators in a row, and replaces the first one instead, so instead of +^ it replaces "+" with "^"
		//Also *- is valid, so in that case the "-" shouldn't be replaced.
		else if(/[\+\!\*\/\^\%\x]/.test(char) && /[\+\-\*\/\^\%\x\u00D7]$/.test(firstpart)){
			//this looks better
			if(/[\*\x]/.test(char)){
				char="\u00D7"
			}
			firstpart = firstpart.replace(/.$/,char)
			output = firstpart + secondpart;
			printOutput(output)
			set_mouse(firstpart.length)
			return false
		}

		if (ChangeAns == 1) {
			printHistory("Ans = " + result);
			ChangeAns = 0;
			Ans = result
			if(/[\*\x]/.test(char)){
				firstpart = firstpart + "\u00D7"
				output = firstpart + secondpart;
				printOutput(output)
				set_mouse(firstpart.length)
				return false
			}
			//if you write "(", both brackets should be placed
			if(char=="("){
				firstpart = firstpart + "()"
				output = firstpart + secondpart;
				printOutput(output)
				set_mouse(firstpart.length-1)
				return false
			}

			return true
		}
		if(/[\*\x]/.test(char)){
			firstpart = firstpart + "\u00D7"
			output = firstpart + secondpart;
			printOutput(output)
			set_mouse(firstpart.length)
			return false
		}
		//For some reason the input isnt triggered if output is empty. However we still have to fix it because
		//you shouldnt be able to start an expression with *, + etc

		if(/[\-E\(]/.test(char) && output==null){
			output=char
			printOutput(output);
			set_mouse(1)
			return false 
		}
		//this inserts a multiplication sign if you write "(" after certain symbols. 
		//etc "(3+3)(" --> "(3+3)*(" when typing
		//I think i need Dead to be zero for this to work, the interaction with "^" is strange
		if(/(\u03C0|[es\)])$/.test(firstpart) && Dead==0 && char=="("){
			firstpart = firstpart + "\u00D7()"
			output = firstpart + secondpart;
			printOutput(output)
			set_mouse(firstpart.length-1)
			return false
		}
		if(char=="("){
			firstpart = firstpart + "()"
			output = firstpart + secondpart;
			printOutput(output)
			set_mouse(firstpart.length-1)
			return false
		}
		return true
	//Dead has very complicated interactions since we replace characters rather then write them. But there is no way that i am aware of
	//that stops an input from dead of being typed so i have to make this very convoluted solution to check if "Dead" has been activated.
	}else if(char=="Dead"){
		Dead=1;
		return true
	}
	if (/^(ArrowLeft)$/.test(char)) {
		found = firstpart.match(holeword)
		set_mouse(found.index)

		return false;

	} else if (/^(ArrowRight)$/.test(char)) {
		//jump one step by default, unless there is an mathematical expression, in which case jump over the expression
		if(holewordtoright.test(secondpart)){
			found = secondpart.match(holewordtoright)
		}else{
			found = secondpart.match(/./)
		}
		set_mouse((firstpart.length + found[0].length))
		return false;

	/*I'm trying to make "Shift"+"Arrow Key" work, ignore this
	if (/^(ArrowLeft)$/.test(char)) {
			if(e.shiftKey==true){
				if(caret==0){
					return false
				}
				output=getOutput()
				step=1
				newselection = document.getSelection();
	
				node=document.getElementById("output-value")
				let range = document.createRange();
	
				if(holeword.test(firstpart)){
					step = firstpart.match(holeword).length
					if(/\($/.test(firstpart)){
						step=step+1
					}
				}
				range.setStart(node.firstChild, selection[0]-step);
				range.setEnd(node.firstChild, selection[1]);
				
				newselection.removeAllRanges();          
				newselection.addRange(range);
			}else{
				found = firstpart.match(holeword)
				set_mouse(found.index)
			}
			return false;

	}else if (/^(ArrowRight)$/.test(char)) {
		if(e.shiftKey==true){
			output=getOutput()
			step=1
			newselection = document.getSelection();

			node=document.getElementById("output-value")
			let range = document.createRange();

			if(holewordtoright.test(output.substring(selection[1]))){
				step = output.substring(selection[1]).match(holewordtoright).length
			}
			range.setStart(node.firstChild, selection[0]);
			range.setEnd(node.firstChild, selection[1]+step);
			
			newselection.removeAllRanges();          
			newselection.addRange(range);

		}else{
			//jump one step by default, unless there is an mathematical expression, in which case jump over the expression
			if(holewordtoright.test(secondpart)){
				found = secondpart.match(holewordtoright)
			}else{
				found = secondpart.match(/./)
			}
			set_mouse((firstpart.length + found[0].length))
		}
		return false;
	*/
	}else if(/^(ArrowUp)$/.test(char)){
		set_mouse(output.length)
	}else if(/^(ArrowDown)$/.test(char)){
		set_mouse(0)
	//If a number or expression is typed
	}else if (/^[sctelgap0-9\.]$/.test(char)) {
		//removes the selected text
		output= output.slice(0,selection[0]) + output.slice(selection[1],output.length)
		firstpart = output.substring(0, caret);
		secondpart = output.substring(caret, output.length)
		
		if (ChangeAns == 1 && Dead!=1) {
			printHistory("Ans = " + result);
			ChangeAns = 0;
			Ans = result
			output = "";
			firstpart = "";
			secondpart = "";
			printOutput(output);
		}

		//you shouldnt be able to write multiple "0" without another number in front
		if(char=="0" && /[\+\*\/\^\!\%\x]0+$/.test(firstpart) || char=="0" && /^0+$/.test(firstpart)){
			return false
		}
		//instead of writting "01" it should replace the "0" with the "1"
		if(/[0-9]/.test(char) && /[\+\*\/\^\!\%\x]0$/.test(firstpart) || /[0-9]/.test(char) && /^0$/.test(firstpart)){
			firstpart=firstpart.replace(/.$/,"")
		}
		char = char.replace(/^s$/i, "sin()")
		char = char.replace(/^c$/i, "cos()")
		char = char.replace(/^t$/i, "tan()")
		char = char.replace(/^e$/i, "e^")
		char = char.replace(/^l$/i, "ln()")
		char = char.replace(/^g$/i, "log()")
		char = char.replace(/^a$/i, "Ans")
		char = char.replace(/^p$/i, "\u03C0")

		//this creates a multiplication sign "*" after "pi" or ")"
		//Dead must be 0 because it creates strange interactions with "^"
		if(/(\u03C0|[es\)])$/.test(firstpart) && Dead==0){
			char = "\u00D7"+char
		}

		if(Dead==1){
			output = firstpart +"^"+ char + secondpart
		}else{
			output = firstpart + char + secondpart
		}
		//Remove the last bracket to put the mouse inside of it when using char.length 
		//(cannot just take -1 since not all chars has brackets)
		char = char.replace(/(.*)\)/, "$1") 

		printOutput(output);
		set_mouse(firstpart.length + char.length)
			return false
	}else {
		return false
	}

})

//This is a super ugly fix to the strange behavior of "^"
$("#output-value").on('input', function() {
	output = getOutput();
	caret = get_caret_position();

	if(output.substring(caret-1, caret)=="^"){
		Dead=0
	}
//This removes the last character written if "^" is used. This is because for example "s" gets transformed into "sin()".
//normally you just put return input false to cancel the original "s" and instead print "sin()".
//However the "^" makes you unable to cancel the ouput so you have to manually remove the last character written
	else if(Dead==1){
		//firstpart except last number
		firstpartminus = output.substring(0, caret-1);
		secondpart = output.substring(caret, output.length)

		output= firstpartminus+secondpart	

		//im not sure if its right to always put ChangeAns to 0 
		ChangeAns=0
		Dead=0

		printOutput(output);
		set_mouse(firstpartminus.length+1)
	}
});
