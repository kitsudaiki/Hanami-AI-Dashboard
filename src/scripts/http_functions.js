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

// get host-path and remove port if exist


var hostUrl = window.location.host;
var hostUrlWithoutPort = hostUrl.split(":")[0];

const httpConnection = new XMLHttpRequest();
const url='http://' + hostUrl + '/websocket';
httpConnection.open("GET", url);
httpConnection.send();

httpConnection.addEventListener("progress", updateProgress);
httpConnection.addEventListener("load", transferComplete);
httpConnection.addEventListener("error", transferFailed);
httpConnection.addEventListener("abort", transferCanceled);

function updateProgress(event) 
{
}

function transferComplete(event) 
{
    console.log("The transfer is complete.");
    console.log(httpConnection.responseText);
    var jsonResponse = JSON.parse(httpConnection.responseText);

    window.WebSocket = window.WebSocket || window.MozWebSocket;
    console.log(jsonResponse["port"]);
    var websocket = new WebSocket('ws://' + hostUrlWithoutPort + ':' + jsonResponse["port"], 'dumb-increment-protocol');

    websocket.onopen = function () {
        console.log("WebSocket open")
    };

    websocket.onerror = function () {
        console.log("WebSocket failed!");
    };

    websocket.onmessage = websocketMessageProcessing;
}

function transferFailed(event) 
{
    console.log("An error occurred while transferring the file.");
}

function transferCanceled(event)
{
    console.log("The transfer has been canceled by the user.");
}
