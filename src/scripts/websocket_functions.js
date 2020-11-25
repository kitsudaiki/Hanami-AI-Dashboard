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

function websocketMessageProcessing(message) 
{
    console.log("websocket-data: " + message.data);
    var obj = JSON.parse(message.data); 

    for (i = 0; i < obj.length; i++) 
    {
        //console.log(obj[i][0]+"  "+obj[i][1]+"  "+obj[i][2]);
        //hexagons[i].updatePosition(obj[i][0], obj[i][1]);
        //hexagons[i].color = obj[i][2];
    }

    updateCanvas(hexagons);
};