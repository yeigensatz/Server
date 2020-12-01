import 'dotenv/config';
import express, { json } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connect } from 'mongoose';

import FilesRouter from './routes/FilesRouter';

const app = express();
const PORT = process.env.PORT || 3000;

try {
    console.log(new Date().toLocaleString('en-US', {
        timeZone: 'America/New_York',
    }));

    const errors = [];
    const requiredEnvs = [
        'MONGO_URI',
        'BACKEND_URL',
        'FRONTEND_URL',
        'S3_SECRET_KEY',
        'S3_ACCESS_KEY_ID',
        'S3_ENDPOINT',
        'S3_BUCKET',
    ];

    for (const env of requiredEnvs) {
        if (!process.env.hasOwnProperty(env)) {
            errors.push(env);
        }
    }

    if (errors.length > 0) throw new Error(
        `${errors.join(', ')} ${errors.length > 1 ? 'are' : 'is'} required`
    );

    app.use(cors({
        credentials: true,
        origin: process.env.FRONTEND_URL,
    }));

    app.disable('x-powered-by');
    app.use(json());
    app.use(cookieParser());

    app.use('/files', FilesRouter);

    app.listen(PORT, () => {
        console.log(`Listening to port ${PORT}`);
    });

    connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    }, () => {
        console.log('Connected to MongoDB cluster');
    });
} catch (err) {
    throw new Error(err);
}
