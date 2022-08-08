"use strict";
exports.__esModule = true;
exports.S3Utils = void 0;
var aws_sdk_1 = require("aws-sdk");
var fs = require("fs");
var s3 = new aws_sdk_1.S3();
var S3Utils = /** @class */ (function () {
    function S3Utils(id, secret) {
        this.bucketName = 's3-utility-demo';
        console.log("in constructor");
        this.s3 = new aws_sdk_1.S3({
            accessKeyId: id,
            secretAccessKey: secret
        });
    }
    S3Utils.prototype.createBucket = function () {
        console.log("Inside create bucket");
        this.s3.createBucket({ Bucket: this.bucketName }, function (err, data) {
            if (err)
                console.log(err, err.stack);
            else
                console.log('Bucket Created Successfully', data.Location);
        });
    };
    S3Utils.prototype.uploadFile = function () {
        var fileContent = fs.readFileSync('image_upload.JPG');
        var params = {
            Bucket: this.bucketName,
            Key: 'image/picnic/group.jpg',
            Body: fileContent
        };
        this.s3.upload(params, function (err, data) {
            if (err) {
                console.log(err, err.stack);
            }
            else {
                console.log("File uploaded successfully. ".concat(data.Location));
            }
        });
    };
    return S3Utils;
}());
exports.S3Utils = S3Utils;
