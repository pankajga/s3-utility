import { S3 } from "aws-sdk";
import * as fs from 'fs';

export class S3Utils {
    private readonly s3: S3;

    constructor(id: string, secret: string) {
        this.s3 = new S3({
            accessKeyId: id,
            secretAccessKey: secret
        })
    }
    
    createBucket(bucketName:string) {
        this.s3.createBucket({Bucket: bucketName}, function(err, data) {
            if (err) console.log(err, err.stack);
            else console.log('Bucket Created Successfully', data.Location);
        });
    }

    uploadFile(bucketName:string, key:string, image:string) {
        let fileContent = fs.readFileSync(image);

        let params = {
            Bucket: bucketName,
            Key: key, // File name you want to save as in S3
            Body: fileContent
        }

        this.s3.upload(params, function(err, data) {
            if(err){
                console.log(err,err.stack);
            }
            else{
                console.log(`File uploaded successfully. ${data.Location}`);
            }
        })
    }
}



