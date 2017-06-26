'use strict';

var express = require('express');
var router = express.Router();
var accesstoken = "EAAEnsPAELUMBADgSLdVm8jxd9krQqtjxrfn0VpY8Upa0KqBLLAq3CRTQjYUa4DZCTKDbu9ZCGMQj3TDWw2vUKQ9AxSZAlLIXwlYzWtoTSbAGawA4hka9eWsqhomosleZBTWeiJ8Si6B8fO667pSYGpROfRLcgVev5TlwnHtFUql1NGc1DXX1zoHFeaJUZC14ZD";
var path = './config.json';
var fs = require('fs');
var upload = require('./upload');

router.post('/', function(req, res, next) {


    var body = JSON.stringify(req.body);
    console.log('req.body =>' + body);

    var facebookIds = JSON.stringify(req.body.facebookIds);
    console.log('facebookIds =>' + facebookIds);

    if (facebookIds != null) {

        var facebookData = {
            "recipient_ids": facebookIds,
            "access_token": accesstoken
        };
        fs.writeFile(path, JSON.stringify(facebookData), function (err) {
            if (err) {
                console.log(err);
                res.status(400).send("fail(writeFile) =>"+ err);
            }

            upload();
            res.status(200).send("success" + JSON.stringify(facebookData));
        });

    } else {
        res.status(400).send("fail(facebookIds is null)");
    }

});

module.exports = router;