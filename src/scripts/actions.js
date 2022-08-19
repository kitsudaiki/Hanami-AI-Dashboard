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

/**
 * Open segment-template-delete-modal to ask if segment-template should really be deleted.
 * This function is named 'deleteObject' instead of 'segment-template' because it is triggered
 * by the genric delete-button of the table, which is generated in a generic way.
 *
 * @param {identifier} UUID for the segment-template to delete
 */
function deleteObject(identifier)
{
    var modal = document.getElementById("delete_modal");
    var acceptButton = document.getElementById("modal_delete_accept_button");
    var cancelButton = document.getElementById("modal_delete_cancel_button");

    document.getElementById('delete_label_text').innerText = identifier;

    // handle accept-button
    acceptButton.onclick = function() {
        deleteObject_Request(identifier);
    }

    // handle cancel-button
    cancelButton.onclick = function() {
        modal.style.display = "none";
    } 

    // handle click outside of the window
    window.onclick = function(event) 
    {
        if(event.target == modal) {
            modal.style.display = "none";
        }
    } 

    modal.style.display = "block";
}

/**
 * Create and send request to delete a segment-template from the list
 *
 * @param {uuid} UUID of the segment-template to delete
 */
function deleteObject_Request(uuid)
{
    const token = getAndCheckToken();
    if(token == "") {
        return;
    }
    
    // create requeset
    const request = deleteRequest + uuid;
    var deleteConnection = new XMLHttpRequest();
    deleteConnection.open("DELETE", request, true);
    deleteConnection.setRequestHeader("X-Auth-Token", token);

    // callback for success
    deleteConnection.onload = function(e) 
    {
        if(deleteConnection.status != 200) {
            return;
        }

        listObjects_request();
        var modal = document.getElementById("delete_modal");
        modal.style.display = "none";
    };

    // callback for fail
    deleteConnection.onerror = function(e) 
    {
        console.log("Failed to delete object.");
    };

    deleteConnection.send(null);
}

/**
 * Send request to backend to get a list of all segment-template
 */
function listObjects_request()
{
    const token = getAndCheckToken();
    if(token == "") {
        return;
    }

    var segmentTemplateListConnection = new XMLHttpRequest();
    segmentTemplateListConnection.open("GET", listRequest, true);
    segmentTemplateListConnection.setRequestHeader("X-Auth-Token", token);

    segmentTemplateListConnection.onload = function(e) 
    {
        if(segmentTemplateListConnection.status != 200) {
            return false;
        }

        const jsonContent = JSON.parse(segmentTemplateListConnection.responseText);
        constructTable(jsonContent, headerMapping, '#table');
    };
    segmentTemplateListConnection.onerror = function(e) 
    {
        console.log("Failed to load list of segment-templates.");
    };

    segmentTemplateListConnection.send(null);
}

/**
 */
function createObject() 
{
    var modal = document.getElementById("create_modal");
    var acceptButton = document.getElementById("modal_create_accept_button");
    var cancelButton = document.getElementById("modal_create_cancel_button");

    // handle accept-button
    acceptButton.onclick = function() {
        createObject_build();
    }

    // handle cancel-button
    cancelButton.onclick = function() {
        modal.style.display = "none";
    } 

    // handle click outside of the window
    window.onclick = function(event) 
    {
        if(event.target == modal) 
        {
            clearModalFields();
            modal.style.display = "none";
        }
    } 

    modal.style.display = "block";
}

/**
 * Send request to backend to create a new segmentTemplate
 */
function createObject_request(payload)
{
    const token = getAndCheckToken();
    if(token == "") {
        return;
    }

    // create requeset
    var segmentTemplateCreateConnection = new XMLHttpRequest();
    segmentTemplateCreateConnection.open("POST", createRequest, true);
    segmentTemplateCreateConnection.setRequestHeader("X-Auth-Token", token);

    // callback for success
    segmentTemplateCreateConnection.onload = function(e) 
    {
        if(segmentTemplateCreateConnection.status != 200) 
        {
            document.getElementById('create_modal_error_message').innerHTML = segmentTemplateCreateConnection.responseText;
            return false;
        }

        // handle reqponse
        var modal = document.getElementById("create_modal");
        clearModalFields();
        listObjects_request();
        modal.style.display = "none";
    };

    // callback for fail
    segmentTemplateCreateConnection.onerror = function(e) 
    {
        console.log("Failed to create segmentTemplate.");
    };

    segmentTemplateCreateConnection.send(payload);
}
