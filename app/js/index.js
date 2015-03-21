/*global document*/
'use strict';
var exec = require('child_process').exec,
    child, tasks = { single:{}, jobs:{} };

function startProgress(){
	var elements = document.getElementsByTagName('*');
	for(var i=0;i<elements.length;i++){
		elements[i].style.cursor = "progress";
	}
	document.getElementById('progress').style.display = 'inline-block';
}
function stopProgress(){
	var elements = document.getElementsByTagName('*');
	for(var i=0;i<elements.length;i++){
		elements[i].style.cursor = "initial";
	}
	document.getElementById('progress').style.display = 'none';
}

function populateTasks(){
	document.getElementById('output').innerHTML += '<h2>Jobs</h2>';
	for(var task in tasks.jobs){
		var link = '<a href="#" class="btn btn-primary col-xs-2" onmouseover="showDescription(\''+task+'\')" onclick="runTask(\''+task+'\')">'+task +'</a> ';
		document.getElementById('output').innerHTML += link;
	}
	document.getElementById('output').innerHTML += '<h2>Single Tasks</h2>';
	for(var task in tasks.single){
		var link = '<a href="#" class="btn btn-primary col-xs-2" onmouseover="showDescription(\''+task+'\')" onclick="runTask(\''+task+'\')">'+task +'</a> ';
		document.getElementById('output').innerHTML += link;
	}
  	document.getElementById('tasks').style.display = 'block';
}

function runTask(taskName){
	startProgress();
	child = exec('grunt '+ taskName, { cwd: process.env.PWD },
	  function (error, stdout) {
	  	stdout = stdout.replace(/\[[0-9]+m/g, '');
	  	document.getElementById('log').innerHTML = stdout + '\n-------------------------\n\n' + document.getElementById('log').innerHTML;

	    if (error !== null) {
	      document.getElementById('log').innerHTML = error + '\n-------------------------\n\n' + document.getElementById('log').innerHTML;
	    }
	    stopProgress();
	});
}

function showDescription(taskName){
	if(tasks.single[taskName]){
		document.getElementById('desc').innerHTML = tasks.single[taskName];
	}
	if(tasks.jobs[taskName]){
		document.getElementById('desc').innerHTML = tasks.jobs[taskName];
	}
}

child = exec('grunt --help', { cwd: process.env.PWD },
  function (error, stdout) {
  	var tempTasks = {};

  	stdout = stdout.substring(stdout.indexOf('Available tasks')+15);
  	stdout = stdout.substring(0, stdout.indexOf('Tasks run in the order specified. Arguments may'));
  	stdout = stdout.split(/\s{2,2}(?=[a-zA-Z])/);
  	
  	for(var i=1;i<stdout.length;){
  		tempTasks[stdout[i++]] = stdout[i++];
  	}
  	for(var task in tempTasks){
  		if(tempTasks[task].indexOf('Alias') === 0){
  			tasks.jobs[task] = tempTasks[task];
  		}else{
			tasks.single[task] = tempTasks[task];
  		}
  	}

    populateTasks();
  	document.getElementById('loading').style.display = 'none';

    if (error !== null) {
      document.getElementById('output').innerHTML += 'exec error: ' + error;
    }
});
