import dotenv from 'dotenv';
dotenv.config();

interface Config {
    port: number
}

const config: Config = {
    port:parseInt(process.env.PORT || '8888', 10)
}

export default config;