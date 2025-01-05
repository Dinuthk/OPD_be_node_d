const { validationResult } = require("express-validator");
const FileService = require('../services/FileService');

const FileController = {
    async uploadFile(request, response, next) {
        const errors = validationResult(request);

        if (!errors.isEmpty()) {
            return response.status(422).json({
                error: true,
                message: 'Validation errors',
                data: errors,
            });
        }

        FileService.uploadFile(request, response, next);
    },

    async uploadDocument(request, response, next) {
        const errors = validationResult(request);

        if (!errors.isEmpty()) {
            return response.status(422).json({
                error: true,
                message: 'Validation errors',
                data: errors,
            });
        }

        FileService.uploadFile(request, response, next);
    }
}

module.exports = FileController
