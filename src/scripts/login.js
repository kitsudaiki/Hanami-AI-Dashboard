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
 * Remove all cookies of the side
 */
function deleteAllCookies() 
{
    const cookies = document.cookie.split(";");
    for(var i = 0; i < cookies.length; i++) {
        document.cookie = cookies[i] + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}

/**
 * Login by requesting a jwt-token and store it as cookie
 *
 * @param {user} user-id for login
 * @param {pw} password of the suer
 */
function loginRequest(user, pw)
{
    // create request    
    const request = "/control/misaki/v1/token";
    const reqContent = "{\"id\":\"" + user + "\",\"password\":\"" + pw + "\"}";
    let loginConnection = new XMLHttpRequest();
    loginConnection.open("POST", request, true);

    // callback for success
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

        let modal = document.getElementById("login_modal");
        modal.style.display = "none";
    };
    
    // callback for fail
    loginConnection.onerror = function(e) 
    {
        document.getElementById("login_id_field").value = "";
        document.getElementById("login_pw_field").value = "";

        showErrorInModal("login", "Login failed for unknown reason");
    };

    loginConnection.send(reqContent);
}

/**
 * Check if token is still valid. If expired or invalid, return to login
 *
 * @param {token} token to check
 */
function tokenCheckRequest(token)
{
    // create request
    const request = "/control/misaki/v1/auth?token=" + token;
    let authConnection = new XMLHttpRequest();
    authConnection.open("GET", request, true);
    authConnection.setRequestHeader("X-Auth-Token", token);

    // callback for success
    authConnection.onload = function(e) 
    {
        if(authConnection.status != 200) 
        {
            console.log("token-check failed");
            login();
        }
    };

    // callback for fail
    authConnection.onerror = function(e) 
    {
        login();
    };

    authConnection.send(null);
}

/**
 * Trigger login-modal
 */
function login() 
{
    deleteAllCookies();
    let modal = document.getElementById("login_modal");
    let loginButton = document.getElementById("modal_login_button");

    // handle login-button
    loginButton.onclick = function() 
    {
        const userId = document.getElementById("login_id_field").value;
        const pw = document.getElementById("login_pw_field").value;
        loginRequest(userId, pw);
    }

    modal.style.display = "block";
}

/**
 * Check if token is still valid. If expired or invalid, return to login
 */
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

/**
 * Delete cookies and return to login
 */
function logout()
{
    deleteAllCookies() 
    login();
}
