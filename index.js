'use strict';

// Imports dependencies and set up http server
const 
  express = require('express'),
  bodyParser = require('body-parser'),
  app = express().use(bodyParser.json()),
  PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN,
  request = express.request
// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));



// Creates the endpoint for our webhook 
app.post('/webhook', (req, res) => {  
    
     let body = req.body;
   
    // Checks this is an event from a page subscription
    if (body.object === 'page') {

    // Iterates over each entry - there may be multiple if batched
    body.entry.forEach(function(entry) {

        // Gets the message. entry.messaging is an array, but 
        // will only ever contain one message, so we get index 0
        let webhookEvent = entry.messaging[0];
        // Get the sender PSID
        let senderPsID = webhookEvent.sender.id;
        console.log('Sender PSID: ' + senderPsID);

        // Check if the event is a message or postback and
        // pass the event to the appropriate handler function
        if (webhookEvent.message) {
            handleMessage(senderPsID, webhookEvent.message);        
        } else if (webhookEvent.postback) {
            handlePostback(senderPsID, webhookEvent.postback);
        }

    });

    // Returns a '200 OK' response to all requests
    res.status(200).send('EVENT_RECEIVED');
    } else {
    // Returns a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
    }

});

// Adds support for GET requests to our webhook
app.get('/webhook', (req, res) => {
    
    // Your verify token. Should be a random string.
    let VERIFY_TOKEN = "TING_GOES_SKRRAA"
    
    // Parse the query params
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];
    
    // Checks if a token and mode is in the query string of the request
    if (mode && token) {
    
    // Checks the mode and token sent is correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        
        // Responds with the challenge token from the request
        console.log('WEBHOOK_VERIFIED');
        res.status(200).send(challenge);
    
    } else {
        // Responds with '403 Forbidden' if verify tokens do not match
        res.sendStatus(403);      
    }
    }
});

// Handles messages events
function handleMessage(sender_psid, received_message) {
    let response;

    // Check if the message contains text
    if (received_message.text) {    

    // Create the payload for a basic text message
    response = {
        "text": `Long time my bruddah. Man's not hot`
    }
    }  
    
    // Sends the response message
    callSendAPI(sender_psid, response);
}

// Handles messaging_postbacks events
function handlePostback(sender_psid, received_postback) {

}

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {
  // Construct the message body
  let request_body = {
    "recipient": {
      "id": sender_psid
    },
    "message": response
  }

  // Send the HTTP request to the Messenger Platform
  request({
    "uri": "https://graph.facebook.com/v2.6/me/messages",
    "qs": { "access_token": PAGE_ACCESS_TOKEN },
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    if (!err) {
      console.log('message sent!')
    } else {
      console.error("Unable to send message:" + err);
    }
  }); 
}