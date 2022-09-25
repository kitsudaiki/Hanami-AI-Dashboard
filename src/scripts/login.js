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

function deleteAllCookies() 
{
    const cookies = document.cookie.split(";");
    for(var i = 0; i < cookies.length; i++) {
        document.cookie = cookies[i] + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}

function loginRequest(user, pw)
{
    const request = "/control/misaki/v1/token";
    const reqContent = "{\"id\":\"" + user + "\",\"password\":\"" + pw + "\"}";

    var loginConnection = new XMLHttpRequest();
    loginConnection.open("POST", request, true);

    loginConnection.onload = function(e) 
    {
        // handle failed login
        if(loginConnection.status != 200) 
        {
            showErrorInModal("login", loginConnection.responseText);
            return false;
        }
    
        console.log("login successful");
        const responseJson = JSON.parse(loginConnection.responseText);
        // TODO: check if json-parsing is successful
        document.cookie = "Auth_JWT_Token=" + responseJson.token + "; SameSite=Strict; Secure";
        document.cookie = "User_Name=" + responseJson.name;
        document.cookie = "Is_Admin=" + responseJson.is_admin;

        updateSidebar();
        fillUserProjectDropdownList();

        document.getElementById("login_id_field").value = "";
        document.getElementById("login_pw_field").value = "";
        document.getElementById("header_user_name").innerHTML = responseJson.name;

        // load cluster-overview as first site
        $("#content_div").load("/subsites/kyouko/cluster.html"); 

        var modal = document.getElementById("login_modal");
        modal.style.display = "none";
    };
    
    loginConnection.onerror = function(e) 
    {
        document.getElementById("login_id_field").value = "";
        document.getElementById("login_pw_field").value = "";
    
        alert("Login-connection failed");
    };

    loginConnection.send(reqContent);
}

function tokenCheckRequest(token)
{
    const request = "/control/misaki/v1/auth?token=" + token;

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
        const userId = document.getElementById("login_id_field").value;
        const pw = document.getElementById("login_pw_field").value;
        loginRequest(userId, pw);
    }

    modal.style.display = "block";
}

function getAndCheckToken() 
{
    const authToken = getCookieValue("Auth_JWT_Token");
    if(authToken == "") {
        login();
    } else {
        tokenCheckRequest(authToken);
    }
    return authToken;
}

function logout()
{
    deleteAllCookies() 
    login();
}
