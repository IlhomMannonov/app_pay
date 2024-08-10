import {DataSource} from 'typeorm';
import config from './config';
import {User} from '../entity/User';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: config.db.host,
    port: config.db.port,
    username: config.db.username,
    password: config.db.password,
    database: config.db.database,
    entities: [
        User,

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
