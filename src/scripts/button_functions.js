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

function openFile(e) 
{
	console.log("openFile");
	var modal = document.getElementById("open_modal");
	var span = document.getElementById("close_open_modal");

	// When the user clicks on <span> (x), close the modal
	span.onclick = function() {
		modal.style.display = "none";
	}

	// When the user clicks anywhere outside of the modal, close it
	window.onclick = function(event) {
		if (event.target == modal) {
			modal.style.display = "none";
		}
	} 

	modal.style.display = "block";
}


function handleFileSelect(e) 
{
	var reader = new FileReader();
	reader.readAsText(document.getElementById("file_chooser").files[0]);
	reader.onload = function (oFREvent) {
        var fileContent = reader.result;
        // TODO: load-function
        console.log("poipoipoi: " + fileContent);
    };
}

function downloadFile(e) 
{
	console.log("downloadFile");

	// Check for the various File API support.
	if(window.File 
		&& window.FileReader 
		&& window.Blob) 
	{
		var modal = document.getElementById("download_modal");
		var span = document.getElementById("close_download_modal");

		// When the user clicks on <span> (x), close the modal
		span.onclick = function() {
			modal.style.display = "none";
		}

		// When the user clicks anywhere outside of the modal, close it
		window.onclick = function(event) {
			if (event.target == modal) {
				modal.style.display = "none";
			}
		} 

		modal.style.display = "block";
	} 
	else 
	{
	   	alert('The File APIs are not fully supported in this browser.');
	}
}

function uploadFile(e) 
{
	console.log("uploadFile");
	var modal = document.getElementById("upload_modal");
	var span = document.getElementById("close_upload_modal");

	// When the user clicks on <span> (x), close the modal
	span.onclick = function() {
		modal.style.display = "none";
	}

	// When the user clicks anywhere outside of the modal, close it
	window.onclick = function(event) {
		if (event.target == modal) {
			modal.style.display = "none";
		}
	} 

	modal.style.display = "block";
}

document.getElementById("open_button").addEventListener("click", openFile, false);
document.getElementById("download_button").addEventListener("click", downloadFile, false);
document.getElementById("upload_button").addEventListener("click", uploadFile, false);
document.getElementById("file_loader").addEventListener("click", handleFileSelect, false);
