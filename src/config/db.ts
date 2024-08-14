import {DataSource, Transaction} from 'typeorm';
import config from './config';
import {User} from '../entity/User';
import {PaymentType} from "../entity/PaymentType";
import {Payme} from "../entity/Payme";
import {Provider} from "../entity/Provider";
import {Card} from "../entity/Card";

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: config.db.host,
    port: config.db.port,
    username: config.db.username,
    password: config.db.password,
    database: config.db.database,
    entities: [
        User,
        PaymentType,
        Payme,
        Provider,
        Card,
        Transaction
    ],
    synchronize: true,
});

export const connectDB = async (): Promise<void> => {
    try {
        await AppDataSource.initialize();
        console.log('PostgreSQL database connected');
    } catch (error) {
        console.error('Database connection error', error);
        process.exit(1);
    }
};
