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

//================================================
// Alerting
//================================================

/**
 * Hide error-message block from the modal. Is necessary for initializing 
 * to avoid an empty error-message block inside of the modal.
 *
 * @param {target} base-name of the modal, where the error-message belongs to
 */
function clearAlertBox(target)
{
    var modal = document.getElementById(target + "_alert_box");

    if(modal.style.display === "block") 
    {
        const modalSize = document.getElementById(target + "_modal_content").clientHeight;
        const alertHeight = document.getElementById(target + "_alert_box").clientHeight;
        document.getElementById(target + "_alert_text_label").innerHTML = "";
        document.getElementById(target + "_modal_content").style.height = (modalSize - 20 - alertHeight) + "px";
    }

    modal.style.display = "none";
    document.getElementById(target + "_alert_text_label").innerHTML = "";
}

/**
 * Show error-message within a specific modal
 *
 * @param {target} base-name of the modal, where the error-message belongs to
 * @param {message} message, which should be printed
 */
function showErrorInModal(target, message)
{
    var modal = document.getElementById(target + "_alert_box");

    // in an old error-message is already shown, then close this first
    if(modal.style.display === "block") {
        clearAlertBox(target);
    }

    modal.style.display = "block";

    // calculate and update the size of the modal, to have enough space to insert the error-message
    const modalSize = document.getElementById(target + "_modal_content").clientHeight;
    const alertHeight = document.getElementById(target + "_alert_box").clientHeight;
    document.getElementById(target + "_alert_text_label").innerHTML = message;
    document.getElementById(target + "_modal_content").style.height = (modalSize + 20 + alertHeight) + "px";
}

//================================================
// cookies
//================================================

/**
 * Get value of a specific cookie
 *
 * @param {name} name of the cookie
 */
function getCookieValue(name) 
{
    const cn = name + "=";
    const idx = document.cookie.indexOf(cn)

    if(idx != -1) 
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

