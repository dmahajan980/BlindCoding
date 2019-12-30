// var request = require('request');

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

const setCode = (prog)=>{
  code = prog;
};

const getCode = () => {
  return code;
};


const setLanguage = (langNum) => {
  langNo = langNum;
};

const getLanguage = () => {
  return langNo;
};


const setVersion = (vrsn) => {
  versionNo = vrsn;
};

const getVersion = () => {
  return versions[versionNo];
}

const setCustomInput = (inp)=>{
  input = inp;
}

const getCustomInput = ()=>{
  return input;
}

const setOutput = (outp) => {
  console.log('Result:',outp);
  output = outp;
};

const getOutput = () => {
  return output;
};

const runCode = () => {

  let prog = document.getElementById("codeInput").value;
  setCode(prog);

  let lang = document.getElementById("langSelect").value;
  setLanguage(lang);

  console.log('Language: ',getLanguage(),'code: ',getCode());


  var program = {
      script : getCode(),
      language: getLanguage(),
      versionIndex: getVersion(),
      clientId: "222a2ef84f6881409d32ae21369d1a32",
      clientSecret:"67872757630a355db890ee74b6b20926cb9e025dbb444182df2bd2700fc64af1",
      stdin: getCustomInput() //to give custom input
  };

  //just send this object to jdoodle url and send back the response
  // for all test cases backend checks the output and returns no of test cases cleared
  let resp = sendRequest('POST','https://api.jdoodle.com/execute',program);
  setOutput(resp.output);

  document.getElementById("compilerOutput").value = getOutput();
};


const sendRequest = (method,url,data) => {
  var ourRequest = new XMLHttpRequest();
  ourRequest.open(method,url, true);
  ourRequest.setRequestHeader("Content-type", "application/json");
  ourRequest.onload = function() {
    if (ourRequest.status >= 200 && ourRequest.status < 400) {
      // console.log('output: ');
      let recievedData = JSON.parse(ourRequest.responseText);
      return recievedData;
    } else {
      // Nothing
    }
  }
  ourRequest.onerror = function() {
    // Nothing
  }
  console.log(JSON.stringify(data));
  ourRequest.send(JSON.stringify(data));
};


const getQuestion = (queNum) => {
  let data = {
    queNum : queNum
  };
  let recievedData = sendRequest('GET','/question',JSON.stringify(data));
  //format -- Question:
  // sample input:
  // sample output:
  // score of that question
};