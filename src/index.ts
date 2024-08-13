import http from 'http';
import app from './app';
import config from './config/config';
import cors from "cors";

const index = http.createServer(app);

app.use(cors());

index.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
});
