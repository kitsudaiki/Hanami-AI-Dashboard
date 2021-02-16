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
	var ioInput = document.getElementById('io_input').value; 

    httpControlConnection.open("POST", "http://" + window.location.host + "/control/set_input");
    httpControlConnection.send("{'input' : '" + ioInput + "'}");
	httpControlConnection.send(); 
}

function sendLearnInput(e) 
{
	var learnInput = document.getElementById('learn_input').value; 
	var learnOutput = document.getElementById('learn_output').value; 

    httpControlConnection.open("POST", "http://" + window.location.host + "/control/learn");
	httpControlConnection.send("{'input' : '" + learnInput + "', 'should': '" + learnOutput + "'}");
}

document.getElementById("io_send_button").addEventListener("click", sendIoInput, false);
document.getElementById("learn_button").addEventListener("click", sendLearnInput, false);
