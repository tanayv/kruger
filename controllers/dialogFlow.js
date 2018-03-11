var apiai = require('apiai');
var dialogFlow = apiai(process.env.DIALOGFLOW_KEY);

var graphApi = require("../controllers/graphApi");
var trello = require("../controllers/trello");

// Handles messages events
function handleMessage(sender_psid, received_message) {
    let response;

    // Check if the message contains text
    if (received_message.text) {    
        console.log("Text from Msg: " + received_message.text);
        console.log("Sender: " + sender_psid);
        var intentArray = {};
        var responseText = "Gadhe kaisa code likha hai, mujhe sar mein dard de raha hai";
        intentArray = received_message.text.split(",");
        
        if (intentArray[0].toLowerCase() == "trello") {
            console.log("Intent: Call to Trello");
            if (intentArray.length > 1 ) {
                if (intentArray[1].toLowerCase() != "help") {
                    var trelloTitle = intentArray[1];
                    var trelloDesc = intentArray[2];
                    var trelloDue = intentArray[3];
                    var trelloType = intentArray[4];
                    responseText = trello.addCard(trelloTitle, trelloDesc, trelloDue, trelloType);
                }
                else {
                    responseText = "Follow this format: Trello, Title, Description, Due Date, Type";
                }
            }

            else {
                responseText = "Follow this format: Trello, Title, Description, Due Date, Type";
            }
            response = {
                "text": "" + responseText
            };
            graphApi.callSendAPI(sender_psid, response);
        }

        else {
            console.log("Transmiiting Intent")
            var dfReq = dialogFlow.textRequest(received_message.text, {
                sessionId: 'TINGGGGOESSSBAPBAPSKIDDYBAP'
            });
            dfReq.on('response', function(dfResp) {
                responseText = dfResp.result.fulfillment.speech;
                response = {
                    "text": "" + responseText
                };
                console.log("Response Text: " + responseText);
                graphApi.callSendAPI(sender_psid, response);
            });
            dfReq.on('error', function(error) {
                responseText = "Gadhe Code likhna nahi aata?";
                response = {
                    "text": "" + responseText
                };
                console.log("Response Text: " + responseText);
            });
            dfReq.end();
        }

        // Create the payload for a basic text message
        
    }
    
    // Sends the response message
    
}

module.exports = {
    handleMessage
}