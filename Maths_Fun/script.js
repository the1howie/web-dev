// --------------- GLOBAL VARIABLES ---------------

let lastOpName = "";
let quizTotal = 0;
let maxValue = 20;
let totalChange = false;


//  -------------- DEFINE OPERATIONS --------------

const operations = [
    {
      name: "add", 
      symbol: "a+b", 
      method: function (a, b) {
        return a + b;
      }, 
      description: "addition"
    },
    {
      name: "sub", 
      symbol: "a-b", 
      method: function (a, b) {
        return a - b;
      },  
      description: "subtraction"
    },
    {
      name: "mlt", 
      symbol: "a×b", 
      method: function (a, b) {
        return a * b;
      }, 
      description: "multiplication"
    },
    {
      name: "div", 
      symbol: "a÷b", 
      method: function (a, b) {
        return a / b;
      }, 
      description: "division"
    },
    {
      name: "pow", 
      symbol: "a^b", 
      method: function (a, b) {
        return Math.pow(a, b);
      }, 
      description: "power"
    },
    {
      name: "mod", 
      symbol: "a%b", 
      method: function (a, b) {
        return a % b;
      }, 
      description: "modulus"
    },
    {
      name: "nrt", 
      symbol: "<sup>a</sup>√b", 
      method: function (a, b) {
        return Math.pow(b, 1 / a);
      }, 
      description: "nth root"
    },
    {
      name: "log", 
      symbol: "log<sub>a</sub>(b)", 
      method: function (a, b) {
        return Math.log(b) / Math.log(a);
      }, 
      description: "logarithm"
    },
    {
      name: "lcm", 
      symbol: "LCM(a,b)", 
      method: function (a, b) {
        return lcm(a, b);
      }, 
      description: "lowest common multiple"
    },
    {
      name: "gcd", 
      symbol: "GCD(a,b)", 
      method: function (a, b) {
        return gcd(a, b);
      }, 
      description: "greatest common divisor"
    },
    {
      name: "idv", 
      symbol: "a//b", 
      method: function (a, b) {
        return Math.floor(a / b);
      }, 
      description: "integer division"
    }
  ];

const quizOps = {
  "+": "add",
  "-": "sub",
  "×": "mlt",
  "÷": "div",
  "^": "pow",
  "%": "mod"
};

const opToolTips = {
  "+": "plus",
  "-": "minus",
  "×": "times",
  "÷": "divide by",
  "^": "to the power of",
  "%": "modulus"
}

function gcd(a, b) { 
  // The GCD is the Euclidean Algorithm. 
  // Source: https://www.geeksforgeeks.org/javascript-program-to-find-gcd-or-hcf-of-two-numbers/

  for (let temp = b; b !== 0;) { 
      b = a % b; 
      a = temp; 
      temp = b; 
  } 
  return a; 
} 
  
function lcm(a, b) { 
    const gcdValue = gcd(a, b); 
    return (a * b) / gcdValue; 
} 


// -------------- HELPER FUNCTIONS --------------

function roundNdp(num, dp = 0) {
  var base = Math.pow(10, dp);
  return Math.round(parseFloat(num) * base) / base;
}

function randValue(N = 1) {
  return Math.floor(Math.random() * N);
}

function validInput(cell) {
  var x = document.getElementById(cell);
  if (x.value === "" || Number.isNaN(x.value)) {
    x.style.backgroundColor = "red";
    x.style.color = "white";
    return false;
  } else {
    x.style.backgroundColor = "";
    x.style.color = "";
    return true;
  }
}

function scrollTo(hash) {
    location.hash = "#" + hash;
}


// ----------------- CALCULATOR  -----------------

function evalOperation(num1, num2, opName) {
  //mathematical evaluation
  var names = [];
  for (var i = 0; i < operations.length; i++) {
    names.push(operations[i].name);
  }
  
  if (names.includes(opName)) {
    var opObj = operations.find(obj => {
      return obj.name === opName;
    });
    
    lastOpName = opName;
    
    return {
      operation: opObj, 
      value: opObj.method(num1, num2)
    };
    
  } else {
    return null;
  }
}

function getInputs(num1, num2) {
  var a, b;
  if (validInput(num1)) {
    a = parseFloat(document.getElementById(num1).value);
  } else {
    a = NaN;
  }
  
  if (validInput(num2)) {
    b = parseFloat(document.getElementById(num2).value);
  } else {
    b = NaN;
  }
  
  return {
    num1: a,
    num2: b
  };
}

function calcOperation(num1, num2, opName) {
  var nums = getInputs(num1, num2);
  var result = evalOperation(nums.num1, nums.num2, opName);
  
  updateHeader(result.operation.symbol);
  displayResult(result.value);
}

function displayResult(result) {
  var dp = 5; //decimal places
  cell = document.getElementById("result")
  cell.innerHTML = roundNdp(result, dp);
}

function updateHeader(newHeader) {
  var table = document.getElementById("io");
  var headers = table.getElementsByTagName('th'); 
  headers[2].innerHTML = newHeader;
}

function updateResult(num1, num2) {
  var nums = getInputs(num1, num2);
  var table = document.getElementById("io");
  var headers = table.getElementsByTagName('th'); 
  opSymbol = headers[2].innerHTML;
  
  if (lastOpName !== "") {
    var opObj = operations.find(obj => {
      return obj.name === lastOpName;
    });
    displayResult(opObj.method(nums.num1, nums.num2));
  }
}

function switchAB(num1, num2) {
  var nums = getInputs(num1, num2);
  var a, b;
  a = document.getElementById(num1);
  b = document.getElementById(num2);
  
  //switch values a <-> b
  a.value = nums.num2;
  b.value = nums.num1;
  
  //update result
  updateResult(num1, num2);
  
  return true;
}

function resetInputs(num1, num2) {
  var a, b;
  a = document.getElementById(num1);
  b = document.getElementById(num2);
  
  //switch values a <-> b
  a.value = 0;
  b.value = 0;
  
  //update result
  displayResult(0);
  
  return true;
}


// --------------------- QUIZ --------------------------

function getQuizData(cell1, cell2, cell3, cell5) {
  // cell4 is the "=" sign.
  var x1 = parseFloat(document.getElementById(cell1).innerHTML);
  if (Number.isNaN(x1)) {
    x1 = parseFloat(document.getElementById(cell1).value);
  }
  
  var sym = document.getElementById(cell2).innerHTML;
  
  var x2 = parseFloat(document.getElementById(cell3).innerHTML);
  if (Number.isNaN(x2)) {
    x2 = parseFloat(document.getElementById(cell3).value);
  }
  
  // missing value validation
  var y = document.getElementById(cell5).value;
  
  // validation for missing value
  if (!validInput(cell5)) {
    y = null;
  } else {
    y = parseFloat(y);
  }

  return {
    num1: x1,
    num2: x2,
    opSym: sym,
    result: y
  };
}

function resetBkgColorInput(cell) {
  document.getElementById(cell).style.backgroundColor = "";
}

function setQuizData() {
  // cell4 is the "=" sign.
  var numRows = document.getElementById("qz").rows.length;
  var cell1 = "";
  var cell2 = "";
  var cell3 = "";
  var cell5 = "";
  var cell6 = "";
  var x;
  var x1;
  var x2;
  var op;
  var sym;
  var y;
  var check;
  var opsList = Object.keys(quizOps);
  var numOps = opsList.length;
  
  for (let i = 1; i <= numRows; i++) {
    cell1 = "A" + String(i);
    cell2 = "B" + String(i);
    cell3 = "C" + String(i);
    cell5 = "E" + String(i);
    cell6 = "F" + String(i);
    
    x1 = document.getElementById(cell1);
    op = document.getElementById(cell2);
    x2 = document.getElementById(cell3);
    y = document.getElementById(cell5);
    check = document.getElementById(cell6);
    
    // set math operation
    x = randValue(numOps);
    sym = opsList[x];
    op.innerHTML = sym;
    op.title = opToolTips[sym];
    
    // set x1 and x2 values
    x1.innerHTML = randValue(maxValue) * Math.pow(-1, randValue(2));
    x = randValue(maxValue);
    if (sym === "^") {
      x2.innerHTML = randValue(4) * Math.pow(-1, randValue(2));
    } else if (sym === "÷" && x === 0) {
      x2.innerHTML = 2;
    } else {
      x2.innerHTML = x;
    }
    
    resetBkgColorInput(cell5);
    y.disabled = false;
    y.value = "";
    
    check.innerHTML = "?";
    check.title = "";
  }
  
  quizTotal = 0;
  totalChange = false;
  resetTotalHeader();
  document.getElementById("quizTop").scrollIntoView();
  return true;
}

function quizComplete() {
  var numRows = document.getElementById("qz").rows.length;
  var complete = 0;
  var cell5;
  
  for (let i = 1; i <= numRows; i++) {
    cell5 = "E" + String(i);
    if (document.getElementById(cell5).disabled) {
      complete +=1;
    }
  }
  
  return (complete === numRows);
}


function validateQuiz() {
  var numRows = document.getElementById("qz").rows.length;
  var cell1 = "";
  var cell3 = "";
  var cell5 = "";
  var cell6 = "";
  var data;
  var result;
  var y;
  var check;
  
  for (let i = 1; i <= numRows; i++) {
    cell1 = "A" + String(i);
    cell2 = "B" + String(i);
    cell3 = "C" + String(i);
    cell5 = "E" + String(i);
    cell6 = "F" + String(i);
    check = document.getElementById(cell6);
    
    data = getQuizData(cell1, cell2, cell3, cell5);
    
    if (data.result !== null && !(document.getElementById(cell5).disabled)) {
      result = evalOperation(data.num1, data.num2, quizOps[data.opSym]);
      
      if (roundNdp(result.value, 4) === roundNdp(data.result, 4)) {
        quizTotal += 1;
        totalChange = true;
        check.innerHTML = '<font style="color:green">✓</font>';
        check.title = "";
      } else {
        check.innerHTML = '<font style="color:red">✕</font>';
        check.title = String(roundNdp(result.value, 4)) + " (correct answer to 4 d.p.)";
      }
      
      document.getElementById(cell5).disabled = true;
    }
  }
  
  updateTotalHeader();
  if (quizComplete()) {
    document.getElementById("qzImg").scrollIntoView();
  }
  return true;
}

function updateTotalHeader() {
  var totalStr = "Total points: " + String(quizTotal);
  var numRows = document.getElementById("qz").rows.length;
  var totalHdr = document.getElementById("qzTotal");
  var imgDiv = document.getElementById("qzImg");
  var percent = parseFloat(quizTotal / numRows);
  
  if (percent < 0.4) {
    totalHdr.innerHTML = '<font style="color:red">' + totalStr + '</font>';
    imgDiv.innerHTML = '<h3>Sorry, keep trying... You got ' + String(roundNdp(percent * 100)) + '%</h3> <br> ' +  '<img  src="sad_eyes.gif" width="320">';
  } else if (percent > 0.7) {
    totalHdr.innerHTML = '<font style="color:green">' + totalStr + '</font>';
    imgDiv.innerHTML = '<h3>Brilliant! You got ' + String(roundNdp(percent * 100)) + '%</h3> <br> ' + '<img  src="fireworks.gif" width="320">';
  } else {
    totalHdr.innerHTML = totalStr;
    imgDiv.innerHTML = '<h3>Keep up the good work! You got ' + String(roundNdp(percent * 100)) + '%</h3> <br> ' +  '<img  src="mathsIsFun.jpg" width="320">';
  }
  
  return true;
}

function resetTotalHeader() {
  document.getElementById("qzTotal").innerHTML = "Total points: " + String(quizTotal);
  document.getElementById("qzImg").innerHTML = '<img  src="mathsIsFun.jpg" width="320">';
  return true;
}

