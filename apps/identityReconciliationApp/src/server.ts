import config from './config';
import app from './app';

app.listen(config.port, () => console.log('listening to the port ', config.port));