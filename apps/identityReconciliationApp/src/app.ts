import express, { json, Request, Response , NextFunction} from 'express';
require('dotenv').config();
import cookieParser from 'cookie-parser';
import { resolve } from 'path';
import routes from './routes/router';

const app = express();

app.set('view engine', 'ejs');
app.set('views', resolve('views'));
app.use(json());
app.use(cookieParser());

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    // console.error(err.stack);
    res.status(500).send('Something went wrong!');
});


//Endpoints
app.use('/', routes);
// app.use('/views');

export default app;