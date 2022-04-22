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

function initAllDropdowns() 
{
    var dropdown = document.getElementsByClassName("sidebar_drop_down");
    var i;

    for(i = 0; i < dropdown.length; i++) 
    {
        dropdown[i].addEventListener("click", function() 
        {
            var dropdown = document.getElementsByClassName("sidebar_drop_down");
            for(i = 0; i < dropdown.length; i++) {
                dropdown[i].nextElementSibling.style.maxHeight = "0px"; 
                dropdown[i].className = dropdown[i].className.replace(" active", "");
            }

            this.className += " active";
            var dropdownContent = this.nextElementSibling;
            dropdownContent.style.maxHeight = "100px"; 
        });
    }
}

function activateDefaultSideEntry() 
{
    var dropdown = document.getElementsByClassName("sidebar_drop_down");

    for(i = 0; i < dropdown.length; i++) 
    {
        dropdown[i].nextElementSibling.style.maxHeight = "0px"; 
        dropdown[i].className = dropdown[i].className.replace(" active", "");
    }

    dropdown[defaultDropdownIndex].nextElementSibling.style.maxHeight = "100px"; 
    dropdown[defaultDropdownIndex].className += " active";
}

initAllDropdowns();
activateDefaultSideEntry();

document.getElementById("misaka_user_list").addEventListener("click", function() {
	$("#content_div").load("/client/subsites/misaka/user_list.html"); 
});



