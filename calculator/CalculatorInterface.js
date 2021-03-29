var Inv = 1;
var listmaxwidth=0;
var caret;
var ChangeAns = 0;
var Ans = 0;
var result;
var RadiansOn = 1;
var Dead = 0; //This is to know if ^ is the last key pressed, its ugly but ^ has so strange interactions
//for multiple keys simuntainously pressed
let keysPressed = {};

//Adds an historic result to the dropdown menu
function AddToHistoryList(resultadd) {
	//RightBracket()

	//creates elements of the input and result to be put in the list
	var historytable = document.createElement("div");
	var equalsign = document.createElement("div");

	var historyequation = document.createElement("div");
	var historyresult = document.createElement("div");

	historyequation.textContent = resultadd.replace(/(.*)\=.*/,"$1")
	historyresult.textContent = resultadd.replace(/.*\=(.*)/,"$1")

	equalsign.textContent = "="
	equalsign.style.display ="inline-block"

	historytable.className = "historytable";
	historyequation.className = "HistoryElement";
	historyresult.className = "HistoryElement";

	historyequation.id="historyequation"
	historyresult.id="historyresult"
	historytable.id="historytable"

	historycontents.insertBefore(historytable, historycontents.childNodes[0]);
	historytable.insertBefore(historyresult, historytable.childNodes[0]);
	historytable.insertBefore(equalsign, historytable.childNodes[0]);
	historytable.insertBefore(historyequation, historytable.childNodes[0]);

	//I didnt manage to get the list to Inverse width with the size of the elements. So I have to make it manually
	//this sets the list width according to the widest element in the list
	//This is super ugly, but I didnt manage to get the actual size of the divs so i had to make an approximation of the space
	//that the text would take up. I made a few tests and each character has an meanvalue
	if(resultadd.length*8+120>listmaxwidth){
		listmaxwidth=resultadd.length*8+120
		$('#historydropdown').width(listmaxwidth)
		$('#historycontents').width(listmaxwidth)
	}

	//I should be able to have one function for both of these
	//If you click on the equation or result in the table, the corresponding result
	//should be shown in the displaywindow
	historyresult.onclick = function () {
		printOutput(historyresult.innerText)
		printHistory("Ans = " + Ans)
		set_mouse(historyresult.innerText.toString().length)
		$('#historydropdown').hide();
		$('#historybutton').css('color', '#919191');
		set_icon_color()
		ChangeAns=0;
	};
	historyequation.onclick = function () {
		printOutput(historyequation.innerText)
		printHistory("Ans = " + Ans)
		set_mouse(historyequation.innerText.toString().length)
		$('#historydropdown').hide();
		
		$('#historybutton').css('color', '#919191');
		set_icon_color()
		ChangeAns=0;
	};
}
//Often important to know the position of the caret
function get_caret_position() {
	if (window.getSelection && window.getSelection().getRangeAt) {
		var range = window.getSelection().getRangeAt(0);
		var selectedObj = window.getSelection();	
		var rangeCount = 0;

		try {
		var childNodes = selectedObj.anchorNode.parentNode.childNodes;
		} catch (e) {
			if (e instanceof TypeError) {
				document.getElementById("output-value").focus();
				return(0)
			} else {
				throw (e);
			}
		}
		for (var i = 0; i < childNodes.length; i++) {
			if (childNodes[i] == selectedObj.anchorNode) {
				break;
			}
			if (childNodes[i].outerHTML)
				rangeCount += childNodes[i].outerHTML.length;
			else if (childNodes[i].nodeType == 3) {
				rangeCount += childNodes[i].textContent.length;
			}
		}
		return range.startOffset + rangeCount;
	}
	return -1;
}
function set_mouse(pos) {
	
	var as = document.getElementById("output");
	el = as.childNodes[1].childNodes[0];
	var range = document.createRange();
	var sel = window.getSelection();
	if(as.innerText==""){
		$('#output-value').focus()
		return
	}
	try {
		range.setStart(el, pos);
	} catch (e) {}
	range.collapse(true);
	sel.removeAllRanges();
	sel.addRange(range);
	caret = pos;
}
//Print the history
function printHistory(num) {
	num = num.replace(/^\./, "0\.")
	document.getElementById("history-value").innerText = num;
}
function getOutput() {
	return document.getElementById("output-value").innerText;
}
//Print to input space
function printOutput(num) {
	if (num == "") {
		document.getElementById("output-value").innerText = num;
	}
	else {
		document.getElementById("output-value").innerText = (num);
	}
}
function set_icon_color(){
	$('#historyicongreen').toggle();
};


//This is for the dropdown history menu, to toggle visability and toggle colors
$(document).ready(function(){
    $('#historybutton').click(function(event){
        event.stopPropagation();
		 $('#historydropdown').toggle();
		 set_icon_color()
		 if($('#historydropdown').is(":visible")==false){
			set_mouse(caret)
		 }
		});
    $('#historydropdown').on("click", function (event) {
		event.stopPropagation();

    });
});
//if you put the cursor inside a expression like "sin(", it will be moved to the closest side.
$('#output-value').on("click", function () {
	if(document.getSelection().anchorOffset-document.getSelection().focusOffset==0){
		caret = get_caret_position();
		output=getOutput()
		var firstpart = output.substring(0, caret); //string before caret, Can I put this here?
		var secondpart = output.substring(caret, output.length)

		//im using the fact that all of the expressions that one wish to skip contain only letters
		var firstside = firstpart.replace(/.*?([a-zA-Z\(]*)$/,"$1")
		var secondside = secondpart.replace(/^([a-zA-Z\(]*).*/,"$1")

		//this means that if the letters to the left of the cursor and the letters right of the cursor
		//combined equals one of these mathematical expressions, one of those mathematical expressions were clicked.
		if(/(a?(sin|cos|tan)|ln|log|abs|exp|PI|sqrt|ans)\(?/i.test(firstside+secondside)){
			//puts the cursor to closest side of the expression
			if(firstside.length<secondside.length){
				set_mouse(firstpart.length-firstside.length)
			}else{
				set_mouse(firstpart.length+secondside.length)
			}
		}
	}	
})

//adds the blue rim when the display is clicked
$('#output-value').focus(function(e){
	$('#results').removeClass("output-normal output-hover").addClass("output-blue")
})
$('#output-value').blur(function(e){
	$('#results').removeClass("output-blue").addClass("output-normal output-hover")
})


//Handles focus when you click on various things
$(document).mousedown(function (e) {
	//I used an Iframe for this, so whenever a click outside the calculator was detected, 
	//the calculator was blurred. This will probably work different for you
	if(e.target.id==""){
		document.getElementById("output-value").blur();
	}if(e.target.id=="output-value"){
		return
	}
	//If you click on the resultdisplay, or somewhere in the dropdown menu, the dropdown menu should not disapear
	else if(/(history(\-value)?$|results)/i.test(e.target.id)){
		//since its the color is a toggle, we have to be careful to check if the dropdown actually Inverses state from invisable
		//to visable
		if($('#historydropdown').is(":visible")){
			set_icon_color()
		}
		$('#historydropdown').hide();
		event.preventDefault();
		document.getElementById("output-value").focus();
		//There were problems with set_mouse when you had text selected
		if(window.getSelection()==0){
			set_mouse(caret)
		}
	//if the e.target has anything to do with the history list (except the actuall history), it should be ignored	
	}else if(/history.+/.test(e.target.id)){
		return;
	}
	else{
		//since its the color is a toggle, we have to be careful to check if the dropdown actually Inverses state from invisable
		//to visable
		if($('#historydropdown').is(":visible")){
			set_icon_color()
		}
		$('#historydropdown').hide();
		event.preventDefault();
		document.getElementById("output-value").focus();
		//There were problems with set_mouse when you had text selected
		if(window.getSelection()==0){
			set_mouse(caret)
		}
	}
});

//I tried to make the right bracket light grey whenever it autocompletes the second "()"
//Google has this feature, but I never managed to make it work
/*
function RightBracket(){
	caretbefore=caret
	output=getOutput()
	var firstpart = output.substring(0, caret); //string before caret, Can I put this here?
	var secondpart = output.substring(caret, output.length)

	rightbracket='<span class="highlight">)</span>'
	firstpart = firstpart + rightbracket
	output=firstpart+secondpart
	printOutput(output)
	set_mouse(caretbefore)



}*/



//if an operator is clicked
var operator = document.getElementsByClassName("operator");
for (var i = 0; i < operator.length; i++) {
	operator[i].addEventListener('click', function () {
		
		/*if(this.id == "RadButton"){ //RadButton is of class operator so it will look the same, even though it dosent share any functionality
			return
		}*/

		caret = get_caret_position();
		var output = getOutput().toString();
		var firstpart = output.substring(0, caret); //string before caret, Can I put this here?
		var secondpart = output.substring(caret, output.length)

		//Inverse Rad->Deg or Deg->Rad
		if(this.id == "RadDeg"){
			if (RadiansOn == 0) {
				document.getElementById("RadUpper").innerText = "Rad";
				document.getElementById("RadLower").innerText = "Deg";
				$('#RadDeg').removeClass("trig-color").addClass("trig-hover")
				RadiansOn = 1;
			}
			else {
				document.getElementById("RadUpper").innerText = "Deg";
				document.getElementById("RadLower").innerText = "Rad";
				$('#RadDeg').addClass("trig-color trigactive-hover")
				RadiansOn = 0;
			}
		}
		//Inverse the trig functions to their inverse
		else if (this.id == "Inverse") {
			if (Inv == 1) {
				$('#Inverse').addClass("trig-color trigactive-hover")

				$("#sin").val("asin()");
				$("#sin").html("asin"); //Html is the name shown and val is the value taken
				$('#sin').addClass("trig-color trigactive-hover")

				$("#cos").val("acos()");
				$("#cos").html("acos");
				$('#cos').addClass("trig-color trigactive-hover")

				$("#tan").val("atan()");
				$("#tan").html("atan");
				$('#tan').addClass("trig-color trigactive-hover")
				Inv = 0;
				return
			}
			if (Inv == 0) {
				$('#Inverse').removeClass("trig-color trigactive-hover").addClass("trig-hover")
		
				$("#sin").val("sin()");
				$("#sin").html("sin"); //Html is the name shown and val is the value taken
				$('#sin').removeClass("trig-color trigactive-hover").addClass("trig-hover")

				$("#cos").val("cos()");
				$("#cos").html("cos");
				$('#cos').removeClass("trig-color trigactive-hover").addClass("trig-hover")

				$("#tan").val("tan()");
				$("#tan").html("tan");
				$('#tan').removeClass("trig-color trigactive-hover").addClass("trig-hover")
				Inv = 1;
				return
			}
		}
		else if (this.id == "clear") {
			printHistory("");
			printOutput("");
			ChangeAns=0
			$('#output-value').focus()
		//backspace should remove entire expression etc "sin", also it should remove corresponding brackets
		} else if (this.id == "backspace") {
			{//If an area is selected it should get erased
			if (window.getSelection() != 0) {
				window.getSelection().deleteFromDocument()
			}else{
				var holeword = /(a?(sin\(?|cos\(?|tan\(?)|abs\(?|NaN|Ans|exp\(?|pi|sqrt\(?|ln\(?|sqrt\(?|log\(?|.)?$/
				var holewordtoright = /^(a?(sin\(?|cos\(?|tan\(?)|abs\(?|exp\(?|pi|sqrt\(?|ln\(?|sqrt\(?|log\(?|[0-9\.\-\+\/\*\x\^\/\)\(\%\!])?/
 				//Check for sin() and similar expression in order to remove the surrounding brackets
				sinuscheck = /(a?(sin\(|cos\(|tan\()|abs\(|exp\(|sqrt\(|ln\(|sqrt\(|log\()$/
				if (sinuscheck.test(firstpart)) {
					//this is needed, since the caret will move when pasting
					var caretBefore = caret;
					//Takes everthing until a ) without a corresponding (, which means it is the end bracket. the entire expression inside is set to $1
					var RemoveComplete = /^(.*(\(.*\))*.*)(\))/ 
					var secondpart = secondpart.replace(RemoveComplete, "$1")
					set_mouse(caretBefore)
					$('#output-value').focus()
				}
				if (holeword.test(firstpart)) {
					//We dont have to test if it matches, because it always matches
					var replaced = firstpart.replace(holeword, "") 
					output = replaced + secondpart
					printOutput(output);
					set_mouse(caret + replaced.length - firstpart.length)
				}
			}
		}
		}
		else if (this.id == "=") {
			//If last enter was "=" or "+,-,*" etc, ignore enter
			if (ChangeAns == 1  || (/([\-\+\/\*\x\^\/\%])$/.test(output))) {
				return
			}
			result = calculate(output);
			//In case of error in calculate
			if (/NaN/.test(result)) {
				Ans=0
				printOutput(NaN)
				set_mouse(output.toString().length)
				return
			}
			ChangeAns = 1;
			printOutput(result);
			//printHistory is now handled in the calculator
			//printHistory(output + "=");
			set_mouse(result.toString().length)
		}else{
			var selection=[document.getSelection().anchorOffset,document.getSelection().focusOffset]
			if(selection[0]>selection[1]){
				k=selection[0]
				selection[0]=selection[1]
				selection[1]=k
			}
			//if text is selected and any of these are chosen, the brackets should be put around the targeted text
			//and the text should be reselected
			if(/(\(|\)|a?(sin|cos|tan)|exp|log|ln)/ig.test(this.id) && selection[0]-selection[1]!=0){

				//in the case of "(" and ")", there will be double brackets, so we have to compensate for that and remove the "this.id"
				if(/^[\(\)]$/.test(this.id)){
					//puts brackets around the selected text and reselects it
					output= output.slice(0,selection[0]) + "(" + output.slice(selection[0],selection[1]) + ")" + output.slice(selection[1],output.length)
				}else{
					//puts brackets around the selected text and reselects it
					output= output.slice(0,selection[0]) + this.id + "(" + output.slice(selection[0],selection[1]) + ")" + output.slice(selection[1],output.length)
				}	
				printOutput(output)

				var newselection = document.getSelection();
				node=document.getElementById("output-value")
				let range = document.createRange();

				//I havent decided yet if the etc "sin" should be selected aswell or only the numbers

				//once again we have to compensate for the "(" and ")"
				if(/^[\(\)]$/.test(this.id)){
					range.setStart(node.firstChild, selection[0]);
					range.setEnd(node.firstChild, selection[1]+2);
				}else{	
					range.setStart(node.firstChild, selection[0]+this.id.length);
					range.setEnd(node.firstChild, selection[1]+this.id.length+2);
				}
				newselection.removeAllRanges();          
				newselection.addRange(range);

				return
			}else{
				output= output.slice(0,selection[0]) + output.slice(selection[1],output.length)
			}

			output=getOutput()
			var firstpart = output.substring(0, caret);
			var secondpart = output.substring(caret, output.length)

			//checks if you were about to write 2 operators in a row, and replaces the first one instead, so instead of +^ it replaces + with ^
			//Also *- is valid, however in that case it shouldnt replace the -. If it would replace the -, this would make it possible to write something like *+ which is invalid
			if(/[E\+\-\*\/\^\%\u00D7][\-]$/.test(firstpart)){
				return
			}  
			//If last entry was ( you cannot use an operator, (+ is invalid. Similarly if you want to write ) the last entry cannot be an operator. +) is invalid
			//also added E, E*3 is invalid.
			if(/^[\+\*\/\^\%\x]$/.test(this.id) && /[E\(]$/.test(firstpart) || /[\)]/.test(this.id) && /[\+\*\/\^\%\x\u00D7]$/.test(firstpart)){ 
				return
			}
			//cannot use these operators to start the expression
			if(output==""  && /^[\+\*\/\x\^\%\!\)]$/.test(this.id)){
				return
			}
			//there should never be more ")" than "("
			if(/\)/.test(this.id) && ((firstpart.match(/\)/g) || []).length>=(firstpart.match(/\(/g) || []).length)){
				return
			}
			//if there is a ")" to the right and you write ")", it should simply skip over it instead of printing out a new one
			if(/^\)/.test(secondpart) && /\)/.test(this.id)){
				set_mouse(caret+1)
				return
			}
			//if last input was operator (except "-"), and you input an operator, it should replace the last one
			if(/^[\+\*\/\^\%\x]/.test(this.id) && /[\x\+\-\*\/\^\%\u00D7]$/.test(firstpart)){
					firstpart = firstpart.replace(/.$/,this.value)
					
					output = firstpart + secondpart;
					printOutput(output)
					set_mouse(firstpart.length)
					return 
			}

			//To put caret inside the bracket the last bracket must be removed from the count
			var length = this.value.replace(/(.)\)$/, "$1").length;
			if (ChangeAns == 1) {
				printHistory("Ans=" + result);
				ChangeAns = 0;
				if(/^[\!\*\+\-\/\(\)\^\%]$/.test(this.id)){
					printOutput(result + this.value)
					set_mouse(result.toString().length + this.value.length)
					return
				}else{
					printOutput(this.value)
					set_mouse(length)
					return
				}
				
			}
			//^ has many strange behaviors that this rather ugly code will fix. When dead=1 it alters the way the next input is entered.
			if(this.id=="Dead"){
				Dead=1;
				return
			}

			//add a *. Tex "sin()Ans" ==> "sin()*Ans"
			//also this shouldnt happen with etc "+" "sin()+" shouldnt become "sin()*+"
			if(/(\u03C0|[es\)])$/.test(firstpart) && /[\!\-\/\)\*\+)]/.test(this.id)==false){
				output = firstpart + "\u00D7"+ this.value + secondpart;
				printOutput(output)
				//have to compensate for the added *
				set_mouse(length + firstpart.length+1)
				return
			}
			output = firstpart + this.value + secondpart;
			printOutput(output)
			set_mouse(length + firstpart.length)
		}
	})
}
//when clicking a number
var number = document.getElementsByClassName("number");
for (var i = 0; i < number.length; i++) {
	number[i].addEventListener('click', function () {
		caret = get_caret_position();

		window.getSelection().deleteFromDocument()
		output=getOutput()
		var firstpart = output.substring(0, caret);
		var secondpart = output.substring(caret, output.length)

		//you shouldnt be able to write multiple "0" without another number in front
		if(this.id=="0" && /[\+\*\/\^\!\%\x]0+$/.test(firstpart) || this.id=="0" && /^0+$/.test(firstpart)){
			return false
		}
		//instead of writting "01" it should replace the "0" with the "1"
		if(/[0-9]/.test(this.id) && /[\+\*\/\^\!\%\x]0$/.test(firstpart) || /[0-9]/.test(this.id) && /^0$/.test(firstpart)){
			firstpart=firstpart.replace(/.$/,"")
		}

		if(ChangeAns == 1) {
			printHistory("Ans = " + result);
			ChangeAns = 0;
			Ans = result
			printOutput(this.id)
			set_mouse(1)
			return
		}
		if (output != NaN) { //if output is a number
			output = firstpart + this.id + secondpart;
			printOutput(output);
			set_mouse(firstpart.length + 1)
		}
	});
}