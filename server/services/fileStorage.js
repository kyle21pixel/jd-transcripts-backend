const AWS = require('aws-sdk');
const path = require('path');
const fs = require('fs');

// Configure AWS
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION || 'us-east-1'
});

const s3 = new AWS.S3();
const bucketName = process.env.AWS_BUCKET_NAME || 'jd-transcripts-files';

class FileStorageService {
    // Upload file to S3
    async uploadFile(file, orderId, fileType = 'audio') {
        try {
            const fileExtension = path.extname(file.name);
            const fileName = `${orderId}/${fileType}/${Date.now()}-${file.name}`;
            
            const uploadParams = {
                Bucket: bucketName,
                Key: fileName,
                Body: fs.readFileSync(file.tempFilePath),
                ContentType: file.mimetype,
                Metadata: {
                    orderId: orderId,
                    fileType: fileType,
                    originalName: file.name
                }
            };

            const result = await s3.upload(uploadParams).promise();
            
            // Clean up temp file
            fs.unlinkSync(file.tempFilePath);
            
            return {
                success: true,
                url: result.Location,
                key: result.Key,
                fileName: fileName,
                size: file.size
            };
        } catch (error) {
            console.error('S3 upload error:', error);
            throw new Error('File upload failed');
        }
    }

    // Generate signed URL for file download
    async getSignedUrl(fileKey, expiresIn = 3600) {
        try {
            const params = {
                Bucket: bucketName,
                Key: fileKey,
                Expires: expiresIn // URL expires in 1 hour by default
            };

            const url = await s3.getSignedUrlPromise('getObject', params);
            return { success: true, url };
        } catch (error) {
            console.error('Signed URL generation error:', error);
            throw new Error('Failed to generate download URL');
        }
    }

    // Delete file from S3
    async deleteFile(fileKey) {
        try {
            const params = {
                Bucket: bucketName,
                Key: fileKey
            };

            await s3.deleteObject(params).promise();
            return { success: true };
        } catch (error) {
            console.error('S3 delete error:', error);
            throw new Error('File deletion failed');
        }
    }

    // List files for an order
    async listOrderFiles(orderId) {
        try {
            const params = {
                Bucket: bucketName,
                Prefix: `${orderId}/`
            };

            const result = await s3.listObjectsV2(params).promise();
            
            const files = result.Contents.map(file => ({
                key: file.Key,
                size: file.Size,
                lastModified: file.LastModified,
                fileName: path.basename(file.Key)
            }));

            return { success: true, files };
        } catch (error) {
            console.error('S3 list error:', error);
            throw new Error('Failed to list files');
        }
    }

    // Check if S3 is configured
    isConfigured() {
        return !!(
            process.env.AWS_ACCESS_KEY_ID &&
            process.env.AWS_SECRET_ACCESS_KEY &&
            process.env.AWS_BUCKET_NAME
        );
    }
}

module.exports = new FileStorageService();