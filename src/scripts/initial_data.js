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

function initExampleData() 
{
    var contentCanvas = document.getElementById("contentCanvas");
    contentCanvas.style.position = 'absolute';
    var ctx = contentCanvas.getContext("2d");

    var testData = "{\"bricks\": [[2,1,1],[2,2,1],[2,3,1],[4,4,1]]}"
    var obj = JSON.parse(testData); 

    if(obj.hasOwnProperty("bricks"))
    {
        var bricks = obj["bricks"];
        for (i = 0; i < bricks.length; i++) 
        {
            x = bricks[i][0];
            y = bricks[i][1];
            hexagons[y*5 + x].updatePosition(x, y);
            hexagons[y*5 + x].color = bricks[i][2];
        }
    }
}


initExampleData();
