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

function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

function constructTable(content, headerMapping, selector, additionalButton) 
{
    // clear old table-content
    $(selector).empty();

    const colIds = Headers(content.header, headerMapping, selector); 
    Body(content.body, selector, colIds, additionalButton); 
}
    
function Headers(headerContent, headerMapping, selector) 
{
    var colIds = [];
    var header = $('<tr/>');             
    for(var i = 0; i < headerContent.length; i++) 
    {
        if(headerMapping.has(headerContent[i])) 
        {
            colIds.push(i);
            header.append($('<th/>').html(headerMapping.get(headerContent[i])));
        }
    }
    $(selector).append(header);

    return colIds;
}     

function Body(bodyContent, selector, colIds, additionalButton) 
{
    for(var row = 0; row < bodyContent.length; row++) 
    {
        var body = $('<tr/>');  

        // add textual values to the row
        const rowContent = bodyContent[row];   
        for(var i = 0; i < colIds.length; i++) 
        {
            var cell = JSON.stringify(rowContent[colIds[i]]);
            cell.replaceAll(",", ",\n");
            console.log("cell: " + cell);
            body.append($('<td/>').html(cell));
        }

        // create and add delete-button to the row
        var buttons = "";
        for(var i = 0; i < additionalButton.length; i++)
        {
            buttons += '<button class="table_side_button" value="' + rowContent[0] + '" ';
            buttons += additionalButton[i];
        }
        buttons += '<button class="table_side_button" value="' + rowContent[0] + '" ';
        buttons += 'onclick="deleteObject(this.value)">Delete</button>';
        var input = $(buttons);

        body.append($('<td/ style="text-align: right;">').html(input));
        $(selector).append(body);
    }
} 
