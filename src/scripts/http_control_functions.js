
var hostUrl = window.location.host;
var hostUrlWithoutPort = hostUrl.split(":")[0];
const websocketRequestUrl = 'http://' + hostUrl + '/client/websocket';

const httpControlConnection = new XMLHttpRequest();

httpControlConnection.addEventListener("progress", updateProgress);
httpControlConnection.addEventListener("load", transferComplete);
httpControlConnection.addEventListener("error", transferFailed);
httpControlConnection.addEventListener("abort", transferCanceled);

function updateProgress(event) 
{
}

function transferComplete(event) 
{
    console.log("The transfer is complete.");
    console.log(httpControlConnection.responseText);
    var jsonResponse = JSON.parse(httpControlConnection.responseText);
    // TODO: handle response
}

function transferFailed(event) 
{
    console.log("An error occurred while transferring the file.");
}

function transferCanceled(event)
{
    console.log("The transfer has been canceled by the user.");
}
