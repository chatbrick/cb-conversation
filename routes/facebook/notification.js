'use strict';

var express = require('express');
var router = express.Router();
var request = require('request');
var fbConfig = require('./config.json');
var forEach = require('async-foreach').forEach;

router.post('/', function(req, res, next) {

    console.log('req.body =>' + JSON.stringify(req.body));
    res.end('respond with a resource');

    loop(fbConfig.recipient_id, messageData);
    //callSendAPI(messageData);
});


var messageData = {
    "recipient": {
        "id": ''
    },
    "message": {
        "text": "bluehack chatbrick!"
    }
};
/**
 * Param(messageData) is Templete Info
 */
function callSendAPI(facebookId, messageData) {
    messageData.recipient.id = facebookId;
    request({
        uri: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: fbConfig.access_token },
        method: 'POST',
        json: messageData

    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var recipientId = body.recipient_id;
            var messageId = body.message_id;

            if (messageId) {
                console.log("Successfully sent message with id %s to recipient %s",
                    messageId, recipientId);
            } else {
                console.log("Successfully called Send API for recipient %s",
                    recipientId);
            }
        } else {
            console.error("Failed calling Send API", response.statusCode, response.statusMessage, body.error);
        }
    });
}

function loop(group, messageData) {
    forEach(group, function(item, index, arr) {
        //console.log("each", item, index, arr);
        callSendAPI(item, messageData);

    });
}

module.exports = router;