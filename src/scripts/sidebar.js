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

var defaultDropdownIndex = 0;

/**
 * Initialize all entries of the sidebar by attaching all of them a click-event to switch selection
 */
function initAllDropdowns() 
{
    // initiate all dropdown-menus
    var dropdown = document.getElementsByClassName("sidebar_drop_down");
    for(var i = 0; i < dropdown.length; i++) 
    {
        dropdown[i].addEventListener("click", function() 
        {
            var dropdown = document.getElementsByClassName("sidebar_drop_down");
            for(var j = 0; j < dropdown.length; j++) 
            {
                dropdown[j].nextElementSibling.style.maxHeight = "0px"; 
                dropdown[j].className = dropdown[j].className.replace(" active", "");
            }

            this.className += " active";
            var dropdownContent = this.nextElementSibling;
            dropdownContent.style.maxHeight = "200px"; 
        });
    }

    // initiate all dropdown-entries
    var dropdownEntries = document.getElementsByClassName("sidebar_dropdown_entry");
    for(var i = 0; i < dropdownEntries.length; i++) 
    {
        dropdownEntries[i].addEventListener("click", function() 
        {
            var dropdownEntries = document.getElementsByClassName("sidebar_dropdown_entry");
            for(var j = 0; j < dropdownEntries.length; j++) {
                dropdownEntries[j].className = dropdownEntries[j].className.replace(" active", "");
            }

            this.className += " active";
        });
    }
}

/**
 * Mark the first section and its first entry as marked default within the sidebar
 */
function activateDefaultSideEntry() 
{
    // mark initial dropdown-menu
    var dropdown = document.getElementsByClassName("sidebar_drop_down");
    for(var i = 0; i < dropdown.length; i++) 
    {
        dropdown[i].nextElementSibling.style.maxHeight = "0px"; 
        dropdown[i].className = dropdown[i].className.replace(" active", "");
    }

    dropdown[defaultDropdownIndex].nextElementSibling.style.maxHeight = "200px"; 
    dropdown[defaultDropdownIndex].className += " active";

    // mark initial dropdown-entry
    var dropdownEntries = document.getElementsByClassName("sidebar_dropdown_entry");
    for(var i = 0; i < dropdownEntries.length; i++) {
        dropdownEntries[i].className = dropdownEntries[i].className.replace(" active", "");
    }

    dropdownEntries[defaultDropdownIndex].className += " active";
}

/**
 * Reset all entries within the sidebar to be unmarked
 */
function resetAllSidebarEntries() 
{
    // Get all elements with class="tabcontent" and hide them
    var tabcontent = document.getElementsByClassName("tabcontent");
    for(var i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    var tablinks = document.getElementsByClassName("tablinks");
    for(i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
}

/**
 * Download REST-API-documentation. At the moment only pdf-version
 */
function downloadDocumentation_Request()
{
    const token = getAndCheckToken();
    if(token == "") {
        return;
    }
    
    const request = "/control/misaki/v1/documentation/api/rest?type=pdf";
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", request, true);
    xmlHttp.setRequestHeader("X-Auth-Token", token);

    xmlHttp.onload = function(e) 
    {
        if(xmlHttp.status != 200) {
            return "";
        }

        var decodedDocu = atob(JSON.parse(xmlHttp.responseText).documentation);

        // write data to file
        var saveByteArray = (function () {
            var a = document.createElement("a");
            document.body.appendChild(a);
            a.style = "display: none";
            return function (data, name) {
                var blob = new Blob(data, {type: "octet/stream"}),
                    url = window.URL.createObjectURL(blob);
                a.href = url;
                a.download = name;
                a.click();
                window.URL.revokeObjectURL(url);
            };
        }());

        saveByteArray([decodedDocu], 'rest_api_documentation.pdf');
    };
    xmlHttp.onerror = function(e) 
    {
        console.log("Download documentation failed.");
    };

    xmlHttp.send(null);
}

/**
 * Switch between admin- and non-admin-view in the sidebar based on the cookies
 */
function updateSidebar()
{
    // hide or show admin-section based on the Is_Admin-cookie
    if(getCookieValue("Is_Admin")) {
        document.getElementById("sidebar_admin_btn").style.display = "flex";
    } else {
        document.getElementById("sidebar_admin_btn").style.display = "none";
    }
}

/**
 * Send request to backend to create a new segmentTemplate
 */
function switchProject_request(projectId)
{
    const token = getAndCheckToken();
    if(token == "") {
        return;
    }

    // create requeset
    var payload = "{\"project_id\":\"" + projectId + "\"}";
    var switchProjectConnection = new XMLHttpRequest();
    switchProjectConnection.open("PUT", "/control/misaki/v1/token", true);
    switchProjectConnection.setRequestHeader("X-Auth-Token", token);

    // callback for success
    switchProjectConnection.onload = function(e) 
    {
        if(switchProjectConnection.status != 200) 
        {
            showErrorInModal("switch_project", switchProjectConnection.responseText);
            return false;
        }

        $("#content_div").load("/subsites/kyouko/cluster.html"); 

        var modal = document.getElementById("switch_project_modal");
        modal.style.display = "none";
    };

    // callback for fail
    switchProjectConnection.onerror = function(e) 
    {
        console.log("Failed to create segmentTemplate.");
    };

    switchProjectConnection.send(payload);
}

/**
 */
function switchProject() 
{
    fillUserProjectDropdownList("select_project_dropdown_div"); 

    var modal = document.getElementById("switch_project_modal");
    var acceptButton = document.getElementById("modal_switch_project_accept_button");
    var cancelButton = document.getElementById("modal_switch_project_cancel_button");

    // handle accept-button
    acceptButton.onclick = function() {
        switchProject_request(getDropdownValue("select_project_dropdown_div"));
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
