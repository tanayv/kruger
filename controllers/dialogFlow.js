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
    responseText = response.result.fulfillment.speech;
    graphApiPayload = {
        "text": "" + responseText
    };
    graphApi.callSendAPI(sender_psid, graphApiPayload);
}



module.exports = {
    understand
}