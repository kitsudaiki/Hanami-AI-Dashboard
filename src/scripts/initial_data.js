 
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
