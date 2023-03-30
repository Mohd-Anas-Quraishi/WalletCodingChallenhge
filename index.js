import express, { json } from 'express';
const app = express();
import config from './config/config.js';
import cors from 'cors';

// Importing routes
import walletRoutes from './routes/wallet.js';

// Enable CORS for all routes
app.use(cors());

// Middleware to parse incoming requests with JSON payloads
app.use(json());
// Routes
app.use('/wallet', walletRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start the server
const PORT = config.serverPort || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
