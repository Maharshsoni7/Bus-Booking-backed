import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import connectDB from './config/connect.js';
import { PORT } from './config/config.js';
import userRoutes from './routes/user.js';
import busRoutes from './routes/bus.js';
import { buildAdminJs } from './config/setup.js';
import Ticket from './models/ticket.js';
// import ticket from './routes/ticket.js';

dotenv.config();

const app = express();

const crossOriginOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(crossOriginOptions));

app.use(express.json());

// Routes
app.use('/users', userRoutes);
app.use('/buses,', busRoutes);
// app.use('/tickets', ticket);
const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        await buildAdminJs(app);
        console.log('path----',Ticket.schema.path('seatNumbers'));
        app.listen({ port: PORT, host: '0.0.0.0' }, (error) => {
            if (error) {
                console.error('Error starting server:', error);
            } else {
                console.log(`Server is running on port http://localhost:${PORT}`);
            }
        });
    } catch (error) {
        console.error('Error loading routes:', error);
    }
};
start()