const express = require('express');
const router = express.Router();
const file = require('../../../middleware/FileUploader');
const document = require('../../../middleware/DocumentUploader');

const FileController = require('../controllers/FileController');
const { verifyToken } = require('../../../middleware/AuthMiddleware');
const upload = require('../../../middleware/MultipleDocumentUploader');
const FileService = require('../../media/services/MultipleUpload')


router.post('/file-upload/:id/:schemaName', file.single('file'), verifyToken, FileController.uploadFile);
router.post('/document-upload', document.single('file'), verifyToken, FileController.uploadDocument);
router.post('/multiple-document-upload/:id', upload, verifyToken, FileService.uploadFiles);

module.exports = router;