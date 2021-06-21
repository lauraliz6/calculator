var typicalSBar = document.getElementById('typical-bar');
var typicalSWidth = (6/20)*500;
typicalSBar.style.width = typicalSWidth+"px";

// Make the percent element draggable:
dragElement(document.getElementById("percent"));

var left;
var yourPerBar = document.getElementById('percent-bar');

function dragElement(elmnt) {
  var pos1 = 0, pos3 = 0;
  if (document.getElementById(elmnt.id + "set")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "set").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor X position:
    pos1 = pos3 - e.clientX;
    pos3 = e.clientX;
    // set the element's new X position:
    left = (elmnt.offsetLeft - pos1);
    if (left>-1 && left<501){
      elmnt.style.left = left + "px";
      yourPerBar.style.width = (left+5) + "px";
      changePercent();
    }
    else {}
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
    postNumbers();
  }
}

//this function sets the percentage based on the position of the % element
var perDis = document.getElementById('percentInput');
var percent = 10;
function changePercent() {
  var percent = Math.round((left/500)*20);
  perDis.value = percent+"%";
}


//this part spits out initial values
var yearsToRetire;
var curBalance;
var incomeLevel;
var percentOut;

var ageInput = document.getElementById('age');
var balInput = document.getElementById('bal');
var incomeInput = document.getElementById('income');
var percentDisplayed = document.getElementById('percentInput');
var yourDot = document.getElementById('your-dot');
var retireAge = document.getElementById('retire-age');

var typicalPer = '6%';
var idealPer = '20%';

retireAge.onchange = function() {
  var retirementAge = retireAge.value;
  postNumbers();
}

ageInput.onchange = function() {
  postNumbers();
  styleInput(ageInput);
}

balInput.onchange = function() {
  postNumbers();
  styleInput(balInput);
}

incomeInput.onchange = function() {
  postNumbers();
  styleInput(incomeInput);
}

function calculateSavings(contribPer) {
  //calculating basic values
  var curBalance = balInput.value.split("$").pop();
  var age = ageInput.value;
  var incomeLevel = incomeInput.value;
  var salary;
  //setting salary level
  if (incomeLevel == "$20k-40k") {
    salary = 30000;
  }
  else if (incomeLevel == "$40k-60k"){
    salary = 50000;
  }
  else if (incomeLevel == "$60k-80k"){
    salary = 70000;
  }
  else if (incomeLevel == "$80k-100k"){
    salary = 90000;
  }
  else if (incomeLevel == "$100k-120k"){
    salary = 110000;
  }
  else {
    salary = 50000;
  }
  var percentOut = contribPer;
  var interestRate = .06;

  //getting into real calculations
  //employee contribution calculation
  var eePer = percentOut.split("%").shift()/100;
  var empContAmt = salary*eePer;

  //employer contribution calculation
  var compMatch = .5;
  var compLimit = .06;
  var matchAmt = compMatch*empContAmt;
  var limitAmt = compLimit*compMatch*salary;
  var compContr = Math.min(matchAmt, limitAmt);

  //interest calculation
  var totalCont = empContAmt+compContr;
  var currentBal = parseFloat(curBalance.replace(/,/g, ''));

  //I got this formula from here: https://stackoverflow.com/questions/1780645/how-to-calculate-future-value-fv-using-javascript
  function FV(rate, nper, pmt, pv, type) {
  var pow = Math.pow(1 + rate, nper),
     fv;
  if (rate) {
   fv = (pmt*(1+rate*type)*(1-pow)/rate)-pv*pow;
  } else {
   fv = -1 * (pv + pmt * nper);
  }
  return fv.toFixed(2);
}
  var interest = .06;
  var nper = 12;
  var rate = interest/nper;
  var pmt = -(totalCont/nper);
  var pv = -currentBal;
  var type = 0;

  //this calculates for just one year
  // calcFV = FV(rate, nper, pmt, pv, type);
  // interestAmt = calcFV-totalCont-currentBal;

  //logging the numbers for math checks
  // console.clear();
  // console.log('Current Balance: '+currentBal);
  // console.log('Percent: '+percentOut);
  // console.log('Contribution Amount: '+empContAmt);
  // console.log('Company Contribution Amount: '+compContr);
  // console.log('Calculated FV: '+calcFV);
  // console.log('Interest Amount: '+interestAmt);

  //savings at age 65
  var age = ageInput.value;
  var retirementAge = retireAge.value;
  var yearsToRetire = parseFloat(retirementAge - age);
  var retireSavings = FV(rate, nper*yearsToRetire, pmt, pv, type);

  //making this readable
  var retireSavingsDollars = Math.round(retireSavings);

  return retireSavingsDollars;
}

function fetchContr() {
  var percentOut = percentDisplayed.value;
  var contPercent = percentOut;
  return contPercent;
}

//this function displays the numbers
function postNumbers() {
  var yourContPer = fetchContr();

  var typicalSavings = calculateSavings(typicalPer);
  var idealSavings = calculateSavings(idealPer);
  var yourSavings = calculateSavings(yourContPer);
  var perPlaceH = document.getElementById('your-placeholder');
  perPlaceH.innerHTML = yourContPer;
  var yourSDisplay = document.getElementById('your');
  var yourSComma = yourSavings.toLocaleString();
  yourSDisplay.innerHTML = "$"+yourSComma;
  var typicalSDisplay = document.getElementById('typical');
  var typicalSComma = typicalSavings.toLocaleString();
  typicalSDisplay.innerHTML = "$"+typicalSComma;
  var idealSDisplay = document.getElementById('ideal');
  var idealSComma = idealSavings.toLocaleString();
  idealSDisplay.innerHTML = "$"+idealSComma;
  moveGraph(yourContPer);
  var returnDisplay = document.getElementById('savings-return');
  returnDisplay.innerHTML = "$"+yourSComma;
}

//this function changes the graphs
function moveGraph(yourPer) {
  var percentOut = yourPer;
  var eePer = percentOut.split("%").shift();
  var yourSBar = document.getElementById('your-bar');
  var yourSPer = eePer/20;
  var yourSBarWidth = yourSPer*508;
  yourSBar.style.width = yourSBarWidth+"px";
  dotColor();
}

//STYLING
//change input font & border color upon change
function styleInput(element){
  element.style.color = "#5a5a5a";
  element.style.border = "1px solid #199450";
}

//change small dot color if bar is past it
// dotStyle(250);
// function dotStyle(barLeft) {
//   var dots = document.getElementsByClassName('dot-y');
//   for (i=0; i<dots.length; i++){
//     var dotPos = dots[i].offsetLeft - 230;
//     if (dotPos < barLeft) {
//       dots[i].style.backgroundColor = "white";
//     }
//     else {
//       dots[i].style.backgroundColor = "#2699FB";
//     }
//   }
// }

function dotColor(){
  var dots = document.getElementsByClassName('dot-y');
  for (i=0; i<dots.length; i++){
    var dotParent = dots[i].parentElement.parentElement;
    var dotParentX = dotParent.offsetLeft;
    var dotX = dots[i].offsetLeft-dotParentX;
    var firstClass = dotParent.classList[0];
    var trimClass = firstClass.split("-").shift();
    var thisBar = document.querySelector('#'+trimClass+'-bar');
    var barWidth = thisBar.style.width.split("px").shift();
    if (barWidth > dotX){
      dots[i].style.backgroundColor = "white";
    }
    else {
      dots[i].style.backgroundColor = "#199450";
    }
  }
}

//ACCESSIBILITY
//allowing text input to use keys for value up/down
retireAge.addEventListener('keydown', function(){
  keyListener(retireAge);
});
ageInput.addEventListener('keydown', function(){
  keyListener(ageInput);
});
balInput.addEventListener('keydown', function(){
  keyListener(balInput);
});

function keyListener(e) {
  const key = event.key.toLowerCase();
  if (key == 'arrowup'){
    e.value++;
  }
  else if (key == 'arrowdown'){
    e.value--;
  }
  else if (key == 'enter'){
    postNumbers();
  }
  else if (key == 'tab'){
    postNumbers();
  }
}

//allowing percent to be an input (focusing on click)
var percentInput = document.getElementById('percentInput');
percentInput.onblur = function(){
  postNumbers();
}

percentInput.onclick = function() {
  percentInput.focus();
}
percentInput.addEventListener('keydown', function(){
  const key = event.key.toLowerCase();
  var percentSet = percentInput.value.split("%").shift();
  if (key == 'arrowup'){
    if (percentSet<20){
      percentSet++;
      percentInput.value = percentSet+'%';
      moveSlider(percentSet);
    }
  }
  else if (key == 'arrowdown'){
    if (percentSet>0) {
      percentSet--;
      percentInput.value = percentSet+'%';
      moveSlider(percentSet);
    }
  }
  else if (key == 'enter'){
    postNumbers();
    ageInput.focus();
  }
  else if (key == 'tab'){
    postNumbers();
  }
})

//a function to move the slider bar with the up/down arrows
function moveSlider(p) {
  var slider = document.getElementById('percent');
  var posLeft = slider.style.left;
  var position = (p*500)/20;
  slider.style.left = position+"px";
  var bar = document.getElementById('percent-bar');
  bar.style.width = (position+5) + "px";
}
