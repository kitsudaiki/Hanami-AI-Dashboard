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
// value conversion
//================================================

longToByteArray = function(long) {
    // we want to represent the input as a 8-bytes array
    var byteArray = [0, 0, 0, 0];

    for ( var index = 0; index < byteArray.length; index ++ ) {
        var byte = long & 0xff;
        byteArray [ index ] = byte;
        long = (long - byte) / 256 ;
    }

    return byteArray;
};

byteArrayToLong = function(byteArray) {
    var value = 0;
    for ( var i = byteArray.length - 1; i >= 0; i--) {
        value = (value * 256) + byteArray[i];
    }

    return value;
};

function bin2String(array) 
{
    var result = "";
    for(var i = 0; i < array.length; i++) {
        result += String.fromCharCode(array[i]);
    }
    return result;
}

//================================================
// Alerting
//================================================

function clearAlertBox(type)
{
    var modal = document.getElementById(type + "_alert_box");
    modal.style.display = "none";
    document.getElementById(type + "_alert_text_label").innerHTML = "";
}

function closeErrorInModal(type)
{
    const modalSize = document.getElementById(type + "_modal_content").clientHeight;

    const alertHeight = document.getElementById(type + "_alert_box").clientHeight;
    document.getElementById(type + "_alert_text_label").innerHTML = "";
    document.getElementById(type + "_modal_content").style.height = (modalSize - 20 - alertHeight) + "px";

    var modal = document.getElementById(type + "_alert_box");
    modal.style.display = "none";
}

function showErrorInModal(type, message)
{
    var modal = document.getElementById(type + "_alert_box");

    // in an old error-message is already shown, then close this first
    if(modal.style.display === "block") {
        closeErrorInModal(type);
    }

    modal.style.display = "block";

    const modalSize = document.getElementById(type + "_modal_content").clientHeight;
    const alertHeight = document.getElementById(type + "_alert_box").clientHeight;
    document.getElementById(type + "_alert_text_label").innerHTML = message;
    document.getElementById(type + "_modal_content").style.height = (modalSize + 20 + alertHeight) + "px";
}


//================================================
// cookies
//================================================

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

