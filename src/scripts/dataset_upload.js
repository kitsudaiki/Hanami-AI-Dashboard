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

function sendFile(websocket, file, uuid, fileUuid)
{
    protobuf.load("/libKitsunemimiHanamiMessages/protobuffers/shiori_messages.proto3", function(err, root) 
    {
        if(err) {
            throw err;
        }

        // Obtain a message type
        var FileUpload_Message = root.lookupType("FileUpload_Message");

        var segmentSize = 96 * 1024;
        var fileSize = file.size;

        for(let start = 0; start < fileSize; start += segmentSize) 
        {
            var reader = new FileReader();
            if(start + segmentSize > fileSize) {
                segmentSize = fileSize - start;
            }
            var blob = file.slice(start, segmentSize + start);
            var isLast = start + segmentSize >= fileSize;

            reader.onload = function(e) 
            {
                var payload = { 
                    datasetUuid: uuid, 
                    fileUuid: fileUuid, 
                    isLast: isLast,
                    type: 0,
                    position: start,
                    // get reeader-result and cut unnecessary  header of the resulting string
                    data: e.target.result.split(',')[1]
                };
                var errMsg = FileUpload_Message.verify(payload);
                if(errMsg) {
                    throw Error(errMsg);
                }

                // Create a new message and ncode a message to an Uint8Array (browser)
                var message = FileUpload_Message.create(payload);
                var buffer = FileUpload_Message.encode(message).finish();

                websocket.send(buffer);
            };

            // read as DataURL instead of array-buffer, 
            // because the javascript websocket seems to have problems with plain raw-data
            reader.readAsDataURL(blob);
        }
    });

    return true;
}

function sleep(ms) {
    var start = new Date().getTime(), expire = start + ms;
    while (new Date().getTime() < expire) { }
    return;
}

function waitUntilUploadComplete(uuid, token)
{
    // wait until upload completed
    var completeUploaded = false;
    while(completeUploaded == false)
    {
        // wait 500ms
        sleep(500);  
        var request = new XMLHttpRequest();
        // `false` makes the request synchronous
        request.open('GET', '/control/shiori/v1/data_set/progress?uuid=' + uuid, false); 
        request.setRequestHeader("X-Auth-Token", token);
        request.send(null);

        if(request.status !== 200) {
            return false;
        }

        const jsonContent = JSON.parse(request.responseText);
        completeUploaded = jsonContent.complete;
    }

    return true;
}

function sendCsvFiles(websocket, uuid, file, fileUuid)
{
    const token = getAndCheckToken();
    if(token == "") {
        return false;
    }
    
    websocket.onopen = function () {
        console.log("WebSocket open")
        const initialMsg = "{\"token\":\"" + token + "\",\"target\":\"shiori\"}";
        websocket.send(initialMsg);
    };
    
    websocket.onerror = function () {
        console.log("WebSocket failed!");
    };
    
    websocket.onmessage = function(event) {
        var reader = new FileReader();
        reader.onload = function() {
            console.log("Data received from server: " + reader.result);
        }
        reader.readAsText(event.data);
         
        if(sendFile(websocket, file, uuid, fileUuid) == false) {
            return false;
        }
    };

    if(waitUntilUploadComplete(uuid, token) == false) {
        return false;
    }

    return true;
}

function finishCsvUpload(uuid, inputUuid, token)
{
    // finish upload
    var request = new XMLHttpRequest();
    // `false` makes the request synchronous
    request.open('PUT', '/control/shiori/v1/csv/data_set', false);  
    request.setRequestHeader("X-Auth-Token", token);
    var jsonBody = "{\"uuid\":\"" + uuid 
                   + "\",\"uuid_input_file\":\"" + inputUuid + "\"}";
    request.send(jsonBody);

    if(request.status !== 200) {
        return false;
    }

    return true;
}

function uploadCsvDataset(token)
{
    // clear error-label to remove the error of an old session
    document.getElementById('create_modal_error_message').innerHTML = "";

    const name = document.getElementById('name_field_csv').value;
    const inputFile = document.getElementById('input_file_field_csv').files[0];

    if(name == "") 
    {
        document.getElementById('create_modal_error_message').innerHTML = "Name is missing";
        return;
    }

    if(inputFile.name == "") 
    {
        document.getElementById('create_modal_error_message').innerHTML = "Input-file is missing";
        return;
    }
   
    // create request-content
    var reqContent = "{name:\"" + name;
    reqContent += "\",input_data_size:" + inputFile.size + "}";

    // create requeset
    const request = "/control/shiori/v1/csv/data_set";
    var datasetCreateConnection = new XMLHttpRequest();
    datasetCreateConnection.open("POST", request, true);
    datasetCreateConnection.setRequestHeader("X-Auth-Token", token);

    // callback for success
    datasetCreateConnection.onload = function(e) 
    {
        if(datasetCreateConnection.status != 200) 
        {
            document.getElementById('create_modal_error_message').innerHTML 
                = datasetCreateConnection.responseText;
            return false;
        }

        const jsonContent = JSON.parse(datasetCreateConnection.responseText);
        const uuid = jsonContent.uuid;
        const inputFileUuid = jsonContent.uuid_input_file;

        var websocket = new WebSocket('wss://' + location.host);
        if(sendCsvFiles(websocket, uuid, inputFile, inputFileUuid) == false) {
            return false;
        }

        if(finishCsvUpload(uuid, inputFileUuid, token) == false) {
            return false;
        }

        // handle reqponse
        var modal = document.getElementById("create_modal");
        clearModalFields();
        listObjects_request();
        modal.style.display = "none";
    };

    // callback for fail
    datasetCreateConnection.onerror = function(e) 
    {
        console.log("Failed to create dataset.");
    };

    datasetCreateConnection.send(reqContent);
}

function sendMnistFiles(websocket, uuid, inputFile, labelFile, inputFileUuid, labelFileUuid)
{
    const token = getAndCheckToken();
    if(token == "") {
        return false;
    }
    
    websocket.onopen = function () {
        console.log("WebSocket open")
        const initialMsg = "{\"token\":\"" + token + "\",\"target\":\"shiori\"}";
        websocket.send(initialMsg);
    };
    
    websocket.onerror = function () {
        console.log("WebSocket failed!");
    };
    
    websocket.onmessage = function(event) {
        var reader = new FileReader();
        reader.onload = function() {
            console.log("Data received from server: " + reader.result);
        }
        reader.readAsText(event.data);
         
        if(sendFile(websocket, inputFile, uuid, inputFileUuid) == false) {
            return false;
        }
        if(sendFile(websocket, labelFile, uuid, labelFileUuid) == false) {
            return false;
        }
    };

    if(waitUntilUploadComplete(uuid, token) == false) {
        return false;
    }

    return true;
}

function finishMnistUpload(uuid, inputUuid, labelUuid, token)
{
    // finish upload
    var request = new XMLHttpRequest();
    // `false` makes the request synchronous
    request.open('PUT', '/control/shiori/v1/mnist/data_set', false);  
    request.setRequestHeader("X-Auth-Token", token);
    var jsonBody = "{\"uuid\":\"" + uuid 
                   + "\",\"uuid_input_file\":\"" + inputUuid 
                   + "\",\"uuid_label_file\":\"" + labelUuid + "\"}";
    request.send(jsonBody);

    if(request.status !== 200) {
        return false;
    }

    return true;
}

function uploadMnistDataset(token)
{
    // clear error-label to remove the error of an old session
    document.getElementById('create_modal_error_message').innerHTML = "";

    const name = document.getElementById('name_field_mnist').value;
    const inputFile = document.getElementById('input_file_field_mnist').files[0];
    const labelFile = document.getElementById('label_file_field_mnist').files[0];

    if(name == "") 
    {
        document.getElementById('create_modal_error_message').innerHTML = "Name is missing";
        return;
    }

    if(inputFile.name == "") 
    {
        document.getElementById('create_modal_error_message').innerHTML = "Input-file is missing";
        return;
    }
   
    if(labelFile.name == "") 
    {
        document.getElementById('create_modal_error_message').innerHTML = "Label-file is missing";
        return;
    }

    // create request-content
    var reqContent = "{\"name\":\"" + name 
                     + "\",\"input_data_size\":" + inputFile.size 
                     + ",\"label_data_size\":" + labelFile.size + "}";

    // create requeset
    const request = "/control/shiori/v1/mnist/data_set";
    var datasetCreateConnection = new XMLHttpRequest();
    datasetCreateConnection.open("POST", request, true);
    datasetCreateConnection.setRequestHeader("X-Auth-Token", token);

    // callback for success
    datasetCreateConnection.onload = function(e) 
    {
        if(datasetCreateConnection.status != 200) 
        {
            document.getElementById('create_modal_error_message').innerHTML 
                = datasetCreateConnection.responseText;
            return false;
        }

        const jsonContent = JSON.parse(datasetCreateConnection.responseText);
        const uuid = jsonContent.uuid;
        const inputFileUuid = jsonContent.uuid_input_file;
        const labelFileUuid = jsonContent.uuid_label_file;

        var websocket = new WebSocket('wss://' + location.host);
        if(sendMnistFiles(websocket, uuid, inputFile, labelFile, inputFileUuid, labelFileUuid) == false) {
            return false;
        }

        if(finishMnistUpload(uuid, inputFileUuid, labelFileUuid, token) == false) {
            return false;
        }

        // handle reqponse
        var modal = document.getElementById("create_modal");
        clearModalFields();
        listObjects_request();
        modal.style.display = "none";
    };

    // callback for fail
    datasetCreateConnection.onerror = function(e) 
    {
        console.log("Failed to create dataset.");
    };

    datasetCreateConnection.send(reqContent);
}
