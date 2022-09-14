var defaultDropdownIndex = 0;

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
            dropdownContent.style.maxHeight = "100px"; 
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

function activateDefaultSideEntry() 
{
    // mark initial dropdown-menu
    var dropdown = document.getElementsByClassName("sidebar_drop_down");
    for(var i = 0; i < dropdown.length; i++) 
    {
        dropdown[i].nextElementSibling.style.maxHeight = "0px"; 
        dropdown[i].className = dropdown[i].className.replace(" active", "");
    }

    dropdown[defaultDropdownIndex].nextElementSibling.style.maxHeight = "100px"; 
    dropdown[defaultDropdownIndex].className += " active";

    // mark initial dropdown-entry
    var dropdownEntries = document.getElementsByClassName("sidebar_dropdown_entry");
    for(var i = 0; i < dropdownEntries.length; i++) {
        dropdownEntries[i].className = dropdownEntries[i].className.replace(" active", "");
    }

    dropdownEntries[defaultDropdownIndex].className += " active";
}

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

        // console.log("DownloadDocumentation_Request: " + xmlHttp.responseText);
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

function updateSidebar()
{
    // hide or show admin-section based on the Is_Admin-cookie
    if(getCookieValue("Is_Admin")) {
        document.getElementById("sidebar_admin_btn").style.display = "flex";
    } else {
        document.getElementById("sidebar_admin_btn").style.display = "none";
    }
}
