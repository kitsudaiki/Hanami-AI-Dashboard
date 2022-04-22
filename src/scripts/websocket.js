function sendFile(file)
{
    var websocket = new WebSocket('wss://' + location.host);
    const token = getAndCheckToken();
    if(token == "") {
        return;
    }
    
    websocket.onopen = function () 
    {
        console.log("WebSocket open")
        const initialMsg = "{\"token\":\"" + token + "\",\"target\":\"sagiri\"}";
        websocket.send(initialMsg);
    };
    
    websocket.onerror = function () {
        console.log("WebSocket failed!");
    };
    
    websocket.onmessage = function(event) {
        console.log("Data received from server: " + event.data);
    };
}

