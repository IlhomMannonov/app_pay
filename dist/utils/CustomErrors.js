"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalServerErrorException = exports.ConflictException = exports.BadRequestException = exports.NotFoundException = exports.HttpException = void 0;
class HttpException extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
        this.message = message;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.HttpException = HttpException;
class NotFoundException extends HttpException {
    constructor(message = 'Resource not found') {
        super(404, message);
    }
}
exports.NotFoundException = NotFoundException;
class BadRequestException extends HttpException {
    constructor(message = 'Bad request') {
        super(400, message);
    }
}
exports.BadRequestException = BadRequestException;
class ConflictException extends HttpException {
    constructor(message = 'Conflict') {
        super(409, message);
    }
}
exports.ConflictException = ConflictException;
class InternalServerErrorException extends HttpException {
    constructor(message = 'Internal server error') {
        super(500, message);
    }
}
exports.InternalServerErrorException = InternalServerErrorException;
