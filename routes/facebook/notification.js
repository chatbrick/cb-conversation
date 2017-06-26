'use strict';

var express = require('express');
var router = express.Router();
var request = require('request');
var fbConfig = require('../../bin/config.json');
var forEach = require('async-foreach').forEach;
var AWS = require('aws-sdk');
var s3 = new AWS.S3();
var params = {Bucket: 'cb-conversation-users', Key: 'config.json'};
var access_token = '';

router.post('/', function(req, res, next) {

    s3.getObject(params, function(err, data) {
        if (err) {
            console.log(err, err.stack);
        }
        else {
            let objectData = data.Body.toString('utf-8');
            var jsonParser = JSON.parse(objectData);
            console.log(JSON.parse(jsonParser.recipient_ids));

            access_token = jsonParser.access_token;
            loop(JSON.parse(jsonParser.recipient_ids), messageData);
        }
    });
});


var messageData = {
    "recipient": {
        "id": ''
    },
    "message": {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "button",
                "text": "안녕하세요, 쥬봇입니다. 시간이 늦었는데 아직 점심을 드시지 못하셨나요? 점심을 드셨다면 입력 부탁드립니다. 규칙적인 식사가 다이어트에 도움이 된답니다.",
                "buttons": [{
                    "type": "postback",
                    "title": "식사 입력하기",
                    "payload": "inputMeal"
                }, {
                    "type": "postback",
                    "title": "점심을 먹지 않았어요",
                    "payload": "inputMeal"
                }]
            }
        }
    }
};
/**
 * Param(messageData) is Templete Info
 */
function callSendAPI(facebookId, messageData) {
    messageData.recipient.id = facebookId;
    request({
        uri: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: access_token },
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
    console.log(group);
    forEach(group, function(item, index, arr) {
        console.log("each", item, index, arr);
        callSendAPI(item, messageData);

    });
}

module.exports = router;