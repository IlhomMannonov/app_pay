"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResult = void 0;
const ErrorData_1 = require("./ErrorData");
class ApiResult {
    constructor(success, message, errors, data) {
        this.success = success;
        this.message = message;
        this.errors = errors;
        this.data = data;
    }
    static errorResponse(message, code) {
        return new ApiResult(false, message, [new ErrorData_1.ErrorData(message, code)]);
    }
}
exports.ApiResult = ApiResult;
