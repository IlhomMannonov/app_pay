import 'reflect-metadata';
import express, {Application} from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import {errorHandler} from './middilwares/errorHandlers';
import {connectDB} from './config/db';
import mainBotRouter from "./routers/MainBotRouter";
import paymentTypeRouter from "./routers/PaymentTypeRouter";
import paymeRouter from "./routers/PaymeRouter";
import providerRouter from "./routers/ProviderRouter";
import authenticateToken from "./middilwares/TwtAuth";


const app: Application = express();


// PostgreSQL bazasiga ulanish
connectDB();

app.use(morgan('dev'));
app.use(bodyParser.json());

app.use('/telegram', authenticateToken, mainBotRouter);
app.use('/api/v1', paymentTypeRouter);
app.use('/api/v1', paymeRouter);
app.use('/api/v1', providerRouter);

app.use(errorHandler);

export default app;
