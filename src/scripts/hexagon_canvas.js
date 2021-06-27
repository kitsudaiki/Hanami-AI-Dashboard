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

requestAnimationFrame(mainLoop);

var sizeX = 0;
var sizeY = 0;
var stepCount = 0;
var ypx = 0;
var xpx = 0;
var hexSize = 50;

var refresh = true;
var hexagons = [];

class Hexagon 
{
    visible = false;
    color = 0;
    x = 0;
    y = 0;

    constructor(column, row, color) 
    {
        this.color = color;
        this.updatePosition(row, column);
        this.visible = false;
    }

    updatePosition(column, row) 
    {
        this.visible = true;
        this.x = (column * hexSize * 2) + ((row % 2) * hexSize);
        this.y = (row * hexSize * 1.732);
    }
}

function drawRotatedRect(contextObj, 
                         x, 
                         y, 
                         width, 
                         height, 
                         degrees) 
{
    contextObj.save();
    contextObj.translate(x + (width / 2),  
                         y + 2 * (height / 2));
    contextObj.rotate(degrees * (Math.PI / 180));
    contextObj.fillRect(-width / 2, -height / 2, width, height);
    contextObj.restore();
}

function drawHexagons(contextObj, hexagons, xOffset) 
{
    for (i = 0; i < hexagons.length; i++) 
    {
        hexagon = hexagons[i];
        if(hexagon.visible)
        {
            console.log(hexagon.color);
            if(hexagon.color == 1) {
                contextObj.fillStyle = "rgb(65,105,225)";
            } else {
                contextObj.fillStyle = "rgb(65,225,105)";
            }

            drawRotatedRect(contextObj, 
                            hexagon.x + xOffset, 
                            hexagon.y, 
                            hexSize * 1.732, 
                            hexSize, 
                            0);
            drawRotatedRect(contextObj, 
                            hexagon.x + xOffset, 
                            hexagon.y, 
                            hexSize * 1.732, 
                            hexSize, 
                            60);
            drawRotatedRect(contextObj, 
                            hexagon.x + xOffset, 
                            hexagon.y, 
                            hexSize * 1.732, 
                            hexSize, 
                            120);
        }
    }
}

function updateCanvas(hexagons) 
{
    var contentCanvas = document.getElementById("contentCanvas");
    var ctx = contentCanvas.getContext("2d");
    var hex_view_div = document.getElementById("hex_view_div");

    // calculate width
    xpx = ((1.5 + sizeX) * hexSize * 2) + ((sizeX % 2) * hexSize);
    ypx = ((2.5 + sizeY) * hexSize * 1.732);

    // calculate new size to fix into content-div
    var ratio = hex_view_div.offsetHeight / ypx;
    ypx = ypx * ratio;
    xpx = xpx * ratio;
    //hexSize = hexSize * ratio;

    // set size values to canvas
    contentCanvas.width = hex_view_div.offsetWidth * 0.95;
    contentCanvas.height = hex_view_div.offsetHeight * 0.95;

    // buffer canvas
    var canvas2 = document.createElement('canvas');
    canvas2.width = contentCanvas.width;
    canvas2.height = contentCanvas.height;
    var context2 = canvas2.getContext('2d');

    // draw new canvas
    drawHexagons(context2, hexagons, 0);

    // switch canvas to show the updates
    ctx.clearRect(0, 0, contentCanvas.width, contentCanvas.height);
    ctx.drawImage(canvas2, 0, 0);
    delete canvas2;
}


function toggleColor(mouseX, mouseY) 
{
    for (i = 0; i < hexagons.length; i++) 
    {
        hexagon = hexagons[i];
        if(hexagon.visible)
        {
            if(hexagon.x < mouseX 
                && hexagon.x + hexSize * 1.732 > mouseX 
                && hexagon.y < mouseY 
                && hexagon.y + hexSize * 1.732 > mouseY)
            {
                if(hexagons[i].color == 1) {
                    hexagons[i].color = 2;
                } else {
                    hexagons[i].color = 1;
                }
            }
        }
    }
}

const mouse = {
    button : false,
    x : 0,
    y : 0,
    down : false,
    up : false,
    element : null,
    event(e) 
    {
        const m = mouse;
        m.bounds = m.element.getBoundingClientRect();
        m.x = e.pageX - m.bounds.left - scrollX;
        m.y = e.pageY - m.bounds.top - scrollY;
        const prevButton = m.button;
        m.button = e.type === "mousedown" ? true : e.type === "mouseup" ? false : mouse.button;

        if(!prevButton 
            && m.button) 
        { 
            //console.log("poi1" + " x: " + m.x +"  y: " + m.y);
            //refresh = true;
            m.down = true 
        }

        if(prevButton 
            && !m.button) 
        { 
            //console.log("poi2" + " x: " + m.x +"  y: " + m.y);
            toggleColor(m.x, m.y);
            refresh = true;
            m.up = true 
        }
    },
    start(element) 
    {
        mouse.element = element;
        "down,up,move".split(",").forEach(name => document.addEventListener("mouse" + name, mouse.event));
    }
}

function mainLoop() 
{
    if(refresh)
    {
        refresh = false;
        updateCanvas(hexagons);
    }

    requestAnimationFrame(mainLoop)
}
   

var contentCanvas = document.getElementById("contentCanvas");
mouse.start(contentCanvas);

// init empty hexagon-list
for (i = 0; i < 25*25; i++) {
    hexagons.push(new Hexagon(0, 0, 0));
}
