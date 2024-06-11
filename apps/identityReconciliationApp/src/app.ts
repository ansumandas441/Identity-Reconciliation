import express, { json, Request, Response , NextFunction} from 'express';
require('dotenv').config();
import routes from './routes/router';

const app = express();

app.use(json());

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    // console.error(err.stack);
    res.status(500).send('Something went wrong!');
});


//Endpoints for having identify and some supporting routes for testing
app.use('/', routes);

export default app;