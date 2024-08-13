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
// Define CORS options
const corsOptions = {
    origin: '*', // Allow all origins (use a specific domain in production)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allow these methods
    credentials: true, // Allow cookies to be sent with requests
    allowedHeaders: 'Content-Type,Authorization' // Allow these headers
};

// Apply CORS middleware before defining any routes
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight requests


app.use(morgan('dev'));
app.use(bodyParser.json());



app.use('/telegram', authenticateToken, mainBotRouter);
app.use('/api/v1', paymentTypeRouter);
app.use('/api/v1', paymeRouter);
app.use('/api/v1', providerRouter);

app.use(errorHandler);

export default app;
