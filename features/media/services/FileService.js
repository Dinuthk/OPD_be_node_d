const cloudinary = require("cloudinary").v2;
const { validationResult } = require("express-validator");
const { resolve } = require("path");
// const leadModel = require("../../lead/models/leadModel");
// const projectModel = require("../../project/models/projectModel");
const FileService = module.exports;

cloudinary.config({
  cloud_name: "dwneovkg9",
  api_key: "516279729771191",
  api_secret: "olGt-04DOjhx1KqF7c5KZINXn0g",
});


FileService.uploadFile = async function (request, response) {
  return new Promise((resolve,reject) => {
    // console.log("req>>>", request.file);
    try {
      cloudinary.uploader.upload_stream(
          {
              folder: "Template", // Specify your desired folder in Cloudinary
              resource_type: "auto",
              // resource_type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          },
          (error, result) => {
              if (error) {
                  console.log("erroooor",error);
                  return resolve({
                    error: true,
                    message: 'Something went wrong',
                    data: error,
                  });
              }
  
              const fileUrl = getFileUrl(result);
              // console.log("fileurl",fileUrl);
              resolve({
                error: false,
                message: "File uploaded",
                data: {
                  file_url: fileUrl,
                },
              });
          }
      ).end(request.file.buffer);
    } catch (error) {
      console.log("err",error);
      reject({
        error: true,
        message: "Something went wrong",
        data: error,
      });
    }
  })
  
};

function getFileUrl(result) {
  const { format, resource_type } = result;
  
  // Add transformations based on resource type
  let transformations = [];
  if (resource_type === 'image') {
    // Add image transformations as needed
    transformations.push({ width: 500, height: 500, crop: 'limit' });
  } else if (resource_type === 'document') {
    // Add document transformations as needed
    // For example, you might want to create a thumbnail for documents
    return cloudinary.url(public_id, {
      secure: true,
      format: format === 'raw' ? undefined : format,
      type: 'attachment', // Force content-disposition: attachment for documents
    });
  }

  // Construct the URL
  return cloudinary.url(result.public_id, {
    secure: true,
    format: format === 'raw' ? undefined : format, // Exclude format for raw files
    transformation: transformations,
  });
}

// const { S3Client } = require("@aws-sdk/client-s3");
// const { Upload } = require("@aws-sdk/lib-storage");

// const FileService = module.exports;

// FileService.uploadFile = async function(request, response, next) {
//     console.log("req file", request.file);
//     try {
//         const client = new S3Client({
//             credentials: {
//                 accessKeyId: process.env.AWS_ACCESS_KEY,
//                 secretAccessKey: process.env.AWS_SCERET_KEY,
//             },
//             region: process.env.AWS_S3_REGION,
//         });

//         const fileName = `${Date.now().toString()}-${request.file.originalname}`;

//         const parallelUploads3 = new Upload({
//             client: client,
//             tags: [],
//             queueSize: 4,
//             leavePartsOnError: false,
//             params: {
//                 // ACL: 'public-read',
//                 Bucket: process.env.AWS_BUCKET,
//                 Key: fileName,
//                 Body: request.file.buffer,
//             },
//         });
        
//         parallelUploads3.on("httpUploadProgress", (progress) => {});
    
//         await parallelUploads3.done();

//         return response.status(200).json({
//             error: false,
//             message: 'File uploaded',
//             data: {
//                 file_url: `${process.env.AWS_S3_BASEURL}/${fileName}`
//             },
//         });
//     } catch (error) {
//         console.log(error)
//         return response.status(400).json({
//             error: true,
//             message: 'Something went wrong',
//             data: error,
//         });
//     }
// }
