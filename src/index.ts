import http from 'http';
import app from './app';
import config from './config/config';
import cors from "cors";

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

const index = http.createServer(app);

index.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
});
