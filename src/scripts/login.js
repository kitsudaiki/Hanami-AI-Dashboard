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

function getAuthCookie() 
{
	const cn = "Auth_JWT_Token=";
	const idx = document.cookie.indexOf(cn)

	if (idx != -1) 
	{
		var end = document.cookie.indexOf(";", idx + 1);
		if (end == -1) end = document.cookie.length;
		return document.cookie.substring(idx + cn.length, end);
	} 
	else 
	{
		return "";
	}
}

function deleteAllCookies() 
{
    const cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
        document.cookie = cookies[i] + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}

function loginRequest(user, pw)
{
    const request = "/control/misaka/v1/token";

	var reqContent = "{\"name\":\"" + user;
	reqContent += "\",\"password\":\"" + pw;
	reqContent += "\"}";

	var loginConnection = new XMLHttpRequest();
    loginConnection.open("POST", request, true);

	loginConnection.onload = function(e) 
	{
		if(loginConnection.status != 200) {
			return false;
		}
	
		console.log("login successful");
		const responseJson = JSON.parse(loginConnection.responseText);
		// TODO: check if json-parsing is successful
		document.cookie = "Auth_JWT_Token=" + responseJson.token + "; SameSite=Strict; Secure";
	
		document.getElementById("login_name_field").value = "";
		document.getElementById("login_pw_field").value = "";
	
		var modal = document.getElementById("login_modal");
		modal.style.display = "none";
	};
	
	loginConnection.onerror = function(e) 
	{
		document.getElementById("login_name_field").value = "";
		document.getElementById("login_pw_field").value = "";
	
		console.log("An error occurred while transferring the file.");
	};

    loginConnection.send(reqContent);
}

function tokenCheckRequest(token)
{
    const request = "/control/misaka/v1/auth?token=" + token;

	var authConnection = new XMLHttpRequest();
    authConnection.open("GET", request, true);
	authConnection.setRequestHeader("X-Auth-Token", token);

	authConnection.onload = function(e) 
	{
		if(authConnection.status != 200) 
		{
			console.log("token-check failed");
			login();
		}
	};
	authConnection.onerror = function(e) 
	{
		login();
	};

    authConnection.send(null);
}

function login() 
{
	console.log("login");
	deleteAllCookies();

	var modal = document.getElementById("login_modal");
	var loginButton = document.getElementById("modal_login_button");

	// handle login-button
	loginButton.onclick = function() 
	{
		const userName = document.getElementById("login_name_field").value;
		const pw = document.getElementById("login_pw_field").value;
		loginRequest(userName, pw);
	}

	modal.style.display = "block";
}

function getAndCheckToken() 
{
	const authToken = getAuthCookie();
	if(authToken == "") {
		login();
	} else {
		tokenCheckRequest(authToken);
	}
	return authToken;
}

// deleteAllCookies();
getAndCheckToken();

// login("test_user", "poipoi");

// Allow Enter-button to tigger login
document.getElementById("login_pw_field").addEventListener("keypress", function(event) 
{
	if(event.key === "Enter") 
	{
		event.preventDefault();
		document.getElementById("modal_login_button").click();
	}
}); 

