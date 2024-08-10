"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const RestException_1 = require("./RestException");
const HttpStatus_1 = require("../entity/ResponseData/HttpStatus");
const errorHandler = (err, req, res, next) => {
    if (err instanceof RestException_1.RestException) {
        res.status(err.status).json({
            message: err.message,
            errors: err.errors,
            resource: err.resourceName,
            field: err.fieldName,
            value: err.fieldValue,
            code: err.errorCode
        });
    }
    else {
        console.error('Unexpected error:', err);
        res.status(HttpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
            message: 'Internal server error',
        });
    }
};
exports.errorHandler = errorHandler;
