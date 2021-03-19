let ctrlDown = false;
let ctrlKey = 17, cmdKey = 91, vKey = 86, cKey = 67;
let qNo = 0;
let languageIDs = JSON.parse("[{\"id\":45,\"name\":\"Assembly (NASM 2.14.02)\"},{\"id\":46,\"name\":\"Bash (5.0.0)\"},{\"id\":47,\"name\":\"Basic (FBC 1.07.1)\"},{\"id\":48,\"name\":\"C (GCC 7.4.0)\"},{\"id\":52,\"name\":\"C++ (GCC 7.4.0)\"},{\"id\":49,\"name\":\"C (GCC 8.3.0)\"},{\"id\":53,\"name\":\"C++ (GCC 8.3.0)\"},{\"id\":50,\"name\":\"C (GCC 9.2.0)\"},{\"id\":54,\"name\":\"C++ (GCC 9.2.0)\"},{\"id\":51,\"name\":\"C# (Mono 6.6.0.161)\"},{\"id\":55,\"name\":\"Common Lisp (SBCL 2.0.0)\"},{\"id\":56,\"name\":\"D (DMD 2.089.1)\"},{\"id\":57,\"name\":\"Elixir (1.9.4)\"},{\"id\":58,\"name\":\"Erlang (OTP 22.2)\"},{\"id\":44,\"name\":\"Executable\"},{\"id\":59,\"name\":\"Fortran (GFortran 9.2.0)\"},{\"id\":60,\"name\":\"Go (1.13.5)\"},{\"id\":61,\"name\":\"Haskell (GHC 8.8.1)\"},{\"id\":62,\"name\":\"Java (OpenJDK 13.0.1)\"},{\"id\":63,\"name\":\"JavaScript (Node.js 12.14.0)\"},{\"id\":64,\"name\":\"Lua (5.3.5)\"},{\"id\":65,\"name\":\"OCaml (4.09.0)\"},{\"id\":66,\"name\":\"Octave (5.1.0)\"},{\"id\":67,\"name\":\"Pascal (FPC 3.0.4)\"},{\"id\":68,\"name\":\"PHP (7.4.1)\"},{\"id\":43,\"name\":\"Plain Text\"},{\"id\":69,\"name\":\"Prolog (GNU Prolog 1.4.5)\"},{\"id\":70,\"name\":\"Python (2.7.17)\"},{\"id\":71,\"name\":\"Python (3.8.1)\"},{\"id\":72,\"name\":\"Ruby (2.7.0)\"},{\"id\":73,\"name\":\"Rust (1.40.0)\"},{\"id\":74,\"name\":\"TypeScript (3.7.4)\"}]");
let timerCont = document.getElementById('timer');
let s = 0, m = 0;
let timerId;
const _totalNumQues = 5;
let codeMap= new Map();

$(document).ready(function() {
  for(var i=0; i<_totalNumQues; i++){
    codeMap.set(i, null)
  }
  populateLangs();
  getQuestion(0);
  disableCopyPaste();
  leaderbInit();
  increaseTime();
  hideCode();
  addResizeEvent();
  showBtnInit();
  sideNavInit();
});

function showBtnInit(){
  document.getElementById('showCode').addEventListener('click', () => {
    showCode()
  });
}

function addResizeEvent(){
  window.onresize = function() {
    if ((window.outerHeight - window.innerHeight) > 100) {
      logout('screen-resize')
    }
  }
}

function leaderbInit(){
  let i = 0;  
  $('.leaderboard-icon').click(function() {
    $('.leaderboard').fadeToggle(650, "swing");
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
  });
}
function disableCopyPaste(){
  var inp = document.getElementsByClassName('noselect')[0];
  inp.addEventListener('select', function() {
    this.selectionStart = this.selectionEnd;
  }, false);
  document.addEventListener('contextmenu', event => event.preventDefault());
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
}

function populateLangs()
{
  console.log('populating languages...');
  
  let selectField = document.getElementById('langSelect');
  for(element of languageIDs)
  {
     var opt = document.createElement("option");
     opt.value= element['id'];
     opt.innerHTML = element['name'];
     selectField.appendChild(opt);
  }
}

function logout(reason){
  if(reason == 'Finished'){
    Swal.fire(
      'Congratulations',
      'You have successfully attempted all the questions',
      'success'
    );
  }
  else if(reason == 'screen-resize'){
    Swal.fire(
      'Sorry',
      "You will be logged out since you didn't follow the instructions",
      'error'
    );
  }
  window.location.href = "/logout";
}

function resetTime(){
  s = 0;
  m = 0;
}

function setOutput(outp) {
  document.getElementById("compilerOutput").value = outp;
}

function setScore(score){
  document.getElementById('score').innerHTML = score;
}

function getOutput(){
  return document.getElementById("compilerOutput").value;
}

function increaseQNum(){
  qNo = (getQNum() + 1) % _totalNumQues;
}

function getQNum() { 
  return qNo;
}

function getCode(){
  return document.getElementById("codeInput").value;
}

function getLanguage(){
  return document.getElementById("langSelect").value;
}

function disableRun(){
  document.getElementById('runBtn').disabled = true;
}

function enableRun(){
  document.getElementById('runBtn').disabled = false;
}

function runCode(){
  disableRun();
  pauseTime();
  console.log(`Time elapsed is: ${m} minutes and ${s} seconds`);

  let prog = getCode();

  let lang = getLanguage();

  let time = m * 60 + s;

  let program = {
      source_code : prog,
      language_id: lang,
      qNo: getQNum(),
      timeElapsed: time
  };

  sendRequest('POST', 'runCode/', program).then(
    function(response){
      response = JSON.parse(response);
      console.log('Compiler Call Response: ', response);
      setOutput(response['stdout']);
      setScore(response['score']);
      if(getOutput() == 'Correct Answer')
      {
        if(response['completedGame'] == 'true'){
          logout('Finished');
        }
        resetTime();
        increaseQNum();
        getQuestion(qNo);
      }
      increaseTime();
      enableRun();
    }
  ).catch(
    function(error){
      increaseTime();
      enableRun();
      console.error(error);
    }
  );
}

function getCookie(name) {
  var v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
  return v ? v[2] : null;
}

function sendRequest(type, url, data){
  let request = new XMLHttpRequest();
  let csrftoken = getCookie("csrftoken");
  return new Promise(function(resolve, reject){
      request.onreadystatechange = () => {
          if (request.readyState !== 4) return;
          // Process the response
    if (request.status >= 200 && request.status < 300) {
              // If successful
      resolve(request.responseText);
    } else {
      // If failed
      reject({
        status: request.status,
        statusText: request.statusText
      });
    }
      };
      // Setup our HTTP request
  request.open(type || "GET", url, true);
      // Add csrf token
      request.setRequestHeader("X-CSRFToken", csrftoken);
      // Send the request
      request.send(JSON.stringify(data));
  });
  
}

function getQuestion(queNum){

  codeMap.set(qNo, getCode())
  sendRequest('POST', '/question/', { queNum }).then(
    function(response){
      response = JSON.parse(response);
        let inpt = response['sampIn'].split(' ');
        let inStr = '';
        for(let i = 0; i < inpt.length;i++)
        {
          inStr += inpt[i];
          inStr += '\n';
        }
        let que = response['question'] + '<br><br>'+'Sample Input'+'<br>'+response['sampTCNum']+'<br>'+inStr+'<br><br>'+'Sample Output'+'<br>'+response['sampleOut'];
        document.getElementsByClassName('qno')[0].innerHTML='Q. '+(queNum+1);
        document.getElementsByClassName('left')[0].innerHTML=que;
        qNo = response['qNo'];
        document.getElementById('score').innerHTML = response['userScore'];
        var s= document.getElementById("codeInput");
        s.value= codeMap.get(queNum)
    }
  ).catch(
    function(error){
      increaseTime();
      console.error(error);
    }
  );
}

function login() {
  sendRequest('POST', 'login/', '').then(
    function(resp){
      console.log(resp);
    }
  ).catch(
    function(error){
      console.error(error);
    }
  );
}

function showInstructions() {
    document.getElementsByClassName('instructions')[0].style.display = 'flex';
    document.getElementsByClassName('backdrop')[0].style.display = 'block';
}

function closeInstructions() {
    document.getElementsByClassName('instructions')[0].style.display = 'none';
    document.getElementsByClassName('backdrop')[0].style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('select');
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

function sideNavInit(){
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
}

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
  codeIntervalId = setInterval(() => document.getElementById('codeInput').style.color = 'black', 200);
}

function increaseClicks(){
  pauseTime();
  let data = {
    'clicks' : clicks+1
  };
  sendRequest('POST', '/increaseClicks/', data).then(
    function(response){
      increaseTime();
    }
  ).catch(
    function(error){
      increaseTime();
      console.error(error);
    }
  );
}

const showCode = () => {
  pauseTime();
  sendRequest('GET', '/getChancesUsed/', null).then(
    function(response){
      response = JSON.parse(response);
      clicks = response['chancesUsed'];
      const box = document.getElementById('codeInput');
      if (box.disabled === false) {
        // Functionality won't be achieved after two clicks
        if (clicks >= 2) {
          // box.disabled = false;
          // alert('You have used up your time!');
          Swal.fire(
            'Sorry..',
            'You have used up your time!',
            'error'
          );
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
          }, 5000);
        }
        increaseClicks();
      }
      else{
        // alert('You have used up your time!');
        Swal.fire(
          'Sorry..',
          'You have used up your time!',
          'error'
        );
      }
    }
  ).catch(
    function(error){
      increaseTime();
      console.error(error);
    }
  );
}
$(document).ready(function(){
  $('select').formSelect();
});