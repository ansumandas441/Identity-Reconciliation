import express, { json, Request, Response , NextFunction} from 'express';
import cookieParser from 'cookie-parser';
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const app = express();

export default app;