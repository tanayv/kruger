'use strict';

// Imports dependencies and set up http server
const 
  request = require('request'),
  express = require('express'),
  bodyParser = require('body-parser'),
  app = express().use(bodyParser.json()),
  PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN,
  apiai = require('apiai');

  var trello = require('./src/external/trello.js');

  var dialogFlow = apiai("9a0b6340452843e0a3d33922d1a11669");

// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));

// Creates the endpoint for our webhook 
app.post('/webhook', (req, res) => {  
    
     let body = req.body;
    console.log(body);
    // Checks this is an event from a page subscription
    if (body.object === 'page') {

    // Iterates over each entry - there may be multiple if batched
    body.entry.forEach(function(entry) {

        // Gets the message. entry.messaging is an array, but 
        // will only ever contain one message, so we get index 0
        let webhookEvent = entry.messaging[0];
        // Get the sender PSID
        //if (webhookEvent.sender.Id)
        let senderPsID = webhookEvent.sender.id;
        console.log("Message Received");

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
        console.log("Message Received!");
        intentArray = received_message.text.split(",");
        if (intentArray[0] = "trello") {
            var responseText = addCard("Test Hw Card", "test description", "11/12/2017", "hw");
        }
        else {
            var dfReq = dialogFlow.textRequest('<Your text query>', {
                sessionId: 'TINGGGGOESSSBAPBAPSKIDDYBAP'
            });
            dfReq.on('response', function(dfResp) {
                responseText = dfResp;
            });
            dfReq.on('error', function(error) {
                responseText = "Gadhe Code likhna nahi aata?"
            });
            dfReq.end();
        }

        // Create the payload for a basic text message
        response = {
            "text": responseText
        };

    }
    
    // Sends the response message
    callSendAPI(sender_psid, response);
}

// Handles messaging_postbacks events
function handlePostback(sender_psid, received_postback) {
    console.log('ok')
    let response;
   // Get the payload for the postback
   let payload = received_postback.payload;
 
   // Set the response based on the postback payload
   if (payload === 'yes') {
     response = { "text": "Thanks!" }
   } else if (payload === 'no') {
     response = { "text": "Oops, try sending another image." }
   }
   // Send the message to acknowledge the postback
   callSendAPI(sender_psid, response);
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
  request.post({
    "uri": "https://graph.facebook.com/v2.6/me/messages",
    "qs": { "access_token": PAGE_ACCESS_TOKEN },
    "json": request_body
  }, (err, res, body) => {
    if (!err) {
      console.log('message sent!')
    } else {
      console.error("Unable to send message:" + err);
    }
  }); 
}

function addCard(title, desc, due, list) {    
    if (list = 'hw')
        var listID = '59ad8e8bb34eb055223399d7';
    else if (list = 'side')
        var listID = '59ad8e94e2f50ce6fdd7f3f2';
    else if (list = 'exam')
        var listID = '59b9f99917b3d05d8c27374e';
    
    var options = {
        "key": '6663212c465dd85d568ed53171ab4619',
        "token": '191e775a7e6ee058ae9c6af6b7b7294409bbfc0e3cbcd61508ab68e75e3476d3',
    };

    var body = {
        name: title, 
        desc: desc,
        due: due,
        idList: listID
    };

    request.post({
        "uri": "https://api.trello.com/1/cards",
        "qs": options,
        "json": body
      }, (err, res, body) => {
        if (!err) {
          return "Success!"
        } else {
          console.error("Unable to send message:" + err);
        }
      }); 
}


