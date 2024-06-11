import express, { json, Request, Response , NextFunction} from 'express';
require('dotenv').config();
import cookieParser from 'cookie-parser';
const path = require('path');
import { resolve } from 'path';
import routes from './routes/router';
import axios from 'axios';
import prisma from './prismaClient';

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    // console.error(err.stack);
    res.status(500).send('Something went wrong!');
});


// Home route
app.get('/views', async (req, res) => {
    try {
        // Fetch data from your API
        const contacts = await prisma.contact.findMany();
        res.render('index', { contacts });
    } catch (error) {
        console.error('Error fetching data from API:', error);
        res.status(500).send('Internal Server Error');
    }
});


//Endpoints
app.use('/', routes);

export default app;