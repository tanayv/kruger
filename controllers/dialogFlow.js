var apiai = require('apiai');
var dialogFlow = apiai(process.env.DIALOGFLOW_KEY);
var graphApi = require("../controllers/graphApi");

var understand = function(senderPsId, message) {
    if (message.text) {
        var dFReq = dialogFlow.textRequest(message.text, {
            sessionId: 'TINGGGGOESSSBAPBAPSKIDDYBAP'
        });
        dFReq.on('response', function(dFRes) {
            executeIntent(dFRes, senderPsId);
        })
        dFReq.on('error', function(error) {
            console.log("Bleep blop blop there was an error with logic handling");
            console.log(error)
            // Error handling logic and message delivery code
        });
        dFReq.end();
    }
}

var executeIntent = function(response, senderPsId) {
    /* Basic format when DialogFlow response is the message that the user receives */
    var result = response.result;
    
    /* This means that DialogFlow didn't register an application or action */
    if (result.fulfillment.speech) {
        responseText = response.result.fulfillment.speech;
        graphApiPayload = {
            "text": "" + responseText
        };
        graphApi.callSendAPI(senderPsId, graphApiPayload);
    }

    /* DialogFlow has registered an application so the appropriate interface should be invoked */
    else {
        console.log("Appliction handling not implemented yet....");
        graphApi.sendWebView(senderPsId);
    }
}



module.exports = {
    understand
}