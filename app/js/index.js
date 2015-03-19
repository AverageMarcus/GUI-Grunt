/*global document*/
'use strict';
var exec = require('child_process').exec,
    child;

child = exec('grunt --help', { cwd: process.env.PWD },
  function (error, stdout) {
  	//var tasks = {};
  	stdout = stdout.substring(stdout.indexOf('Available tasks')+15);
  	stdout = stdout.substring(0, stdout.indexOf('Tasks run in the order specified. Arguments may'));
  	stdout = stdout.split(/\s{2,2}(?=[a-zA-Z])/);
  	var table = '';
  	table += '<table border=1>';

  	for(var i=1;i<stdout.length;){
  		//tasks[stdout[i++]] = stdout[i++];
  		table += '<tr>';
  		table += '<td>'+stdout[i++]+'</td>';
  		table += '<td>'+stdout[i++]+'</td>';
  		table += '</tr>';
  	}
  	table += '</table>';
  	document.getElementById('output').innerHTML = table;

  	document.getElementById('tasks').style.display = 'block';
  	document.getElementById('loading').style.display = 'none';
    
    if (error !== null) {
      document.getElementById('output').innerHTML += 'exec error: ' + error;
    }
});