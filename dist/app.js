"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const body_parser_1 = __importDefault(require("body-parser"));
const errorHandlers_1 = require("./middilwares/errorHandlers");
const db_1 = require("./config/db");
const MainBotRouter_1 = __importDefault(require("./routers/MainBotRouter"));
const app = (0, express_1.default)();
// PostgreSQL bazasiga ulanish
(0, db_1.connectDB)();
app.use((0, morgan_1.default)('dev'));
app.use(body_parser_1.default.json());
app.use('/telegram', MainBotRouter_1.default);
app.use(errorHandlers_1.errorHandler);
exports.default = app;
