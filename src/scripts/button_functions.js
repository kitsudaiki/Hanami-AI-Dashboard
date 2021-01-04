// Apache License Version 2.0

// Copyright 2020 Tobias Anker

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

//     http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

function sendIoInput(e) 
{
    httpControlConnection.open("POST", 'http://127.0.0.1:1500/input');
	httpControlConnection.send(); 
}

function registerInput(e) 
{
    httpControlConnection.open("POST", 'http://127.0.0.1:1500/register_input');
	httpControlConnection.send("{'brickId': 1}"); 
}

function registerOutput(e) 
{
    httpControlConnection.open("POST", 'http://127.0.0.1:1500/register_output');
	httpControlConnection.send("{'brickId': 60}"); 
}

function sendLearnInput(e) 
{
	var learnInput = document.getElementById('learn_input').value; 
	var learnOutput = document.getElementById('learn_output').value; 

    httpControlConnection.open("POST", 'http://127.0.0.1:1500/learn');
	httpControlConnection.send("{'input' : '" + learnInput + "', 'should': '" + learnOutput + "'}");
}

function snapshotLearning(e) 
{
    httpControlConnection.open("POST", 'http://127.0.0.1:1500/snapshot_learning');
	httpControlConnection.send(); 
}

function reseLearning(e) 
{
    httpControlConnection.open("POST", 'http://127.0.0.1:1500/reset_learning');
	httpControlConnection.send(); 
}

function setGlobalValues(e) 
{
    httpControlConnection.open("POST", 'http://127.0.0.1:1500/set_global_values');

	var initialMemorizing = document.getElementById('initial_memorizing_value').value; 
	var memorizing = document.getElementById('memorizing_offset_value').value; 
	var sensitivity = document.getElementById('sensitivity_value').value; 
	var learning = document.getElementById('learning_value').value; 
	var glia = document.getElementById('glia_value').value; 

	httpControlConnection.send("{'initial_memorizing' : '" + initialMemorizing 
					           + "', 'memorizing' : '" + memorizing 
							   + "', 'sensitivity' : '" + sensitivity
							   + "', 'learning' : '" + learning
		                       + "', 'glia_value': '" + glia + "'}");
}

document.getElementById("register_input_button").addEventListener("click", registerInput, false);
document.getElementById("register_output_button").addEventListener("click", registerOutput, false);

document.getElementById("io_send_button").addEventListener("click", sendIoInput, false);
document.getElementById("learn_send_button").addEventListener("click", sendLearnInput, false);
document.getElementById("snapshot_learning_button").addEventListener("click", snapshotLearning, false);
document.getElementById("reset_lerning_button").addEventListener("click", reseLearning, false);

document.getElementById("set_glovalue_values_button").addEventListener("click", sendLearnInput, false);