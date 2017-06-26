'use strict';
var fs = require('fs');
var AWS = require('aws-sdk');
AWS.config.region = 'ap-northeast-2';


module.exports = function () {
    console.log('start s3 upload');
    var s3 = new AWS.S3();

    var param = {
        'Bucket':'cb-conversation-users',
        'Key':'config.json',
        //'ACL':'public-read',
        'Body':fs.createReadStream('./config.json'),
        'ContentType':'application/json'
    };
    s3.upload(param, function(err){
        if (err) {
            console.log(err);
        } else {
            console.log('s3 upload success');
        }
    })
};