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
        if(deleteConnection.status != 200) 
        {
            showErrorInModal("delete", createRequestConnection.responseText);
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
function listObjects_request(additionalButton = "")
{
    const token = getAndCheckToken();
    if(token == "") {
        return;
    }

    var listRequestConnection = new XMLHttpRequest();
    listRequestConnection.open("GET", listRequest, true);
    listRequestConnection.setRequestHeader("X-Auth-Token", token);

    listRequestConnection.onload = function(e) 
    {
        if(listRequestConnection.status != 200) 
        {
            // TODO: error-popup
            return false;
        }

        const jsonContent = JSON.parse(listRequestConnection.responseText);
        constructTable(jsonContent, headerMapping, '#table', additionalButton);
    };
    listRequestConnection.onerror = function(e) 
    {
        console.log("Failed to load list of segment-templates.");
    };

    listRequestConnection.send(null);
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
    var createRequestConnection = new XMLHttpRequest();
    createRequestConnection.open("POST", createRequest, true);
    createRequestConnection.setRequestHeader("X-Auth-Token", token);

    // callback for success
    createRequestConnection.onload = function(e) 
    {
        if(createRequestConnection.status != 200) 
        {
            showErrorInModal("create", createRequestConnection.responseText);
            return false;
        }

        // handle reqponse
        var modal = document.getElementById("create_modal");
        clearModalFields();
        listObjects_request();
        modal.style.display = "none";
    };

    // callback for fail
    createRequestConnection.onerror = function(e) 
    {
        console.log("Failed to create segmentTemplate.");
    };

    createRequestConnection.send(payload);
}

function fillDropdownList(target, dropdownListRequest)
{     
    const token = getAndCheckToken();
    if(token == "") {
        return;
    }

    var listRequestConnection = new XMLHttpRequest();
    listRequestConnection.open("GET", dropdownListRequest, true);
    listRequestConnection.setRequestHeader("X-Auth-Token", token);

    listRequestConnection.onload = function(e) 
    {
        if(listRequestConnection.status != 200) 
        {
            showErrorInModal("create", listRequestConnection.responseText);
            return false;
        }

        // prepare container for the dropdown-menu
        var select = document.createElement("select");
        select.name = target + "_select";
        select.id = target + "_select";

        var idPos = 0;
        var namePos = 0;

        const content = JSON.parse(listRequestConnection.responseText);

        // search for the column, which has the title "name" and get its position
        const headerContent = content.header;
        for(var i = 0; i < headerContent.length; i++) 
        {
            if(headerContent[i] === "name") 
            {
                namePos = i;
                break;
            } 
        }

        // fill menu with name and id of all entries
        const bodyContent = content.body;
        for(var row = 0; row < bodyContent.length; row++) 
        {
            const id = bodyContent[row][idPos];
            const name = bodyContent[row][namePos];

            var option = document.createElement("option");
            option.value = id;
            option.text = name + "   ( " + id + " )";
            select.appendChild(option);
        }

        document.getElementById(target).appendChild(select);
    };
    listRequestConnection.onerror = function(e) 
    {
        console.log("Failed to load list of segment-templates.");
    };

    listRequestConnection.send(null);
}

function fillStaticDropdownList(target, values)
{     
    var select = document.createElement("select");
    select.name = target + "_select";
    select.id = target + "_select";
 
    for(const val of values)
    {
        var option = document.createElement("option");
        option.value = val;
        option.text = val;
        select.appendChild(option);
    }
 
    document.getElementById(target).appendChild(select);
}

function getDropdownValue(target)
{
    var e = document.getElementById(target + "_select");
    return e.options[e.selectedIndex].value;
}