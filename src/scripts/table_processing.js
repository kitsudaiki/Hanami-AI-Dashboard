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

function constructTable(content, headerMapping, selector) 
{
    // clear old table-content
    $(selector).empty();

    const colIds = Headers(content.header, headerMapping, selector); 
    Body(content.body, selector, colIds); 
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

function Body(bodyContent, selector, colIds) 
{
    for(var row = 0; row < bodyContent.length; row++) 
    {
        var body = $('<tr/>');  

        // add textual values to the row
        const rowContent = bodyContent[row];   
        for(var i = 0; i < colIds.length; i++) {
            body.append($('<td/>').html(rowContent[colIds[i]]));
        }

        // create and add delete-button to the row
        var deleteButton = '<button class="table_delete_button" value="' + rowContent[0] + '" '
        deleteButton += 'onclick="deleteObject(this.value)"';
        deleteButton += '>Delete</button>'
        var input = $(deleteButton);

        body.append($('<td/ style="text-align: right;">').html(input));
        $(selector).append(body);
    }
} 
