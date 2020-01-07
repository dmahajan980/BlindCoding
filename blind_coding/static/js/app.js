// var request = require('request');

$(document).ready(function() {
  populateLangs();
	var inp = document.getElementsByClassName('noselect')[0];
  getQuestion(0);
  inp.addEventListener('select', function() {
    this.selectionStart = this.selectionEnd;
  }, false);
	
	document.addEventListener('contextmenu', event => event.preventDefault());
    var ctrlDown = false,
        ctrlKey = 17,
        cmdKey = 91,
        vKey = 86,
        cKey = 67;

    $(document).keydown(function(e) {
        // console.log('Key pressed: ', e.keyCode);
        if (e.keyCode == ctrlKey || e.keyCode == cmdKey) ctrlDown = true;
    }).keyup(function(e) {
        // console.log('Key released: ', e.keyCode);
        if (e.keyCode == ctrlKey || e.keyCode == cmdKey) ctrlDown = false;
    });

    $(".no-copy-paste").keydown(function(e) {
        // console.log('Key pressed inside editor: ', e.keyCode);
        if(ctrlDown && (e.keyCode == cKey))
        { 
          console.log("Document catch Ctrl+C");
        }
        if(ctrlDown && (e.keyCode == vKey)){
          console.log("Document catch Ctrl+V");
        }
        if (ctrlDown && (e.keyCode == vKey || e.keyCode == cKey)){
          // console.log('copy-paste');
          return false;
       }
    });
    
  // Display/hide leaderboard
  let i = 0;  
  $('.leaderboard-icon').click(function() {
    $('.leaderboard').fadeToggle();
    if (i === 0) {
      $('.li').html('cancel');
      i = 1
      getLeaderboard();
      // insert_chart
    }
    else {
      $('.li').html('insert_chart')
      i = 0;
    }
  })
});

const languages = ['c','java','cpp','cpp14','python2','python3'];
const versions = ['0','1','2'];
let code = `
#include <stdio.h>
int main(){
  printf("Hello World num entered is :");
  return 0;
}`;
let langNo = 0;
let versionNo = 0;
let input = '1';
let output = '';
let qNo = 0;
let tc1 = '';
let tc2 = '';
let tc3 = '';
let languageIDs = JSON.parse("[{\"id\":45,\"name\":\"Assembly (NASM 2.14.02)\"},{\"id\":46,\"name\":\"Bash (5.0.0)\"},{\"id\":47,\"name\":\"Basic (FBC 1.07.1)\"},{\"id\":48,\"name\":\"C (GCC 7.4.0)\"},{\"id\":52,\"name\":\"C++ (GCC 7.4.0)\"},{\"id\":49,\"name\":\"C (GCC 8.3.0)\"},{\"id\":53,\"name\":\"C++ (GCC 8.3.0)\"},{\"id\":50,\"name\":\"C (GCC 9.2.0)\"},{\"id\":54,\"name\":\"C++ (GCC 9.2.0)\"},{\"id\":51,\"name\":\"C# (Mono 6.6.0.161)\"},{\"id\":55,\"name\":\"Common Lisp (SBCL 2.0.0)\"},{\"id\":56,\"name\":\"D (DMD 2.089.1)\"},{\"id\":57,\"name\":\"Elixir (1.9.4)\"},{\"id\":58,\"name\":\"Erlang (OTP 22.2)\"},{\"id\":44,\"name\":\"Executable\"},{\"id\":59,\"name\":\"Fortran (GFortran 9.2.0)\"},{\"id\":60,\"name\":\"Go (1.13.5)\"},{\"id\":61,\"name\":\"Haskell (GHC 8.8.1)\"},{\"id\":62,\"name\":\"Java (OpenJDK 13.0.1)\"},{\"id\":63,\"name\":\"JavaScript (Node.js 12.14.0)\"},{\"id\":64,\"name\":\"Lua (5.3.5)\"},{\"id\":65,\"name\":\"OCaml (4.09.0)\"},{\"id\":66,\"name\":\"Octave (5.1.0)\"},{\"id\":67,\"name\":\"Pascal (FPC 3.0.4)\"},{\"id\":68,\"name\":\"PHP (7.4.1)\"},{\"id\":43,\"name\":\"Plain Text\"},{\"id\":69,\"name\":\"Prolog (GNU Prolog 1.4.5)\"},{\"id\":70,\"name\":\"Python (2.7.17)\"},{\"id\":71,\"name\":\"Python (3.8.1)\"},{\"id\":72,\"name\":\"Ruby (2.7.0)\"},{\"id\":73,\"name\":\"Rust (1.40.0)\"},{\"id\":74,\"name\":\"TypeScript (3.7.4)\"}]");

function populateLangs()
{
  console.log('populating languages...');
  let selectField = document.getElementById('langSelect');
  for(element of languageIDs)
  {
    // console.log('adding.. ',element);
     var opt = document.createElement("option");
     opt.value= element['id'];
     opt.innerHTML = element['name']; // whatever property it has
  
     // then append it to the select element
     selectField.appendChild(opt);
  }
}

function setCode(prog){
  code = prog;
}

function getCode(){ 
  return code;
}

function setLanguage(langNum){
  langNo = langNum;
}

function getLanguage(){ 
  return langNo 
};

function setVersion(vrsn){
  versionNo = vrsn;
}

function getVersion(){ 
  return versions[versionNo] 
}

function setCustomInput(inp){
  input = inp;
}

function getCustomInput(){
  return input 
}

function setOutput(outp) {
  output = outp['stdout'];
}
function getOutput(){
  return output 
}

function getQNum() { 
  return qNo;
}

// Get the various inputs and send it to server
function runCode(){
  // Pause, send time or store time
  // stopClock();
  pauseTime();

  console.log(`Time elapsed is: ${m} minutes and ${s} seconds`);
  
  // Get code entered by the user and store it
  let prog = document.getElementById("codeInput").value;
  // setCode(prog);

  // Get language chosen by the user and store it
  let lang = document.getElementById("langSelect").value;
  console.log('langCode: ', lang);
  // setLanguage(lang);

  // console.log('Language: ', getLanguage(), '\nCode: ', getCode());
  let time = m * 60 + s;

  console.log(getQNum())

  let program = {
      // Code equals script
      // script : getCode(),
      // language: getLanguage(),
      source_code : prog,
      language_id: lang,
      // versionIndex: versions[versionNo],
      stdin: getCustomInput(), //to give custom input
      qNo: getQNum(),
      timeElapsed: time
  };

  // Send the code to jdoodle url with all other required parameters
  // For all test cases backend checks the output and returns no of test cases cleared
  // let resp = sendRequest('POST', 'runCode/', program);
  sendRequest('POST', 'runCode/', program);
}

function getCookie(name) {
  var v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
  return v ? v[2] : null;
}


const sendRequest = (method, url, data) => {   
  let csrf_token = getCookie('csrftoken');
  let ourRequest = new XMLHttpRequest();

  ourRequest.open(method, url, true);
  ourRequest.setRequestHeader("Content-type", "application/json");
  ourRequest.setRequestHeader("X-CSRFToken", csrf_token);

  ourRequest.onload = function() {
    if (ourRequest.status >= 200 && ourRequest.status < 400) {
      // console.log('output: ');
      // console.log('success 200');
      if(url == 'runCode/'){
        console.log('1');
        let recievedData = JSON.parse(ourRequest.responseText);
        console.log('receivedData: ', recievedData);
        setOutput(recievedData);
        document.getElementById("compilerOutput").value = getOutput();
        document.getElementById('score').innerHTML = recievedData['score'];
        console.log(recievedData['score']);
        if(getOutput() == 'Correct Answer')
        {
          s = 0;
          m = 0;
          qNo = (getQNum() + 1) % 5;
          console.log(qNo);
          document.getElementsByClassName('left')[0].getElementsByTagName('h5')[0] = "Question "+qNo;
          document.getElementsByClassName('left')[0].innerHTML = getQuestion(qNo);
          console.log("OO");
        }
        increaseTime();
        return recievedData;
      }
      else{
        console.log('2');
        let recievedData = JSON.parse(ourRequest.responseText);
        let inpt = recievedData['sampIn'].split(' ');
        let inStr = '';
        for(let i = 0; i < inpt.length;i++)
        {
          inStr += inpt[i];
          inStr += '\n';
        }
        let que = recievedData['question'] + '<br><br>'+'Sample Input'+'<br>'+recievedData['sampTCNum']+'<br>'+inStr+'<br><br>'+'Sample Output'+'<br>'+recievedData['sampleOut'];
        console.log('hi ',recievedData);
          document.getElementsByClassName('left')[0].innerHTML=que;
        qNo = recievedData['qNo'];
        // console.log(qNo);
        // console.log(recievedData['userScore']);
        document.getElementById('score').innerHTML = recievedData['userScore'];
        console.log(recievedData);
        return recievedData;
      }

    } else {
      // Nothing
      // startClock();
      // console.log("OO")
      increaseTime()
    }
  }

  ourRequest.onerror = function() {
    // Nothing
    // startClock();
    // console.log("OO")
    increaseTime()
  }

  // console.log(JSON.stringify(data));
  ourRequest.send(JSON.stringify(data));
};


const getQuestion = queNum => {
  // start = 0;
  s = 0;
  m = 0;
  // // startClock();
  // console.log("OO")
  // increaseTime()
  // let data = { queNum };
  // sendRequest('POST', '/question/', data);
  sendRequest('POST', '/question/', { queNum });
  // console.log(queNum)
  // clicks = 0;
};

window.onresize = function() {
    if ((window.outerHeight - window.innerHeight) > 100) {
      // console was opened (or screen was resized)
      alert("Sorry! You will be logged out since you didn't follow the instructions.");
      window.location.href = "/logout"
    }
}

function getCookie(name) {
  var v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
  return v ? v[2] : null;
}

function login() {
  var csrf_token = getCookie('csrftoken');
  var ourRequest = new XMLHttpRequest();
  ourRequest.open("POST","login/", true);
  ourRequest.setRequestHeader("X-CSRFToken", csrf_token);
  ourRequest.setRequestHeader("Content-type", "application/json");
  ourRequest.onload = function() {
    if (ourRequest.status >= 200 && ourRequest.status < 400) { ; }
    else {}
  }
  ourRequest.onerror = function() {
    // Nothing
  }
  ourRequest.send();
}

function showAbout() {
    document.getElementsByClassName('about')[0].style.display = 'flex';
    document.getElementsByClassName('backdrop')[0].style.display = 'block';
}

function closeAbout() {
    document.getElementsByClassName('about')[0].style.display = 'none';
    document.getElementsByClassName('backdrop')[0].style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('select');
	  // console.log('hikljhg');
    // var instances = M.FormSelect.init(elems, options);
  });

  // Or with jQuery

  $(document).ready(function(){
    $('select').formSelect();
  });

  $(document).delegate('#codeInput', 'keydown', function(e) {
    var keyCode = e.keyCode || e.which;
  
    if (keyCode == 9) {
      e.preventDefault();
      var start = this.selectionStart;
      var end = this.selectionEnd;
  
      // set textarea value to: text before caret + tab + text after caret
      $(this).val($(this).val().substring(0, start)
                  + "\t"
                  + $(this).val().substring(end));
  
      // put caret at right position again
      this.selectionStart =
      this.selectionEnd = start + 1;
    }
  });

let hamburger = document.querySelector(".hamburger");
const title = document.querySelector('.title')

// Side-nav event handler
hamburger.onclick = function(e) {
  e.preventDefault;
  if (hamburger.classList.contains("active")) {
    hamburger.classList.remove("active");
    hamburger.style.transform = 'translateX(0)';
    document.getElementById('sidenav').style.transform = 'translateX(-100%)';
    title.style.left = 'calc(3vh + 50px)'
  }
  else {
    hamburger.classList.add("active");
    hamburger.style.transform = 'translateX(21vw)';
    document.getElementById('sidenav').style.transform = 'translateX(0)';
    title.style.left = '3vh'
  }
}

// function Submit() {
    
// }

// let start = 0;
// let timerInterval;
let timerCont = document.getElementById('timer');
// function increaseTime() 
// function startClock() {
//     timerInterval = setInterval(function() {
//       start++;
//       if(start >= 60) {
//           if(start%60>=10) {
//               timerCont.innerHTML = "0" + Number(Math.floor(start/60)) + ':' + Number(start%60);
//           } else {
//               timerCont.innerHTML = "0" + Number(Math.floor(start/60)) + ':0' + Number(start%60);
//           }
//       } else if(start < 60 && start >= 10){
//           timerCont.innerHTML = '00:' + Number(start);
//       } else if(start < 10) {
//           timerCont.innerHTML = '00:0' + Number(start%60);
//       }
//     }, 1000);
// }

// function stopClock() {
//     clearInterval(timerInterval);
// }

// Seconds = s
// Minutes = m
// Run time function
let s = 0, m = 0;
let timerId;
function increaseTime() {
    timerId = setInterval(function() {
    if (s > 59){
      s -= 60;
      m += 1;
    } 

    if (m < 10) {
      if (s < 10) {
        timerCont.innerHTML = '0' + m + ':0' + s;
      }
      else {
        timerCont.innerHTML = '0' + m + ':' + s;
      }
    }
    else {
      if (s < 10) {
        timerCont.innerHTML = m + ':0' + s;
      }
      else {
        timerCont.innerHTML = + m + ':' + s;
      }
    }

    s++;
  }, 1000)
}

// Pause time function
function pauseTime() {
  clearInterval(timerId);
}

// Won't allow user to cheat by changing text-color
let codeIntervalId;
let clicks = 0;
const hideCode = () => {
  codeIntervalId = setInterval(() => document.getElementById('codeInput').style.color = 'black', 200)
}

const showCode = () => {
  const box = document.getElementById('codeInput')

  if (box.disabled === false) {
    // Functionality won't be achieved after two clicks
    if (clicks === 2) {
      box.disabled = true;
      alert('You have used up your time!')
      return;
    }
    else {
      // Disable button and show code for 5 seconds
      box.disabled = true;
      clearInterval(codeIntervalId);
      box.style.color = 'white';
      setTimeout(() => {
        hideCode()
        box.disabled = false;
      }, 5000)
    }
    clicks++;
    console.log(clicks)
  }
}

document.getElementById('showCode').addEventListener('click', () => {
  showCode()
})

window.onload = () => {
  // startClock();
  increaseTime()
  hideCode();
}
