var express = require("express");
var request = require("request");
var bodyParser = require("body-parser");
var router = express.Router();

// Load external api controllers:
var graphApi = require("../controllers/graphApi");
var dialogFlow = require("../controllers/dialogFlow");

router.use(bodyParser.json())

router.get("/", function(req, res) {

    let VERIFY_TOKEN = process.env.verifyToken;
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
        } 
        
        else {
            // Responds with '403 Forbidden' if verify tokens do not match
            res.sendStatus(403);      
        }
    }
});

router.post("/", function(req, res) {
    let body = req.body;
    //console.log(body);
    // Checks this is an event from a page subscription
    if (body.object === 'page') {

    // Iterates over each entry - there may be multiple if batched
    body.entry.forEach(function(entry) {

        // Gets the message. entry.messaging is an array, but 
        // will only ever contain one message, so we get index 0
        let webhookEvent = entry.messaging[0];
        // Get the sender PSID
        let senderPsID = webhookEvent.sender.id;
        
        // Check if the event is a message or postback and
        // pass the event to the appropriate handler function
        if (webhookEvent.message) {
            dialogFlow.handleMessage(senderPsID, webhookEvent.message);        
        } else if (webhookEvent.postback) {
            graphApi.handlePostback(senderPsID, webhookEvent.postback);
        }

    });

    // Returns a '200 OK' response to all requests
    res.status(200).send('EVENT_RECEIVED');
    } else {
    // Returns a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
    }

});

module.exports = router;