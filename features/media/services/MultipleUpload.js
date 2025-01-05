const cloudinary = require("cloudinary").v2;
const { validationResult } = require("express-validator");
const leadModel = require("../../lead/models/leadModel");
const FileService = module.exports;

cloudinary.config({
  cloud_name: "dwneovkg9",
  api_key: "516279729771191",
  api_secret: "olGt-04DOjhx1KqF7c5KZINXn0g",
});

FileService.uploadFiles = async function (request, response, next) {
  console.log("file",request.files);
    const errors = validationResult(request);
    console.log("files|||---new", request.files);
  
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: 'Validation errors',
        data: errors,
      });
    }
  
    try {
      const uploads = request.files.map(async (file) => {
        return new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: "Coltex", // Specify your desired folder in Cloudinary
              resource_type: "auto",
            },
            (error, result) => {
              if (error) {
                console.error("Error uploading file:", error);
                reject(error);
              } else {
                console.log("Uploaded file:", result.public_id);
                const fileUrl = getFileUrl(result);
                resolve({ 
                  file_url: fileUrl,
                  fileName: file.originalname,
                  fileSize: file.size
                });
              }
            }
          );
  
          uploadStream.end(file.buffer);
        });
      });
  
      const results = await Promise.all(uploads);
      console.log("results>> file urls", results);

      // Extract relevant information from results
      const filesInfo = results.map(({ file_url, fileName, fileSize }) => ({
        fileUrl: file_url,
        fileName,
        fileSize
      }));

      const leadId = request.params;
      const leadFile = await leadModel.findByIdAndUpdate(leadId, { $push: { leadFiles: { $each: filesInfo } } });
  
      return response.status(200).json({
        error: false,
        message: "Files uploaded",
        data: leadFile,
      });
    } catch (error) {
      console.log("Error uploading files:", error);
      return response.status(400).json({
        error: true,
        message: "Something went wrong",
        data: error,
      });
    }
  };
  
// FileService.uploadFiles = async function (request, response, next) {
//   const errors = validationResult(request);
//   console.log("files|||---new", request.files);

//   if (!errors.isEmpty()) {
//     return response.status(422).json({
//       error: true,
//       message: 'Validation errors',
//       data: errors,
//     });
//   }

//   try {
//     const uploads = request.files.map(async (file) => {
//       const result = await cloudinary.uploader.upload_stream(
//         {
//           folder: "Toucan", // Specify your desired folder in Cloudinary
//           resource_type: "auto",
//         },
//         (error, result) => {
//           if (error) {
//             return response.status(400).json({
//               error: true,
//               message: "Something went wrong",
//               data: error,
//             });
//           }
//         }
//       ).end(file.buffer);

//       console.log("resultt", result.public_id);

//       const fileUrl = getFileUrl(result);

//       return {
//         file_url: fileUrl,
//       };
//     });

//     const results = await Promise.all(uploads);
//     console.log("results>> file urls", results);

//     return response.status(200).json({
//       error: false,
//       message: "Files uploaded",
//       data: results,
//     });
//   } catch (error) {
//     console.log("Error uploading files:", error);
//     return response.status(400).json({
//       error: true,
//       message: "Something went wrong",
//       data: error,
//     });
//   }
// };

function getFileUrl(result) {
  const { format, resource_type } = result;
  console.log("formaat", format);
  console.log("resource", resource_type);
  
  let transformations = [];
  if (resource_type === 'image') {
    transformations.push({ width: 500, height: 500, crop: 'limit' });
  }

  return cloudinary.url(result.public_id, {
    secure: true,
    format: format === 'raw' ? undefined : format,
    transformation: transformations,
  });
}
