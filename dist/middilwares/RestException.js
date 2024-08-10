"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestException = void 0;
const HttpStatus_1 = require("../entity/ResponseData/HttpStatus");
const ErrorData_1 = require("../entity/ResponseData/ErrorData");
class RestException extends Error {
    constructor(userMsg, status, resourceName, fieldName, fieldValue, errors, errorCode) {
        super(userMsg);
        this.status = status;
        this.resourceName = resourceName;
        this.fieldName = fieldName;
        this.fieldValue = fieldValue;
        this.errors = errors;
        this.errorCode = errorCode;
    }
    static restThrow(userMsg, status) {
        return new RestException(userMsg, status);
    }
    static restThrowWithErrorCode(userMsg, errorCode, status) {
        return new RestException(userMsg, status, undefined, undefined, undefined, [new ErrorData_1.ErrorData(userMsg, errorCode)], errorCode);
    }
    static restThrowWithDetails(resourceName, fieldName, fieldValue, userMsg) {
        return new RestException(userMsg, HttpStatus_1.HttpStatus.BAD_REQUEST, resourceName, fieldName, fieldValue);
    }
    static restThrowWithErrors(errors, status) {
        return new RestException('', status, undefined, undefined, undefined, errors);
    }
    static notFound(resourceKey) {
        return new RestException(`Resource ${resourceKey} not found`, HttpStatus_1.HttpStatus.NOT_FOUND);
    }
    static otherServiceError(serviceName) {
        return new RestException(`Error from service ${serviceName}`, HttpStatus_1.HttpStatus.BAD_REQUEST);
    }
    static badRequest(resourceKey) {
        return new RestException(`Bad request for ${resourceKey}`, HttpStatus_1.HttpStatus.BAD_REQUEST);
    }
    static alreadyExists(resourceKey) {
        return new RestException(`Resource ${resourceKey} already exists`, HttpStatus_1.HttpStatus.CONFLICT);
    }
    static attackResponse() {
        return new RestException(`Attack response`, HttpStatus_1.HttpStatus.BAD_REQUEST);
    }
    static forbidden() {
        return new RestException(`Forbidden`, HttpStatus_1.HttpStatus.FORBIDDEN);
    }
    static internalServerError() {
        return new RestException(`Internal server error`, HttpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
exports.RestException = RestException;
