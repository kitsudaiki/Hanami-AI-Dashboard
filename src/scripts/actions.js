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
 * Generic function to open and handle the 
 *
 * @param {identifier} ID or UUID of the entry, which should be deleted
 */
function deleteObject(identifier)
{
    var modal = document.getElementById("delete_modal");
    var acceptButton = document.getElementById("modal_delete_accept_button");
    var cancelButton = document.getElementById("modal_delete_cancel_button");

    document.getElementById('delete_label_text').innerText = identifier;

    // handle accept-button
    acceptButton.onclick = function() {
        deleteObject_request(identifier);
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
function deleteObject_request(uuid)
{
    // get and check token
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
function listObjects_request()
{
    // get and check token
    const token = getAndCheckToken();
    if(token == "") {
        return;
    }

    // create requeset
    var listRequestConnection = new XMLHttpRequest();
    listRequestConnection.open("GET", listRequest, true);
    listRequestConnection.setRequestHeader("X-Auth-Token", token);

    // callback for success
    listRequestConnection.onload = function(e) 
    {
        if(listRequestConnection.status != 200) 
        {
            // TODO: error-popup
            return false;
        }

        const jsonContent = JSON.parse(listRequestConnection.responseText);
        constructTable(jsonContent, headerMapping, '#table', additionalButtons);
    };

    // callback for fail
    listRequestConnection.onerror = function(e) 
    {
        console.log("Failed to load list of segment-templates.");
    };

    listRequestConnection.send(null);
}

/**
 * handle modal to create object
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
function createObject_request(payload, requestPath, modalDiv)
{
    const token = getAndCheckToken();
    if(token == "") {
        return;
    }

    // create requeset
    var createRequestConnection = new XMLHttpRequest();
    createRequestConnection.open("POST", requestPath, true);
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
        clearModalFields();
        listObjects_request();

        var modal = document.getElementById(modalDiv);
        modal.style.display = "none";
    };

    // callback for fail
    createRequestConnection.onerror = function(e) 
    {
        console.log("Failed to create segmentTemplate.");
    };

    createRequestConnection.send(payload);
}

function fillDropdownList(dropdownDiv, dropdownListRequest)
{     
    // get and check token
    const token = getAndCheckToken();
    if(token == "") {
        return;
    }

    // create requeset
    var listRequestConnection = new XMLHttpRequest();
    listRequestConnection.open("GET", dropdownListRequest, true);
    listRequestConnection.setRequestHeader("X-Auth-Token", token);

    // callback for success
    listRequestConnection.onload = function(e) 
    {
        if(listRequestConnection.status != 200) 
        {
            showErrorInModal("create", listRequestConnection.responseText);
            return false;
        }

        // remove the old dropdown-list to create a new one
        const dropdownNode = document.getElementById(dropdownDiv);
        dropdownNode.innerHTML = '';

        // prepare container for the dropdown-menu
        var select = document.createElement("select");
        select.name = dropdownDiv + "_select";
        select.id = dropdownDiv + "_select";

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

        document.getElementById(dropdownDiv).appendChild(select);
    };

    // callback for fail
    listRequestConnection.onerror = function(e) 
    {
        console.log("Failed to load list of segment-templates.");
    };

    listRequestConnection.send(null);
}

function fillStaticDropdownList(dropdownDiv, values)
{     
    // remove the old dropdown-list to create a new one
    const dropdownNode = document.getElementById(dropdownDiv);
    dropdownNode.innerHTML = '';

    // prepare container for the dropdown-menu
    var select = document.createElement("select");
    select.name = dropdownDiv + "_select";
    select.id = dropdownDiv + "_select";
 
    // fill static values into dropdown-menu
    for(const val of values)
    {
        var option = document.createElement("option");
        option.value = val;
        option.text = val;
        select.appendChild(option);
    }
 
    document.getElementById(dropdownDiv).appendChild(select);
}

/**
 * Fill dropdown-menu with all projects, which are assigned to the actual user
 *
 * @param {dropdownDiv} ID of the dev, which should be filled with projects of the user
 */
function fillUserProjectDropdownList(dropdownDiv)
{
    // get and check token
    const authToken = getCookieValue("Auth_JWT_Token");
    if(authToken == "") {
        return;
    }

    // create requeset
    var listRequestConnection = new XMLHttpRequest();
    listRequestConnection.open("GET", "/control/misaki/v1/project/user", true);
    listRequestConnection.setRequestHeader("X-Auth-Token", authToken);

    // callback for success
    listRequestConnection.onload = function(e) 
    {
        if(listRequestConnection.status != 200) 
        {
            showErrorInModal("create", listRequestConnection.responseText);
            return false;
        }

        // remove the old dropdown-list to create a new one
        const dropdownNode = document.getElementById(dropdownDiv);
        dropdownNode.innerHTML = '';

        // prepare container for the dropdown-menu
        var select = document.createElement("select");
        select.name = dropdownDiv + "_select";
        select.id = dropdownDiv + "_select";

        const content = JSON.parse(listRequestConnection.responseText);

        // fill menu with name and id of all entries
        const projectList = content.projects;
        for(var row = 0; row < projectList.length; row++) 
        {
            const id = projectList[row].project_id;
            const role = projectList[row].role
            const isProjectAdmin = projectList[row].is_project_admin

            var option = document.createElement("option");
            option.value = id;
            option.text = id + " | " + role ;

            if(isProjectAdmin) {
                option.text += "  (Project-Admin)"
            }

            select.appendChild(option);
        }

        document.getElementById(dropdownDiv).appendChild(select);

    };

    // callback for fail
    listRequestConnection.onerror = function(e) 
    {
        console.log("Failed to load projects of user.");
    };

    listRequestConnection.send(null);
}

/**
 * Get selected value of a specific dropdown-menu
 *
 * @param {dropdownDiv} ID of the dev, which contains the requested dropdown-menu
 */
function getDropdownValue(dropdownDiv)
{
    var e = document.getElementById(dropdownDiv + "_select");
    return e.options[e.selectedIndex].value;
}
