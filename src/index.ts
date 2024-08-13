import http from 'http';
import app from './app';
import config from './config/config';
import cors from "cors";

const index = http.createServer(app);

// Define CORS options
const corsOptions = {
    origin: '*', // Allow only this origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allow these methods
    credentials: true, // Allow cookies to be sent with requests
    allowedHeaders: 'Content-Type,Authorization' // Allow these headers
};

app.options('*', cors(corsOptions));
app.use(cors());

index.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
});
