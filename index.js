
var express = require('express');
var app = express();

app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));

/* Load routers */
var webhook = require("./routers/webhook");
app.use("/webhook", webhook);



