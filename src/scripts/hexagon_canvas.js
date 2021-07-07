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

var ratio = 1.0;
var hexSize = 50.0;

var offsetX = 0.0;
var offsetY = 40.0;

var nubmerBricksXdim = 5;
var nubmerBricksYdim = 5;

var ypx = 0;
var xpx = 0;

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

function drawHexagons(contextObj) 
{
    for (i = 0; i < hexagons.length; i++) 
    {
        hexagon = hexagons[i];
        if(hexagon.visible)
        {
            if(hexagon.color == 1) {
                contextObj.fillStyle = "rgb(65,105,225)";
            } else {
                contextObj.fillStyle = "rgb(65,225,105)";
            }
        }
        else
        {
            contextObj.fillStyle = "rgb(75,75,75)";
        }

        drawRotatedRect(contextObj, 
                        hexagon.x * ratio + offsetX, 
                        hexagon.y * ratio + offsetY, 
                        hexSize * 1.732 * ratio, 
                        hexSize * ratio, 
                        0);
        drawRotatedRect(contextObj, 
                        hexagon.x  * ratio + offsetX, 
                        hexagon.y * ratio + offsetY, 
                        hexSize * 1.732 * ratio, 
                        hexSize * ratio, 
                        60);
        drawRotatedRect(contextObj, 
                        hexagon.x * ratio + offsetX, 
                        hexagon.y * ratio + offsetY, 
                        hexSize * 1.732 * ratio, 
                        hexSize * ratio, 
                        120);

    }
}

function updateCanvas() 
{
    //console.log("poi");
    var contentCanvas = document.getElementById("contentCanvas");
    var ctx = contentCanvas.getContext("2d");
    var hex_view_div = document.getElementById("hex_view_div");

    // calculate width
    xpx = ((1 + nubmerBricksXdim) * hexSize * 2) + ((nubmerBricksXdim % 2) * hexSize);
    ypx = ((1 + nubmerBricksYdim) * hexSize * 1.732);

    // calculate new size to fix into content-div
    ratio = hex_view_div.offsetHeight / ypx;
    ypx = ypx * ratio;
    xpx = xpx * ratio;
    offsetX = (hex_view_div.offsetWidth - hex_view_div.offsetHeight) / 2.0;
    //console.log("offsetX: "+ offsetX);

    // set size values to canvas
    contentCanvas.width = hex_view_div.offsetWidth * 0.95;
    contentCanvas.height = hex_view_div.offsetHeight * 0.95;

    // buffer canvas
    var canvas2 = document.createElement('canvas');
    canvas2.width = contentCanvas.width;
    canvas2.height = contentCanvas.height;
    var context2 = canvas2.getContext('2d');

    // draw new canvas
    drawHexagons(context2);

    // switch canvas to show the updates
    ctx.clearRect(0, 0, contentCanvas.width, contentCanvas.height);
    ctx.drawImage(canvas2, 0, 0);
    delete canvas2;
}


function toggleColor(mouseX, mouseY) 
{
    for (i = 0; i < hexagons.length; i++) {
        hexagons[i].color = 1;
    }

    for (i = 0; i < hexagons.length; i++) 
    {
        hexagon = hexagons[i];
        if(hexagon.visible)
        {
            if(hexagon.x * ratio + offsetX < mouseX 
                && hexagon.x * ratio + hexSize * 1.732 * ratio + offsetX > mouseX 
                && hexagon.y * ratio + offsetY < mouseY 
                && hexagon.y * ratio + hexSize * 1.732 * ratio + offsetY > mouseY)
            {
                if(hexagons[i].color == 1) {
                    hexagons[i].color = 2;
                }
            }
        }
    }
}

const mouse = {
    x : 0,
    y : 0,
    button : false,
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
            m.down = true 
        }

        if(prevButton 
            && !m.button) 
        { 
            toggleColor(m.x, m.y);
            refresh = true;
            m.up = true 
        }
    },
    start(element) 
    {
        mouse.element = element;
        document.addEventListener("mouseup" + name, mouse.event);
        document.addEventListener("mousedown" + name, mouse.event);
        document.addEventListener("mousemove" + name, mouse.event);
        document.addEventListener('contextmenu', function(e) {
            alert("You've tried to open context menu"); //here you draw your own menu
            e.preventDefault();
          }, false);
    }
}

function mainLoop() 
{
    if(refresh)
    {
        refresh = false;
        updateCanvas();
    }

    requestAnimationFrame(mainLoop)
}
   

function initHexagonView()
{
    // init empty hexagon-list
    for(x = 0; x < 5; x++) 
    {
        for(y = 0; y < 5; y++) 
        {
            hexagons.push(new Hexagon(x, y, 0));
        }
    }

    refresh = true;
    var contentCanvas = document.getElementById("contentCanvas");
    mouse.start(contentCanvas);
    requestAnimationFrame(mainLoop);
    window.onresize = updateCanvas;
}

initHexagonView();
