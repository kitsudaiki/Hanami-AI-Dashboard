 
function initExampleData() 
{
    var contentCanvas = document.getElementById("contentCanvas");
    contentCanvas.style.position = 'absolute';
    var ctx = contentCanvas.getContext("2d");

    var testData = "{\"bricks\": [[1,2,1],[2,2,1],[5,5,1]]}"
    var obj = JSON.parse(testData); 

    if(obj.hasOwnProperty("bricks"))
    {
        var bricks = obj["bricks"];
        for (i = 0; i < bricks.length; i++) 
        {
            hexagons[i].updatePosition(bricks[i][0], bricks[i][1]);
            hexagons[i].color = bricks[i][2];
            
            if(bricks[i][0] > sizeX) {
                sizeX = bricks[i][0];
            }

            if(bricks[i][1] > sizeY) {
                sizeY = bricks[i][1];
            }
        }
    }
}


initExampleData();
