/* eslint-disable @typescript-eslint/no-unused-vars -- Remove when used */
import 'dotenv/config';
import express from 'express';
import pg from 'pg';
import { errorMiddleware } from './lib/index';
import propertyRoutes from './routes/property-routes';
import transactionRoutes from './routes/transaction-routes';
import authRoutes from './auth-routes';
import propertyRentcastRoute from './routes/rentcast/property';
import valueRentcastRoute from './routes/rentcast/value';
import investmentRoutes from './routes/investment-routes';
import aiRoutes from './routes/ai-routes';

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const app = express();

// Create paths for static directories
const reactStaticDir = new URL('../client/dist', import.meta.url).pathname;
const uploadsStaticDir = new URL('public', import.meta.url).pathname;

app.use(express.static(reactStaticDir));
// Static directory for file uploads server/public/
app.use(express.static(uploadsStaticDir));
app.use(express.json());

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello, World!' });
});

// Property Routes
app.use('/api/properties', propertyRoutes);

// Transaction Routes
app.use('/api/transactions', transactionRoutes);

// Auth Routes
app.use('/api/auth', authRoutes);

// Investment Routes
app.use('/api/investments', investmentRoutes);

// AI Routes
app.use('/api/ai', aiRoutes);

// RentCast Routes
app.use('/api/rentcast/property', propertyRentcastRoute);
app.use('/api/rentcast/value', valueRentcastRoute);
app.get('/api/test', (req, res) => {
  console.log('Test endpoint hit!');
  res.json({ message: 'API test endpoint working' });
});

/*
 * Handles paths that aren't handled by any other route handler.
 * It responds with `index.html` to support page refreshes with React Router.
 * This must be the _last_ route, just before errorMiddleware.
 */
app.get('*', (req, res) => res.sendFile(`${reactStaticDir}/index.html`));

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  console.log('Listening on port', process.env.PORT);
});
