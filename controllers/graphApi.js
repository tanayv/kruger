var request = require("request");
var PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

var callSendAPI = function(sender_psid, response) {
    // Construct the message body
    let request_body = {
      "messaging_type": "RESPONSE",
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
        console.log("Message Sent")
      } else {
        console.error("Unable to send message:" + err);
      }
    }); 
}

var handlePostback = function(sender_psid, received_postback) {
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

var sendWebView = function(sender_psid) {
  let response = {
    "persistent_menu":[
      {
        "locale":"default",
        "composer_input_disabled": true,
        "call_to_actions":[
          {
            "title":"Tanay's GitHub Account",
            "type":"nested",
            "call_to_actions":[
              {
                "title":"Tanay's GitHub",
                "type":"postback",
                "payload":"PAYBILL_PAYLOAD"
              },
              {
                "type":"web_url",
                "title":"Latest News",
                "url":"https://www.github.com/tanayv",
                "webview_height_ratio":"full"
              }
            ]
          }
        ]
      }
    ]
  }
  callSendAPI(sender_psid, response);
}

module.exports = {
    callSendAPI, handlePostback, sendWebView
}