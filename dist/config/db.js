"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const config_1 = __importDefault(require("./config"));
const User_1 = require("../entity/User");
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: config_1.default.db.host,
    port: config_1.default.db.port,
    username: config_1.default.db.username,
    password: config_1.default.db.password,
    database: config_1.default.db.database,
    entities: [
        User_1.User,
    ],
    synchronize: true,
});
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield exports.AppDataSource.initialize();
        console.log('PostgreSQL database connected');
    }
    catch (error) {
        console.error('Database connection error', error);
        process.exit(1);
    }
});
exports.connectDB = connectDB;
