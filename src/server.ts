import express, { Application } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { Pool } from 'pg';
import bodyParser from 'body-parser';
import indexRoutes from './routes/indexRoutes';
import datatableRoutes from './routes/datatableRoutes';
import apiRoutes from './routes/apiRoutes';

import { auth } from 'express-openid-connect';

dotenv.config();

const port = process.env.PORT || 4080;

export const database:Pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
    ssl: true
});

const config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.AUTH_SECRET,
    baseURL: `http://localhost:${port}`,
    clientID:process.env.AUTH_CLIENT_ID,
    issuerBaseURL:process.env.AUTH_ISSUER_BASE_URL
}

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const app: Application = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(auth(config));

app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', indexRoutes.router);
app.use('/datatable', datatableRoutes.router);
app.use('/api', apiRoutes.router);

app.listen(port, () => {
    console.log(`Server running locally at localhost:${port}/`);
});